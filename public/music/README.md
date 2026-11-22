# Your music goes here

Drop your audio files in this folder. The site reads them when it builds and shows
them in the iPod automatically — no code changes needed.

Supported formats: `.mp3`, `.m4a`, `.aac`, `.wav`, `.ogg`, `.flac`, `.opus`, `.aif`, `.aiff`

## Naming files

Filenames become the track titles shown on the iPod:

| Filename | Shows on the iPod |
| --- | --- |
| `01 - Saurabh - Midnight Drive.mp3` | Track 1, "Midnight Drive" by Saurabh |
| `02 - After Hours.mp3` | Track 2, "After Hours" by Saurabh |
| `Sunset Set.mp3` | "Sunset Set" by Saurabh |

Tracks are sorted by the leading number. If you leave the number out, they sort
alphabetically after the numbered ones. Change the default artist name in
`lib/music.ts` (`DEFAULT_ARTIST`).

## After adding files

- Local: restart `npm run dev` (the library is read at startup).
- Deployed: push the files and redeploy.
