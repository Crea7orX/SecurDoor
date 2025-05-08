#ifndef SECURDOOR_REMOTE_CONNECTION_HPP
#define SECURDOOR_REMOTE_CONNECTION_HPP

#include <Arduino.h>
#include <ArduinoJson.h>
#include <SecurDoor_Globals.hpp>
#include <tuple>

namespace SecurDoor
{
    class TimeKeeping;
    class DeviceController;
    class MessagingService;

    class RemoteConnection
    {
    public:
        RemoteConnection();

        tuple<String, int> sendHttpsRequest(const String &host,
                                            const String &path,
                                            const bool &secure = true,
                                            const String &method = "GET",
                                            const String &headers = String(),
                                            const String &payload = String(),
                                            const bool &displayBusy = true);

        String downloadRootCertificate(const String &domain, const String &path);

        // The two new methods extracted from loop()
        void checkTimestamp(TimeKeeping &timeKeepingService, DeviceController &deviceController);

        void sendHeartbeat(TimeKeeping &timeKeepingService,
                           DeviceController &deviceController,
                           MessagingService &messagingService,
                           Adafruit_Fingerprint &fingerprintSensor,
                           RemoteConnection &remoteConnection);

        void enrollFingerprintToServer(int fingerID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService);

        void authenticateCard(const String &cardUID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService);
        void authenticateFingerprint(int fingerID, DeviceController &deviceController, TimeKeeping &timeKeepingService, MessagingService &messagingService);

    private:
        unsigned long lastCheck;
        unsigned long lastFetch;
        unsigned long lastHeartbeat;
        unsigned long localTimestamp;
        bool firstRun = true;
    };

}

#endif
