// ==UserScript==
// @name         Handshake Proctor Automator
// @namespace    https://x.ai
// @version      3.1
// @description  Paste prompt, generate A, check answers, conditional B
// @author       Grok + Claude
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
    var answersBeforeA = 0;

    // ---- Timer auto-dismiss ----
    function dismissTimerThenInit() {
        var n = 0;
        var iv = setInterval(function () {
            n++;
            var b = document.querySelectorAll("button");
            for (var i = 0; i < b.length; i++) {
                if (b[i].textContent.trim() === "Start timer") {
                    b[i].click(); clearInterval(iv); setTimeout(initPanel, 1500); return;
                }
            }
            if (n > 10) { clearInterval(iv); initPanel(); }
        }, 500);
    }

    // ---- UI ----
    function initPanel() {
        var p = document.createElement("div");
        p.style.cssText = "position:fixed;top:20px;right:20px;width:400px;background:#111;color:#0f0;border:3px solid #ff6200;border-radius:12px;padding:15px;z-index:99999;font-family:monospace;font-size:13px;max-height:85vh;overflow-y:auto;box-shadow:0 0 30px rgba(255,98,0,0.6)";
        p.innerHTML = "<h3 style='margin:0 0 8px;color:#ff6200'>Automator v3.1</h3><div id='pa-s'>Ready</div><button id='pa-b' style='background:#ff6200;color:#fff;border:none;padding:10px;border-radius:6px;cursor:pointer;width:100%;font-weight:bold;margin:8px 0'>START</button><div id='pa-l'></div>";
        document.body.appendChild(p);
        document.getElementById("pa-b").onclick = function () {
            this.style.display = "none";
            log("GO"); runNextTask();
        };
        log("Ready");
    }

    function log(m) {
        var l = document.getElementById("pa-l");
        if (!l) { console.log("[PA]" + m); return; }
        var d = document.createElement("div"); d.textContent = "* " + m; l.appendChild(d); l.scrollTop = l.scrollHeight;
        console.log("[PA] " + m);
    }

    // ---- Helpers ----
    function poll(fn, ms) {
        ms = ms || 15000;
        return new Promise(function (ok, no) {
            var r = fn(); if (r) { ok(r); return; }
            var t = Date.now();
            var iv = setInterval(function () {
                var r2 = fn();
                if (r2) { clearInterval(iv); ok(r2); }
                else if (Date.now() - t > ms) { clearInterval(iv); no(new Error("poll timeout")); }
            }, 500);
        });
    }

    function btn(text) {
        var b = document.querySelectorAll("button");
        for (var i = 0; i < b.length; i++) {
            if (b[i].textContent.trim() === text && b[i].offsetParent !== null) return b[i];
        }
        return null;
    }

    function setTA(ta, v) {
        var s = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        s.call(ta, v); ta.dispatchEvent(new Event("input", {bubbles:true})); ta.dispatchEvent(new Event("change", {bubbles:true}));
    }

    // Click all "All" tabs to make every response visible
    function clickAllTabs() {
        var tabs = document.querySelectorAll('[role="tab"]');
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].textContent.trim() === "All") tabs[i].click();
        }
    }

    // Count "Final Answer: X" occurrences in the entire page
    function countFinalAnswers() {
        var m = document.body.innerText.match(/[Ff]inal\s*[Aa]nswer[:\s]*[-\d\.]+/g);
        return m ? m.length : 0;
    }

    // Extract all Final Answer values from page
    function getAllFinalAnswers() {
        clickAllTabs();
        var text = document.body.innerText;
        var matches = text.match(/[Ff]inal\s*[Aa]nswer[:\s]*([-\d\.]+)/g);
        if (!matches) return [];
        var vals = [];
        for (var i = 0; i < matches.length; i++) {
            var m = matches[i].match(/([-\d\.]+)$/);
            if (m) vals.push(m[1]);
        }
        return vals;
    }

    function chk(val, exp, type) {
        var e = parseFloat(exp), p = parseFloat(val);
        if (isNaN(e) || isNaN(p)) return false;
        var t = (type === "int") ? 0.5 : Math.abs(e) * 0.05;
        return Math.abs(p - e) < Math.max(t, 0.01);
    }

    // ---- Main ----
    function runNextTask() {
        if (currentIndex >= TASKS.length) {
            log("=== DONE ==="); results.forEach(function(r){log(r);}); return;
        }
        var task = TASKS[currentIndex];
        log("--- Prompt " + task.id + " ---");
        window.scrollTo({top:0});

        // Step 1: get textarea
        var ta = document.querySelector("textarea");
        if (!ta) {
            var eb = document.querySelector('button[aria-label="Edit this step"]');
            if (eb) { eb.click(); log("Edit clicked"); }
        }
        poll(function(){return document.querySelector("textarea");}, 10000)

        // Step 2: paste
        .then(function(textarea) {
            setTA(textarea, task.prompt);
            log("Pasted");
            return poll(function(){return document.querySelector('button[type="submit"][aria-label="Submit"]');}, 5000);
        })

        // Step 3: submit
        .then(function(sb) {
            // Record how many Final Answers exist BEFORE we generate
            answersBeforeA = countFinalAnswers();
            log("Answers before: " + answersBeforeA);
            sb.click();
            log("Submitted");
            return poll(function(){return btn("Continue");}, 20000);
        })

        // Step 4: click Continue, wait for Model A
        .then(function(cb) {
            cb.click();
            log("Continue clicked - generating A...");
            // Wait for "Generate Model B" to appear = Model A is done
            return poll(function(){
                return document.body.innerText.indexOf("Generate Model B") >= 0 ? true : null;
            }, 300000);
        })

        // Step 5: read Model A answers
        .then(function() {
            log("Model A done");
            clickAllTabs();
            // Small delay for tabs to render
            return new Promise(function(ok){setTimeout(ok, 1000);});
        })
        .then(function() {
            var allAns = getAllFinalAnswers();
            // New answers are those beyond answersBeforeA
            var newAns = allAns.slice(answersBeforeA);
            var a1 = newAns[0] || null;
            var a2 = newAns[1] || null;
            // If only 1 answer found, check if maybe both responses give same answer
            if (!a2 && a1) a2 = a1;
            log("A1:" + (a1||"?") + " A2:" + (a2||"?") + " exp:" + task.expected);

            var ok1 = chk(a1, task.expected, task.type);
            var ok2 = chk(a2, task.expected, task.type);

            if (ok1 && ok2) {
                var msg = "Prompt " + task.id + ": BOTH A PASSED (A1:" + a1 + " A2:" + a2 + ")";
                results.push(msg); log(msg);
                currentIndex++; setTimeout(runNextTask, 1500);
                return Promise.reject("DONE");
            }

            if (ok1 && !a2) {
                // Only found 1 answer but it passed - click Response 2 tab to check
                log("Only 1 answer found, checking Response 2 tab...");
                var tabs = document.querySelectorAll('[role="tab"]');
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].textContent.trim() === "Response 2") { tabs[i].click(); break; }
                }
                return new Promise(function(ok){setTimeout(ok, 1000);}).then(function() {
                    var allAns2 = getAllFinalAnswers();
                    var newAns2 = allAns2.slice(answersBeforeA);
                    a2 = newAns2[1] || newAns2[0] || null;
                    log("After tab click - A2:" + (a2||"?"));
                    var ok2b = chk(a2, task.expected, task.type);
                    if (ok1 && ok2b) {
                        var msg2 = "Prompt " + task.id + ": BOTH A PASSED (A1:" + a1 + " A2:" + a2 + ")";
                        results.push(msg2); log(msg2);
                        currentIndex++; setTimeout(runNextTask, 1500);
                        return Promise.reject("DONE");
                    }
                    log("A1:" + (ok1?"P":"F") + " A2:" + (ok2b?"P":"F") + " -> Model B");
                    return "NEED_B";
                });
            }

            log("A1:" + (ok1?"P":"F") + " A2:" + (ok2?"P":"F") + " -> Model B");
            return "NEED_B";
        })

        // Step 6: Generate Model B
        .then(function() {
            window.scrollTo({top: document.body.scrollHeight});
            return poll(function(){return btn("Continue");}, 15000);
        })
        .then(function(cb) {
            var ansBeforeB = countFinalAnswers();
            cb.click();
            log("Generating B...");
            // Wait for "Submit task" button = Model B done
            return poll(function(){
                return btn("Submit task") ? true : null;
            }, 300000).then(function() { return ansBeforeB; });
        })
        .then(function(ansBeforeB) {
            log("Model B done");
            clickAllTabs();
            return new Promise(function(ok){setTimeout(function(){ok(ansBeforeB);}, 1000);});
        })
        .then(function(ansBeforeB) {
            var allAns = getAllFinalAnswers();
            var bAns = allAns.slice(ansBeforeB);
            var b1 = bAns[0] || null;
            var b2 = bAns[1] || b1;
            log("B1:" + (b1||"?") + " B2:" + (b2||"?"));
            var bok1 = chk(b1, task.expected, task.type);
            var bok2 = chk(b2, task.expected, task.type);
            var msg = (bok1 && bok2)
                ? "Prompt " + task.id + ": A FAILED, B PASSED"
                : "Prompt " + task.id + ": FAILURES FOUND (B1:" + b1 + " B2:" + b2 + ")";
            results.push(msg); log(msg);
            currentIndex++; setTimeout(runNextTask, 2000);
        })

        ["catch"](function(e) {
            if (e === "DONE") return;
            log("Error: " + (e.message || e));
        });
    }

    dismissTimerThenInit();
})();
