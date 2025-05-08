#include "SecurDoor_RFIDService.hpp"

namespace SecurDoor
{
    RFIDService::RFIDService()
        : _rstPin(0), _nssPin(0), _sckPin(0), _misoPin(0), _mosiPin(0), _mfrc522(nullptr), _panicCallback(nullptr)
    {
    }

    void RFIDService::setPins(uint8_t rstPin, uint8_t nssPin, uint8_t sckPin, uint8_t misoPin, uint8_t mosiPin)
    {
        _rstPin = rstPin;
        _nssPin = nssPin;
        _sckPin = sckPin;
        _misoPin = misoPin;
        _mosiPin = mosiPin;
    }

    void RFIDService::setPanicCallback(PanicCallbackType cb)
    {
        _panicCallback = cb;
    }

    void RFIDService::begin()
    {
        pinMode(_nssPin, OUTPUT);
        pinMode(_rstPin, OUTPUT);

        _mfrc522 = new MFRC522(_nssPin, _rstPin);
        _mfrc522->PCD_Init();

        _mfrc522->PCD_DumpVersionToSerial();
        byte version = _mfrc522->PCD_ReadRegister(_mfrc522->VersionReg);

        if (version == 0x00 || version == 0xFF)
        {
            if (_panicCallback)
            {
                _panicCallback("RFID connection error.");
            }
        }

        // Increase antenna gain
        _mfrc522->PCD_SetAntennaGain(MFRC522::RxGain_max);

        // call panicCallback or handle the error
        if (!_mfrc522 && _panicCallback)
        {
            _panicCallback("RFID initialization failed.");
        }
    }

    bool RFIDService::isCardPresent()
    {
        if (!_mfrc522)
            return false;
        if (!_mfrc522->PICC_IsNewCardPresent())
            return false;
        if (!_mfrc522->PICC_ReadCardSerial())
            return false;
        return true;
    }

    String RFIDService::readCardUID()
    {
        if (!_mfrc522)
            return String();
        if (!isCardPresent())
            return String();

        String uidString;
        for (byte i = 0; i < _mfrc522->uid.size; i++)
        {
            if (_mfrc522->uid.uidByte[i] < 0x10)
            {
                uidString += "0";
            }
            uidString += String(_mfrc522->uid.uidByte[i], HEX);
        }
        uidString.toUpperCase();

        _mfrc522->PICC_HaltA();
        _mfrc522->PCD_StopCrypto1();
        return uidString;
    }
}
