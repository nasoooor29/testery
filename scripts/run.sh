#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$ROOT_DIR/apps/web/public/01edu"

if [ -d "$REPO_DIR/.git" ]; then
    bash "$SCRIPT_DIR/update_repo.sh" pull
else
    bash "$SCRIPT_DIR/update_repo.sh" clone
fi

if ! command -v docker >/dev/null 2>&1; then
    printf 'Docker is not installed or is not available in PATH. Install/start Docker before running the tester.\n' >&2
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    printf 'Docker is installed, but the Docker daemon is not available. Start Docker and try again.\n' >&2
    exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
    printf 'pnpm is not installed or is not available in PATH.\n' >&2
    exit 1
fi

exec pnpm --dir "$ROOT_DIR" run dev
