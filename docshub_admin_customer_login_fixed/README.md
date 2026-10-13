# DocsHub Admin + Customer Website

Responsive static site for GitHub Pages, built with HTML, CSS, and vanilla JavaScript.

## Included
- Customer homepage with manuals, FAQs, search, and dark mode.
- Separate `admin.html` page with demo login.
- Admin can add, edit, delete manual links and FAQs.
- Duplicate detection for manual title/URL and FAQ questions.
- Basic error messages for invalid links, failed Markdown fetches, duplicate records, and storage/import failures.
- Markdown rendering for headings, paragraphs, lists, quotes, bold/italic, inline code, and simple links.
- JSON export/import for moving content between browsers or into a repository.

## Demo login
- Username: `Surya J`
- Password: `123456`

**Security warning:** this is a static GitHub Pages prototype. These credentials are present in client-side JavaScript and can be discovered by anyone. The login is a convenience/demo gate only; it is not secure authentication. Do not use it to protect sensitive information or grant secure administrative privileges. For real security, use GitHub account permissions directly or add an external authentication/backend service.

## Important GitHub Pages limitation
The Admin page saves changes to the browser's `localStorage`. This means:
- The customer page in the same browser/device can read the saved manuals and FAQs.
- Other visitors' browsers will not see those changes automatically.
- Data can be exported as JSON and then committed to the GitHub repository manually.
- GitHub Pages cannot securely commit edits to your GitHub repository from frontend-only code without an external service. Never put a personal access token in JavaScript.

## Use public Markdown links
Enter a public Markdown file URL. Preferred format:

`https://raw.githubusercontent.com/OWNER/REPO/BRANCH/path/to/manual.md`

A public GitHub blob URL ending in `/blob/BRANCH/path/to/manual.md` is also accepted and converted to a raw URL. Private repository files cannot be loaded by this public static site.

## Publish on GitHub Pages
1. Extract the ZIP.
2. Upload all files and folders to the root of your website repository.
3. Commit to `main`.
4. Go to Settings → Pages.
5. Select **Deploy from a branch**, branch `main`, folder `/(root)`, and save.
6. Open `/admin.html` on the published site.

For a site hosted at `https://USERNAME.github.io/REPO/`, use `https://USERNAME.github.io/REPO/admin.html`.

## Publishing content for all customers
1. Sign in to `/admin.html` using the demo credentials.
2. Add/edit manuals and FAQs.
3. Choose **Settings & export → Export content JSON**.
4. Review the JSON. Convert/copy the approved content into the repository's public data files or a generated content index.
5. Commit and push the approved content.
6. Keep confidential documentation out of public repositories.

The static demo intentionally does not write to GitHub because embedding a GitHub token would expose it to every visitor.
