// database.js
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("customer.db");

db.serialize(() => {
  // Create the 'customer' table
  db.run(`
    CREATE TABLE IF NOT EXISTS customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      email TEXT NOT NULL,
      dateOfBirth TEXT NOT NULL,
      gender TEXT NOT NULL,
      age INTEGER NOT NULL,
      cardHolderName TEXT NOT NULL,
      cardNumber TEXT NOT NULL,
      expiryDate TEXT NOT NULL,
      cvv TEXT NOT NULL,
      timeStamp TEXT NOT NULL
    )
  `);
});

module.exports = db;
