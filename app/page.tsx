import { Suspense } from "react";
import { connection } from "next/server";
import IPodPlayer from "@/app/components/IPodPlayer";
import { readLibrary } from "@/lib/music";
import { site } from "@/lib/site";

async function CurrentYear() {
  await connection();
  return <>{new Date().getFullYear()}</>;
}

export default function Page() {
  const { songs, playlists, artists } = readLibrary();
  const instagram = site.links.find((link) => link.label === "Instagram") ?? site.links[0];

  return (
    <main>
      <IPodPlayer songs={songs} playlists={playlists} artists={artists}>
        <header className="topbar">
          <div>
            <h1>
              {site.name}<span className="accent">.</span>
            </h1>
            <p className="role">{site.role}</p>
          </div>
          <nav className="icon-rail" aria-label="Connect">
            <a
              className="icon-button"
              href={instagram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#feda75" />
                    <stop offset="25%" stopColor="#fa7e1e" />
                    <stop offset="50%" stopColor="#d62976" />
                    <stop offset="75%" stopColor="#962fbf" />
                    <stop offset="100%" stopColor="#4f5bd5" />
                  </linearGradient>
                </defs>
                <rect x="0.5" y="0.5" width="23" height="23" rx="7" fill="url(#instagram-gradient)" />
                <rect x="5" y="5" width="14" height="14" rx="4.5" fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="12" cy="12" r="3.6" fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />
              </svg>
            </a>
            <a className="icon-button" href={`mailto:${site.email}`} aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="icloud-mail-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5ac8fa" />
                    <stop offset="100%" stopColor="#007aff" />
                  </linearGradient>
                </defs>
                <rect x="0.5" y="0.5" width="23" height="23" rx="7" fill="url(#icloud-mail-gradient)" />
                <rect x="4.5" y="7" width="15" height="10.5" rx="2" fill="#fff" />
                <path d="M5 8.2 12 13.2 19 8.2" fill="none" stroke="#3a8ede" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>
        </header>
      </IPodPlayer>

      <footer>
        <p>
          © <span className="year"><Suspense fallback={null}><CurrentYear /></Suspense></span> · Made with ❤️
        </p>
      </footer>
    </main>
  );
}
