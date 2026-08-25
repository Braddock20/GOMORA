export function corsHeaders(env, origin) {
  const allowed=(env.CORS_ORIGIN||"*").trim();
  const ok=allowed==="*" || allowed.split(",").map(x=>x.trim()).includes(origin||"");
  return ok ? {"Access-Control-Allow-Origin": allowed==="*"?"*":origin||"","Access-Control-Allow-Methods":"GET,POST,PATCH,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization,X-Requested-With,Accept,Origin,Range","Access-Control-Expose-Headers":"X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset","Access-Control-Max-Age":"86400"} : {};
}
export function json(c,data,status=200){ return c.json(data,status); }
