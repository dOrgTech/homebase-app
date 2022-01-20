#! /usr/bin/env bash

set -euo pipefail

cwd="$(cd "$(dirname "$0")" &> /dev/null && pwd)"
repo="$(jq -r .repo < "$cwd/baseDAO.json")"
branch="$(jq -r .branch < "$cwd/baseDAO.json")"
rev="$(jq -r .rev < "$cwd/baseDAO.json")"

function get_address_by_alias() {
    alias="$1"
    tezos-client list known contracts | grep "$alias" | cut -d' ' -f2
}

function originate_contract() {
    alias="$1"
    src="$2"
    storage="$3"
    tezos-client originate contract "$alias" transferring 0 from baker running "$src" --init "$storage" --burn-cap 10
    get_address_by_alias "$1"
}

git clone --single-branch --branch "$branch" "$repo"
cd baseDAO && git checkout "$rev"
make out/baseDAO.tz

originate_contract "dummyFA2" "$cwd/contracts/dummy_fa2.tz" "{}"
DUMMY_FA2_ADDRESS="$(get_address_by_alias dummyFA2)"
originate_contract "dummyGuardian" "$cwd/contracts/dummy_guardian.tz" "Unit"
DUMMY_GUARDIAN_ADDRESS="$(get_address_by_alias dummyGuardian)"
ADMIN_ADDRESS=$(get_address_by_alias baker)

make out/treasuryDAO_storage.tz \
    admin_address="$ADMIN_ADDRESS" \
    guardian_address="$DUMMY_GUARDIAN_ADDRESS" \
    governance_token_address="$DUMMY_FA2_ADDRESS" \
    governance_token_id=0n \
    start_level=0n
make out/registryDAO_storage.tz \
    admin_address="$ADMIN_ADDRESS" \
    guardian_address="$DUMMY_GUARDIAN_ADDRESS" \
    governance_token_address="$DUMMY_FA2_ADDRESS" \
    governance_token_id=0n \
    start_level=0n

tezos-client originate contract treasuryDAO transferring 0 from baker running out/baseDAO.tz \
    --init "$(<out/treasuryDAO_storage.tz)" --burn-cap 10
tezos-client originate contract registryDAO transferring 0 from baker running out/baseDAO.tz \
    --init "$(<out/treasuryDAO_storage.tz)" --burn-cap 10
TREASURY_DAO_ADDRESS="$(get_address_by_alias treasuryDAO)"
REGISTRY_DAO_ADDRESS="$(get_address_by_alias registryDAO)"

echo "TREASURY_DAO_ADDRESS=$TREASURY_DAO_ADDRESS" >> $GITHUB_ENV
echo "REGISTRY_DAO_ADDRESS=$REGISTRY_DAO_ADDRESS" >> $GITHUB_ENV
echo "DUMMY_FA2_ADDRESS=$DUMMY_FA2_ADDRESS" >> $GITHUB_ENV
echo "DUMMY_GUARDIAN_ADDRESS=$DUMMY_GUARDIAN_ADDRESS" >> $GITHUB_ENV
echo "ADMIN_ADDRESS=$ADMIN_ADDRESS" >> $GITHUB_ENV
