# yhc98002-bit.github.io

Personal academic homepage of **Haocun Ye (叶浩存)** — plain HTML / CSS / JS, no frameworks, no build tools, no external requests.

Live at: https://haocunye.site/

## Structure

```
├── index.html          # main page (hero / news / publications / projects / about / contact)
├── 404.html            # GitHub Pages 404 (styles inlined, self-contained)
├── favicon.svg/.ico, apple-touch-icon.png
├── css/style.css       # the only stylesheet (design tokens + all components)
├── js/main.js          # the only script (theme, nav, reveal, copy-email)
├── assets/
│   ├── fonts/          # self-hosted Instrument Serif (SIL OFL, see OFL.txt)
│   ├── images/         # portrait, project covers, og-image
│   ├── figures/        # paper figures used in blog posts
└── blog/
    ├── index.html      # post list
    └── posts/          # one HTML file per post + template.html
```

## Local preview

1. **Double-click** `index.html` — everything works over `file://` (relative paths throughout).
2. **Local server** (identical to production):

   ```bash
   python3 -m http.server 8000
   # → http://localhost:8000
   ```

## Writing a new blog post

1. Copy `blog/posts/template.html` **within the same directory** and rename it to `YYYY-MM-DD-short-slug.html`;
2. Update `<title>`, meta description, og: tags, `<h1>`, `<time>` (both the `datetime` attribute and the visible text) and the tags list, then write the body — available elements (headings, lists, quotes, code, figures with captions) are all pre-styled;
3. Open `blog/index.html` and add an entry card at the top of the list (there's a comment marking the spot);
4. Preview locally, then commit and push.

## Adding a news item / publication / project

All three sections live in `index.html` and follow a copy-the-previous-block pattern:

- **News**: copy an `<li class="news-item">`, newest first.
- **Publications**: copy an `<article class="pub-item">` (use `pub-item--no-thumb` for entries without a teaser image); BibTeX goes inside the `<details class="pub-bib">` block.
- **Projects**: copy an `<article class="project-row">` — rows alternate image left/right automatically.

## Deploying updates

```bash
git add -A && git commit -m "update" && git push
```

GitHub Pages republishes automatically within a minute or two.

## Technical notes

- **Theme**: light (warm paper) by default, follows the system, manual toggle persisted in `localStorage`. The small inline script in each page's `<head>` prevents a light flash for dark-theme users — don't remove it. If you ever change the background colors, update them in three places: `css/style.css` tokens, each page's `theme-color` metas, and `THEME_COLORS` in `js/main.js`.
- **Fonts**: Instrument Serif is self-hosted in `assets/fonts/` (latin subset, ~15 KB per file) under the SIL Open Font License (`assets/fonts/OFL.txt`). No external font or CDN requests anywhere.
- **Relative paths**: the whole site avoids root-absolute paths so it works from `file://`, localhost and GitHub Pages alike. The two exceptions by design: `og:image` (crawlers require absolute URLs) and the 404 page's home link.
- **`.nojekyll`** tells GitHub Pages to serve files as-is — keep it.
- **Privacy**: résumé PDFs and raw material files are gitignored and must never be committed. Site copy never mentions undergraduate education, agriculture/MADA deployments, or unpublished-paper experiment numbers.
