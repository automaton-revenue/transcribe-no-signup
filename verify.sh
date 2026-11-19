#!/usr/bin/env bash
# verify.sh — run the automated checks for this experiment.
#   1. bash syntax of the examples
#   2. node --test: live endpoint challenge, discovery files, examples, article
# No dependencies to install (plain node:test), no paid calls (the 402 is free).
set -euo pipefail
cd "$(dirname "$0")"

echo "== bash -n examples =="
bash -n examples/transcribe.sh

echo "== node --test =="
node --test test/*.test.mjs

echo "VERIFY OK"
