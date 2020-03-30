#!/usr/bin/env bash

set -o errexit
set -o xtrace
trap cleanup EXIT

ganache_port=9555

oz="node_modules/.bin/oz"

cleanup() {
  if [ -n "$ganache_pid" ] && ps -p $ganache_pid > /dev/null; then
    kill -9 $ganache_pid
  fi
}

start_ganache() {
  node_modules/.bin/ganache-cli --version
  node_modules/.bin/ganache-cli -d -i 4447 -p $ganache_port > /dev/null &
  ganache_pid=$!
}


rm -f .openzeppelin/dev-4447.json
start_ganache
sleep 2

$oz --version

# $oz push --network test --no-interactive
# $oz deploy Counter --network test --kind regular --no-interactive 
$oz compile Counter --no-interactive

PROVIDER_URL="http://localhost:${ganache_port}" node src/deploy.js
