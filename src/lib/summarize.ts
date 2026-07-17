import sanitizeHtml from "sanitize-html";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
};

/**
 * 구글 뉴스 RSS는 제목/본문을 이중으로 HTML 인코딩해 보내는 경우가 많아
 * (예: "&amp;gt;" -> XML 파서가 한 번 디코딩 -> "&gt;") sanitize-html만으로는
 * 남은 엔티티가 그대로 남습니다. sanitize-html은 안전한 HTML 문자열을 반환할 뿐
 * 순수 텍스트로 디코딩하지는 않으므로, 태그 제거 후 엔티티를 직접 한 번 더 디코딩합니다.
 */
function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const isHex = entity[1] === "x" || entity[1] === "X";
      const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[entity] ?? match;
  });
}

/** HTML 태그를 제거하고 엔티티(&gt; 등)를 디코딩합니다. 제목 디코딩에도 재사용됩니다. */
export function stripHtml(html: string): string {
  const withoutTags = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  const decoded = decodeEntities(withoutTags);
  return decoded.replace(/\s+/g, " ").trim();
}

/**
 * 문장 부호 기준으로 나눠 앞부분 최대 3문장을 뽑는 무료(비 AI) 대체 요약.
 * 구글 뉴스 RSS처럼 본문 없이 제목과 동일한 텍스트만 제공되는 경우가 많으므로,
 * 억지로 3줄을 채우기 위해 같은 문장을 복제하지 않고 실제로 얻은 만큼만 반환합니다.
 */
function naiveSummary(rawText: string): string[] {
  const text = stripHtml(rawText);
  if (!text) return ["원문 기사에서 자세한 내용을 확인해 주세요."];

  const sentences = text
    .split(/(?<=[.!?다요]\s)|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const unique = [...new Set(sentences)];
  const picked = unique.slice(0, 3);
  const truncated = picked.map((s) => (s.length > 90 ? s.slice(0, 87) + "..." : s));

  return truncated.length > 0 ? truncated : [text.slice(0, 90)];
}

/**
 * Claude API를 이용해 한국어 3줄 요약을 생성합니다.
 * ANTHROPIC_API_KEY가 없거나 호출이 실패하면 무료 발췌 요약으로 자동 대체됩니다.
 */
export async function summarizeToThreeLines(
  title: string,
  rawText: string
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const plainText = stripHtml(rawText).slice(0, 4000);

  if (!apiKey || !plainText) {
    return naiveSummary(rawText);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `다음 기독교 관련 뉴스 기사를 한국어로 정확히 3줄로 요약해줘. 각 줄은 완결된 한 문장이고 핵심만 담아야 해. 번호나 불릿 없이 줄바꿈으로만 구분해서 응답해.\n\n제목: ${title}\n\n본문: ${plainText}`,
          },
        ],
      }),
      // ISR 재검증 중 호출되므로 타임아웃 대비 짧게 재시도 없이 실패 시 폴백
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) return naiveSummary(rawText);

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((b) => b.type === "text")?.text;
    if (!text) return naiveSummary(rawText);

    const lines = text
      .split("\n")
      .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 3);

    return lines.length === 3 ? lines : naiveSummary(rawText);
  } catch {
    return naiveSummary(rawText);
  }
}
