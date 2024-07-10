#!/usr/bin/env node
"use strict";

import minimist from "minimist";
import { hashPassword, verifyPassword } from "./lib/argon2Helper.js";

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

