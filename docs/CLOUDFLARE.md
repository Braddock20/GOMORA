# Cloudflare deployment notes

Use Cloudflare Workers for the API. The free Workers plan currently allows 100,000 requests/day and Cloudflare Free request bodies are limited to 100 MB. Keep large media uploads direct-to-B2 rather than proxying them through the Worker.
