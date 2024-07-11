import {
  pbkdf2Sync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "crypto";

function getAlgorithm() {
  return "aes-256-gcm";
}

function getEncryptedPrefix() {
  return "enc::";
}

function deriveKeyFromPassword(password, salt, iterations) {
  return pbkdf2Sync(password, salt, iterations, 32, "sha512");
}

export function aesEncrypt(plainText, password) {
  try {
    plainText = String(plainText);

    const algorithm = getAlgorithm();
    const salt = randomBytes(64);
    const iv = randomBytes(16);
    const iterations = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

    const encryptionKey = deriveKeyFromPassword(
      password,
      salt,
      Math.floor(iterations * 0.47 + 1337)
    );

    const cipher = createCipheriv(algorithm, encryptionKey, iv);
    const encryptedData = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();
    const output = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(iterations.toString()),
      encryptedData,
    ]).toString("hex");

    return getEncryptedPrefix() + output;
  } catch (error) {
    console.error("Encryption failed!");
    console.error(error);
    return undefined;
  }
}
