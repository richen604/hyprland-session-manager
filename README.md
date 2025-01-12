# Hyprland Session Manager

A command-line tool for managing Hyprland window manager sessions

> [!CAUTION]
> This project is currently in active development. not ready to add to your dotfiles yet! Feedback welcome.

## Features

- Save current window layouts and workspace configurations
- Restore previously saved sessions
- Manage multiple session profiles
- Command-line interface for easy integration

Future features:
- Auto save functionality
- systemd support
- hsm configuration file
- easy configurable sessions

Current limitations:
- Loading sessions will require closing all existing windows or else duplicates will be created
  - closing those windows would close the current terminal, work around is in progress
- hyprctl class titles used for running applications may not match the command used to launch them
- First runs command then moves to workspace, would ideally have this batched

## Prerequisites

- [Bun](https://bun.sh/) runtime
- [Hyprland](https://hyprland.org/) window manager
- Linux operating system

## Installation

### Git

```bash
git clone https://github.com/richen604/hyprland-session-manager
cd hyprland-session-manager
bun install
bun dev
```

### Using Bun

> [!NOTE]
> Bun installation will be available in a future release.

```bash
# Install using bun
bun install -g hyprland-session-manager
```

### Using Make
> [!NOTE]
> Make installation will be available in a future release.

```bash
# Clone the repository
git clone https://github.com/richen604/hyprland-session-manager
cd hyprland-session-manager

# Install using make
make
sudo make install
```

### Arch Linux (AUR)
> [!NOTE]
> AUR package will be available in a future release.

```bash
# Using your preferred AUR helper (e.g., yay)
yay -S hyprland-session-manager

# Or manually
git clone https://aur.archlinux.org/hyprland-session-manager.git
cd hyprland-session-manager
makepkg -si
```

## Usage

```bash
# Save current session
hsm save [profile-name]

# Restore a saved session
hsm restore [profile-name]

# List all saved sessions
hsm list

# Delete a saved session
hsm delete [profile-name]
```

## Configuration

Configuration file is located at `~/.config/hyprland-session-manager/config.json`

```json
{
  "savePath": "~/.local/share/hyprland-session-manager",
  "maxSessions": 10
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/richen604/hyprland-session-manager

# Install dependencies
bun install

# Run in dev mode
bun dev

# Run tests
bun test

# Build
bun build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) specification:
   ```bash
   # Examples:
   git commit -m 'feat: add new session backup feature'
   git commit -m 'fix: resolve workspace restoration issue'
   git commit -m 'docs: update installation instructions'
   ```
   The project uses semantic-release for automatic version management. Commit messages following the Conventional Commits specification will trigger automatic version updates:
   - `feat:` - Minor version bump (new feature)
   - `fix:` - Patch version bump (bug fix)
   - `BREAKING CHANGE:` - Major version bump
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- joshurtree's [Hyprsession](https://github.com/joshurtree/hyprsession) for inspiration

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.