#ifndef SECURDOOR_RSA_KEYS_HPP
#define SECURDOOR_RSA_KEYS_HPP

// IMPORTANT: Provided keys are for demonstration purposes only. Do not use them in production.

namespace SecurDoor
{
    namespace RSAKeys
    {
        static const char *DEVICE_PRIVATE_KEY_PEM =
            "-----BEGIN RSA PRIVATE KEY-----\n"
            "MIICWgIBAAKBgG+lxFF+tx9NP4W3pJ/Ep64RKBEBTiUg25DfY84aJpmjIJH+36jS\n"
            "rIhoHXhrQBc9BNBDvzFMSqx+ElbrUqRghchd6MweUrBnyeja7PIKHCdpNQt5ctvP\n"
            "mJPQU47RkQhgEelkCEVDSJDX83rY8SMCArPzT8FP80w655vZ7m3WKFFFAgMBAAEC\n"
            "gYBY4RHj/ogxNwG2pXc8aQVDoQzQXMWk8P9Z2TxOuqq37BDlqIzMjMok3R1424ht\n"
            "93l5gjUWPbHEl6hp4XQsv1pADmm/ulXl0vSmnYddsxIYuEpKIzMZBEKCYCN6qSRa\n"
            "cXHq4C5MIPln9eSlZ7x0Of94aOzqalsoA1QWI5W9Zxq5gQJBANiS5UyU5JgPIaO6\n"
            "ljzNXGfsK9PvTEjvWC6RCwbZ/hTkOKdrYbsmEECG/nwov2jJsWIwmewa9cKXDw3X\n"
            "kfWvrNkCQQCD+O+SnJr+c0SVrFi6aFlPvXzVwICr1nEGZmPGy1tJfR7vKtAar1gG\n"
            "buxLqJfGlUQ8+PtZiHFT4r9HzSIyl3RNAkB4E3nuq97SMBGGpb0GmRXSyK7EIrk4\n"
            "9vr9Vo22jsbA7og6yt601LXOEQqn7C+z+Z/PwQKWVZxM91PxaMQUZAKBAkATzHzk\n"
            "meoG0nQvoDOPg6gidmMMDl0/amR6eVHuuQNw+vxxFRMzbarfDDUXBKwAdtRN8WyD\n"
            "+hxGYXYg532B6YbhAkAlKMtKv5cxDFiHRJabaoQTOgdxHCirI5wxvkQtowRG6Tqq\n"
            "VT1CRW5AYfUXgbtKyejy/Gz2ZME0HJegk6HxWnmd\n"
            "-----END RSA PRIVATE KEY-----\n";

        static const char *DEVICE_PUBLIC_KEY_PEM =
            "-----BEGIN PUBLIC KEY-----\n"
            "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG+lxFF+tx9NP4W3pJ/Ep64RKBEB\n"
            "TiUg25DfY84aJpmjIJH+36jSrIhoHXhrQBc9BNBDvzFMSqx+ElbrUqRghchd6Mwe\n"
            "UrBnyeja7PIKHCdpNQt5ctvPmJPQU47RkQhgEelkCEVDSJDX83rY8SMCArPzT8FP\n"
            "80w655vZ7m3WKFFFAgMBAAE=\n"
            "-----END PUBLIC KEY-----\n";

        static const char *DEVICE_UNIQUE_ID = "9124f3e2-757d-4b6c-9980-2183bb51077f";
    }
}

#endif
