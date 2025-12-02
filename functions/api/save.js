/*
POST /api/save
Headers: Authorization: Bearer <token>
Body: { data }  // arbitrary JSON serializable
Saves to KV key: save:<uid>
*/

import { verifyJWT } from "./jwt.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const EAGLE_KV = env.EAGLE_KV;
  const JWT_SECRET = env.JWT_SECRET;
  if (!EAGLE_KV || !JWT_SECRET) return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });

  const auth = request.headers.get("Authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/);
  if (!m) return new Response(JSON.stringify({ error: "Missing token" }), { status: 401 });
  const token = m[1];
  const payload = await verifyJWT(token, JWT_SECRET);
  if (!payload) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.data === "undefined") return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });

  const key = `save:${payload.uid}`;
  const value = {
    uid: payload.uid,
    data: body.data,
    updatedAt: Date.now()
  };

  await EAGLE_KV.put(key, JSON.stringify(value));
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
