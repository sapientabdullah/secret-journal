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

Before installing, ensure you have [downloaded and installed Node.js](https://nodejs.org/en/download/) version 18 or higher. Additionally, make sure you have at least one of the following text editors listed [here]().

You can install the Secret Journal CLI globally using npm:

```bash
npm install -g secret-journal
```

# Quick start

To use the CLI, just type `journal` in your terminal. If it’s your first time using it, an interactive tutorial will start automatically:

```bash
journal
```

![Initial tutorial upon first login](https://utfs.io/f/6b2deadc-3738-4531-bd17-82da642c51d3-pkje4t.png)

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
| --set-editor  | boolean | Select a default text editor from the available options on your system                                                                                                                                            |
| --year        | string  | Hierarchical view of posts from a specific month and year. For instance, `--month=7 --year=2024` shows posts from July 2024. Omitting the `--year` flag displays posts from the entered month of the current year |
| --month       | string  | Hierarchical view of posts from a specific month and year                                                                                                                                                         |
| --help        | string  | Pass a flag such as `--help new-user` to learn about specific options, or use `--help` to view all available help options                                                                                         |
