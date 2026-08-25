const base=process.env.API_BASE_URL||"http://127.0.0.1:8787";
const r=await fetch(base+"/health");if(!r.ok)throw new Error("health failed "+r.status);console.log(await r.json());
const a=await fetch(base+"/media/allowed-mimes");if(!a.ok)throw new Error("allowed-mimes failed");console.log("allowed-mimes ok");
const p=await fetch(base+"/posts?limit=5");if(!p.ok)throw new Error("posts failed "+p.status);console.log("posts ok",(await p.json()).posts.length);
