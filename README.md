# DocsHub — Static GitHub Pages with GitHub publishing

DocsHub is a static HTML/CSS/JavaScript website. The customer page reads the public content file `content/docshub.json`. The admin page can commit updates to that file using the GitHub Contents API.

## What it supports
- Manage user manual links (add, edit, delete)
- Manage FAQs (add, edit, delete)
- Manage Quick Links (add, edit, delete)
- Duplicate detection and validation
- Commit changes directly to GitHub so all visitors see the same published content
- Customer page loads published JSON from GitHub Pages, not browser localStorage

## Deploy to your repository
1. Download and extract the ZIP.
2. Upload the contents of the extracted folder to the root of `Surya-Jaganathan/Enhanced_UM_Website`, replacing the old site files.
3. Commit the changes to the branch used by GitHub Pages (configured here as `main`).
4. Confirm GitHub Pages is enabled for that branch and the repository root.
5. Open `https://surya-jaganathan.github.io/Enhanced_UM_Website/` and `https://surya-jaganathan.github.io/Enhanced_UM_Website/admin.html`.

## Set up GitHub publishing
1. Sign in to the admin page with the current demo gate: username `Surya J`, password `123456`.
2. Open **GitHub settings**.
3. Create a **fine-grained personal access token** in GitHub. Restrict it to only `Surya-Jaganathan/Enhanced_UM_Website`, and grant **Contents: Read and write** repository permission. Give it an expiration date.
4. Paste the token into the admin page and choose **Connect & load GitHub content**.
5. The settings should be owner `Surya-Jaganathan`, repository `Enhanced_UM_Website`, branch `main`, and path `content/docshub.json` (adjust the branch if your Pages source uses another branch).
6. Add or edit manuals, FAQs, and Quick Links. Each successful save commits `content/docshub.json` to GitHub. GitHub Pages may take a minute or two to update.

## Security notes
- This remains a static site; there is no server-side authentication.
- The demo username/password is visible in browser JavaScript and is only a convenience gate. It is not secure authentication.
- The GitHub token is entered by the administrator at runtime and kept in `sessionStorage` for the current browser session; it is not embedded in the deployed files or written into the JSON content file. Use a narrowly scoped, expiring fine-grained token, and click **Forget token** when finished.
- Anyone who can use the authenticated admin browser session could use the token. For stronger security, use a server-side service or a GitHub Actions workflow with protected authentication rather than browser-side API writes.
- `content/docshub.json` is public. Do not publish confidential/internal manuals, secrets, private URLs, or sensitive information. The linked Markdown manuals must also be public for customer browsers to read them.

## Content schema
`content/docshub.json` contains `manuals`, `faqs`, `quickLinks`, and optional `settings` arrays/object. Keep it valid JSON.
