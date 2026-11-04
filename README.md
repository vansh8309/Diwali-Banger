# Diwali Banger | 7th Nov

Event site for Diwali Banger by Communitie. Hyderabad x DSL Virtue Mall. Plain HTML, CSS and JavaScript. No build step.

## Structure

```
index.html          page markup + meta tags
css/styles.css      all styles
js/config.js        EDIT THIS: ticket link
js/main.js          shared helpers, tabs, ticket button
js/mirror.js        camera convex mirror
js/balloons.js      balloon popping game
js/snakes-ladders.js
js/ludo.js
js/lanterns.js      lantern + fireworks finale
assets/             favicon, og-image.png (add this)
404.html            custom not-found page
```

## Before you publish

1. Set `ticketUrl` in `js/config.js`.
2. Replace `YOUR-USERNAME` / `YOUR-REPO` in the `canonical` and `og:` tags in `index.html`.
3. Add a 1200x630 image at `assets/og-image.png` (WhatsApp/Instagram link preview).
4. Fill in the "Disco floor" blurb (DJ and music details) in `index.html`.

## Deploy on GitHub Pages

```bash
git init
git add .
git commit -m "Diwali Banger site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then in the repo: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
The included workflow publishes on every push to `main`. Your site will be at
`https://YOUR-USERNAME.github.io/YOUR-REPO/` in about a minute.

(Alternative with no workflow: Source "Deploy from a branch", branch `main`, folder `/ (root)`. Delete `.github/` if you do this.)

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Notes

- The Mirror Corner needs camera access, which only works over HTTPS (GitHub Pages provides this) or localhost.
- Nothing from the camera is recorded or uploaded.
- Fonts load from Google Fonts.
- Custom domain: add a `CNAME` file containing your domain, or set it in Settings > Pages.
