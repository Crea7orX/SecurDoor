#ifndef SECURDOOR_WIFI_HPP
#define SECURDOOR_WIFI_HPP

#include "SecurDoor_Globals.hpp"
#include "SecurDoor_DeviceControl.hpp"

namespace SecurDoor {

    class SecurDoorWiFi {
    public:
        using RestartCallback = void (*)();

        SecurDoorWiFi(WebServerHandler &server, RestartCallback restartCallback);
        void setupWiFi(DeviceController &deviceController);
        static void configModeCallback(WiFiManager *myWiFiManager);

    private:
        WebServerHandler &server;
        WiFiManagerWrapper wm;
        RestartCallback restartCallback;
    };

}

#endif
