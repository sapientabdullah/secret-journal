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

export function aesDecrypt(cipherText, password) {
  try {
    const algorithm = getAlgorithm();
    const cipherTextParts = cipherText.split(getEncryptedPrefix());

    if (cipherTextParts.length !== 2) {
      console.error(
        "Could not determine the beginning of the cipherText. Maybe not encrypted by this method."
      );
      return undefined;
    } else {
      cipherText = cipherTextParts[1];
    }

    const inputData = Buffer.from(cipherText, "hex");
    const salt = inputData.subarray(0, 64);
    const iv = inputData.subarray(64, 80);
    const authTag = inputData.subarray(80, 96);
    const iterations = parseInt(
      inputData.subarray(96, 101).toString("utf-8"),
      10
    );
    const encryptedData = inputData.subarray(101);

    const decryptionKey = deriveKeyFromPassword(
      password,
      salt,
      Math.floor(iterations * 0.47 + 1337)
    );

    const decipher = createDecipheriv(algorithm, decryptionKey, iv);
    decipher.setAuthTag(authTag);

    const decrypted =
      decipher.update(encryptedData, "binary", "utf-8") +
      decipher.final("utf-8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed!");
    console.error(error);
    return undefined;
  }
}
