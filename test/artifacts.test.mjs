// Test 3: the shipped artifacts are coherent — every example targets the live
// endpoint, the paid example keeps the wallet key safe, the README explains how
// to buy/contact and says it is AI-built, and the dev.to article is publishable.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const LIVE = /agent-tools-x402\.automaton-agent\.workers\.dev\/transcribe/;

test("README states purpose, audience, purchase/contact, and AI authorship", () => {
  const readme = read("README.md");
  assert.match(readme, LIVE);
  assert.match(readme, /\$0\.03/);
  assert.match(readme, /hello@automatonsites\.com/);
  assert.match(readme, /AI agent/i);
  assert.match(readme, /human-supervised/i);
  assert.match(readme, /Who it is for/i);
});

test("curl demo uses the live endpoint and decodes the 402 challenge", () => {
  const sh = read("examples/transcribe.sh");
  assert.match(sh, /agent-tools-x402\.automaton-agent\.workers\.dev/);
  assert.match(sh, /PAYMENT-REQUIRED/);
  assert.match(sh, /accepts\[0\]/);
});

test("paid example pays via x402 and never exposes the wallet key", () => {
  const mjs = read("examples/transcribe.mjs");
  assert.match(mjs, LIVE);
  assert.match(mjs, /x402Client/);
  assert.match(mjs, /wrapFetchWithPayment/);
  assert.match(mjs, /ExactEvmScheme/);
  assert.match(mjs, /X402_PRIVATE_KEY/);
  assert.doesNotMatch(mjs, /JSON\.stringify\(\{\s*key/, "key must never be serialized");
  // The invariant is the secret VALUE never being printed: no ${key} interpolation
  // and no process.env read inside a console call (messages may name the variable).
  assert.doesNotMatch(mjs, /console\.\w+\([^)]*\$\{key/, "the key value must never be logged");
  assert.doesNotMatch(mjs, /console\.\w+\([^)]*process\.env/, "the key must never be logged from the environment");
});

test("dev.to article has valid front matter, a 400+ word body and the live endpoint", () => {
  const raw = read("DISTRIBUTION/devto-article.md");
  const fm = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  assert.ok(fm, "article must start with YAML front matter");
  for (const field of ["title:", "tags:", "canonical_url:", "description:"]) {
    assert.ok(fm[1].includes(field), `front matter must include ${field}`);
  }
  const tags = /^tags:\s*\[(.*)\]$/m.exec(fm[1])[1].split(",").map((t) => t.trim().replace(/["']/g, "")).filter(Boolean);
  assert.ok(tags.length > 0 && tags.length <= 4, "dev.to allows at most 4 tags");
  const words = fm[2].trim().split(/\s+/).filter(Boolean).length;
  assert.ok(words >= 400, `article body must be at least 400 words, got ${words}`);
  assert.match(fm[2], LIVE);
  assert.match(fm[2], /\$0\.03/);
  assert.match(fm[2], /curl/, "article must show runnable curl examples");
});
