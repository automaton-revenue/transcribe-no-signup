// Test 1: the live paid endpoint answers an unpaid call with a correct x402 v2
// challenge at the advertised $0.03. This call is free — it never pays.
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = "https://agent-tools-x402.automaton-agent.workers.dev";
const PAY_TO = "0x528eB355837529314A28ab87a3A479Ad857e8698";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function challenge() {
  const res = await fetch(`${BASE}/transcribe?url=${encodeURIComponent("https://example.com/podcast.mp3")}`);
  assert.equal(res.status, 402, `unpaid /transcribe must answer 402, got ${res.status}`);
  const header = res.headers.get("payment-required");
  assert.ok(header, "402 must carry the PAYMENT-REQUIRED header");
  return JSON.parse(Buffer.from(header, "base64").toString("utf8"));
}

test("unpaid call returns an x402 v2 exact challenge", async () => {
  const c = await challenge();
  assert.equal(c.x402Version, 2);
  const a = c.accepts[0];
  assert.equal(a.scheme, "exact");
  assert.equal(a.network, "eip155:8453", "must be Base mainnet");
  assert.equal(a.payTo, PAY_TO);
  assert.equal(a.asset, USDC_BASE, "must be native USDC on Base");
  assert.equal(Number(a.amount), 30000, "30000 USDC units = $0.03");
  assert.ok(Number.isInteger(a.maxTimeoutSeconds) && a.maxTimeoutSeconds > 0);
});

test("challenge describes the resource as speech to text at $0.03 with no signup", async () => {
  const c = await challenge();
  assert.match(c.resource.description, /speech to text/i);
  assert.match(c.resource.description, /\$0\.03/);
  assert.match(c.resource.description, /no account or API key/i);
  assert.equal(c.resource.mimeType, "application/json");
});
