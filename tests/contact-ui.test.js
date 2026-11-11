const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(mobile){
 const review={open:true};
 const media={matches:mobile,addEventListener(k,f){this.change=f;}};
 vm.runInNewContext(fs.readFileSync('src/js/contact-ui.js','utf8'),{document:{querySelector(){return review;}},window:{matchMedia(){return media;}}});
 return {review,media};
}
test('contact shortlist starts collapsed on mobile and expanded on desktop',()=>{
 assert.equal(fixture(true).review.open,false);
 assert.equal(fixture(false).review.open,true);
});
test('contact shortlist can be manually reviewed and adapts when viewport changes',()=>{
 const f=fixture(true);f.review.open=true;
 f.media.matches=false;f.media.change();assert.equal(f.review.open,true);
 f.media.matches=true;f.media.change();assert.equal(f.review.open,false);
});
