/* ============================================================
   Majestic Trunk — static site generator
   Reads data + templates, stamps out REAL .html pages into dist/.
   Plain Node, zero dependencies. Run: `node build.js`.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const readJSON = (...p) => JSON.parse(read(...p));
const T = (name) => read(SRC, 'templates', name);
const P = (name) => read(SRC, 'partials', name);

// ---- data ----
const site = readJSON(SRC, 'data/site.json');
const experiences = readJSON(SRC, 'data/experiences.json');
const lodges = readJSON(SRC, 'data/lodges.json');

// ---- tiny token replacer: {{key}} -> map[key] (function replacer => $-safe) ----
const fill = (tpl, map) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in map ? map[k] : m));

// ---- shell (header/footer rendered once, reused everywhere) ----
const base = P('base.html');
const header = fill(P('header.html'), { activitarUrl: site.activitarUrl });
const footer = fill(P('footer.html'), { activitarUrl: site.activitarUrl, year: site.year });
const layout = ({ title, description, content }) =>
  fill(base, { title, description, header, footer, content });

// ---- builders ----
const expCard = (e) => `
    <a class="card" href="/experiences/${e.slug}.html">
      <figure><img src="/assets/img/${e.image}" alt="${e.alt}" loading="lazy"></figure>
      <div class="card-body">
        <span class="pill">${e.category}</span>
        <h3>${e.title}</h3>
        <p class="price">${e.duration} · from ${e.priceFrom}</p>
      </div>
    </a>`;
const lodgeCard = (l) => `
    <a class="card" href="/stay/${l.slug}.html">
      <figure><img src="/assets/img/${l.image}" alt="${l.alt}" loading="lazy"></figure>
      <div class="card-body">
        <span class="pill">${l.location}</span>
        <h3>${l.title}</h3>
        <p class="price">from ${l.priceFrom}</p>
      </div>
    </a>`;
const list = (arr, fn) => arr.map(fn).join('\n');
const paras = (arr) => arr.map((p) => `<p>${p}</p>`).join('\n');
const items = (arr) => arr.map((h) => `<li>${h}</li>`).join('\n');

// ---- output ----
const write = (rel, html) => {
  const out = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
};

// clean + copy static assets
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(path.join(SRC, 'styles'), path.join(DIST, 'assets/css'), { recursive: true });
fs.cpSync(path.join(SRC, 'js'), path.join(DIST, 'assets/js'), { recursive: true });
fs.cpSync(path.join(SRC, 'assets/img'), path.join(DIST, 'assets/img'), { recursive: true });

let n = 0;

// home
write('index.html', layout({
  title: 'Majestic Trunk Expeditions — Victoria Falls Safaris & Lodges',
  description: 'Expertly guided expeditions and boutique lodges at Victoria Falls, Zimbabwe. Rafting, game drives, sunset cruises and more — booked in minutes.',
  content: fill(T('home.html'), {
    activitarUrl: site.activitarUrl,
    featuredExperienceCards: list(experiences.filter((e) => e.featured).slice(0, 3), expCard),
  }),
})); n++;

// experiences index
write('experiences/index.html', layout({
  title: 'Experiences — Majestic Trunk Expeditions',
  description: 'Signature Victoria Falls experiences: rafting, helicopter flights, sunset cruises, game drives, cultural village tours and more.',
  content: fill(T('experiences-index.html'), { experienceCards: list(experiences, expCard) }),
})); n++;

// experience detail pages
const expTpl = T('experience.html');
experiences.forEach((e) => {
  const related = experiences.filter((x) => x.slug !== e.slug).slice(0, 3);
  write(`experiences/${e.slug}.html`, layout({
    title: `${e.title} — Majestic Trunk Expeditions`,
    description: e.summary,
    content: fill(expTpl, {
      title: e.title, summary: e.summary, category: e.category, image: e.image,
      duration: e.duration, difficulty: e.difficulty, priceFrom: e.priceFrom,
      activitarUrl: site.activitarUrl, bodyHtml: paras(e.body),
      highlightsHtml: items(e.highlights), relatedCards: list(related, expCard),
    }),
  })); n++;
});

// stay index
write('stay/index.html', layout({
  title: 'Where to Stay — Majestic Trunk Expeditions',
  description: 'Hand-picked lodges and hotels in Victoria Falls, from riverside luxury to relaxed garden retreats.',
  content: fill(T('lodges-index.html'), { lodgeCards: list(lodges, lodgeCard) }),
})); n++;

// lodge detail pages
const lodgeTpl = T('lodge.html');
lodges.forEach((l) => {
  const related = lodges.filter((x) => x.slug !== l.slug).slice(0, 3);
  write(`stay/${l.slug}.html`, layout({
    title: `${l.title} — Majestic Trunk Expeditions`,
    description: l.summary,
    content: fill(lodgeTpl, {
      title: l.title, summary: l.summary, image: l.image, location: l.location,
      priceFrom: l.priceFrom, activitarUrl: site.activitarUrl,
      bodyHtml: paras(l.body), highlightsHtml: items(l.highlights),
      relatedCards: list(related, lodgeCard),
    }),
  })); n++;
});

// simple static pages
[
  ['about.html', 'About — Majestic Trunk Expeditions', 'Meet Majestic Trunk Expeditions — a local team crafting expertly guided journeys around Victoria Falls.'],
  ['contact.html', 'Contact — Majestic Trunk Expeditions', 'Get in touch to plan a trip, request a custom itinerary or arrange a group booking.'],
  ['privacy.html', 'Privacy Policy — Majestic Trunk Expeditions', 'How Majestic Trunk Expeditions handles your information.'],
].forEach(([file, title, description]) => {
  write(file, layout({ title, description, content: fill(T(file), { activitarUrl: site.activitarUrl }) }));
  n++;
});

// gallery
const galleryImgs = ['hero-falls.jpg', 'rafting.jpg', 'elephant.jpg', 'village.jpg', 'helicopter.webp', 'zambezi-aerial.jpg', 'elephant-encounter.jpg', 'safari-lodge.jpg', 'elephants-group.jpg', 'palm-river.jpg', 'veranda.jpg', 'pool.jpg'];
write('gallery.html', layout({
  title: 'Gallery — Majestic Trunk Expeditions',
  description: 'A glimpse of Victoria Falls experiences and lodges.',
  content: fill(T('gallery.html'), {
    galleryHtml: galleryImgs.map((i) => `<a href="/assets/img/${i}" target="_blank" rel="noopener"><img src="/assets/img/${i}" alt="Victoria Falls gallery image" loading="lazy"></a>`).join('\n'),
  }),
})); n++;

console.log(`✓ built ${n} pages → dist/`);
