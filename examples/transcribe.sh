#!/usr/bin/env bash
# Demo: the live /transcribe endpoint answers an unpaid call with a 402 that
# carries the exact payment terms (x402 v2). No account, no API key, no signup.
# Run:  ./examples/transcribe.sh [audio-or-video-url]
set -euo pipefail

BASE="https://agent-tools-x402.automaton-agent.workers.dev"
URL="${1:-https://example.com/podcast.mp3}"

echo "== GET $BASE/transcribe?url=$URL (no payment header) =="
STATUS=$(curl -s -o /tmp/transcribe-402.json -w '%{http_code}' -D /tmp/transcribe-402.h \
  --get --data-urlencode "url=$URL" "$BASE/transcribe")
echo "HTTP $STATUS"
if [ "$STATUS" != "402" ]; then
  echo "expected 402 Payment Required; got $STATUS" >&2
  cat /tmp/transcribe-402.json >&2
  exit 1
fi

echo "-- payment challenge (decoded from the PAYMENT-REQUIRED header) --"
node -e '
const fs = require("fs");
const h = fs.readFileSync("/tmp/transcribe-402.h", "utf8");
const b64 = /^PAYMENT-REQUIRED: (.*)$/m.exec(h)[1].trim();
const c = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
const a = c.accepts[0];
console.log("x402Version :", c.x402Version);
console.log("network     :", a.network);
console.log("amount      :", a.amount, "(USDC, 6 decimals => $0.03)");
console.log("asset       :", a.asset);
console.log("payTo       :", a.payTo);
console.log("description :", c.resource.description);
'
echo
echo "-- to actually pay and get the transcript, run examples/transcribe.mjs --"
