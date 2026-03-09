import { cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceDir = resolve(root, 'assets');
const targetDir = resolve(root, 'public/assets');

await rm(targetDir, { recursive: true, force: true });
await cp(sourceDir, targetDir, { recursive: true, force: true });

console.log(`Synced assets: ${sourceDir} -> ${targetDir}`);
