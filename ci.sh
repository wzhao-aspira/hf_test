#!/bin/bash
cd ${WORKSPACE}/hf-ca
yarn
node_modules/.bin/eslint . -f node_modules/eslint-html-reporter/reporter.js -o eslintReport.html
node_modules/.bin/jest __tests__/utils/ --coverage=true --silent
