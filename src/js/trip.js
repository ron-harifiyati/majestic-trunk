(function(){
 'use strict';
 const core=window.MajesticTripCore,catalogue=window.MajesticCatalogue;
 if(!core||!Array.isArray(catalogue))return;
 let storage;try{storage=window.localStorage;}catch{storage=null;}
 let selected=core.read(storage,catalogue);
 const recipient=window.MajesticEnquiryEmail||'hello@majestictrunk.com';
 const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const live=document.createElement('p');live.className='sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');document.body.append(live);
 const storageNote=document.createElement('p');storageNote.className='trip-storage-note';storageNote.hidden=true;document.querySelector('main').append(storageNote);
 function persist(){if(!core.write(storage,selected)){storageNote.textContent='Your browser cannot save this shortlist between pages. Keep this page open, or allow site storage to continue your enquiry.';storageNote.hidden=false;}}
 function render(){
  document.querySelectorAll('[data-trip-count]').forEach(el=>{el.textContent=selected.length;});
  document.querySelectorAll('[data-trip-add]').forEach(button=>{
   const entry=catalogue.find(e=>e.id===button.dataset.tripAdd);if(!entry)return;
   const added=selected.includes(entry.id);button.hidden=false;button.textContent=added?'Added ✓':'Add to trip +';button.setAttribute('aria-pressed',String(added));button.setAttribute('aria-label',`${added?'Remove':'Add'} ${entry.title} ${added?'from':'to'} your trip`);
  });
  document.querySelectorAll('[data-trip-selection]').forEach(container=>{
   container.tabIndex=-1;
   container.innerHTML=selected.length?Object.entries(core.labels).map(([type,label])=>{
    const entries=catalogue.filter(e=>e.type===type&&selected.includes(e.id));
    return entries.length?`<section class="trip-selection-group"><h3>${esc(label)} <span>${entries.length}</span></h3><ul>${entries.map(e=>`<li><img src="${esc(e.photo)}" alt="" width="56" height="48" loading="lazy"><a href="${esc(e.url)}">${esc(e.title)}</a><button type="button" data-trip-remove="${esc(e.id)}" aria-label="Remove ${esc(e.title)} from your trip">×</button></li>`).join('')}</ul></section>`:'';
   }).join(''):'<p class="trip-selection-empty">Your shortlist is open. Add some ideas, or send us a message and we’ll help you choose.</p>';
  });
 }
 const form=document.getElementById('trip-enquiry');
 let extraInterest='';
 if(form){
  const interest=new URLSearchParams(window.location.search).get('interest');
  if(interest){
   const entry=catalogue.find(e=>e.title===interest);
   if(entry){if(!selected.includes(entry.id)){selected.push(entry.id);persist();}}
   else{extraInterest=interest.slice(0,160);const note=document.getElementById('enquiry-interest');note.textContent='You’re enquiring about: '+extraInterest;note.hidden=false;}
  }
 }
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-trip-add],[data-trip-remove]');if(!button)return;
  const id=button.dataset.tripAdd||button.dataset.tripRemove;
  const entry=catalogue.find(e=>e.id===id);if(!entry)return;
  const removal=selected.includes(id),container=button.closest('[data-trip-selection]');
  selected=removal?selected.filter(value=>value!==id):selected.concat(id);persist();render();
  live.textContent=entry.title+(removal?' removed from':' added to')+' your trip.';
  if(container)container.focus();
  if(form&&!document.querySelector('[data-enquiry-fallback]').hidden)prepareFallback();
 });
 window.addEventListener('storage',event=>{if(event.key===core.key||event.key===null){selected=core.read(storage,catalogue);render();}});
 render();
 const planner=document.querySelector('[data-trip-planner]');
 if(planner){
  let type='experiences';
  const search=document.getElementById('trip-search'),category=document.getElementById('trip-category');
  function categories(){
   const values=[...new Map(catalogue.filter(e=>e.type===type).map(e=>[e.group,e.groupLabel])).entries()];
   category.innerHTML='<option value="all">All categories</option>'+values.map(([id,label])=>`<option value="${esc(id)}">${esc(label)}</option>`).join('');
  }
  function filter(){
   const query=search.value.trim().toLowerCase();let count=0;
   planner.querySelectorAll('[data-trip-option]').forEach(card=>{
    const entry=catalogue.find(e=>e.id===card.dataset.tripOption);
    card.hidden=entry.type!==type||(category.value!=='all'&&entry.group!==category.value)||!`${entry.title} ${entry.location} ${entry.category}`.toLowerCase().includes(query);
    if(!card.hidden)count++;
   });
   planner.querySelector('[data-trip-results]').textContent=`${count} ${core.labels[type].toLowerCase()}${query?' matching your search':''}`;
   planner.querySelector('[data-trip-empty]').hidden=count!==0;
  }
  planner.querySelectorAll('[data-trip-tab]').forEach(button=>button.addEventListener('click',()=>{
   type=button.dataset.tripTab;
   planner.querySelectorAll('[data-trip-tab]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
   categories();filter();
  }));
  search.addEventListener('input',filter);category.addEventListener('change',filter);
  planner.querySelector('[data-trip-reset]').addEventListener('click',()=>{search.value='';category.value='all';filter();search.focus();});
  categories();filter();
 }
 function formValues(){return {...Object.fromEntries(new FormData(form)),interest:extraInterest};}
 function prepareFallback(){
  const values=formValues(),text=core.message(values,selected,catalogue,window.location.origin);
  document.getElementById('enquiry-preview').value=text;
  document.querySelector('[data-enquiry-mail]').href='mailto:'+recipient+'?subject='+encodeURIComponent('Victoria Falls trip enquiry — '+values.name)+'&body='+encodeURIComponent(text);
  return text;
 }
 if(form){
  const arrival=form.elements.arrival,departure=form.elements.departure,status=document.querySelector('[data-enquiry-status]'),send=document.querySelector('[data-enquiry-send]'),fallback=document.querySelector('[data-enquiry-fallback]');
  send.disabled=false;
  function checkDates(){
   arrival.min=core.earliestArrival();
   arrival.setCustomValidity(arrival.value&&arrival.value<arrival.min?'Arrival must be tomorrow or later.':'');
   departure.min=arrival.value&&arrival.value>=arrival.min?arrival.value:arrival.min;
   departure.setCustomValidity(departure.value&&departure.value<departure.min?'Departure must be on or after your arrival and later than today.':'');
  }
  checkDates();
  arrival.addEventListener('input',checkDates);departure.addEventListener('input',checkDates);
  form.addEventListener('input',()=>{if(!fallback.hidden)prepareFallback();});
  const submitLabel=window.MajesticEmailMode==='email'?'Prepare email enquiry ↗':'Send enquiry ↗';
  send.textContent=submitLabel;
  let submitting=false;
  form.addEventListener('submit',async event=>{
   event.preventDefault();checkDates();if(submitting||!form.reportValidity())return;
   if(window.MajesticEmailMode==='email'){
    prepareFallback();fallback.hidden=false;status.classList.remove('is-error');
    status.textContent='Your enquiry is ready. Use the email option below to send it to us.';status.focus();return;
   }
   submitting=true;send.disabled=true;send.textContent='Sending…';status.textContent='Sending your enquiry…';status.classList.remove('is-error');fallback.hidden=true;
   try{
    const response=await fetch((window.MajesticBasePath||'')+'/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...formValues(),selections:selected.slice()}),signal:AbortSignal.timeout(15000)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok||result.accepted!==true)throw new Error(result.error||'We couldn’t send your enquiry from this preview.');
    status.textContent='Thank you — your enquiry has been sent to our email service. We’ll reply using the email address you provided.';
   }catch(error){
    status.textContent=(error.name==='TimeoutError'?'We couldn’t confirm whether your enquiry was sent.':error.message)+' Your details are still here. You can send the complete enquiry by email below.';
    status.classList.add('is-error');prepareFallback();fallback.hidden=false;
   }finally{submitting=false;send.disabled=false;send.textContent=submitLabel;status.focus();}
  });
  document.querySelector('[data-enquiry-copy]').addEventListener('click',async()=>{
   const text=prepareFallback();
   try{await navigator.clipboard.writeText(text);status.textContent='Enquiry copied. Paste it into an email to '+recipient+'.';status.classList.remove('is-error');}
   catch{const preview=document.getElementById('enquiry-preview');preview.focus();preview.select();status.textContent='Select and copy the enquiry below.';}
  });
 }
})();
