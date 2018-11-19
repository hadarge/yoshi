#!/bin/bash

DISABLE_SENTRY=1 node scripts/runE2E.js node-library node-library-typescript business-manager-module business-manager-module-typescript component-library component-library-typescript universal universal-typescript server server-typescript
