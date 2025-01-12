import { mkdir, writeFile, readFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

// Types and interfaces
type ProfileName = string;

interface StorageOperations {
    saveSession: (data: any, profileName?: ProfileName) => Promise<void>;
    loadSession: (profileName?: ProfileName) => Promise<any>;
    listSessions: () => Promise<ProfileName[]>;
    deleteSession: (profileName: ProfileName) => Promise<void>;
}

// Constants
const PATHS = {
    DEFAULT_SAVE: join(homedir(), '.local', 'share', 'hyprland-session-manager'),
    DEFAULT_SESSION: 'default',
} as const;

// Path utility functions
const pathUtils = {
    getSessionPath: (basePath: string) => (profileName: ProfileName): string =>
        join(basePath, `${profileName}.json`),

    stripJsonExtension: (filename: string): string =>
        filename.replace('.json', ''),

    hasJsonExtension: (filename: string): boolean =>
        filename.endsWith('.json')
};

// File operation utilities
const fileOps = {
    ensureDirectory: async (path: string): Promise<void> => {
        await mkdir(path, { recursive: true });
    },

    writeJsonFile: async (path: string, data: any): Promise<void> =>
        await writeFile(path, JSON.stringify(data, null, 2)),

    writeConfFile: async (path: string, content: string): Promise<void> =>
        await writeFile(path, content, 'utf-8'),

    readJsonFile: async (path: string): Promise<any> =>
        JSON.parse(await readFile(path, 'utf-8')),

    listFiles: async (path: string): Promise<string[]> =>
        await readdir(path),

    deleteFile: async (path: string): Promise<void> =>
        await unlink(path).catch(() => {/* ignore if file doesn't exist */ })
};

// Main storage factory function
// #TODO: add conf file support, requires some more thought
export const createStorage = (savePath: string = PATHS.DEFAULT_SAVE): StorageOperations => {
    const getFullPath = pathUtils.getSessionPath(savePath);

    const saveSession = async (
        data: any,
        profileName: ProfileName = PATHS.DEFAULT_SESSION
    ): Promise<void> => {
        await fileOps.ensureDirectory(savePath);

        // Save both JSON and conf files
        await Promise.all([
            fileOps.writeJsonFile(getFullPath(profileName), data),
        ]);

    };

    const loadSession = async (
        profileName: ProfileName = PATHS.DEFAULT_SESSION
    ): Promise<any> => {
        const data = await fileOps.readJsonFile(getFullPath(profileName));

        return data;
    };

    const listSessions = async (): Promise<ProfileName[]> => {
        await fileOps.ensureDirectory(savePath);
        const files = await fileOps.listFiles(savePath);
        return files
            .filter(pathUtils.hasJsonExtension)
            .map(pathUtils.stripJsonExtension);
    };

    const deleteSession = async (profileName: ProfileName): Promise<void> => {
        await Promise.all([
            fileOps.deleteFile(getFullPath(profileName)),
        ]);
    };

    return {
        saveSession,
        loadSession,
        listSessions,
        deleteSession,
    };
}; 