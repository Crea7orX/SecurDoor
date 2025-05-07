/*
 * SecurDoor Project - ESP-based Security System
 * 
 * (GPLv3 License / Disclaimer as appropriate)
 */

#ifndef SECURDOOR_MESSAGINGSERVICE_HPP
#define SECURDOOR_MESSAGINGSERVICE_HPP

#include <Arduino.h>

namespace SecurDoor {

class MessagingService {
public:
    // Default constructor: no dependency on other classes
    MessagingService();

    // Setter to inject device keys after construction
    void setDeviceKeys(const String &privateKey, const String &publicKey);

    String encryptWithDevicePrivateKey(const String &plainText);
    String signContent(const String &message);
    bool verifySignature(const String &message, const String &base64Signature);

private:
    String devicePrivateKeyPEM;
    String devicePublicKeyPEM;
};

} // namespace SecurDoor

#endif // SECURDOOR_MESSAGINGSERVICE_HPP
