# DJ site with an iPod player

A one-page DJ site built with Next.js and [`ipod-simulator`](https://github.com/EvanZhouDev/ipod-simulator).
Visitors browse your tracks on an interactive iPod and play them in the browser.
The page layout mirrors the library's own demo.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Make it yours

- **Your words:** `lib/site.ts` — name, role, tagline, bio, email, social links, shows.
- **Your music:** put audio files in `public/music/` (see `public/music/README.md`).
  Track names and artists are read from the filenames when the app builds.
- **Colors/layout:** `app/globals.css`.

## Deploy

Push this folder to GitHub and import it into Vercel, or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

The MP3s are served as static files from the same domain as the site, so there
are no CORS issues. For a large library of long sets, consider moving audio to
Vercel Blob later.

## Note

The iPod visuals belong to the `ipod-simulator` project and Apple. This site is
an independent project and is not affiliated with or endorsed by Apple.
