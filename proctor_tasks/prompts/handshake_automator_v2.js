// ==UserScript==
// @name         Handshake Proctor Sandbox - LLM A/B Automator
// @namespace    https://x.ai
// @version      2.5
// @description  Full auto: paste prompts, edit, submit, generate A, analyse, conditional B, summary
// @author       Grok + Claude (built for Igor)
// @match        https://ai.joinhandshake.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    "use strict";

    var TASKS = [
        {
            id: 8,
            prompt: "A thin vibrating string of length L = 1.00 m and linear mass density \u03C1 = 0.0100 kg/m is held under tension T = 100 N. The left end (x = 0) is rigidly fixed. The right end (x = L) is attached to a massless ring that slides without friction on a vertical rod, but the ring is also connected to a spring of stiffness K = 500 N/m that provides a restoring force toward the equilibrium position.\n\nThe transverse displacement y(x,t) satisfies the wave equation with wave speed c = \u221A(T/\u03C1). The boundary conditions are y(0,t) = 0 and T\u00B7\u2202y/\u2202x(L,t) = \u2212K\u00B7y(L,t).\n\nDetermine the fundamental frequency f\u2081 (in Hz) of this string. Report your answer as a decimal rounded to three significant figures.",
            expected: "42.2",
            type: "decimal"
        }
    ];

    var currentIndex = 0;
    var results = [];

    function dismissTimerThenInit() {
        var attempts = 0;
        var iv = setInterval(function () {
            attempts++;
            var btns = document.querySelectorAll("button");
            for (var i = 0; i < btns.length; i++) {
                if (btns[i].textContent.trim() === "Start timer") {
                    btns[i].click();
                    clearInterval(iv);
                    setTimeout(initPanel, 1500);
                    return;
                }
            }
            if (attempts > 10) {
                clearInterval(iv);
                initPanel();
            }
        }, 500);
    }

    function initPanel() {
        var panel = document.createElement("div");
        panel.style.cssText = "position:fixed; top:20px; right:20px; width:420px; background:#111; color:#0f0; border:3px solid #ff6200; border-radius:12px; padding:15px; z-index:99999; font-family:monospace; font-size:14px; max-height:85vh; overflow-y:auto; box-shadow:0 0 30px rgba(255,98,0,0.6);";
        panel.innerHTML = "<h3 style='margin:0 0 10px; color:#ff6200;'>Handshake A/B Automator v2.5</h3><div id='pa-status' style='margin-bottom:8px;'>Ready - click START</div><button id='pa-startBtn' style='background:#ff6200; color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;'>START FULL AUTOMATION</button><div id='pa-log' style='margin-top:12px; font-size:13px; line-height:1.4;'></div>";
        document.body.appendChild(panel);

        document.getElementById("pa-startBtn").onclick = function () {
            this.style.display = "none";
            document.getElementById("pa-status").textContent = "Starting...";
            log("Automation started");
            runNextTask();
        };
        log("Panel ready - click START");
    }

    function log(message) {
        var logEl = document.getElementById("pa-log");
        if (!logEl) { console.log("[PA] " + message); return; }
        var entry = document.createElement("div");
        entry.textContent = "* " + message;
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
        console.log("[PA] " + message);
    }

    function pollFor(checkFn, timeout) {
        timeout = timeout || 15000;
        return new Promise(function (resolve, reject) {
            var result = checkFn();
            if (result) { resolve(result); return; }
            var start = Date.now();
            var iv = setInterval(function () {
                var r = checkFn();
                if (r) { clearInterval(iv); resolve(r); }
                if (Date.now() - start > timeout) { clearInterval(iv); reject(new Error("Poll timeout")); }
            }, 500);
        });
    }

    function setReactTextareaValue(ta, value) {
        var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        nativeSetter.call(ta, value);
        ta.dispatchEvent(new Event("input", { bubbles: true }));
        ta.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function extractFinalAnswer(text) {
        if (!text) return null;
        text = text.replace(/\n+/g, " ");
        var m = text.match(/[Ff]inal\s*[Aa]nswer[:\s]*([-\d\.]+)/);
        if (m) return m[1].trim();
        m = text.match(/boxed\{([-\d\.,\/]+)\}/);
        if (m) return m[1].trim();
        return null;
    }

    function parseNumber(str) {
        if (!str) return NaN;
        str = str.trim();
        if (str.indexOf("/") >= 0) {
            var parts = str.split("/");
            return parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : NaN;
        }
        return parseFloat(str);
    }

    function checkAnswer(parsed, expected, type) {
        var expNum = parseNumber(expected);
        var p = parseNumber(parsed);
        var tol = (type === "int") ? 0.5 : Math.abs(expNum) * 0.05;
        if (tol < 0.01) tol = 0.01;
        return !isNaN(p) && !isNaN(expNum) && Math.abs(p - expNum) < tol;
    }

    function getTextarea() {
        return document.querySelector("textarea");
    }

    function getEditButton() {
        return document.querySelector('button[aria-label="Edit this step"]');
    }

    function getSubmitButton() {
        return document.querySelector('button[type="submit"][aria-label="Submit"]');
    }

    function getContinueButton() {
        var btns = document.querySelectorAll("button");
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].textContent.trim() === "Continue" && btns[i].offsetParent !== null) return btns[i];
        }
        return null;
    }

    function runNextTask() {
        if (currentIndex >= TASKS.length) {
            document.getElementById("pa-status").textContent = "ALL DONE!";
            log("=== FINAL SUMMARY ===");
            results.forEach(function (r) { log(r); });
            return;
        }

        var task = TASKS[currentIndex];
        var ans1, ans2;
        document.getElementById("pa-status").textContent = "Prompt " + task.id + " - Running...";
        window.scrollTo({ top: 0 });

        // STEP 1: Get textarea ready (either already visible or click Edit first)
        log("Step 1: Getting textarea...");
        var ta = getTextarea();
        if (ta) {
            log("Textarea already visible (fresh task)");
            doStep2(ta, task);
        } else {
            var editBtn = getEditButton();
            if (editBtn) {
                editBtn.click();
                log("Clicked Edit button");
                pollFor(getTextarea, 10000).then(function (ta2) {
                    doStep2(ta2, task);
                })["catch"](function (err) {
                    log("Error getting textarea: " + err.message);
                });
            } else {
                log("ERROR: No textarea and no Edit button found!");
            }
        }
    }

    function doStep2(textarea, task) {
        // STEP 2: Paste prompt
        setReactTextareaValue(textarea, task.prompt);
        log("Pasted prompt");

        // STEP 3: Click Submit
        pollFor(getSubmitButton, 5000).then(function (submitBtn) {
            submitBtn.click();
            log("Submitted");

            // STEP 4: Wait for Continue button (may take a moment for page to transition)
            log("Waiting for Continue...");
            return pollFor(getContinueButton, 20000);
        }).then(function (contBtn) {
            // Record baseline prose count
            var baseline = document.querySelectorAll(".prose").length;
            log("Baseline prose: " + baseline + ". Clicking Continue...");
            contBtn.click();
            log("Generating Model A...");

            // STEP 5: Wait for 2 new prose elements
            return pollFor(function () {
                var now = document.querySelectorAll(".prose").length;
                return (now >= baseline + 2) ? true : null;
            }, 240000);
        }).then(function () {
            // STEP 6: Read last 2 prose elements
            var allProse = document.querySelectorAll(".prose");
            var total = allProse.length;
            var resp1 = allProse[total - 2] ? allProse[total - 2].innerText : "";
            var resp2 = allProse[total - 1] ? allProse[total - 1].innerText : "";
            ans1 = extractFinalAnswer(resp1);
            ans2 = extractFinalAnswer(resp2);
            log("A1: " + (ans1 || "?") + " | A2: " + (ans2 || "?") + " | expected: " + task.expected);

            var a1pass = checkAnswer(ans1, task.expected, task.type);
            var a2pass = checkAnswer(ans2, task.expected, task.type);

            if (a1pass && a2pass) {
                var msg = "Prompt " + task.id + ": BOTH A PASSED (A1:" + ans1 + " A2:" + ans2 + ")";
                results.push(msg);
                log(msg);
                currentIndex++;
                setTimeout(runNextTask, 1500);
                return Promise.reject("SKIP_B");
            }

            log("A1:" + (a1pass ? "PASS" : "FAIL") + " A2:" + (a2pass ? "PASS" : "FAIL") + " -> Model B");
            window.scrollTo({ top: document.body.scrollHeight });

            // STEP 7: Wait for new Continue button for Model B
            return pollFor(getContinueButton, 15000);
        }).then(function (contBtn) {
            var baseline2 = document.querySelectorAll(".prose").length;
            contBtn.click();
            log("Generating Model B...");

            return pollFor(function () {
                var now = document.querySelectorAll(".prose").length;
                return (now >= baseline2 + 2) ? true : null;
            }, 240000);
        }).then(function () {
            var allProse2 = document.querySelectorAll(".prose");
            var total2 = allProse2.length;
            var b1 = allProse2[total2 - 2] ? allProse2[total2 - 2].innerText : "";
            var b2 = allProse2[total2 - 1] ? allProse2[total2 - 1].innerText : "";
            var bAns1 = extractFinalAnswer(b1);
            var bAns2 = extractFinalAnswer(b2);
            log("B1: " + (bAns1 || "?") + " | B2: " + (bAns2 || "?"));

            var b1pass = checkAnswer(bAns1, task.expected, task.type);
            var b2pass = checkAnswer(bAns2, task.expected, task.type);

            var msg2 = (b1pass && b2pass)
                ? "Prompt " + task.id + ": A FAILED, B PASSED"
                : "Prompt " + task.id + ": BOTH MODELS HAVE FAILURES! (A1:" + ans1 + " A2:" + ans2 + " B1:" + bAns1 + " B2:" + bAns2 + ")";
            results.push(msg2);
            log(msg2);
            currentIndex++;
            setTimeout(runNextTask, 2000);
        })["catch"](function (err) {
            if (err === "SKIP_B") return;
            document.getElementById("pa-status").textContent = "ERROR";
            log("Error: " + (err.message || err));
        });
    }

    dismissTimerThenInit();
})();
