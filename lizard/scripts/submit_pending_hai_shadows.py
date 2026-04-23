#!/usr/bin/env python3
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

import yaml


ROOT = Path(__file__).resolve().parents[1]
TASKS_DIR = ROOT / "tasks"
SHADOWS_DIR = TASKS_DIR / "shadows"
SCRAPES_DIR = ROOT / "scrapes"
SCREENSHOTS_DIR = ROOT / "screenshots"
PORT = 9877

APPLE_SCRIPT = """
on run argv
  set jsCode to item 1 of argv
  tell application "Google Chrome"
    -- Prefer an in-progress task tab (/annotations/fellow/task/.../run|reclaim)
    repeat with w_i from 1 to count of windows
      set w to window w_i
      repeat with t_i from 1 to count of tabs of w
        set t to tab t_i of w
        set u to URL of t
        if u contains "https://ai.joinhandshake.com/annotations/fellow/task/" then
          tell t
            return execute javascript jsCode
          end tell
        end if
      end repeat
    end repeat
    -- Fall back to the project tasks list (/fellow/<uuid>/tasks)
    repeat with w_i from 1 to count of windows
      set w to window w_i
      repeat with t_i from 1 to count of tabs of w
        set t to tab t_i of w
        set u to URL of t
        if u contains "https://ai.joinhandshake.com/fellow/" and u ends with "/tasks" then
          tell t
            return execute javascript jsCode
          end tell
        end if
      end repeat
    end repeat
    -- Last resort: any HAI tab
    repeat with w_i from 1 to count of windows
      set w to window w_i
      repeat with t_i from 1 to count of tabs of w
        set t to tab t_i of w
        set u to URL of t
        if u contains "https://ai.joinhandshake.com/" then
          tell t
            return execute javascript jsCode
          end tell
        end if
      end repeat
    end repeat
    error "no HAI tab found"
  end tell
end run
"""

FOCUS_HAI_TAB_SCRIPT = """
tell application "Google Chrome"
  set activeUrl to ""
  try
    set activeUrl to URL of active tab of front window
  end try
  if activeUrl contains "https://ai.joinhandshake.com/" then
    return activeUrl
  end if

  repeat with w_i from 1 to count of windows
    set w to window w_i
    repeat with t_i from 1 to count of tabs of w
      set t to tab t_i of w
      set u to URL of t
      if u contains "https://ai.joinhandshake.com/fellow/" and u ends with "/tasks" then
        set index of w to 1
        set active tab index of w to t_i
        activate
        return u
      end if
    end repeat
  end repeat

  repeat with w_i from 1 to count of windows
    set w to window w_i
    repeat with t_i from 1 to count of tabs of w
      set t to tab t_i of w
      set u to URL of t
      if u contains "https://ai.joinhandshake.com/annotations/fellow/task/" then
        set index of w to 1
        set active tab index of w to t_i
        activate
        return u
      end if
    end repeat
  end repeat
end tell
"""


@dataclass
class PendingAnnotation:
    stem: str
    review_cycle: int
    annotation_n: int
    task_id_field: str
    prompt: str
    answer: str
    image_name: str


@dataclass(frozen=True)
class ShadowRecord:
    stem: str
    review_cycle: int
    annotation_n: int
    prefix: str
    full_uuid: str
    path: Path


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def read_text(path: Path) -> str:
    return path.read_text()


def write_text(path: Path, text: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(text)
    tmp.replace(path)


def write_json(path: Path, data) -> None:
    write_text(path, json.dumps(data, indent=2) + "\n")


def chrome_js(js: str) -> str:
    with tempfile.NamedTemporaryFile("w", suffix=".applescript", delete=False) as f:
        f.write(APPLE_SCRIPT)
        script_path = f.name
    try:
        proc = subprocess.run(
            ["osascript", script_path, js],
            check=True,
            capture_output=True,
            text=True,
        )
        out = proc.stdout.strip()
        if out == "":
            raise RuntimeError("empty response from Chrome execute javascript")
        return out
    finally:
        try:
            os.unlink(script_path)
        except FileNotFoundError:
            pass


def chrome_json(js: str):
    out = chrome_js(js)
    return json.loads(out) if out else None


def sleep(seconds: float) -> None:
    time.sleep(seconds)


def wait_until(label: str, fn, timeout: float = 30.0, interval: float = 0.5):
    start = time.time()
    last_error = None
    while True:
        try:
            result = fn()
        except Exception as exc:
            last_error = exc
            result = False
        if result:
            return result
        if time.time() - start > timeout:
            if last_error is not None:
                raise RuntimeError(f"timeout waiting for {label}") from last_error
            raise RuntimeError(f"timeout waiting for {label}")
        sleep(interval)


def get_active_page():
    return chrome_json(
        """
(() => JSON.stringify({
  url: location.href,
  body: document.body.innerText,
  buttons: Array.from(document.querySelectorAll('button')).map((b, i) => ({
    i,
    text: b.innerText.trim(),
    aria: b.getAttribute('aria-label') || '',
    disabled: !!b.disabled,
    type: b.type || ''
  }))
}))()
"""
    )


def focus_hai_task_tab() -> None:
    subprocess.run(["osascript", "-e", FOCUS_HAI_TAB_SCRIPT], check=True, capture_output=True, text=True)


def set_active_hai_url(url: str) -> None:
    subprocess.run(
        [
            "osascript",
            "-e",
            'tell application "Google Chrome" to activate',
            "-e",
            f'tell application "Google Chrome" to set URL of active tab of front window to "{url}"',
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def has_visible_textarea() -> bool:
    data = chrome_json(
        """
(() => JSON.stringify({
  count: Array.from(document.querySelectorAll('textarea'))
    .filter(t => {
      const r = t.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length
}))()
"""
    )
    return data["count"] > 0


def has_visible_number_input() -> bool:
    data = chrome_json(
        """
(() => JSON.stringify({
  count: Array.from(document.querySelectorAll('input[type="number"]'))
    .filter(inp => {
      const r = inp.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length
}))()
"""
    )
    return data["count"] > 0


def has_button_text(text: str) -> bool:
    data = chrome_json(
        f"""
(() => JSON.stringify({{
  ok: Array.from(document.querySelectorAll('button'))
    .some(b => b.innerText.trim() === {json.dumps(text)} && !b.disabled)
}}))()
"""
    )
    return data["ok"]


def has_button_aria(label: str) -> bool:
    data = chrome_json(
        f"""
(() => JSON.stringify({{
  ok: Array.from(document.querySelectorAll('button'))
    .some(b => (b.getAttribute('aria-label') || '').trim() === {json.dumps(label)} && !b.disabled)
}}))()
"""
    )
    return data["ok"]


def visible_submit_count() -> int:
    data = chrome_json(
        """
(() => JSON.stringify({
  count: Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])'))
    .filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length
}))()
"""
    )
    return data["count"]


def click_button_by_text(text: str) -> None:
    result = chrome_json(
        f"""
(() => {{
  const btn = Array.from(document.querySelectorAll('button'))
    .find(b => b.innerText.trim() === {json.dumps(text)} && !b.disabled);
  if (!btn) return JSON.stringify({{ok:false}});
  btn.click();
  return JSON.stringify({{ok:true}});
}})()
"""
    )
    if not result["ok"]:
        raise RuntimeError(f'button "{text}" not found')


def click_first_visible_submit() -> None:
    # Poll for an enabled submit — React state propagation after set_step_textarea
    # can lag the synchronous JS return, so an immediate query may see a disabled button.
    deadline = time.time() + 10.0
    while True:
        result = chrome_json(
            """
(() => {
  const submits = Array.from(document.querySelectorAll('button[type="submit"]:not([disabled])'))
    .filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
  const btn = submits[0];
  if (!btn) return JSON.stringify({ok:false});
  btn.click();
  return JSON.stringify({ok:true});
})()
"""
        )
        if result["ok"]:
            return
        if time.time() >= deadline:
            raise RuntimeError("visible enabled submit not found")
        time.sleep(0.25)


def set_step_textarea(value: str) -> None:
    result = chrome_json(
        f"""
(() => {{
  const ta = Array.from(document.querySelectorAll('textarea'))
    .find(t => {{
      const r = t.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }});
  if (!ta) return JSON.stringify({{ok:false}});
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  const newValue = {json.dumps(value)};
  ta.focus();
  setter.call(ta, newValue);
  // Dispatch InputEvent with proper inputType so React 16+ recognises a real edit.
  try {{
    ta.dispatchEvent(new InputEvent('input', {{bubbles:true, data:newValue, inputType:'insertText'}}));
  }} catch (e) {{
    ta.dispatchEvent(new Event('input', {{bubbles:true}}));
  }}
  ta.dispatchEvent(new Event('change', {{bubbles:true}}));
  ta.blur();
  return JSON.stringify({{ok:true, valueAfter: ta.value}});
}})()
"""
    )
    if not result["ok"]:
        raise RuntimeError("visible textarea not found")


def set_number_input(value: int) -> None:
    result = chrome_json(
        f"""
(() => {{
  const inp = document.querySelector('input[type="number"]');
  if (!inp) return JSON.stringify({{ok:false}});
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  inp.focus();
  setter.call(inp, {json.dumps(str(value))});
  inp.dispatchEvent(new Event('input', {{bubbles:true}}));
  inp.dispatchEvent(new Event('change', {{bubbles:true}}));
  inp.blur();
  return JSON.stringify({{ok:true}});
}})()
"""
    )
    if not result["ok"]:
        raise RuntimeError("number input not found")


def uploaded_file_count() -> int:
    data = chrome_json(
        """
(() => JSON.stringify({
  count: Array.from(document.querySelectorAll('button'))
    .filter(b => {
      const aria = (b.getAttribute('aria-label') || '').trim();
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (aria.startsWith('Open ') || aria.startsWith('View file '));
    }).length
}))()
"""
    )
    return data["count"]


def normalize_uploaded_files_to_one() -> None:
    for _ in range(8):
        count = uploaded_file_count()
        if count <= 1:
            return
        result = chrome_json(
            """
(() => {
  const btns = Array.from(document.querySelectorAll('button'))
    .filter(b => {
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (b.getAttribute('aria-label') || '').trim() === 'Remove file';
    });
  const btn = btns[btns.length - 1];
  if (!btn) return JSON.stringify({ok:false});
  btn.click();
  return JSON.stringify({ok:true});
})()
"""
        )
        if not result["ok"]:
            raise RuntimeError("remove file button not found while normalizing uploads")
        sleep(0.5)
    raise RuntimeError("failed to normalize uploads to one image")


def start_upload(image_name: str) -> None:
    result = chrome_json(
        f"""
(() => {{
  window.__haiDropStatus = {{state:'starting'}};
  (async () => {{
    try {{
      const r = await fetch('http://127.0.0.1:{PORT}/' + {json.dumps(image_name)});
      if (!r.ok) throw new Error('fetch ' + r.status);
      const blob = await r.blob();
      const file = new File([blob], {json.dumps(image_name)}, {{type: blob.type || 'image/png'}});
      const dt = new DataTransfer();
      dt.items.add(file);
      const btn = Array.from(document.querySelectorAll('button'))
        .find(b => (b.getAttribute('aria-label') || '').trim() === 'Upload assets');
      if (!btn) throw new Error('Upload assets button not found');
      const chain = [];
      let el = btn;
      for (let i = 0; el && i < 6; i++, el = el.parentElement) chain.push(el);
      for (const target of chain) {{
        for (const type of ['dragenter', 'dragover', 'drop']) {{
          const ev = new DragEvent(type, {{bubbles:true,cancelable:true,dataTransfer:dt}});
          target.dispatchEvent(ev);
        }}
      }}
      window.__haiDropStatus = {{state:'done'}};
    }} catch (e) {{
      window.__haiDropStatus = {{state:'error', error:String(e)}};
    }}
  }})();
  return JSON.stringify({{ok:true}});
}})()
"""
    )
    if not result["ok"]:
        raise RuntimeError("failed to start upload")


def wait_for_upload() -> None:
    def _poll():
        data = chrome_json("JSON.stringify(window.__haiDropStatus || {state:'missing'})")
        if data["state"] == "done":
            return True
        if data["state"] == "error":
            raise RuntimeError(f"upload failed: {data['error']}")
        return False

    wait_until("upload completion", _poll, timeout=30, interval=0.5)
    wait_until("uploaded file tile", lambda: uploaded_file_count() > 0, timeout=30, interval=0.5)
    normalize_uploaded_files_to_one()
    if uploaded_file_count() != 1:
        raise RuntimeError("expected exactly one uploaded file after normalization")


def body_contains(text: str) -> bool:
    return text in get_active_page()["body"]


def wait_for_body(text: str, timeout: float = 60.0) -> None:
    wait_until(f'body containing "{text}"', lambda: body_contains(text), timeout=timeout, interval=0.5)


def current_body() -> str:
    return get_active_page()["body"]


def read_session_time() -> str:
    # Only accept a time that appears after the "Time this session" label on the
    # Task-complete screen. Falling back to the first HH:MM:SS in body would catch
    # the timer budget "00:20:00" in the header during page transitions.
    def _extract():
        body = current_body()
        m = re.search(r"Time this session\s+([0-9]{2}:[0-9]{2}:[0-9]{2})", body)
        return m.group(1) if m else None

    return wait_until("session time on completion screen", _extract, timeout=120, interval=0.5)


def submit_until_body(next_body_text: str, *, current_body_text: str | None = None, retries: int = 5, settle: float = 1.5) -> None:
    last_error = None
    for attempt in range(retries):
        # If we've already advanced past the current step, do not re-click submit —
        # the new step's submit is likely disabled (waits for fresh input), and a
        # poll-then-raise here would mask the fact that the previous submit succeeded.
        if body_contains(next_body_text):
            return
        if current_body_text and not body_contains(current_body_text):
            # Page moved off the current step but next text not yet present — wait briefly.
            try:
                wait_until(
                    f'body containing "{next_body_text}"',
                    lambda: body_contains(next_body_text),
                    timeout=2.0,
                    interval=0.25,
                )
                return
            except Exception:
                pass
        try:
            click_first_visible_submit()
        except RuntimeError:
            # Submit didn't enable within click_first_visible_submit's poll window —
            # but the previous interaction may have already advanced the page. Re-check.
            if body_contains(next_body_text):
                return
            raise
        try:
            wait_until(
                f'body containing "{next_body_text}"',
                lambda: body_contains(next_body_text),
                timeout=settle,
                interval=0.25,
            )
            return
        except Exception as exc:
            last_error = exc
            if current_body_text and not body_contains(current_body_text):
                sleep(0.5)
            else:
                sleep(0.75)
    wait_for_body(next_body_text, timeout=30)


def ensure_task_ready() -> None:
    focus_hai_task_tab()
    for _ in range(15):
        page = get_active_page()
        body = page["body"]
        buttons = page["buttons"]
        texts = {b["text"] for b in buttons if b["text"] and not b["disabled"]}
        arias = {b.get("aria") for b in buttons if b.get("aria") and not b.get("disabled")}
        # Ready signals: a fillable form step (textarea, number input, upload button)
        if has_visible_textarea() or has_visible_number_input() or has_button_aria("Upload assets"):
            return
        if "Next task" in texts:
            click_button_by_text("Next task")
            sleep(2)
            continue
        if "Start task" in texts:
            click_button_by_text("Start task")
            sleep(2)
            continue
        if "Start timer" in texts:
            click_button_by_text("Start timer")
            sleep(1)
            continue
        # Working-Schedule banner Continue: button has aria-label="Continue" but no innerText.
        if "Continue" in texts:
            click_button_by_text("Continue")
            sleep(1)
            continue
        if "Continue" in arias:
            click_button_by_aria("Continue")
            sleep(1)
            continue
        sleep(1)
    raise RuntimeError("failed to reach new-task ready state")


def click_button_by_aria(label: str) -> None:
    result = chrome_json(
        f"""
(() => {{
  const btn = Array.from(document.querySelectorAll('button'))
    .find(b => (b.getAttribute('aria-label') || '').trim() === {json.dumps(label)} && !b.disabled);
  if (!btn) return JSON.stringify({{ok:false}});
  btn.click();
  return JSON.stringify({{ok:true}});
}})()
"""
    )
    if not result["ok"]:
        raise RuntimeError(f'button[aria-label="{label}"] not found')


def _dbg(msg: str) -> None:
    print(f"  [debug] {msg}", flush=True)


def submit_annotation(item: PendingAnnotation) -> str:
    body = current_body()
    _dbg(f"start: ta={has_visible_textarea()} num={has_visible_number_input()} upload={has_button_aria('Upload assets')} review={has_button_text('Reviewing')} approve={has_button_text('Approve')} done={'Task complete!' in body}")
    if not (
        has_visible_textarea()
        or has_visible_number_input()
        or has_button_aria("Upload assets")
        or has_button_text("Reviewing")
        or has_button_text("Approve")
        or body_contains("Task complete!")
    ):
        _dbg("calling ensure_task_ready")
        ensure_task_ready()
        body = current_body()

    # Loop through steps until Task complete! screen. Each iteration matches the
    # current step and advances to the next one. The loop iteration cap protects
    # against infinite loops if the page gets stuck in an unexpected state.
    for loop_i in range(20):
        body = current_body()
        if body_contains("Task complete!"):
            _dbg(f"  loop {loop_i}: Task complete! reached")
            break
        if has_button_aria("Upload assets"):
            _dbg(f"  loop {loop_i}: upload {item.image_name}")
            start_upload(item.image_name)
            wait_for_upload()
            set_step_textarea(item.prompt)
            click_first_visible_submit()
            wait_until("rewrite answer step", lambda: body_contains("Copy over the Rewrite Answer"), timeout=30, interval=0.5)
            continue
        if has_visible_number_input():
            _dbg(f"  loop {loop_i}: number_input → set {item.annotation_n}")
            set_number_input(item.annotation_n)
            sleep(0.5)
            submit_until_body(
                "Copy over the Annotator Prompt",
                current_body_text="Which SuperAnnotate task annotation",
                retries=8,
                settle=2.0,
            )
            continue
        if has_visible_textarea() and body_contains("Copy over the Rewrite Answer"):
            _dbg(f"  loop {loop_i}: answer → {item.answer}")
            set_step_textarea(item.answer)
            click_first_visible_submit()
            wait_for_body("This may take a few minutes", timeout=30)
            wait_until("role selection", lambda: body_contains("Are you annotating or reviewing this task?"), timeout=150, interval=1.0)
            continue
        if has_button_text("Reviewing"):
            _dbg(f"  loop {loop_i}: click Reviewing")
            click_button_by_text("Reviewing")
            click_first_visible_submit()
            wait_until("approve/reject step", lambda: body_contains("Did you approve or reject this annotation?"), timeout=30, interval=0.5)
            continue
        if has_button_text("Approve"):
            _dbg(f"  loop {loop_i}: click Approve → Continue → Submit task")
            click_button_by_text("Approve")
            click_first_visible_submit()
            wait_until(
                "enabled Continue button",
                lambda: any(b["text"] == "Continue" and not b["disabled"] for b in get_active_page()["buttons"]),
                timeout=30,
                interval=0.5,
            )
            click_button_by_text("Continue")
            wait_until("submit task button", lambda: any(b["text"] == "Submit task" and not b["disabled"] for b in get_active_page()["buttons"]), timeout=30, interval=0.5)
            click_button_by_text("Submit task")
            wait_until("task complete screen", lambda: body_contains("Task complete!"), timeout=120, interval=0.5)
            continue
        if has_visible_textarea():
            _dbg(f"  loop {loop_i}: task_id → set {item.task_id_field}")
            set_step_textarea(item.task_id_field)
            submit_until_body(
                "Which SuperAnnotate task annotation",
                current_body_text="Copy the ID of the task",
            )
            continue
        # Nothing matched — page may be loading; give it a moment then re-check.
        _dbg(f"  loop {loop_i}: no step matched; waiting 1s")
        sleep(1.0)
    else:
        raise RuntimeError("submit_annotation: exceeded 20 step iterations without reaching Task complete!")
    _dbg("Task complete! screen confirmed")

    session_time = read_session_time()
    _dbg(f"post-task: session_time={session_time!r} secs={hhmmss_to_seconds(session_time)}")
    if hhmmss_to_seconds(session_time) < 20 * 60:
        set_time_to_twenty()
    _dbg("clicking Confirm time")
    click_button_by_text("Confirm time")
    wait_until("post-confirm modal", lambda: body_contains("Great job! Ready for another task?"), timeout=30, interval=0.5)

    url = get_active_page()["url"]
    uuid = re.search(r"/task/([0-9a-f-]+)/(?:run|reclaim)", url)
    if not uuid:
        raise RuntimeError(f"failed to parse task uuid from {url}")
    return uuid.group(1)


def hhmmss_to_seconds(value: str) -> int:
    h, m, s = map(int, value.split(":"))
    return h * 3600 + m * 60 + s


def set_time_to_twenty() -> None:
    _dbg("set_time_to_twenty: click Edit time")
    click_button_by_text("Edit time")
    _dbg("set_time_to_twenty: wait for dialog")
    wait_until(
        "time edit dialog",
        lambda: chrome_json(
            """
(() => JSON.stringify({
  count: Array.from(document.querySelectorAll('input[type="text"], input:not([type])'))
    .filter(inp => {
      const r = inp.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length
}))()
"""
        )["count"] >= 3,
        timeout=30,
        interval=0.5,
    )
    result = chrome_json(
        """
(() => {
  const inputs = Array.from(document.querySelectorAll('input[type="text"], input:not([type])'))
    .filter(inp => {
      const r = inp.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .slice(0, 3);
  if (inputs.length < 3) return JSON.stringify({ok:false});
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  const values = ['0', '20', '0'];
  inputs.forEach((inp, i) => {
    inp.focus();
    setter.call(inp, values[i]);
    inp.dispatchEvent(new Event('input', {bubbles:true}));
    inp.dispatchEvent(new Event('change', {bubbles:true}));
    inp.blur();
  });
  return JSON.stringify({ok:true});
})()
"""
    )
    if not result["ok"]:
        raise RuntimeError("failed to set time dialog values")
    _dbg("set_time_to_twenty: values set; clicking Save")
    click_button_by_text("Save")
    _dbg("set_time_to_twenty: Save clicked; waiting for Confirm time button")
    wait_until("confirm time button", lambda: any(b["text"] == "Confirm time" and not b["disabled"] for b in get_active_page()["buttons"]), timeout=30, interval=0.5)
    _dbg(f"set_time_to_twenty: pre-validate time = {read_session_time()}")
    # Validate the edit actually applied — Confirm time can be enabled even when no edit happened.
    wait_until(
        "time display = 00:20:00",
        lambda: read_session_time() == "00:20:00",
        timeout=10,
        interval=0.5,
    )
    _dbg("set_time_to_twenty: time confirmed at 00:20:00")


def parse_shadow_record(path: Path) -> ShadowRecord | None:
    text = path.read_text()
    review_match = re.search(
        r"^- (?:\*\*)?Review file:(?:\*\*)? \[(?P<stem>[^\]]+)\.md\]\(\.\./[^\)]+\) → Annotation (?P<annotation>\d+)(?: \(cycle (?P<cycle>\d+)\))?",
        text,
        flags=re.M,
    )
    link_match = re.search(
        r"^- (?:\*\*)?HAI Link:(?:\*\*)? https://ai\.joinhandshake\.com/annotations/fellow/task/(?P<uuid>[0-9a-f-]+)/(?:run|reclaim)",
        text,
        flags=re.M,
    )
    if not review_match or not link_match:
        return None
    stem = review_match.group("stem")
    annotation_n = int(review_match.group("annotation"))
    review_cycle = int(review_match.group("cycle") or infer_shadow_cycle(path.stem, stem, annotation_n))
    return ShadowRecord(
        stem=stem,
        review_cycle=review_cycle,
        annotation_n=annotation_n,
        prefix=path.stem,
        full_uuid=link_match.group("uuid"),
        path=path,
    )


def infer_shadow_cycle(prefix: str, stem: str, annotation_n: int) -> int:
    task_path = TASKS_DIR / f"{stem}.md"
    if not task_path.exists():
        return 1
    text = task_path.read_text()
    pattern = rf"^### Annotation {annotation_n}(?:[^\n]*)\n(.*?)(?=^### Annotation \d+|\Z)"
    match = re.search(pattern, text, flags=re.M | re.S)
    if not match:
        return 1
    block = match.group(1)
    ref_pattern = rf"^\- \*\*Shadow Task(?: \((?:Cycle|cycle) (?P<label_cycle>\d+)\))?:\*\* .*?\[{re.escape(prefix)}\]\(shadows/{re.escape(prefix)}\.md\)"
    line_match = re.search(ref_pattern, block, flags=re.M)
    if not line_match:
        return 1
    return int(line_match.group("label_cycle") or "1")


def load_shadow_index() -> dict[tuple[str, int, int], ShadowRecord]:
    index: dict[tuple[str, int, int], ShadowRecord] = {}
    for path in sorted(SHADOWS_DIR.glob("*.md")):
        record = parse_shadow_record(path)
        if record is None:
            continue
        key = (record.stem, record.review_cycle, record.annotation_n)
        if key in index:
            prev = index[key]
            chosen = max([prev, record], key=lambda r: (r.path.stat().st_mtime_ns, r.path.name))
            dropped = prev if chosen is record else record
            index[key] = chosen
            print(
                f"WARNING: duplicate shadow records for {record.stem} cycle {record.review_cycle} annotation {record.annotation_n}: "
                f"keeping {chosen.path.name}, ignoring {dropped.path.name}",
                file=sys.stderr,
            )
            continue
        index[key] = record
    return index


def ensure_shadow_slot_open(item: PendingAnnotation, shadow_index: dict[tuple[str, int, int], ShadowRecord] | None = None) -> None:
    index = shadow_index if shadow_index is not None else load_shadow_index()
    key = (item.stem, item.review_cycle, item.annotation_n)
    if key in index:
        record = index[key]
        raise RuntimeError(
            f"{item.stem} cycle {item.review_cycle} A{item.annotation_n} already has shadow file {record.path.name}; "
            "skip Job 4 for this slot"
        )


def open_hai_task_list() -> None:
    focus_hai_task_tab()
    current = ""
    try:
        current = get_active_page().get("url", "") or ""
    except Exception:
        pass
    # Skip navigation if already on a running task — set URL would fire beforeunload "Leave site?".
    if "/annotations/fellow/task/" in current and "/run" in current:
        return
    set_active_hai_url("https://ai.joinhandshake.com/fellow/tasks")


def parse_pending_annotations() -> list[PendingAnnotation]:
    manifest = json.loads((SCRAPES_DIR / "_manifest.json").read_text())["tasks"]
    shadow_index = load_shadow_index()
    items: list[PendingAnnotation] = []
    for entry in manifest:
        stem = entry["stem"]
        task_path = TASKS_DIR / f"{stem}.md"
        text = task_path.read_text()
        cycle_match = re.search(r"^\- \*\*Review Cycle:\*\* (\d+)", text, flags=re.M)
        if not cycle_match:
            raise RuntimeError(f"missing Review Cycle in {task_path}")
        review_cycle = int(cycle_match.group(1))

        block_match = re.search(r"## Form-Fill Payload(?: \(Cycle \d+\))?\n\n```yaml\n(.*?)\n```", text, re.S)
        if not block_match:
            raise RuntimeError(f"missing payload block in {task_path}")
        payload = yaml.safe_load(block_match.group(1))
        by_n = {ann["n"]: ann["hai"] for ann in payload["annotations"]}

        for heading in re.finditer(r"^### Annotation (\d+).*?$", text, re.M):
            ann_n = int(heading.group(1))
            if (stem, review_cycle, ann_n) in shadow_index:
                continue
            if ann_n not in by_n:
                raise RuntimeError(f"payload missing annotation {ann_n} in {task_path}")
            hai = by_n[ann_n]
            image_name = find_image_name(stem)
            item = PendingAnnotation(
                stem=stem,
                review_cycle=review_cycle,
                annotation_n=ann_n,
                task_id_field=hai["task_id_field"],
                prompt=hai["prompt"].rstrip(),
                answer=str(hai["answer"]).rstrip(),
                image_name=image_name,
            )
            ensure_shadow_slot_open(item, shadow_index)
            items.append(item)
    return items


def find_image_name(stem: str) -> str:
    matches = sorted(SCREENSHOTS_DIR.glob(f"{stem}.*"))
    if not matches:
        raise RuntimeError(f"missing screenshot for {stem}")
    return matches[0].name


def load_annotation_item(stem: str, annotation_n: int) -> PendingAnnotation:
    task_path = TASKS_DIR / f"{stem}.md"
    text = task_path.read_text()
    cycle_match = re.search(r"^\- \*\*Review Cycle:\*\* (\d+)", text, flags=re.M)
    if not cycle_match:
        raise RuntimeError(f"missing Review Cycle in {task_path}")
    review_cycle = int(cycle_match.group(1))

    block_match = re.search(r"## Form-Fill Payload(?: \(Cycle \d+\))?\n\n```yaml\n(.*?)\n```", text, re.S)
    if not block_match:
        raise RuntimeError(f"missing payload block in {task_path}")
    payload = yaml.safe_load(block_match.group(1))
    by_n = {int(ann["n"]): ann["hai"] for ann in payload["annotations"]}
    if annotation_n not in by_n:
        raise RuntimeError(f"payload missing annotation {annotation_n} in {task_path}")
    hai = by_n[annotation_n]
    return PendingAnnotation(
        stem=stem,
        review_cycle=review_cycle,
        annotation_n=annotation_n,
        task_id_field=hai["task_id_field"],
        prompt=hai["prompt"].rstrip(),
        answer=str(hai["answer"]).rstrip(),
        image_name=find_image_name(stem),
    )


def ensure_annotation_pending(item: PendingAnnotation) -> None:
    task_path = TASKS_DIR / f"{item.stem}.md"
    text = task_path.read_text()
    pattern = rf"^### Annotation {item.annotation_n}(?:[^\n]*)\n(?:.*\n)*?- \*\*Shadow Task(?: \(Cycle \d+\))?:\*\* ⬜ not submitted"
    if not re.search(pattern, text, flags=re.M):
        raise RuntimeError(f"{item.stem} A{item.annotation_n} is already submitted; reuse-uuid is only for pending shadow tasks")


def create_shadow_file(item: PendingAnnotation, full_uuid: str) -> None:
    prefix = full_uuid[:8]
    path = SHADOWS_DIR / f"{prefix}.md"
    content = (
        f"# Shadow Task: {prefix}\n\n"
        f"- **SA Task ID:** {item.task_id_field}\n"
        f"- **Annotation:** {item.annotation_n}\n"
        f"- **HAI Link:** https://ai.joinhandshake.com/annotations/fellow/task/{full_uuid}/run\n"
        f"- **Status:** ✅ submitted\n"
        f"- **Review file:** [{item.stem}.md](../{item.stem}.md) → Annotation {item.annotation_n} (cycle {item.review_cycle})\n\n"
        f"## Prompt\n{item.prompt}\n\n"
        f"## Rewrite Answer\n{item.answer}\n"
    )
    write_text(path, content)


def update_task_markdown(item: PendingAnnotation, full_uuid: str) -> None:
    path = TASKS_DIR / f"{item.stem}.md"
    text = path.read_text()
    prefix = full_uuid[:8]
    replacement = f"✅ submitted (cycle {item.review_cycle}) — [{prefix}](shadows/{prefix}.md)"
    pattern = rf"(### Annotation {item.annotation_n}(?:[^\n]*)\n(?:.*\n)*?- \*\*Shadow Task(?: \(Cycle \d+\))?:\*\* )⬜ not submitted"
    new_text, count = re.subn(pattern, rf"\1{replacement}", text, count=1, flags=re.M)
    if count != 1:
        raise RuntimeError(f"failed to stamp annotation {item.annotation_n} in {path}")
    write_text(path, new_text)


def count_pending_shadows(stem: str, review_cycle: int) -> int:
    task_path = TASKS_DIR / f"{stem}.md"
    text = task_path.read_text()
    block_match = re.search(r"## Form-Fill Payload(?: \(Cycle \d+\))?\n\n```yaml\n(.*?)\n```", text, re.S)
    if not block_match:
        raise RuntimeError(f"missing payload block in {task_path}")
    payload = yaml.safe_load(block_match.group(1))
    expected = {int(ann["n"]) for ann in payload["annotations"]}
    shadow_index = load_shadow_index()
    submitted = {
        ann_n
        for shadow_stem, shadow_cycle, ann_n in shadow_index
        if shadow_stem == stem and shadow_cycle == review_cycle
    }
    return len(expected - submitted)


def sync_state_after_submission(item: PendingAnnotation) -> None:
    state_path = SCRAPES_DIR / "_state.json"
    manifest_path = SCRAPES_DIR / "_manifest.state.json"
    state = json.loads(state_path.read_text())
    manifest = json.loads(manifest_path.read_text())

    stem = item.stem
    pending = count_pending_shadows(stem, item.review_cycle)
    progress = state.setdefault("job4_progress", {})
    if pending == 0:
        progress[stem] = "fired"
        manifest["tasks"][stem]["shadows_fired"] = True
    else:
        existing = progress.get(stem)
        if not isinstance(existing, dict):
            existing = {}
        existing[f"annotation_{item.annotation_n}"] = "fired"
        progress[stem] = existing
        manifest["tasks"][stem]["shadows_fired"] = False
    state["phase"] = "job4"
    state["last_step"] = f"job4.{stem}.annotation_{item.annotation_n}_fired"
    state["updated_at"] = now_iso()
    state["current_task"] = None

    write_json(state_path, state)
    write_json(manifest_path, manifest)


def set_current_task(item: PendingAnnotation) -> None:
    state_path = SCRAPES_DIR / "_state.json"
    state = json.loads(state_path.read_text())
    state["current_task"] = {"stem": item.stem, "annotation_n": item.annotation_n}
    state["updated_at"] = now_iso()
    write_json(state_path, state)


class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        path = (SCREENSHOTS_DIR / self.path.lstrip("/")).resolve()
        if not str(path).startswith(str(SCREENSHOTS_DIR)) or not path.is_file():
            self.send_response(404)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            return
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        if path.suffix.lower() in {".jpg", ".jpeg"}:
            ctype = "image/jpeg"
        elif path.suffix.lower() == ".png":
            ctype = "image/png"
        else:
            ctype = "application/octet-stream"
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        return


def start_server():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--all", action="store_true", help="submit all pending shadow tasks")
    parser.add_argument("--limit", type=int, default=None, help="submit at most N pending shadow tasks")
    parser.add_argument("--reuse-uuid", type=str, default=None, help="reuse a duplicate HAI task UUID for a pending shadow task")
    parser.add_argument("--stem", type=str, default=None, help="task stem to submit when using --reuse-uuid")
    parser.add_argument("--annotation", type=int, default=None, help="annotation number to submit when using --reuse-uuid")
    args = parser.parse_args()

    if args.reuse_uuid:
        if not args.stem or args.annotation is None:
            raise RuntimeError("--reuse-uuid requires --stem and --annotation")
        if args.all or args.limit is not None:
            raise RuntimeError("--reuse-uuid cannot be combined with --all/--limit")
        item = load_annotation_item(args.stem, args.annotation)
        ensure_annotation_pending(item)
        ensure_shadow_slot_open(item)
        server = start_server()
        try:
            print(f"Reusing {args.reuse_uuid[:8]} for {item.stem} A{item.annotation_n}...", flush=True)
            set_current_task(item)
            set_active_hai_url(f"https://ai.joinhandshake.com/annotations/fellow/task/{args.reuse_uuid}/run")
            wait_until(
                "HAI task page",
                lambda: has_visible_textarea()
                or has_visible_number_input()
                or has_button_text("Start task")
                or has_button_text("Start timer")
                or has_button_text("Reviewing")
                or has_button_text("Approve"),
                timeout=30,
                interval=0.5,
            )
            ensure_task_ready()
            full_uuid = submit_annotation(item)
            if full_uuid != args.reuse_uuid:
                raise RuntimeError(f"expected reclaimed uuid {args.reuse_uuid}, got {full_uuid}")
            create_shadow_file(item, full_uuid)
            update_task_markdown(item, full_uuid)
            sync_state_after_submission(item)
            print(f"Reused {full_uuid[:8]} for {item.stem} A{item.annotation_n}", flush=True)
            return
        finally:
            server.shutdown()
            server.server_close()

    items = parse_pending_annotations()
    if not items:
        print("No pending shadow submissions.")
        return

    if args.all and args.limit is not None:
        raise RuntimeError("use either --all or --limit, not both")

    limit = len(items) if args.all else (args.limit if args.limit is not None else 1)
    if limit <= 0:
        print("No pending shadow submissions selected.")
        return
    items = items[:limit]

    print(f"Pending shadow submissions: {len(items)}")
    open_hai_task_list()
    server = start_server()
    try:
        prior_uuid = None
        for idx, item in enumerate(items, start=1):
            print(f"[{idx}/{len(items)}] {item.stem} A{item.annotation_n} starting...", flush=True)
            # Between items the page is on "Great job! Ready for another task?" modal of the
            # previous submission. The "Task complete!" text remains in the body underneath, so
            # submit_annotation's gate would skip ensure_task_ready and never advance. Force
            # advancing by clicking Next task here, then wait for a fresh /run URL.
            if prior_uuid is not None:
                advance_to_next_task(prior_uuid)
            set_current_task(item)
            full_uuid = submit_annotation(item)
            if full_uuid == prior_uuid:
                raise RuntimeError(
                    f"refusing to record duplicate uuid {full_uuid} for {item.stem} A{item.annotation_n}; "
                    "advance_to_next_task did not load a new HAI task"
                )
            create_shadow_file(item, full_uuid)
            update_task_markdown(item, full_uuid)
            sync_state_after_submission(item)
            print(f"[{idx}/{len(items)}] {item.stem} A{item.annotation_n} submitted -> {full_uuid[:8]}", flush=True)
            prior_uuid = full_uuid
    finally:
        server.shutdown()
        server.server_close()


def advance_to_next_task(prior_uuid: str) -> None:
    # Click "Next task" on the post-confirm modal and wait for the URL to change to a new task,
    # then wait for the new task page to actually render its first form element (textarea or
    # number input). Without this, the next iteration's ensure_task_ready can race the page
    # load and time out before the form mounts.
    deadline = time.time() + 30.0
    clicked = False
    while time.time() < deadline:
        page = get_active_page()
        url = page.get("url", "") or ""
        m = re.search(r"/task/([0-9a-f-]+)/(?:run|reclaim)", url)
        if m and m.group(1) != prior_uuid:
            break
        if not clicked:
            buttons = {b["text"] for b in page.get("buttons", []) if b.get("text") and not b.get("disabled")}
            if "Next task" in buttons:
                click_button_by_text("Next task")
                clicked = True
        time.sleep(0.5)
    else:
        raise RuntimeError(f"advance_to_next_task: page did not move past {prior_uuid} within 30s")
    # URL moved — now wait for the form to mount (Start timer, textarea, or number input).
    wait_until(
        "new task form ready",
        lambda: (
            has_button_text("Start timer")
            or has_visible_textarea()
            or has_visible_number_input()
            or has_button_aria("Upload assets")
        ),
        timeout=30,
        interval=0.5,
    )
    # If still showing Start timer dialog, click it.
    if has_button_text("Start timer"):
        click_button_by_text("Start timer")
        sleep(1.0)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        state_path = SCRAPES_DIR / "_state.json"
        state = json.loads(state_path.read_text())
        state["current_task"] = None
        state["updated_at"] = now_iso()
        write_json(state_path, state)
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
