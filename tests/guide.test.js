const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(compact=true){
 const positions=[200,800,1400,2000,2600,3200];
 const links=positions.map((_,i)=>({attrs:{href:'#section-'+i},offsetLeft:i*160,offsetWidth:160,getAttribute(k){return this.attrs[k];},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];}}));
 const sections=positions.map((_,i)=>({getBoundingClientRect(){return {top:positions[i]};}}));
 const nav={offsetLeft:0,clientWidth:320,querySelectorAll(){return links;},getBoundingClientRect(){return {height:60};},scrollTo(value){this.scrolled=value;}};
 const handlers={},properties={};
 const document={querySelector(s){return s==='.guide-nav'?nav:{getBoundingClientRect(){return {height:76};}};},getElementById(id){return sections[Number(id.slice(8))];},documentElement:{style:{setProperty(k,v){properties[k]=v;}}}};
 const window={matchMedia(){return {matches:compact};},addEventListener(k,f){handlers[k]=f;},requestAnimationFrame(f){f();}};
 vm.runInNewContext(fs.readFileSync('src/js/guide.js','utf8'),{document,window});
 return {positions,links,nav,handlers,properties};
}
test('guide follows reading position in both directions and keeps the mobile chapter visible',()=>{
 const f=fixture();
 assert.equal(f.links[0].attrs['aria-current'],'location');
 f.positions[0]=-700;f.positions[1]=-100;f.positions[2]=150;
 f.handlers.scroll();
 assert.equal(f.links[2].attrs['aria-current'],'location');
 assert.equal(f.links[0].attrs['aria-current'],undefined);
 assert.equal(f.nav.scrolled.left,240);
 assert.equal(f.properties['--guide-scroll-offset'],'160px');
 f.positions[1]=400;f.positions[2]=1000;f.handlers.scroll();
 assert.equal(f.links[0].attrs['aria-current'],'location');
});
test('desktop guide uses header offset without scrolling sidebar navigation',()=>{
 const f=fixture(false);
 f.positions[0]=-400;f.positions[1]=90;f.handlers.hashchange();
 assert.equal(f.links[1].attrs['aria-current'],'location');
 assert.equal(f.properties['--guide-scroll-offset'],'100px');
 assert.equal(f.nav.scrolled,undefined);
});
