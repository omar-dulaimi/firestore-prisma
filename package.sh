#!/bin/bash
# Fail loudly. Without `set -e` a missing tsc left package/ with no lib/ at all and the
# script still exited 0, so a pipeline would happily publish a tarball containing no code.
set -euo pipefail
START_TIME=$SECONDS

echo "Building package..."
rm -rf lib package
# Explicit path, not bare `tsc`: node_modules/.bin is only on PATH when this script is
# started by `npm run`, and CI invokes it directly.
./node_modules/.bin/tsc
mkdir package

echo "Copying files..."
cp -r lib package/lib
cp package.json README.md LICENSE package

echo "Making package.json public..."
sed -i 's/"private": true/"private": false/' ./package/package.json

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Done in $ELAPSED_TIME seconds!"
