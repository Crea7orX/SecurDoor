#ifndef SECURDOOR_MESSAGING_SERVICE_HPP
#define SECURDOOR_MESSAGING_SERVICE_HPP

#include <Arduino.h>

namespace SecurDoor
{
    class MessagingService
    {
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
}

#endif
