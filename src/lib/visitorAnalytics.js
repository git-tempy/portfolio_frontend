let visitRequest;
let memoryDeviceId;

// Record each public page entry once. Local previews and admin visits are excluded.
export function deviceIdentity(storage) {
  let id;
  try { storage ||= localStorage; id = storage.getItem('desone-device-id'); } catch { /* Storage can be blocked. */ }
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id || '')) {
    id = memoryDeviceId || crypto.randomUUID();
    memoryDeviceId = id;
    try { storage.setItem('desone-device-id', id); } catch { /* Identity lasts only for this page. */ }
  }
  return id;
}

export function deviceType(agent = navigator.userAgent, touchPoints = navigator.maxTouchPoints) {
  if (/iPad|Tablet|PlayBook|Silk/i.test(agent) || (/Android/i.test(agent) && !/Mobile/i.test(agent)) || (/Macintosh/i.test(agent) && touchPoints > 1)) return 'tablet';
  return /Mobi|iPhone|Android/i.test(agent) ? 'mobile' : 'desktop';
}

export function recordVisit(baseUrl) {
  if (visitRequest) return visitRequest;
  visitRequest = fetch(baseUrl + '/api/visitor/log/', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({device_id: deviceIdentity(), device_type: deviceType()}), keepalive: true,
  }).then(response => {
    if (!response.ok) throw new Error('Visit could not be recorded');
  }).catch(() => { visitRequest = undefined; });
  return visitRequest;
}

