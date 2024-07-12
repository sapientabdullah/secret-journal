import os from "os";
import inquirer from "inquirer";
import chalk from "chalk";
import { database } from "./db.js";
import { cross } from "../index.js";
import { editPost, displayPost, deletePost } from "./posts.js";
import { aesDecrypt } from "./cryptoHelper.js";

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

    const choices = matchingPosts.map((post) => ({
      name: `${chalk.yellowBright(`${post.created_at}:`)} ${post.title}`,
      value: post.id,
    }));

    console.log("");

    const { selectedPostId } = await inquirer.prompt({
      type: "list",
      name: "selectedPostId",
      message: "Select a post to view:\n",
      choices,
    });

    const selectedPost = matchingPosts.find(
      (post) => post.id === selectedPostId
    );

    if (selectedPost) {
      await displayPost(selectedPost.content);
    } else {
      console.log(chalk.red.bold("Selected post not found."));
    }
  } catch (error) {
    console.error("Error occurred while searching posts:", error);
  }
}

export async function inquireEditPost(userId, password) {
  console.log("");
  const { keyword } = await inquirer.prompt({
    type: "input",
    name: "keyword",
    message: "Enter the keyword for the post you want to edit:",
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

    const matchingPosts = decryptedPosts.filter(
      (post) => post.title.includes(keyword) || post.content.includes(keyword)
    );

    if (matchingPosts.length === 0) {
      console.log("");
      console.log(
        chalk.red.bold(`${cross} No posts found matching "${keyword}".`)
      );
      return;
    }

    console.log("");

    const choices = matchingPosts.map((post) => ({
      name: `${chalk.yellowBright(`${post.created_at}:`)} ${post.title}`,
      value: post.id,
    }));

    const { selectedPostId } = await inquirer.prompt({
      type: "list",
      name: "selectedPostId",
      message: `Posts found with the keyword '${chalk.blue(keyword)}':\n`,
      choices,
    });

    const selectedPost = matchingPosts.find(
      (post) => post.id === selectedPostId
    );

    if (selectedPost) {
      console.log("");
      console.log(chalk.blue.bold("Post Content:"));
      console.log("");
      console.log(selectedPost.content);

      const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "Do you want to edit or delete this post?",
        choices: ["Edit", "Delete"],
      });

      if (action === "Edit") {
        await editPost(
          selectedPost.id,
          selectedPost.title,
          selectedPost.content,
          password
        );
      } else if (action === "Delete") {
        const { confirmDelete } = await inquirer.prompt({
          type: "confirm",
          name: "confirmDelete",
          message: "Are you sure you want to delete this post?",
        });

        if (confirmDelete) {
          await deletePost(selectedPost.id);
        }
      }
    } else {
      console.log(chalk.red.bold(`${cross} Selected post not found.`));
    }
  } catch (error) {
    console.error("Error occurred while searching posts:", error);
  }
}
