const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/js/dining.js','utf8');
function node(attrs={}) {
 return {attrs,hidden:false,listeners:{},getAttribute(k){return this.attrs[k]??null;},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,f){this.listeners[k]=f;},focus(){this.focused=true;},fire(k){this.listeners[k]({});}};
}
function fixture(initial='') {
 const data=JSON.parse(fs.readFileSync('src/data/dining.json','utf8'));
 const cards=data.map(e=>Object.assign(node({'data-category':e.group,'data-meals':e.meals.join(' '),'data-tags':e.tags.join(' ')}),{slug:e.slug}));
 const controls=Object.fromEntries(Object.entries({category:['with-a-view','casual','evenings'],meal:['breakfast','coffee','lunch','dinner','tea','drinks'],preference:['views','high-tea','local-food','craft-drinks','hotel-dining','live-music']}).map(([key,values])=>[key,Object.assign(node(),{value:'all',options:['all',...values].map(value=>({value}))})]));
 const filters=node(),toggle=node(),results=node(),empty=node(),reset=node(),emptyReset=node();
 const selectors={'[data-catalogue-filters]':filters,'[data-toggle-dining]':toggle,'[data-dining-results]':results,'[data-dining-empty]':empty};
 for(const [key,control] of Object.entries(controls))selectors[`[data-${key}-filter]`]=control;
 const catalogue={querySelector(s){return selectors[s];},querySelectorAll(s){return s==='[data-dining]'?cards:[reset,emptyReset];}};
 let url=new URL('https://example.test/eat-drink/'+initial);const handlers={};
 const window={get location(){return url;},history:{pushState(_a,_b,next){url=new URL(next,url);}},addEventListener(k,f){handlers[k]=f;}};
 vm.runInNewContext(source,{document:{querySelector(s){return s==='[data-dining-directory]'?catalogue:null;}},window,URL,URLSearchParams});
 return {data,cards,controls,filters,toggle,results,empty,reset,emptyReset,window,
  choose(key,value){controls[key].value=value;controls[key].fire('change');},
  visible(){return cards.filter(c=>!c.hidden).map(c=>c.slug);},
  restore(next){url=new URL(next,url);handlers.popstate();}
 };
}

test('dining starts with every venue visible and controls collapsed',()=>{
 const f=fixture();assert.equal(f.visible().length,f.data.length);assert.equal(f.filters.hidden,true);assert.equal(f.toggle.hidden,false);assert.equal(f.reset.hidden,true);assert.equal(f.results.textContent,`${f.data.length} places to eat & drink`);
});
test('category, visit and preference combine across multiple services',()=>{
 const f=fixture();f.choose('category','evenings');f.choose('meal','drinks');f.choose('preference','craft-drinks');assert.deepEqual(f.visible(),['river-smokehouse','victoria-falls-distillery']);
 f.choose('meal','dinner');assert.deepEqual(f.visible(),['river-smokehouse']);assert.equal(f.window.location.search,'?group=evenings&meal=dinner&preference=craft-drinks');
});
test('coffee and dinner-only venues are distinguished',()=>{
 const f=fixture();f.choose('meal','coffee');assert.ok(f.visible().includes('victoria-falls-coffee'));assert.ok(!f.visible().includes('livingstone-room'));
 f.choose('meal','dinner');assert.ok(f.visible().includes('livingstone-room'));assert.ok(!f.visible().includes('victoria-falls-coffee'));assert.ok(!f.visible().includes('rainforest-cafe'));
});
test('an empty dining selection can reset the grid and move focus to a visible control',()=>{
 const f=fixture();f.toggle.fire('click');f.choose('category','with-a-view');f.choose('preference','craft-drinks');assert.equal(f.empty.hidden,false);f.emptyReset.fire('click');assert.equal(f.visible().length,f.data.length);assert.equal(f.controls.category.focused,true);assert.equal(f.window.location.search,'');
});
test('legacy category and preference links, anchors and browser navigation work',()=>{
 const f=fixture('?group=with-a-view&preference=high-tea');assert.deepEqual(f.visible(),['stanleys-terrace']);assert.equal(f.filters.hidden,true);
 f.restore('/eat-drink/#group-evenings');assert.deepEqual(f.visible(),['river-smokehouse','victoria-falls-distillery','shoestrings-bar']);
 f.restore('/eat-drink/?group=casual&meal=dinner&preference=local-food');assert.deepEqual(f.visible(),['goat-mama-africa','zulu-bistro','dusty-road']);
 f.restore('/eat-drink/?group=bad&meal=bad&preference=bad');assert.equal(f.visible().length,f.data.length);
});
test('Escape preserves dining selections and a collapsed reset leaves focus visible',()=>{
 const f=fixture('?preference=high-tea');f.toggle.fire('click');f.filters.listeners.keydown({key:'Escape'});assert.equal(f.filters.hidden,true);assert.equal(f.toggle.attrs['aria-expanded'],'false');assert.deepEqual(f.visible(),['stanleys-terrace']);f.reset.fire('click');assert.equal(f.visible().length,f.data.length);assert.equal(f.toggle.focused,true);assert.equal(f.reset.hidden,true);
});
