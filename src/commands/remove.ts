import { createStorage } from '../utils/storage';

export async function remove(profileName: string) {
    try {
        const storage = createStorage();
        await storage.deleteSession(profileName);
        console.log(`Session '${profileName}' deleted`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to delete session:', error);
        process.exit(1);
    }
} 