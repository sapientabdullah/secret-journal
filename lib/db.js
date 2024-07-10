import Database from "better-sqlite3";

const database = new Database("database.db");
database.pragma("journal_mode = WAL");
database.pragma("foreign_keys = ON");

database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY ASC,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMP,
    year INTEGER,
    month INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export { database };
