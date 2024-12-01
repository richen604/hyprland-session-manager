# Maintainer: Richard Henninger <your.email@example.com>
pkgname=hyprland-session-manager
pkgver=0.1.0
pkgrel=1
pkgdesc="A command-line tool for managing Hyprland window manager sessions"
arch=('x86_64')
url="https://github.com/richen604/hyprland-session-manager"
license=('MIT')
depends=('bun' 'hyprland')
makedepends=('git')
source=("$pkgname::git+$url.git")
sha256sums=('SKIP')

package() {
    cd "$srcdir/$pkgname"
    make install DESTDIR="$pkgdir"
} 