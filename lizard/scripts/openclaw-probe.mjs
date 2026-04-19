#!/usr/bin/env node
// openclaw-probe.mjs — probe the OpenClaw WebSocket gateway
//
// Usage (gateway token — simplest):
//   OPENCLAW_TOKEN=$(openclaw dashboard | grep -o 'token=[^&# ]*' | cut -d= -f2) \
//   node scripts/openclaw-probe.mjs
//
// On PAIRING_REQUIRED the script auto-approves via `openclaw gateway call` and reconnects.

import { createRequire } from 'module';
import { randomUUID, createPrivateKey, sign } from 'crypto';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);

const WS_URL  = process.env.OPENCLAW_WS      ?? 'ws://127.0.0.1:18789';
const TOKEN   = process.env.OPENCLAW_TOKEN   ?? '';
const SESSION = process.env.OPENCLAW_SESSION ?? 'agent:main:main';
const MSG     = process.env.OPENCLAW_MSG     ?? 'Reply with the single word: pong.';

// Optional: device signing (only needed when using a device token, not a gateway token)
const DEVICE_ID  = process.env.OPENCLAW_DEVICE_ID  ?? '';
const PUBLIC_KEY = process.env.OPENCLAW_PUBLIC_KEY ?? '';
const PRIV_KEY   = process.env.OPENCLAW_DEVICE_KEY ?? '';

if (!TOKEN) {
  console.error('ERROR: set OPENCLAW_TOKEN  (run: openclaw dashboard, copy the token= value)');
  process.exit(1);
}

let WebSocket;
try {
  WebSocket = require('ws');
} catch {
  console.error('ws not found — run: npm install ws');
  process.exit(1);
}

const SCOPES = [
  'operator.admin','operator.read','operator.write','operator.approvals','operator.pairing',
];

// Ed25519 device signing — only used when PRIV_KEY is set.
// Gateway verifies: Ed25519( "v2|deviceId|clientId|clientMode|role|scopes|signedAtMs|token|nonce" )
function buildDevice(nonce, ts) {
  if (!PRIV_KEY || !DEVICE_ID || !PUBLIC_KEY) return null;
  const msg = ['v2', DEVICE_ID, 'openclaw-control-ui', 'webchat', 'operator',
    SCOPES.join(','), String(ts), TOKEN, nonce].join('|');
  const pkcs8Header = Buffer.from('302e020100300506032b657004220420', 'hex');
  const der = Buffer.concat([pkcs8Header, Buffer.from(PRIV_KEY, 'base64url')]);
  const privateKey = createPrivateKey({ key: der, format: 'der', type: 'pkcs8' });
  const sig = sign(null, Buffer.from(msg, 'utf8'), privateKey);
  return { id: DEVICE_ID, publicKey: PUBLIC_KEY, signature: sig.toString('base64url'), signedAt: ts, nonce };
}

let attempt = 0;

function connect() {
  attempt++;
  console.log(`\n[probe] connect attempt ${attempt}`);
  const ws = new WebSocket(WS_URL, { headers: { Origin: 'http://127.0.0.1:18789' } });

  ws.on('open', () => console.log(`[open] ${WS_URL}`));

  // Track pending requests by id → method name
  const pending = new Map();

  ws.on('message', raw => {
    let frame;
    try { frame = JSON.parse(raw); } catch { console.log('[in raw]', raw); return; }
    console.log('[in]', JSON.stringify(frame, null, 2));

    // Challenge → send connect
    if (frame.type === 'event' && frame.event === 'connect.challenge') {
      const nonce = frame.payload?.nonce;
      const ts = Date.now();
      const device = buildDevice(nonce, ts);
      console.log(`[probe] challenge nonce=${nonce} device-signing=${device ? 'yes' : 'no'}`);
      const id = randomUUID();
      const params = {
        minProtocol: 3, maxProtocol: 3,
        client: { id: 'openclaw-control-ui', version: 'probe', platform: 'node', mode: 'webchat' },
        role: 'operator', scopes: SCOPES, caps: ['tool-events'],
        auth: { token: TOKEN },
        userAgent: 'claude-code-probe', locale: 'en-US',
      };
      if (device) params.device = device;
      pending.set(id, 'connect');
      send(ws, { type: 'req', id, method: 'connect', params });
      return;
    }

    // Response dispatch by id
    if (frame.type === 'res') {
      const method = pending.get(frame.id);
      pending.delete(frame.id);

      if (method === 'connect') {
        if (!frame.ok) {
          const code = frame.error?.details?.code;
          if (code === 'PAIRING_REQUIRED' && attempt < 3) {
            const requestId = frame.error?.details?.requestId;
            console.log(`[probe] PAIRING_REQUIRED requestId=${requestId}`);
            if (requestId) {
              console.log(`[probe] auto-approving via openclaw gateway call...`);
              try {
                const result = execSync(
                  `openclaw gateway call device.pair.approve '{"requestId":"${requestId}"}'`,
                  { encoding: 'utf8', timeout: 10000 }
                );
                console.log(`[probe] approve result: ${result.trim()}`);
              } catch (e) {
                console.error(`[probe] approve failed: ${e.message}`);
              }
            }
            setTimeout(connect, 1500);
            return;
          }
          console.error('[probe] connect FAILED:', JSON.stringify(frame.error, null, 2));
          process.exit(1);
        }
        console.log('[probe] connect SUCCESS');
        if (frame.payload?.deviceToken) {
          console.log(`[probe] device token for future use: ${frame.payload.deviceToken}`);
        }
        sendChat(ws, pending);
        return;
      }

      if (method === 'chat.send') {
        if (!frame.ok) {
          console.error('[probe] chat.send FAILED:', JSON.stringify(frame.error, null, 2));
        } else {
          console.log('[probe] chat.send SUCCESS — waiting for reply events...');
        }
        return;
      }
    }
  });

  ws.on('error', err => console.error('[error]', err.message));
  ws.on('close', (code, reason) => {
    console.log(`[close] code=${code} reason=${reason?.toString()}`);
    // Don't exit on 1008 if we're about to reconnect (PAIRING_REQUIRED path handles it)
  });
}

function send(ws, obj) {
  console.log('[out]', JSON.stringify(obj, null, 2));
  ws.send(JSON.stringify(obj));
}

function sendChat(ws, pending) {
  const id = randomUUID();
  pending.set(id, 'chat.send');
  send(ws, {
    type: 'req', id,
    method: 'chat.send',
    params: { sessionKey: SESSION, message: MSG, deliver: false, idempotencyKey: randomUUID() },
  });
}

connect();
