#include "SecurDoor_WiFi.hpp"
#include "SecurDoor_Globals.hpp"
#include "SecurDoor_DeviceControl.hpp"

namespace SecurDoor {


    SecurDoorWiFi::SecurDoorWiFi(WebServerHandler &server, RestartCallback restartCallback)
        : server(server), restartCallback(restartCallback) {
    }

    void SecurDoorWiFi::setupWiFi(DeviceController &deviceController) {
        WiFi.mode(WIFI_STA);
        wm.setAPCallback(SecurDoorWiFi::configModeCallback);
        wm.setShowStaticFields(true);
        wm.setShowDnsFields(true);
        wm.setConnectTimeout(6);
        const char *message = String("SecurDoor | WiFiManager | Saved: " + wm.getWiFiIsSaved()).c_str();
        logger.log(LoggingConfig::MYLOG, INFO, message);
        bool res = wm.autoConnect("AutoConnectAP", "password");
        if (!res) {
            logger.log(LoggingConfig::MYLOG, EMERGENCY, "Failed to connect to WiFi and hit timeout");
            lcdDisplay.clear();
            lcdDisplay.setCursor(0, 0);
            lcdDisplay.print("WIFI FAILED");
            delay(3000);
            restartCallback();
        } else {
            logger.log(LoggingConfig::MYLOG, INFO, "Connected to WiFi");
            const char *macMessage = String("MAC Address: " + WiFi.macAddress()).c_str();
            const char *ipMessage = String("Local IP: " + WiFi.localIP().toString()).c_str();
            logger.log(LoggingConfig::MYLOG, INFO, macMessage);
            logger.log(LoggingConfig::MYLOG, INFO, ipMessage);
            server.begin();
            lcdDisplay.clear();
            lcdDisplay.setCursor(0, 0);
            lcdDisplay.print("WIFI");
            lcdDisplay.setCursor(0, 1);
            lcdDisplay.print("CONNECTED");
            
        }
        delay(500);
        lcdDisplay.standbyDisplay();
    }

    void SecurDoorWiFi::configModeCallback(WiFiManager *myWiFiManager) {
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("WIFI");

        String ip = WiFi.softAPIP().toString();
        String message = "CONFIG MODE | " + ip; 

        for (int i = 0; i < 2; i++) {
            lcdDisplay.scrollText(message, 1, 450); 
        }
    
        lcdDisplay.clear();
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("WIFI");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print(ip);
    }

}
