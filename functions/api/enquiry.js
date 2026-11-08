import enquiry from '../../lib/enquiry.cjs';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 const origin=request.headers.get('Origin');
 if(origin&&origin!==new URL(request.url).origin)return json({error:'Please send your enquiry from our website.'},403);
 if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Please send a valid enquiry.'},415);
 let input,validated;
 try{
  const raw=await request.text();
  if(new TextEncoder().encode(raw).length>30000)return json({error:'Your enquiry is too long. Please shorten your message.'},413);
  input=JSON.parse(raw);
  if(input?.website)return json({error:'Please leave the extra website field empty.'},400);
  validated=enquiry.validate(input);
 }catch(error){return json({error:error instanceof SyntaxError?'Please send a valid enquiry.':error.message},400);}
 if(!env.RESEND_API_KEY||!env.ENQUIRY_FROM||!env.ENQUIRY_TO)return json({error:'Online sending isn’t connected yet.'},503);
 if(env.ENQUIRY_RATE_LIMITER){
  const limit=await env.ENQUIRY_RATE_LIMITER.limit({key:request.headers.get('CF-Connecting-IP')||'unknown'});
  if(!limit.success)return json({error:'Please wait a moment before sending another enquiry.'},429);
 }
 try{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(validated.text));
  const id=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
  const response=await fetch('https://api.resend.com/emails',{
   method:'POST',signal:AbortSignal.timeout(12000),
   headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`trip-${id}`},
   body:JSON.stringify({from:env.ENQUIRY_FROM,to:[env.ENQUIRY_TO],reply_to:validated.form.email,subject:`Trip enquiry — ${validated.form.name}`,text:validated.text})
  });
  const result=await response.json();
  if(!response.ok||!result.id)return json({error:'We couldn’t send your enquiry right now.'},502);
  return json({accepted:true});
 }catch{return json({error:'We couldn’t confirm delivery to our email service. Please try again or use the email option below.'},502);}
}
