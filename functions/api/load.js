/*
GET /api/load?uid=<uid>
Authorization: Bearer <token>
*/

import { verifyJWT } from "./jwt.js";

export async function onRequestGet(context) {
  const { request, env, params } = context;
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

  const raw = await EAGLE_KV.get(`save:${uid}`);
  if (!raw) return new Response(JSON.stringify({ found: false }), { status: 200, headers: { "Content-Type": "application/json" } });

  return new Response(raw, { status: 200, headers: { "Content-Type": "application/json" } });
}
