#!/usr/bin/env node
"use strict";

import minimist from "minimist";
import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import { hashPassword, verifyPassword } from "./lib/argon2Helper.js";
import { createUser, getUser, getUserId } from "./lib/users.js";

export const tick = "\u2714";
export const cross = "\u2716";
let username;
let password;
let userId;

const argv = minimist(process.argv.slice(2), {
  boolean: ["create-post", "view-post", "edit-post", "new-user"],
  string: ["help", "month", "year"],
});

if (argv.help !== undefined) {
  printHelp(argv.help);
} else if (argv["create-post"]) {
  processLogin().then(() => {
    processPostCreation();
  });
} else if (argv["new-user"]) {
  processUserCreation();
} else if (argv["edit-post"]) {
  processLogin().then(() => {
    inquireEditPost(userId, password);
  });
} else if (argv["view-post"]) {
  processLogin().then(() => {
    inquireDisplayPost(userId, password);
  });
} else if (argv.year || argv.month) {
  processLogin().then(() => {
    postsByMonthTree(userId, password, argv.year, argv.month);
  });
} else {
  main();
}

async function welcome() {
  return new Promise((resolve, reject) => {
    figlet.text("Secret Journal", { font: "Script" }, async (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log(gradient.rainbow.multiline(data));
        await typeText(
          chalk.blueBright.bold(
            "Confidential Journaling @ the Speed of Thought\n"
          )
        );
        console.log("");
        resolve();
      }
    });
  });
}

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

async function sleep(ms = 2000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function typeText(text, delay = 25) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(text[i]);
    await sleep(delay);
  }
}

async function processPostCreation() {
  try {
    const result = await capturePost();
    if (result) {
      const { title, content, date } = result;
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const userId = getUserId(username);

      const encryptedTitle = aesEncrypt(title, password);
      const encryptedContent = aesEncrypt(content, password);

      createPost(encryptedTitle, encryptedContent, date, year, month, userId);
    } else {
      console.log("User canceled or an error occurred.");
    }
  } catch (error) {
    handleError(error);
  }
}

function handleError(msg) {
  console.error("Oops! An error occurred:", msg);
}
