const dbSetPassword = async (db, password) => {
    try {
        const query = `INSERT INTO passwords (id, vault_id, username, app_name, password, uri) VALUES (?, ?, ?, ?, ?, ?)`;

        await db.runAsync(query, [password.id, password.vault_id, password.username, password.app_name, password.password, password.uri]);
        console.log("Set vault successfully");
    } catch (error) {
        console.log(error);
    }
}

const dbSetPasswords = async (db, passwords) => {
    try {
        const placeholders = passwords
            .map(() => '(?, ?, ?, ?, ?, ?)')  // 5 değer (id, vault_id, username, app_name, password, uri) için yer tutucu
            .join(', '); // Her bir yer tutucuyu virgülle ayırıyoruz

        // SQL sorgusu oluşturuluyor
        const query = `INSERT INTO passwords (id, vault_id, username, app_name, password, uri) VALUES ${placeholders}`;

        // Parametreleri sırasıyla düz bir liste haline getiriyoruz
        const params = passwords.flatMap(password => [
            password.id,  // id değerini manuel veriyorsanız
            password.vault_id,
            password.username,
            password.app_name,
            password.encrypted_password,  // encrypted_password kullanıyorsunuz
            password.uri
        ]);

        console.log(params)

        // SQL sorgusunu çalıştırıyoruz
        await db.runAsync(query, params);

        console.log("Passwords set successfully.");
    } catch (error) {
        console.log(error);
    }
}

const getPasswords = async (db, vault_id) => {
    console.log(vault_id)
    try {
        const query = `SELECT * FROM passwords WHERE vault_id=?`;
        const result = await db.getAllAsync(query, [vault_id]);

        console.log(result)

        return result;
    } catch (error) {
        console.log(error);
    }
}

const getPassword = async (db, id) => {
    try {
        const query = `SELECT * FROM passwords WHERE id=?`;
        const result = await db.getFirstAsync(query, [id]);

        return result;
    } catch (error) {
        console.log(error);
    }
}

const deletePassword = async (db, id) => {
    try {
        const query = `DELETE FROM password WHERE id=?`;

        await db.runAsync(query, [id]);
        console.log("Delete vault successfully");
    } catch (error) {
        console.log(error);
    }
}

const deletePasswords = async (db, vault_id) => {
    try {
        const query = `DELETE FROM password WHERE vault_id=?`;

        await db.runAsync(query, [vault_id]);
        console.log("Delete vault successfully");
    } catch (error) {
        console.log(error);
    }
}

export { dbSetPassword, deletePassword, getPassword, dbSetPasswords, getPasswords, deletePasswords }