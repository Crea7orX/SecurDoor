#include "SecurDoor_DeviceControl.hpp"
#include "SecurDoor_Globals.hpp" // for logger, etc.
#include "SecurDoor_TimeKeeping.hpp"
#include "SecurDoor_RemoteConnection.hpp"
#include "SecurDoor_MessagingService.hpp"
#include "SecurDoor_RSAKeys.hpp"

namespace SecurDoor {

DeviceController::DeviceController()
  :
    m_isLocked(false),
    m_lastLockedState(false)
{
}

void DeviceController::restartDevice() {
    delay(1000);
    ESP.restart();
}

void DeviceController::panic(const String &message) {
    pinMode(2, OUTPUT);

    logger.log(LoggingConfig::MYLOG, CRITICAL, "================= PANIC =================");
    logger.log(LoggingConfig::MYLOG, CRITICAL, message.c_str());
    logger.log(LoggingConfig::MYLOG, CRITICAL, "SYSTEM HALTING.");
    logger.log(LoggingConfig::MYLOG, CRITICAL, "================= PANIC =================");

    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("PANIC");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.scrollText(message, 1, 500);

    // rgbBlink(200, 0, 0, 0, 150, true); // infinite blink
}

void DeviceController::setLED(int led, bool state) {
    if (led == 0) {
        digitalWrite(LEDConfig::BUILTIN_PIN, state ? HIGH : LOW);
    } else if (led == 1) {
        digitalWrite(LEDConfig::RED_PIN, state ? HIGH : LOW);
        digitalWrite(LEDConfig::BLUE_PIN, LOW);
    } else if (led == 2) {
        digitalWrite(LEDConfig::BLUE_PIN, state ? HIGH : LOW);
        digitalWrite(LEDConfig::RED_PIN, LOW);
    }
}

// void DeviceController::rgbLed(uint8_t red, uint8_t green, uint8_t blue, bool state, bool blinkBuiltIn) {
//     if (state) {
//         analogWrite(LEDConfig::RED_PIN, red);
//         analogWrite(LEDConfig::GREEN_PIN, green);
//         analogWrite(LEDConfig::BLUE_PIN, blue);
//         if (blinkBuiltIn) {
//             digitalWrite(LEDConfig::BUILTIN_PIN, HIGH);
//         }
//     } else {
//         analogWrite(LEDConfig::RED_PIN, 0);
//         analogWrite(LEDConfig::GREEN_PIN, 0);
//         analogWrite(LEDConfig::BLUE_PIN, 0);
//         if (blinkBuiltIn) {
//             digitalWrite(LEDConfig::BUILTIN_PIN, LOW);
//         }
//     }
// }

// void DeviceController::rgbBlink(uint8_t red, uint8_t green, uint8_t blue, int times, int delayMs, bool blinkBuiltIn) {
//     if (times < 0) return;
//     if (times == 0) {
//         // infinite loop
//         for (;;) {
//             rgbLed(red, green, blue, true, blinkBuiltIn);
//             delay(delayMs);
//             rgbLed(0, 0, 0, false, blinkBuiltIn);
//             delay(delayMs);
//         }
//     } else {
//         for (int i = 0; i < times; i++) {
//             rgbLed(red, green, blue, true, blinkBuiltIn);
//             delay(delayMs);
//             rgbLed(0, 0, 0, false, blinkBuiltIn);
//             delay(delayMs);
//         }
//     }
// }

void DeviceController::buzzBuzzer(int times, int delayMs) {
    if (!BuzzerConfig::BUZZER_ON) return;
    if (times < 0) return;

    if (BuzzerConfig::BUZZER_IS_PASSIVE) {
        if (times == 0) {
            for (;;) {
                ledcWriteTone(BuzzerConfig::PASSIVE_BUZZER_CHANNEL, BuzzerConfig::PASSIVE_BUZZER_FREQUENCY);
                delay(delayMs);
                ledcWriteTone(BuzzerConfig::PASSIVE_BUZZER_CHANNEL, 0);
                delay(delayMs);
            }
        } else {
            for (int i = 0; i < times; i++) {
                ledcWriteTone(BuzzerConfig::PASSIVE_BUZZER_CHANNEL, BuzzerConfig::PASSIVE_BUZZER_FREQUENCY);
                delay(delayMs);
                ledcWriteTone(BuzzerConfig::PASSIVE_BUZZER_CHANNEL, 0);
                delay(delayMs);
            }
        }
    } else {
        if (times == 0) {
            for (;;) {
                digitalWrite(BuzzerConfig::BUZZER_PIN, HIGH);
                delay(delayMs);
                digitalWrite(BuzzerConfig::BUZZER_PIN, LOW);
                delay(delayMs);
            }
        } else {
            for (int i = 0; i < times; i++) {
                digitalWrite(BuzzerConfig::BUZZER_PIN, HIGH);
                delay(delayMs);
                digitalWrite(BuzzerConfig::BUZZER_PIN, LOW);
                delay(delayMs);
            }
        }
    }
}

void DeviceController::beginEnrollmentOfFingerprint(Adafruit_Fingerprint &finger, DeviceController &deviceController, RemoteConnection &remoteConnection, TimeKeeping &timeKeeping, MessagingService &messagingService) {
    finger.LEDcontrol(false);
    deviceController.deleteRemovedFingerprints(finger, deviceController, remoteConnection, timeKeeping, messagingService);

    finger.getTemplateCount();
    uint16_t id = 1;
    while (id <= finger.capacity && finger.loadModel(id) == FINGERPRINT_OK) id++;
    if (id > finger.capacity) {
        Serial.println(F("Database full"));
        lcdDisplay.standbyDisplay();
        return;
    }

    finger.LEDcontrol(true);
    deviceController.buzzBuzzer(2, 150);
    logger.log(LoggingConfig::MYLOG, INFO, "Enrolling finger as ID %u", id);

    logger.log(LoggingConfig::MYLOG, INFO, "Place finger…");
    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("|  SecurDoor   |");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.print("Place finger...");
    {
        unsigned long startTime = millis();
        while (finger.getImage() != FINGERPRINT_OK) {
            if (millis() - startTime > 10000) {
                finger.LEDcontrol(false);
                logger.log(LoggingConfig::MYLOG, INFO, "Timeout");
                lcdDisplay.clear();
                lcdDisplay.setCursor(0, 0);
                lcdDisplay.print("|  SecurDoor   |");
                lcdDisplay.setCursor(0, 1);
                lcdDisplay.print("Timeout");
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                lcdDisplay.standbyDisplay();
                finger.LEDcontrol(true);
                return;
            }
        }
    }
    if (finger.image2Tz(1) != FINGERPRINT_OK) {
        logger.log(LoggingConfig::MYLOG, INFO, "Image fail");
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Image fail!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        finger.LEDcontrol(true);
        return;
    }

    // turn off fingerprint LED
    finger.LEDcontrol(false);
    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("|  SecurDoor   |");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.print("Remove finger");
    deviceController.buzzBuzzer(1, 300);
    delay(800);
    logger.log(LoggingConfig::MYLOG, INFO, "Remove finger");
    {
        unsigned long startTime = millis();
        while (finger.getImage() != FINGERPRINT_NOFINGER) {
            if (millis() - startTime > 10000) {
                finger.LEDcontrol(false);
                logger.log(LoggingConfig::MYLOG, INFO, "Timeout");
                lcdDisplay.clear();
                lcdDisplay.setCursor(0, 0);
                lcdDisplay.print("|  SecurDoor   |");
                lcdDisplay.setCursor(0, 1);
                lcdDisplay.print("Timeout");
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                lcdDisplay.standbyDisplay();
                finger.LEDcontrol(true);
                return;
            }
        }
    }

    finger.LEDcontrol(true);
    deviceController.buzzBuzzer(1, 300);
    logger.log(LoggingConfig::MYLOG, INFO, "Place same finger again");
    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("|  SecurDoor   |");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.print("Place finger");
    {
        unsigned long startTime = millis();
        while (finger.getImage() != FINGERPRINT_OK) {
            if (millis() - startTime > 10000) {
                finger.LEDcontrol(false);
                logger.log(LoggingConfig::MYLOG, INFO, "Timeout");
                lcdDisplay.clear();
                lcdDisplay.setCursor(0, 0);
                lcdDisplay.print("|  SecurDoor   |");
                lcdDisplay.setCursor(0, 1);
                lcdDisplay.print("Timeout");
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                lcdDisplay.standbyDisplay();
                finger.LEDcontrol(true);
                return;
            }
        }
    }
    if (finger.image2Tz(2) != FINGERPRINT_OK) {
        finger.LEDcontrol(false);
        logger.log(LoggingConfig::MYLOG, INFO, "Image fail");
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Image fail!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        finger.LEDcontrol(true);
        return;
    }

    if (finger.createModel() != FINGERPRINT_OK) {
        finger.LEDcontrol(false);
        logger.log(LoggingConfig::MYLOG, INFO, "Create fail");
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Create fail!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        finger.LEDcontrol(true);
        return;
    }
    if (finger.storeModel(id) != FINGERPRINT_OK) {
        finger.LEDcontrol(false);
        logger.log(LoggingConfig::MYLOG, INFO, "Store fail");
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Store fail!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        finger.LEDcontrol(true);
        return;
    }
    finger.LEDcontrol(false);

    deviceController.buzzBuzzer(2, 200);
    lcdDisplay.clear();
    lcdDisplay.setCursor(0, 0);
    lcdDisplay.print("|  SecurDoor   |");
    lcdDisplay.setCursor(0, 1);
    lcdDisplay.print("Finger success!");
    logger.log(LoggingConfig::MYLOG, INFO, "Finger success!");

    remoteConnection.enrollFingerprintToServer(id, deviceController, timeKeeping, messagingService);

    delay(1000);
    finger.LEDcontrol(true);
    lcdDisplay.standbyDisplay();
}

void DeviceController::deleteRemovedFingerprints(Adafruit_Fingerprint &finger, DeviceController &deviceController, RemoteConnection &remoteConnection, TimeKeeping &timeKeeping, MessagingService &messagingService) {
    logger.log(LoggingConfig::MYLOG, INFO, "Fingerprint sensor found. Deleting removed fingerprints.");
    lcdDisplay.busyDisplay();

    JsonDocument doc;
    String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

    doc["timestamp"] = timeKeeping.getTimestamp();
    
    String signature = messagingService.signContent(doc.as<String>());
    headers += "X-Signature: " + signature + ";";
    
    tuple<String, int> knownFingerprintsResponse = remoteConnection.sendHttpsRequest(
        APIConfig::API_SIGNED_DOMAIN,
        APIConfig::API_FINGERPRINT_KNOWN,
        false,
        "POST",
        headers,
        doc.as<String>(),
        false
    );

    String responseEnrollString = get<0>(knownFingerprintsResponse);
    int responseEnrollCode = get<1>(knownFingerprintsResponse);
    logger.log(LoggingConfig::MYLOG, INFO, "Response code: %d", responseEnrollCode);
    logger.log(LoggingConfig::MYLOG, INFO, "Response: %s", responseEnrollString.c_str());

    if (responseEnrollCode != 200) {
        logger.log(LoggingConfig::MYLOG, INFO, "Error: %d", responseEnrollCode);
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Error!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        return;
    }

    JsonDocument responseDoc;
    DeserializationError error = deserializeJson(responseDoc, responseEnrollString);

    if (error) {
        logger.log(LoggingConfig::MYLOG, INFO, "Error: %s", error.c_str());
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("Error!");
        deviceController.buzzBuzzer(2, 400);
        delay(1000);
        lcdDisplay.standbyDisplay();
        return;
    }

    JsonArray knownBiometricIds = responseDoc["knownBiometricIds"];
    if (knownBiometricIds.size() == 0) {
        lcdDisplay.standbyDisplay();
        return;
    }

    uint16_t id = 1;
    while (id <= finger.capacity && finger.loadModel(id) == FINGERPRINT_OK) {
        bool found = false;
        for (JsonVariant idVariant : knownBiometricIds) {
            if (id == idVariant.as<uint16_t>()) {
                found = true;
                break;
            }
        }
        if (!found) {
            logger.log(LoggingConfig::MYLOG, INFO, "Deleting fingerprint with ID %u", id);
            if (finger.deleteModel(id) != FINGERPRINT_OK) {
                logger.log(LoggingConfig::MYLOG, INFO, "Delete fail");
                lcdDisplay.clear();
                lcdDisplay.setCursor(0, 0);
                lcdDisplay.print("|  SecurDoor   |");
                lcdDisplay.setCursor(0, 1);
                lcdDisplay.print("Delete fail!");
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                lcdDisplay.standbyDisplay();
                return;
            }
        }
        id++;
    }
}


void DeviceController::lockDoor()
{
    logger.log(LoggingConfig::MYLOG, INFO, "Locking door.");
    if (!isDoorClosed()) {
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("DOOR NOT CLOSED!");
        logger.log(LoggingConfig::MYLOG, INFO, "Door is not closed. Waiting for door to close before locking.");
        unsigned long startTime = millis();
        unsigned long lastBeep  = startTime;

        while (!isDoorClosed()) {
            if (millis() - lastBeep >= 1000) {
                buzzBuzzer(1, 300);
                lastBeep = millis(); 
            }

            if (millis() - startTime >= 10000) {
                break;
            }

            delay(500);
        }
    }

    logger.log(LoggingConfig::MYLOG, INFO, "Door is closed. Locking door.");
    delay(1500);
    servo.write(ServoConfig::SERVO_LOCK_ANGLE);
}

void DeviceController::unlockDoor()
{
    servo.write(ServoConfig::SERVO_UNLOCK_ANGLE);
}

//---------------------------------
// Lock state accessors
//---------------------------------
bool DeviceController::isLocked() const {
    return m_isLocked;
}

void DeviceController::setLocked(bool locked, int timestamp) {
    m_isLocked = locked;
    m_lastLockedStateChange = timestamp;
}

bool DeviceController::isDoorClosed() {
    if (DeviceConfig::USE_DOOR_SWITCH) {
        // if (digitalRead(DoorSwitchConfig::DOOR_SWITCH_PIN) == HIGH) {
        //     return true;
        // } else {
        //     return false;
        // }
        return digitalRead(DoorSwitchConfig::DOOR_SWITCH_PIN) == HIGH;
    } else {
        digitalWrite(SonicConfig::TRIG_PIN, LOW);
        delayMicroseconds(2);
        digitalWrite(SonicConfig::TRIG_PIN, HIGH);
        delayMicroseconds(10);
        digitalWrite(SonicConfig::TRIG_PIN, LOW);
    
        long duration = pulseIn(SonicConfig::ECHO_PIN, HIGH, 30000UL);
    
        if (duration <= 0) {
            return false;
        }
    
        long distance = duration * 0.034 / 2;
    
        logger.log(LoggingConfig::MYLOG, DEBUG, String("Distance: " + String(distance) + " cm").c_str());
    
        return (distance < 5);
    }



    return false;
}



unsigned long DeviceController::getLastLockedStateChange() const {
    return m_lastLockedStateChange;
}

bool DeviceController::lastLockedState() const {
    return m_lastLockedState;
}

void DeviceController::setLastLockedState(bool locked) {
    m_lastLockedState = locked;
    if (locked) {
        lockDoor();
    } else {
        unlockDoor();
    }
}

bool DeviceController::isEmergency() const {
    return m_emergency;
}

void DeviceController::setEmergency(bool emergency) {
    m_emergency = emergency;
    m_emergency_beeped = emergency;
}

bool DeviceController::isEmergencyBeeped() const {
    return m_emergency_beeped;
}

void DeviceController::setRelockDelay(unsigned long delay) {
    m_relockDelay = delay;
}

unsigned long DeviceController::getRelockDelay() const {
    return m_relockDelay;
}

void DeviceController::setDashboardOverride(bool override) {
    dashboardOverride = override;
}

bool DeviceController::getDashboardOverride() const {
    return dashboardOverride;
}

void DeviceController::setEmergencyCode(unsigned long code) {
    lastEmergencyCode = code;
}

unsigned long DeviceController::getEmergencyCode() const {
    return lastEmergencyCode;
}

}



// namespace SecurDoor
