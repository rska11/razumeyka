import crypto from "crypto";

const API = "https://api.yookassa.ru/v3/payments";

export function isYooKassaConfigured(): boolean {
  return Boolean(
    (process.env.YOOKASSA_SHOP_ID ?? "").trim() && (process.env.YOOKASSA_SECRET_KEY ?? "").trim(),
  );
}

function authHeader(): string {
  const id = (process.env.YOOKASSA_SHOP_ID ?? "").trim();
  const key = (process.env.YOOKASSA_SECRET_KEY ?? "").trim();
  return "Basic " + Buffer.from(`${id}:${key}`).toString("base64");
}

type CreateInput = {
  amountRub: number;
  description: string;
  returnUrl: string;
  metadata: Record<string, string>;
  customerEmail?: string;
};

type YkPayment = {
  id: string;
  status?: string;
  confirmation?: { confirmation_url?: string };
  metadata?: Record<string, string>;
};

export async function createYooKassaPayment(input: CreateInput): Promise<YkPayment> {
  const value = Number(input.amountRub).toFixed(2);
  const payload: Record<string, unknown> = {
    amount: { value, currency: "RUB" },
    capture: true,
    description: input.description,
    confirmation: { type: "redirect", return_url: input.returnUrl },
    metadata: input.metadata,
  };

  if ((process.env.YOOKASSA_TEST_MODE ?? "").toLowerCase() === "true") {
    payload.test = true;
  }

  // Фискальный чек (54-ФЗ) — включается через YOOKASSA_RECEIPT=true, нужен email клиента
  if ((process.env.YOOKASSA_RECEIPT ?? "").toLowerCase() === "true" && input.customerEmail) {
    payload.receipt = {
      customer: { email: input.customerEmail },
      items: [
        {
          description: input.description.slice(0, 128),
          quantity: "1.00",
          amount: { value, currency: "RUB" },
          vat_code: Number(process.env.YOOKASSA_VAT_CODE ?? "1"),
          payment_mode: "full_payment",
          payment_subject: "service",
        },
      ],
    };
  }

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (!res.ok || !(json as YkPayment)?.id) {
    const msg =
      (json as { description?: string })?.description ||
      (json as { message?: string })?.message ||
      `YooKassa error (${res.status})`;
    throw new Error(msg);
  }
  return json as YkPayment;
}

export async function getYooKassaPayment(id: string): Promise<YkPayment> {
  const res = await fetch(`${API}/${encodeURIComponent(id)}`, {
    headers: { Authorization: authHeader(), "Content-Type": "application/json" },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (!res.ok) {
    const msg = (json as { description?: string })?.description || `YooKassa error (${res.status})`;
    throw new Error(msg);
  }
  return json as YkPayment;
}
