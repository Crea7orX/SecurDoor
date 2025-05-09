#ifndef SECURDOOR_GLOBALS_HPP
#define SECURDOOR_GLOBALS_HPP

#include <Arduino.h>
#include <esp_system.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <WebServer.h>
#include <Preferences.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Crypto.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Elog.h>
#include <ESP32Servo.h>
#include <Adafruit_Fingerprint.h>
#include <global_servo.hpp>

namespace SecurDoor
{

    namespace DisplayConfig
    {
        constexpr uint8_t LCD_ADDR = 0x27;
        constexpr uint8_t LCD_COLS = 16;
        constexpr uint8_t LCD_ROWS = 2;
    }

    namespace LEDConfig
    {
        constexpr uint8_t BUILTIN_PIN = 2;
        constexpr uint8_t RED_PIN = 25;
        constexpr uint8_t BLUE_PIN = 26;
    }

    namespace BuzzerConfig
    {
        constexpr uint8_t BUZZER_PIN = 27;
        constexpr bool BUZZER_ON = true;
        constexpr bool BUZZER_IS_PASSIVE = true;
        constexpr uint16_t PASSIVE_BUZZER_FREQUENCY = 1000;
        constexpr uint8_t PASSIVE_BUZZER_CHANNEL = 8;
    }

    namespace DeviceConfig
    {
        constexpr size_t MIN_HEAP_SIZE_BYTES = 150 * 1024;
        constexpr uint32_t SERIAL_BAUD_RATE = 115200;
        constexpr bool USE_DOOR_SWITCH = true;
        constexpr bool CONTINUOUSLY_CHECK_FOR_DOOR = true;
    }

    namespace RFIDConfig
    {
        constexpr uint8_t RST_PIN = 22;
        constexpr uint8_t NSS_PIN = 21;
        constexpr uint8_t SCK_PIN = 14;
        constexpr uint8_t MISO_PIN = 19;
        constexpr uint8_t MOSI_PIN = 23;
    }

    namespace ServoConfig
    {
        constexpr uint8_t SERVO_PIN = 13;
        constexpr uint16_t SERVO_UNLOCK_ANGLE = 0;
        constexpr uint16_t SERVO_LOCK_ANGLE = 90;
    }

    namespace NetworkConfig
    {
        constexpr const char *root_ca_domain = "cacerts.digicert.com";
        constexpr const char *root_ca_path = "/DigiCertGlobalRootG2.crt.pem";
        constexpr uint8_t MAX_CERT_DOWNLOAD_RETRIES = 3;
        extern String test_root_ca;
    }

    namespace LoggingConfig
    {
        constexpr uint8_t MYLOG = 0;
    }

    namespace APIConfig
    {
        static const char *API_SIGNED_DOMAIN = "api-signed.securdoor.eu";
        static const char *API_DOMAIN = "api.securdoor.eu";

        static const char *API_HEARTBEAT_PATH = "/devices/heartbeat";
        static const char *API_INTRODUCE = "/devices/introduce";
        static const char *API_ADOPT = "/devices/adopt";
        static const char *API_CARD_AUTH = "/cards/authenticate";
        static const char *API_FINGERPRINT_ENROLL = "/biometrics";
        static const char *API_FINGERPRINT_AUTH = "/biometrics/authenticate";
        static const char *API_FINGERPRINT_KNOWN = "/devices/known_biometrics";
    }

    namespace TimekeepingConfig
    {
        static const char *TIME_API_DOMAIN = APIConfig::API_SIGNED_DOMAIN;
        static const char *TIME_API_PATH = "/timestamp";
    }

    namespace FingerprintConfig
    {
        static const char *FINGERPRINT_API_DOMAIN = APIConfig::API_SIGNED_DOMAIN;

        constexpr uint8_t FINGERPRINT_SENSOR_RX_PIN = 16;
        constexpr uint8_t FINGERPRINT_SENSOR_TX_PIN = 17;
        constexpr uint32_t FINGERPRINT_SENSOR_BAUD_RATE = 57600;
        constexpr uint8_t FINGERPRINT_SENSOR_MINIMUM_FINGERPRINT_SCORE = 100;
    }

    namespace SonicConfig
    {
        constexpr uint8_t TRIG_PIN = 5;
        constexpr uint8_t ECHO_PIN = 18;
    }

    namespace DoorSwitchConfig
    {
        constexpr uint8_t DOOR_SWITCH_PIN = 18;
        constexpr uint8_t DOOR_SWITCH_DEBOUNCE_MS = 50;
    }

    class WiFiManagerWrapper;
    class PreferencesWrapper;
    class LCDController;
    class WebServerHandler;

    extern WiFiManagerWrapper wifiManager;
    extern PreferencesWrapper preferences;
    extern LCDController lcdDisplay;
    extern WebServerHandler webServer;
    extern IPAddress localIPAddress;
}

namespace SecurDoor
{
    class WiFiManagerWrapper : public WiFiManager
    {
    public:
        WiFiManagerWrapper();
        ~WiFiManagerWrapper();
    };

    class PreferencesWrapper : public Preferences
    {
    public:
        PreferencesWrapper();
        ~PreferencesWrapper();
    };

    class WebServerHandler : public WebServer
    {
    public:
        WebServerHandler(uint16_t port = 80);
        ~WebServerHandler();
        void beginServer();
    };

    class LCDController : public LiquidCrystal_I2C
    {
    public:
        LCDController(uint8_t address, uint8_t cols, uint8_t rows);
        ~LCDController();
        bool initialize();
        void scrollText(String text, int row, int delayMs);
        void standbyDisplay();
        void busyDisplay();
        void accessGrantedDisplay();
        void accessDeniedDisplay();
        void emergencyDisplay(int code);
        void readingDisplay();
    };

    extern WiFiManagerWrapper wifiManager;
    extern PreferencesWrapper preferences;
    extern LCDController lcdDisplay;
    extern WebServerHandler webServer;
    extern IPAddress localIPAddress;
}

#endif
