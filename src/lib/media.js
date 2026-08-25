import { fileTypeFromBuffer } from "file-type";

const ALLOWED = [
  { mimes:["image/jpeg","image/png","image/gif","image/webp","image/svg+xml"], kind:"image" },
  { mimes:["video/mp4","video/quicktime","video/webm","video/x-matroska","video/x-msvideo"], kind:"video" },
  { mimes:["audio/mpeg","audio/mp4","audio/webm","audio/ogg","audio/wav","audio/x-wav","audio/aac","audio/flac","audio/x-m4a"], kind:"audio" },
  { mimes:["application/vnd.android.package-archive","application/java-archive"], kind:"apk" },
  { mimes:["application/pdf","application/zip","application/x-zip-compressed"], kind:"file" }
];
export const ALLOWED_MIMES = ALLOWED.flatMap(x=>x.mimes);

export async function detectMediaType(bytes, hintedMime="") {
  if (!bytes?.length) return {ok:false, reason:"empty_file"};
  const detected = await fileTypeFromBuffer(bytes);
  const mime = detected?.mime || hintedMime || "application/octet-stream";
  const group = ALLOWED.find(x=>x.mimes.includes(mime));
  if (group) return {ok:true, mime, ext:detected?.ext || "bin", kind:group.kind};
  return {ok:false, reason:`unsupported_type:${mime}`, mime};
}
export function finalizeMediaType(kind, filename) {
  if (kind === "audio" && /voice|voicenote|voice-note|recording/i.test(filename || "")) return "voice_note";
  return kind;
}
export function sanitizeFilenameForKey(name) {
  return String(name || "file").replace(/[^a-zA-Z0-9._-]+/g,"_").slice(0,120) || "file";
}
