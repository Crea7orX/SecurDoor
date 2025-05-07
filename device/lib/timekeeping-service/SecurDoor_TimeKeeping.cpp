/*
 * SecurDoor Project - ESP-based Security System
 * 
 * (GPLv3 License / Disclaimer as appropriate)
 */

#include "SecurDoor_TimeKeeping.hpp"
#include "SecurDoor_RemoteConnection.hpp" // needed because we use RemoteConnection methods
#include <ArduinoJson.h>
#include "SecurDoor_Globals.hpp" // for TimekeepingConfig, if needed

namespace SecurDoor {

TimeKeeping::TimeKeeping()
  : remoteConn(nullptr),
    lastTimestamp(0)
{
}

void TimeKeeping::setRemoteConnection(RemoteConnection *remote) {
    remoteConn = remote;
}

bool TimeKeeping::fetchRemoteTimestamp() {
    if (!remoteConn) {
        // No remote connection injected yet
        return false;
    }

    // Example usage of configuration from your code
    String urlPath = String(TimekeepingConfig::TIME_API_PATH);
    tuple<String, int> response = remoteConn->sendHttpsRequest(
                          TimekeepingConfig::TIME_API_DOMAIN,
                          urlPath, 
                          false // secure
                      );

    String responseBody = get<0>(response);
                      
    if (responseBody.isEmpty()) {
        return false;
    }

    JsonDocument doc;
    DeserializationError err = deserializeJson(doc, responseBody);
    if (err) {
        return false;
    }

    // Validate the JSON fields
    if (!doc["timestamp"].is<unsigned long>()) {
        return false;
    }
    unsigned long ts = doc["timestamp"].as<unsigned long>();
    if (ts == 0) {
        return false;
    }

    lastTimestamp = ts;
    setTimestamp(lastTimestamp);
    return true;
}

unsigned long TimeKeeping::getTimestamp() const {
    return lastTimestamp;
}

void TimeKeeping::setTimestamp(unsigned long timestamp) {
    lastTimestamp = timestamp;
}

} // namespace SecurDoor
