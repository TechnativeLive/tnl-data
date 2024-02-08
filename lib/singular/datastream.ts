export function updateDatastream(
  privateKey: string,
  body: Record<string, unknown>,
  customMessage?: unknown,
) {
  return fetch(`https://datastream.singular.live/datastreams/${privateKey}`, {
    body: JSON.stringify(customMessage ? { ...body, message: customMessage } : body),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });
}
