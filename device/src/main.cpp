/*
 * SecurDoor Project – ESP-Based Security System
 * Copyright (c) 2024-2025 Deyan Nikolov & Hristiyan Dimitrov.
 * READ ME!
 *
 * This software is released under the GNU General Public License v3.0 (GPLv3).
 * In accordance with the applicable rules of academic competitions, technical olympiads,
 * and public exhibitions where this project may be presented, the source code is
 * made publicly available under the terms of the GPLv3.
 *
 * You may obtain a copy of the license at:
 * https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This software is free software: you can redistribute it and/or modify it under the terms
 * of the GNU General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * DISCLAIMER OF LIABILITY:
 * To the maximum extent permitted by applicable law, the authors, maintainers, contributors,
 * and distributors of this software shall not be held liable for any direct, indirect, incidental,
 * special, exemplary, or consequential damages (including, but not limited to, procurement of
 * substitute goods or services; loss of use, data, or profits; or business interruption) arising
 * in any way out of the use of, or inability to use, this software, even if advised of the possibility
 * of such damage. Use of this software is at the user's own risk.
 *
 * This software is not intended for use in safety-critical systems or environments where failure
 * could lead to significant injury, property damage, or environmental harm. Deployment of this
 * software in such contexts is strictly unauthorized and done at the user's sole responsibility.
 *
 * By using, modifying, or distributing this software, you agree to be bound by the terms of the
 * GNU General Public License and the foregoing disclaimer.
 */

#include "SecurDoor_Globals.hpp"
#include "SecurDoor_DeviceControl.hpp"
#include "SecurDoor_WiFi.hpp"
#include "SecurDoor_MessagingService.hpp"
#include "SecurDoor_RFIDService.hpp"
#include "SecurDoor_RemoteConnection.hpp"
#include "SecurDoor_TimeKeeping.hpp"
#include "SecurDoor_RSAKeys.hpp"
#include "global_servo.hpp"

using namespace SecurDoor;

DeviceController deviceController;
SecurDoorWiFi securDoorWiFi(webServer, deviceController.restartDevice);
MessagingService messagingService;
RFIDService rfidService;
RemoteConnection remoteConnection;
TimeKeeping timeKeepingService;
HardwareSerial FPserial(2);
Adafruit_Fingerprint finger(&FPserial);

unsigned long lastTimestamp = 0;
bool isLocked = false;
bool lastLockedState = false;
bool hasFingerprintSensor = false;
unsigned long lastCheck = 0;
unsigned long lastFetch = 0;
unsigned long lastHeartbeat = 0;
bool debugFreeze;
bool wasOpenWhenLocked = false;

void setup()
{
    Serial.begin(DeviceConfig::SERIAL_BAUD_RATE);
    while (!Serial)
    {
        delay(0);
    }

    logger.registerSerial(LoggingConfig::MYLOG, DEBUG, "SCDOOR", Serial, FLAG_SERVICE_LONG);
    logger.log(LoggingConfig::MYLOG, INFO, "SecurDoor Starting...");

    FPserial.begin(FingerprintConfig::FINGERPRINT_SENSOR_BAUD_RATE, SERIAL_8N1, FingerprintConfig::FINGERPRINT_SENSOR_RX_PIN, FingerprintConfig::FINGERPRINT_SENSOR_TX_PIN);
    delay(200);

    if (!finger.verifyPassword())
    {
        logger.log(LoggingConfig::MYLOG, WARNING, "Fingerprint sensor not found. Check wiring.");
        hasFingerprintSensor = false;
    }
    else
    {
        hasFingerprintSensor = true;
        finger.getTemplateCount();
        logger.log(LoggingConfig::MYLOG, INFO, String("Fingerprint sensor ready, " + String(finger.templateCount) + " templates stored.").c_str());
    }

    SPI.begin(RFIDConfig::SCK_PIN, RFIDConfig::MISO_PIN, RFIDConfig::MOSI_PIN, RFIDConfig::NSS_PIN);

    if (lcdDisplay.initialize())
    {
        logger.log(LoggingConfig::MYLOG, INFO, "LCD Display successfully initialized.");
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("SecurDoor");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Starting...");
    }
    else
    {
        logger.log(LoggingConfig::MYLOG, CRITICAL, "LCD init failed.");
    }

    pinMode(LEDConfig::BUILTIN_PIN, OUTPUT);
    pinMode(LEDConfig::RED_PIN, OUTPUT);
    pinMode(LEDConfig::BLUE_PIN, OUTPUT);
    pinMode(ServoConfig::SERVO_PIN, OUTPUT);

    if (BuzzerConfig::BUZZER_IS_PASSIVE)
    {
        ledcSetup(BuzzerConfig::PASSIVE_BUZZER_CHANNEL, BuzzerConfig::PASSIVE_BUZZER_FREQUENCY, 8);
        ledcAttachPin(BuzzerConfig::BUZZER_PIN, BuzzerConfig::PASSIVE_BUZZER_CHANNEL);
    }
    else
    {
        pinMode(BuzzerConfig::BUZZER_PIN, OUTPUT);
    }

    if (DeviceConfig::USE_DOOR_SWITCH)
    {
        pinMode(DoorSwitchConfig::DOOR_SWITCH_PIN, INPUT_PULLDOWN);
    }
    else
    {
        pinMode(SonicConfig::TRIG_PIN, OUTPUT);
        pinMode(SonicConfig::ECHO_PIN, INPUT);
    }

    servo.attach(ServoConfig::SERVO_PIN);

    messagingService.setDeviceKeys(RSAKeys::DEVICE_PRIVATE_KEY_PEM,
                                   RSAKeys::DEVICE_PUBLIC_KEY_PEM);
    timeKeepingService.setRemoteConnection(&remoteConnection);

    rfidService.setPins(
        RFIDConfig::RST_PIN,
        RFIDConfig::NSS_PIN,
        RFIDConfig::SCK_PIN,
        RFIDConfig::MISO_PIN,
        RFIDConfig::MOSI_PIN);

    rfidService.setPanicCallback(DeviceController::panic);

    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("Setting up...");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.print("Please wait...");
    securDoorWiFi.setupWiFi(deviceController);
    rfidService.begin();

    if (!timeKeepingService.fetchRemoteTimestamp())
    {
        logger.log(LoggingConfig::MYLOG, ERROR, "Failed to fetch remote timestamp.");
        deviceController.panic("Failed to fetch remote timestamp.");
    }

    lastTimestamp = timeKeepingService.getTimestamp();
    logger.log(LoggingConfig::MYLOG, INFO, String("Remote timestamp: " + String(lastTimestamp)).c_str());
    Serial.print("Remote timestamp: ");
    Serial.println(lastTimestamp);

    String headers2 = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

    JsonDocument doc2;
    doc2["publicKey"] = RSAKeys::DEVICE_PUBLIC_KEY_PEM;

    tuple<String, int> responseIntroduce2 = remoteConnection.sendHttpsRequest(APIConfig::API_SIGNED_DOMAIN, "/devices/introduce", false, "POST", headers2, doc2.as<String>());

    String responseIntroduce2Body = get<0>(responseIntroduce2);

    logger.log(LoggingConfig::MYLOG, INFO, String("Introduce response: " + responseIntroduce2Body).c_str());
    Serial.println(responseIntroduce2Body);

    // ---

    String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

    JsonDocument doc;
    doc["timestamp"] = timeKeepingService.getTimestamp();

    String signature = messagingService.signContent(doc.as<String>());
    logger.log(LoggingConfig::MYLOG, DEBUG, String("Signature: " + signature).c_str());

    headers += "X-Signature: " + signature + ";";

    logger.log(LoggingConfig::MYLOG, DEBUG, String("Request body: " + doc.as<String>()).c_str());

    tuple<String, int> responseIntroduce = remoteConnection.sendHttpsRequest(APIConfig::API_SIGNED_DOMAIN, "/devices/adopt", false, "POST", headers, doc.as<String>());

    String responseIntroduceBody = get<0>(responseIntroduce);

    logger.log(LoggingConfig::MYLOG, INFO, String("Test response: " + responseIntroduceBody).c_str());
    Serial.println(responseIntroduceBody);

    deviceController.setLED(2, true);

    if (hasFingerprintSensor)
    {
        deviceController.deleteRemovedFingerprints(finger, deviceController, remoteConnection, timeKeepingService, messagingService);
    }

    logger.log(LoggingConfig::MYLOG, INFO, "===================== SECURDOOR =====================");
    logger.log(LoggingConfig::MYLOG, INFO, "Setup procedure complete. Proceeding to main loop.");
    logger.log(LoggingConfig::MYLOG, INFO, "===================== SECURDOOR =====================");
}

void loop()
{
    if (Serial.available() > 0)
    {
        String input = Serial.readString();
        JsonDocument doc;
        DeserializationError err = deserializeJson(doc, input);
        if (err)
        {
            logger.log(LoggingConfig::MYLOG, ERROR, "Failed to parse serial input.");
            return;
        }

        if (doc["debug_command"].as<String>() == "panic")
        {
            deviceController.panic("Panic command received.");
        }

        if (doc["debug_command"].as<String>() == "enroll")
        {
            deviceController.buzzBuzzer(1, 300);
            deviceController.beginEnrollmentOfFingerprint(finger, deviceController, remoteConnection, timeKeepingService, messagingService);
        }

        if (doc["debug_command"].as<String>() == "restart")
        {
            deviceController.restartDevice();
        }

        if (doc["debug_command"].as<String>() == "unlock")
        {
            deviceController.setLocked(false, timeKeepingService.getTimestamp());
            deviceController.setLastLockedState(false);
            lcdDisplay.accessGrantedDisplay();
            deviceController.setLED(2, true);
            deviceController.buzzBuzzer(2, 150);
            delay(500);
            lcdDisplay.standbyDisplay();
        }

        if (doc["debug_command"].as<String>() == "lock")
        {
            deviceController.setLocked(true, timeKeepingService.getTimestamp());
            deviceController.setLastLockedState(true);
            lcdDisplay.accessGrantedDisplay();
            deviceController.setLED(1, true);
            deviceController.buzzBuzzer(2, 150);
            delay(500);
            lcdDisplay.standbyDisplay();
        }

        if (doc["debug_command"].as<String>() == "beep")
        {
            lcdDisplay.clear();
            lcdDisplay.setCursor(0, 0);
            lcdDisplay.print("|  SecurDoor   |");
            lcdDisplay.setCursor(0, 1);
            lcdDisplay.print(">     BEEP     <");
            deviceController.buzzBuzzer(1, 150);
            lcdDisplay.standbyDisplay();
        }

        if (doc["debug_command"].as<String>() == "freeze")
        {
            debugFreeze = !debugFreeze;

            if (debugFreeze)
            {
                lcdDisplay.clear();
                lcdDisplay.setCursor(0, 0);
                lcdDisplay.print("|  SecurDoor   |");
                lcdDisplay.setCursor(0, 1);
                lcdDisplay.print(">    DEBUG     <");
            }
        }
    }

    if (debugFreeze)
    {
        return;
    }

    deviceController.setLED(2, true);

    if (DeviceConfig::CONTINUOUSLY_CHECK_FOR_DOOR && DeviceConfig::USE_DOOR_SWITCH)
    {
        // if door is open when it should be closed, red led, alarm
        if (digitalRead(DoorSwitchConfig::DOOR_SWITCH_PIN) == LOW && deviceController.isLocked())
        {
            logger.log(LoggingConfig::MYLOG, WARNING, "Door is open when it should be closed.");
            lcdDisplay.clear();
            lcdDisplay.setCursor(0, 0);
            lcdDisplay.print("|  SecurDoor   |");
            lcdDisplay.setCursor(0, 1);
            lcdDisplay.print(">  DOOR OPEN! <");
            deviceController.setLED(1, true);
            servo.write(ServoConfig::SERVO_UNLOCK_ANGLE);
            wasOpenWhenLocked = true;
            deviceController.buzzBuzzer(2, 400);
            remoteConnection.sendHeartbeat(timeKeepingService, deviceController, messagingService, finger, remoteConnection);
            delay(500);
            return;
        }

        if (deviceController.isLocked() && wasOpenWhenLocked)
        {
            wasOpenWhenLocked = false;
            servo.write(ServoConfig::SERVO_LOCK_ANGLE);
        }
    }

    String uid = rfidService.readCardUID();
    if (uid.length() > 0)
    {
        deviceController.setLED(1, true);

        logger.log(LoggingConfig::MYLOG, INFO, String("Card UID: " + uid).c_str());
        lcdDisplay.readingDisplay();
        remoteConnection.authenticateCard(uid, deviceController, timeKeepingService, messagingService);

        deviceController.setLED(1, true);
        delay(500);
    }

    if (hasFingerprintSensor)
    {
        if (finger.getImage() == FINGERPRINT_OK)
        {
            logger.log(LoggingConfig::MYLOG, INFO, "Finger detected!");
            lcdDisplay.readingDisplay();
            deviceController.setLED(1, true);
            if (finger.image2Tz() != FINGERPRINT_OK)
            {
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 400);
                delay(500);
                lcdDisplay.standbyDisplay();
                deviceController.setLED(2, true);
            }
            if (finger.fingerFastSearch() != FINGERPRINT_OK)
            {
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 400);
                delay(500);
                lcdDisplay.standbyDisplay();
                deviceController.setLED(2, true);
                return;
            }
            else
            {
                logger.log(LoggingConfig::MYLOG, INFO, String("Match: ID " + String(finger.fingerID) + " confidence " + String(finger.confidence)).c_str());
                if (finger.confidence > FingerprintConfig::FINGERPRINT_SENSOR_MINIMUM_FINGERPRINT_SCORE)
                {
                    remoteConnection.authenticateFingerprint(finger.fingerID, deviceController, timeKeepingService, messagingService);
                }
                else
                {
                    lcdDisplay.accessDeniedDisplay();
                    deviceController.buzzBuzzer(2, 400);
                    delay(500);
                    lcdDisplay.standbyDisplay();
                    deviceController.setLED(2, true);
                }
            }
        }
    }

    remoteConnection.checkTimestamp(timeKeepingService, deviceController);
    remoteConnection.sendHeartbeat(timeKeepingService, deviceController, messagingService, finger, remoteConnection);
}
