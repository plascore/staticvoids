export async function onRequest(context) {
  const { request, env } = context;
  const kv = env.NOTES_KV;  // Bind this KV in Cloudflare Dashboard
  const key = 'shared_notes';

  if (request.method === 'GET') {
    const notes = await kv.get(key) || '';
    return new Response(JSON.stringify({ notes }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'POST') {
    const body = await request.json();
    await kv.put(key, body.notes || '');
    return new Response(JSON.stringify({ status: 'ok' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (request.method === 'DELETE') {
    await kv.delete(key);
    return new Response(JSON.stringify({ status: 'deleted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
