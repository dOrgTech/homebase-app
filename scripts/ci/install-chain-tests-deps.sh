#! /usr/bin/env bash

set -euo pipefail

export DEBIAN_FRONTEND="noninteractive"
sudo apt-get update && sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:serokell/tezos && sudo apt-get update
sudo apt-get install -y tezos-baking git curl jq wget make
sudo wget -q -P /usr/bin https://gitlab.com/ligolang/ligo/-/jobs/1553142179/artifacts/raw/ligo && sudo chmod +x /usr/bin/ligo
git clone https://gitlab.com/morley-framework/local-chain.git
