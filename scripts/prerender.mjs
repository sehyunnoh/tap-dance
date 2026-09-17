// Writes one HTML file per route into dist/, plus sitemap.xml and a 404 fallback.
//
// Run after `vite build` (browser bundle + dist/index.html) and `vite build --ssr`
// (dist-ssr/entry-server.js). The browser build's index.html is the template: it already
// has the hashed script and stylesheet links, so each page only adds meta and markup.
//
// React picks its development or production build from NODE_ENV at import time, and
// entry-server.js is imported dynamically below, so setting it here still counts.
process.env.NODE_ENV ??= 'production'

import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = join(process.cwd(), 'dist')
const SSR_ENTRY = join(process.cwd(), 'dist-ssr', 'entry-server.js')

// `ORIGIN + BASE`, filled in once the SSR bundle is loaded.
let seoOrigin = ''

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** `</script>` inside JSON-LD would close the tag early. */
const escapeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c')

/** `/steps/shuffle` → `dist/steps/shuffle/index.html`; `/` → `dist/index.html`. */
function fileFor(path) {
  const clean = path.replace(/^\/+|\/+$/g, '')
  return join(DIST, clean, 'index.html')
}

function breadcrumbJsonLd(page, canonical) {
  const trail = [...page.breadcrumb, { name: page.title.split(' · ')[0], path: page.path }]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: canonical(crumb.path),
    })),
  }
}

/** Drop a 1200×630 public/og.png in and every page gets a picture in link previews. */
const OG_IMAGE = { file: 'og.png', width: 1200, height: 630 }

async function ogImageUrl() {
  try {
    await access(join(DIST, OG_IMAGE.file))
    return seoOrigin + OG_IMAGE.file
  } catch {
    return null
  }
}

function head(page, seo, ogImage) {
  const url = seo.canonical(page.path)
  const structured =
    page.path === '/'
      ? { '@context': 'https://schema.org', '@type': 'WebSite', name: seo.SITE_NAME, url, description: page.description }
      : breadcrumbJsonLd(page, seo.canonical)

  return [
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(seo.SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    ...(ogImage
      ? [
          `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
          `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
          `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
          `<meta property="og:image:alt" content="${escapeAttr(seo.SITE_NAME)}" />`,
        ]
      : []),
    `<meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}" />`,
    `<script type="application/ld+json">${escapeJson(structured)}</script>`,
  ].join('\n    ')
}

/** Puts the page's title, description, meta and markup into the built index.html. */
function fill(template, { title, description, extraHead, body, robots }) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttr(description)}" />`)
    .replace('</head>', `  ${[robots, extraHead].filter(Boolean).join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

async function main() {
  const template = await readFile(join(DIST, 'index.html'), 'utf8')
  const seo = await import(pathToFileURL(SSR_ENTRY).href)
  seoOrigin = seo.ORIGIN + seo.BASE
  const ogImage = await ogImageUrl()
  const all = seo.pages()

  for (const page of all) {
    const html = fill(template, {
      title: page.title,
      description: page.description,
      extraHead: head(page, seo, ogImage),
      body: seo.render(page.path),
    })
    const file = fileFor(page.path)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html)
  }

  // GitHub Pages serves this for anything the loop above did not write; the app then shows
  // its own "not found" page for the URL in the address bar.
  await writeFile(
    join(DIST, '404.html'),
    fill(template, {
      title: `Page not found · ${seo.SITE_NAME}`,
      description: seo.SITE_DESCRIPTION,
      robots: '<meta name="robots" content="noindex" />',
      body: '',
    }),
  )

  const urls = all.map((page) => `  <url><loc>${escapeAttr(seo.canonical(page.path))}</loc></url>`).join('\n')
  await writeFile(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

  // Only dist/ is deployed; the render-only bundle would just be dead weight in the artifact.
  await rm(join(process.cwd(), 'dist-ssr'), { recursive: true, force: true })

  console.log(`Prerendered ${all.length} pages, 404.html and sitemap.xml into dist/${ogImage ? '' : ' (no public/og.png, so link previews have no picture)'}`)
}

await main()
