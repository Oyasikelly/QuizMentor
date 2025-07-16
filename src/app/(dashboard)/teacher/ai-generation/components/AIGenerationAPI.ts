export async function generateWithAI({
  type,
  prompt,
  settings,
  file,
}: {
  type: 'question' | 'explanation' | 'study' | 'assessment';
  prompt: string;
  settings: any;
  file?: string;
}) {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, prompt, settings, file }),
    });
    if (!res.ok) throw new Error('Failed to generate with AI');
    return await res.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
