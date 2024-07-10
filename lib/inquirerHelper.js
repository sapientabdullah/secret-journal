import os from "os";
import inquirer from "inquirer";

export async function inquireUsername() {
  const answer = await inquirer.prompt({
    name: "username",
    type: "input",
    message: "Create your username: ",
    default: os.userInfo().username,
  });
  return answer.username;
}

export async function inquirePassword() {
  const answer = await inquirer.prompt({
    name: "password",
    type: "password",
    message: "Create your password (remember to keep it safe): ",
    mask: "*",
  });
  return answer.password;
}
