#!/usr/bin/env bash
set -euo pipefail

VM_HOST="${VM_HOST:-192.168.56.101}"
VM_SSH_PORT="${VM_SSH_PORT:-22}"
ATTEMPTS="${ATTEMPTS:-8}"

if ! command -v sshpass >/dev/null 2>&1; then
  echo "sshpass is required on the machine running this script."
  echo "Install it, or generate failed SSH attempts manually against ${VM_HOST}:${VM_SSH_PORT}."
  exit 1
fi

for i in $(seq 1 "$ATTEMPTS"); do
  sshpass -p "wrong-password-${i}" ssh \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    -o ConnectTimeout=4 \
    -p "$VM_SSH_PORT" \
    attacker@"$VM_HOST" true || true
done

echo "Generated ${ATTEMPTS} failed SSH attempts against ${VM_HOST}:${VM_SSH_PORT}."
