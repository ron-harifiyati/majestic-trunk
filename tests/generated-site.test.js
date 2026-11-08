const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,['build.js']);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const htmlFiles=walk('dist').filter(f=>f.endsWith('.html'));
const pages=htmlFiles.filter(f=>!fs.readFileSync(f,'utf8').includes('data-legacy-redirect'));
const legacyPages=htmlFiles.filter(f=>!pages.includes(f));
const entities=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
test('all records produce routes and category counts match content',()=>{
 const expected=10+['experiences','lodges','dining'].reduce((sum,name)=>sum+JSON.parse(fs.readFileSync(`src/data/${name}.json`)).length,0);
 assert.equal(pages.length,expected);
 for(const [dataFile,route] of [['experiences','experiences'],['lodges','stay'],['dining','eat-drink']]){
  const entries=JSON.parse(fs.readFileSync(`src/data/${dataFile}.json`));
  const index=fs.readFileSync(`dist/${route}/index.html`,'utf8');
  assert.equal((index.match(/data-card /g)||[]).length,entries.length);
  for(const e of entries)assert.ok(fs.existsSync(`dist/${route}/${e.slug}/index.html`));
 }
});
test('generated local links, anchors, images and responsive image variants exist',()=>{
 let checked=0;
 for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
   const ref=entities(match[1]);if(/^(https?:|mailto:|tel:)/.test(ref))continue;
   const u=new URL(ref,'https://local.test/'+path.relative('dist',file));
   let target=path.join('dist',decodeURIComponent(u.pathname));
   if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
   assert.ok(fs.existsSync(target),`${file}: missing ${ref}`);
   if(u.hash)assert.ok(fs.readFileSync(target,'utf8').includes(`id="${decodeURIComponent(u.hash.slice(1))}"`),`${file}: missing anchor ${ref}`);
   checked++;
  }
  for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(','))assert.ok(fs.existsSync(path.join('dist',candidate.trim().split(/\s+/)[0])));
 }
 assert.ok(checked>1000);
});
test('each page has one heading, one canonical and no unresolved template values',()=>{
 for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,file);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,file);
  assert.ok(!/\{\{\w+\}\}/.test(html),file);
  for(const tag of html.matchAll(/<img\b[^>]*>/g)){
   assert.match(tag[0],/alt="[^"]+"/,file);
   if(!tag[0].includes('brand-logo')){assert.match(tag[0],/width="\d+"/,file);assert.match(tag[0],/height="\d+"/,file);}
  }
 }
});
test('known unsuitable source images are excluded from deployment output',()=>{
 for(const file of ['elephant.jpg','elephant-encounter.jpg','zambezi-aerial.jpg'])assert.ok(!fs.existsSync('dist/assets/img/'+file));
});
test('removed credits page and attribution-dependent images are excluded from output',()=>{
 assert.ok(!fs.existsSync('dist/photo-credits.html'));
 for(const file of ['falls.jpg','falls-600.jpg','cruise.jpg','cruise-600.jpg'])assert.ok(!fs.existsSync('dist/assets/img/online/'+file));
 for(const file of pages)assert.ok(!fs.readFileSync(file,'utf8').includes('photo-credits.html'),file);
 assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length,pages.length);
});
test('Experiences uses a distinct hero, three dropdowns and a photo for every listing',()=>{
 const index=fs.readFileSync('dist/experiences/index.html','utf8');
 const home=fs.readFileSync('dist/index.html','utf8');
 const hero=html=>html.match(/class="hero-backdrop">\s*<img src="([^"]+)"/)[1];
 assert.notEqual(hero(index),hero(home));
 assert.equal((index.match(/<select\b/g)||[]).length,3);
 assert.ok(index.indexOf('id="experience-location"')<index.indexOf('id="experience-time"'));
 assert.ok(index.indexOf('id="experience-time"')<index.indexOf('id="experience-category"'));
 assert.ok(!index.includes('aria-label="Experience categories"'));
 const cards=[...index.matchAll(/<article\b[^>]*data-experience\s[^>]*>[\s\S]*?<\/article>/g)];
 assert.equal(cards.length,JSON.parse(fs.readFileSync('src/data/experiences.json','utf8')).length);
 for(const match of cards)assert.match(match[0],/<figure><img /);
});
test('stay catalogue has a photo hero, three filters and consistent linked property cards',()=>{
 const index=fs.readFileSync('dist/stay/index.html','utf8');
 const lodges=JSON.parse(fs.readFileSync('src/data/lodges.json','utf8'));
 assert.match(index,/class="photo-hero stays-hero"/);
 assert.match(index,/src="\/assets\/js\/stays.js"/);
 assert.equal((index.match(/<select\b/g)||[]).length,3);
 assert.equal((index.match(/class="grid grid-3 stay-grid"/g)||[]).length,1);
 assert.ok(!index.includes('class="directory-group"'));
 for(const lodge of lodges){
  const html=fs.readFileSync(`dist/stay/${lodge.slug}/index.html`,'utf8');
  assert.match(html,/Rooms &amp; arrangements/);
  assert.match(html,/Meals & activities/);
  assert.match(html,/Getting around/);
  assert.ok(!/<\d/.test(html),'Related cards must use real heading elements');
 }
});
test('Eat and Drink has one photographic catalogue and complete venue details',()=>{
 const index=fs.readFileSync('dist/eat-drink/index.html','utf8');
 const venues=JSON.parse(fs.readFileSync('src/data/dining.json','utf8'));
 assert.match(index,/class="photo-hero dining-hero"/);
 assert.match(index,/src="\/assets\/js\/dining.js"/);
 assert.equal((index.match(/<select\b/g)||[]).length,3);
 assert.equal((index.match(/class="grid grid-3 dining-grid"/g)||[]).length,1);
 assert.ok(!index.includes('class="directory-group"'));
 for(const venue of venues){
  assert.ok(venue.media && venue.alt);
  const html=fs.readFileSync(`dist/eat-drink/${venue.slug}/index.html`,'utf8');
  assert.match(html,/What to expect/);assert.match(html,/Plan your visit/);
  assert.ok(html.includes(venue.officialUrl.replace(/&/g,'&amp;')));
 }
 assert.match(fs.readFileSync('dist/eat-drink/cassia-restaurant/index.html','utf8'),/href="\/stay\/ilala-lodge\/"/);
});

test('public links, canonical URLs and sitemap entries use clean directory URLs',()=>{
 for(const file of pages){
  const html=fs.readFileSync(file,'utf8');
  for(const match of html.matchAll(/href="([^"]+)"/g)){
   const ref=entities(match[1]);if(!ref.startsWith('/'))continue;
   assert.ok(!new URL(ref,'https://local.test').pathname.endsWith('.html'),`${file}: legacy public link ${ref}`);
  }
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.ok(new URL(canonical).pathname.endsWith('/'),file);
 }
 assert.ok(!fs.readFileSync('dist/sitemap.xml','utf8').includes('.html'));
 const home=fs.readFileSync('dist/index.html','utf8');
 assert.match(home,/href="\/travel-guide\/"/);
 assert.match(fs.readFileSync('dist/travel-guide/index.html','utf8'),/href="\/travel-guide\/" aria-current="page"/);
 assert.match(fs.readFileSync('dist/experiences/sunset-cruise/index.html','utf8'),/href="\/experiences\/" aria-current="location"/);
});
test('legacy HTML addresses lead to real clean pages and preserve enquiry and section state',()=>{
 const vm=require('node:vm');
 assert.equal(legacyPages.length,pages.length-4);
 for(const file of legacyPages){
  const html=fs.readFileSync(file,'utf8');assert.match(html,/name="robots" content="noindex, follow"/);assert.match(html,/<noscript><meta http-equiv="refresh"/);
  const target=new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]).pathname;
  assert.ok(fs.existsSync(path.join('dist',target,'index.html')));
  let destination;
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],{window:{location:{search:'?interest=Sunset%20cruise',hash:'#seasons',replace(next){destination=next;}}}});
  assert.equal(destination,target+'?interest=Sunset%20cruise#seasons');
 }
 const rules=fs.readFileSync('dist/_redirects','utf8');
 assert.ok(rules.includes('/travel-guide.html /travel-guide/ 301'));
 assert.ok(rules.includes('/experiences/sunset-cruise.html /experiences/sunset-cruise/ 301'));
});
test('experience detail enquiries preserve the selected activity and visitor-only wording',()=>{
 const experiences=JSON.parse(fs.readFileSync('src/data/experiences.json','utf8'));
 for(const e of experiences){
  const html=fs.readFileSync(`dist/experiences/${e.slug}/index.html`,'utf8');
  const panel=html.match(/<aside class="booking-aside experience-enquiry-panel"[^>]*>([\s\S]*?)<\/aside>/)[1];
  const mobile=html.match(/<div class="experience-mobile-action">([\s\S]*?)<\/div>/)[1];
  for(const fragment of [panel,mobile]){
   const url=new URL(entities(fragment.match(/class="btn" href="([^"]+)"/)[1]),'https://local.test');
   assert.equal(url.pathname,'/contact/');assert.equal(url.searchParams.get('interest'),e.title);
  }
  assert.ok(!panel.includes('activitar.com'),'Do not substitute a general catalogue for the selected product');
  assert.ok(html.indexOf('experience-mobile-action')<html.indexOf('id="experience-details"'));
  assert.equal((html.match(/class="card experience-related-card"/g)||[]).length,2);
  assert.equal(html.includes('Cross-border from Zimbabwe'),e.region!=='zimbabwe');
  assert.equal(html.includes('Seasonal · confirm dates'),e.tags.includes('seasonal'));
  if(e.tags.includes('self-guided'))assert.ok(panel.includes('Ask about your itinerary'));
  if(e.slug==='vulture-culture')assert.ok(panel.includes('Ask about visiting'));
 }
});
test('stay and dining detail actions keep the correct property or venue destination',()=>{
 for(const [dataFile,route,panelClass] of [['lodges','stay','stay-enquiry-panel'],['dining','eat-drink','dining-visit-panel']]){
  const entries=JSON.parse(fs.readFileSync(`src/data/${dataFile}.json`,'utf8'));
  for(const entry of entries){
   const html=fs.readFileSync(`dist/${route}/${entry.slug}/index.html`,'utf8');
   const mobile=html.match(/<div class="experience-mobile-action">([\s\S]*?)<\/div>/)[1];
   const panel=html.match(new RegExp(`<aside class="[^\"]*${panelClass}"[^>]*>([\\s\\S]*?)<\\/aside>`))[1];
   for(const fragment of [mobile,panel]){
    const url=new URL(entities(fragment.match(/class="btn" href="([^\"]+)"/)[1]),'https://local.test');
    if(route==='stay'){
     assert.equal(url.pathname,'/contact/');assert.equal(url.searchParams.get('interest'),entry.title);
    }else{
     assert.equal(url.href,new URL(entry.officialUrl).href);
     const map=new URL(entities(fragment.match(/href="([^\"]+)">Find it on the map/)[1]));
     assert.ok(map.searchParams.get('query').startsWith(entry.title));
    }
   }
   const recommendations=[...html.matchAll(/<article class="card experience-related-card">([\s\S]*?)<\/article>/g)];
   assert.equal(recommendations.length,2);
   const destinations=recommendations.map(([,card])=>{
    assert.ok(!card.includes('<p'),'Recommendations should remain compact');
    const href=card.match(/href="([^\"]+)"/)[1];
    assert.notEqual(href,`/${route}/${entry.slug}/`);
    return href;
   });
   assert.equal(new Set(destinations).size,2);
  }
 }
});
test('trip planner contains every listing and public booking links stay on the site',()=>{
 const html=fs.readFileSync('dist/plan-your-trip/index.html','utf8');
 const all=[['experiences','experiences'],['lodges','stay'],['dining','eat-drink']];
 let count=0;
 for(const [file,route] of all){
  const entries=JSON.parse(fs.readFileSync(`src/data/${file}.json`));count+=entries.length;
  for(const entry of entries){
   assert.ok(html.includes(`data-trip-option="${route}/${entry.slug}"`));
   const detail=fs.readFileSync(`dist/${route}/${entry.slug}/index.html`,'utf8');
   assert.ok(detail.includes(`data-trip-add="${route}/${entry.slug}"`));
  }
  const index=fs.readFileSync(`dist/${route}/index.html`,'utf8');
  assert.equal((index.match(/data-trip-add=/g)||[]).length,entries.length);
 }
 assert.equal((html.match(/data-trip-option=/g)||[]).length,count);
 for(const file of pages){
  const page=fs.readFileSync(file,'utf8');
  const navigation=page.match(/<header class="site-header">[\s\S]*?<\/header>/)[0]+page.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];
  assert.ok(!navigation.includes('activitar.com'),file);
 }
 assert.ok(!fs.readFileSync('dist/index.html','utf8').includes('activitar.com'));
});
