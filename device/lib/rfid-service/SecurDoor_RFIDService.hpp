#ifndef SECURDOOR_RFID_SERVICE_HPP
#define SECURDOOR_RFID_SERVICE_HPP

#include <Arduino.h>
#include <MFRC522.h>

namespace SecurDoor
{
    // Define a function pointer type for an optional "panic" callback
    typedef void (*PanicCallbackType)(const String &message);

    class RFIDService
    {
    public:
        // Default constructor with no pin parameters
        RFIDService();

        // Inject your pin configuration after construction
        void setPins(uint8_t rstPin, uint8_t nssPin, uint8_t sckPin, uint8_t misoPin, uint8_t mosiPin);

        // Optional injection of a callback for fatal errors
        void setPanicCallback(PanicCallbackType cb);

        // Initialize the RFID hardware (call after setPins and setPanicCallback)
        void begin();

        // Check if a card is present
        bool isCardPresent();

        // If a card is present, read its UID
        String readCardUID();

    private:
        // Pin configuration
        uint8_t _rstPin;
        uint8_t _nssPin;
        uint8_t _sckPin;
        uint8_t _misoPin;
        uint8_t _mosiPin;

        // MFRC522 handle
        MFRC522 *_mfrc522;

        // Optional callback for panic/fatal errors
        PanicCallbackType _panicCallback;
    };
}

#endif
