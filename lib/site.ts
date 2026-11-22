export interface Show {
  date: string;
  venue: string;
  city: string;
}

/** All the words on the page live here. Edit these to make the site yours. */
export const site = {
  name: "Saurabh",
  role: "Newbie DJ",
  tagline: "My records, on a click wheel.",
  description:
    "Scroll through the tracks, open a playlist, and press play. A little corner of the internet for digging through my music the old-fashioned way.",
  about:
    "I'm Saurabh, a DJ and producer making music for late nights and long drives. Replace this paragraph with your own story, your sound, and where you're based.",
  email: "saurabhkirve@icloud.com",
  links: [
    { label: "Instagram", href: "https://www.instagram.com/saurabh.m4a" }
  ],
  shows: [] as Show[],
};
