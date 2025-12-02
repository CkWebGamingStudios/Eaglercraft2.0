import { sha256Hex } from "./_helpers.js";
import { createJWT } from "./jwt.js";

/*
POST /api/login
body: { email, password }
Response:
  200 { token, uid, email }
  401 invalid
*/

export async function onRequestPost(context) {
  const { request, env } = context;
  const EAGLE_KV = env.EAGLE_KV;
  const JWT_SECRET = env.JWT_SECRET;
  if (!EAGLE_KV || !JWT_SECRET) return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });

  const body = await request.json().catch(() => null);
  if (!body || !body.email || !body.password) return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });

  const email = body.email.toLowerCase();
  const userKey = `user:${email}`;
  const raw = await EAGLE_KV.get(userKey);
  if (!raw) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  const user = JSON.parse(raw);
  const hash = await sha256Hex(user.salt + ":" + body.password);
  if (hash !== user.passHash) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

  const token = await createJWT({ uid: user.uid, email: user.email }, JWT_SECRET, 60 * 60 * 24 * 7); // 7d
  return new Response(JSON.stringify({ token, uid: user.uid, email: user.email }), { status: 200, headers: { "Content-Type": "application/json" } });
}
