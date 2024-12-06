import { pbkdf2 } from "crypto";

const masterPasswordStructure = {
    iteration_count: 600000,
    key_length: 32,
    digest: "sha256"
}

const derive_key = async (password, salt, iteration_count, key_length, digest) => {
    try {
        const derived_key = await new Promise((resolve, reject) => {
            pbkdf2(password, salt, iteration_count, key_length, digest, (err, derived_key) => {
                if (err) reject(err);
        
                resolve(derived_key);
            })
        })
    
        return derived_key;
    } catch (error) {
        throw error;
    }
}

export { derive_key, masterPasswordStructure }