const setVault = async (db, vault) => {
    try {
        console.log(vault)
        const query = `INSERT INTO vaults (id, user_id, protected_symmetric_key, mac) VALUES (?, ?, ?, ?)`;

        await db.runAsync(query, [vault.id, vault.user_id, vault.protected_symmetric_key, vault.mac]);
        console.log("Set vault successfully");
    } catch (error) {
        console.error(`Set Vault Error: ${error}`);
    }
}

const getVault = async (db, user_id) => {
    try {
        const query = `SELECT id, protected_symmetric_key, mac FROM vaults WHERE user_id=?`;
        const result = await db.getFirstAsync(query, [user_id]);

        return result;
    } catch (error) {
        console.error(`Get Vault Error: ${error}`);
    }
}

const deleteVault = async (db, user_id) => {
    try {
        const query = `DELETE FROM vaults WHERE user_id=?`;

        await db.runAsync(query, [user_id]);
        console.log("Delete vault successfully");
    } catch (error) {
        console.error(`Delete Vault Error: ${error}`);
    }
}

export { deleteVault, getVault, setVault }