export function updateDatasream(privateKey: string, body: Record<string, unknown>) {
  return fetch(`https://datastream.singular.live/datastreams/${privateKey}`, {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });
}
