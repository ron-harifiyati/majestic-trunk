/* Native horizontal scrolling with a repeating selection and one focused card. */
(function(){
 'use strict';
 const carousel=document.querySelector('[data-experience-carousel]');
 if(!carousel)return;
 const viewport=carousel.querySelector('[data-carousel-viewport]');
 const track=carousel.querySelector('[data-carousel-track]');
 const grid=document.querySelector('[data-home-experience-grid]');
 const status=carousel.querySelector('[data-carousel-status]');
 const media=window.matchMedia('(max-width:1180px), (max-width:1366px) and (pointer:coarse)');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const original=Array.from(track.children),count=original.length;
 if(count<3||!grid)return;
 original.forEach((slide,index)=>{slide.dataset.carouselIndex=index;});
 // Three cycles let a native swipe cross either end before recentering invisibly.
 original.forEach(slide=>track.append(slide.cloneNode(true)));
 original.slice().reverse().forEach(slide=>track.prepend(slide.cloneNode(true)));
 const slides=Array.from(track.children);
 let enabled=false,logical=0,physical=count,timer,frame,focusAfterMove=null;
 function centre(index){
  const slide=slides[index];
  return slide.offsetLeft+slide.offsetWidth/2-viewport.clientWidth/2;
 }
 function nearest(){
  return slides.reduce((best,slide,index)=>Math.abs(centre(index)-viewport.scrollLeft)<Math.abs(centre(best)-viewport.scrollLeft)?index:best,0);
 }
 function paint(index){
  physical=index;logical=Number(slides[index].dataset.carouselIndex);
  slides.forEach((slide,i)=>{
   const active=i===index;
   slide.classList.toggle('is-current',active);
   slide.setAttribute('aria-hidden',String(!active));
   slide.setAttribute('aria-label',`${Number(slide.dataset.carouselIndex)+1} of ${count}`);
   slide.querySelectorAll('a, button').forEach(control=>{control.tabIndex=active?0:-1;});
  });
 }
 function jump(index){
  viewport.style.scrollSnapType='none';
  viewport.scrollTo({left:centre(index),behavior:'instant'});
  viewport.style.scrollSnapType='';
  paint(index);
 }
 function settle(){
  if(!enabled)return;
  const index=nearest();paint(index);
  if(index<count||index>=count*2){
   const focused=slides[index].contains(document.activeElement)?document.activeElement:null;
   const selector=focused?.matches('[data-trip-add]')?'[data-trip-add]':'.experience-carousel-details';
   jump(count+logical);
   if(focused)slides[count+logical].querySelector(selector).focus({preventScroll:true});
  }
  if(focusAfterMove){slides[physical].querySelector(focusAfterMove).focus({preventScroll:true});focusAfterMove=null;}
  status.textContent=`${logical+1} / ${count}`;
  status.setAttribute('aria-label',`${slides[physical].dataset.carouselTitle}, ${logical+1} of ${count}`);
 }
 function go(index){
  if(!enabled)return;
  if(viewport.contains(document.activeElement))focusAfterMove=document.activeElement.matches('[data-trip-add]')?'[data-trip-add]':'.experience-carousel-details';
  const target=Math.max(0,Math.min(slides.length-1,index));
  viewport.scrollTo({left:centre(target),behavior:reduced.matches?'instant':'smooth'});
  clearTimeout(timer);timer=setTimeout(settle,reduced.matches?0:180);
 }
 function update(){
  enabled=media.matches;carousel.hidden=!enabled;grid.hidden=enabled;
  if(enabled){jump(count+logical);settle();}
  else{clearTimeout(timer);cancelAnimationFrame(frame);}
 }
 viewport.addEventListener('scroll',()=>{
  if(!enabled)return;
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>paint(nearest()));
  clearTimeout(timer);timer=setTimeout(settle,160);
 },{passive:true});
 viewport.addEventListener('click',event=>{
  const slide=event.target.closest('[data-carousel-slide]');
  if(!slide||!enabled||slide===slides[physical])return;
  event.preventDefault();event.stopPropagation();go(slides.indexOf(slide));
 });
 viewport.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
   event.preventDefault();go(physical+(event.key==='ArrowLeft'?-1:1));
  }
 });
 media.addEventListener('change',update);
 if(typeof ResizeObserver!=='undefined'){
  let width=0;
  new ResizeObserver(()=>{
   if(enabled&&viewport.clientWidth!==width){width=viewport.clientWidth;jump(count+logical);}
  }).observe(viewport);
 }
 update();
})();
