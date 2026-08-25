import fs from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
const url=process.env.DATABASE_URL;if(!url)throw new Error("DATABASE_URL required");
const sql=neon(url);
for (const name of ["001_init.sql","002_add_media_key.sql"]) {
  const text=await fs.readFile(new URL(`../migrations/${name}`,import.meta.url),"utf8");
  for(const statement of text.split(";").map(x=>x.trim()).filter(Boolean)) await sql.query(statement,[]);
  console.log(name,"applied");
}
