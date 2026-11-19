// Test 2: the endpoint is discoverable — machine-readable price, no API-key
// security, and the human-readable llms.txt agrees.
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = "https://agent-tools-x402.automaton-agent.workers.dev";

test("/openapi.json advertises GET /transcribe at $0.03 with no security scheme", async () => {
  const res = await fetch(`${BASE}/openapi.json`);
  assert.equal(res.status, 200);
  const doc = await res.json();
  const op = doc.paths?.["/transcribe"]?.get;
  assert.ok(op, "openapi must document GET /transcribe");
  assert.equal(op.security?.length, 0, "security must be [] (no API key)");
  const price = op["x-payment-info"]?.price;
  assert.ok(price, "x-payment-info price must be present");
  assert.equal(price.amount, "0.03");
  assert.equal(price.currency, "USD");
  assert.equal(price.mode, "fixed");
  assert.ok(op["x-payment-info"].protocols.some((p) => "x402" in p), "must speak x402");
  assert.ok(op.tags.includes("speech-to-text"));
});

test("/llms.txt lists the transcribe route, its price and the not-charged rule", async () => {
  const res = await fetch(`${BASE}/llms.txt`);
  assert.equal(res.status, 200);
  const txt = await res.text();
  assert.match(txt, /GET \/transcribe/);
  assert.match(txt, /\$0\.03/);
  assert.match(txt, /not charged/i);
});
