import { hash, verify } from "argon2";

export async function hashPassword(password) {
  try {
    const hashedPassword = await hash(password);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

export async function verifyPassword(hashedPassword, password) {
  try {
    const isMatch = await verify(hashedPassword, password);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
}
