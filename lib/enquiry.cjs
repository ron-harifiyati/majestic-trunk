const experiences=require('../src/data/experiences.json');
const stays=require('../src/data/lodges.json');
const dining=require('../src/data/dining.json');
const core=require('../src/js/trip-core.js');
const catalogue=[['experiences',experiences],['stay',stays],['eat-drink',dining]].flatMap(([type,entries])=>entries.map(e=>({id:`${type}/${e.slug}`,type,title:e.title,url:`/${type}/${e.slug}/`})));
function validate(input,now=new Date()){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Please check your enquiry details.');
 const text=(key,max,required=false)=>{
  if(input[key]!==undefined&&typeof input[key]!=='string')throw new Error(`Please check ${key}.`);
  const value=(input[key]||'').trim();
  if((required&&!value)||value.length>max)throw new Error(`Please check ${key}.`);
  return value;
 };
 const form={name:text('name',100,true),email:text('email',200,true),phone:text('phone',60),message:text('message',5000),interest:text('interest',160),arrival:text('arrival',10),departure:text('departure',10)};
 if(/[\r\n]/.test(form.name)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))throw new Error('Please enter a valid name and email address.');
 for(const key of ['arrival','departure']){
  const date=form[key];
  if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))throw new Error('Please check your travel dates.');
 }
 if(form.arrival&&form.arrival<core.earliestArrival(now))throw new Error('Arrival must be tomorrow or later.');
 if(form.departure&&form.departure<core.earliestArrival(now))throw new Error('Departure must be later than today.');
 if(form.arrival&&form.departure&&form.departure<form.arrival)throw new Error('Departure must be on or after arrival.');
 for(const [key,min] of [['adults',1],['children',0]]){
  if(!['number','string'].includes(typeof input[key])||!/^[0-9]{1,3}$/.test(String(input[key])))throw new Error('Please check your traveller numbers.');
  form[key]=Number(input[key]);if(form[key]<min||form[key]>100)throw new Error('Please check your traveller numbers.');
 }
 if(!Array.isArray(input.selections)||input.selections.length>catalogue.length)throw new Error('Please review your trip selections.');
 const selections=core.cleanIds(input.selections,catalogue);
 if(selections.length!==new Set(input.selections).size)throw new Error('Some selections are no longer available. Please refresh your shortlist.');
 return {form,selections,text:core.message(form,selections,catalogue,'https://majestictrunk.com')};
}
module.exports={validate,catalogue};
