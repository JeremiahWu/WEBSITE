// 放置安装包后，将对应的 url 从 null 改为下方预留的站内路径，再重新构建部署。
export const applications = [
  {
    name: "LabStudio",
    category: "桌面端应用",
    description: "面向 Windows 和 macOS 的桌面窗体应用程序。",
    platforms: [
      { name: "Windows", format: "EXE 安装包", url: null as string | null, path: "/downloads/labstudio/windows/LabStudio-Setup.exe" },
      { name: "macOS", format: "DMG 安装包", url: null as string | null, path: "/downloads/labstudio/macos/LabStudio.dmg" },
    ],
  },
  {
    name: "LabApps",
    category: "移动端应用",
    description: "面向 Android 和 iOS 的移动应用程序。",
    platforms: [
      { name: "Android", format: "APK 安装包", url: null as string | null, path: "/downloads/labapps/android/LabApps.apk" },
      { name: "iOS", format: "发布后提供安装入口", url: null as string | null, path: "/downloads/labapps/ios/" },
    ],
  },
];
