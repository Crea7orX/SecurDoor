import crypto from "crypto";

interface VerifySignatureParams {
  data: string;
  signature: string;
  publicKeyWithoutHeaders: string;
}

export function verifySignature({
  data,
  signature,
  publicKeyWithoutHeaders,
}: VerifySignatureParams): boolean {
  try {
    const dataBuffer = Buffer.from(data);

    // Handle URL-safe base64 if needed
    const cleanSignature = signature.replace(/-/g, "+").replace(/_/g, "/");

    const signatureBuffer = Buffer.from(cleanSignature, "base64");

    return crypto.verify(
      "RSA-SHA512",
      dataBuffer,
      {
        key: formatRawPublicKey(publicKeyWithoutHeaders),
      },
      signatureBuffer,
    );
  } catch (error) {
    return false;
  }
}

export function formatPublicKeyForDB(publicKey: string) {
  return publicKey
    .trim()
    .replace(/-----BEGIN PUBLIC KEY-----\n/g, "")
    .replace(/\n-----END PUBLIC KEY-----/g, "")
    .replace(/\n/g, "\\n");
}

export function formatRawPublicKey(rawKeyWithoutHeaders: string) {
  // Unescape the `\\n` to `\n`
  const unescapedKey = rawKeyWithoutHeaders.replace(/\\n/g, "\n");

  // Add the PEM headers and footers
  return `-----BEGIN PUBLIC KEY-----\n${unescapedKey}\n-----END PUBLIC KEY-----`;
}
