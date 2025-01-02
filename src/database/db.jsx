import { defaultDatabaseDirectory } from "expo-sqlite";

const initializeDatabase = async (db) => {
  try {
    const tablesQuery = `
        PRAGMA journal_mode=WAL;

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            token VARCHAR
        );

        CREATE TABLE IF NOT EXISTS vaults (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            protected_symmetric_key VARCHAR,
            mac VARCHAR
        );

        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY,
            vault_id INTEGER,
            app_name VARCHAR,
            username VARCHAR,
            password VARCHAR,
            uri VARCHAR
        );
    `;

    await db.execAsync(tablesQuery);
    const result = await db.execAsync(`SELECT sql FROM sqlite_schema WHERE name='users';`);
    console.log("Table Info:", result);
    
    await db.execAsync("DELETE FROM users");
    await db.execAsync("DELETE FROM vaults");
    await db.execAsync("DELETE FROM passwords");

    console.log(defaultDatabaseDirectory)

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error in initializeDatabase", error);
  }
};

export default initializeDatabase;
