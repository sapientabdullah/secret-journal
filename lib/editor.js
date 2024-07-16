// import readline from "readline";
import inquirer from "inquirer";
import chalk from "chalk";
import os from "os";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { tick } from "../index.js";

const configDir = path.join(os.homedir(), ".secret-journal");
const configPath = path.join(configDir, "config.json");

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

export function saveDefaultEditor(editor) {
  const config = { defaultEditor: editor };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function loadDefaultEditor() {
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      return config.defaultEditor;
    } catch (error) {
      return null;
    }
  }
  return null;
}

export function getFormattedDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export async function setDefaultEditor() {
  const availableEditors = getAvailableEditors();
  const editorAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "editor",
      message: "Select the editor you want to set as default:\n",
      choices: availableEditors,
    },
  ]);

  const selectedEditor = editorAnswer.editor;
  saveDefaultEditor(selectedEditor);
  console.log(
    chalk.green.bold(`\n${tick} Default editor set to ${selectedEditor}`)
  );
}

function getAvailableEditors() {
  const editors = [
    { name: "vim", command: "vim" },
    { name: "nvim", command: "nvim" },
    { name: "nano", command: "nano" },
    { name: "vi", command: "vi" },
    { name: "emacs", command: "emacs" },
  ];

  return editors
    .filter((editor) => isEditorAvailable(editor.command))
    .map((editor) => ({ name: editor.name, value: editor.command }));
}

function isEditorAvailable(command) {
  try {
    if (os.platform() === "win32") {
      execSync(`where ${command}`, { stdio: "ignore" });
    } else {
      execSync(`which ${command}`, { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

export async function capturePost() {
  const date = getFormattedDate(new Date());

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the post title:",
      },
    ]);

    const title = answers.title;
    const defaultContent = `Date: ${date}\n\n"${title}"\n\n`;

    let editorCommand = loadDefaultEditor();

    if (!editorCommand) {
      const availableEditors = getAvailableEditors();
      const editorAnswer = await inquirer.prompt([
        {
          type: "list",
          name: "editor",
          message: "Select the editor you want to use:\n",
          choices: availableEditors,
        },
      ]);

      editorCommand = editorAnswer.editor;
    }

    const tempFilePath = path.join(
      os.tmpdir(),
      `secret-journal-${Date.now()}.txt`
    );
    fs.writeFileSync(tempFilePath, defaultContent);

    execSync(`${editorCommand} ${tempFilePath}`, { stdio: "inherit" });

    const content = fs.readFileSync(tempFilePath, "utf8");

    fs.unlinkSync(tempFilePath);

    return { title, content, date };
  } catch (error) {
    console.error("Error occurred while capturing post:", error);
    return null;
  }
}

// Implementation using readline interface...

// export function capturePost() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   const date = getFormattedDate(new Date());
//   console.log(`\nDate: ${date}`);

//   return new Promise((resolve) => {
//     rl.question("\nEnter the post title: ", (postTitle) => {
//       const title = postTitle;
//       console.log(`\n"${postTitle}"\n`);
//       console.log(
//         'Enter your text (type "SAVE" on a new line to save and exit or "EXIT" to exit without saving):'
//       );
//       let content = `Date: ${date}\n${title}\n\n`;

//       let currentLine = "";

//       rl.input.on("keypress", (character, key) => {
//         if (key.name === "backspace") {
//           if (currentLine.length > 0) {
//             currentLine = currentLine.slice(0, -1);
//             readline.moveCursor(process.stdout, -1, 0);
//             readline.clearLine(process.stdout, 1);
//           }
//         } else if (key.name === "return") {
//           content += currentLine + "\n";
//           currentLine = "";
//         } else {
//           currentLine += character;
//         }
//       });

//       rl.on("line", (input) => {
//         if (input === "SAVE") {
//           rl.close();
//           resolve({ title, content });
//         } else if (input === "EXIT") {
//           rl.close();
//           resolve(null);
//         } else {
//           content += input + "\n";
//           currentLine = "";
//         }
//       });
//     });
//   });
// }

// export function capturePost() {
//   const date = getFormattedDate(new Date());

//   return inquirer
//     .prompt([
//       {
//         type: "input",
//         name: "title",
//         message: "Enter the post title:",
//       },
//     ])
//     .then(async (answers) => {
//       const title = answers.title;

//       const defaultContent = `Date: ${date}\n\n${title}\n\n`;

//       const { content } = await inquirer.prompt([
//         {
//           type: "editor",
//           name: "content",
//           message: "Enter your text (press Ctrl+O to save and Ctrl+X to exit):",
//           default: defaultContent,
//         },
//       ]);

//       return { title, content };
//     })
//     .catch((error) => {
//       console.error("Error occurred while capturing post:", error);
//       return null;
//     });
// }
