const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/js/experiences.js','utf8');
function el(tagName,attrs={}){
 return {tagName,attrs,hidden:false,listeners:{},textContent:'',style:{setProperty(){}},getAttribute(k){return this.attrs[k]??null;},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(k,f){this.listeners[k]=f;},focus(){this.focused=true;},fire(k){this.listeners[k]({preventDefault(){}});}};
}
function fixture(initial='',wide=true){
 const data=JSON.parse(fs.readFileSync('src/data/experiences.json'));
 const cards=data.map(e=>Object.assign(el('ARTICLE',{'data-category':e.group,'data-location':e.region,'data-time':e.timeCategory}),{slug:e.slug}));
 const categoryControl=el('SELECT');categoryControl.options=['all','falls-river','adventure','wildlife','culture'].map(value=>({value}));categoryControl.value='all';
 const location=el('SELECT'),time=el('SELECT');
 location.options=['all','zimbabwe','zambia','botswana'].map(value=>({value}));location.value='all';
 time.options=['all','short','half-day','full-day','evening','confirm'].map(value=>({value}));time.value='all';
 const results=el('P'),empty=el('DIV'),filters=el('DIV'),toggle=el('BUTTON'),reset=el('BUTTON'),emptyReset=el('BUTTON');
 empty.contains=button=>button===emptyReset;
 const catalogue={querySelectorAll(selector){return {'[data-experience]':cards,'[data-clear-experiences]':[reset,emptyReset]}[selector];},querySelector(selector){return {'[data-category-filter]':categoryControl,'[data-location-filter]':location,'[data-time-filter]':time,'[data-experience-results]':results,'[data-experience-empty]':empty,'[data-catalogue-filters]':filters,'[data-toggle-experiences]':toggle}[selector];}};
 let url=new URL('https://example.test/experiences/'+initial);const handlers={};
 const media={matches:wide,addEventListener(k,f){this.listener=f;}};
 const window={get location(){return url;},history:{pushState(_a,_b,next){url=new URL(next,url);}},addEventListener(k,f){handlers[k]=f;},matchMedia(){return media;}};
 const document={querySelector(selector){return selector==='[data-experience-directory]'?catalogue:null;}};
 vm.runInNewContext(source,{window,document,URL,URLSearchParams});
 return {data,cards,categoryControl,location,time,results,empty,filters,toggle,reset,emptyReset,window,media,
  category(id){if(filters.hidden)toggle.fire('click');categoryControl.value=id;categoryControl.fire('change');},
  chooseLocation(value){if(filters.hidden)toggle.fire('click');location.value=value;location.fire('change');},
  chooseTime(value){if(filters.hidden)toggle.fire('click');time.value=value;time.fire('change');},
  restore(next){url=new URL(next,url);handlers.popstate();},
  visible(){return cards.filter(c=>!c.hidden).map(c=>c.slug);},
 };
}
test('catalogue shows every experience with the filters collapsed by default',()=>{
 const f=fixture();assert.equal(f.visible().length,f.data.length);assert.equal(f.results.textContent,`${f.data.length} experiences`);assert.equal(f.filters.hidden,true);assert.equal(f.categoryControl.value,'all');
});
test('category, location and time combine without leaving grid holes',()=>{
 const f=fixture();f.category('wildlife');f.chooseLocation('botswana');f.chooseTime('full-day');
 assert.deepEqual(f.visible(),['chobe-day-trip']);assert.equal(f.results.textContent,`1 of ${f.data.length} experiences`);
 assert.equal(f.window.location.search,'?group=wildlife&location=botswana&time=full-day');
});
test('empty results reset all controls and return focus to a visible control',()=>{
 const f=fixture();f.category('falls-river');f.chooseLocation('botswana');assert.equal(f.empty.hidden,false);
 f.emptyReset.fire('click');assert.equal(f.visible().length,f.data.length);assert.equal(f.empty.hidden,true);assert.equal(f.location.value,'all');assert.equal(f.time.value,'all');assert.equal(f.window.location.search,'');assert.equal(f.categoryControl.focused,true);
});
test('saved URL and browser navigation restore every filter',()=>{
 const f=fixture('?group=wildlife&location=botswana&time=full-day');assert.deepEqual(f.visible(),['chobe-day-trip']);
 f.restore('/experiences/?group=culture&time=evening');assert.deepEqual(f.visible(),['the-boma-dining','simunye-theatre']);
 f.restore('/experiences/');assert.equal(f.visible().length,f.data.length);
});
test('old country-filter URLs and category anchors remain usable',()=>{
 const old=fixture('?group=adventure&preference=zambia');assert.deepEqual(old.visible(),['livingstone-island-devils-pool']);
 old.chooseTime('confirm');assert.equal(old.window.location.search,'?group=adventure&location=zambia&time=confirm');
 const anchored=fixture('#group-culture');assert.deepEqual(anchored.visible(),anchored.data.filter(e=>e.group==='culture').map(e=>e.slug));
});
test('invalid URL values fall back to all options',()=>{
 const f=fixture('?group=invalid&location=invalid&time=invalid');assert.equal(f.visible().length,f.data.length);assert.equal(f.categoryControl.value,'all');
});
test('variable-duration programmes have their own explicit filter',()=>{
 const f=fixture();f.chooseTime('confirm');assert.deepEqual(f.visible(),['elephant-encounter','livingstone-island-devils-pool','flying-fox','cultural-connection']);
});
test('three dropdowns retain selected values when restoring a shared link',()=>{
 const f=fixture('?group=adventure&location=zambia&time=confirm',false);
 assert.equal(f.filters.hidden,true);assert.equal(f.categoryControl.value,'adventure');assert.equal(f.location.value,'zambia');assert.equal(f.time.value,'confirm');assert.deepEqual(f.visible(),['livingstone-island-devils-pool']);
 f.restore('/experiences/?group=culture&time=evening');assert.equal(f.categoryControl.value,'culture');assert.equal(f.location.value,'all');assert.equal(f.time.value,'evening');
});
test('filter state is tracked and clear is shown only when filtering',()=>{
 const f=fixture();assert.equal(f.reset.hidden,true);assert.equal(f.location.attrs['data-active'],'false');
 f.chooseLocation('zambia');assert.equal(f.reset.hidden,false);assert.equal(f.location.attrs['data-active'],'true');assert.equal(f.time.attrs['data-active'],'false');
 f.reset.fire('click');assert.equal(f.reset.hidden,true);assert.equal(f.location.attrs['data-active'],'false');assert.equal(f.categoryControl.focused,true);
});
test('active filter presentation also follows shared URLs and browser navigation',()=>{
 const f=fixture('?group=culture&time=evening');assert.equal(f.reset.hidden,false);assert.equal(f.categoryControl.attrs['data-active'],'true');assert.equal(f.time.attrs['data-active'],'true');
 f.restore('/experiences/');assert.equal(f.reset.hidden,true);assert.equal(f.categoryControl.attrs['data-active'],'false');assert.equal(f.time.attrs['data-active'],'false');
});

test('filter disclosure opens and closes without resetting selections',()=>{
 const f=fixture('?location=zambia');assert.equal(f.filters.hidden,true);assert.equal(f.toggle.hidden,false);assert.equal(f.toggle.attrs['aria-expanded'],'false');
 f.toggle.fire('click');assert.equal(f.filters.hidden,false);assert.equal(f.toggle.attrs['aria-expanded'],'true');
 f.filters.listeners.keydown({key:'Escape'});assert.equal(f.filters.hidden,true);assert.equal(f.toggle.attrs['aria-expanded'],'false');assert.equal(f.toggle.focused,true);assert.equal(f.location.value,'zambia');
 f.toggle.fire('click');assert.equal(f.location.value,'zambia');assert.deepEqual(f.visible(),['livingstone-island-devils-pool']);
});
test('clearing filters while collapsed returns focus to the visible disclosure button',()=>{
 const f=fixture('?location=zambia');f.reset.fire('click');assert.equal(f.visible().length,f.data.length);assert.equal(f.filters.hidden,true);assert.equal(f.toggle.focused,true);
});
