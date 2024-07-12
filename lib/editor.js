// import readline from "readline";
import inquirer from "inquirer";
import os from "os";

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

    const editorCommand = getDefaultEditorCommand();
    const saveExitCommand = getSaveExitCommand(editorCommand);
    const exitWithoutSaveCommand = getExitWithoutSaveCommand(editorCommand);

    console.log("");

    const { content } = await inquirer.prompt([
      {
        type: "editor",
        name: "content",
        message: `Enter your text using ${editorCommand}. Save and Exit (${saveExitCommand}), Exit without Saving (${exitWithoutSaveCommand}):`,
        default: defaultContent,
        editor: editorCommand,
      },
    ]);

    return { title, content, date };
  } catch (error) {
    console.error("Error occurred while capturing post:", error);
    return null;
  }
}

function getDefaultEditorCommand() {
  const platform = os.platform();
  switch (platform) {
    case "linux":
    case "darwin":
      return "vim";
    case "win32":
      return "notepad";
    default:
      return "nano";
  }
}

function getSaveExitCommand(editorCommand) {
  switch (editorCommand) {
    case "vim":
      return ":wq";
    case "notepad":
      return "Ctrl+S and Alt+F4";
    default:
      return "Ctrl+O to save and Ctrl+X to exit";
  }
}

function getExitWithoutSaveCommand(editorCommand) {
  switch (editorCommand) {
    case "vim":
      return ":q!";
    case "notepad":
      return "Alt+F4";
    default:
      return "Ctrl+C to exit without saving";
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
