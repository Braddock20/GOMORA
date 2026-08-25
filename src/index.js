import { Hono } from "hono";
import { cors } from "hono/cors";
import posts from "./routes/posts.js";
import media from "./routes/media.js";
import { getConfig } from "./config.js";
import { corsHeaders } from "./lib/http.js";

const app=new Hono();
app.use("/*",async(c,next)=>{const origin=c.req.header("Origin")||"";const headers=corsHeaders(c.env,origin);if(c.req.method==="OPTIONS")return new Response(null,{status:204,headers});await next();Object.entries(headers).forEach(([k,v])=>c.res.headers.set(k,v));});
app.use("/*",async(c,next)=>{const origin=c.req.header("Origin")||"";const allowed=(c.env.CORS_ORIGIN||"*").trim();if(allowed!=="*"&&origin&&!allowed.split(",").map(x=>x.trim()).includes(origin))return c.json({error:"cors_denied"},403);await next();});
app.get("/health",c=>c.json({ok:true,ts:new Date().toISOString()}));
app.route("/posts",posts); app.route("/media",media);
app.notFound(c=>c.json({error:"not_found",path:c.req.path},404));
app.onError((e,c)=>{console.error(e);return c.json({error:"internal_error",message:c.env.NODE_ENV==="production"?undefined:e.message},500)});
export default app;
