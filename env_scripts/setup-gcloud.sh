#!/bin/bash
set -e

SRC_DIR=$(cd "$(dirname "$0")/.."; pwd)
export CLOUDSDK_CONFIG="$SRC_DIR/.gcloud"
mkdir -p "$CLOUDSDK_CONFIG"

ACCOUNT="runnedrun@gmail.com"
PROJECT="david-qa"

if ! gcloud auth list --filter="account:$ACCOUNT" --format="value(account)" 2>/dev/null | grep -qx "$ACCOUNT"; then
  echo "Logging in as $ACCOUNT..."
  gcloud auth login "$ACCOUNT"
fi

gcloud config set account "$ACCOUNT"
gcloud config set project "$PROJECT"

echo "✅ gcloud configured for this repo"
gcloud config list
