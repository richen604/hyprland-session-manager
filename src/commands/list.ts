import { createStorage } from '../utils/storage';

export async function list() {
    try {
        const storage = createStorage();
        const sessions = await storage.listSessions();

        if (sessions.length === 0) {
            console.log('No saved sessions found');
            process.exit(0)
        }

        console.log('Saved sessions:');
        sessions.forEach(session => console.log(`- ${session}`));
        process.exit(0);
    } catch (error) {
        console.error('Failed to list sessions:', error);
        process.exit(1);
    }
} 