<p align="center">
  <img width="500" src="https://utfs.io/f/e4fde66c-dea5-46c5-9b4b-9c83de8b633a-n3ch5g.png">
  <br>
  <i>Confidential Journaling @ the Speed of Thought</i>
  <br>
  <br>
  <a href="#"><img src="https://img.shields.io/badge/node-%3E=18.0.0-brightgreen.svg" alt="Node Version"></a>
</p>

![Demo](https://utfs.io/f/d23952bc-18a9-4bda-ae9d-2eb6afadb1e6-tz1yqs.gif)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Essential Commands for Post Creation](#essential-commands-for-post-creation)
- [Post Viewing Commands](#post-viewing-commands)
- [Command line Options](#command-line-options)
- [Editor Options](#editor-options)

## Features

- <strong>Secure Encryption:</strong> Protects your posts using AES-256 encryption
- <strong>User Authentication:</strong> Ensures only authorized users can access the journal
- <strong>Cross-Platform Compatibility:</strong> Works on Linux, macOS, and Windows
- <strong>Post Management:</strong> Create, view, edit, and delete journal entries
- <strong>Search Functionality:</strong> Easily find posts by keywords or dates
- <strong>Interactive Editor:</strong> Supports terminal-based text editors for seamless writing
- <strong>Hierarchical Post Viewing:</strong> View posts by year and month for easy navigation.
- <strong>Command Line Arguments:</strong> Perform specific actions directly from the terminal

## Installation

Before installing, ensure you have [downloaded and installed Node.js](https://nodejs.org/en/download/) version 18 or higher. Additionally, make sure you have at least one of the following text editors listed [here](#editor-options).

You can install the Secret Journal CLI globally using npm:

```bash
npm install -g secret-journal
```

# Quick Start

To use the CLI, just type `journal` in your terminal. If it’s your first time using it, an interactive tutorial will start automatically:

```bash
journal
```

![Initial tutorial upon first login](https://utfs.io/f/6b2deadc-3738-4531-bd17-82da642c51d3-pkje4t.png)

## Essential Commands for Post Creation

Here are essential commands to quickly get you up to speed with creating posts using your preferred text editor:

| Editor | Command               | Description          |
| ------ | --------------------- | -------------------- |
| Vim    | `i`                   | Enter insert mode    |
|        | `Esc`                 | Exit insert mode     |
|        | `:wq`                 | Save and quit        |
|        | `u`                   | Undo the last change |
| Neovim | `i`                   | Enter insert mode    |
|        | `Esc`                 | Exit insert mode     |
|        | `:wq`                 | Save and quit        |
|        | `u`                   | Undo the last change |
| Vi     | `i`                   | Enter insert mode    |
|        | `Esc`                 | Exit insert mode     |
|        | `:wq`                 | Save and quit        |
|        | `u`                   | Undo the last change |
| Nano   | `Ctrl + O`            | Save the file        |
|        | `Ctrl + X`            | Exit nano            |
| Emacs  | `Ctrl + X` `Ctrl + S` | Save the file        |
|        | `Ctrl + X` `Ctrl + C` | Exit emacs           |

## Post Viewing Commands

Use these commands while viewing a specific post:

- `j` goes one line down

- `k` goes one line up

- `d` goes one half page down

- `u` goes one half page up

- `/<term>` will search for a term

- `n` goes to the next search term

- `N` goes to the previous search term

## Command Line Options

It’s also possible to provide command-line arguments to perform specific actions and then exit the program. For example, `journal --create-post`

| Param         | Type    | Description                                                                                                                                                                                                       |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --new-user    | boolean | Register as a new user for managing separate journals or in case you forget your credentials                                                                                                                      |
| --create-post | boolean | Create a new post in your journal                                                                                                                                                                                 |
| --view-post   | boolean | Search for posts by keyword and view a specific post                                                                                                                                                              |
| --edit-post   | boolean | Search for posts by keyword and edit or delete a specific post                                                                                                                                                    |
| --set-editor  | boolean | Select a default text editor from the [available options](#editor-options) on your system to avoid repeated prompts to choose an editor                                                                           |
| --year        | string  | Hierarchical view of posts from a specific month and year. For instance, `--month=7 --year=2024` shows posts from July 2024. Omitting the `--year` flag displays posts from the entered month of the current year |
| --month       | string  | Hierarchical view of posts from a specific month and year                                                                                                                                                         |
| --help        | string  | Pass a flag such as `--help new-user` to learn about specific options, or use `--help` to view all available help options                                                                                         |

## Editor Options

The following terminal-based editors are compatible with Secret Journal. Ensure at least one of these is installed on your system for detection:

| Editor | Command | Available for                                                                               |
| ------ | ------- | ------------------------------------------------------------------------------------------- |
| Vim    | `vim`   | [Linux, macOS, Windows](https://www.vim.org/download.php)                                   |
| Neovim | `nvim`  | [Linux, macOS, Windows](https://github.com/neovim/neovim/blob/master/INSTALL.md)            |
| Vi     | `vi`    | Linux, macOS (preinstalled)                                                                 |
| Nano   | `nano`  | [Linux, macOS](https://www.hostinger.com/tutorials/how-to-install-and-use-nano-text-editor) |
| Emacs  | `emacs` | [Linux, macOS, Windows](https://www.gnu.org/software/emacs/download.html)                   |

You can also edit the `config.json` file to reset or change your default editor. This file is located in the `.secret-journal` directory in your home folder.

### Navigating to the `config.json` File

#### Unix, Linux, and macOS:

1. Open your terminal.
2. Navigate to the `.secret-journal` directory by running:

```bash
cd ~/.secret-journal
```

3. Open the config.json file in your preferred text editor. For example, to open it with nano, run:

```bash
nano config.json
```

#### Windows:

1. Open Command Prompt or PowerShell.
2. Navigate to the `.secret-journal` directory by running:

```powershell
cd $env:USERPROFILE\.secret-journal
```

3. Open the `config.json` file in your preferred text editor. For example, to open it with notepad, run:

```powershell
notepad config.json
```

### Editing the config.json File

The config.json file will contain a JSON object with the `defaultEditor` key if a default editor has been set; otherwise, it will be empty.

```json
{
  "defaultEditor": "vim"
}
```

To reset or change your default editor, update the value of the defaultEditor key to one of the listed commands, provided the editor is installed on your operating system. Save the file and close your text editor.
