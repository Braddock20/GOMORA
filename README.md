# THREAD — Cloudflare Workers Edition

This is the Cloudflare-ready conversion of the uploaded THREAD/Glass Journal API.

## Architecture
- API: Cloudflare Workers + Hono
- Database: Neon PostgreSQL via `@neondatabase/serverless`
- Object storage: Backblaze B2 S3-compatible API using Web Crypto signing
- Migrations: raw PostgreSQL SQL (the original Prisma migration is preserved)

Cloudflare Workers is request-driven rather than a permanently running Node process. The API is therefore available continuously without a sleeping Render instance.

## Important upload change
Cloudflare Free currently caps request bodies at 100 MB. The legacy multipart endpoint is therefore configured to 100 MB by default. For large videos/files, use B2 direct uploads rather than sending the bytes through the Worker. The conversion keeps `/media/upload` for compatibility and can be extended with a true browser-to-B2 multipart uploader.

## Deploy
1. Create a Neon PostgreSQL database and keep the existing schema/migration.
2. Create a private Backblaze B2 bucket and an application key with the required bucket permissions.
3. `npm install`
4. `DATABASE_URL=... npm run db:migrate`
5. `npx wrangler login`
6. `npx wrangler secret put DATABASE_URL` and repeat for `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_NAME`, `B2_ENDPOINT`, `B2_REGION`, `CORS_ORIGIN`, `MAX_UPLOAD_BYTES`, `SIGNED_URL_EXPIRES`.
7. `npm run deploy`

## Local
Copy `.dev.vars.example` to `.dev.vars`, fill values, then `npm run dev`.

## API
The original endpoints remain:
- GET `/health`
- POST `/posts`
- GET `/posts?cursor=&limit=`
- GET `/posts/:id`
- PATCH `/posts/:id`
- DELETE `/posts/:id`
- GET `/posts/search?q=&tag=&type=`
- GET `/posts/tags/:tag`
- POST `/media/upload`
- GET `/media/allowed-mimes`
- GET `/media/blob/:key`

Also included: POST `/media/presign` as the basis for direct-to-B2 uploads.
