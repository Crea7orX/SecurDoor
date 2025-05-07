/*
 * SecurDoor Project - ESP-based Security System
 * 
 * (GPLv3 License / Disclaimer as appropriate)
 */

#include "SecurDoor_MessagingService.hpp"
#include <mbedtls/pk.h>
#include <mbedtls/rsa.h>
#include <mbedtls/base64.h>
#include <mbedtls/entropy.h>
#include <mbedtls/ctr_drbg.h>
#include <mbedtls/md.h>
#include <vector>
#include <stdlib.h>
#include <string.h>

namespace SecurDoor {

static String base64Encode(const uint8_t *data, size_t len) {
    size_t outLen = 0;
    size_t bufferSize = 4 * ((len + 2) / 3);
    uint8_t *outBuf = (uint8_t *)malloc(bufferSize + 1);
    if (!outBuf) return String();
    if (mbedtls_base64_encode(outBuf, bufferSize + 1, &outLen, data, len) != 0) {
        free(outBuf);
        return String();
    }
    outBuf[outLen] = '\0';
    String result = (char *)outBuf;
    free(outBuf);
    return result;
}

static std::vector<uint8_t> base64Decode(const String &base64Text) {
    size_t outLen = 0;
    std::vector<uint8_t> output(base64Text.length() * 3 / 4 + 4);
    if (mbedtls_base64_decode(output.data(), output.size(), &outLen,
                              (const unsigned char *)base64Text.c_str(),
                              base64Text.length()) != 0) {
        return {};
    }
    output.resize(outLen);
    return output;
}

// Default constructor: sets empty keys
MessagingService::MessagingService()
    : devicePrivateKeyPEM(""),
      devicePublicKeyPEM("")
{
}

void MessagingService::setDeviceKeys(const String &privateKey, const String &publicKey) {
    devicePrivateKeyPEM = privateKey;
    devicePublicKeyPEM = publicKey;
}

String MessagingService::encryptWithDevicePrivateKey(const String &plainText) {
    mbedtls_pk_context pk;
    mbedtls_pk_init(&pk);
    mbedtls_ctr_drbg_context ctr_drbg;
    mbedtls_entropy_context entropy;
    mbedtls_ctr_drbg_init(&ctr_drbg);
    mbedtls_entropy_init(&entropy);

    const char *pers = "enc_priv_key";
    if (mbedtls_ctr_drbg_seed(&ctr_drbg, mbedtls_entropy_func, &entropy,
                              (const unsigned char *)pers, strlen(pers)) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    // Unconventional usage: typically you'd parse the private key with parse_key, 
    // but this is kept to match your original code structure.
    if (mbedtls_pk_parse_public_key(&pk,
            (const unsigned char *)devicePrivateKeyPEM.c_str(),
            devicePrivateKeyPEM.length() + 1) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    std::vector<uint8_t> output(mbedtls_pk_get_len(&pk));
    size_t olen = 0;
    if (mbedtls_pk_encrypt(&pk,
                           (const unsigned char *)plainText.c_str(),
                           plainText.length(),
                           output.data(), &olen, output.size(),
                           mbedtls_ctr_drbg_random, &ctr_drbg) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    mbedtls_pk_free(&pk);
    mbedtls_entropy_free(&entropy);
    mbedtls_ctr_drbg_free(&ctr_drbg);

    return base64Encode(output.data(), olen);
}

String MessagingService::signContent(const String &message) {
    mbedtls_pk_context pk;
    mbedtls_pk_init(&pk);
    mbedtls_ctr_drbg_context ctr_drbg;
    mbedtls_entropy_context entropy;
    mbedtls_ctr_drbg_init(&ctr_drbg);
    mbedtls_entropy_init(&entropy);

    const char *pers = "sign_priv_key";
    if (mbedtls_ctr_drbg_seed(&ctr_drbg, mbedtls_entropy_func, &entropy,
                              (const unsigned char *)pers, strlen(pers)) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    if (mbedtls_pk_parse_key(&pk,
            (const unsigned char *)devicePrivateKeyPEM.c_str(),
            devicePrivateKeyPEM.length() + 1,
            nullptr, 0) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    mbedtls_md_context_t mdCtx;
    mbedtls_md_init(&mdCtx);
    const mbedtls_md_info_t *mdInfo = mbedtls_md_info_from_type(MBEDTLS_MD_SHA512);
    if (!mdInfo) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    if (mbedtls_md_setup(&mdCtx, mdInfo, 0) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    if (mbedtls_md_starts(&mdCtx) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    if (mbedtls_md_update(&mdCtx, 
            (const unsigned char *)message.c_str(), message.length()) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    uint8_t hash[64]; // 512 bits for SHA-512
    if (mbedtls_md_finish(&mdCtx, hash) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }
    mbedtls_md_free(&mdCtx);

    std::vector<uint8_t> signature(mbedtls_pk_get_len(&pk));
    size_t sigLen = 0;
    if (mbedtls_pk_sign(&pk,
                        MBEDTLS_MD_SHA512,
                        hash, sizeof(hash),
                        signature.data(), &sigLen,
                        mbedtls_ctr_drbg_random, &ctr_drbg) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return String();
    }

    mbedtls_pk_free(&pk);
    mbedtls_entropy_free(&entropy);
    mbedtls_ctr_drbg_free(&ctr_drbg);

    return base64Encode(signature.data(), sigLen);
}

bool MessagingService::verifySignature(const String &message, const String &base64Signature) {
    std::vector<uint8_t> signature = base64Decode(base64Signature);
    if (signature.empty()) {
        return false;
    }

    mbedtls_pk_context pk;
    mbedtls_pk_init(&pk);
    mbedtls_ctr_drbg_context ctr_drbg;
    mbedtls_entropy_context entropy;
    mbedtls_ctr_drbg_init(&ctr_drbg);
    mbedtls_entropy_init(&entropy);

    const char *pers = "verify_pub_key";
    if (mbedtls_ctr_drbg_seed(&ctr_drbg, mbedtls_entropy_func, &entropy,
                              (const unsigned char *)pers, strlen(pers)) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    if (mbedtls_pk_parse_public_key(&pk,
            (const unsigned char *)devicePublicKeyPEM.c_str(),
            devicePublicKeyPEM.length() + 1) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    mbedtls_md_context_t mdCtx;
    mbedtls_md_init(&mdCtx);
    const mbedtls_md_info_t *mdInfo = mbedtls_md_info_from_type(MBEDTLS_MD_SHA512);
    if (!mdInfo) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    if (mbedtls_md_setup(&mdCtx, mdInfo, 0) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    if (mbedtls_md_starts(&mdCtx) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    if (mbedtls_md_update(&mdCtx, 
            (const unsigned char *)message.c_str(), message.length()) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }

    uint8_t hash[64]; 
    if (mbedtls_md_finish(&mdCtx, hash) != 0) {
        mbedtls_pk_free(&pk);
        mbedtls_md_free(&mdCtx);
        mbedtls_entropy_free(&entropy);
        mbedtls_ctr_drbg_free(&ctr_drbg);
        return false;
    }
    mbedtls_md_free(&mdCtx);

    int ret = mbedtls_pk_verify(&pk,
                                MBEDTLS_MD_SHA512,
                                hash, sizeof(hash),
                                signature.data(), signature.size());

    mbedtls_pk_free(&pk);
    mbedtls_entropy_free(&entropy);
    mbedtls_ctr_drbg_free(&ctr_drbg);

    return (ret == 0);
}

} // namespace SecurDoor
