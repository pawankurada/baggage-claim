# A little birthday adventure

A client-side Canvas / JavaScript prototype with no dependencies or backend. References remain outside the game; the first milestone uses original shape placeholders.

Hyderabad scenery is limited to the approach to the first bag. The paths to bags 2�5 remain neutral placeholders for future themes. Decoration is isolated in `src/hyderabad.js`; see `public/assets/level1-hyderabad/README.md` for asset replacement instructions. Gameplay layout is unchanged.

## Run

Install Node.js, then run `node server.js` (or `npm run dev`) in this folder. Open http://localhost:5173. Run `node --test` (or `npm test`) for route/collision and game-loop checks. Use A/D or arrows and Space. Collect all bags and continue each note, then walk to the flag. Falls restore the last safe landing and preserve collected bags.

## Customize

- `src/config.js`: name, title, subtitles, final letter, bag messages/colors/images, section labels and physics. The bag count is the length of `bags`; adding/removing entries automatically adds/removes sections. Add section labels to match.
- `public/assets/`: put transparent artwork here. Set `artwork.character` to `public/assets/character.png`. A single facing-right image is supported and flips when moving left; animation sheets can be added later in `src/game.js`.
- Each bag entry's `image` accepts its own asset path. Empty or failed images retain the drawn placeholder. Keep bag artwork original, without brand marks.
- `config.level.platforms`: repeating local `[x, topY, width]` platform coordinates. `sectionWidth` sets spacing and `bagPosition` places a collectible in each section. `src/world.js` expands these into one continuous level and adds the finish platform.
- `src/game.js`: input, forgiving coyote-time/buffered jumps, camera, checkpoint logic, drawing, popups and screens.
- `style.css` and `index.html`: responsive shell and accessible HTML buttons. Desktop controls are implemented; touch movement is a later milestone.

The default route takes about 52 seconds of uninterrupted running; jumps and five reading pauses aim for a 60–120 second first play. This is an estimate to tune after your own playthrough.

## Hosting

Upload `index.html`, `style.css`, `src/` and `public/` to any static host (for example GitHub Pages). No build step is needed. Do not upload the personal reference photos unless you intend to share them. `server.js` is only the local development server.

## Handbag quizzes

Edit `src/quizzes.js`: its five entries map to bags in stage order. Change `question`, the four `options[].text` strings, and each option's `feedback`. Mark exactly one option `correct: true` and the other three `false`. `successMessage` is shown after the correct option's feedback; `buttonText` labels the claim button. The original bag `message` fields are retained but are no longer used by the quiz interaction.

A bag is awarded only after the correct answer and an explicit claim. Wrong guesses have unlimited immediate retries and never affect progress. Player physics and input stay paused while answering. A claimed bag cannot reopen; restarting the adventure resets progress.

Run `node --test` for validation, or open `/tests/quiz-preview.html` on the local server to review the first quiz directly.

## GitHub Pages deployment

Run `node scripts/build.js` to prepare `dist/`. The build contains only the game HTML, CSS, modules, and runtime assets. Original reference photos, duplicate root audio files, local server, and test previews are excluded.

The `.github/workflows/pages.yml` workflow tests and publishes this build when `main` is pushed. In the repository's Settings → Pages, select **GitHub Actions** as the publishing source. The intended site is https://pawankurada.github.io/baggage-claim/.
