#include "SecurDoor_Globals.hpp"

namespace SecurDoor
{

    WiFiManagerWrapper wifiManager;
    PreferencesWrapper preferences;
    LCDController lcdDisplay(DisplayConfig::LCD_ADDR, DisplayConfig::LCD_COLS, DisplayConfig::LCD_ROWS);
    WebServerHandler webServer;
    IPAddress localIPAddress;
    Servo servo;

    WiFiManagerWrapper::WiFiManagerWrapper() : WiFiManager() {}
    WiFiManagerWrapper::~WiFiManagerWrapper() {}

    PreferencesWrapper::PreferencesWrapper() : Preferences() {}
    PreferencesWrapper::~PreferencesWrapper() {}

    LCDController::LCDController(uint8_t address, uint8_t cols, uint8_t rows)
        : LiquidCrystal_I2C(address, cols, rows) {}
    LCDController::~LCDController() {}

    bool LCDController::initialize()
    {
        init();
        backlight();
        return true;
    }

    void LCDController::scrollText(String text, int row, int delayMs)
    {
        text = " " + text + " "; // Add spaces for smooth looping
        int len = text.length();

        for (int i = 0; i < len - 15; i++)
        { // 16-char LCD, so scrollable part
            lcdDisplay.setCursor(0, row);
            lcdDisplay.print(text.substring(i, i + 16)); // Print 16 characters at a time
            delay(delayMs);
        }
    }

    void LCDController::standbyDisplay()
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print(">   STANDBY    <");
    }

    void LCDController::busyDisplay()
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print(">     BUSY     <");
    }
    void LCDController::accessGrantedDisplay()
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print(">   GRANTED    <");
    }

    void LCDController::accessDeniedDisplay()
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print(">    DENIED    <");
    }

    void LCDController::emergencyDisplay(int code)
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print(">  EMERGENCY!  <");
        lcdDisplay.setCursor(0, 1);
        if (code == 0)
        {
            lcdDisplay.print(">  UNKNOWN   <");
        }
        else if (code == 1)
        {
            lcdDisplay.print("!> EVACUATION <!");
        }
        else if (code == 2)
        {
            lcdDisplay.print("!>  LOCKDOWN  <!");
        }
    }

    void LCDController::readingDisplay()
    {
        lcdDisplay.setCursor(0, 0);
        lcdDisplay.print("|  SecurDoor   |");
        lcdDisplay.setCursor(0, 1);
        lcdDisplay.print("> PLEASE WAIT  <");
    }

    WebServerHandler::WebServerHandler(uint16_t port) : WebServer(port) {}
    WebServerHandler::~WebServerHandler() {}

    void WebServerHandler::beginServer()
    {
        this->begin();
    }

    namespace NetworkConfig
    {
        String test_root_ca = "";
    }

}
