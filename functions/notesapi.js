export async function onRequest({ request, env }) {
  const kv = env.NOTES;
  const key = "shared_notes";

  try {
    if (request.method === "GET") {
      const notes = await kv.get(key) || "";
      return new Response(JSON.stringify({ notes }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "POST") {
      const body = await request.json(); // safe here
      await kv.put(key, body.notes || "");
      return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "DELETE") {
      await kv.delete(key);
      return new Response(JSON.stringify({ status: "deleted" }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
