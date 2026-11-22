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
              <img src="/icons/instagram.svg" alt="" />
            </a>
            <a className="icon-button" href={`mailto:${site.email}`} aria-label="Email">
              <img src="/icons/mail-ios.svg" alt="" />
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
