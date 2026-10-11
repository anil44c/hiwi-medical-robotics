# HiWi Medical Robotics Demo Hub

A bilingual (English/German) website for hands-on medical robotics demonstrations at FAU Erlangen-Nürnberg.

## Open the website locally

Download or clone the repository, keep the files together, and open `index.html` in your browser. No installation or ChatGPT subscription is required. For a local HTTP preview with Python installed, run `python -m http.server 8000` in the project folder and open http://localhost:8000.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page, shared styles, English/German text, station navigation and interactive robot |
| `laparoscopy.js` | Five-step laparoscopy guide, phone setup, diagrams, animation, timer and quiz |
| `laparoscopy.css` | Layout and styling of the laparoscopy guide |

The four stations are robotics, laparoscopy, catheter navigation and biopsy. Laparoscopy drawings and tasks are illustrative drafts pending completion of the physical model.

## Work together

1. Get the latest `main` branch before starting.
2. Create a branch for your change, for example `update-biopsy-text`.
3. Edit the relevant files. Keep both English and German text up to date.
4. Open the site locally and check the affected pages at desktop and phone widths.
5. Commit and push your branch, then open a pull request for a teammate to review.
6. Merge the reviewed change into `main`.

Avoid editing the same section simultaneously. GitHub's web editor can be used for small text changes. An editor on your computer is more convenient for larger changes.

## Before merging

- Check EN and DE on the homepage and all affected stations.
- Check station links and back navigation.
- Check robot hotspots with mouse, keyboard and touch where available.
- Check all five laparoscopy steps, level selection, timer, hint and quiz.
- Check the phone setup instructions against the actual physical model.

## Publishing

GitHub Pages is the intended automatic publishing target. One-time owner setup is still required:

1. Set repository visibility to Public for GitHub Free.
2. Open Settings > Pages.
3. Choose Deploy from a branch, branch main, folder / (root), then Save.
4. Wait for the Pages deployment to succeed and use the URL shown in Settings > Pages.

Expected URL after activation: https://anil44c.github.io/hiwi-medical-robotics/

Once Pages is enabled, changes pushed or merged into main will automatically publish to that URL. The .nojekyll file tells Pages to serve this plain HTML/CSS/JavaScript site without Jekyll processing. Check the Actions tab if publishing fails.

The old ChatGPT-hosted URL is a separate deployment and does not automatically receive these changes.

## Editing notes

Station data and translations are in `index.html`. Laparoscopy text uses `L('English text', 'German text')` in `laparoscopy.js`. Images are currently inline SVG drawings. Keep images and instructions consistent when the physical demonstrator is finalized.

The phone uses its own camera app. The website does not access or record camera footage.
