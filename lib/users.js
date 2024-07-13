import chalk from "chalk";
import { database } from "./db.js";
import { tick, cross } from "../index.js";

export async function createUser(username, password) {
  try {
    const result = database
      .prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)")
      .run(username, password);

    if (result.changes === 0) {
      console.log(
        chalk.red.bold(`\n${cross} User "${username}" already exists.\n`)
      );
    } else {
      console.log(
        chalk.green.bold(`\n${tick} User "${username}" created successfully.`)
      );
    }
  } catch (error) {
    console.error("Error occurred during user creation.");
  }
}

export function getUser(username) {
  try {
    const user = database
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
    return user;
  } catch (error) {
    console.error("Error occurred while fetching user:", error);
  }
}

export function getUserId(username) {
  try {
    const result = database
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);
    return result ? result.id : null;
  } catch (error) {
    console.error("Error occurred while fetching user ID:", error);
  }
}

export function hasUsers() {
  const result = database.prepare("SELECT COUNT(*) AS count FROM users").get();
  return result.count > 0;
}
