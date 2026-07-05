#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_URL="https://github.com/01-edu/public"
REPO_DIR="$ROOT_DIR/apps/web/public/01edu"

usage() {
  printf 'Usage: %s <clone|pull>\n' "$(basename "$0")"
  printf '\n'
  printf '  clone  Clone %s into %s\n' "$REPO_URL" "$REPO_DIR"
  printf '  pull   Pull the latest changes in %s\n' "$REPO_DIR"
}

case "${1:-}" in
  clone)
    if [ -d "$REPO_DIR/.git" ]; then
      printf 'Repo already exists at %s\n' "$REPO_DIR"
      exit 0
    fi

    if [ -e "$REPO_DIR" ]; then
      printf 'Cannot clone: %s already exists but is not a git repo.\n' "$REPO_DIR" >&2
      exit 1
    fi

    mkdir -p "$(dirname "$REPO_DIR")"
    git clone "$REPO_URL" "$REPO_DIR"
    ;;
  pull)
    if [ ! -d "$REPO_DIR/.git" ]; then
      printf 'Cannot pull: repo not found at %s\n' "$REPO_DIR" >&2
      printf 'Run: pnpm repo:clone\n' >&2
      exit 1
    fi

    git -C "$REPO_DIR" pull --ff-only
    ;;
  -h|--help|help)
    usage
    ;;
  *)
    usage >&2
    exit 1
    ;;
esac
