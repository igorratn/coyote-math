#!/usr/bin/env python3
"""Regression test for chrome_js auto-dismiss of Chrome 144+'s remote-debug consent prompt.

The bug: when Chrome shows the "Allow remote debugging?" dialog mid-batch (typically after
screen saver wake invalidates the prior session's grant), `osascript ... execute javascript`
hangs or returns empty. Without the dismiss path, Job 4 stalls indefinitely.

The fix: chrome_js wraps osascript with a 15s timeout. On TimeoutExpired or empty stdout,
it fires a System Events keystroke (Return) to activate the dialog's default "Allow"
button, then retries once. Two consecutive failures raise.

This test mocks subprocess.run to simulate the dialog/no-dialog scenarios and asserts the
dismiss path runs the right number of times.
"""
from __future__ import annotations

import importlib.util
import subprocess
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "submit_pending_hai_shadows.py"


def _load_module():
    spec = importlib.util.spec_from_file_location("sphs", SCRIPT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


class FakeCompleted:
    def __init__(self, stdout="", stderr="", returncode=0):
        self.stdout = stdout
        self.stderr = stderr
        self.returncode = returncode


class ChromeDebugDismissTest(unittest.TestCase):
    def setUp(self):
        self.mod = _load_module()
        self.calls = []

    def _make_runner(self, scenario):
        """scenario is a list of responses keyed by call index.
        Each response is either a FakeCompleted or an Exception class to raise."""
        def runner(args, **kwargs):
            self.calls.append({"args": list(args), "kwargs": kwargs})
            idx = len(self.calls) - 1
            if idx >= len(scenario):
                raise AssertionError(
                    f"unexpected extra subprocess.run call #{idx}: {args}"
                )
            resp = scenario[idx]
            if isinstance(resp, type) and issubclass(resp, BaseException):
                raise resp(cmd=args, timeout=kwargs.get("timeout", 0))
            return resp
        return runner

    def _is_main_call(self, call):
        # The main osascript call uses the temp .applescript script path as the 2nd arg.
        return (
            call["args"][0] == "osascript"
            and len(call["args"]) >= 3
            and call["args"][1].endswith(".applescript")
        )

    def _is_dismiss_call(self, call):
        return call["args"][:2] == ["osascript", "-e"]

    def test_happy_path_no_dismiss(self):
        """No dialog → osascript returns valid JSON immediately, no dismiss fires."""
        scenario = [FakeCompleted(stdout='"42"\n')]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            result = self.mod.chrome_js("1+1")
        self.assertEqual(result, '"42"')
        self.assertEqual(len(self.calls), 1)
        self.assertTrue(self._is_main_call(self.calls[0]))

    def test_timeout_then_dismiss_then_success(self):
        """Dialog blocks first call → dismiss fires → retry succeeds."""
        scenario = [
            subprocess.TimeoutExpired,           # 1: main call hangs on dialog
            FakeCompleted(stdout="ok"),          # 2: dismiss keystroke succeeds
            FakeCompleted(stdout='"42"\n'),      # 3: retry of main call returns
        ]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            result = self.mod.chrome_js("1+1")
        self.assertEqual(result, '"42"')
        self.assertEqual(len(self.calls), 3)
        self.assertTrue(self._is_main_call(self.calls[0]))
        self.assertTrue(self._is_dismiss_call(self.calls[1]))
        self.assertTrue(self._is_main_call(self.calls[2]))

    def test_empty_response_then_dismiss_then_success(self):
        """Empty stdout (alt failure mode) → dismiss fires → retry succeeds."""
        scenario = [
            FakeCompleted(stdout=""),            # 1: main call returns empty
            FakeCompleted(stdout="ok"),          # 2: dismiss
            FakeCompleted(stdout='"99"\n'),      # 3: retry succeeds
        ]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            result = self.mod.chrome_js("1+1")
        self.assertEqual(result, '"99"')
        self.assertEqual(len(self.calls), 3)
        self.assertTrue(self._is_dismiss_call(self.calls[1]))

    def test_two_timeouts_in_a_row_raises(self):
        """If dialog is still up after dismiss attempt, second main call also times out → raise."""
        scenario = [
            subprocess.TimeoutExpired,           # 1: main call hangs
            FakeCompleted(stdout="ok"),          # 2: dismiss runs
            subprocess.TimeoutExpired,           # 3: retry also hangs (Accessibility missing?)
        ]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            with self.assertRaises(RuntimeError) as ctx:
                self.mod.chrome_js("1+1")
        self.assertIn("timed out twice", str(ctx.exception))

    def test_two_empty_in_a_row_raises(self):
        """If empty response persists across dismiss + retry → raise."""
        scenario = [
            FakeCompleted(stdout=""),
            FakeCompleted(stdout="ok"),
            FakeCompleted(stdout=""),
        ]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            with self.assertRaises(RuntimeError) as ctx:
                self.mod.chrome_js("1+1")
        self.assertIn("after retry", str(ctx.exception))

    def test_dismiss_clicks_allow_button_by_ax(self):
        """The dismiss script must click the Allow button via AX — not press Return.

        Background: `tell application "Google Chrome" to activate` + `key code 36` does NOT
        work because activate brings Chrome to front but doesn't move its internal keyboard
        focus to the modal. Return goes to whatever web element was focused (a page text
        input, etc.), not the dialog's default button. Verified by Igor 2026-04-26.

        The working approach: detect the dialog via its unique static-text phrase, collect
        AXButtons appearing after it, click the rightmost (Allow is on the right of the
        Turn off / Cancel / Allow row).
        """
        scenario = [
            subprocess.TimeoutExpired,
            FakeCompleted(stdout="clicked-x=421"),
            FakeCompleted(stdout='"x"\n'),
        ]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            self.mod.chrome_js("1+1")
        dismiss_script = self.calls[1]["args"][2]
        self.assertIn("Google Chrome", dismiss_script,
                      "dismiss must activate Chrome first")
        self.assertIn("external app wants full control", dismiss_script,
                      "dismiss must detect the dialog by its unique static-text phrase")
        self.assertIn("click rightmostBtn", dismiss_script,
                      "dismiss must click the rightmost AXButton (Allow), not press a key")
        self.assertNotIn("key code 36", dismiss_script,
                         "Return-key approach was tried and verified non-working — must not regress")

    def test_main_call_has_15s_timeout(self):
        """The main osascript call must have a finite timeout — silent infinite hang is the bug."""
        scenario = [FakeCompleted(stdout='"ok"\n')]
        with patch.object(subprocess, "run", side_effect=self._make_runner(scenario)):
            self.mod.chrome_js("1+1")
        self.assertEqual(self.calls[0]["kwargs"].get("timeout"), 15,
                         "main osascript call must use a 15s timeout, not None")


if __name__ == "__main__":
    runner = unittest.TextTestRunner(verbosity=2)
    suite = unittest.TestLoader().loadTestsFromTestCase(ChromeDebugDismissTest)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
