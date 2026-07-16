import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Rate limiting simples em memória
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 5; // 5 checkouts por minuto (mais restritivo)

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

export async function POST(req) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em instantes." },
        { status: 429 }
      );
    }

    const { plan } = await req.json();

    // Validação estrita do parâmetro plan
    if (!plan || typeof plan !== "string" || !["annual", "monthly"].includes(plan)) {
      return NextResponse.json(
        { error: "Parâmetro 'plan' inválido." },
        { status: 400 }
      );
    }

    // Obter o Price ID correspondente
    let priceId = process.env.STRIPE_PRICE_ANNUAL;
    if (plan === "monthly") {
      priceId = process.env.STRIPE_PRICE_MONTHLY;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Configuração de pagamento indisponível." },
        { status: 503 }
      );
    }

    const origin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    // Criar a sessão de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // Não expor detalhes do erro interno
    return NextResponse.json(
      { error: "Erro ao processar o checkout." },
      { status: 500 }
    );
  }
}
