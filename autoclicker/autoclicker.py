#!/usr/bin/env python3
"""RabbitClick — a small, configurable autoclicker with a Tkinter GUI.

Runs on Windows, macOS, and Linux (X11) with a plain Python install.
See README.md in this folder for setup and how to build a standalone
executable with PyInstaller.
"""

import json
import threading
import time
from pathlib import Path

import tkinter as tk
from tkinter import ttk, messagebox

from pynput import keyboard, mouse

CONFIG_PATH = Path.home() / ".rabbitclick_config.json"

MOUSE_BUTTONS = {
    "Left": mouse.Button.left,
    "Right": mouse.Button.right,
    "Middle": mouse.Button.middle,
}

DEFAULT_CONFIG = {
    "hours": 0,
    "minutes": 0,
    "seconds": 0,
    "milliseconds": 100,
    "button": "Left",
    "click_type": "Single",
    "position_mode": "current",
    "pos_x": 0,
    "pos_y": 0,
    "repeat_mode": "until_stopped",
    "repeat_count": 100,
    "hotkey": "F6",
}


def parse_key(name):
    """Turn a human-readable key name ('F6', 'A', 'space') into a pynput key."""
    name = name.strip()
    if len(name) == 1:
        return keyboard.KeyCode.from_char(name.lower())
    try:
        return keyboard.Key[name.lower()]
    except KeyError:
        raise ValueError(f"Unrecognized key: {name}")


def keys_match(pressed, target):
    if isinstance(pressed, keyboard.KeyCode) and isinstance(target, keyboard.KeyCode):
        return pressed.char is not None and pressed.char.lower() == target.char.lower()
    return pressed == target


def key_display_name(key):
    if isinstance(key, keyboard.KeyCode):
        return (key.char or "?").upper()
    return key.name.upper()


class AutoClickerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("RabbitClick — Autoclicker")
        self.root.resizable(False, False)

        self.config_data = self.load_config()

        self.running = False
        self.stop_event = threading.Event()
        self.click_thread = None
        self.click_count = 0

        self.mouse_controller = mouse.Controller()

        self.capturing_hotkey = False
        self.hotkey = parse_key(self.config_data["hotkey"])
        self.hotkey_display = tk.StringVar(value=self.config_data["hotkey"].upper())

        self._build_ui()
        self._start_hotkey_listener()

        self.root.protocol("WM_DELETE_WINDOW", self._on_close)

    # ----- persistence -----------------------------------------------
    def load_config(self):
        data = dict(DEFAULT_CONFIG)
        if CONFIG_PATH.exists():
            try:
                saved = json.loads(CONFIG_PATH.read_text())
                data.update({k: v for k, v in saved.items() if k in DEFAULT_CONFIG})
            except (json.JSONDecodeError, OSError):
                pass
        return data

    def save_config(self):
        try:
            CONFIG_PATH.write_text(json.dumps(self.config_data, indent=2))
        except OSError:
            pass

    # ----- UI construction ---------------------------------------------
    def _build_ui(self):
        pad = {"padx": 10, "pady": 6}
        main = ttk.Frame(self.root, padding=12)
        main.grid(row=0, column=0)

        # Interval
        interval_frame = ttk.LabelFrame(main, text="Click interval")
        interval_frame.grid(row=0, column=0, sticky="ew", **pad)

        self.hours_var = tk.StringVar(value=str(self.config_data["hours"]))
        self.minutes_var = tk.StringVar(value=str(self.config_data["minutes"]))
        self.seconds_var = tk.StringVar(value=str(self.config_data["seconds"]))
        self.millis_var = tk.StringVar(value=str(self.config_data["milliseconds"]))

        for i, (label, var) in enumerate(
            [
                ("Hours", self.hours_var),
                ("Minutes", self.minutes_var),
                ("Seconds", self.seconds_var),
                ("Milliseconds", self.millis_var),
            ]
        ):
            ttk.Label(interval_frame, text=label).grid(row=0, column=2 * i, padx=(8, 2), pady=6)
            ttk.Spinbox(interval_frame, from_=0, to=999999, width=6, textvariable=var).grid(
                row=0, column=2 * i + 1, padx=(0, 8), pady=6
            )

        # Click options
        opts_frame = ttk.LabelFrame(main, text="Click options")
        opts_frame.grid(row=1, column=0, sticky="ew", **pad)

        ttk.Label(opts_frame, text="Mouse button:").grid(row=0, column=0, sticky="w", padx=8, pady=4)
        self.button_var = tk.StringVar(value=self.config_data["button"])
        for i, name in enumerate(MOUSE_BUTTONS):
            ttk.Radiobutton(opts_frame, text=name, value=name, variable=self.button_var).grid(
                row=0, column=i + 1, padx=4
            )

        ttk.Label(opts_frame, text="Click type:").grid(row=1, column=0, sticky="w", padx=8, pady=4)
        self.click_type_var = tk.StringVar(value=self.config_data["click_type"])
        for i, name in enumerate(["Single", "Double"]):
            ttk.Radiobutton(opts_frame, text=name, value=name, variable=self.click_type_var).grid(
                row=1, column=i + 1, padx=4, sticky="w"
            )

        # Cursor position
        pos_frame = ttk.LabelFrame(main, text="Cursor position")
        pos_frame.grid(row=2, column=0, sticky="ew", **pad)

        self.position_var = tk.StringVar(value=self.config_data["position_mode"])
        ttk.Radiobutton(
            pos_frame, text="Current location", value="current", variable=self.position_var
        ).grid(row=0, column=0, sticky="w", padx=8, pady=4, columnspan=4)
        ttk.Radiobutton(
            pos_frame, text="Fixed location:", value="fixed", variable=self.position_var
        ).grid(row=1, column=0, sticky="w", padx=8, pady=4)

        self.pos_x_var = tk.StringVar(value=str(self.config_data["pos_x"]))
        self.pos_y_var = tk.StringVar(value=str(self.config_data["pos_y"]))
        ttk.Label(pos_frame, text="X").grid(row=1, column=1, sticky="e")
        ttk.Entry(pos_frame, width=6, textvariable=self.pos_x_var).grid(row=1, column=2, padx=2)
        ttk.Label(pos_frame, text="Y").grid(row=1, column=3, sticky="e")
        ttk.Entry(pos_frame, width=6, textvariable=self.pos_y_var).grid(row=1, column=4, padx=2)

        self.pick_button = ttk.Button(pos_frame, text="Pick location", command=self._start_pick_location)
        self.pick_button.grid(row=1, column=5, padx=8)

        # Repeat
        repeat_frame = ttk.LabelFrame(main, text="Click repeat")
        repeat_frame.grid(row=3, column=0, sticky="ew", **pad)

        self.repeat_var = tk.StringVar(value=self.config_data["repeat_mode"])
        ttk.Radiobutton(
            repeat_frame, text="Repeat until stopped", value="until_stopped", variable=self.repeat_var
        ).grid(row=0, column=0, sticky="w", padx=8, pady=4, columnspan=2)
        ttk.Radiobutton(
            repeat_frame, text="Repeat count:", value="count", variable=self.repeat_var
        ).grid(row=1, column=0, sticky="w", padx=8, pady=4)
        self.repeat_count_var = tk.StringVar(value=str(self.config_data["repeat_count"]))
        ttk.Entry(repeat_frame, width=8, textvariable=self.repeat_count_var).grid(
            row=1, column=1, sticky="w", padx=2
        )

        # Hotkey
        hotkey_frame = ttk.LabelFrame(main, text="Toggle hotkey")
        hotkey_frame.grid(row=4, column=0, sticky="ew", **pad)
        ttk.Label(hotkey_frame, textvariable=self.hotkey_display, width=8, anchor="center").grid(
            row=0, column=0, padx=8, pady=6
        )
        self.set_hotkey_btn = ttk.Button(hotkey_frame, text="Set hotkey", command=self._begin_capture_hotkey)
        self.set_hotkey_btn.grid(row=0, column=1, padx=8)
        ttk.Label(hotkey_frame, text="Press this key anywhere to start/stop clicking.").grid(
            row=0, column=2, padx=8
        )

        # Controls / status
        control_frame = ttk.Frame(main)
        control_frame.grid(row=5, column=0, sticky="ew", **pad)

        self.start_button = ttk.Button(control_frame, text="Start", command=self.start_clicking)
        self.start_button.grid(row=0, column=0, padx=6)
        self.stop_button = ttk.Button(control_frame, text="Stop", command=self.stop_clicking, state="disabled")
        self.stop_button.grid(row=0, column=1, padx=6)

        self.status_var = tk.StringVar(value="Idle")
        ttk.Label(control_frame, textvariable=self.status_var, font=("TkDefaultFont", 10, "bold")).grid(
            row=0, column=2, padx=16
        )

    # ----- pick location -------------------------------------------------
    def _start_pick_location(self):
        self.pick_button.config(state="disabled", text="Move mouse... (3)")
        threading.Thread(target=self._pick_location_countdown, daemon=True).start()

    def _pick_location_countdown(self):
        for remaining in (3, 2, 1):
            self.root.after(0, lambda r=remaining: self.pick_button.config(text=f"Move mouse... ({r})"))
            time.sleep(1)
        x, y = self.mouse_controller.position
        self.root.after(0, lambda: self._finish_pick_location(x, y))

    def _finish_pick_location(self, x, y):
        self.pos_x_var.set(str(x))
        self.pos_y_var.set(str(y))
        self.position_var.set("fixed")
        self.pick_button.config(state="normal", text="Pick location")

    # ----- hotkey capture / listener -------------------------------------
    def _begin_capture_hotkey(self):
        self.capturing_hotkey = True
        self.set_hotkey_btn.config(text="Press a key...")

    def _start_hotkey_listener(self):
        self.keyboard_listener = keyboard.Listener(on_press=self._on_key_press)
        self.keyboard_listener.start()

    def _on_key_press(self, key):
        if self.capturing_hotkey:
            self.capturing_hotkey = False
            self.hotkey = key
            name = key_display_name(key)
            self.root.after(0, lambda: self._finish_capture_hotkey(name))
            return
        if keys_match(key, self.hotkey):
            self.root.after(0, self.toggle_clicking)

    def _finish_capture_hotkey(self, name):
        self.hotkey_display.set(name)
        self.set_hotkey_btn.config(text="Set hotkey")

    def toggle_clicking(self):
        if self.running:
            self.stop_clicking()
        else:
            self.start_clicking()

    # ----- validation ------------------------------------------------
    def _read_settings(self):
        try:
            hours = int(self.hours_var.get() or 0)
            minutes = int(self.minutes_var.get() or 0)
            seconds = int(self.seconds_var.get() or 0)
            millis = int(self.millis_var.get() or 0)
        except ValueError:
            raise ValueError("Interval fields must be whole numbers.")

        interval = hours * 3600 + minutes * 60 + seconds + millis / 1000
        if interval <= 0:
            raise ValueError("Click interval must be greater than zero.")

        position_mode = self.position_var.get()
        pos_x = pos_y = None
        if position_mode == "fixed":
            try:
                pos_x = int(self.pos_x_var.get())
                pos_y = int(self.pos_y_var.get())
            except ValueError:
                raise ValueError("Fixed X/Y coordinates must be whole numbers.")

        repeat_mode = self.repeat_var.get()
        repeat_count = None
        if repeat_mode == "count":
            try:
                repeat_count = int(self.repeat_count_var.get())
            except ValueError:
                raise ValueError("Repeat count must be a whole number.")
            if repeat_count <= 0:
                raise ValueError("Repeat count must be greater than zero.")

        return {
            "interval": interval,
            "button": MOUSE_BUTTONS[self.button_var.get()],
            "click_count": 2 if self.click_type_var.get() == "Double" else 1,
            "position_mode": position_mode,
            "pos_x": pos_x,
            "pos_y": pos_y,
            "repeat_mode": repeat_mode,
            "repeat_count": repeat_count,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds,
            "milliseconds": millis,
        }

    # ----- start/stop --------------------------------------------------
    def start_clicking(self):
        if self.running:
            return
        try:
            settings = self._read_settings()
        except ValueError as exc:
            messagebox.showerror("Invalid settings", str(exc))
            return

        self._persist_current_settings(settings)

        self.running = True
        self.click_count = 0
        self.stop_event.clear()
        self.start_button.config(state="disabled")
        self.stop_button.config(state="normal")
        self.status_var.set("Running — 0 clicks")

        self.click_thread = threading.Thread(target=self._click_loop, args=(settings,), daemon=True)
        self.click_thread.start()

    def stop_clicking(self):
        if not self.running:
            return
        self.stop_event.set()
        self.running = False
        self.start_button.config(state="normal")
        self.stop_button.config(state="disabled")
        self.status_var.set(f"Stopped — {self.click_count} clicks")

    def _persist_current_settings(self, settings):
        self.config_data.update(
            {
                "hours": settings["hours"],
                "minutes": settings["minutes"],
                "seconds": settings["seconds"],
                "milliseconds": settings["milliseconds"],
                "button": self.button_var.get(),
                "click_type": self.click_type_var.get(),
                "position_mode": settings["position_mode"],
                "pos_x": settings["pos_x"] or 0,
                "pos_y": settings["pos_y"] or 0,
                "repeat_mode": settings["repeat_mode"],
                "repeat_count": settings["repeat_count"] or self.config_data["repeat_count"],
                "hotkey": key_display_name(self.hotkey),
            }
        )
        self.save_config()

    # ----- click loop (runs in a background thread) ---------------------
    def _click_loop(self, settings):
        interval = settings["interval"]
        button = settings["button"]
        click_count = settings["click_count"]
        fixed = settings["position_mode"] == "fixed"
        limit = settings["repeat_count"]

        count = 0
        while not self.stop_event.is_set():
            if fixed:
                self.mouse_controller.position = (settings["pos_x"], settings["pos_y"])
            self.mouse_controller.click(button, click_count)
            count += 1
            self.click_count = count
            self.root.after(0, lambda c=count: self.status_var.set(f"Running — {c} clicks"))

            if limit is not None and count >= limit:
                self.root.after(0, self.stop_clicking)
                break

            if self.stop_event.wait(interval):
                break

    # ----- shutdown ------------------------------------------------------
    def _on_close(self):
        self.stop_event.set()
        self.running = False
        try:
            self.keyboard_listener.stop()
        except Exception:
            pass
        self.root.destroy()


def main():
    root = tk.Tk()
    AutoClickerApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
