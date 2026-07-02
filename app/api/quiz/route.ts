import { NextResponse } from "next/server";
import { directionsData } from "@/data/directions.js";
import { landingsData } from "@/data/landings.js";

export const dynamic = "force-dynamic";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
// Базовый URL. На проде указывает на relay (mod.genpic.ai) — РФ-IP блокируется Anthropic (403).
// Relay пересылает запрос и сам подставляет ключ. Переменные совместимы с genpic.
const BASE_URL = (process.env.ANTHROPIC_API_BASE || process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(/\/+$/, "");

function catalog() {
  const dirs = (directionsData as { slug: string; title: string; offer: string }[]).map((d) => ({
    slug: d.slug,
    name: d.title,
    about: d.offer,
  }));
  const lands = (landingsData as { slug: string; h1: string; description: string }[]).map((l) => ({
    slug: l.slug,
    name: l.h1,
    about: l.description,
  }));
  // языки — хаб; для подбора используем конкретные, поэтому убираем общий хаб
  return [...dirs, ...lands].filter((c) => c.slug !== "languages");
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY || "";
  const relayToken = process.env.ANTHROPIC_RELAY_TOKEN || "";
  if (!apiKey && !relayToken) return NextResponse.json({ error: "AI_DISABLED" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
  }
  const answers = String(body?.answers ?? "").trim().slice(0, 800);
  if (!answers) return NextResponse.json({ error: "NO_ANSWERS" }, { status: 400 });

  const list = catalog();
  const system = `Ты — доброжелательный консультант онлайн-школы развития детей «Разумейка». По ответам родителя подбери ОДНО наиболее подходящее направление СТРОГО из списка ниже и тёпло объясни выбор простым языком (2–3 предложения, по-русски, обращение на «вы»). Пиши только про школу и её направления, ничего постороннего.

СПИСОК НАПРАВЛЕНИЙ (slug выбирай строго отсюда):
${list.map((c) => `- ${c.slug} — ${c.name}: ${c.about}`).join("\n")}

Верни СТРОГО валидный JSON без markdown и пояснений в формате:
{"slug":"<slug из списка>","title":"<название направления>","reason":"<почему подходит именно этому ребёнку, 2-3 предложения>"}`;

  try {
    const r = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        // relay сам подставит ключ Anthropic (x-relay-token); при прямом доступе — x-api-key
        ...(relayToken ? { "x-relay-token": relayToken } : {}),
        ...(apiKey ? { "x-api-key": apiKey } : {}),
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "extended-cache-ttl-2025-04-11",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system,
        messages: [{ role: "user", content: `Ответы родителя: ${answers}` }],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error("[quiz] anthropic", r.status, t.slice(0, 300));
      return NextResponse.json({ error: "AI_ERROR", status: r.status, detail: t.slice(0, 250) }, { status: 502 });
    }

    const data = await r.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    let rec: { slug?: string; title?: string; reason?: string } | null = null;
    if (match) {
      try {
        rec = JSON.parse(match[0]);
      } catch {
        rec = null;
      }
    }

    const valid = rec?.slug ? list.find((c) => c.slug === rec!.slug) : null;
    if (!valid) {
      return NextResponse.json({ error: "AI_PARSE", detail: text.slice(0, 250) }, { status: 502 });
    }

    return NextResponse.json({ slug: valid.slug, title: valid.name, reason: rec?.reason ?? "" });
  } catch (e) {
    console.error("[quiz] error", e);
    return NextResponse.json({ error: "AI_ERROR", detail: String(e).slice(0, 250) }, { status: 502 });
  }
}
