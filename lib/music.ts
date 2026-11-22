import fs from "node:fs";
import path from "node:path";
import type { Artist, Playlist, Song } from "ipod-simulator";

const MUSIC_DIR = path.join(process.cwd(), "public", "music");
const AUDIO_FILE = /\.(mp3|m4a|aac|wav|ogg|oga|flac|opus|aif|aiff)$/i;
const DEFAULT_ARTIST = "Saurabh";

type ParsedName = { track: number; artist: string; title: string };

/**
 * Filenames can be:
 *   01 - Artist Name - Track Name.mp3
 *   01 - Track Name.mp3
 *   Track Name.mp3
 */
function parseFileName(fileName: string): ParsedName {
  const base = fileName.replace(AUDIO_FILE, "").trim();

  const withArtist = base.match(/^(\d{1,3})\s*[-._]\s*(.+?)\s+-\s+(.+)$/);
  if (withArtist) {
    return {
      track: Number(withArtist[1]),
      artist: withArtist[2].trim(),
      title: withArtist[3].trim(),
    };
  }

  const numbered = base.match(/^(\d{1,3})\s*[-._]\s*(.+)$/);
  if (numbered) {
    return {
      track: Number(numbered[1]),
      artist: DEFAULT_ARTIST,
      title: numbered[2].trim(),
    };
  }

  return { track: Number.MAX_SAFE_INTEGER, artist: DEFAULT_ARTIST, title: base };
}

/** Reads public/music at build time so dropping in a file is all it takes. */
export function readLibrary(): {
  songs: Song[];
  playlists: Playlist[];
  artists: Artist[];
} {
  let files: string[] = [];
  try {
    files = fs.readdirSync(MUSIC_DIR);
  } catch {
    return { songs: [], playlists: [], artists: [] };
  }

  const songs: Song[] = files
    .filter((file) => AUDIO_FILE.test(file))
    .map((file) => ({ file, ...parseFileName(file) }))
    .sort((a, b) => a.track - b.track || a.title.localeCompare(b.title))
    .map(({ file, artist, title }, index) => ({
      id: `track-${index + 1}`,
      name: title,
      artistName: artist,
      albumName: "My Music",
      previewUrl: `/music/${encodeURIComponent(file)}`,
    }));

  const playlists: Playlist[] = songs.length
    ? [{ id: "all-tracks", name: "All Tracks", songIds: songs.map((song) => song.id) }]
    : [];

  const artists: Artist[] = [
    ...new Set(songs.map((song) => song.artistName ?? DEFAULT_ARTIST)),
  ].map((name, index) => ({
    id: `artist-${index + 1}`,
    name,
    songIds: songs
      .filter((song) => (song.artistName ?? DEFAULT_ARTIST) === name)
      .map((song) => song.id),
  }));

  return { songs, playlists, artists };
}
