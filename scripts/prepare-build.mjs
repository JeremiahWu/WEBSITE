// Next 14's recursive build cleanup follows directory symlinks. Never let a
// local standalone preview link point back into source public/ or static/.
import { readdir, realpath, unlink } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = resolve(root, 'public');
const staticRoot = resolve(root, '.next/static');
async function cleanLinks(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) {
      const target = await realpath(path).catch(() => '');
      if (target === publicRoot || target.startsWith(publicRoot + sep) || target === staticRoot) {
        await unlink(path);
        console.log('Removed unsafe build-output link:', path);
      }
    } else if (entry.isDirectory()) await cleanLinks(path);
  }
}
await cleanLinks(resolve(root, '.next'));
await cleanLinks(resolve(root, '.next-dev'));
