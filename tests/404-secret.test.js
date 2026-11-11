const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(supported=true){
 const node=()=>({hidden:true,listeners:{},addEventListener(k,f){this.listeners[k]=f;},focus(){this.focused=true;}});
 const sun=node(),secret=node(),close=node(),body={style:{overflow:'auto'}};
 secret.open=false;
 if(supported)secret.showModal=()=>{secret.open=true;};
 secret.close=()=>{secret.open=false;secret.listeners.close();};
 const selectors={'[data-secret-sun]':sun,'[data-developer-secret]':secret,'[data-secret-close]':close};
 vm.runInNewContext(fs.readFileSync('src/js/404-secret.js','utf8'),{document:{body,querySelector(s){return selectors[s];}}});
 return {sun,secret,close,body};
}
test('sun reveals a dismissible credit and restores focus and scrolling',()=>{
 const f=fixture();assert.equal(f.sun.hidden,false);
 f.sun.listeners.click();assert.equal(f.secret.open,true);assert.equal(f.close.focused,true);
 assert.equal(f.body.style.overflow,'hidden');
 f.close.listeners.click();assert.equal(f.secret.open,false);assert.equal(f.sun.focused,true);
 assert.equal(f.body.style.overflow,'auto');
 f.sun.listeners.click();f.secret.close();
 assert.equal(f.body.style.overflow,'auto');
});
test('secret can be dismissed by clicking its backdrop and stays disabled without dialog support',()=>{
 const f=fixture();f.sun.listeners.click();
 f.secret.listeners.click({target:f.secret});assert.equal(f.secret.open,false);
 assert.equal(fixture(false).sun.hidden,true);
});
