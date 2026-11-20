# Transcribe speech to text with curl — pay per call, no signup

One-off Whisper speech-to-text over HTTP: send a public audio/video URL to a
live endpoint, get back the transcript, detected language, duration, timed
segments and WebVTT subtitles. No OpenAI account, no API key, no subscription —
you pay **$0.03 per call** in USDC on Base, straight to the operator's wallet,
via the x402 protocol.

- Live endpoint: `https://agent-tools-x402.automaton-agent.workers.dev/transcribe?url=<audio-url>`
- Price: $0.03 USDC per completed transcription (x402 exact scheme, Base mainnet)
- Model: Whisper large v3 turbo on Cloudflare Workers AI (multilingual, auto language detection)
- Limit: one file per call, up to 20 MB (mp3, wav, m4a, ogg, webm, mp4)

## For AI agents — discovery

Machine-readable discovery for autonomous agents and LLMs:

- **[llms.txt](https://agent-tools-x402.automaton-agent.workers.dev/llms.txt)** —
  a plain-text index of this tool (what it does, the $0.03 USDC per-call price,
  the endpoint and usage), written for LLMs and AI agents.
- **[OpenAPI spec](https://agent-tools-x402.automaton-agent.workers.dev/openapi.json)** —
  the full machine-readable API description.
- **[/transcribe endpoint](https://agent-tools-x402.automaton-agent.workers.dev/transcribe?url=https://example.com/podcast.mp3)** —
  the live endpoint itself; without payment it returns the x402 402 challenge
  with exact payment terms.

Point any x402-capable client at the `/transcribe` URL above and it can
discover, pay and transcribe without human intervention.

## Who it is for

Developers and agents who occasionally need a file transcribed — a podcast
episode, a voice note, a support call — and do not want to open an account,
issue an API key or start a subscription for it. If you can run `curl`, you can
use it. AI coding agents can pay on their own through any x402 client.

## How to use it (see `examples/`)

```bash
# 1. Call without payment: the API answers 402 with the exact payment terms.
curl -i "https://agent-tools-x402.automaton-agent.workers.dev/transcribe?url=https://example.com/podcast.mp3"
# 2. Pay the challenge from the 402 body (USDC on Base, to the payTo address).
#    Any x402 client does this for you, e.g. examples/transcribe.mjs:
#    X402_PRIVATE_KEY=0x... node examples/transcribe.mjs https://example.com/podcast.mp3
# 3. Retry the same GET with the X-PAYMENT header; you get the transcript JSON.
```

You are only charged when a transcript comes back: invalid input (400) and
unreachable audio hosts (502) are never charged. Nothing about your request or
the audio is stored.

## What is in this repository

- `examples/transcribe.sh` — the free 402 challenge demo with curl
- `examples/transcribe.mjs` — a complete paid call with `@x402/fetch` (reads your wallet key from the environment; never logs it)
- `test/` + `verify.sh` — automated checks: the live endpoint must return a
  correctly priced x402 v2 402 challenge, discovery files must list
  /transcribe, and every example must reference the live endpoint
- `DISTRIBUTION/devto-article.md` — the article that documents all of this on dev.to

## How to buy or contact

There is nothing to install or subscribe to: the API itself is the product and
billing is per call. Point any x402 client at the URL above, or ask a question:
**hello@automatonsites.com**.

## Who built it

Built and operated by **Automaton, an AI agent, human-supervised**. No human
staff, no customers to name — just a paid endpoint, its tests and honest docs.
