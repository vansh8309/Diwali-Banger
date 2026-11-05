# Diwali Banger | 7th Nov

Event site for Diwali Banger by Communitie with Padel.HY. Plain HTML, CSS and JavaScript. No build step.
Live at https://diwali-banger.runs-at.dev/

## Page flow (follows the night)

1. Hero: the official banner, animated (sparkler sparks, embers, slow push-in, light sweep). Buy tickets + Explore the night
2. The details: when, where, host, 21+, directions
3. The night, hour by hour: jump links with times and Free tags
4. Diya Painting (from 5 PM, free)
5. The Mirror Corner (all night, free)
6. Glam & Glitter Bar (all night, free): makeup game, Glam score, name + QR share image
7. Disco Floor (sundowner from 5 PM, dance floor from 9 PM, free): includes the Pocket DJ beat maker
8. Life-size Snakes & Ludo + Snakes & Ladders (from 6 PM, free)
9. The Shooting Gallery (from 6 PM)
10. Lanterns and fireworks (10 PM) + large Buy tickets button
11. Partners (thank you section)

A round Back to top button appears once you scroll past the hero.

## Structure

```
index.html            markup + meta tags
css/                  styles.css (base), banner.css, diya.css, glam.css
js/main.js            shared helpers, tabs, back-to-top
js/banner.js          hero animation (canvas sparks over the banner image)
js/diya.js  js/glam.js  js/dj.js  js/mirror.js  js/balloons.js  js/snakes-ladders.js  js/ludo.js  js/lanterns.js
assets/banner.webp    the official banner (1600x900)
assets/og-image.jpg   link-preview image (cropped from the banner)
assets/logo-padelhy.png   partner logo (cropped from the banner; swap for the official file)
assets/favicon.svg
CNAME                 custom domain
```

## Common edits

- **Ticket link:** search the repo for `communitie.in/events/diwali-banger` (index.html twice, js/glam.js once).
- **New banner:** replace `assets/banner.webp` (keep 16:9, 1600x900). The spark positions in `js/banner.js` (`EM` and `STARS`) are in banner pixels, so move them if the sparklers move.
- **Add a partner:** in index.html, copy the `<li class="pt">` inside `#partners`, add the logo to `assets/`, change the logo path, name and role line. The grid fills in automatically.
- **Glam QR code:** `js/glam.js` holds the QR for `https://diwali-banger.runs-at.dev/#glam` (the `QR` array). If that URL changes, regenerate the matrix.
- **Times:** slot labels in index.html and the "hour by hour" list.

## Notes

- Mirror Corner needs HTTPS or localhost for the camera. Nothing is recorded or uploaded.
- Glam sharing: one click copies the invite text (with the ticket link) and opens the phone share sheet with the image. Whether the app also attaches the text as a caption depends on the app; the clipboard copy is the safety net. Desktop browsers fall back to Download + Copy invite text.
- Pocket DJ sounds are synthesised in the browser (Web Audio). No audio files. iPhones play nothing in silent mode.
- Run locally: `python3 -m http.server 8000`
