/*
 * SecurDoor Project - ESP-based Security System
 * 
 * (GPLv3 License / Disclaimer as appropriate)
 */

#ifndef SECURDOOR_TIMEKEEPING_HPP
#define SECURDOOR_TIMEKEEPING_HPP

#include <Arduino.h>

namespace SecurDoor {

class RemoteConnection;

class TimeKeeping {
public:
    TimeKeeping(); // Default constructor

    // Setter to inject a RemoteConnection pointer after construction
    void setRemoteConnection(RemoteConnection *remote);

    bool fetchRemoteTimestamp();
    unsigned long getTimestamp() const;
    void setTimestamp(unsigned long timestamp);

private:
    RemoteConnection *remoteConn; // Held as a pointer
    unsigned long lastTimestamp;
};

} // namespace SecurDoor

#endif // SECURDOOR_TIMEKEEPING_HPP
