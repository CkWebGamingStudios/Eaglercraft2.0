import { verifyJWT } from "./jwt.js";

/*
GET /api/me
Authorization: Bearer <token>
Returns user profile
*/

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

  const userRaw = await EAGLE_KV.get(`user:${payload.email}`);
  if (!userRaw) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  const user = JSON.parse(userRaw);
  // hide sensitive fields
  delete user.passHash;
  delete user.salt;
  return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
}
