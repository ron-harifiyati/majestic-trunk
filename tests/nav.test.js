const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(){
 const document={body:{style:{overflow:'auto'}},listeners:{},activeElement:null,addEventListener(key,fn){this.listeners[key]=fn;}};
 function node(){const classes=new Set();return {attrs:{},style:{},listeners:{},hidden:true,inert:false,classList:{add(value){classes.add(value);},remove(value){classes.delete(value);},contains(value){return classes.has(value);}},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(key,fn){this.listeners[key]=fn;},focus(){document.activeElement=this;},click(){this.listeners.click({target:this});}};}
 const btn=node(),bar=node(),panel=node(),backdrop=node(),close=node(),links=[node(),node()],background=[node(),node(),node()];
 const mobile={matches:true,query:null,addEventListener(key,fn){this.changed=fn;}};
 bar.getBoundingClientRect=()=>({bottom:76});bar.contains=target=>[btn,bar,panel,close,...links].includes(target);
 panel.querySelectorAll=s=>s==='a'?links:[close,...links];panel.contains=target=>[close,...links].includes(target);
 document.querySelector=s=>({'.nav-toggle':btn,'.navbar':bar,'.nav-panel':panel,'.nav-backdrop':backdrop,'.nav-close':close}[s]);document.querySelectorAll=()=>background;
 vm.runInNewContext(fs.readFileSync('src/js/nav.js','utf8'),{document,window:{matchMedia(query){mobile.query=query;return mobile;}}});
 return {document,btn,bar,panel,backdrop,close,links,background,mobile,key(key,shiftKey=false){let prevented=false;document.listeners.keydown({key,shiftKey,preventDefault(){prevented=true;}});return prevented;}};
}
test('hamburger opens a modal popup and close restores page interaction and focus',()=>{
 const f=fixture();f.btn.click();assert.equal(f.btn.attrs['aria-expanded'],'true');assert.equal(f.panel.attrs.role,'dialog');assert.equal(f.backdrop.hidden,false);assert.equal(f.document.activeElement,f.close);assert.ok(f.background.every(e=>e.inert));assert.equal(f.document.body.style.overflow,'hidden');
 f.close.click();assert.equal(f.btn.attrs['aria-expanded'],'false');assert.equal(f.backdrop.hidden,true);assert.equal(f.panel.attrs.role,undefined);assert.ok(f.background.every(e=>!e.inert));assert.equal(f.document.body.style.overflow,'auto');assert.equal(f.document.activeElement,f.btn);
});
test('Escape, tap outside, navigation and desktop resize close the popup',()=>{
 const f=fixture();f.btn.click();assert.equal(f.key('Escape'),true);assert.equal(f.backdrop.hidden,true);
 f.btn.click();f.backdrop.click();assert.equal(f.backdrop.hidden,true);
 f.btn.click();f.links[0].click();assert.equal(f.backdrop.hidden,true);
 f.btn.click();f.document.listeners.click({target:{}});assert.equal(f.backdrop.hidden,true);
 f.btn.click();f.mobile.matches=false;f.mobile.changed();assert.equal(f.backdrop.hidden,true);assert.equal(f.document.body.style.overflow,'auto');
 f.btn.click();assert.equal(f.backdrop.hidden,true);
});
test('keyboard focus stays within the open popup',()=>{
 const f=fixture();f.btn.click();assert.equal(f.key('Tab',true),true);assert.equal(f.document.activeElement,f.links[1]);assert.equal(f.key('Tab'),true);assert.equal(f.document.activeElement,f.close);
});

test('tablet portrait and landscape share the popup breakpoint with CSS',()=>{
 const f=fixture();
 assert.equal(f.mobile.query,'(max-width:1180px), (max-width:1366px) and (pointer:coarse)');
 const css=fs.readFileSync('src/styles/site.css','utf8');
 assert.ok(css.includes('@media '+f.mobile.query+'{'));
});
