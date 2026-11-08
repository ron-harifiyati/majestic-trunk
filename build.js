/* Zero-dependency static generator. Edit src/, then run node build.js. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const read = (...p) => fs.readFileSync(path.join(...p), 'utf8');
const json = name => JSON.parse(read(SRC, 'data', name + '.json'));
const T = name => read(SRC, 'templates', name);
const P = name => read(SRC, 'partials', name);
const site = json('site');
const experiences = json('experiences');
const lodges = json('lodges');
const dining = json('dining');
const media = json('media');
const esc = (v = '') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fill = (tpl, map) => tpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in map)) throw new Error(`Missing template value: ${key}`);
  return map[key];
});
const groups = {
  experiences: [
    ['falls-river', 'The Falls & River', 'Waterfall viewpoints, aerial perspectives and time on the upper Zambezi.'],
    ['adventure', 'Adventure', 'Bridge jumps, gorge activities, white water and seasonal island experiences.'],
    ['wildlife', 'Wildlife & Conservation', 'Safari outings, river wildlife and time to learn about conservation.'],
    ['culture', 'Culture & Evenings', 'Community visits, theatre, art and an evening around the table.'],
  ],
  stay: [
    ['town-gardens', 'Town & Gardens', 'Hotels and garden lodges for days out, with a place to unwind between outings.'],
    ['riverfront', 'Riverfront Hotels', 'Hotel facilities and river surroundings; check the transport and meal arrangements.'],
    ['safari', 'Safari Lodges', 'A stay shaped by the bush, with activities and inclusions to compare carefully.'],
  ],
  dining: [
    ['with-a-view', 'Dining with a View', 'River, gorge and lodge settings for a meal with a sense of place.'],
    ['casual', 'Restaurants & Cafés', 'Town restaurants, garden tables and meals to fit around your day.'],
    ['evenings', 'Bars & Evenings', 'A brewery-and-grill setting for a sociable evening. Check the current programme.'],
  ],
};
const facets = {
  experiences: [['zimbabwe','Zimbabwe'],['zambia','Zambia · cross-border'],['botswana','Botswana · cross-border'],['seasonal','Seasonal'],['self-guided','Self-guided']],
  stay: [['adults-only','Adults only'],['family-rooms','Family rooms'],['spa','Spa'],['accessible-rooms','Accessible room options'],['safari-activities','Safari activities'],['self-catering','Self-catering'],['camping','Camping options']],
  dining: [['views','A meal with a view'],['high-tea','Afternoon tea'],['local-food','Zimbabwean cooking'],['craft-drinks','Craft beer & gin'],['hotel-dining','Hotel dining'],['live-music','Music programme']],
};
const ensure = (ok, message) => { if (!ok) throw new Error(message); };
for (const [type, arr] of [['experiences', experiences], ['stay', lodges], ['dining', dining]]) {
  const seen = new Set();
  for (const entry of arr) {
    ensure(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug), `Invalid ${type} slug`);
    ensure(!seen.has(entry.slug), `Duplicate ${type} slug: ${entry.slug}`); seen.add(entry.slug);
    for (const key of ['title','category','group','summary','reviewed']) ensure(typeof entry[key] === 'string' && entry[key].trim(), `${entry.slug}: missing ${key}`);
    for (const key of ['body','planning','sources']) ensure(Array.isArray(entry[key]) && entry[key].length, `${entry.slug}: missing ${key}`);
    ensure(entry.body.every(p=>typeof p==='string' && p.trim()), `${entry.slug}: invalid body text`);
    ensure(entry.planning.every(p=>p && typeof p.label==='string' && typeof p.text==='string' && p.label.trim() && p.text.trim()), `${entry.slug}: invalid planning notes`);
    for (const key of type==='experiences' ? ['duration','difficulty','bestFor'] : type==='stay' ? ['location','bestFor'] : ['location','atmosphere','cuisine','officialUrl']) ensure(typeof entry[key]==='string' && entry[key].trim(), `${entry.slug}: missing ${key}`);
    if (type!=='dining') ensure(Array.isArray(entry.highlights) && entry.highlights.length && entry.highlights.every(h=>typeof h==='string' && h.trim()), `${entry.slug}: invalid highlights`);
    if (type==='experiences') {
      ensure(entry.media, `${entry.slug}: an experience photo is required`);
      ensure(['zimbabwe','zambia','botswana'].includes(entry.region), `${entry.slug}: invalid region`);
      ensure(['short','half-day','full-day','evening','confirm'].includes(entry.timeCategory), `${entry.slug}: invalid time category`);
    }
    if (type==='stay') {
      ensure(['hotel','resort','lodge','villa'].includes(entry.propertyType), `${entry.slug}: invalid property type`);
      ensure(entry.media, `${entry.slug}: a property photo is required`);
      ensure(Array.isArray(entry.cardFeatures) && entry.cardFeatures.length===2 && entry.cardFeatures.every(f=>typeof f==='string' && f.trim()), `${entry.slug}: two short card features are required`);
      for (const key of ['rooms','inclusions','transport']) ensure(entry.comparison && typeof entry.comparison[key]==='string' && entry.comparison[key].trim(), `${entry.slug}: missing comparison ${key}`);
    }
    if (type==='dining') {
      ensure(entry.media, `${entry.slug}: a venue photo is required`);
      ensure(Array.isArray(entry.meals) && entry.meals.length && entry.meals.every(m=>['breakfast','coffee','lunch','dinner','tea','drinks'].includes(m)), `${entry.slug}: invalid meal services`);
      ensure(Array.isArray(entry.cardFeatures) && entry.cardFeatures.length===2 && entry.cardFeatures.every(f=>typeof f==='string' && f.trim()), `${entry.slug}: two short card features are required`);
      ensure(Array.isArray(entry.highlights) && entry.highlights.length, `${entry.slug}: missing dining highlights`);
      if (entry.relatedStay) ensure(lodges.some(l=>l.slug===entry.relatedStay), `${entry.slug}: unknown related stay`);
    }
    ensure(groups[type].some(g => g[0] === entry.group), `${entry.slug}: invalid group`);
    for (const s of entry.sources) ensure(/^https:\/\//.test(s.url) && s.title, `${entry.slug}: invalid source`);
    if (entry.officialUrl) ensure(/^https:\/\//.test(entry.officialUrl), `${entry.slug}: invalid official URL`);
    if (entry.media) ensure(media[entry.media] && entry.alt, `${entry.slug}: missing photo or alt text`);
    ensure(Array.isArray(entry.tags), `${entry.slug}: missing tags`);
  }
}
for (const [key, m] of Object.entries(media)) {
  for (const file of [m.file, m.small]) ensure(file && fs.existsSync(path.join(SRC, 'assets/img', file)), `${key}: missing image ${file}`);
  ensure(m.width > 0 && m.height > 0 && m.smallWidth > 0, `${key}: missing image dimensions`);
}
const base = P('base.html');
const header = fill(P('header.html'), {activitarUrl: site.activitarUrl});
const footer = fill(P('footer.html'), {activitarUrl: site.activitarUrl, year: site.year});
const layout = ({title, description, content}) => fill(base, {title:esc(title), description:esc(description), header, footer, content, bodyClass:content.includes('class="photo-hero ') ? 'has-photo-hero' : '', pageScripts:content.includes('data-experience-directory') ? '<script src="/assets/js/experiences.js" defer></script>' : content.includes('data-stay-directory') ? '<script src="/assets/js/stays.js" defer></script>' : content.includes('data-dining-directory') ? '<script src="/assets/js/dining.js" defer></script>' : ''});
const list = (arr, fn) => arr.map(fn).join('\n');
const paras = arr => list(arr, p => `<p>${esc(p)}</p>`);
const items = arr => list(arr, h => `<li>${esc(h)}</li>`);
const planning = arr => list(arr, p => `<div><dt>${esc(p.label)}</dt><dd>${esc(p.text)}</dd></div>`);
const sources = arr => list(arr, s => `<li><a href="${esc(s.url)}">${esc(s.title)} ↗</a></li>`);
const enquiry = title => `/contact.html?interest=${encodeURIComponent(title)}`;
const usedMedia = new Set();
const photo = (id, alt, priority = false, fullWidth = false) => {
  if (!id) return '';
  const m = media[id]; usedMedia.add(id);
  const srcset = m.smallWidth === m.width ? `/assets/img/${m.file} ${m.width}w` : `/assets/img/${m.small} ${m.smallWidth}w, /assets/img/${m.file} ${m.width}w`;
  return `<img src="/assets/img/${m.file}" srcset="${srcset}" sizes="${fullWidth ? '100vw' : '(max-width: 600px) calc(100vw - 40px), (max-width: 880px) 45vw, 600px'}" alt="${esc(alt)}" width="${m.width}" height="${m.height}" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};
const heroMedia = e => photo(e.media || 'home-hero',e.media ? e.alt : 'Victoria Falls · destination setting',true,true);
const contextualLinks = slug => {
  const links = {
    'gorge-swing': [['/eat-drink/lookout-cafe.html','Consider a meal at the Lookout Café'],['/experiences/gorge-zipline.html','Compare the gorge zipline']],
    'gorge-zipline': [['/eat-drink/lookout-cafe.html','Consider a meal at the Lookout Café'],['/experiences/gorge-swing.html','Compare the gorge swing']],
    'vulture-culture': [['/eat-drink/makuwa-kuwa.html','Plan lunch at MaKuwa-Kuwa'],['/stay/victoria-falls-safari-lodge.html','Explore Victoria Falls Safari Lodge']],
    'simunye-theatre': [['/eat-drink/?group=casual','Find somewhere for dinner']],
    'art-galleries-crafts': [['/eat-drink/?group=casual','Leave time for lunch in town']],
    'victoria-falls-hotel': [['/eat-drink/stanleys-terrace.html','Afternoon tea at Stanley’s Terrace']],
    'victoria-falls-safari-lodge': [['/eat-drink/makuwa-kuwa.html','Dining at MaKuwa-Kuwa'],['/experiences/vulture-culture.html','The Vulture Culture Experience']],
  }[slug];
  return links ? `<aside class="related-links"><h2>While you are nearby</h2><ul>${links.map(([url,label])=>`<li><a href="${esc(url)}">${esc(label)} ↗</a></li>`).join('')}</ul></aside>` : '';
};
const tagNames = {...Object.fromEntries(Object.values(facets).flat()),'short-visit':'Short visit','heritage':'Heritage hotel','town':'Town setting'};
const tagsHtml = e => e.tags.length ? `<ul class="entry-tags" aria-label="Features">${e.tags.map(t => `<li>${esc(tagNames[t] || t)}</li>`).join('')}</ul>` : '';
const card = (e, type) => {
  const route = type === 'experiences' ? 'experiences' : type === 'stay' ? 'stay' : 'eat-drink';
  const meta = type === 'experiences' ? `${e.duration} · ${e.region === 'zambia' ? 'Zambia' : e.region === 'botswana' ? 'Botswana' : 'Zimbabwe'}` : type === 'stay' ? e.location : e.location;
  const action = type === 'experiences' ? 'Explore activity' : type === 'stay' ? 'View property' : 'Explore venue';
  const tokens = [...e.tags, e.region || ''].filter(Boolean).join(' ');
  return `<article class="card ${type === 'stay' ? 'accommodation-card' : ''} ${!e.media ? 'card-no-photo' : ''}" data-card data-tags="${esc(tokens)}"><a class="card-main" href="/${route}/${e.slug}.html">${e.media ? `<figure>${photo(e.media,e.alt)}</figure>` : ''}<div class="card-body"><span class="pill">${esc(e.category)}</span><h3>${esc(e.title)}</h3><p class="card-summary">${esc(e.summary)}</p>${tagsHtml(e)}<p class="card-meta">${esc(meta)}</p><span class="card-link">${action} <span aria-hidden="true">↗</span></span></div></a></article>`;
};
const expCard = e => card(e,'experiences');
const lodgeCard = (e, heading='h3', anchor='') => `<article class="card stay-card" data-card data-stay data-setting="${esc(e.group)}" data-type="${esc(e.propertyType)}" data-tags="${esc(e.tags.join(' '))}"${anchor}><a class="card-main" href="/stay/${e.slug}.html"><figure>${photo(e.media,e.alt)}</figure><div class="card-body"><span class="stay-category">${esc(e.category)}</span><${heading}>${esc(e.title)}</${heading}><p class="stay-location">${esc(e.location)}</p><p class="card-summary">${esc(e.summary)}</p><ul class="stay-features" aria-label="Property features">${e.cardFeatures.map(h=>`<li>${esc(h)}</li>`).join('')}</ul><span class="card-link">View property <span aria-hidden="true">↗</span></span></div></a></article>`;
const renderDiningCard = (e, heading='h3', anchor='') => `<article class="card dining-card" data-card data-dining data-category="${esc(e.group)}" data-meals="${esc(e.meals.join(' '))}" data-tags="${esc(e.tags.join(' '))}"${anchor}><a class="card-main" href="/eat-drink/${e.slug}.html"><figure>${photo(e.media,e.alt)}</figure><div class="card-body"><span class="dining-category">${esc(e.category)}</span><${heading}>${esc(e.title)}</${heading}><p class="dining-location">${esc(e.location)}</p><p class="card-summary">${esc(e.summary)}</p><ul class="dining-features" aria-label="Venue features">${e.cardFeatures.map(h=>`<li>${esc(h)}</li>`).join('')}</ul><span class="card-link">Explore venue <span aria-hidden="true">↗</span></span></div></a></article>`;
const diningCard = e => renderDiningCard(e);
// Experiences have their own flat catalogue; the other directories remain grouped.
const experienceCatalogue = () => {
  const categoryLabels = {'falls-river':'Falls & River','adventure':'Adventure','wildlife':'Wildlife','culture':'Culture & Evenings'};
  const locations = {zimbabwe:'Zimbabwe',zambia:'Zambia',botswana:'Botswana'};
  const timeLabels = [['short','Short outing'],['half-day','Half day'],['full-day','Full day'],['evening','Evening'],['confirm','Varies by programme']];
  const ordered = groups.experiences.flatMap(([id]) => experiences.filter(e=>e.group===id));
  const filters = `<div class="catalogue-filters" id="experience-filter-fields" data-catalogue-filters hidden><div class="catalogue-filter-fields"><label for="experience-location">Location<select id="experience-location" data-location-filter><option value="all">All locations</option>${Object.entries(locations).map(([id,title])=>`<option value="${id}">${title}${id==='zimbabwe'?'':' · cross-border'}</option>`).join('')}</select></label><label for="experience-time">Time available<select id="experience-time" data-time-filter><option value="all">Any duration</option>${timeLabels.map(([id,title])=>`<option value="${id}">${title}</option>`).join('')}</select></label><label for="experience-category">Category<select id="experience-category" data-category-filter><option value="all">All experiences</option>${groups.experiences.map(([id])=>`<option value="${id}">${esc(categoryLabels[id])}</option>`).join('')}</select></label></div></div>`;
  const seenGroups = new Set();
  const cards = ordered.map(e=>{
    const groupAnchor = seenGroups.has(e.group) ? '' : ` id="group-${e.group}"`; seenGroups.add(e.group);
    const notes = [e.region!=='zimbabwe' ? 'Cross-border' : '',e.tags.includes('seasonal') ? 'Seasonal' : '',e.tags.includes('self-guided') ? 'Self-guided' : ''].filter(Boolean);
    return `<article class="card experience-card ${e.media?'':'experience-card-text'}" data-card data-experience data-category="${e.group}" data-location="${e.region}" data-time="${e.timeCategory}"${groupAnchor}><a class="card-main" href="/experiences/${e.slug}.html">${e.media?`<figure>${photo(e.media,e.alt)}</figure>`:''}<div class="card-body"><span class="experience-category">${esc(categoryLabels[e.group])}</span><h2>${esc(e.title)}</h2><p class="card-summary">${esc(e.summary)}</p><dl class="experience-facts"><div><dt>Time</dt><dd>${esc(e.duration)}</dd></div><div><dt>Location</dt><dd>${locations[e.region]}</dd></div></dl>${notes.length?`<ul class="experience-notes" aria-label="Planning notes">${notes.map(note=>`<li>${note}</li>`).join('')}</ul>`:''}<span class="card-link">View experience <span aria-hidden="true">↗</span></span></div></a></article>`;
  }).join('');
  return `<div data-experience-directory><div class="experience-toolbar"><div class="wrap"><div class="catalogue-panel"><div class="catalogue-status"><button type="button" class="catalogue-toggle" data-toggle-experiences aria-expanded="false" aria-controls="experience-filter-fields" hidden><span>Filters</span><svg aria-hidden="true" viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button><p class="results-count" role="status" aria-live="polite" aria-atomic="true" data-experience-results>${ordered.length} experiences</p><button type="button" class="text-link" data-clear-experiences hidden>Clear filters</button></div>${filters}</div></div></div><div class="wrap catalogue-body"><div class="grid grid-3 experience-grid" id="experience-list">${cards}</div><div class="directory-empty" data-experience-empty hidden><h2>No matching experiences</h2><p>Choose another category, location or duration, or clear the filters to see everything.</p><button type="button" class="btn btn-ghost" data-clear-experiences>Show all experiences</button></div></div></div>`;
};
const stayCatalogue = () => {
 const select = (id,label,options) => `<label for="stay-${id}">${label}<select id="stay-${id}" data-${id}-filter>${options.map(([value,title])=>`<option value="${value}">${esc(title)}</option>`).join('')}</select></label>`;
 const fields = select('setting','Setting',[['all','All settings'],['town-gardens','Town & Gardens'],['riverfront','Riverfront'],['safari','Safari']]) + select('type','Property type',[['all','All property types'],['hotel','Hotel'],['resort','Resort'],['lodge','Lodge'],['villa','Villa / Apartment']]) + select('preference','Preferences',[['all','Any preference'],...facets.stay]);
 const seen = new Set();
 const cards = lodges.map(e=>{
  const anchor = seen.has(e.group) ? '' : ` id="group-${e.group}"`; seen.add(e.group);
  return lodgeCard(e,'h2',anchor);
 }).join('');
 return `<div data-stay-directory><div class="experience-toolbar"><div class="wrap"><div class="catalogue-panel"><div class="catalogue-status"><p class="results-count" role="status" aria-live="polite" aria-atomic="true" data-stay-results>${lodges.length} places to stay</p><button type="button" class="text-link" data-clear-stays hidden>Clear filters</button><button type="button" class="catalogue-toggle" data-toggle-stays aria-expanded="false" aria-controls="stay-filter-fields" hidden><span>Filters</span><svg aria-hidden="true" viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="catalogue-filters" id="stay-filter-fields" data-catalogue-filters hidden><div class="catalogue-filter-fields">${fields}</div></div></div></div></div><div class="wrap catalogue-body"><div class="grid grid-3 stay-grid">${cards}</div><div class="directory-empty" data-stay-empty hidden><h2>No matching places to stay</h2><p>Try another setting, property type or preference.</p><button type="button" class="btn btn-ghost" data-clear-stays>Show all properties</button></div></div></div>`;
};
const diningCatalogue = () => {
 const select=(id,label,options)=>`<label for="dining-${id}">${label}<select id="dining-${id}" data-${id}-filter>${options.map(([value,title])=>`<option value="${value}">${esc(title)}</option>`).join('')}</select></label>`;
 const fields=select('category','Category',[['all','All venues'],['with-a-view','With a view'],['casual','Restaurants & Cafés'],['evenings','Bars & Evenings']])+select('meal','Visit',[['all','Any visit'],['breakfast','Breakfast'],['coffee','Coffee'],['lunch','Lunch'],['dinner','Dinner'],['tea','Afternoon tea'],['drinks','Drinks']])+select('preference','Preferences',[['all','Any preference'],...facets.dining]);
 const seen=new Set();
 const cards=dining.map(e=>{const anchor=seen.has(e.group)?'':` id="group-${e.group}"`;seen.add(e.group);return renderDiningCard(e,'h2',anchor);}).join('');
 return `<div data-dining-directory><div class="experience-toolbar"><div class="wrap"><div class="catalogue-panel"><div class="catalogue-status"><p class="results-count" role="status" aria-live="polite" aria-atomic="true" data-dining-results>${dining.length} places to eat &amp; drink</p><button type="button" class="text-link" data-clear-dining hidden>Clear filters</button><button type="button" class="catalogue-toggle" data-toggle-dining aria-expanded="false" aria-controls="dining-filter-fields" hidden><span>Filters</span><svg aria-hidden="true" viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="m5 7 5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="catalogue-filters" id="dining-filter-fields" data-catalogue-filters hidden><div class="catalogue-filter-fields">${fields}</div></div></div></div></div><div class="wrap catalogue-body"><div class="grid grid-3 dining-grid">${cards}</div><div class="directory-empty" data-dining-empty hidden><h2>No matching places to eat or drink</h2><p>Try another category, visit or preference.</p><button type="button" class="btn btn-ghost" data-clear-dining>Show all venues</button></div></div></div>`;
};
const routes = new Set();
const write = (rel, text) => {
  ensure(!routes.has(rel), `Duplicate output route: ${rel}`); routes.add(rel);
  const out = path.join(DIST, rel); fs.mkdirSync(path.dirname(out), {recursive:true}); fs.writeFileSync(out,text);
};
// Build into a fresh generated directory only after content validation succeeds.
fs.rmSync(DIST,{recursive:true,force:true}); fs.mkdirSync(DIST,{recursive:true});
fs.cpSync(path.join(SRC,'styles'),path.join(DIST,'assets/css'),{recursive:true});
fs.cpSync(path.join(SRC,'js'),path.join(DIST,'assets/js'),{recursive:true});
write('index.html',layout({title:'Majestic Trunk Expeditions — Victoria Falls',description:'Majestic Trunk Expeditions is your Victoria Falls tour operator, booking partner and trip planner. Arrange activities, accommodation and a personal itinerary.',content:fill(T('home.html'),{
  featuredExperienceCards:list(['guided-falls-tour','gorge-swing','game-drives'].map(slug=>experiences.find(e=>e.slug===slug)),expCard),
  experienceCount:experiences.length,stayCount:lodges.length,activitarUrl:esc(site.activitarUrl),
  heroPhoto:photo('home-hero','Golden light and mist above Victoria Falls',true,true),
  introductionPhoto:photo('helicopter-preview','A helicopter flying above Victoria Falls'),
  stayPhoto:photo('victoria-falls-river-lodge','A private deck at Victoria Falls River Lodge'),
  featuredDiningCards:list(dining.filter(e=>['lookout-cafe','three-monkeys','river-smokehouse'].includes(e.slug)),diningCard),
})}));
write('experiences/index.html',layout({title:'Experiences — Majestic Trunk Expeditions',description:'Explore Victoria Falls activities by interest: the Falls and river, adventure, wildlife, culture and evenings.',content:fill(T('experiences-index.html'),{experiencesHeroPhoto:photo('experiences-banner','Aerial view of Victoria Falls and the upper Zambezi',true,true),experienceCatalogue:experienceCatalogue()})}));
for (const e of experiences) {
  const related = experiences.filter(x=>x.slug!==e.slug).sort((a,b)=>Number(b.group===e.group)-Number(a.group===e.group)).slice(0,3);
  const selfGuided = e.tags.includes('self-guided');
  write(`experiences/${e.slug}.html`,layout({title:`${e.title} — Majestic Trunk Expeditions`,description:e.summary,content:fill(T('experience.html'),{
    title:esc(e.title),summary:esc(e.summary),category:esc(e.category),heroMedia:heroMedia(e),duration:esc(e.duration),difficulty:esc(e.difficulty),bestFor:esc(e.bestFor),
    locationNotice:e.region==='zambia' || e.region==='botswana' ? `<p class="location-notice">${e.region==='zambia' ? 'Zambia' : 'Botswana'} · Cross-border planning required when travelling from Zimbabwe.</p>` : '',
    bodyHtml:paras(e.body),highlightsHtml:items(e.highlights),planningHtml:planning(e.planning),sourcesHtml:sources(e.sources),reviewed:esc(e.reviewed),relatedCards:list(related,expCard),contextualLinks:contextualLinks(e.slug),
    activityActions:e.enquiryOnly ? `<span class="label">Ask about this experience</span><h2>Plan it around your stay.</h2><p>Send your dates and group size so we can check the programme, availability and arrangements with the operator.</p><a class="btn" href="${enquiry(e.title)}">Enquire about this experience ↗</a><p class="note">Availability and inclusions will be confirmed in your quotation.</p>` : selfGuided ? `<span class="label">Explore at your own pace</span><h2>Leave a little time to browse.</h2><p>This is a self-guided idea. Check each gallery’s visiting details directly.</p><a class="btn" href="${enquiry(e.title)}">Ask about your itinerary ↗</a>` : `<span class="label">Plan this activity</span><h2>Make it part of your visit.</h2><p>Ask about your dates, the current programme and a quotation for your group.</p><a class="btn" href="${enquiry(e.title)}">Enquire about this activity ↗</a><a class="text-link" href="${esc(site.activitarUrl)}">Browse online bookings ↗</a><p class="note">Activitar opens our general booking catalogue. Confirm the exact product and current requirements before reserving.</p>`,
  })}));
}
write('stay/index.html',layout({title:'Places to Stay — Majestic Trunk Expeditions',description:'Compare town and garden stays, riverfront hotels and safari lodges around Victoria Falls.',content:fill(T('lodges-index.html'),{directoryHtml:stayCatalogue(),stayHeroPhoto:photo('palm-river-hotel','The pool and riverside gardens at Palm River Hotel',true,true)})}));
for (const l of lodges) {
  const related=lodges.filter(x=>x.slug!==l.slug).sort((a,b)=>Number(b.group===l.group)-Number(a.group===l.group)).slice(0,3);
  write(`stay/${l.slug}.html`,layout({title:`${l.title} — Majestic Trunk Expeditions`,description:l.summary,content:fill(T('lodge.html'),{
    title:esc(l.title),summary:esc(l.summary),category:esc(l.category),heroMedia:heroMedia(l),location:esc(l.location),bestFor:esc(l.bestFor),enquiryUrl:enquiry(l.title),bodyHtml:paras(l.body),highlightsHtml:items(l.highlights),planningHtml:planning(l.planning),sourcesHtml:sources(l.sources),reviewed:esc(l.reviewed),relatedCards:list(related,e=>lodgeCard(e)),featuresHtml:tagsHtml(l),comparisonHtml:`<dl>${[['rooms','Rooms & guests'],['inclusions','Meals & activities'],['transport','Getting around']].map(([key,label])=>`<div><dt>${label}</dt><dd>${esc(l.comparison[key])}</dd></div>`).join('')}</dl>`,contextualLinks:contextualLinks(l.slug),
  })}));
}
write('eat-drink/index.html',layout({title:'Eat & Drink — Majestic Trunk Expeditions',description:'Explore Victoria Falls restaurants, cafés, Zimbabwean cooking, afternoon tea and bars. Find a setting and meal to suit your day.',content:fill(T('dining-index.html'),{directoryHtml:diningCatalogue(),diningHeroPhoto:photo('dining-banner','The riverside dining deck at Baines Restaurant',true,true),eveningCards:[['the-boma-dining','Dinner & drums','A Zimbabwean dinner with an interactive drumming programme.'],['simunye-theatre','Live theatre','Storytelling, puppetry, music and dance at Victoria Falls Theatre.'],['dinner-cruise','Dinner on the river','An upper Zambezi outing followed by dinner on board.']].map(([slug,label,description])=>{const e=experiences.find(e=>e.slug===slug);return `<article class="card dining-evening-card"><a class="card-main" href="/experiences/${e.slug}.html"><figure>${photo(e.media,e.alt)}</figure><div class="card-body"><span class="dining-category">${label}</span><h3>${esc(e.title)}</h3><p class="card-summary">${description}</p><span class="card-link">Explore experience ↗</span></div></a></article>`;}).join('')})}));
for (const v of dining) {
  const related=dining.filter(x=>x.slug!==v.slug).sort((a,b)=>Number(b.group===v.group)-Number(a.group===v.group)).slice(0,3);
  write(`eat-drink/${v.slug}.html`,layout({title:`${v.title} — Eat & Drink — Majestic Trunk`,description:v.summary,content:fill(T('dining.html'),{
    title:esc(v.title),summary:esc(v.summary),category:esc(v.category),heroMedia:heroMedia(v),location:esc(v.location),atmosphere:esc(v.atmosphere),cuisine:esc(v.cuisine),bodyHtml:paras(v.body),highlightsHtml:items(v.highlights),planningHtml:planning(v.planning),sourcesHtml:sources(v.sources),reviewed:esc(v.reviewed),officialUrl:esc(v.officialUrl),mapUrl:esc('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(v.title+' '+v.location+' Victoria Falls Zimbabwe')),relatedCards:list(related,diningCard),relatedStay:v.relatedStay ? `<p class="related-stay"><a class="text-link" href="/stay/${v.relatedStay}.html">Explore the hotel or lodge ↗</a></p>` : '',
  })}));
}
for (const [file,title,description] of [
  ['about.html','About — Majestic Trunk Expeditions','Meet Majestic Trunk Expeditions: a Victoria Falls tour operator, booking partner and trip planner arranging activities, accommodation and itineraries.'],
  ['contact.html','Plan Your Visit — Majestic Trunk Expeditions','Enquire about activities, accommodation and your Victoria Falls itinerary.'],
  ['privacy.html','Privacy Policy — Majestic Trunk Expeditions','How Majestic Trunk Expeditions handles your information.'],
  ['travel-guide.html','Victoria Falls Travel Guide — Majestic Trunk','Seasonal water levels, a suggested three-night itinerary, dining ideas and practical planning.'],
]) write(file,layout({title,description,content:fill(T(file),{activitarUrl:site.activitarUrl})}));
const galleryIds=['home-hero','gorge-swing','zipline','simunye','old-drift-lodge','palm-river-hotel','shongwe-oasis','lookout-cafe','baines-restaurant','cassia-restaurant','river-smokehouse'];
write('gallery.html',layout({title:'Gallery — Majestic Trunk Expeditions',description:'Victoria Falls landscapes, activities, accommodation and dining settings.',content:fill(T('gallery.html'),{galleryHtml:galleryIds.map(id=>`<figure><a href="/assets/img/${media[id].file}">${photo(id,id.replace(/-/g,' '))}</a><figcaption>${esc(id.replace(/-/g,' '))}</figcaption></figure>`).join('')})}));
// Deploy only referenced images; retain source and permission records in src/data/media.json.
fs.cpSync(path.join(SRC,'assets/icons'),DIST,{recursive:true});
fs.mkdirSync(path.join(DIST,'assets/img'),{recursive:true});
fs.copyFileSync(path.join(SRC,'assets/img/logo.svg'),path.join(DIST,'assets/img/logo.svg'));
for (const id of usedMedia) for (const file of [media[id].file,media[id].small]) {
 const out=path.join(DIST,'assets/img',file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(path.join(SRC,'assets/img',file),out);
}
const pageFiles=[...routes].filter(f=>f.endsWith('.html'));
for (const rel of pageFiles) {
 const section=rel.startsWith('experiences/')?'/experiences/':rel.startsWith('stay/')?'/stay/':rel.startsWith('eat-drink/')?'/eat-drink/':`/${rel}`;
 const file=path.join(DIST,rel);let html=read(file);
 html=html.replace(`<a href="${section}">`,`<a href="${section}" aria-current="${section.endsWith('/')&&!rel.endsWith('index.html')?'location':'page'}">`);
 html=html.replace('</head>',`  <link rel="canonical" href="https://majestictrunk.com/${rel.replace(/index\.html$/,'')}">\n</head>`);
 ensure(!/\{\{\w+\}\}/.test(html),`Unresolved template in ${rel}`);fs.writeFileSync(file,html);
}
write('robots.txt','User-agent: *\nAllow: /\nSitemap: https://majestictrunk.com/sitemap.xml\n');
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageFiles.map(f=>`<url><loc>https://majestictrunk.com/${f.replace(/index\.html$/,'')}</loc></url>`).join('')}</urlset>\n`);
// Optional local comparison pages, excluded from navigation and the sitemap.
if (process.argv.includes('--filter-previews')) {
 const original = read(path.join(DIST,'experiences/index.html'));
 for (const [number,label] of [[1,'Minimal text link'],[2,'Quiet utility row']]) {
  const html = original
   .replace('<div data-experience-directory>',`<div data-experience-directory class="filter-preview filter-preview-${number}">`)
   .replace('Explore with Majestic Trunk',`Option ${number} · ${label}`)
   .replace('</head>','<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="/assets/css/filter-previews.css"></head>');
  write(`previews/filters-${number}.html`,html);
 }
 console.log('Filter comparisons: /previews/filters-1.html and /previews/filters-2.html');
}
console.log(`✓ built ${pageFiles.length} pages · ${experiences.length} experiences · ${lodges.length} stays · ${dining.length} dining venues · ${usedMedia.size} photos → dist/`);
