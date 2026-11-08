const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/js/stays.js','utf8');
function node(attrs={}) {
 return {attrs,hidden:false,listeners:{},getAttribute(k){return this.attrs[k]??null;},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.listeners[k]=f;},focus(){this.focused=true;},fire(k){this.listeners[k]({});}};
}
function fixture(initial='') {
 const data=JSON.parse(fs.readFileSync('src/data/lodges.json','utf8'));
 const cards=data.map(e=>Object.assign(node({'data-setting':e.group,'data-type':e.propertyType,'data-tags':e.tags.join(' ')}),{slug:e.slug}));
 const controls=Object.fromEntries(Object.entries({setting:['town-gardens','riverfront','safari'],type:['hotel','resort','lodge','villa'],preference:['adults-only','family-rooms','spa','accessible-rooms','safari-activities','self-catering','camping']}).map(([key,values])=>[key,Object.assign(node(),{value:'all',options:['all',...values].map(value=>({value}))})]));
 const filters=node(),toggle=node(),results=node(),empty=node(),reset=node(),emptyReset=node();
 const selectors={'[data-catalogue-filters]':filters,'[data-toggle-stays]':toggle,'[data-stay-results]':results,'[data-stay-empty]':empty};
 for(const [key,control] of Object.entries(controls))selectors[`[data-${key}-filter]`]=control;
 const catalogue={querySelector(s){return selectors[s];},querySelectorAll(s){return s==='[data-stay]'?cards:[reset,emptyReset];}};
 let url=new URL('https://example.test/stay/'+initial);const handlers={};
 const window={get location(){return url;},history:{pushState(_a,_b,next){url=new URL(next,url);}},addEventListener(k,f){handlers[k]=f;}};
 vm.runInNewContext(source,{document:{querySelector(s){return s==='[data-stay-directory]'?catalogue:null;}},window,URL,URLSearchParams});
 return {data,cards,controls,filters,toggle,results,empty,reset,emptyReset,window,
  choose(key,value){controls[key].value=value;controls[key].fire('change');},
  visible(){return cards.filter(c=>!c.hidden).map(c=>c.slug);},
  restore(next){url=new URL(next,url);handlers.popstate();}
 };
}
test('stays show all properties with filters collapsed and a quiet result count',()=>{
 const f=fixture();assert.equal(f.visible().length,f.data.length);assert.equal(f.results.textContent,`${f.data.length} places to stay`);assert.equal(f.filters.hidden,true);assert.equal(f.toggle.hidden,false);assert.equal(f.reset.hidden,true);
});
test('stay setting, property type and preference combine and produce a shareable URL',()=>{
 const f=fixture();f.choose('setting','riverfront');f.choose('type','hotel');f.choose('preference','family-rooms');
 assert.deepEqual(f.visible(),['palm-river-hotel']);assert.equal(f.results.textContent,`1 of ${f.data.length} places to stay`);assert.equal(f.window.location.search,'?group=riverfront&type=hotel&preference=family-rooms');
});
test('adults-only, accessible room options and resort type remain distinct',()=>{
 const f=fixture();f.choose('preference','adults-only');assert.deepEqual(f.visible(),['shongwe-oasis']);
 f.choose('preference','accessible-rooms');assert.deepEqual(f.visible(),['inkosi-lodge','stanley-and-livingstone']);
 f.choose('preference','all');f.choose('type','resort');assert.deepEqual(f.visible(),['a-zambezi-river-lodge','elephant-hills-resort']);
});
test('an empty stay result can reset all filters and restore focus',()=>{
 const f=fixture();f.toggle.fire('click');f.choose('setting','riverfront');f.choose('preference','adults-only');assert.equal(f.empty.hidden,false);
 f.emptyReset.fire('click');assert.equal(f.visible().length,f.data.length);assert.equal(f.empty.hidden,true);assert.equal(f.controls.setting.focused,true);assert.equal(f.window.location.search,'');
});
test('stay links restore legacy preferences, category anchors and browser navigation',()=>{
 const f=fixture('?group=town-gardens&preference=adults-only');assert.deepEqual(f.visible(),['shongwe-oasis']);assert.equal(f.filters.hidden,true);
 f.restore('/stay/#group-riverfront');assert.deepEqual(f.visible(),['palm-river-hotel','a-zambezi-river-lodge']);
 f.restore('/stay/?group=riverfront&type=hotel&preference=spa');assert.deepEqual(f.visible(),['palm-river-hotel']);
 f.restore('/stay/?group=invalid&type=invalid&preference=invalid');assert.equal(f.visible().length,f.data.length);
});
test('closing stay filters preserves selections and clearing while collapsed keeps focus visible',()=>{
 const f=fixture('?preference=adults-only');f.toggle.fire('click');assert.equal(f.filters.hidden,false);assert.equal(f.toggle.attrs['aria-expanded'],'true');
 f.filters.listeners.keydown({key:'Escape'});assert.equal(f.filters.hidden,true);assert.equal(f.toggle.attrs['aria-expanded'],'false');assert.deepEqual(f.visible(),['shongwe-oasis']);
 f.reset.fire('click');assert.equal(f.toggle.focused,true);assert.equal(f.reset.hidden,true);assert.equal(f.visible().length,f.data.length);
});

test('expanded stays include distinct self-catering and camping choices',()=>{
 const f=fixture();f.choose('preference','self-catering');assert.deepEqual(f.visible(),['lokuthula-lodges','miombo-mews']);
 f.choose('type','lodge');f.choose('setting','safari');assert.deepEqual(f.visible(),['lokuthula-lodges']);
 f.reset.fire('click');f.choose('preference','camping');assert.deepEqual(f.visible(),['shearwater-explorers-village','n1-hotel']);
 f.choose('type','hotel');assert.deepEqual(f.visible(),['n1-hotel']);
});
