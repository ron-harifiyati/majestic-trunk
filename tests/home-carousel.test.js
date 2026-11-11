const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function fixture(mobile=true){
 const document={activeElement:null};let timers=new Map(),nextTimer=1;
 function node(){return {hidden:false,attrs:{},style:{},listeners:{},dataset:{},classes:new Set(),setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},focus(){document.activeElement=this;},matches(selector){return selector==='[data-trip-add]'&&this.isTrip;}};}
 const track={children:[],append(slide){this.children.push(slide);},prepend(slide){this.children.unshift(slide);}};
 function slide(index){
  const item=node(),link=node();
  item.dataset={carouselIndex:index,carouselTitle:'Experience '+index};item.offsetWidth=200;
  Object.defineProperty(item,'offsetLeft',{get(){return 50+track.children.indexOf(item)*216;}});
  item.classList={toggle(name,state){if(state)item.classes.add(name);else item.classes.delete(name);}};
  item.controls=[link];item.cloneNode=()=>slide(index);
  item.querySelectorAll=()=>item.controls;item.querySelector=()=>link;
  item.contains=target=>item.controls.includes(target);
  return item;
 }
 for(let i=0;i<7;i++)track.append(slide(i));
 const viewport=node();viewport.clientWidth=300;viewport.scrollLeft=0;viewport.scrollTo=options=>{viewport.scrollLeft=options.left;viewport.behavior=options.behavior;};viewport.contains=target=>track.children.some(s=>s.contains(target));
 const grid=node(),status=node(),previous=node(),next=node(),carousel=node();carousel.hidden=true;
 const selectors={'[data-carousel-viewport]':viewport,'[data-carousel-track]':track,'[data-carousel-status]':status,'[data-carousel-previous]':previous,'[data-carousel-next]':next};carousel.querySelector=s=>selectors[s];
 document.querySelector=s=>s==='[data-experience-carousel]'?carousel:grid;
 const media={matches:mobile,addEventListener(_,fn){this.change=fn;}},reduced={matches:true};
 vm.runInNewContext(fs.readFileSync('src/js/home-carousel.js','utf8'),{document,window:{matchMedia(query){return query.includes('reduced-motion')?reduced:media;}},setTimeout(fn){const id=nextTimer++;timers.set(id,fn);return id;},clearTimeout(id){timers.delete(id);},requestAnimationFrame(fn){fn();return 1;},cancelAnimationFrame(){}});
 return {track,viewport,grid,status,previous,next,carousel,media,document,flush(){const queued=[...timers.values()];timers.clear();queued.forEach(fn=>fn());},active(){return track.children.find(s=>s.classes.has('is-current'));},click(button){viewport.listeners.keydown({key:button===previous?'ArrowLeft':'ArrowRight',preventDefault(){}});this.flush();}};
}
test('tablet carousel starts centred with one detailed, keyboard-accessible slide',()=>{
 const f=fixture();assert.equal(f.carousel.hidden,false);assert.equal(f.grid.hidden,true);assert.equal(f.track.children.length,21);assert.equal(f.active().dataset.carouselIndex,0);assert.equal(f.status.textContent,'1 / 7');
 assert.equal(f.track.children.filter(s=>s.attrs['aria-hidden']==='false').length,1);
 for(const s of f.track.children)for(const control of s.controls)assert.equal(control.tabIndex,s===f.active()?0:-1);
 assert.equal(f.active().controls.length,1);
});
test('carousel loops in both directions without a blank or duplicate focused slide',()=>{
 const f=fixture();f.click(f.previous);assert.equal(f.active().dataset.carouselIndex,6);assert.equal(f.track.children.indexOf(f.active()),13);
 f.click(f.next);assert.equal(f.active().dataset.carouselIndex,0);assert.equal(f.track.children.indexOf(f.active()),7);
 for(let i=0;i<30;i++)f.click(f.next);
 assert.equal(f.active().dataset.carouselIndex,2);assert.equal(f.track.children.filter(s=>s.classes.has('is-current')).length,1);
});
test('native scrolling and tapping side cards focus the selected experience',()=>{
 const f=fixture();f.viewport.scrollLeft+=216;f.viewport.listeners.scroll();f.flush();assert.equal(f.active().dataset.carouselIndex,1);
 const side=f.track.children[9];let prevented=false,stopped=false;
 f.viewport.listeners.click({target:{closest(){return side;}},preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});f.flush();
 assert.equal(f.active().dataset.carouselIndex,2);assert.ok(prevented&&stopped);
 let intercepted=false;f.viewport.listeners.click({target:{closest(){return f.active();}},preventDefault(){intercepted=true;},stopPropagation(){}});assert.equal(intercepted,false);
});
test('keyboard arrows transfer focus and desktop resizing restores the original grid',()=>{
 const f=fixture();f.active().controls[0].focus();f.viewport.listeners.keydown({key:'ArrowRight',preventDefault(){}});f.flush();assert.equal(f.active().dataset.carouselIndex,1);assert.equal(f.document.activeElement,f.active().controls[0]);
 f.media.matches=false;f.media.change();assert.equal(f.carousel.hidden,true);assert.equal(f.grid.hidden,false);
 f.media.matches=true;f.media.change();assert.equal(f.active().dataset.carouselIndex,1);assert.equal(f.grid.hidden,true);
});
