/* A quiet signature for visitors who discover the sun. */
(function () {
 'use strict';
 const sun=document.querySelector('[data-secret-sun]');
 const secret=document.querySelector('[data-developer-secret]');
 const close=document.querySelector('[data-secret-close]');
 if(!sun||!secret||!close||typeof secret.showModal!=='function')return;
 sun.hidden=false;
 let overflow='';
 sun.addEventListener('click',()=>{
  if(secret.open)return;
  overflow=document.body.style.overflow;
  secret.showModal();
  document.body.style.overflow='hidden';
  close.focus();
 });
 close.addEventListener('click',()=>secret.close());
 secret.addEventListener('click',event=>{if(event.target===secret)secret.close();});
 secret.addEventListener('close',()=>{
  document.body.style.overflow=overflow;
  sun.focus({preventScroll:true});
 });
})();
