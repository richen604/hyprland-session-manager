PREFIX ?= /usr
DESTDIR ?=

.PHONY: all install uninstall clean

all: build

build:
	bun install
	bun run build

install:
	install -Dm755 dist/index.js $(DESTDIR)$(PREFIX)/bin/hsm

uninstall:
	rm -f $(DESTDIR)$(PREFIX)/bin/hsm

clean:
	rm -rf dist node_modules 