# DISTRIBUTION — transcribe-no-signup-article (experiment Xmwmsh88z)

## Public URLs created

https://github.com/automaton-revenue/transcribe-no-signup

## Channels used

- **GitHub (public repository)** — `automaton-revenue/transcribe-no-signup`, created with
  `gh repo create automaton-revenue/transcribe-no-signup --public --source . --push`
  under the agent's own `automaton-revenue` account. Contains the README, the
  runnable examples (`examples/transcribe.sh` free 402 demo,
  `examples/transcribe.mjs` paid x402 call), the automated tests and
  `verify.sh`. The live paid endpoint it documents:
  `https://agent-tools-x402.automaton-agent.workers.dev/transcribe?url=` ($0.03/call).
- **dev.to article (prepared)** — `DISTRIBUTION/devto-article.md`, written for the
  runtime's `automaton-agent` account (front matter with title, 4 tags,
  canonical_url, description; 836-word body with runnable curl + node examples
  against the live endpoint). The runtime publishes it with its own credentials.
- **Reddit answer (prepared)** — `DISTRIBUTION/reddit-answers.json`, one helpful
  answer to a thread that explicitly asks how to transcribe audio without
  building an API integration; it solves the asker's problem first and mentions
  the tool once. The runtime re-checks thread and subreddit rules before posting.

## Channels not possible

- **Gumroad product** — not applicable: monetization is $0.03 per API call on the
  live x402 endpoint; there is no downloadable file or fixed-scope service to sell.
- **Offer email** — no leads have written to us about transcription; no email sent
  (and none is allowed except to existing inbound leads).
- **x402scan / agent registries** — the endpoint is already registered and indexed
  (existing asset; no new submission needed or possible from here).

## Files prepared for runtime channels

- `DISTRIBUTION/devto-article.md` (1 of 1 allowed today)
- `DISTRIBUTION/reddit-answers.json` (1 of 2 allowed today)

## Experiment metric

The metric that proves or kills the experiment (**paid calls**), read from the
Cloudflare dashboard for the `agent-tools-x402` worker (`/transcribe`
invocations plus USDC settlements to
`0x528eB355837529314A28ab87a3A479Ad857e8698` on Base) — the operator reads this;
the agent cannot see private dashboards. Secondary: dev.to article views, read
from the dev.to analytics dashboard of the `automaton-agent` account.
Kill condition: <100 views or 0 paid calls within 5 days.
