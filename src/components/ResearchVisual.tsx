export default function ResearchVisual({ theme }: { theme: "ai" | "robotics" | "xr" }) {
  return (
    <div className={`research-visual visual-${theme}`} role="img" aria-label={{ ai: "语言模型概念图：相互连接的智能核心", robotics: "机器人概念图：机械臂与移动底座", xr: "空间终端概念图：头戴式显示器" }[theme]}>
      <svg viewBox="0 0 800 480" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`metal-${theme}`} x1="200" y1="80" x2="580" y2="400" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff"/><stop offset=".3" stopColor="#dce4ee"/><stop offset=".55" stopColor="#67778c"/><stop offset=".75" stopColor="#e4ebf5"/><stop offset="1" stopColor="#8290a3"/>
          </linearGradient>
          <linearGradient id={`glass-${theme}`} x1="230" y1="160" x2="550" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="#202a46"/><stop offset=".5" stopColor="#060b18"/><stop offset="1" stopColor="#515f8c"/>
          </linearGradient>
          <radialGradient id={`glow-${theme}`}><stop stopColor="currentColor" stopOpacity=".45"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient>
        </defs>
        <ellipse cx="400" cy="250" rx="340" ry="220" fill={`url(#glow-${theme})`}/>
        {theme === "ai" ? <g>
          {[0, 1, 2, 3].map((n) => <ellipse key={n} cx="400" cy="240" rx={160 + n * 20} ry={65 + n * 18} transform={`rotate(${n * 45} 400 240)`} stroke="currentColor" strokeOpacity={.3 + n * .15} strokeWidth="1.5" />)}
          <rect x="334" y="174" width="132" height="132" rx="34" fill={`url(#glass-${theme})`} stroke="#9db9ff" strokeWidth="2" transform="rotate(-12 400 240)"/>
          <path d="M376 261v-42l24 42v-42m17 0v42" stroke="#d9e7ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          {[[196, 198], [598, 282], [458, 78], [339, 399], [573, 139], [240, 338]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="6" fill="#deebff"/>)}
        </g> : theme === "robotics" ? <g strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="400" cy="404" rx="190" ry="17" fill="#000" opacity=".12"/>
          <path d="M331 345l-39-135 91-97 94 58" stroke="#536174" strokeWidth="52"/>
          <path d="M331 345l-39-135 91-97 94 58" stroke={`url(#metal-${theme})`} strokeWidth="42"/>
          {[[292,210],[383,113],[477,171]].map(([x,y],i) => <g key={i}><circle cx={x} cy={y} r="24" fill="#182538" stroke="#cdd8e6" strokeWidth="6"/><circle cx={x} cy={y} r="8" fill="#66d5d4"/></g>)}
          <path d="M491 184l34 28-9 35m-21-51l-4 35 21 20" stroke="#60728a" strokeWidth="12"/>
          <rect x="281" y="333" width="241" height="59" rx="23" fill={`url(#metal-${theme})`}/>
          <rect x="306" y="369" width="44" height="35" rx="12" fill="#1e293b"/><rect x="453" y="369" width="44" height="35" rx="12" fill="#1e293b"/>
          <path d="M379 354h42" stroke="#37b6b1" strokeWidth="5"/>
        </g> : <g>
          <ellipse cx="400" cy="379" rx="211" ry="20" fill="#000" opacity=".16"/>
          <path d="M238 216c-15-100 340-100 324 0" stroke="#a5aabd" strokeWidth="31"/>
          <path d="M235 214c-12-87 342-87 330 0" stroke="#e8eaf1" strokeWidth="18"/>
          <path d="M211 217c0-44 65-63 189-63s189 19 189 63l-14 83c-6 40-58 50-101 29l-45-23c-18-9-40-9-58 0l-45 23c-43 21-95 11-101-29z" fill={`url(#metal-${theme})`}/>
          <path d="M226 223c0-33 59-53 174-53s174 20 174 53l-13 70c-6 31-46 36-81 20l-49-23c-20-10-42-10-62 0l-49 23c-35 16-75 11-81-20z" fill={`url(#glass-${theme})`} stroke="#aab5d5"/>
          <path d="M254 211c60-31 184-36 273-3" stroke="#c5c8ff" strokeWidth="6" opacity=".5" strokeLinecap="round"/>
          <circle cx="263" cy="272" r="7" fill="#505b80"/><circle cx="537" cy="272" r="7" fill="#505b80"/>
        </g>}
      </svg>
      <span className="visual-caption">LABSOFT / CONCEPT EXPLORATION</span>
    </div>
  );
}
