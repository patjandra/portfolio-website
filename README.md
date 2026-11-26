# Preston Tjandra, portfolio

A scroll-driven portfolio: a tennis ball, two rackets and six projects, ending in a contact section and a plain list of all the work.
Built with [Astro](https://astro.build). It ships as static files with no framework runtime, self-hosted fonts and about 20 KB of script.

## Run it

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
npm run check      # type-check Astro files and content
```

Set `SITE_URL` when you build for production so canonical links and share cards use absolute URLs:

```sh
SITE_URL=https://yourname.com npm run build
```

## Edit the content

| What | Where |
| --- | --- |
| Name, headline, email, links, page title, closing line | `src/config/site.ts` |
| A project (title, company, role, dates, stats, tech, GitHub link, image, description) | `src/content/projects/*.md` |
| Project images and logos | `public/img/` |
| Portrait and resume PDF | `public/preston.jpg`, `public/Preston_Tjandra_Resume.pdf` |
| Pacing of the scroll story | `src/config/timeline.ts` |
| Colours, type, layout | `src/styles/global.css` |

Each project file has `slot: 1` to `6`. **A slot is a scroll moment**, so the animation belongs to the slot, not to the project:

1. Rolls in on the ball, which fills the screen (yellow backdrop)
2. Takes three cartoon hops up and back
3. Springs in from the right, then the second ball knocks it off
4. Revealed on the zoomed-in ball (yellow backdrop), which a racket then hits away
5. Knocked down by a shower of balls
6. Dropped in, then smashed three times by a racket

To reorder projects, swap their `slot` numbers. Adding a seventh project means writing a new moment in `src/scripts/story.ts`.
Slot layout alternates automatically: yellow backdrop on slots 1 and 4, image on the left for even slots.

Image `kind` in the front matter: `logo` (centred on white), `shot` (cropped to the window) or `full` (uncropped, for very wide screenshots).

Stats use real numbers only. Dates use `Mon YYYY – Mon YYYY` or `Mon YYYY – Present`.

## Modes

- **Animated story**: default.
- **Plain page**: `/?plain`, or automatically for visitors who prefer reduced motion or have JavaScript off. Same content, normal scrolling.
- **Jump links**: `/#remindly`, `/#qre` and so on land on a project directly; the hero links to the full list.

## Deploy

It is a static site, so any static host works. With Vercel or Cloudflare Pages:

1. Push the repo to GitHub and import it in the host.
2. Build command `npm run build`, output directory `dist`.
3. Add the environment variable `SITE_URL` (your domain).
4. Attach your domain.

## Before you publish

- **Resume PDF**: the file is git-ignored on purpose, so the Resume button links to nothing on a fresh deploy. Add a public version (no phone number or GPA) as `public/Preston_Tjandra_Resume.pdf`, then delete its line from `.gitignore` so it gets committed.
- **Photo**: `public/preston.jpg` was cropped from a compressed image. Swap in a full-quality square crop (800 px or more).
- **Check the GitHub repos** linked from the projects are public.
- **Interim** runs on synthetic patient data; a short note about that belongs on any case study page.
- Browsers: developed and checked in Chromium. Test Safari and Firefox, and a real phone, before sharing widely.

## How it works

`src/scripts/story.ts` is one function of scroll position: it reads how many screens have been scrolled and sets every element, canvas particle and transform from that single number, so scrolling backwards replays the story exactly.
It is plain DOM and canvas on purpose, with no animation library. `src/config/timeline.ts` holds every phase as a `[start, end]` pair.
