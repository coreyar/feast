#!/usr/bin/env bash
set -x
set -e

OUTPUT_DIR="$(pwd)/dist"

LAYER_DIR=$OUTPUT_DIR/layers/nodejs

mkdir -p $LAYER_DIR/node_modules

cp -LR package.json $LAYER_DIR
cp -LR yarn.lock $LAYER_DIR

cd $LAYER_DIR
rm -r $LAYER_DIR/node_modules
yarn install --prod

cd $OUTPUT_DIR/layers

zip -r layers.zip nodejs
