/* One shortlist, shared between the desktop sidebar and mobile review sheet. */
(function () {
 'use strict';
 const planner=document.querySelector('[data-trip-planner]');
 const dialog=document.querySelector('[data-trip-dialog]');
 if(!planner||!dialog||typeof dialog.showModal!=='function')return;
 const summary=document.getElementById('your-trip');
 const review=document.querySelector('[data-trip-review]');
 const close=document.querySelector('[data-trip-close]');
 const body=dialog.querySelector('[data-trip-dialog-body]');
 const header=document.querySelector('.site-header');
 const mobile=window.matchMedia('(max-width:880px)');
 let overflow='';
 planner.classList.add('trip-review-ready');
 review.setAttribute('aria-haspopup','dialog');
 review.setAttribute('aria-expanded','false');
 function closeReview(){if(dialog.open)dialog.close();}
 function restore(){
  planner.append(summary);
  document.body.style.overflow=overflow;
  review.setAttribute('aria-expanded','false');
  if(mobile.matches)review.focus({preventScroll:true});
 }
 review.addEventListener('click',event=>{
  if(!mobile.matches)return;
  event.preventDefault();
  overflow=document.body.style.overflow;
  body.append(summary);
  dialog.showModal();
  document.body.style.overflow='hidden';
  review.setAttribute('aria-expanded','true');
  close.focus();
 });
 close.addEventListener('click',closeReview);
 dialog.addEventListener('close',restore);
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeReview();});
 mobile.addEventListener('change',closeReview);
 function offset(){
  if(header)planner.style.setProperty('--planner-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');
 }
 if(typeof ResizeObserver!=='undefined'&&header)new ResizeObserver(offset).observe(header);
 offset();
})();
