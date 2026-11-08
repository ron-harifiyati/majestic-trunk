/* Shared enquiry model; works in the browser and in Node tests. */
(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.MajesticTripCore=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const key='majestic-trip-v1';
 const labels={experiences:'Experiences',stay:'Places to stay','eat-drink':'Eat & Drink'};
 function today(now=new Date()){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Harare',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
  const value=type=>parts.find(part=>part.type===type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
 }
 function earliestArrival(now=new Date()){
  const next=new Date(today(now)+'T00:00:00Z');next.setUTCDate(next.getUTCDate()+1);
  return next.toISOString().slice(0,10);
 }
 function cleanIds(value,catalogue){
  if(!Array.isArray(value))return [];
  const known=new Set(catalogue.map(item=>item.id));
  return [...new Set(value.filter(id=>typeof id==='string'&&known.has(id)))].slice(0,78);
 }
 function read(storage,catalogue){try{return cleanIds(JSON.parse(storage.getItem(key)||'[]'),catalogue);}catch{return [];}}
 function write(storage,ids){try{storage.setItem(key,JSON.stringify(ids));return true;}catch{return false;}}
 function message(form,ids,catalogue,origin){
  const rows=['Victoria Falls trip enquiry','',`Name: ${form.name}`,`Email: ${form.email}`,`Phone / WhatsApp: ${form.phone||'Not provided'}`,`Arrival: ${form.arrival||'Dates flexible / not yet decided'}`,`Departure: ${form.departure||'Not yet decided'}`,`Travellers: ${form.adults} adults, ${form.children} children`,''];
  const selected=cleanIds(ids,catalogue).map(id=>catalogue.find(item=>item.id===id));
  Object.entries(labels).forEach(([type,label])=>{
   const entries=selected.filter(item=>item.type===type);
   if(entries.length){rows.push(label);entries.forEach(item=>rows.push(`- ${item.title}\n  ${origin}${item.url}`));rows.push('');}
  });
  if(!selected.length)rows.push('No selections yet — please help me plan.','');
  if(form.interest)rows.push(`Additional interest: ${form.interest}`,'');
  rows.push('Message',form.message||'Please help me plan around these interests.','','Accommodation choices are alternatives to compare; dining selections express interest. This is an enquiry, not a confirmed booking.');
  return rows.join('\n');
 }
 return {key,labels,today,earliestArrival,cleanIds,read,write,message};
});
