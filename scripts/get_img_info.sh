#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:?Usage: ./inspect-image.sh <docker-image>}"

echo "=== IMAGE ==="
echo "$IMAGE"
echo

echo "=== PULL ==="
docker pull "$IMAGE" || true
echo

echo "=== HISTORY ==="
docker history --no-trunc "$IMAGE"
echo

echo "=== INSPECT IMPORTANT CONFIG ==="
docker inspect "$IMAGE" --format '
Entrypoint: {{json .Config.Entrypoint}}
Cmd: {{json .Config.Cmd}}
User: {{.Config.User}}
WorkingDir: {{.Config.WorkingDir}}
Env:
{{range .Config.Env}}  {{println .}}{{end}}
ExposedPorts: {{json .Config.ExposedPorts}}
Volumes: {{json .Config.Volumes}}
'
echo

echo "=== FULL INSPECT ==="
docker inspect "$IMAGE"
echo

echo "=== ENTRYPOINT FILES ==="
docker run --rm --entrypoint sh "$IMAGE" -c '
echo "--- find entrypoints/scripts ---"
find /app / -maxdepth 3 \( -name "*entrypoint*" -o -name "*.sh" \) 2>/dev/null | sort | head -200

echo
echo "--- /app/entrypoint.sh content if exists ---"
if [ -f /app/entrypoint.sh ]; then
  cat /app/entrypoint.sh
else
  echo "No /app/entrypoint.sh"
fi

echo
echo "--- /app tree/list ---"
if command -v tree >/dev/null 2>&1; then
  tree -a -L 3 /app
else
  find /app -maxdepth 3 2>/dev/null | sort | head -300
fi
'
