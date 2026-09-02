# RabbitClick — Autoclicker

A small, configurable autoclicker with a desktop GUI. Set an interval, a
mouse button, a click position, and an optional repeat limit, then start it
from the window or with a global hotkey (default `F6`).

## Features

- Interval control in hours / minutes / seconds / milliseconds
- Left, right, or middle mouse button; single or double click
- Click at the current cursor position, or a fixed point (pick it with a
  3-second countdown, or type coordinates directly)
- Repeat forever or for a fixed number of clicks (auto-stops when reached)
- Global start/stop hotkey, configurable from the UI
- Remembers your last settings between runs (`~/.rabbitclick_config.json`)

## Running from source

Requires Python 3.8+.

```bash
cd autoclicker
pip install -r requirements.txt
python autoclicker.py
```

**Linux only:** Tkinter isn't always bundled with Python. If `python
autoclicker.py` complains about a missing `tkinter` module, install it with
your package manager, e.g. `sudo apt install python3-tk` (Debian/Ubuntu) or
`sudo dnf install python3-tkinter` (Fedora).

**Linux + Wayland:** global mouse/keyboard control (via `pynput`) needs an
X11 session. Under Wayland the hotkey and/or clicking may not work; log into
an "Xorg" / "X11" session instead, or run under XWayland.

## Building a standalone executable

You don't need Python installed to *run* the built executable — only to
*build* it. Build on the same OS you want to run it on (PyInstaller does not
cross-compile).

```bash
pip install -r requirements.txt
pip install pyinstaller
pyinstaller --onefile --windowed --name RabbitClick autoclicker.py
```

The finished executable is written to `dist/` (`dist/RabbitClick.exe` on
Windows, `dist/RabbitClick` on macOS/Linux). Copy that one file anywhere and
double-click (or run) it — no separate Python install needed on the target
machine.

## Usage notes

- Windows/macOS may show a security prompt for unsigned executables, and
  macOS may require enabling Accessibility permissions for the app so it can
  control the mouse and listen for the global hotkey (System Settings →
  Privacy & Security → Accessibility).
- Use this responsibly: automating clicks can violate the terms of service
  of some games, apps, and websites. You're responsible for how you use it.
