import readline from "readline";

export function capturePost() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const date = getFormattedDate(new Date());
  console.log(`\nDate: ${date}`);

  return new Promise((resolve) => {
    rl.question("\nEnter the post title: ", (postTitle) => {
      const title = postTitle;
      console.log(`\n"${postTitle}"\n`);
      console.log(
        'Enter your text (type "SAVE" on a new line to save and exit or "EXIT" to exit without saving):'
      );
      let content = `Date: ${date}\n${title}\n\n`;

      let currentLine = "";

      rl.input.on("keypress", (character, key) => {
        if (key.name === "backspace") {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            readline.moveCursor(process.stdout, -1, 0);
            readline.clearLine(process.stdout, 1);
          }
        } else if (key.name === "return") {
          content += currentLine + "\n";
          currentLine = "";
        } else {
          currentLine += character;
        }
      });

      rl.on("line", (input) => {
        if (input === "SAVE") {
          rl.close();
          resolve({ title, content });
        } else if (input === "EXIT") {
          rl.close();
          resolve(null);
        } else {
          content += input + "\n";
          currentLine = "";
        }
      });
    });
  });
}