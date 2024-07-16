import chalk from "chalk";
import inquirer from "inquirer";
import { spawn } from "child_process";
import { database } from "./db.js";
import { tick } from "../index.js";
import { getFormattedDate } from "./editor.js";
import { aesEncrypt, aesDecrypt } from "./cryptoHelper.js";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthName(monthNumber) {
  return monthNames[monthNumber - 1];
}

export function createPost(title, content, date, year, month, userId) {
  try {
    database
      .prepare(
        `INSERT INTO posts (title, content, created_at, year, month, user_id) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(title, content, date, year, month, userId);
    console.log(chalk.green.bold(`\n${tick} Post created successfully.`));
  } catch (error) {
    console.error("Error occurred during post creation:", error);
  }
}

export function getPostsByYear(year, userId) {
  try {
    const posts = database
      .prepare(`SELECT * FROM posts WHERE year = ? AND user_id = ?`)
      .all(year, userId);
    if (posts.length === 0) {
      return chalk.redBright(`\nNo posts found for the year ${year}.\n`);
    }
    return posts;
  } catch (error) {
    console.error("Error occurred while fetching posts by year:", error);
    return `Error occurred while fetching posts: ${error.message}`;
  }
}

export function getPostsByMonth(year, month, userId) {
  try {
    const posts = database
      .prepare(
        `SELECT * FROM posts WHERE year = ? AND month = ? AND user_id = ?`
      )
      .all(year, month, userId);

    if (posts.length === 0) {
      console.log(`No posts found for ${getMonthName(month)}, ${year}.`);
      return `No posts found for ${getMonthName(month)}, ${year}.`;
    }

    return posts;
  } catch (error) {
    console.error("Error occurred while fetching posts by month:", error);
    return `Error occurred while fetching posts: ${error.message}`;
  }
}

export async function postsByYearTree(userId, password, year) {
  console.log("");
  if (!year) {
    year = new Date().getFullYear();
  }
  const postsByYear = getPostsByYear(year, userId);

  if (Array.isArray(postsByYear)) {
    console.log(chalk.greenBright.bold(postsByYear[0].year));

    const printedMonths = new Set();

    for (const monthPosts of postsByYear) {
      if (!printedMonths.has(monthPosts.month)) {
        printedMonths.add(monthPosts.month);

        console.log(
          `\n └──  ${chalk.greenBright.italic(
            getMonthName(monthPosts.month)
          )}\n`
        );

        const posts = getPostsByMonth(year, monthPosts.month, userId);
        if (Array.isArray(posts)) {
          for (const post of posts) {
            try {
              const decryptedTitle = aesDecrypt(post.title, password);
              console.log(
                `      ├ ${chalk.greenBright.italic(
                  post.created_at
                )} - ${decryptedTitle}`
              );
            } catch (error) {
              console.error(`Error decrypting post title: ${error.message}`);
            }
          }
          console.log("");
        } else {
          console.log(posts);
        }
      }
    }
  } else {
    console.log(postsByYear);
  }
}

export async function postsByMonthTree(
  userId,
  password,
  year = new Date().getFullYear(),
  month
) {
  try {
    if (!month) {
      console.log("Month parameter is required.");
      return;
    }

    const posts = getPostsByMonth(year, month, userId);

    if (!Array.isArray(posts) || posts.length === 0) {
      return;
    }

    console.log(chalk.bold(`Posts for ${getMonthName(month)}, ${year}:`));
    console.log("");

    for (const post of posts) {
      try {
        const decryptedTitle = aesDecrypt(post.title, password);
        console.log(`├ ${decryptedTitle}`);
      } catch (error) {
        console.error(`Error decrypting post title: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error fetching posts:", error.message);
  }
}

export async function editPost(postId, currentTitle, currentContent, password) {
  const { newTitle } = await inquirer.prompt({
    type: "input",
    name: "newTitle",
    message: "Enter new title (leave empty to keep current):",
    default: currentTitle,
  });

  const dateRegex = /Date:.*\n/;
  const titleRegex = /".*"\n/;

  let updatedContent = currentContent.replace(
    dateRegex,
    `Date: ${getFormattedDate(new Date())}\n`
  );
  updatedContent = updatedContent.replace(
    titleRegex,
    `"${newTitle || currentTitle}"\n`
  );

  const { editedContent } = await inquirer.prompt({
    type: "editor",
    name: "editedContent",
    message: "Edit your post content:",
    default: updatedContent,
  });

  const encryptedTitle = aesEncrypt(newTitle || currentTitle, password);
  const encryptedContent = aesEncrypt(editedContent, password);

  database
    .prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?")
    .run(encryptedTitle, encryptedContent, postId);

  console.log("");
  console.log(chalk.green.bold(`${tick} Post updated successfully.`));
}

export function displayPost(content) {
  return new Promise((resolve, reject) => {
    const lessProcess = spawn("less", [], {
      stdio: ["pipe", "inherit", "inherit"],
    });

    lessProcess.stdin.write(content);
    lessProcess.stdin.end();

    lessProcess.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`less process exited with code ${code}`));
      }
    });
  });
}

export async function deletePost(postId) {
  database.prepare("DELETE FROM posts WHERE id = ?").run(postId);
  console.log("");
  console.log(chalk.green.bold(`${tick} Post deleted successfully.`));
}
