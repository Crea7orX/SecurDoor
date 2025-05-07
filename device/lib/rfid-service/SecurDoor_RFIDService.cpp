#include "SecurDoor_RFIDService.hpp"
#include <SPI.h>  // For SPI.begin, if you need it here

namespace SecurDoor {

RFIDService::RFIDService()
    : _rstPin(0)
    , _nssPin(0)
    , _sckPin(0)
    , _misoPin(0)
    , _mosiPin(0)
    , _mfrc522(nullptr)
    , _panicCallback(nullptr)
{
}

void RFIDService::setPins(uint8_t rstPin, uint8_t nssPin, uint8_t sckPin, uint8_t misoPin, uint8_t mosiPin) {
    _rstPin  = rstPin;
    _nssPin  = nssPin;
    _sckPin  = sckPin;
    _misoPin = misoPin;
    _mosiPin = mosiPin;
}

void RFIDService::setPanicCallback(PanicCallbackType cb) {
    _panicCallback = cb;
}

void RFIDService::begin() {
    // If you need SPI to be initialized here, do:
    //   SPI.begin(_sckPin, _misoPin, _mosiPin, _nssPin);
    // If you already do SPI.begin(...) in your main code, you can skip it here.

    pinMode(_nssPin, OUTPUT);
    pinMode(_rstPin, OUTPUT);

    _mfrc522 = new MFRC522(_nssPin, _rstPin);
    _mfrc522->PCD_Init();

    // Print version to serial as before
    _mfrc522->PCD_DumpVersionToSerial();
    byte version = _mfrc522->PCD_ReadRegister(_mfrc522->VersionReg);

    // If this looks like a connection error
    if (version == 0x00 || version == 0xFF) {
        if (_panicCallback) {
            _panicCallback("RFID connection error.");
        }
        // If you don’t have a callback, you could just do:
        //   Serial.println("RFID connection error!"); while(true){}
    }

    // Increase antenna gain
    _mfrc522->PCD_SetAntennaGain(MFRC522::RxGain_max);

    // If for some reason _mfrc522 is null after new (should not happen),
    // call panicCallback or handle the error
    if (!_mfrc522 && _panicCallback) {
        _panicCallback("RFID initialization failed.");
    }
}

bool RFIDService::isCardPresent() {
    if (!_mfrc522) return false;
    if (!_mfrc522->PICC_IsNewCardPresent()) return false;
    if (!_mfrc522->PICC_ReadCardSerial())   return false;
    return true;
}

String RFIDService::readCardUID() {
    if (!_mfrc522) return String();
    if (!isCardPresent()) return String();

    String uidString;
    for (byte i = 0; i < _mfrc522->uid.size; i++) {
        if (_mfrc522->uid.uidByte[i] < 0x10) {
            uidString += "0";
        }
        uidString += String(_mfrc522->uid.uidByte[i], HEX);
    }
    uidString.toUpperCase();

    _mfrc522->PICC_HaltA();
    _mfrc522->PCD_StopCrypto1();
    return uidString;
}

} // namespace SecurDoor
