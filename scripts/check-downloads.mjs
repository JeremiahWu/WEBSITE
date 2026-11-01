import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifacts = JSON.parse(await readFile(resolve(root, 'src/config/download-artifacts.json'), 'utf8'));
for (const [platform, artifact] of Object.entries(artifacts)) {
  const file = resolve(root, 'public', '.' + artifact.url);
  let info;
  try { info = await stat(file); }
  catch { throw new Error(`Missing ${platform} installer. Run npm run downloads:sync before building WEBSITE.`); }
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  if (info.size !== artifact.bytes || hash.digest('hex') !== artifact.sha256) {
    throw new Error(`Installer mismatch: ${platform}. Run npm run downloads:sync again.`);
  }
}
console.log('All five download artifacts match their sizes and SHA-256 checksums.');
