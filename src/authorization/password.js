import { derive_key, masterPasswordStructure } from "./utils.js";

const create_master_password_hash = async (password, salt) => {
    const iteration_count = masterPasswordStructure.iteration_count;
    const key_length = masterPasswordStructure.key_length;
    const digest = masterPasswordStructure.digest;

    try {
        const master_key = await derive_key(password, salt, iteration_count, key_length, digest);
        const master_password_hash = await derive_key(master_key, password, 1, key_length, digest);
        
        return master_password_hash.toString("hex");
    } catch (error) {
        throw error;
    }
}

export { create_master_password_hash }