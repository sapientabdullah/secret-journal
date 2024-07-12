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

async function main() {
  await welcome();
  if (!hasUsers()) {
    console.log("\n👤 Let's start by creating your user credentials.\n");
    await processUserCreation()
      .then(() => {
        console.log("\n🌟 Next, let's create your first post.\n");
        return processPostCreation();
      })
      .then(() => {
        console.log("\n🔍 Let's see all the posts you've created.\n");
        userId = getUserId(username);
        return postsByYearTree(userId, password);
      })
      .then(() => {
        console.log("\n📄 Let's view a specific post.");
        return inquireDisplayPost(userId, password);
      })
      .then(() => {
        console.log("\n📝 Next, let's learn post editing.");
        return inquireEditPost(userId, password);
      })
      .then(() => {
        console.log("\n✨ You're now ready to use the program!");
        console.log("");
        return menu(userId, password);
      })
      .catch((error) => {
        handleError(error);
      });
  } else {
    await processLogin();
    await menu(userId, password);
  }
}

async function menu(userId, password) {
  const choices = [
    { name: "Create Post", value: "create" },
    { name: "View Post Hierarchy", value: "hierarchy" },
    { name: "View a Specific Post", value: "view" },
    { name: "Edit/Delete Post", value: "edit_delete" },
    { name: "Exit", value: "exit" },
  ];

  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices,
    });

    switch (action) {
      case "create":
        console.clear();
        await processPostCreation(userId, password);
        break;
      case "view":
        console.clear();
        await inquireDisplayPost(userId, password);
        break;
      case "edit_delete":
        console.clear();
        await inquireEditPost(userId, password);
        break;
      case "hierarchy":
        console.clear();
        await postsByYearTree(userId, password);
        break;
      case "exit":
        console.log("");
        console.log(chalk.green.bold(`Goodbye, ${username}!`));
        return;
      default:
        console.log(chalk.red.bold("Invalid choice, please try again."));
        break;
    }
  }
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
