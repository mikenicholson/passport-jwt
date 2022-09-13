#! /usr/bin/env bash
#
#  Install peer dependencies if running node version < 7.0.0
#  Version 7 and beyond install peer dependencies by default
 set -euo pipefail

npm_version="$(npm --version)"
npm_major_version="${npm_version%%\.*}"

if [[ $npm_major_version -ge 7 ]]; then 
    echo "NPM version ${npm_version} will automatically install peer dependencies."
    exit 0
fi

echo "Installing peer dependencies"
npm install @nestjs/common reflect-metadata rxjs