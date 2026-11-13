# cartoonforge — roadmap

## Why

1. **A content engine.** One sentence ("a 15 s reel in Rubber Hose style about X") → a finished
   9:16 cartoon with text, voice and music, in a recognisable style. No animator, no paid tools.
2. **An open-source showcase.** Every new style is both a feature and a post: a reel for
   Instagram, a write-up for LinkedIn, a new tile in the GitHub gallery.
3. **A shared library of styles.** Styles are small, documented, contributable packs. The
   community adds styles; everyone's characters can wear them.

## Where we are going

| Phase | Goal | Status |
|---|---|---|
| 0. Foundation | research, repo, core helpers, Rubber Hose 1930, mascot Pip, first reel | ✅ done |
| 1. Skill | installable Claude Code skill/plugin; captions, voice (TTS or **your own recording, treated by the style**) and generated music; GitHub showcase (README gallery + Pages) | ✅ done |
| 2. All styles | 34 genre/era styles (1920s silhouettes → 2020s anime, stop-motion, toy bricks), shared video core + shared audio lib | ✅ added, not yet rendered |
| 3. Testing | run every style with test characters and ideas, render, fix, fill the gallery | next |
| 4. Your characters | character spec / sketch / photo → rig in any style (shared body-part kit, style shading modes) | then |
| 5. Formats | reel templates: explainer, joke, quote, announcement, loop | later |
| 6. Website for everyone | non-engineers pick a style, upload characters and an idea, get an MP4 | later |

## Release rhythm (from phase 2)

For every new style:
1. style pack + README (what defines the look)
2. a 10–15 s test reel in that style
3. `npm run showcase` → gallery tile, preview GIF, Pages update
4. post: Instagram reel + LinkedIn write-up linking the repo

## Open questions

- Website legal basics: terms of use, takedown (DMCA) process, ban on uploading others' characters.

- Website (phase 4): rendering needs a server with Chrome + FFmpeg; decide hosting and how to cover render costs.
- Voice: which free TTS voices sound best per style and language (EN / RU).
