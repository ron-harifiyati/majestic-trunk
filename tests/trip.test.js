const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const core=require('../src/js/trip-core');
const {validate,catalogue}=require('../lib/enquiry.cjs');
const valid=()=>({name:'Sarah',email:'sarah@example.com',phone:'',arrival:'2027-08-12',departure:'2027-08-16',adults:'2',children:'1',message:'Please compare these stays.',interest:'',website:'',selections:['experiences/sunset-cruise','stay/palm-river-hotel','eat-drink/lookout-cafe']});

test('trip storage survives a page reload and discards duplicates and invalid catalogue IDs',()=>{
 let stored;const storage={getItem(){return stored;},setItem(key,value){assert.equal(key,core.key);stored=value;}};
 assert.equal(core.write(storage,['stay/palm-river-hotel']),true);
 assert.deepEqual(core.read(storage,catalogue),['stay/palm-river-hotel']);
 stored=JSON.stringify(['stay/palm-river-hotel','bad/id','stay/palm-river-hotel',null]);
 assert.deepEqual(core.read(storage,catalogue),['stay/palm-river-hotel']);
 stored='{broken';assert.deepEqual(core.read(storage,catalogue),[]);
 assert.deepEqual(core.read(null,catalogue),[]);assert.equal(core.write(null,[]),false);
});
test('enquiries contain contact details, grouped choices and canonical item links',()=>{
 const {text}=validate(valid());
 for(const fragment of ['Sarah','sarah@example.com','2027-08-12','2 adults, 1 children','Experiences','Places to stay','Eat & Drink','https://majestictrunk.com/stay/palm-river-hotel/','Please compare these stays.','alternatives to compare'])assert.ok(text.includes(fragment),fragment);
 const empty=validate({...valid(),selections:[],arrival:'',departure:''});assert.match(empty.text,/please help me plan/i);
});
test('server rejects malformed input, unknown selections and invalid dates or traveller counts',()=>{
 for(const change of [{email:'bad'},{name:'Injected\nheader'},{arrival:'2027-02-30'},{departure:'2027-08-01'},{adults:'0'},{children:'-1'},{adults:1.5},{adults:true},{selections:['stay/fake']},{message:'x'.repeat(5001)}])assert.throws(()=>validate({...valid(),...change}));
 assert.throws(()=>validate(null));assert.throws(()=>validate([]));
});
function handler(fetch){
 const source=fs.readFileSync('functions/api/enquiry.js','utf8').replace("import enquiry from '../../lib/enquiry.cjs';",'const enquiry=provided;').replace('export async function','async function');
 return vm.runInNewContext(source+'\nonRequestPost;',{provided:{validate},Request,Response,TextEncoder,URL,AbortSignal,crypto:require('node:crypto').webcrypto,fetch});
}
const request=(body,origin='https://majestictrunk.com')=>new Request('https://majestictrunk.com/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
const env={RESEND_API_KEY:'test-only-key',ENQUIRY_FROM:'Majestic Trunk <enquiries@example.com>',ENQUIRY_TO:'hello@example.com'};
test('email endpoint reports unavailable credentials and provider failures without claiming success',async()=>{
 let calls=0;const post=handler(async()=>{calls++;return new Response('{}',{status:500});});
 assert.equal((await post({request:request(valid()),env:{}})).status,503);assert.equal(calls,0);
 const failed=await post({request:request(valid()),env});assert.equal(failed.status,502);assert.notEqual((await failed.json()).accepted,true);
 assert.equal((await post({request:request(valid(),'https://other.test'),env})).status,403);
 assert.equal((await post({request:request({...valid(),website:'spam'}),env})).status,400);
 assert.equal((await post({request:request({...valid(),email:'invalid'}),env})).status,400);
});
test('email endpoint uses verified sender, visitor Reply-To, authoritative catalogue and retry idempotency',async()=>{
 const calls=[];const post=handler(async(url,options)=>{calls.push({url,...options});return Response.json({id:'provider-test-id'});});
 for(let i=0;i<2;i++){
  const result=await post({request:request({...valid(),title:'Forged property name'}),env});assert.equal(result.status,200);assert.equal((await result.json()).accepted,true);
 }
 const email=JSON.parse(calls[0].body);assert.equal(email.from,env.ENQUIRY_FROM);assert.deepEqual(email.to,[env.ENQUIRY_TO]);assert.equal(email.reply_to,'sarah@example.com');assert.match(email.text,/Palm River Hotel/);assert.ok(!email.text.includes('Forged property name'));
 assert.equal(calls[0].headers['Idempotency-Key'],calls[1].headers['Idempotency-Key']);
 const limited=await post({request:request(valid()),env:{...env,ENQUIRY_RATE_LIMITER:{limit:async()=>({success:false})}}});assert.equal(limited.status,429);assert.equal(calls.length,2);
});

function node(extra={}){return Object.assign({hidden:false,dataset:{},value:'',listeners:{},attrs:{},textContent:'',innerHTML:'',classList:{add(){},remove(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.listeners[k]=fn;},focus(){this.focused=true;},closest(){return null;},append(){},setCustomValidity(value){this.validityMessage=value;}},extra);}
function fixture({stored='[]',search='',withForm=false,withPlanner=false,emailMode='api',clipboardFails=false,fetch=async()=>Response.json({error:'Online sending isn’t connected yet.'},{status:503})}={}){
 const entries=catalogue.map(e=>({...e,photo:'/photo.jpg',alt:'Photo',category:e.type,group:e.type,groupLabel:e.type,location:'Victoria Falls'}));
 let saved=stored;const storage={getItem(){return saved;},setItem(_key,value){saved=value;}};
 const buttons=entries.map(e=>node({dataset:{tripAdd:e.id}})),counter=node(),selection=node(),main=node(),handlers={};
 const fallback=node({hidden:true}),status=node(),preview=node(),mail=node(),copy=node(),send=node();
 const values=valid(),fields={arrival:node({value:values.arrival}),departure:node({value:values.departure})};
 const form=withForm?node({elements:fields,reportValidity(){return !fields.arrival.validityMessage&&!fields.departure.validityMessage;}}):null;
 const interest=node(),tabs=['experiences','stay','eat-drink'].map(type=>node({dataset:{tripTab:type}})),searchNode=node(),category=node({value:'all'}),results=node(),empty=node(),reset=node();
 const cards=entries.map(e=>node({dataset:{tripOption:e.id}}));
 const planner=withPlanner?{querySelectorAll(s){return s==='[data-trip-option]'?cards:tabs;},querySelector(s){return {'[data-trip-results]':results,'[data-trip-empty]':empty,'[data-trip-reset]':reset}[s];}}:null;
 const document={body:node(),createElement(){return node();},addEventListener(k,f){handlers[k]=f;},querySelectorAll(s){return {'[data-trip-add]':buttons,'[data-trip-count]':[counter],'[data-trip-selection]':[selection]}[s]||[];},querySelector(s){return {main,'[data-trip-planner]':planner,'[data-enquiry-fallback]':fallback,'[data-enquiry-status]':status,'[data-enquiry-send]':send,'[data-enquiry-mail]':mail,'[data-enquiry-copy]':copy}[s];},getElementById(id){return {'trip-enquiry':form,'enquiry-interest':interest,'enquiry-preview':preview,'trip-search':searchNode,'trip-category':category}[id];}};
 const window={MajesticEmailMode:emailMode,MajesticTripCore:core,MajesticCatalogue:entries,localStorage:storage,location:new URL('https://majestictrunk.com/contact/'+search),addEventListener(k,fn){handlers[k]=fn;}};
 vm.runInNewContext(fs.readFileSync('src/js/trip.js','utf8'),{window,document,URLSearchParams,FormData:class{constructor(){return Object.entries(values);}},fetch,AbortSignal,navigator:{clipboard:{writeText:async()=>{if(clipboardFails)throw new Error('Clipboard unavailable');}}}});
 return {buttons,counter,selection,copy,fallback,status,preview,form,values,fields,send,cards,tabs,searchNode,category,results,empty,reset,interest,get saved(){return saved;},storageChange(ids){saved=JSON.stringify(ids);handlers.storage({key:core.key});},toggleGroup(type,open){handlers.toggle({target:{dataset:{tripSelectionGroup:type},open}});},click(button){handlers.click({target:{closest(){return button;}}});},async submit(){await form.listeners.submit({preventDefault(){}});}};
}
test('visitor can add, remove and restore choices, and contact interest merges without duplication',()=>{
 const f=fixture();f.click(f.buttons[0]);assert.equal(f.counter.textContent,1);assert.equal(f.buttons[0].attrs['aria-pressed'],'true');assert.match(f.selection.innerHTML,/Experiences/);
 const restored=fixture({stored:f.saved});assert.equal(restored.counter.textContent,1);restored.click(restored.buttons[0]);assert.equal(restored.counter.textContent,0);
 const linked=fixture({stored:f.saved,withForm:true,search:'?interest='+encodeURIComponent(catalogue[0].title)});assert.equal(linked.counter.textContent,1);
 const unknown=fixture({withForm:true,search:'?interest=Special%20request'});assert.match(unknown.interest.textContent,/Special request/);
});
test('planner tabs, search and empty-state reset filter the complete catalogue',()=>{
 const f=fixture({withPlanner:true});assert.equal(f.cards.filter(e=>!e.hidden).length,26);
 f.tabs[1].listeners.click();assert.equal(f.cards.filter(e=>!e.hidden).length,34);
 f.searchNode.value='Palm River';f.searchNode.listeners.input();assert.equal(f.cards.filter(e=>!e.hidden).length,1);
 f.searchNode.value='No such place';f.searchNode.listeners.input();assert.equal(f.empty.hidden,false);
 f.reset.listeners.click();assert.equal(f.cards.filter(e=>!e.hidden).length,34);assert.equal(f.empty.hidden,true);assert.equal(f.searchNode.focused,true);
});
test('failed send preserves details and selections and exposes a complete email fallback',async()=>{
 const f=fixture({withForm:true,stored:JSON.stringify(valid().selections)});await f.submit();
 assert.equal(f.fallback.hidden,false);assert.match(f.status.textContent,/isn’t connected/);assert.ok(!f.status.textContent.includes('Thank you'));
 assert.match(f.preview.value,/Sarah/);assert.match(f.preview.value,/Palm River Hotel/);assert.equal(f.values.message,valid().message);assert.equal(f.counter.textContent,3);assert.equal(f.send.disabled,false);
});
test('successful send and invalid date handling use distinct states',async()=>{
 let calls=0;const f=fixture({withForm:true,fetch:async()=>{calls++;return Response.json({accepted:true});}});
 f.fields.departure.value='2027-08-01';await f.submit();assert.equal(calls,0);
 f.fields.departure.value='2027-08-16';await f.submit();assert.equal(calls,1);assert.match(f.status.textContent,/Thank you/);assert.equal(f.fallback.hidden,true);
});

test('arrival must be after today in Victoria Falls, including at the date boundary',()=>{
 const now=new Date('2027-08-11T22:30:00Z'); // Already 12 August in Victoria Falls.
 assert.equal(core.today(now),'2027-08-12');
 assert.equal(core.earliestArrival(now),'2027-08-13');
 for(const arrival of ['2027-08-11','2027-08-12'])assert.throws(()=>validate({...valid(),arrival},now),/tomorrow or later/);
 assert.doesNotThrow(()=>validate({...valid(),arrival:'2027-08-13'},now));
 assert.doesNotThrow(()=>validate({...valid(),arrival:'',departure:''},now));
 assert.equal(core.earliestArrival(new Date('2027-12-31T12:00:00Z')),'2028-01-01');
});
test('date picker excludes today and prevents manual past or current arrival submissions',async()=>{
 let calls=0;const f=fixture({withForm:true,fetch:async()=>{calls++;return Response.json({accepted:true});}});
 assert.equal(f.fields.arrival.min,core.earliestArrival());
 for(const arrival of ['2000-01-01',core.today()]){
  f.fields.arrival.value=arrival;f.fields.departure.value='';await f.submit();
  assert.match(f.fields.arrival.validityMessage,/tomorrow or later/);
 }
 assert.equal(calls,0);
 f.fields.arrival.value=core.earliestArrival();await f.submit();assert.equal(calls,1);
});

test('GitHub Pages prepares a complete email enquiry without calling a server endpoint',async()=>{
 let calls=0;const f=fixture({withForm:true,emailMode:'email',stored:JSON.stringify(valid().selections),fetch:async()=>{calls++;throw new Error('No backend');}});
 assert.equal(f.send.textContent,'Prepare email enquiry');await f.submit();
 assert.equal(calls,0);assert.equal(f.fallback.hidden,false);
 assert.match(f.status.textContent,/enquiry is ready/);assert.match(f.preview.value,/Palm River Hotel/);
});

test('large shortlists retain every choice and preserve collapsed groups while adding items',()=>{
 const f=fixture({stored:JSON.stringify(catalogue.map(e=>e.id))});
 assert.equal(f.counter.textContent,catalogue.length);
 assert.equal((f.selection.innerHTML.match(/data-trip-remove=/g)||[]).length,catalogue.length);
 assert.equal((f.selection.innerHTML.match(/<details /g)||[]).length,3);
 f.toggleGroup('stay',false);
 f.click(f.buttons[0]);
 assert.match(f.selection.innerHTML,/<details class="trip-selection-group" data-trip-selection-group="stay">/);
 assert.equal(f.counter.textContent,catalogue.length-1);
 assert.equal((f.selection.innerHTML.match(/data-trip-remove=/g)||[]).length,catalogue.length-1);
});

test('prepared enquiry stays in sync when selections change in another tab',async()=>{
 const f=fixture({withForm:true,emailMode:'email',stored:JSON.stringify(valid().selections)});
 await f.submit();
 assert.match(f.preview.value,/Palm River Hotel/);
 f.storageChange([]);
 assert.equal(f.counter.textContent,0);
 assert.ok(!f.preview.value.includes('Palm River Hotel'));
 assert.match(f.preview.value,/Sarah/);
});

test('clipboard failure expands the complete enquiry before focusing it',async()=>{
 const f=fixture({withForm:true,emailMode:'email',clipboardFails:true});
 const disclosure={open:false};let selected=false;
 f.preview.closest=()=>disclosure;
 f.preview.select=()=>{selected=true;};
 await f.submit();await f.copy.listeners.click();
 assert.equal(disclosure.open,true);
 assert.equal(f.preview.focused,true);
 assert.equal(selected,true);
 assert.match(f.status.textContent,/Select and copy/);
});
