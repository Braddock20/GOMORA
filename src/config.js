export function getConfig(env) {
  const n = (v, d) => { const x = Number(v); return Number.isFinite(x) && x > 0 ? x : d; };
  return {
    DATABASE_URL: env.DATABASE_URL || "",
    B2: {
      KEY_ID: env.B2_KEY_ID || "",
      APPLICATION_KEY: env.B2_APPLICATION_KEY || "",
      BUCKET: env.B2_BUCKET_NAME || "glass-journal",
      ENDPOINT: env.B2_ENDPOINT || "https://s3.us-west-004.backblazeb2.com",
      REGION: env.B2_REGION || "us-west-004"
    },
    CORS_ORIGIN: (env.CORS_ORIGIN || "*").trim(),
    MAX_UPLOAD_BYTES: n(env.MAX_UPLOAD_BYTES, 100 * 1024 * 1024),
    SIGNED_URL_EXPIRES: n(env.SIGNED_URL_EXPIRES, 3600)
  };
}
