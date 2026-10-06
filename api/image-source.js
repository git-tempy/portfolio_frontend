const STORAGE_HOST = 'br-cold-sun-b1ney4xj.storage.c-5.eu-central-1.aws.neon.tech';
const MAX_BYTES = 40 * 1024 * 1024;
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).end();
  let source;
  try { source = new URL(req.query.url); } catch { return res.status(400).end(); }
  if (source.protocol !== 'https:' || source.hostname !== STORAGE_HOST || source.port || source.username || source.password || !source.pathname.startsWith('/portfolio-media/uploads/')) return res.status(400).end();
  try {
    const response = await fetch(source, { redirect: 'error', signal: AbortSignal.timeout(10000) });
    const mime = response.headers.get('content-type')?.split(';')[0];
    if (!response.ok || !['image/jpeg', 'image/png', 'image/webp'].includes(mime)) return res.status(502).end();
    if (Number(response.headers.get('content-length')) > MAX_BYTES) { await response.body?.cancel(); return res.status(413).end(); }
    const reader = response.body.getReader(), chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > MAX_BYTES) { await reader.cancel(); return res.status(413).end(); }
      chunks.push(Buffer.from(value));
    }
    res.setHeader('Content-Type', mime);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(Buffer.concat(chunks, total));
  } catch { return res.status(502).end(); }
}
