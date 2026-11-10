"use server";

import { revalidatePath } from "next/cache";
import { getToken } from "@/lib/session";

const API = process.env.API_BASE_URL;

type CheckoutItem = { product_id: number; quantity: number };
export type CheckoutResult = { ok: true; orderId: number } | { ok: false; error: string };

export async function checkoutAction(items: CheckoutItem[]): Promise<CheckoutResult> {
  const token = await getToken();
  if (!token) return { ok: false, error: "Debes iniciar sesión" };
  if (items.length === 0) return { ok: false, error: "Tu carrito está vacío" };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1. Crear la orden (la API calcula el total con los precios reales)
  const orderRes = await fetch(`${API}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify({ items }),
  });
  if (orderRes.status === 401) {
    return { ok: false, error: "Tu sesión expiró. Inicia sesión de nuevo." };
  }
  const order = await orderRes.json();
  if (!orderRes.ok) {
    return { ok: false, error: order.error ?? order.message ?? "No se pudo crear la orden" };
  }

  // 2. Pagar la orden con Stripe
  const payRes = await fetch(`${API}/payments`, {
    method: "POST",
    headers,
    body: JSON.stringify({ order_id: order.id }),
  });
  const payment = await payRes.json();
  if (!payRes.ok) {
    return { ok: false, error: payment.error ?? "El pago no se pudo procesar" };
  }

  // 3. Evitar pantallas desactualizadas: cambió el stock y el historial
  revalidatePath("/productos");
  revalidatePath("/productos/[id]", "page");
  revalidatePath("/historial");

  return { ok: true, orderId: order.id };
}