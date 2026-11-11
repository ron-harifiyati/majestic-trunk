const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(supported=true){
 function el(){return {listeners:{},attrs:{},style:{setProperty(){}},classList:{add(){}},addEventListener(k,f){this.listeners[k]=f;},setAttribute(k,v){this.attrs[k]=v;},focus(){this.focused=true;},append(child){child.parent=this;}};}
 const planner=el(),summary=el(),review=el(),close=el(),body=el(),dialog=el(),header=el();
 summary.parent=planner;summary.selectionIds=['experience/a','stay/b'];
 dialog.open=false;
 if(supported)dialog.showModal=()=>{dialog.open=true;};
 dialog.close=()=>{dialog.open=false;dialog.listeners.close();};
 dialog.querySelector=()=>body;
 header.getBoundingClientRect=()=>({height:76});
 const pageBody={style:{overflow:'auto'}};
 const mobile={matches:true,addEventListener(k,f){this.change=f;}};
 const selectors={'[data-trip-planner]':planner,'[data-trip-dialog]':dialog,'[data-trip-review]':review,'[data-trip-close]':close,'.site-header':header};
 const document={body:pageBody,getElementById(){return summary;},querySelector(s){return selectors[s];}};
 vm.runInNewContext(fs.readFileSync('src/js/planner-ui.js','utf8'),{document,window:{matchMedia(){return mobile;}}});
 return {planner,summary,review,close,body,dialog,pageBody,mobile,open(){review.listeners.click({preventDefault(){}});}};
}
test('mobile review moves the existing shortlist into a modal and restores it on close',()=>{
 const f=fixture();f.open();
 assert.equal(f.dialog.open,true);assert.equal(f.summary.parent,f.body);
 assert.equal(f.pageBody.style.overflow,'hidden');assert.equal(f.close.focused,true);
 assert.equal(f.review.attrs['aria-expanded'],'true');
 f.close.listeners.click();
 assert.equal(f.summary.parent,f.planner);assert.equal(f.pageBody.style.overflow,'auto');
 assert.equal(f.review.focused,true);assert.equal(f.review.attrs['aria-expanded'],'false');
 assert.deepEqual(f.summary.selectionIds,['experience/a','stay/b']);
});
test('native dismissal and changing to desktop restore the same summary without losing choices',()=>{
 const f=fixture();f.open();f.dialog.close();
 assert.equal(f.summary.parent,f.planner);
 f.open();f.mobile.matches=false;f.mobile.change();
 assert.equal(f.dialog.open,false);assert.equal(f.summary.parent,f.planner);
 assert.equal(f.pageBody.style.overflow,'auto');
});
test('browsers without native dialog keep the review anchor fallback',()=>{
 const f=fixture(false);
 assert.equal(f.review.listeners.click,undefined);
 assert.equal(f.summary.parent,f.planner);
});
