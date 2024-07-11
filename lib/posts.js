import { database } from "./db.js";
import { tick } from "../index.js";

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
      return `No posts found for the year ${year}.`;
    }
    return posts;
  } catch (error) {
    console.error("Error occurred while fetching posts by year:", error);
    return `Error occurred while fetching posts: ${error.message}`;
  }
}
