import Link from "next/link";
import { getToken } from "@/lib/session";
import { getOrders } from "@/lib/api";

export default async function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ orden?: string }>;
}) {
  const { orden } = await searchParams;
  const token = await getToken();
  const orders = token ? await getOrders(token) : [];
  const order = orders.find((o) => o.id === Number(orden));

  if (!order) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p>No encontramos esa orden.</p>
        <Link href="/historial" className="underline">Ver mis compras</Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ ¡Pago exitoso!</h1>
      <p className="mt-4">Orden #{order.id}</p>
      <p className="text-2xl font-bold mt-2">${Number(order.total).toFixed(2)}</p>
      <p className="text-sm text-gray-500 mt-2">Estado: {order.status}</p>
      {order.payment && (
        <p className="text-xs text-gray-500 mt-1">Stripe: {order.payment.stripe_payment_id}</p>
      )}
      <div className="flex gap-4 justify-center mt-8">
        <Link href="/productos" className="underline">Seguir comprando</Link>
        <Link href="/historial" className="underline">Ver mis compras</Link>
      </div>
    </main>
  );
}