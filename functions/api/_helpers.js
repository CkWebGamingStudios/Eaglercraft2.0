// Helper utilities for functions
export const textEncoder = new TextEncoder();
export const textDecoder = new TextDecoder();

// base64url utilities
export function base64UrlEncode(buffer) {
  let b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlDecode(b64u) {
  b64u = b64u.replace(/-/g, "+").replace(/_/g, "/");
  // add padding if needed
  while (b64u.length % 4) b64u += "=";
  const binary = atob(b64u);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function hmacSha256(keyStr, msgStr) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(keyStr),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return await crypto.subtle.sign("HMAC", key, textEncoder.encode(msgStr));
}

export async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", textEncoder.encode(str));
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function randHex(len = 16) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("");
}
