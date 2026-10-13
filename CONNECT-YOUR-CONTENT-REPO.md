# Connect the DocsHub site to PSB-PMV-scheme-user-manual

The site code is preconfigured to use this public repository:

- Admin button: https://github.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual
- Content manifest expected at: `content/index.json`
- Raw manifest URL: https://raw.githubusercontent.com/Surya-Jaganathan/PSB-PMV-scheme-user-manual/main/content/index.json

## Required repository layout

Add the following structure to the content repository, using only material approved for public release:

```text
PSB-PMV-scheme-user-manual/
└── content/
    ├── index.json
    ├── manuals/
    │   ├── getting-started.md
    │   └── troubleshooting.md
    ├── faqs/
    │   └── general-faqs.json
    └── quick-links/
        └── links.json
```

Copy the example `content/` folder from this website project's `content-repository-template/` folder into the root of the content repository. Replace the sample entries with approved public documentation. Update `content/index.json` to list the real Markdown filenames.

Once committed, test the raw manifest URL above. It should return JSON, not a GitHub HTML page or a 404. Refresh the DocsHub site after the raw files are available.

## Important confidentiality notice

The existing repository README labels the LAPS/LENDperfect — MSME PM Vishwakarma manual confidential and for internal use. Do not make that manual or its screenshots available through a public website unless you have explicit written authorization and have confirmed that the content is approved for public distribution. A public repository and GitHub Pages cannot enforce private access to individual Markdown files.
