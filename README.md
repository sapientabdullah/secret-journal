<p align="center">
  <i>Confidential Journaling @ the Speed of Thought</i>
  <br>
  <br>
  <a href="#"><img src="https://img.shields.io/badge/node-%3E=18.0.0-brightgreen.svg" alt="Node Version"></a>
</p>

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Essential Commands for Post Creation](#essential-commands-for-post-creation)
- [Post viewing commands](#post-viewing-commands)
- [Command line options](#command-line-options)

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

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 18 or above is required

You can install the Secret Journal CLI globally using npm:

```bash
npm install -g secret-journal
```

# Quick start

When you first use the CLI, simply enter `journal` in your terminal to start a guided tutorial:

```bash
journal
```

![Initial tutorial upon first login](https://utfs.io/f/e08b0af2-5ecc-4c8e-8f28-c2147e5fb830-2lpc7r.png)

## Essential Commands for Post Creation

Here are essential [Vim](https://www.vim.org/) commands to quickly get you up to speed with creating posts if it’s your preferred text editor:

1. Once in Vim, press `i` to enter insert mode and make desired changes
2. Press `Esc` and `u` to undo the last change
3. Press `Esc` to exit insert mode, and type `:wq` to save and quit

## Post viewing commands

Use these commands while viewing a specific post:

- `j` goes one line down

- `k` goes one line up

- `d` goes one half page down

- `u` goes one half page up

- `/<term>` will search for a term

- `n` goes to the next search term

- `N` goes to the previous search term

## Command line options

It’s also possible to provide command-line arguments to perform specific actions and then exit the program. For example, `journal --create-post`

| Param         | Type    | Description                                                                                                                                                                                                       |
| ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --new-user    | boolean | Register as a new user for managing separate journals or in case you forget your credentials                                                                                                                      |
| --create-post | boolean | Create a new post in your journal                                                                                                                                                                                 |
| --view-post   | boolean | Search for posts by keyword and view a specific post                                                                                                                                                              |
| --edit-post   | boolean | Search for posts by keyword and edit or delete a specific post                                                                                                                                                    |
| --year        | string  | Hierarchical view of posts from a specific month and year. For instance, `--month=7 --year=2024` shows posts from July 2024. Omitting the `--year` flag displays posts from the entered month of the current year |
| --month       | string  | Hierarchical view of posts from a specific month and year                                                                                                                                                         |
| --help        | string  | Pass a flag such as `--help new-user` to learn about specific options, or use `--help` to view all available help options                                                                                         |
