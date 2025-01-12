import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

const execAsync = promisify(exec);

interface Window {
    address: string;
    workspace: {
        id: number;
        name: string;
    };
    at: [number, number];
    size: [number, number];
    class: string;
    title: string;
}

interface SessionData {
    windows: Window[];
}

// Execute hyprctl command and return the output
async function executeHyprctl(command: string): Promise<string> {
    try {
        const { stdout } = await execAsync(`hyprctl ${command}`);
        return stdout;
    } catch (error) {
        throw new Error(`Failed to execute hyprctl command: ${error}`);
    }
}

// Get current session state including window positions and workspaces
export async function getCurrentSession(): Promise<SessionData> {
    try {
        const clientsJson = await executeHyprctl('clients -j');

        // Add debug logging
        console.log('Raw hyprctl output:', clientsJson);

        // Check if the output is empty or invalid
        if (!clientsJson.trim()) {
            console.log('No windows detected - returning empty array');
            return { windows: [] };
        }

        const windows = JSON.parse(clientsJson);

        // Validate that windows is an array
        if (!Array.isArray(windows)) {
            console.log('Unexpected data structure:', windows);
            return { windows: [] };
        }

        console.log('Parsed windows:', windows);
        return { windows };
    } catch (error) {
        console.error('Error in getCurrentSession:', error);
        throw new Error(`Failed to get current session: ${error}`);
    }
}

// Helper function to map window classes to launch commands
function getApplicationCommand(windowClass: string): string {
    // Special cases where the window class doesn't match the executable name
    const specialCases: Record<string, string> = {
        'google-chrome': 'google-chrome-stable',
        'gnome-terminal': 'gnome-terminal-server',
        'cursor-url-handler': 'cursor',
        // #TODO: user configurable cases, hsm defaults
    };

    const cleanClassName = windowClass.toLowerCase().trim();
    const command = specialCases[cleanClassName] || cleanClassName;
    return `/usr/bin/env ${command}`;
}


// Restore a saved session
export async function restoreSession(sessionData: SessionData): Promise<void> {
    try {
        console.log('Starting session restore with data:', sessionData);

        if (!sessionData?.windows?.length) {
            console.log('No windows to restore - session data is empty');
            return;
        }

        // Get current active window (terminal running this command)
        const activeWindow = await executeHyprctl('activewindow -j').then(JSON.parse);

        // Close all windows except the active terminal
        const initialSession = await getCurrentSession();
        for (const window of initialSession.windows) {
            if (window.address !== activeWindow.address) {
                await executeHyprctl(`dispatch closewindow address:${window.address}`);
            }
        }

        // Group windows by class to handle duplicates
        const windowsByClass = sessionData.windows.reduce((acc, window) => {
            if (!acc[window.class]) {
                acc[window.class] = [];
            }
            acc[window.class].push(window);
            return acc;
        }, {} as Record<string, Window[]>);

        // Launch applications
        const launchCommands = Object.entries(windowsByClass)
            .flatMap(([windowClass, windows]) => {
                return Array(windows.length).fill(`dispatch exec ${getApplicationCommand(windowClass)}`);
            })
            .join(' ; ');

        if (launchCommands) {
            await executeHyprctl(`--batch "${launchCommands}"`);
        }

        // Wait for windows to appear
        console.log('Waiting for windows to appear...');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get current windows to position them
        const currentSession = await getCurrentSession();

        // Group current windows by class
        const currentWindowsByClass = currentSession.windows.reduce((acc, window) => {
            if (!acc[window.class]) {
                acc[window.class] = [];
            }
            acc[window.class].push(window);
            return acc;
        }, {} as Record<string, Window[]>);

        // Position all windows in a single batch command
        const positionCommands = Object.entries(windowsByClass)
            .flatMap(([windowClass, savedWindows]) => {
                const currentWindows = currentWindowsByClass[windowClass] || [];
                return savedWindows.map((savedWindow, index) => {
                    const currentWindow = currentWindows[index];
                    if (!currentWindow) return [];

                    const commands: string[] = [];
                    if (savedWindow.workspace) {
                        // #TODO: special workspaces don't work correctly
                        commands.push(`dispatch movetoworkspace ${savedWindow.workspace.id},address:${currentWindow.address}`);
                    }
                    commands.push(
                        `dispatch movewindow exact ${savedWindow.at[0]} ${savedWindow.at[1]}`,
                        `dispatch resize exact ${savedWindow.size[0]} ${savedWindow.size[1]}`
                    );
                    return commands;
                }).flat();
            })
            .filter(cmd => cmd)
            .join(' ; ');

        if (positionCommands) {
            await executeHyprctl(`--batch "${positionCommands}"`);
        }

        console.log('Session restore completed successfully');
    } catch (error) {
        console.error('Detailed restore error:', error);
        throw new Error(`Failed to restore session: ${error}`);
    }
}

// Generate Hyprland rules for the session
function generateSessionRules(sessionData: SessionData): string {
    let rules = '# Generated by Hyprland Session Manager\n\n';

    sessionData.windows.forEach((window, index) => {
        rules += `windowrule = move ${window.at[0]} ${window.at[1]},^${window.class}$\n`;
        rules += `windowrule = size ${window.size[0]} ${window.size[1]},^${window.class}$\n`;
        rules += `windowrule = workspace ${window.workspace.name},^${window.class}$\n\n`;
    });

    return rules;
}

// Ensure the session config is sourced in Hyprland config
async function ensureSourceInHyprlandConfig(): Promise<void> {
    const configPath = join(homedir(), '.config', 'hypr', 'hyprland.conf');
    const sourceLine = 'source = ~/.local/share/hyprland-session-manager/sessions/active.conf';

    try {
        const config = await readFile(configPath, 'utf-8');
        if (!config.includes(sourceLine)) {
            await writeFile(configPath, `${config}\n${sourceLine}\n`);
        }
    } catch (error) {
        throw new Error(`Failed to update Hyprland config: ${error}`);
    }
}

