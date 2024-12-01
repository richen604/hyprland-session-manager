#!/usr/bin/env bun
import { program } from 'commander';
import { version } from '../package.json';
import { save, restore, list, remove } from './commands';

program
    .name('hsm')
    .description('Hyprland Session Manager')
    .version(version);

program
    .command('save')
    .description('Save current session')
    .argument('[profile-name]', 'Name of the profile to save')
    .action(save);

program
    .command('restore')
    .description('Restore a saved session')
    .argument('[profile-name]', 'Name of the profile to restore')
    .action(restore);

program
    .command('list')
    .description('List all saved sessions')
    .action(list);

program
    .command('delete')
    .description('Delete a saved session')
    .argument('<profile-name>', 'Name of the profile to delete')
    .action(remove);

program.parse(); 