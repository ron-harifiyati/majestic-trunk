const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('src/js/directory.js','utf8');

function node(attrs = {}) {
  return {attrs, hidden:false, listeners:{}, textContent:'',
    getAttribute(k){return this.attrs[k] ?? null;},
    setAttribute(k,v){this.attrs[k]=v;}, removeAttribute(k){delete this.attrs[k];},
    addEventListener(k,f){this.listeners[k]=f;}, focus(){this.focused=true;},
    fire(k){this.listeners[k]({preventDefault(){}});},
  };
}
function fixture(dataFile, prefOptions, initial = '') {
  const data=JSON.parse(fs.readFileSync(dataFile,'utf8'));
  const groupNames=[...new Set(data.map(e=>e.group))];
  const allCards=data.map(e=>({...node({'data-tags':[...e.tags,e.region||''].filter(Boolean).join(' ')}),slug:e.slug}));
  const sections=groupNames.map(group=>{
    const section=node({'data-group':group});
    section.querySelectorAll=()=>allCards.filter((c,i)=>data[i].group===group);
    return section;
  });
  const links=['all',...groupNames].map(group=>node({'data-group-link':group}));
  const facet=node();facet.value='all';facet.options=['all',...prefOptions].map(value=>({value}));
  const filters=node(), results=node(),empty=node(),reset=node(),emptyReset=node();
  empty.contains=button=>button===emptyReset;
  const directory={querySelectorAll(selector){return {'[data-group]':sections,'[data-group-link]':links,'[data-card]':allCards,'[data-reset]':[reset,emptyReset]}[selector];},querySelector(selector){return {'[data-facet]':facet,'.directory-filters':filters,'[data-results]':results,'[data-empty]':empty}[selector];}};
  let url=new URL('https://example.test/experiences/'+initial);
  const handlers={};
  const window={get location(){return url;},history:{pushState(_state,_title,next){url=new URL(next,url);}},addEventListener(k,f){handlers[k]=f;}};
  vm.runInNewContext(source,{document:{querySelectorAll:()=>[directory]},window,URL,URLSearchParams});
  return {data,allCards,sections,links,facet,filters,results,empty,reset,emptyReset,window,
    click(group){links.find(l=>l.attrs['data-group-link']===group).fire('click');},
    choose(value){facet.value=value;facet.fire('change');},
    restore(path){url=new URL(path,url);handlers.popstate();},
    visible(){return allCards.filter(c=>!c.hidden).map(c=>c.slug);},
  };
}
test('accommodation preferences distinguish adults-only and family-room listings',()=>{
 const f=fixture('src/data/lodges.json',['adults-only','family-rooms','spa','accessible-rooms','safari-activities']);
 f.choose('adults-only');assert.deepEqual(f.visible(),['shongwe-oasis']);
 f.choose('family-rooms');assert.ok(!f.visible().includes('shongwe-oasis'));assert.ok(f.visible().includes('inkosi-lodge'));
});
test('dining atmosphere filters and hotel setting work together',()=>{
 const f=fixture('src/data/dining.json',['views','high-tea','hotel-dining','live-music']);
 f.click('with-a-view');f.choose('high-tea');assert.deepEqual(f.visible(),['stanleys-terrace']);
});
