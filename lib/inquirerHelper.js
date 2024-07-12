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

export async function inquireCredentials() {
  const questions = [
    {
      type: "input",
      name: "username",
      message: "Enter your username:",
      validate: function (value) {
        return value.length ? true : "Please enter your username.";
      },
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
      validate: function (value) {
        return value.length ? true : "Please enter your password.";
      },
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    return {
      username: answers.username,
      password: answers.password,
    };
  } catch (error) {
    throw error;
  }
}

export async function inquireDisplayPost(userId, password) {
  console.log("");
  const { keyword } = await inquirer.prompt({
    type: "input",
    name: "keyword",
    message: "Enter the keyword to search for posts:",
  });

  try {
    const posts = database
      .prepare("SELECT * FROM posts WHERE user_id = ?")
      .all(userId);

    const decryptedPosts = posts.map((post) => ({
      ...post,
      title: aesDecrypt(post.title, password),
      content: aesDecrypt(post.content, password),
    }));

    const keywordUpper = keyword.toUpperCase();

    const matchingPosts = decryptedPosts.filter(
      (post) =>
        post.title.toUpperCase().includes(keywordUpper) ||
        post.content.toUpperCase().includes(keywordUpper)
    );

    if (matchingPosts.length === 0) {
      console.log("");
      console.log(
        chalk.red.bold(`${cross} No posts found matching "${keyword}".`)
      );
      return;
    }