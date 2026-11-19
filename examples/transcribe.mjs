#!/usr/bin/env node
// Pay $0.03 USDC on Base and get a Whisper transcript — no account, no API key.
//
// Usage:
//   npm install @x402/fetch @x402/evm viem
//   X402_PRIVATE_KEY=0x... node transcribe.mjs "https://example.com/podcast.mp3"
//
// The wallet key is read from the environment and is never printed, logged or
// sent anywhere except inside the x402 payment signature on Base mainnet.
// Any Base wallet with a little USDC works; nothing is registered or subscribed.
import { x402Client, wrapFetchWithPayment } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const ENDPOINT = "https://agent-tools-x402.automaton-agent.workers.dev/transcribe";

const key = process.env.X402_PRIVATE_KEY;
if (!key) {
  console.error("Set X402_PRIVATE_KEY to a Base-mainnet wallet key that holds USDC (test on your own wallet).");
  process.exit(1);
}
const audio = process.argv[2];
if (!audio) {
  console.error("Usage: node transcribe.mjs <public audio or video URL (mp3, wav, m4a, ogg, webm, mp4; max 20 MB)>");
  process.exit(1);
}

// Register an "exact" EVM payment scheme: it signs the challenge the server
// sends (USDC on eip155:8453, payTo the operator's wallet) automatically.
const client = new x402Client().register("eip155:*", new ExactEvmScheme(privateKeyToAccount(key)));
const fetchPaid = wrapFetchWithPayment(fetch, client);

const target = `${ENDPOINT}?url=${encodeURIComponent(audio)}`;
console.error(`Paying $0.03 USDC to transcribe ${audio} ...`);
const res = await fetchPaid(target, { method: "GET" });

if (!res.ok) {
  console.error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  console.error("Nothing was charged for errors; check the URL points at a public audio/video file.");
  process.exit(1);
}

const out = await res.json();
console.log(JSON.stringify(
  {
    url: out.url,
    language: out.language,
    durationSeconds: out.durationSeconds,
    words: out.words,
    text: out.text,
  },
  null,
  2,
));
if (out.vtt) console.error(`\n-- WebVTT subtitles --\n${out.vtt}`);
console.error("\nSegments and the full JSON body are documented in the README and the article.");
