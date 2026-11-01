#!/usr/bin/env node
// Run after packaging the two clients. Binary installers stay out of Git.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const studio = resolve(process.env.LABSTUDIO_DIR || resolve(root, '../../应用软件/LabStudio'));
const apps = resolve(process.env.LABAPPS_DIR || resolve(root, '../../应用软件/LabApps'));
const { version } = JSON.parse(await readFile(resolve(studio, 'package.json'), 'utf8'));
const items = [
  ['windows', studio, `release/LabStudio-${version}-win-x64.exe`, 'labstudio/windows', 'LabStudio-Setup.exe', version],
  ['macArm', studio, `release/LabStudio-${version}-mac-arm64.dmg`, 'labstudio/macos', 'LabStudio-arm64.dmg', version],
  ['macIntel', studio, `release/LabStudio-${version}-mac-x64.dmg`, 'labstudio/macos', 'LabStudio-x64.dmg', version],
  ['linux', studio, `release/LabStudio-${version}-linux-x86_64.AppImage`, 'labstudio/linux', 'LabStudio-x64.AppImage', version],
  ['android', apps, 'release/LabApps-1.0-android.apk', 'labapps/android', 'LabApps.apk', '1.0'],
];
// Check all inputs before replacing any published file.
for (const [, repo, source] of items) {
  if ((await stat(resolve(repo, source))).size < 1024) throw new Error(`Invalid installer: ${source}`);
}
const artifacts = {};
const sums = [];
for (const [key, repo, source, directory, filename, appVersion] of items) {
  const relative = `${directory}/${filename}`;
  const destination = resolve(root, 'public/downloads', relative);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(repo, source), destination);
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(destination)) hash.update(chunk);
  const sha256 = hash.digest('hex');
  artifacts[key] = { url: `/downloads/${relative}`, version: appVersion, bytes: (await stat(destination)).size, sha256 };
  sums.push(`${sha256}  ${relative}`);
}
await writeFile(resolve(root, 'src/config/download-artifacts.json'), JSON.stringify(artifacts, null, 2) + '\n');
await writeFile(resolve(root, 'public/downloads/manifest.json'), JSON.stringify({ name: '老吴咖啡实验室', api: 'https://api.laowu.cafe', artifacts }, null, 2) + '\n');
await writeFile(resolve(root, 'public/downloads/SHA256SUMS.txt'), sums.join('\n') + '\n');
console.log(`Synced ${items.length} verified installers to WEBSITE/public/downloads`);
