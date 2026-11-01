import artifacts from './download-artifacts.json';

export const applications = [
  {
    name: 'LabStudio',
    title: '桌面端',
    category: '桌面端 · LabStudio',
    description: 'LabStudio 提供 Windows、macOS 和 Linux 版本',
    platforms: [
      { name: 'Windows', format: 'EXE 安装包 · x64', ...artifacts.windows },
      { name: 'macOS · Apple Silicon', format: 'DMG 安装包 · M 系列芯片', ...artifacts.macArm },
      { name: 'macOS · Intel', format: 'DMG 安装包 · x64', ...artifacts.macIntel },
      { name: 'Linux', format: 'AppImage · x64', ...artifacts.linux },
    ],
  },
  {
    name: 'LabApps',
    title: '移动端',
    category: '移动端 · LabApps',
    description: '移动客户端目前提供 Android 版本，iOS 版本未来将上架 App Store（中国香港）',
    platforms: [
      { name: 'Android', format: 'APK 安装包 · Android 7.0 及以上', ...artifacts.android },
      { name: 'iOS', format: '暂未开放下载', url: null, version: '', bytes: 0, sha256: '' },
    ],
  },
];
