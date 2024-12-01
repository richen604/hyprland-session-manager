# Hyprland Session Manager

A command-line tool for managing Hyprland window manager sessions, built with Bun and TypeScript.

## Features

- Save current window layouts and workspace configurations
- Restore previously saved sessions
- Manage multiple session profiles
- Auto save functionality
- Command-line interface for easy integration

## Prerequisites

- [Bun](https://bun.sh/) runtime
- [Hyprland](https://hyprland.org/) window manager
- Linux operating system

## Installation

### Using Bun
```bash
# Install using bun
bun install -g hyprland-session-manager
```

### Using Make
```bash
# Clone the repository
git clone https://github.com/yourusername/hyprland-session-manager
cd hyprland-session-manager

# Install using make
make
sudo make install
```

### Arch Linux (AUR)
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
git clone https://github.com/yourusername/hyprland-session-manager

# Install dependencies
bun install

# Run tests
bun test

# Build
bun build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- joshurtree's [Hyprsession](https://github.com/joshurtree/hyprsession) for inspiration

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.