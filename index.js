#!/usr/bin/env node
"use strict";

import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
  boolean: [],
  string: [],
});
