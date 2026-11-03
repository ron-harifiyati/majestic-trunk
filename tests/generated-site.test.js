const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
execFileSync(process.execPath,['build.js']);
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const pages=walk('dist').filter(f=>f.endsWith('.html'));
const entities=s=>s.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
test('all records produce routes and category counts match content',()=>{
 const expected=10+['experiences','lodges','dining'].reduce((sum,name)=>sum+JSON.parse(fs.readFileSync(`src/data/${name}.json`)).length,0);
 assert.equal(pages.length,expected);
 for(const [dataFile,route] of [['experiences','experiences'],['lodges','stay'],['dining','eat-drink']]){
  const entries=JSON.parse(fs.readFileSync(`src/data/${dataFile}.json`));
  const index=fs.readFileSync(`dist/${route}/index.html`,'utf8');
  assert.equal((index.match(/data-card /g)||[]).length,entries.length);
  for(const e of entries)assert.ok(fs.existsSync(`dist/${route}/${e.slug}.html`));
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
test('source attribution and sitemap cover the generated output',()=>{
 const credits=fs.readFileSync('dist/photo-credits.html','utf8');
 assert.ok(credits.includes('Doc James'));assert.ok(credits.includes('Peter in s'));assert.ok(credits.includes('https://creativecommons.org/licenses/by-sa/4.0/'));
 assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length,pages.length);
});
