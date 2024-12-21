const addUser = async (db, id, token) => {
  const query = `INSERT INTO users (id, token) VALUES (${id}, "${token}")`;
  try {
    await db.runAsync(query);
    console.log("User added successfully");
  } catch (error) {
    console.log("Error in addUser", error);
  }
};

const getUsers = async (db) => {
  const query = `SELECT * FROM users`;
  try {
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.log("Error in getUsers", error);
  }
};

const deleteUser = async (db, id) => {
  const query = `DELETE FROM users WHERE id = ${id}`;
  try {
    await db.runAsync(query);
    console.log("User deleted successfully");
  } catch (error) {
    console.log("Error in deleteUser", error);
  }
};

const updateUser = async (db, id, token) => {
  const query = `UPDATE users SET token = "${token}" WHERE id = ${id}`;
  try {
    await db.runAsync(query);
    console.log("User updated successfully");
  } catch (error) {
    console.log("Error in updateUser", error);
  }
};

export { addUser, deleteUser, getUsers, updateUser };
