# GitHub Pages deployment checklist

- [x] Website repository identified: `https://surya-jaganathan.github.io/Enhanced_UM_Website/`.
- [x] Content repository identified: `https://github.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual`.
- [ ] Copy `content-repository-template/content/` into the content repository's root.
- [ ] Replace sample manual text, FAQs, support email, and quick links.
- [ ] Make the content repository public if all published content is intended for public reading.
- [ ] Give write access only to trusted documentation administrators.
- [ ] Update `CONTENT_BASE` in `assets/js/app.js`.
- [ ] Set `SAMPLE_MODE = false`.
- [ ] Commit the website files to the site repository's `main` branch.
- [ ] Enable GitHub Pages: Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
- [ ] Open the published site and test search, manual links, FAQs, quick links, mobile layout, and dark mode.
- [ ] Add a new manual and confirm that it appears after the index and Markdown file are committed.
- [ ] Verify that no secrets or confidential content are present in either public repository.

- [ ] Confirm explicit authorization before publishing any manual currently labelled confidential.
