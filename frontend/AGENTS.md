# AGENTS.md

Bu landing page için AI coding agent talimatları. Bu dosyayı repo root'una koy; Claude Code / OpenAI Codex / Cursor / Aider hepsi otomatik okur.

## Görev

Landing page'e **"Tahir Can Yıldız" blog entegrasyonu** eklemen istendi. Blog sistemi ayrı bir REST API servisidir; senin görevin içeriği çekmek ve SEO-ready sayfalar render etmek.

- **Hedef framework:** Astro
- **Blog servis URL:** `https://blogservice.lobsterlead.com`
- **Site key:** `mrpurposeless`
- **Default locale:** `tr`
- **Landing domain:** `https://www.tahircanyildiz.com`
- **Gated read:** Hayır (public)

## Önce framework'ü doğrula

Bu dosya Astro için yazıldı. Eğer projenin **farklı bir framework** ise:

```bash
# Next.js / React / Node?
cat package.json 2>/dev/null | grep -E '"next"|"react"|"astro"|"vue"|"svelte"|"@sveltejs"'

# Python?
cat requirements.txt 2>/dev/null || cat pyproject.toml 2>/dev/null

# PHP/Laravel/Rails/Static?
ls composer.json Gemfile *.html 2>/dev/null
```

Framework bu dokümandakinden farklıysa **durup kullanıcıya sor**: "Bu repo Astro değil, [tespit ettiğin] gibi görünüyor. Admin panelden doğru AGENTS.md'yi yeniden oluşturmak mı istersin, yoksa mevcut AGENTS.md'yi uyarlamamı mı?"

## Ön-gereksinimler

Agent tamamlamaya başlamadan önce kullanıcıdan al:

1. **`BLOG_API_KEY`** — yazma işlemleri için (blog panelinden bir kez gösterilen key). Okuma için opsiyonel.


Server-side env var olarak kullan. Client bundle'a sızdırma (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_` gibi prefix'ler kullanma).

## SDK paketi

Tüm Node/TypeScript entegrasyonları **`@lobsterlead/blog-sdk`** üzerinden yapılır — npm public registry'de yayınlandı, doğrudan kurulabilir:

- npm: https://www.npmjs.com/package/@lobsterlead/blog-sdk
- Kurulum: `npm install @lobsterlead/blog-sdk` (veya pnpm/yarn)
- Bundle: zero runtime dep, Next.js peer (opsiyonel)
- Subpath: `@lobsterlead/blog-sdk/next` Next.js helper'ları için (`toNextMetadata`, `jsonLdScript`)

Aşağıdaki framework-spesifik bölümler bu paketi kullanır. Plain HTML / Python yollarında SDK olmadığı için doğrudan REST API tüketilir (aşağıda anlatıldı).

## API contract (framework bağımsız)

Tüm framework'ler aynı REST API'yi tüketir. Response şemaları:

### GET `/api/v1/sites/mrpurposeless/posts?limit=20&locale=tr`
```json
{
  "posts": [
    {
      "id": "...",
      "slug": "post-slug",
      "locale": "tr",
      "title": "...",
      "excerpt": "...",
      "coverImage": { "url": "...", "alt": "..." },
      "tags": ["..."],
      "author": { "name": "..." },
      "publishedAt": "2026-04-24T10:00:00Z",
      "readingTimeMinutes": 5
    }
  ],
  "nextCursor": "..."
}
```

### GET `/api/v1/sites/mrpurposeless/posts/:slug?locale=tr`
```json
{
  "post": { ...fullPost, "bodyHtml": "<p>sanitize edilmiş HTML</p>" },
  "meta": {
    "title": "...", "description": "...", "canonical": "...",
    "og": { "title", "description", "image", "type", "url", "siteName", "locale" },
    "twitter": { "card", "title", "description", "image" },
    "article": { "publishedTime", "modifiedTime", "tags", "author" },
    "robots": { "index": true, "follow": true }
  },
  "jsonLd": { "@context": "https://schema.org", "@type": "BlogPosting", ... }
}
```

`bodyHtml` **sanitize edilmiş HTML** — `<script>`, `on*`, `javascript:` strip edilmiş, `<img>`'lere `loading="lazy"` otomatik eklenmiş. Güvenle basabilirsin.

## Astro entegrasyonu

### 1. SDK'yı yükle
```bash
pnpm add @lobsterlead/blog-sdk
```

### 2. `.env`
```bash
BLOG_BASE_URL=https://blogservice.lobsterlead.com
BLOG_SITE_KEY=mrpurposeless
BLOG_API_KEY=<apiKey>
```

### 3. `src/lib/blog.ts`
```ts
import { BlogClient } from "@lobsterlead/blog-sdk";

export const blog = new BlogClient({
  baseUrl: import.meta.env.BLOG_BASE_URL,
  siteKey: import.meta.env.BLOG_SITE_KEY,
  apiKey: import.meta.env.BLOG_API_KEY,
});
```

### 4. `src/pages/blog/index.astro` — Liste
```astro
---
import { blog } from "../../lib/blog";
const { posts } = await blog.posts.list({ limit: 20, locale: "tr" });
---
<html lang="tr">
  <head>
    <title>Blog — Tahir Can Yıldız</title>
    <meta name="description" content="Latest articles" />
  </head>
  <body>
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((p) => (
          <li>
            <a href={`/blog/${p.slug}`}>{p.title}</a>
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  </body>
</html>
```

### 5. `src/pages/blog/[slug].astro` — Detay
```astro
---
import { blog } from "../../lib/blog";
import { BlogApiError } from "@lobsterlead/blog-sdk";

const { slug } = Astro.params;
let detail;
try {
  detail = await blog.posts.get(slug!, { locale: "tr" });
} catch (e) {
  if (e instanceof BlogApiError && e.status === 404) return Astro.redirect("/404");
  throw e;
}
const { post, meta, jsonLd } = detail;
---
<html lang="tr">
  <head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <link rel="canonical" href={meta.canonical} />
    <meta property="og:title" content={meta.og.title} />
    <meta property="og:description" content={meta.og.description} />
    {meta.og.image && <meta property="og:image" content={meta.og.image} />}
    <meta property="og:type" content="article" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <article>
      <h1>{post.title}</h1>
      <time datetime={post.publishedAt}>
        {new Date(post.publishedAt!).toLocaleDateString("tr-TR")}
      </time>
      {post.coverImage && (
        <img src={post.coverImage.url} alt={post.coverImage.alt}
          width={post.coverImage.width} height={post.coverImage.height} loading="eager" />
      )}
      <div set:html={post.bodyHtml} />
    </article>
  </body>
</html>
```

### 6. `src/pages/sitemap.xml.ts`
```ts
import type { APIRoute } from "astro";
import { blog } from "../lib/blog";

export const GET: APIRoute = async () => {
  const host = "https://www.tahircanyildiz.com";
  const posts = await blog.sitemapEntries({ origin: host, pathPrefix: "/blog" });
  const urls = [
    { url: `${host}/` },
    { url: `${host}/blog` },
    ...posts.map((p) => ({ url: p.url, lastmod: p.lastModified?.toISOString() })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${u.url}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
```

**Not:** Astro için `astro.config.mjs`'de `output: "server"` veya `output: "hybrid"` olmalı (SSR için).

## Editorial styling (ZORUNLU — bodyHtml sanitize ediliyor)

`bodyHtml` server tarafında sanitize-html ile işleniyor. Sonuç:

| Strip edilen | Korunan |
|---|---|
| `<style>` blokları | `class` attribute |
| `<script>` tag'leri | `id`, `href`, `src`, `alt`, `title` |
| **Tüm `style="..."` attribute'ları** | Semantic HTML5 (`aside`, `section`, `nav`, `figure`) |
| `on*` event handler'ları | `<img loading="lazy" decoding="async">` (otomatik eklenir) |

**Yani**: blog'dan gelen HTML'in görsel sunumu **tamamen class-based CSS'e bağlı** ve bu CSS senin landing'inde olmalı. Inline style hiç gelmez.

### Container

Tüm editorial komponentler `.blog-body` parent'ı varsayılır. Render ederken sar:

```html
<article class="post-body">
  <div class="blog-body"><!-- post.bodyHtml buraya --></div>
</article>
```

### Class adları (blog tarafından üretilir — DEĞİŞTİRME)

| Class | Ne işe yarar | İçerik şekli |
|---|---|---|
| `.ll-reading-time` | Okuma süresi pill | inline-flex, icon + span |
| `.ll-content-nav` | TOC kutusu | `<nav>` + `<h2>` + nested `<ul>` |
| `.ll-toc-link` / `.ll-toc-sub` | TOC link / alt link | `<a>` |
| `.ll-brand-callout` | Uzman tavsiyesi kutusu | `<aside>`, ilk `<p>`'de icon span + başlık, son `<p>`'de CTA `<a>` |
| `.ll-eat-signals` (alt: `.ll-eat-expertise` / `.ll-eat-authority` / `.ll-eat-trust`) | E-A-T sinyalleri — soft gradient + otomatik 01/02/03 numara badge'leri | 3 sub-div, her birinde h2 + paragraflar |
| `.ll-faq-section` (alt: `.ll-faq-item` / `.ll-faq-answer`) | FAQ bloğu — soft gradient + numaralı Q&A listesi | `<div>`, h3 + answer div |
| `.ll-inline-faq` | Body içine serpiştirilen kısa Q&A snippet (Hızlı Bilgi kartı) | `<aside>`, 3 `<p>`: label + soru + cevap |
| `.ll-medical-verification-card` | Yayın kurulu kartı (isim sektörden, generic) | `<aside>`, icon span + içerik |
| `.cta-section` | Center CTA box | h2 + p + check items div + button div |
| `.ll-cta-primary` / `.ll-cta-secondary` | Button stilleri | `<a>` |
| `.ll-references-section` (alt: `.ll-references`) | Kaynakça | `<section>`, h2 + p + ol |
| `.ll-disclaimer` | Bilgilendirme kutusu | `<div>`, strong + text |
| `.comparison-table` / `.responsive-table` / `.content-table` | Tablo varyantları | `<table>` |

`<sup>` etiketi inline kaynak referansları (1, 2, ...) için kullanılır.

### Adım 1 — ÖNCE projenin mevcut design sistemini tespit et (zorunlu)

**Aşağıdaki CSS bloğunu olduğu gibi yapıştırma.** Önce projenin mevcut tasarım dilini öğren — renk paleti, spacing, radius, font, shadow tokenları zaten tanımlıdır. Editorial CSS bunlara uydurulmalı, **kendi paleti dayatmamalı**.

#### A. Token kaynağını bul

Kontrol edilecek dosyalar (tipik öncelik sırası):

```bash
# 1. Tailwind theme — varsa renk skalaları zaten orada
cat tailwind.config.{js,ts,cjs,mjs} 2>/dev/null
cat tailwind.config.* 2>/dev/null | grep -A 60 "theme.*:"

# 2. CSS variable'lar — :root, design-tokens.css, globals.css, theme.css
grep -rE "^\s*--[a-z]+-\d+\s*:" --include="*.css" --include="*.scss" --include="*.less" .
grep -rE ":root\s*\{" --include="*.css" .

# 3. CSS-in-JS / styled-components / theme objesi
find . -type f \( -name "theme.*" -o -name "tokens.*" -o -name "colors.*" -o -name "palette.*" \) -not -path "*/node_modules/*"
grep -rE "(primary|secondary|brand|accent)\s*:\s*['\"]#" --include="*.{ts,tsx,js,jsx}" -l . | head

# 4. SCSS/Sass değişkenleri
grep -rE "^\$[a-z-]+\s*:" --include="*.scss" --include="*.sass" .

# 5. Vue/Nuxt single-file-component <style> blokları
find . -name "*.vue" -exec grep -l "color\|brand\|primary" {} \;

# 6. Hiçbiri yoksa: brand kit / design system referansı (Figma export, brand-guidelines.md)
ls -la docs/ design/ brand/ 2>/dev/null
```

#### B. Renk skalasını eşle

Editorial CSS şu mantıkla token kullanır — projenin token'ları aynı semantik karşılıkla **rename edilerek** kullanılır:

| Editorial slot | Anlam | Tipik proje token'ı |
|---|---|---|
| `--brand-50` ... `--brand-100` | Çok açık vurgu (callout/badge bg) | `--primary-50`, `--accent-100`, Tailwind `brand-50` |
| `--brand-300` ... `--brand-500` | Orta brand (border, marker, accent) | `--primary-400`, `--brand-DEFAULT`, theme.colors.primary[500] |
| `--brand-600` ... `--brand-700` | Koyu brand (button, CTA, link) | `--primary-600`, `--brand-700`, theme.colors.primary[700] |
| `--surface-50` ... `--surface-200` | Çok açık zemin (panel, divider) | `--gray-50`, `--neutral-100`, `--bg-subtle` |
| `--surface-500` ... `--surface-700` | Metin tonları (body, muted) | `--text-muted`, `--gray-600` |
| `--surface-800` ... `--surface-900` | Koyu metin (heading, strong) | `--text`, `--text-strong` |

**Yapacakların**:
1. Mevcut paletin **prefix**'ini tespit et (örn. `--primary-`, `--gray-`, `brand.`, `$accent-`)
2. Aşağıdaki CSS'te `var(--brand-X)` ve `var(--surface-X)` referanslarını **bulduğun proje token'larıyla değiştir** (tek dosyada find-replace iki tur yeterli)
3. Eğer projede 50/100/.../900 skalası yoksa (sadece `--primary`, `--primary-light`, `--primary-dark` varsa), CSS'teki en yakın tonu eşle: 50→light, 500→DEFAULT, 700→dark
4. Border-radius, shadow, font-family, font-size base de **tema ile uyumlu** mu kontrol et — projede `--radius`, `--shadow-sm`, `--font-sans` varsa CSS'teki sabit değerleri (örn. `14px`, `1.05rem`) onlara çevirmek tercih edilir
5. Eğer projede dark mode varsa (`.dark` class veya `prefers-color-scheme`), editorial token override'ı dark mode bloğuna da ekle

#### C. Token bulunmazsa fallback (ZORUNLU değil)

Proje sıfırdan veya design system yoksa, aşağıdaki Tailwind indigo+zinc skalasını **temporary fallback** olarak kullan ama kullanıcıya bildir: "Proje token'ı bulamadım, şu paleti varsayılan koydum — brand kit'iniz farklıysa şu satırları güncelleyin":

```css
:root {
  /* FALLBACK — proje brand kit'iniz varsa bunu silin ve kendi token'larınızı kullanın */
  --brand-50:#eef2ff; --brand-100:#e0e7ff; --brand-200:#c7d2fe;
  --brand-300:#a5b4fc; --brand-400:#818cf8; --brand-500:#6366f1;
  --brand-600:#4f46e5; --brand-700:#4338ca; --brand-800:#3730a3;
  --surface-50:#fafafa; --surface-100:#f4f4f5; --surface-200:#e4e4e7;
  --surface-300:#d4d4d8; --surface-400:#a1a1aa; --surface-500:#71717a;
  --surface-600:#52525b; --surface-700:#3f3f46; --surface-800:#27272a; --surface-900:#09090b;
}
```

> **DOĞRU yaklaşım**: Aşağıdaki CSS bloğundaki tüm `var(--brand-*)` ve `var(--surface-*)` referanslarını projenin gerçek token'larıyla değiştir, yukarıdaki fallback'i hiç eklemeden. Editorial section landing'in görsel kimliğini bozmamalı.

### Adım 2 — Komponent CSS (kopyala-yapıştır, ~400 satır tek blok)

```css
/* === Reading column === */
.post-body { max-width: 920px; margin: 0 auto; padding: 2.25rem 2rem 2rem; }
.blog-body { color: var(--surface-800); font-size: 1.125rem; line-height: 1.78; }
.blog-body > *:first-child { margin-top: 0; }
.blog-body > * + * { margin-top: 1.35rem; }

/* Lead paragraph */
.blog-body > p:first-of-type { font-size: 1.25rem; line-height: 1.7; color: var(--surface-700); font-weight: 400; }

/* Headings */
.blog-body h2 { font-size: 1.75rem; font-weight: 800; line-height: 1.25; letter-spacing: -0.02em; color: var(--surface-900); margin-top: 3rem; padding-top: 0.25rem; }
.blog-body h3 { font-size: 1.35rem; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: var(--surface-900); margin-top: 2.25rem; }
.blog-body h4 { font-size: 1.15rem; font-weight: 700; color: var(--surface-800); margin-top: 1.75rem; }

/* Inline */
.blog-body a { color: var(--brand-700); font-weight: 500; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; text-decoration-color: var(--brand-200); transition: text-decoration-color 0.2s; }
.blog-body a:hover { text-decoration-color: var(--brand-600); }
.blog-body strong { color: var(--surface-900); font-weight: 700; }
.blog-body sup { font-size: 0.7em; color: var(--brand-600); font-weight: 700; margin-left: 1px; }

/* Lists */
.blog-body ul, .blog-body ol { padding-left: 1.5rem; }
.blog-body ul { list-style: disc; } .blog-body ol { list-style: decimal; }
.blog-body li { margin-top: 0.5rem; padding-left: 0.25rem; }
.blog-body li::marker { color: var(--brand-500); }

/* Media */
.blog-body figure { margin: 2.5rem -1rem; }
.blog-body figure img { width: 100%; height: auto; border-radius: 14px; }
.blog-body figcaption { font-size: 13.5px; color: var(--surface-500); text-align: center; margin-top: 0.75rem; font-style: italic; }
.blog-body img { border-radius: 10px; }
.blog-body hr { border: none; height: 1px; background: linear-gradient(to right, transparent, var(--surface-300), transparent); margin: 3rem 0; }

/* Quote / Code */
.blog-body blockquote { border-left: 4px solid var(--brand-500); padding: 0.5rem 0 0.5rem 1.5rem; margin: 2rem 0; color: var(--surface-700); font-style: italic; font-size: 1.15rem; line-height: 1.7; background: linear-gradient(to right, var(--brand-50), transparent 30%); }
.blog-body code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 0.88em; padding: 2px 7px; border-radius: 5px; background: var(--brand-50); color: var(--brand-800); border: 1px solid var(--brand-100); }
.blog-body pre { background: #0f172a; color: #e2e8f0; padding: 1.25rem 1.5rem; margin: 1.75rem -1rem; border-radius: 14px; overflow-x: auto; font-size: 0.92em; line-height: 1.65; }
.blog-body pre code { background: transparent; padding: 0; color: inherit; border: 0; }

/* === Reading time pill === */
.blog-body .ll-reading-time { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; margin: 0 0 1.5rem; background: var(--brand-50); color: var(--brand-700); font-size: 0.875rem; font-weight: 600; border: 1px solid var(--brand-100); }

/* === TOC === */
.blog-body .ll-content-nav { margin: 2.5rem 0; padding: 1.75rem 2rem; border: 1px solid var(--surface-200); border-radius: 14px; background: var(--surface-50); }
.blog-body .ll-content-nav > h2 { margin: 0 0 1.25rem !important; padding-bottom: 0.875rem; border-bottom: 1px solid var(--surface-200); font-size: 1.05rem !important; font-weight: 700; color: var(--surface-900); letter-spacing: -0.01em; }
.blog-body .ll-content-nav ul { list-style: none; padding: 0; margin: 0; }
.blog-body .ll-content-nav li { margin: 0.5rem 0; padding: 0; }
.blog-body .ll-content-nav li::marker { content: ''; }
.blog-body .ll-content-nav li > ul { padding-left: 1.25rem; margin-top: 0.4rem; }
.blog-body .ll-toc-link { display: block; padding: 4px 0; font-size: 0.9375rem; line-height: 1.5; color: var(--surface-700); text-decoration: underline; text-decoration-color: var(--brand-300); text-underline-offset: 4px; transition: color 0.2s, text-decoration-color 0.2s; }
.blog-body .ll-toc-link:hover { color: var(--brand-700); text-decoration-color: var(--brand-600); }
.blog-body .ll-toc-sub { font-size: 0.875rem; color: var(--surface-600); }

/* === Brand callout === */
.blog-body .ll-brand-callout { margin: 2.25rem 0; padding: 1.75rem 2rem; border-left: 4px solid var(--brand-500); border-radius: 0 14px 14px 0; background: linear-gradient(135deg, var(--brand-50) 0%, rgba(238, 242, 255, 0.4) 100%); }
.blog-body .ll-brand-callout > p:first-child { display: flex; align-items: center; margin: 0 0 0.875rem; font-weight: 700; font-size: 1.05rem; color: var(--surface-900); }
.blog-body .ll-brand-callout > p:first-child > span:first-child { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; background: var(--brand-600); color: #fff; font-weight: 700; font-size: 0.875rem; margin-right: 12px; }
.blog-body .ll-brand-callout > p:nth-child(2) { margin: 0 0 1.25rem; font-size: 1rem; line-height: 1.7; color: var(--surface-700); }
.blog-body .ll-brand-callout > p:last-child { margin: 1rem 0 0; }
.blog-body .ll-brand-callout > p:last-child > a { display: inline-block; padding: 9px 22px; background: var(--brand-600); color: #fff; border-radius: 8px; font-size: 0.875rem; font-weight: 600; text-decoration: none; transition: background 0.2s, transform 0.2s; }
.blog-body .ll-brand-callout > p:last-child > a:hover { background: var(--brand-700); transform: translateY(-1px); }

/* === Tables === */
.blog-body .comparison-table, .blog-body table.responsive-table, .blog-body table.content-table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem; border: 1px solid var(--brand-100); border-radius: 12px; overflow: hidden; }
.blog-body .comparison-table thead tr { background: var(--brand-50); border-bottom: 2px solid var(--brand-200); }
.blog-body .comparison-table th { padding: 0.875rem 1rem; text-align: left; vertical-align: top; font-weight: 700; color: var(--surface-900); font-size: 0.875rem; }
.blog-body .comparison-table td { padding: 0.85rem 1rem; text-align: left; vertical-align: top; line-height: 1.6; border-bottom: 1px solid var(--surface-100); background: #fff; }
.blog-body .comparison-table tr:last-child td { border-bottom: none; }

/* === E-A-T signals (soft gradient, 20px rounded, auto 01/02/03 badges via counter) === */
.blog-body .ll-eat-signals { counter-reset: eat-counter; margin: 3rem 0; padding: 2.25rem 2.5rem 2rem; border: 1px solid var(--surface-200); border-radius: 20px; background: linear-gradient(180deg, #fff 0%, var(--surface-50) 100%); }
.blog-body .ll-eat-expertise, .blog-body .ll-eat-authority, .blog-body .ll-eat-trust { counter-increment: eat-counter; }
.blog-body .ll-eat-expertise, .blog-body .ll-eat-authority { margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--surface-200); }
.blog-body .ll-eat-signals h2 { position: relative; padding-left: 2.5rem; margin: 0 0 0.875rem !important; font-size: 1.125rem !important; font-weight: 700; color: var(--surface-900); letter-spacing: -0.015em; line-height: 1.4; }
.blog-body .ll-eat-signals h2::before { content: counter(eat-counter, decimal-leading-zero); position: absolute; left: 0; top: 0.05em; font-size: 0.75rem; font-weight: 800; color: var(--brand-600); letter-spacing: 0.08em; }
.blog-body .ll-eat-signals .ll-eat-expertise > div, .blog-body .ll-eat-signals .ll-eat-authority > div, .blog-body .ll-eat-signals .ll-eat-trust > div { padding-left: 2.5rem; font-size: 0.9375rem; line-height: 1.75; color: var(--surface-600); }
.blog-body .ll-eat-signals .ll-eat-expertise > div + div, .blog-body .ll-eat-signals .ll-eat-authority > div + div, .blog-body .ll-eat-signals .ll-eat-trust > div + div { margin-top: 0.875rem; }

/* === FAQ section (soft gradient, 20px rounded, auto-numbered Q&A list via counter) === */
.blog-body .ll-faq-section { counter-reset: faq-counter; margin: 3rem 0; padding: 2.5rem 2.5rem 2.25rem; border: 1px solid var(--surface-200); border-radius: 20px; background: linear-gradient(180deg, #fff 0%, var(--surface-50) 100%); }
.blog-body .ll-faq-section > h2 { margin: 0 0 1.5rem !important; padding: 0 0 1.25rem; border-bottom: 1px solid var(--surface-200); font-size: 1.5rem !important; font-weight: 800; color: var(--surface-900); letter-spacing: -0.02em; }
.blog-body .ll-faq-item { counter-increment: faq-counter; margin: 0; padding: 1.5rem 0; border-bottom: 1px solid var(--surface-200); }
.blog-body .ll-faq-item:last-child { padding-bottom: 0; border-bottom: none; }
.blog-body .ll-faq-section > .ll-faq-item:first-of-type { padding-top: 0.5rem; }
.blog-body .ll-faq-item h3 { position: relative; padding-left: 2.5rem; margin: 0 0 0.75rem !important; font-size: 1.0625rem !important; font-weight: 600; color: var(--surface-900); line-height: 1.5; }
.blog-body .ll-faq-item h3::before { content: counter(faq-counter, decimal-leading-zero); position: absolute; left: 0; top: 0.05em; font-size: 0.6875rem; font-weight: 800; color: var(--brand-600); letter-spacing: 0.08em; }
.blog-body .ll-faq-answer { padding-left: 2.5rem; font-size: 0.9375rem; line-height: 1.75; color: var(--surface-600); }

/* === Inline "Hızlı Bilgi" card (body içine serpiştirilen Q&A) === */
.blog-body .ll-inline-faq { margin: 1.5rem 0; padding: 1.125rem 1.375rem 1.25rem; border: 1px solid var(--surface-200); border-left: 3px solid var(--brand-300); border-radius: 10px; background: linear-gradient(135deg, var(--brand-50) 0%, var(--surface-50) 60%, transparent 100%); }
.blog-body .ll-inline-faq > p:first-child { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 0.625rem; font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--brand-700); }
.blog-body .ll-inline-faq > p:first-child::before { content: '?'; display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; flex-shrink: 0; border-radius: 50%; background: var(--brand-600); color: #fff; font-size: 0.6875rem; font-weight: 800; letter-spacing: 0; }
.blog-body .ll-inline-faq > p:nth-child(2) { margin: 0 0 0.5rem; font-size: 0.9375rem; font-weight: 600; line-height: 1.5; color: var(--surface-900); }
.blog-body .ll-inline-faq > p:last-child { margin: 0; font-size: 0.9rem; line-height: 1.7; color: var(--surface-600); }

/* === Editorial verification card === */
.blog-body .ll-medical-verification-card { margin: 2.5rem 0 0; padding: 1.5rem 1.75rem; border: 1px solid var(--brand-100); border-radius: 16px; background: linear-gradient(180deg, var(--brand-50) 0%, var(--surface-50) 100%); }
.blog-body .ll-medical-verification-card > p:first-child { margin: 0 0 1.25rem !important; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--surface-500); }
.blog-body .ll-medical-verification-card > div { display: flex; gap: 1.25rem; align-items: flex-start; }
.blog-body .ll-medical-verification-card > div > span:first-child { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; flex-shrink: 0; border-radius: 16px; background: var(--brand-700); color: #fff; font-size: 1.5rem; font-weight: 700; }
.blog-body .ll-medical-verification-card > div > div { min-width: 0; flex: 1; }
.blog-body .ll-medical-verification-card > div > div > p:first-child { margin: 0 0 0.375rem !important; font-size: 1.0625rem; font-weight: 700; line-height: 1.4; color: var(--surface-900); }
.blog-body .ll-medical-verification-card > div > div > p:first-child a { color: inherit; text-decoration: none; }
.blog-body .ll-medical-verification-card > div > div > p:nth-child(2) { margin: 0 0 0.75rem; font-size: 0.9375rem; line-height: 1.6; color: var(--surface-600); }
.blog-body .ll-medical-verification-card > div > div > p:nth-child(2) a { color: var(--surface-700); text-decoration: none; }
.blog-body .ll-medical-verification-card > div > div > p:last-child { margin: 0; }
.blog-body .ll-medical-verification-card > div > div > p:last-child a { font-size: 0.875rem; font-weight: 600; color: var(--brand-700); text-decoration: underline; text-underline-offset: 3px; }

/* === CTA section === */
.blog-body .cta-section { text-align: center; margin: 2.75rem auto; padding: 2.5rem 1.75rem; max-width: 600px; border: 1.5px solid var(--brand-200); border-radius: 18px; background: linear-gradient(180deg, var(--brand-50) 0%, #fff 100%); }
.blog-body .cta-section > h2 { margin: 0 0 0.625rem !important; font-size: 1.4rem !important; font-weight: 800; line-height: 1.3; color: var(--surface-900); letter-spacing: -0.02em; }
.blog-body .cta-section > p { margin: 0 0 1.5rem; font-size: 0.9375rem; line-height: 1.55; color: var(--surface-600); }
.blog-body .cta-section > div:nth-of-type(1) { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem 1.5rem; margin: 0 0 1.75rem; font-size: 0.8125rem; color: var(--surface-600); }
.blog-body .cta-section > div:nth-of-type(1) > span { display: inline-flex; align-items: center; gap: 6px; }
.blog-body .cta-section > div:nth-of-type(1) > span > span:first-child { color: var(--brand-600); font-weight: 700; }
.blog-body .cta-section > div:nth-of-type(2) { display: flex; flex-direction: column; gap: 0.75rem; align-items: center; }

/* === CTA buttons === */
.blog-body .ll-cta-primary { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 28px; min-width: 200px; font-size: 0.9375rem; font-weight: 600; text-decoration: none; border-radius: 12px; background: linear-gradient(135deg, var(--brand-500), var(--brand-700)); color: #fff; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1), 0 4px 14px rgba(79, 70, 229, 0.28); transition: transform 0.2s, box-shadow 0.2s; }
.blog-body .ll-cta-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(79, 70, 229, 0.45); }
.blog-body .ll-cta-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 13px 28px; min-width: 200px; font-size: 0.9375rem; font-weight: 500; text-decoration: none; border-radius: 12px; border: 1.5px solid var(--brand-200); background: transparent; color: var(--brand-700); transition: background 0.2s, border-color 0.2s; }
.blog-body .ll-cta-secondary:hover { background: var(--brand-50); border-color: var(--brand-400); }

/* === References === */
.blog-body .ll-references-section { margin: 2.25rem 0 0; padding: 1.5rem 1.75rem; border: 1px solid var(--surface-200); border-radius: 12px; background: var(--surface-50); }
.blog-body .ll-references-section > h2 { margin: 0 0 0.375rem !important; font-size: 1.05rem !important; font-weight: 700; color: var(--surface-900); }
.blog-body .ll-references-section > p { margin: 0 0 1rem; font-size: 0.8125rem; color: var(--surface-500); }
.blog-body .ll-references { margin: 0; padding: 0 0 0 1.5rem; font-size: 0.9rem; line-height: 1.8; }
.blog-body .ll-references li { margin: 0.25rem 0; color: var(--surface-700); }
.blog-body .ll-references li::marker { color: var(--brand-600); font-weight: 700; }
.blog-body .ll-references span:first-child { font-weight: 600; color: var(--surface-900); }
.blog-body .ll-references a { color: var(--brand-700); }

/* === Disclaimer === */
.blog-body .ll-disclaimer { margin: 2.25rem 0 0; padding: 1rem 1.25rem; border: 1px solid var(--surface-200); border-radius: 10px; background: var(--surface-50); font-size: 0.8125rem; line-height: 1.6; color: var(--surface-600); }
.blog-body .ll-disclaimer strong { color: var(--surface-800); }

/* === Mobile === */
@media (max-width: 768px) {
  .post-body { padding: 1.75rem 1.25rem 1rem; font-size: 1.0625rem; }
  .blog-body { font-size: 1.0625rem; line-height: 1.75; }
  .blog-body > p:first-of-type { font-size: 1.15rem; }
  .blog-body h2 { font-size: 1.5rem; margin-top: 2.25rem; }
  .blog-body h3 { font-size: 1.2rem; }
  .blog-body figure, .blog-body pre { margin-left: -0.5rem; margin-right: -0.5rem; }
  .blog-body .ll-content-nav, .blog-body .ll-brand-callout, .blog-body .ll-eat-signals,
  .blog-body .ll-faq-section, .blog-body .ll-medical-verification-card,
  .blog-body .cta-section, .blog-body .ll-references-section { padding: 1.25rem 1.25rem; }
  .blog-body .ll-inline-faq { padding: 1rem 1.125rem 1.125rem; }
  .blog-body .ll-medical-verification-card > div { flex-direction: column; gap: 0.75rem; }
}
```

### Edge case'ler

- **Class'sız generic `<div>`/`<span>`'ler gelir** (örn. `.cta-section` içindeki check-items ve button container). `:nth-of-type(1)` / `:nth-of-type(2)` gibi pozisyon selector'ları ile targetla — markup sırası sabit.
- **`style="..."` tamamen gider**. Text alignment, gap, flex-direction gibi her özellik için CSS class ile yedek style yaz.
- **`.ll-medical-verification-card` ismi medical sektörden** ama generic kullanılır. Class adını DEĞİŞTİRME (blog tarafı kontrol ediyor); sadece styling sende.
- **Çoklu site teması**: Aynı blog API'yi farklı landing'lerde kullanıyorsan her landing kendi `.blog-body` CSS'ini yazar. Ortak class'ları (`ll-cta-primary`, `cta-section`) shared CSS'e ayırıp her landing'den import etmek pratiktir.
- **Tailwind `prose` ile çakışma**: `.blog-body` ile `prose` aynı anda kullanma — class-based stiller birbirini override eder. Birini seç (genelde `.blog-body` daha kontrollü).
- **Cache**: CSS değişikliği için blog cache temizlemeye gerek yok; sadece landing redeploy + hard refresh.

### Doğrulama checklist

Sample post yayınlayıp her komponenti kontrol et:
- [ ] Reading time pill rounded ve renkli
- [ ] TOC linkler underline + hover renk değişimi
- [ ] Brand callout: icon yuvarlak, başlık + body + button
- [ ] Tablo header renkli, satır altı çizgili, son satır border'sız
- [ ] Inline "Hızlı Bilgi" kartları soft, sol-accent border'lı, "?" badge'li
- [ ] E-A-T: soft gradient bg, sub-div'lerin başlıkları otomatik **01 / 02 / 03** brand-renkli prefix ile, body 2.5rem indent
- [ ] FAQ: soft gradient bg, soru başlıkları otomatik numaralı (01/02/03), soru ve cevap aynı 2.5rem indent (dikey hat oluşturur)
- [ ] Verification card: icon kare + sağında multi-line text
- [ ] CTA section: gradient bg + check items row + button
- [ ] References: brand-colored marker, link rengi
- [ ] Disclaimer: subtle gri box
- [ ] Mobil 375-768px: padding daraldı, verification card dikey

## SEO checklist (her framework için geçerli)

### Zorunlu
- `<title>` ve `<meta name="description">` her post için doldur (`meta.title`, `meta.description`'dan gelir)
- `<link rel="canonical">` `meta.canonical`'dan
- `<meta property="og:*">` tagları `meta.og`'dan
- `<script type="application/ld+json">` `jsonLd` ile — BlogPosting structured data
- 404'te gerçek 404 response (redirect değil)
- Same-origin `/sitemap.xml` → landing'in kendi domain'inde (blog servisinin sitemap'ini değil)

### Öneriler
- `<h1>` post title için (bodyHtml'in DIŞINDA, h2'den başlar)
- Cover image `width`/`height` → CLS = 0
- `<time datetime="...">` publish date için
- Breadcrumb JSON-LD ek structured data
- Related posts (internal linking)
- RSS `<link rel="alternate">` `<head>`'de

### Performance
- LCP < 2.5s — cover image priority, critical CSS inline
- CLS < 0.1 — tüm media'ya width/height
- INP < 200ms — minimum JS, Server-Side Rendering tercih et

### Asla yapma
- ❌ `bodyHtml`'i tekrar sanitize et (zaten sanitize)
- ❌ Meta tag'leri elle yaz (`meta` objesinden kullan)
- ❌ JSON-LD script'i atla (rich results kaybolur)
- ❌ Canonical URL'i override et (duplicate content penalty)

## Sık hatalar

| Hata | Çözüm |
|---|---|
| `401 MISSING_API_KEY` | `BLOG_API_KEY` env eksik. Server restart. |
| `401 MISSING_READ_KEY` | Gated site — `BLOG_READ_KEY` ekle. |
| `403 FORBIDDEN_ORIGIN` | Blog panelinden Settings → Allowed origins'e `https://www.tahircanyildiz.com` ekle. |
| `429 RATE_LIMITED` | `Retry-After` header'daki kadar bekle. |
| Yazı görünmüyor | `status: "published"` mi? `locale` eşleşiyor mu? Cache temizle. |

## Verification checklist

Bitince kontrol et:

- [ ] `/blog` sayfası açılıyor, en az 1 post listede
- [ ] `/blog/<slug>` sayfası render oluyor
- [ ] Sayfa kaynağında: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<script type="application/ld+json">` var
- [ ] `/sitemap.xml` açılıyor, blog post'ları içeriyor (same-origin)
- [ ] Lighthouse SEO skoru ≥ 90
- [ ] Google Rich Results Test: "BlogPosting detected"

## Kaynaklar

- Blog admin paneli: `https://blogservice.lobsterlead.com/admin/sites/mrpurposeless`
- Public API liste: `https://blogservice.lobsterlead.com/api/v1/sites/mrpurposeless/posts`
- Framework değiştir: admin panelde AI Agent sekmesinden seç ve yeni AGENTS.md oluştur
