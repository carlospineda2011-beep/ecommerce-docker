import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getToken } from "@/lib/session";
import { getOrders } from "@/lib/api";

async function OrderList() {
  const token = await getToken();
  if (!token) redirect("/login");

  const orders = await getOrders(token);

  if (orders.length === 0) {
    return (
      <p>
        Todavía no tienes compras.{" "}
        <Link href="/productos" className="underline">Ir al catálogo</Link>
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Orden #{order.id}</span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                order.status === "paid" ? "bg-green-600 text-white" : "bg-yellow-500 text-black"
              }`}
            >
              {order.status === "paid" ? "Pagada" : "Pendiente"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString("es-SV")}
          </p>
          <ul className="mt-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.product?.name ?? `Producto #${item.product_id}`} × {item.quantity}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-bold text-right">${Number(order.total).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}

export default function HistorialPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis compras</h1>
      <Suspense fallback={<p>Cargando tus compras...</p>}>
        <OrderList />
      </Suspense>
    </main>
  );
}