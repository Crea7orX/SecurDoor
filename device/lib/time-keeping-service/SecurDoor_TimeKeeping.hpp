#ifndef SECURDOOR_TIME_KEEPING_HPP
#define SECURDOOR_TIME_KEEPING_HPP

#include <Arduino.h>

namespace SecurDoor
{
    class RemoteConnection;

    class TimeKeeping
    {
    public:
        TimeKeeping(); // Default constructor

        // Setter to inject a RemoteConnection pointer after construction
        void setRemoteConnection(RemoteConnection *remote);

        bool fetchRemoteTimestamp();
        unsigned long getTimestamp() const;
        void setTimestamp(unsigned long timestamp);

    private:
        RemoteConnection *remoteConn;
        unsigned long lastTimestamp;
    };

}

#endif
