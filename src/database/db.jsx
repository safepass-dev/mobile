const initializeDatabase = async (db) => {
  try {
    const query = `PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      token VARCHAR
    );`;
    await db.execAsync(query);
    await db.execAsync("DELETE FROM users");
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error in initializeDatabase", error);
  }
};

export default initializeDatabase;
