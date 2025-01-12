import { restoreSession } from '../utils/hyprctl';
import { createStorage } from '../utils/storage';

export async function restore(profileName?: string) {
    try {
        const storage = createStorage();
        const sessionData = await storage.loadSession(profileName);
        await restoreSession(sessionData);
        console.log(`Session restored${profileName ? ` from '${profileName}'` : ''}`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to restore session:', error);
        process.exit(1);
    }
} 