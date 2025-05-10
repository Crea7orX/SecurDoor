#include "SecurDoor_RemoteConnection.hpp"
#include "SecurDoor_Globals.hpp"
#include "SecurDoor_TimeKeeping.hpp"
#include "SecurDoor_DeviceControl.hpp"
#include "SecurDoor_MessagingService.hpp"
#include "SecurDoor_RSAKeys.hpp"

namespace SecurDoor
{
    RemoteConnection::RemoteConnection()
        : lastCheck(0),
          lastFetch(0),
          lastHeartbeat(0),
          localTimestamp(0)
    {
    }

    tuple<String, int> RemoteConnection::sendHttpsRequest(const String &host,
                                                          const String &path,
                                                          const bool &secure,
                                                          const String &method,
                                                          const String &headers,
                                                          const String &payload,
                                                          const bool &displayBusy)
    {
        HTTPClient http;
        String url = (secure ? "https://" : "http://") + host + path;
        logger.log(LoggingConfig::MYLOG, INFO, String("[HTTP] Request in progress: " + url).c_str());

        if (displayBusy)
        {
            lcdDisplay.busyDisplay();
        }

        if (secure)
        {
            http.begin(url, NetworkConfig::test_root_ca.c_str());
        }
        else
        {
            http.begin(url);
        }

        // Add headers if provided
        if (headers.length() > 0)
        {
            logger.log(LoggingConfig::MYLOG, DEBUG, String("[HTTP] Adding headers: " + headers).c_str());
            int index = 0;
            while (index < headers.length())
            {
                int nextIndex = headers.indexOf(";", index);
                if (nextIndex == -1)
                    nextIndex = headers.length();

                String header = headers.substring(index, nextIndex);
                int colonIndex = header.indexOf(":");
                if (colonIndex > 0)
                {
                    String headerName = header.substring(0, colonIndex);
                    String headerValue = header.substring(colonIndex + 1);
                    http.addHeader(headerName.c_str(), headerValue.c_str());
                }
                index = nextIndex + 1;
            }
        }

        logger.log(LoggingConfig::MYLOG, DEBUG, String("[HTTP] METHOD: " + method).c_str());
        int httpCode = 0;

        // Send the request based on method type
        if (method.equalsIgnoreCase("POST"))
        {
            httpCode = http.POST(payload);
        }
        else if (method.equalsIgnoreCase("PUT"))
        {
            httpCode = http.PUT(payload);
        }
        else if (method.equalsIgnoreCase("PATCH"))
        {
            httpCode = http.sendRequest("PATCH", payload);
        }
        else if (method.equalsIgnoreCase("DELETE"))
        {
            httpCode = http.sendRequest("DELETE", payload);
        }
        else
        {
            httpCode = http.GET();
        }

        logger.log(LoggingConfig::MYLOG, DEBUG, String("[HTTP] Response Code: " + String(httpCode)).c_str());

        String response = http.getString();
        logger.log(LoggingConfig::MYLOG, DEBUG, String("[HTTP] Response: " + response).c_str());
        http.end();

        if (displayBusy)
        {
            lcdDisplay.standbyDisplay();
        }

        return make_tuple(response, httpCode);
    }

    String RemoteConnection::downloadRootCertificate(const String &domain, const String &path)
    {
        HTTPClient http;
        String url = "http://" + domain + path; // Insecure HTTP
        logger.log(LoggingConfig::MYLOG, INFO, String("[HTTP] Downloading root certificate from: " + url).c_str());
        http.begin(url);

        int httpCode = http.GET();
        logger.log(LoggingConfig::MYLOG, DEBUG, String("[HTTP] Response Code: " + String(httpCode)).c_str());

        if (httpCode > 0)
        {
            if (httpCode == HTTP_CODE_OK)
            {
                String certResponse = http.getString();
                NetworkConfig::test_root_ca = certResponse;

                http.end();
                return String("Root certificate downloaded and stored.");
            }
            else
            {
                http.end();
                return String("Failed to download cert, HTTP code: ") + httpCode;
            }
        }
        else
        {
            http.end();
            return String("Connection failed: ") + http.errorToString(httpCode);
        }
    }

    //-----------------------------------------------------------------
    // checkTimestamp() - originally your first "if (millis() - lastCheck > 1000)" block
    //-----------------------------------------------------------------
    void RemoteConnection::checkTimestamp(TimeKeeping &timeKeepingService,
                                          DeviceController &deviceController)
    {

        if (firstRun)
        {
            localTimestamp = timeKeepingService.getTimestamp();
            firstRun = false;
        }
        if (millis() - lastCheck > 1000)
        {
            lastCheck = millis();
            localTimestamp++;
            lastFetch++;

            if (lastFetch > 30)
            {
                localTimestamp = timeKeepingService.getTimestamp();
                logger.log(LoggingConfig::MYLOG, INFO,
                           String("Remote timestamp: " + String(localTimestamp)).c_str());
                Serial.print("Remote timestamp: ");
                Serial.println(localTimestamp);
                lastFetch = 0;
            }

            timeKeepingService.setTimestamp(localTimestamp);

            logger.log(LoggingConfig::MYLOG, DEBUG,
                       String("Timestamp: " + String(localTimestamp)).c_str());
        }
    }

    //-----------------------------------------------------------------
    // sendHeartbeat() - originally "if (millis() - lastHeartbeat > 10000)" block
    //-----------------------------------------------------------------
    void RemoteConnection::sendHeartbeat(TimeKeeping &timeKeepingService,
                                         DeviceController &deviceController,
                                         MessagingService &messagingService,
                                         Adafruit_Fingerprint &fingerprintSensor,
                                         RemoteConnection &remoteConnection)
    {
        if (millis() - lastHeartbeat > 5000)
        {
            deviceController.setLED(1, true);
            lastHeartbeat = millis();

            // Build headers
            String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

            // Build JSON doc
            JsonDocument doc;
            doc["isLockedState"] = deviceController.isLocked();
            doc["timestamp"] = timeKeepingService.getTimestamp();
            if (DeviceConfig::USE_DOOR_SWITCH)
            {
                doc["doorState"] = deviceController.isDoorClosed();
            }

            // Sign the content
            String signature = messagingService.signContent(doc.as<String>());
            headers += "X-Signature: " + signature + ";";

            // Send the request
            tuple<String, int> responseHeartbeat = sendHttpsRequest(
                APIConfig::API_SIGNED_DOMAIN,
                APIConfig::API_HEARTBEAT_PATH,
                false,   // secure
                "PATCH", // method
                headers,
                doc.as<String>(),
                !deviceController.isEmergency());

            JsonDocument responseDoc;
            String responseHeartbeatString = get<0>(responseHeartbeat);
            DeserializationError err = deserializeJson(responseDoc, responseHeartbeatString);

            if (err)
            {
                logger.log(LoggingConfig::MYLOG, ERROR, "Failed to parse heartbeat response.");
                Serial.println("Failed to parse heartbeat response.");
                deviceController.setLED(1, true);
                delay(1000);
            }
            else
            {

                unsigned long newTs = responseDoc["timestamp"].as<unsigned long>();
                if (newTs <= 0)
                    return;
                if (newTs != timeKeepingService.getTimestamp())
                {
                    timeKeepingService.setTimestamp(newTs);
                    localTimestamp = timeKeepingService.getTimestamp();
                    lastFetch = 0; // reset so we won't fetch again immediately
                    logger.log(LoggingConfig::MYLOG, INFO,
                               String("Timestamp updated to: " + String(localTimestamp)).c_str());
                }

                if (responseDoc["emergencyState"].as<string>().length() > 0 && responseDoc["emergencyState"].as<string>() != "null")
                {
                    logger.log(LoggingConfig::MYLOG, ERROR,
                               String("Emergency state: " + responseDoc["emergencyState"].as<String>()).c_str());
                    deviceController.setLED(1, true);
                    if (responseDoc["emergencyState"].as<string>() == "evacuation")
                    {
                        lcdDisplay.emergencyDisplay(1);
                        deviceController.setEmergencyCode(1);
                        deviceController.setLocked(false, timeKeepingService.getTimestamp());
                        deviceController.setLastLockedState(false);
                        if (!deviceController.isEmergencyBeeped())
                        {
                            deviceController.buzzBuzzer(10, 100);
                        }
                        deviceController.setEmergency(true);
                        deviceController.setDashboardOverride(true);
                    }
                    else if (responseDoc["emergencyState"].as<string>() == "lockdown")
                    {
                        lcdDisplay.emergencyDisplay(2);
                        deviceController.setEmergencyCode(2);
                        deviceController.setLocked(true, timeKeepingService.getTimestamp());
                        deviceController.setLastLockedState(true);
                        if (!deviceController.isEmergencyBeeped())
                        {
                            deviceController.buzzBuzzer(10, 100);
                        }
                        deviceController.setEmergency(true);
                        deviceController.setDashboardOverride(true);
                    }
                    delay(1000);
                    return;
                }
                else
                {
                    if (deviceController.isEmergency())
                    {
                        deviceController.setEmergency(false);
                    }
                }

                if (responseDoc["isLocked"].as<bool>())
                {
                    logger.log(LoggingConfig::MYLOG, INFO, "Device is locked.");
                    deviceController.setLocked(true, timeKeepingService.getTimestamp());

                    // If lock state changed, reset lastHeartbeat
                    if (deviceController.isLocked() != deviceController.lastLockedState())
                    {
                        lastHeartbeat = 0;
                        deviceController.setLastLockedState(true);
                        deviceController.setDashboardOverride(true);
                        deviceController.buzzBuzzer(2, 150);
                        delay(1000);
                        if (!deviceController.isEmergency())
                            lcdDisplay.standbyDisplay();
                    }
                }
                else
                {
                    logger.log(LoggingConfig::MYLOG, INFO, "Device is unlocked.");
                    deviceController.setLocked(false, timeKeepingService.getTimestamp());

                    if (deviceController.isLocked() != deviceController.lastLockedState())
                    {
                        lastHeartbeat = 0;
                        deviceController.setLastLockedState(false);
                        deviceController.setDashboardOverride(true);
                        deviceController.buzzBuzzer(2, 150);
                        delay(1000);
                        if (!deviceController.isEmergency())
                            lcdDisplay.standbyDisplay();
                    }
                }

                if (responseDoc["pendingCommand"].as<String>().length() > 0 && responseDoc["pendingCommand"].as<String>() != "null")
                {
                    String command = responseDoc["pendingCommand"].as<String>();
                    if (command == "restart")
                    {
                        logger.log(LoggingConfig::MYLOG, INFO, "Restart command received. Processing...");
                        deviceController.setLED(1, true);
                        lcdDisplay.clear();
                        lcdDisplay.setCursor(0, 0);
                        lcdDisplay.print("|  SecurDoor   |");
                        lcdDisplay.setCursor(0, 1);
                        lcdDisplay.print("> RESTARTING... <");
                        deviceController.restartDevice();
                    }
                    else if (command == "register_biometric")
                    {
                        logger.log(LoggingConfig::MYLOG, INFO, "Register biometric command received. Processing...");
                        deviceController.beginEnrollmentOfFingerprint(fingerprintSensor, deviceController, remoteConnection, timeKeepingService, messagingService);
                    }
                }
            }

            String responseHeartbeatString2 = get<0>(responseHeartbeat);

            logger.log(LoggingConfig::MYLOG, INFO,
                       String("Heartbeat response: " + responseHeartbeatString2).c_str());
            Serial.println(responseHeartbeatString2);
        }
    }

    void RemoteConnection::enrollFingerprintToServer(int fingerID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService)
    {
        String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

        JsonDocument doc;
        doc["biometricId"] = fingerID;
        doc["timestamp"] = timeKeepingService.getTimestamp();

        // Sign the content
        String signature = messagingService.signContent(doc.as<String>());
        headers += "X-Signature: " + signature + ";";

        // Send the request
        tuple<String, int> responseEnroll = sendHttpsRequest(
            APIConfig::API_SIGNED_DOMAIN,
            APIConfig::API_FINGERPRINT_ENROLL,
            false,
            "POST",
            headers,
            doc.as<String>(),
            false);

        String responseEnrollString = get<0>(responseEnroll);

        logger.log(LoggingConfig::MYLOG, INFO,
                   String("Enroll response: " + responseEnrollString).c_str());
        Serial.println(responseEnrollString);
    }

    void RemoteConnection::authenticateFingerprint(int fingerID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService)
    {

        if (deviceController.isEmergency())
        {
            lcdDisplay.accessDeniedDisplay();
            deviceController.buzzBuzzer(2, 400);
            delay(1000);
            return;
        }

        String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

        JsonDocument doc;
        doc["biometricId"] = fingerID;
        doc["timestamp"] = timeKeepingService.getTimestamp();

        String signature = messagingService.signContent(doc.as<String>());
        headers += "X-Signature: " + signature + ";";

        tuple<String, int> responseAuth = sendHttpsRequest(
            APIConfig::API_SIGNED_DOMAIN,
            APIConfig::API_FINGERPRINT_AUTH,
            false,
            "POST",
            headers,
            doc.as<String>(),
            false);

        // Parse response
        JsonDocument responseDoc;
        String responseAuthString = get<0>(responseAuth);
        DeserializationError err = deserializeJson(responseDoc, responseAuthString);

        int httpCode = get<1>(responseAuth);

        if (err)
        {
            logger.log(LoggingConfig::MYLOG, ERROR, "Failed to parse fingerprint auth response.");
            Serial.println("Failed to parse fingerprint auth response.");
            lcdDisplay.accessDeniedDisplay();
            deviceController.setLED(1, true);
            deviceController.buzzBuzzer(2, 600);
            delay(1000);
        }
        else
        {
            if (httpCode == 403)
            {
                logger.log(LoggingConfig::MYLOG, ERROR, "Unauthorized access attempt.");
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 600);
                delay(1000);
                return;
            }

            if (responseDoc["isLocked"].as<bool>())
            {
                logger.log(LoggingConfig::MYLOG, INFO, "Device is locked.");
                deviceController.setLocked(true, timeKeepingService.getTimestamp());
                deviceController.setLastLockedState(true);
                deviceController.setDashboardOverride(false);
                deviceController.buzzBuzzer(2, 150);
                delay(500);
                if (deviceController.isEmergency())
                {
                    lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                }
                else
                {
                    lcdDisplay.standbyDisplay();
                }
            }
            else
            {
                logger.log(LoggingConfig::MYLOG, INFO, "Device is unlocked.");
                deviceController.setLocked(false, timeKeepingService.getTimestamp());
                deviceController.setLastLockedState(false);

                deviceController.buzzBuzzer(2, 150);
                delay(500);
                if (deviceController.isEmergency())
                {
                    lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                }
                else
                {
                    lcdDisplay.standbyDisplay();
                }
            }
        }
    }

    void RemoteConnection::authenticateCard(const String &cardUID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService)
    {
        if (deviceController.isEmergency())
        {
            deviceController.setLED(1, true);
            lcdDisplay.accessDeniedDisplay();
            deviceController.buzzBuzzer(2, 400);
            delay(1000);
            return;
        }
        else
        {
            deviceController.buzzBuzzer(1, 100);
        }

        // Build headers
        String headers = "X-Serial-ID: " + String(RSAKeys::DEVICE_UNIQUE_ID) + ";";

        // Build JSON doc
        JsonDocument doc;
        doc["fingerprint"] = cardUID;
        doc["timestamp"] = timeKeepingService.getTimestamp();

        // Sign the content
        String signature = messagingService.signContent(doc.as<String>());
        headers += "X-Signature: " + signature + ";";

        // Send the request
        tuple<String, int> responseAuth = sendHttpsRequest(
            APIConfig::API_SIGNED_DOMAIN,
            APIConfig::API_CARD_AUTH,
            false,
            "POST",
            headers,
            doc.as<String>(),
            false);

        // Parse response
        JsonDocument responseDoc;
        String responseAuthString = get<0>(responseAuth);
        DeserializationError err = deserializeJson(responseDoc, responseAuthString);

        if (err)
        {
            logger.log(LoggingConfig::MYLOG, ERROR, "Failed to parse card auth response.");
            Serial.println("Failed to parse card auth response.");
            lcdDisplay.accessDeniedDisplay();
            deviceController.setLED(1, true);
            deviceController.buzzBuzzer(2, 600);
            delay(1000);
        }
        else
        {

            if (get<1>(responseAuth) == 403)
            {
                logger.log(LoggingConfig::MYLOG, ERROR, "Unauthorized access attempt.");
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 600);
                delay(1000);
                return;
            }

            unsigned long newTs = responseDoc["timestamp"].as<unsigned long>();
            if (newTs <= 0)
                return;
            if (newTs != localTimestamp)
            {
                localTimestamp = newTs;
                logger.log(LoggingConfig::MYLOG, INFO,
                           String("Timestamp updated to: " + String(localTimestamp)).c_str());
            }

            if (responseDoc["emergencyState"].as<string>().length() > 0 && responseDoc["emergencyState"].as<string>() != "null")
            {
                deviceController.setLED(1, true);
                deviceController.setDashboardOverride(false);
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                return;
            }
            if (responseDoc["error"].as<string>().length() > 0 && responseDoc["error"].as<string>() != "null")
            {
                logger.log(LoggingConfig::MYLOG, ERROR,
                           String("Card Auth Error: " + responseDoc["error"].as<String>()).c_str());
                deviceController.setLED(1, true);
                deviceController.setDashboardOverride(false);
                lcdDisplay.accessDeniedDisplay();
                deviceController.buzzBuzzer(2, 400);
                delay(1000);
                if (deviceController.isEmergency())
                {
                    lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                }
                else
                {
                    lcdDisplay.standbyDisplay();
                }
                return;
            }
            lcdDisplay.accessGrantedDisplay();
            if (responseDoc["isLocked"].as<bool>())
            {
                logger.log(LoggingConfig::MYLOG, INFO, "Device is locked.");
                deviceController.setLocked(true, timeKeepingService.getTimestamp());
                deviceController.setLastLockedState(true);
                deviceController.setDashboardOverride(false);
                deviceController.buzzBuzzer(2, 150);
                delay(500);
                if (deviceController.isEmergency())
                {
                    lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                }
                else
                {
                    lcdDisplay.standbyDisplay();
                }
            }
            else
            {
                logger.log(LoggingConfig::MYLOG, INFO, "Device is unlocked.");
                deviceController.setLocked(false, timeKeepingService.getTimestamp());
                deviceController.setLastLockedState(false);

                deviceController.buzzBuzzer(2, 150);
                delay(500);
                if (deviceController.isEmergency())
                {
                    lcdDisplay.emergencyDisplay(deviceController.getEmergencyCode());
                }
                else
                {
                    lcdDisplay.standbyDisplay();
                }
            }

            logger.log(LoggingConfig::MYLOG, INFO,
                       String("Card Auth Success").c_str());
            if (responseDoc["holder"].as<String>().length() > 0)
            {
                logger.log(LoggingConfig::MYLOG, INFO,
                           String("Card holder: " + responseDoc["holder"].as<String>()).c_str());
            }

            if (responseDoc["reLockDelay"].as<String>().length() > 0)
            {
                unsigned long delay = responseDoc["reLockDelay"].as<unsigned long>();
                deviceController.setRelockDelay(delay);
                logger.log(LoggingConfig::MYLOG, INFO,
                           String("Relock delay: " + String(delay)).c_str());
            }
        }

        String responseAuthString2 = get<0>(responseAuth);

        logger.log(LoggingConfig::MYLOG, INFO,
                   String("Card auth response: " + responseAuthString2).c_str());
        Serial.println(responseAuthString2);
    }
}
