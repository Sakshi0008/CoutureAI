import { register } from 'ts-node/esm';
import { pathToFileURL } from 'url';

register({
  project: './tsconfig.server.json'
});

import(pathToFileURL('./src/server/server.ts').href);
