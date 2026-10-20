import { applications } from "@/config/downloads";
export default function AppDownload() {
  return (
    <section id="download" className="home-section home-download">
      <div className="home-container">
        <div className="home-section-heading"><div><p className="home-eyebrow">MADE FOR YOUR EVERYDAY</p><h2>应用下载。<br/><span>从桌面，到掌心。</span></h2></div><p>在电脑上使用 LabStudio，<br/>在手机上使用 LabApps。</p></div>
        <div className="home-app-grid">{applications.map((app, index) => <article key={app.name} className="home-app-card">
          <p className="home-eyebrow">{app.category}</p><h3>{app.name}</h3><p className="home-app-description">{app.description}</p>
          <div className={`home-device-scene ${index === 0 ? "scene-desktop" : "scene-mobile"}`} aria-hidden="true"><div className="home-device"><div className="device-screen"><span>{index === 0 ? "LS" : "LA"}</span><i/><i/><i/></div></div><div className="device-shadow"/></div>
          <ul className="home-platforms">{app.platforms.map(platform => <li key={platform.name}><div><h4>{platform.name}</h4><p>{platform.format}</p></div>{platform.url ? <a href={platform.url} className="home-download-button" aria-label={`获取 ${app.name} ${platform.name} 版`}>获取应用 <span aria-hidden="true">↗</span></a> : <button type="button" disabled aria-label={`${app.name} ${platform.name} 版即将提供`}>即将提供</button>}</li>)}</ul>
        </article>)}</div>
        <p className="home-download-note">应用正在准备中，下载开放后可从此处获取。设备画面为概念示意。</p>
      </div>
    </section>
  );
}
