import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Rate limiting simples em memória
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 10; // 10 requisições por minuto

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

export async function GET(req) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em instantes." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const subscriptionId = searchParams.get("subscription_id");

    // Validação de formato do subscription_id (começa com "sub_")
    if (!subscriptionId || typeof subscriptionId !== "string" || !subscriptionId.startsWith("sub_")) {
      return NextResponse.json(
        { error: "Parâmetro inválido." },
        { status: 400 }
      );
    }

    // Limitar tamanho do subscription_id
    if (subscriptionId.length > 200) {
      return NextResponse.json(
        { error: "Parâmetro inválido." },
        { status: 400 }
      );
    }

    // Buscar a assinatura no Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Considerar ativa apenas se status for active ou trialing
    const isActive = ["active", "trialing"].includes(subscription.status);

    return NextResponse.json({
      active: isActive,
      status: subscription.status
    });
  } catch (error) {
    // Em caso de erro (ex: assinatura deletada), assume inativa
    // Não expor detalhes do erro interno
    return NextResponse.json({
      active: false,
      error: "Erro ao verificar status da assinatura."
    });
  }
}
