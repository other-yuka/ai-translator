#!/usr/bin/env node
import { program } from './cli';

if (require.main === module) {
  program.parse();
}

export { program };
