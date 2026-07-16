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
    const sessionId = searchParams.get("session_id");

    // Validação de formato do session_id (começa com "cs_")
    if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Parâmetro inválido." },
        { status: 400 }
      );
    }

    // Limitar tamanho do session_id
    if (sessionId.length > 200) {
      return NextResponse.json(
        { error: "Parâmetro inválido." },
        { status: 400 }
      );
    }

    // Buscar a sessão no Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid" || session.status === "complete") {
      return NextResponse.json({
        success: true,
        email: session.customer_details?.email,
        subscription: session.subscription
      });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    // Não expor detalhes do erro interno
    return NextResponse.json(
      { error: "Erro ao verificar status do pagamento." },
      { status: 500 }
    );
  }
}
