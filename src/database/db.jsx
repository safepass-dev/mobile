const initializeDatabase = async (db) => {
  try {
    const query = `PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT
    );`;
    await db.execAsync(query);
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error in initializeDatabase", error);
  }
};

export default initializeDatabase;
