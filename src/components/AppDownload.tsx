import { applications } from '@/config/downloads';

export default function AppDownload() {
  return (
    <section id="download" className="home-section home-download">
      <div className="home-container">
        <div className="home-section-heading">
          <div><p className="home-eyebrow">BASIC APPLICATION SOFTWARE / LabSoft</p><h2>应用下载</h2></div>
        </div>
        <div className="home-app-grid">
          {applications.map((app, index) => (
            <article key={app.category} className="home-app-card">
              <p className="home-eyebrow">{app.category}</p>
              <h3>{app.title}</h3>
              <p className="home-app-description">{app.description}</p>
              <div className={`home-device-scene ${index === 0 ? 'scene-desktop' : 'scene-mobile'}`} aria-hidden="true">
                <div className="home-device">
                  <span className="device-camera" />
                  <div className="device-screen">
                    <img
                      src={index === 0 ? '/images/app-previews/labstudio-main.webp' : '/images/app-previews/labapps-ai-current.webp'}
                      alt=""
                      width={index === 0 ? 1600 : 620}
                      height={index === 0 ? 1050 : 1280}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {index === 0 ? <span className="device-base" /> : <span className="device-side-buttons" />}
                </div>
                <div className="device-shadow" />
              </div>
              <ul className="home-platforms">
                {app.platforms.map(platform => (
                  <li key={platform.name}>
                    <div>
                      <h4>{platform.name}</h4>
                      <p>{platform.format}</p>
                      {platform.url && <p>v{platform.version} · {(platform.bytes / 1024 / 1024).toFixed(1)} MB</p>}
                    </div>
                    {platform.url ? (
                      <a href={platform.url} download className="home-download-button" aria-label={`下载${app.name} ${platform.name} 版`}>
                        下载 <span aria-hidden="true">↓</span>
                      </a>
                    ) : <button type="button" disabled>暂未开放</button>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
