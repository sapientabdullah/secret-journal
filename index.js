#!/usr/bin/env node
"use strict";

import minimist from "minimist";
import { hashPassword, verifyPassword } from "./lib/argon2Helper.js";
import { createUser, getUser } from "./lib/users.js";

export const tick = "\u2714";
export const cross = "\u2716";
let username;
let password;
let userId;

const argv = minimist(process.argv.slice(2), {
  boolean: ["create-post", "view-post", "edit-post", "new-user"],
  string: ["help", "month", "year"],
});

async function processUserCreation() {
  try {
    username = await inquireUsername();
    password = await inquirePassword();
    const hashedPassword = await hashPassword(password);
    createUser(username, hashedPassword);
  } catch (error) {
    handleError(error);
  }
}

async function processLogin() {
  while (true) {
    try {
      const credentials = await inquireCredentials();
      const tempUsername = credentials.username;
      const tempPassword = credentials.password;
      const userRecord = getUser(tempUsername);

      if (!userRecord) {
        console.log("");
        console.log(
          chalk.red.bold(`${cross} Invalid username. Please try again.`)
        );
        console.log("");
        continue;
      }

      const isMatch = await verifyPassword(userRecord.password, tempPassword);

      if (isMatch) {
        username = tempUsername;
        password = tempPassword;
        console.log("");
        console.log(
          chalk.green.bold(`${tick} User authenticated successfully.`)
        );
        console.log("");
        userId = getUserId(username);
        break;
      } else {
        console.log("");
        console.log(
          chalk.red.bold(`${cross} Invalid password. Please try again.`)
        );
        console.log("");
      }
    } catch (error) {
      handleError(error);
    }
  }
}

function handleError(msg) {
  console.error("Oops! An error occurred:", msg);
}
