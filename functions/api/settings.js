/*
POST /api/settings
GET  /api/settings?uid=<uid>
Uses key settings:<uid>
Authorization required
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
  if (!body || typeof body.settings === "undefined") return new Response(JSON.stringify({ error: "Missing settings" }), { status: 400 });

  const key = `settings:${payload.uid}`;
  const value = {
    uid: payload.uid,
    settings: body.settings,
    updatedAt: Date.now()
  };

  await EAGLE_KV.put(key, JSON.stringify(value));
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function onRequestGet(context) {
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

  const url = new URL(request.url);
  const uid = url.searchParams.get("uid") || payload.uid;

  const raw = await EAGLE_KV.get(`settings:${uid}`);
  if (!raw) return new Response(JSON.stringify({ found: false }), { status: 200, headers: { "Content-Type": "application/json" } });

  return new Response(raw, { status: 200, headers: { "Content-Type": "application/json" } });
}
