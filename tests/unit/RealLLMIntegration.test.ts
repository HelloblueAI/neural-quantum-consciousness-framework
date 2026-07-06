import { afterEach, describe, expect, it, vi } from 'vitest';
import { RealLLMIntegration } from '../../src/core/RealLLMIntegration';

describe('RealLLMIntegration BleuJS', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls BleuJS chat API first when key is set', async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        choices: [{ message: { content: 'Tehran is in Iran.' } }],
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const llm = new RealLLMIntegration(undefined, undefined, undefined, undefined, 'bleujs_sk_test');
    const result = await llm.answerQuestion('where is tehran', {
      systemPrompt: 'Be concise.',
      maxTokens: 256,
    });

    expect(result.answer).toBe('Tehran is in Iran.');
    expect(result.provider).toBe('bleujs');
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.bleujs.org/api/v1/chat');
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer bleujs_sk_test',
    });
  });

  it('is available when only BleuJS key is configured', () => {
    const llm = new RealLLMIntegration(undefined, undefined, undefined, undefined, 'bleujs_sk_test');
    expect(llm.isAvailable()).toBe(true);
    expect(llm.getAvailableModels()).toContain('bleujs-chat');
  });

  it('does not fall back to Anthropic when fallback is disabled', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('anthropic.com')) {
        return Response.json({ content: [{ text: 'Claude answer' }] });
      }
      return Response.json({ error: 'service unavailable' }, { status: 503 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const llm = new RealLLMIntegration(
      'anthropic_sk_test',
      undefined,
      undefined,
      undefined,
      'bleujs_sk_test',
      undefined,
      false
    );

    await expect(llm.answerQuestion('hi')).rejects.toThrow(/BleuJS API error: 503/);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect((fetchMock.mock.calls[0] as [string])[0]).toContain('bleujs.org');
  });

  it('falls back to Anthropic when fallback is enabled', async () => {
    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('anthropic.com')) {
        return Response.json({ content: [{ text: 'Claude answer' }] });
      }
      return Response.json({ error: 'service unavailable' }, { status: 503 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const llm = new RealLLMIntegration(
      'anthropic_sk_test',
      undefined,
      undefined,
      undefined,
      'bleujs_sk_test',
      undefined,
      true
    );

    const result = await llm.answerQuestion('hi');
    expect(result.provider).toBe('anthropic');
    expect(result.answer).toBe('Claude answer');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
