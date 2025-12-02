import { base64UrlEncode, base64UrlDecode, hmacSha256 } from "./_helpers.js";

export async function createJWT(payloadObj, secret, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = Object.assign({}, payloadObj, {
    iat: now,
    exp: now + expiresInSeconds
  });

  const headerB = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const toSign = `${headerB}.${payloadB}`;
  const sigBuf = await hmacSha256(secret, toSign);
  const sig = base64UrlEncode(sigBuf);
  return `${toSign}.${sig}`;
}

export async function verifyJWT(token, secret) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB, payloadB, sigB] = parts;
    const toSign = `${headerB}.${payloadB}`;
    const expectedSigBuf = await hmacSha256(secret, toSign);
    const expectedSig = base64UrlEncode(expectedSigBuf);

    if (!timingSafeEqual(expectedSig, sigB)) return null;

    const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB));
    const payload = JSON.parse(payloadStr);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// constant-time compare
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}
