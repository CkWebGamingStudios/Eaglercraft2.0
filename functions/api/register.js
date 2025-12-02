import { sha256Hex, randHex } from "./_helpers.js";

/*
POST /api/register
body: { email, password, displayName? }
Responses:
  201 { uid, email, displayName }
  400 bad request
  409 user exists
*/

export async function onRequestPost(context) {
  const { request, env } = context;
  const EAGLE_KV = env.EAGLE_KV;
  if (!EAGLE_KV) return new Response(JSON.stringify({ error: "KV not bound" }), { status: 500 });

  const body = await request.json().catch(() => null);
  if (!body || !body.email || !body.password) return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });

  const email = body.email.toLowerCase();
  const userKey = `user:${email}`;

  const exists = await EAGLE_KV.get(userKey);
  if (exists) return new Response(JSON.stringify({ error: "User already exists" }), { status: 409 });

  const salt = randHex(16);
  const passHash = await sha256Hex(salt + ":" + body.password);
  const uid = "u_" + randHex(12);

  const userObj = {
    uid,
    email,
    displayName: body.displayName || null,
    salt,
    passHash,
    createdAt: Date.now()
  };

  await EAGLE_KV.put(userKey, JSON.stringify(userObj));

  return new Response(JSON.stringify({ uid, email, displayName: userObj.displayName }), { status: 201, headers: { "Content-Type": "application/json" } });
}
