/**
 * Client-side helper for calling the server-side Gemini proxy.
 *
 * IMPORTANT
 * - Never call the Gemini API directly from the browser.
 * - Call /api/gemini which runs server-side and keeps the API key secret.
 */

export type GeminiProxyResponse = {
  text: string;
};

export async function askGemini(question: string): Promise<string> {
  const q = question.trim();
  if (!q) return '';

  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: q }),
  });

  if (!res.ok) {
    const details = await res.text().catch(() => '');
    throw new Error(details || `Gemini proxy failed (${res.status})`);
  }

  const data = (await res.json()) as GeminiProxyResponse;
  return data?.text ?? '';
}
