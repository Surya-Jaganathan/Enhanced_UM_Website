# DocsHub — GitHub Pages Documentation Portal

A responsive, static documentation portal built with HTML, CSS, and vanilla JavaScript. Customers can browse published manuals, FAQs, and quick links without signing in. Administration is managed through GitHub repository permissions.

## Architecture

- **Website repository:** contains the static site and is published by GitHub Pages.
- **Content repository:** you create separately and store Markdown manuals, FAQ JSON, quick links, and assets.
- **Access:** all published content is public. Only users granted GitHub write access can change the repository.
- **No website admin password:** there is no insecure client-side password gate. Admins authenticate with their own GitHub accounts.
- **Prototype mode:** `assets/js/app.js` starts with sample content so you can open the website immediately.

> Important: a public GitHub repository and GitHub Pages are public. Do not put confidential material, credentials, private customer data, or unpublished restricted documents in the content repository.

## 1. Create two repositories

Use your existing repositories:

1. Website: `https://surya-jaganathan.github.io/Enhanced_UM_Website/`
2. Content: `https://github.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual`

The website Admin link points directly to the content repository. The website fetches the content manifest from `content/index.json`.

For the easiest GitHub Pages URL, name the site repository `<your-username>.github.io`. If you use `docshub-site`, the site URL will usually be `https://<your-username>.github.io/docshub-site/`.

## 2. Configure the content repository

1. Create `docshub-content`.
2. Copy everything inside `content-repository-template/` into its root.
3. Replace the sample manuals and FAQ entries with your own.
4. Set the content repository to **Public**, because the customer website fetches Markdown over the public raw-content URL.
5. Open **Settings → Collaborators** and grant write access only to trusted documentation administrators.

## 3. Connect the website to the content repository

Edit `assets/js/app.js`:

```js
const CONTENT_BASE = "https://raw.githubusercontent.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual/main/content";
const SAMPLE_MODE = false;
```

The configuration is already set for your content repository. Keep `SAMPLE_MODE = false` after adding `content/index.json` and the matching Markdown/FAQ/link files.

The URL above expects a `content/` folder at the root of your content repository. If you copied the included template exactly, the content repo's root contains `content/`.

Commit and push the change. The site will fetch `content/index.json`, the Markdown files listed there, FAQ JSON files, and `content/quick-links/links.json`.

## 4. Publish the site with GitHub Pages

1. Open the **site repository** on GitHub.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`.
5. Save. Wait for the Pages deployment to complete.
6. Open the URL shown in the Pages settings.

No Node.js, bundler, backend server, or build step is required.

## 5. How admins publish content

Admins should edit content in the **content repository** using GitHub's web editor:

1. Open the Markdown file.
2. Click the pencil icon to edit, or add a new file.
3. Update `content/index.json` when adding a manual or FAQ file.
4. Commit changes to `main`.
5. Refresh the public portal after GitHub's raw content cache updates.

Only grant write access to trusted maintainers. For a more controlled workflow, require pull requests and review changes before merging into `main`.

## 6. Add a manual

Create a Markdown file under `content/manuals/`, for example `new-feature.md`:

```md
# New feature guide

Introductory description.

## Before you begin

- Requirement one
- Requirement two

## Steps

1. Open the product.
2. Select **Settings**.
3. Save your changes.
```

Add an entry to `content/index.json`:

```json
{
  "slug": "new-feature",
  "title": "New feature guide",
  "category": "User guide",
  "description": "A short summary shown on the home page.",
  "updated": "2026-10-13",
  "featured": false,
  "access": "public",
  "file": "new-feature.md"
}
```

`slug` must be unique. The `file` value is relative to `content/manuals/`.

## 7. Add FAQs

Add a JSON file under `content/faqs/`, such as `product-faqs.json`:

```json
[
  {
    "question": "How do I reset my settings?",
    "answer": "Open Settings, select Reset, and follow the confirmation steps.",
    "category": "Troubleshooting"
  }
]
```

Then add `"product-faqs.json"` to the `faqFiles` array in `content/index.json`.

## 8. Add quick links

Edit `content/quick-links/links.json`. Use `https://` URLs for external resources and `mailto:` for support email. Only add links you trust.

## Current limitations and security notes

- This is a static frontend. GitHub repository permissions protect the *editing workflow*, not the public website's content.
- All manuals fetched by this website are public. The `access` metadata is descriptive only and is **not** an access-control mechanism.
- The sample Markdown renderer supports common headings, paragraphs, lists, blockquotes, bold/italic, inline code, and simple external links. It is intentionally small and not a full CommonMark implementation.
- For arbitrary or untrusted Markdown, use a maintained Markdown parser and an HTML sanitizer before rendering.
- The demo has a small client-side search over content loaded into the browser. For very large libraries, generate a search index at build time.
- GitHub Pages serves static assets. Admin-side direct publishing through a web dashboard, secure login, and uploads would require a separate trusted service; that is intentionally not included in this GitHub-only setup.
- Raw GitHub content can be cached briefly. Allow a short delay after committing changes.

## Local preview

You can double-click `index.html` to see the sample homepage. For reliable testing of fetch requests, run a local static server from the site folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.


## Configuration for Surya's repositories

The Admin link now opens `https://github.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual`.
The website content loader is configured to read:

`https://raw.githubusercontent.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual/main/content/index.json`

**Required next step:** the current content repository does not yet expose the expected `content/index.json` manifest. Copy the approved, public-facing files from `content-repository-template/content/` into the root of `PSB-PMV-scheme-user-manual` under a `content/` folder, then edit the index to list the manuals you want to publish. Until that folder and manifest exist, the site will retain its sample content and show a content-load notice.

**Confidentiality warning:** the repository's existing README describes the manual as confidential and for internal use. Do not publish that manual or its screenshots on a public GitHub Pages site unless you have explicit authorization. The site and all content loaded from a public repository are publicly accessible.
