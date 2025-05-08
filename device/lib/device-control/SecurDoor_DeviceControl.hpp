#ifndef SECURDOOR_DEVICECONTROL_HPP
#define SECURDOOR_DEVICECONTROL_HPP

#include <Arduino.h>
#include <SecurDoor_Globals.hpp>
#include <SecurDoor_RemoteConnection.hpp>

namespace SecurDoor
{

    class DeviceController
    {
    public:
        DeviceController();

        static void restartDevice();
        static void panic(const String &message);

        // LED control
        static void buzzBuzzer(int times, int delayMs);

        static void deleteRemovedFingerprints(Adafruit_Fingerprint &finger,
                                              DeviceController &deviceController,
                                              RemoteConnection &remoteConnection,
                                              TimeKeeping &timeKeepingService,
                                              MessagingService &messagingService);

        static void beginEnrollmentOfFingerprint(Adafruit_Fingerprint &finger,
                                                 DeviceController &deviceController,
                                                 RemoteConnection &remoteConnection,
                                                 TimeKeeping &timeKeepingService,
                                                 MessagingService &messagingService);

        void setLED(int led, bool state);

        // Lock state management
        bool isLocked() const;
        void setLocked(bool locked, int timestamp = 0);
        void lockDoor();
        void unlockDoor();
        bool isDoorClosed();
        unsigned long getLastLockedStateChange() const;

        bool lastLockedState() const;
        void setLastLockedState(bool locked);

        bool isEmergency() const;
        void setEmergency(bool emergency);

        bool isEmergencyBeeped() const;

        void setRelockDelay(unsigned long delay);
        unsigned long getRelockDelay() const;

        void setDashboardOverride(bool override);
        bool getDashboardOverride() const;

        void setEmergencyCode(unsigned long code);
        unsigned long getEmergencyCode() const;

    private:
        bool dashboardOverride;
        bool m_isLocked;
        bool m_lastLockedState;
        unsigned long lastEmergencyCode;
        unsigned long m_lastLockedStateChange;
        bool m_emergency;
        bool m_emergency_beeped;
        unsigned long m_relockDelay;
    };

}

#endif
