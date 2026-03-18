// ==UserScript==
// @name         Handshake Proctor Sandbox - LLM A/B Automator
// @namespace    https://x.ai
// @version      2.0
// @description  Full auto: paste prompts, edit, submit, generate A, analyse, conditional B, summary
// @author       Grok + Claude (built for Igor)
// @match        https://ai.joinhandshake.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ====================== CONFIG ======================
    const TASKS = [
    {
        id: 8,
        prompt: "A thin vibrating string of length L = 1.00 m and linear mass density \u03C1 = 0.0100 kg/m is held under tension T = 100 N. The left end (x = 0) is rigidly fixed. The right end (x = L) is attached to a massless ring that slides without friction on a vertical rod, but the ring is also connected to a spring of stiffness K = 500 N/m that provides a restoring force toward the equilibrium position.\n\nThe transverse displacement y(x,t) satisfies the wave equation with wave speed c = \u221A(T/\u03C1). The boundary conditions are y(0,t) = 0 and T\u00B7\u2202y/\u2202x(L,t) = \u2212K\u00B7y(L,t).\n\nDetermine the fundamental frequency f\u2081 (in Hz) of this string. Report your answer as a decimal rounded to three significant figures.",
        expected: "42.2",
        type: "decimal"
    }
];

    let currentIndex = 0;
    let proseOffset = 0;
    let results = [];

    // ====================== UI PANEL ======================
    const panel = document.createElement('div');
    panel.style.cssText = 'position:fixed; top:20px; right:20px; width:420px; background:#111; color:#0f0; border:3px solid #ff6200; border-radius:12px; padding:15px; z-index:99999; font-family:monospace; font-size:14px; max-height:85vh; overflow-y:auto; box-shadow:0 0 30px rgba(255,98,0,0.6);';
    panel.innerHTML = '<h3 style="margin:0 0 10px; color:#ff6200;">\uD83D\uDE80 Handshake A/B Automator</h3><div id="status" style="margin-bottom:8px;">Ready \u2014 click START</div><button id="startBtn" style="background:#ff6200; color:white; border:none; padding:10px 16px; border-radius:6px; cursor:pointer; width:100%; font-weight:bold;">START FULL AUTOMATION</button><div id="log" style="margin-top:12px; font-size:13px; line-height:1.4;"></div>';
    document.body.appendChild(panel);

    const statusEl = panel.querySelector('#status');
    const logEl = panel.querySelector('#log');
    const startBtn = panel.querySelector('#startBtn');

    function log(message) {
        var entry = document.createElement('div');
        entry.textContent = '\u2022 ' + message;
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
        console.log(message);
    }

    // ====================== HELPERS ======================
    function waitForElement(selector, timeout) {
        timeout = timeout || 15000;
        return new Promise(function(resolve, reject) {
            var start = Date.now();
            var iv = setInterval(function() {
                var el = document.querySelector(selector);
                if (el) { clearInterval(iv); resolve(el); }
                if (Date.now() - start > timeout) { clearInterval(iv); reject(new Error('Timeout: ' + selector)); }
            }, 300);
        });
    }

    function waitForGenerationComplete(timeout) {
        timeout = timeout || 240000;
        return new Promise(function(resolve, reject) {
            var start = Date.now();
            var iv = setInterval(function() {
                var loading = false;
                var allEls = document.querySelectorAll('*');
                for (var i = 0; i < allEls.length; i++) {
                    if (allEls[i].textContent && allEls[i].textContent.includes('This may take a few minutes')) {
                        loading = true;
                        break;
                    }
                }
                var proses = document.querySelectorAll('.prose');
                if (!loading && proses.length >= proseOffset + 2) {
                    clearInterval(iv);
                    resolve();
                }
                if (Date.now() - start > timeout) {
                    clearInterval(iv);
                    reject(new Error('Generation timeout'));
                }
            }, 3000);
        });
    }

    function setReactTextareaValue(ta, value) {
        var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeSetter.call(ta, value);
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function getContinueButton() {
        var btns = document.querySelectorAll('button');
        for (var i = 0; i < btns.length; i++) {
            if (btns[i].textContent.trim() === 'Continue' && btns[i].offsetParent !== null) {
                return btns[i];
            }
        }
        return null;
    }

    function extractFinalAnswer(text) {
        if (!text) return null;
        text = text.replace(/\n+/g, ' ');
        var m = text.match(/[Ff]inal\s*[Aa]nswer[:\s]*([-\d\.]+)/);
        if (m) return m[1].trim();
        m = text.match(/boxed\{([-\d\.,\/]+)\}/);
        if (m) return m[1].trim();
        m = text.match(/[Aa]nswer[:\s]*([-\d\.]+)/);
        if (m) return m[1].trim();
        return null;
    }

    function parseNumber(str) {
        if (!str) return NaN;
        str = str.trim();
        if (str.indexOf('/') >= 0) {
            var parts = str.split('/');
            return parts.length === 2 ? parseFloat(parts[0]) / parseFloat(parts[1]) : NaN;
        }
        return parseFloat(str);
    }

    function bothPassed(parsed1, parsed2, expected, type) {
        var expNum = parseNumber(expected);
        var p1 = parseNumber(parsed1);
        var p2 = parseNumber(parsed2);
        var tol = (type === 'int') ? 0.5 : Math.abs(expNum) * 0.05;
        if (tol < 0.01) tol = 0.01;
        return !isNaN(p1) && !isNaN(p2) && !isNaN(expNum) &&
               Math.abs(p1 - expNum) < tol && Math.abs(p2 - expNum) < tol;
    }

    // ====================== MAIN STEP ======================
    function runNextTask() {
        if (currentIndex >= TASKS.length) {
            statusEl.textContent = '\u2705 ALL DONE!';
            log('=== FINAL SUMMARY ===');
            results.forEach(function(r) { log(r); });
            return;
        }

        var task = TASKS[currentIndex];
        statusEl.textContent = 'Prompt ' + task.id + ' (' + (currentIndex + 1) + '/' + TASKS.length + ') \u2014 Editing...';

        // 1. Click Edit
        waitForElement('button[aria-label="Edit this step"]').then(function(editBtn) {
            editBtn.click();
            log('Prompt ' + task.id + ' \u2014 clicked Edit');

            // 2. Paste prompt
            return waitForElement('textarea');
        }).then(function(textarea) {
            setReactTextareaValue(textarea, task.prompt);
            log('Prompt ' + task.id + ' \u2014 pasted prompt');

            // 3. Submit
            return waitForElement('button[type="submit"][aria-label="Submit"]');
        }).then(function(submitBtn) {
            submitBtn.click();
            log('Prompt ' + task.id + ' \u2014 saved prompt');

            // 4. Click Continue for Model A
            return new Promise(function(r) { setTimeout(r, 1000); });
        }).then(function() {
            var contA = getContinueButton();
            if (!contA) throw new Error('No Continue button for A');
            contA.click();
            log('Prompt ' + task.id + ' \u2014 generating Model A...');

            // 5. Wait for responses
            return waitForGenerationComplete();
        }).then(function() {
            var allProse = document.querySelectorAll('.prose');
            var resp1 = allProse[proseOffset] ? allProse[proseOffset].innerText : '';
            var resp2 = allProse[proseOffset + 1] ? allProse[proseOffset + 1].innerText : '';
            var ans1 = extractFinalAnswer(resp1);
            var ans2 = extractFinalAnswer(resp2);
            log('A1: ' + (ans1 || '\u2014') + ' | A2: ' + (ans2 || '\u2014'));

            var aPassed = bothPassed(ans1, ans2, task.expected, task.type);
            proseOffset += 2;

            if (aPassed) {
                var msg = 'Prompt ' + task.id + ': BOTH A PASSED \u2705 (expected ' + task.expected + ')';
                results.push(msg);
                log(msg);
                currentIndex++;
                setTimeout(runNextTask, 1500);
                return;
            }

            // At least one A failed - generate B
            log('A failed at least one \u2192 generating Model B');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

            setTimeout(function() {
                var contB = getContinueButton();
                if (!contB) { log('ERROR: No Continue button for B'); return; }
                contB.click();
                log('Prompt ' + task.id + ' \u2014 generating Model B...');

                waitForGenerationComplete().then(function() {
                    var allProse2 = document.querySelectorAll('.prose');
                    var b1 = allProse2[proseOffset] ? allProse2[proseOffset].innerText : '';
                    var b2 = allProse2[proseOffset + 1] ? allProse2[proseOffset + 1].innerText : '';
                    var bAns1 = extractFinalAnswer(b1);
                    var bAns2 = extractFinalAnswer(b2);
                    log('B1: ' + (bAns1 || '\u2014') + ' | B2: ' + (bAns2 || '\u2014'));

                    var bPassed = bothPassed(bAns1, bAns2, task.expected, task.type);
                    proseOffset += 2;

                    var msg2 = bPassed
                        ? 'Prompt ' + task.id + ': A FAILED, B PASSED'
                        : 'Prompt ' + task.id + ': BOTH MODELS FAILED \uD83C\uDF89 (A1:' + ans1 + ' A2:' + ans2 + ' B1:' + bAns1 + ' B2:' + bAns2 + ')';
                    results.push(msg2);
                    log(msg2);
                    currentIndex++;
                    setTimeout(runNextTask, 2000);
                });
            }, 1500);

        }).catch(function(err) {
            statusEl.textContent = '\u274C ERROR';
            log('Error on Prompt ' + task.id + ': ' + err.message);
            console.error(err);
        });
    }

   // ====================== START ======================
    // Wait for timer dialog and auto-dismiss it, then enable START
    (function waitAndDismissTimer() {
        var iv = setInterval(function() {
            var btns = document.querySelectorAll('button');
            for (var i = 0; i < btns.length; i++) {
                if (btns[i].textContent.trim() === 'Start timer') {
                    btns[i].click();
                    clearInterval(iv);
                    log('Auto-started timer');
                    return;
                }
            }
        }, 500);
        // Stop trying after 10 seconds
        setTimeout(function() { clearInterval(iv); }, 10000);
    })();

    startBtn.onclick = function() {
        startBtn.style.display = 'none';
        statusEl.textContent = 'Starting automation...';
        log('Automation started');
        runNextTask();
    };

    if (document.querySelector('button[aria-label="Edit this step"]')) {
        log('Page detected - ready!');
    }
