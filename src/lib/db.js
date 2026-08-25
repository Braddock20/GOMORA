import { neon } from "@neondatabase/serverless";

export function db(env) {
  if (!env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
  return neon(env.DATABASE_URL);
}

export function rowPost(r) {
  return {
    id: r.id, content: r.content, parent_id: r.parentId, tags: r.tags || [],
    media: r.media || [], created_at: r.createdAt, updated_at: r.updatedAt
  };
}
