import chalk from "chalk";
import { database } from "./db.js";

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
