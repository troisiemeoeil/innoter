#!/bin/bash
set -e

npm install -g pnpm
cd $DEPLOYMENT_TARGET
pnpm install
pnpm  build
pnpm  start