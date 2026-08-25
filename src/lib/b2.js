const te = new TextEncoder();
const hex = b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
async function sha256(data){ return crypto.subtle.digest("SHA-256", typeof data === "string" ? te.encode(data) : data); }
async function hmac(key,data){ const k=await crypto.subtle.importKey("raw", typeof key === "string"?te.encode(key):key,{name:"HMAC",hash:"SHA-256"},false,["sign"]); return crypto.subtle.sign("HMAC",k,typeof data === "string"?te.encode(data):data); }
async function signingKey(secret,date,region,service){ const kDate=await hmac("AWS4"+secret,date); const kRegion=await hmac(kDate,region); const kService=await hmac(kRegion,service); return hmac(kService,"aws4_request"); }
function enc(v){ return encodeURIComponent(v).replace(/[!'()*]/g,c=>`%${c.charCodeAt(0).toString(16).toUpperCase()}`); }
function canonicalQuery(params){ return [...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${enc(k)}=${enc(v)}`).join("&"); }
function pathFor(key){ return "/" + key.split("/").map(enc).join("/"); }
function endpoint(env){ return env.B2_ENDPOINT.replace(/\/$/,""); }
function hostFrom(url){ return new URL(url).host; }

export async function presign(env,{key,method="GET",expires=3600,contentType}){
  const region=env.B2_REGION, service="s3", host=hostFrom(endpoint(env));
  const now=new Date(), amz=now.toISOString().replace(/[-:]|\.\d{3}/g,"");
  const date=amz.slice(0,8), time=amz.slice(0,15)+"Z";
  const scope=`${date}/${region}/${service}/aws4_request`;
  const q=new URLSearchParams({"X-Amz-Algorithm":"AWS4-HMAC-SHA256","X-Amz-Credential":`${env.B2_KEY_ID}/${scope}`,"X-Amz-Date":time,"X-Amz-Expires":String(Math.min(Math.max(1,expires),604800)),"X-Amz-SignedHeaders":"host"});
  const canonicalUri=`/${env.B2_BUCKET_NAME}${pathFor(key)}`;
  const canonicalHeaders=`host:${host}\n`;
  const signedHeaders="host";
  const canonicalRequest=[method,canonicalUri,canonicalQuery(q),canonicalHeaders,signedHeaders,"UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign=["AWS4-HMAC-SHA256",time,scope,hex(await sha256(canonicalRequest))].join("\n");
  const sig=hex(await hmac(await signingKey(env.B2_APPLICATION_KEY,date,region,service),stringToSign));
  const url=`${endpoint(env)}${canonicalUri}?${canonicalQuery(q)}&X-Amz-Signature=${sig}`;
  return {url, contentType};
}

export async function upload(env,key,body,contentType){
  const {url}=await presign(env,{key,method:"PUT",expires:900,contentType});
  const r=await fetch(url,{method:"PUT",headers:{"Content-Type":contentType||"application/octet-stream"},body});
  if(!r.ok) throw new Error(`B2 upload failed: ${r.status} ${await r.text()}`);
}
export async function deleteObject(env,key){
  const {url}=await presign(env,{key,method:"DELETE",expires:300});
  const r=await fetch(url,{method:"DELETE"});
  if(!r.ok && r.status!==404) throw new Error(`B2 delete failed: ${r.status}`);
}
export async function signedGet(env,key,expires){ return (await presign(env,{key,method:"GET",expires})).url; }
export async function signedPut(env,key,expires=900){ return (await presign(env,{key,method:"PUT",expires})).url; }
