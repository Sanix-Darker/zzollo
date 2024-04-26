#!/bin/bash

yarn install && \
npm install serve -g && \
yarn build && \
serve -l 3000 -s build
