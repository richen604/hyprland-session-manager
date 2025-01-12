import { getCurrentSession } from '../utils/hyprctl';
import { createStorage } from '../utils/storage';

export async function save(profileName?: string) {
    try {
        const storage = createStorage();
        const sessionData = await getCurrentSession();

        await storage.saveSession(sessionData, profileName);
        console.log(`Session saved${profileName ? ` as '${profileName}'` : ''}`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to save session:', error);
        process.exit(1);
    }
} 