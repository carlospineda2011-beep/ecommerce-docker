"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CarritoPage() {
  const { items, addItem, removeItem, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link href="/productos" className="underline">Ver catálogo</Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>
      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="py-3 flex items-center gap-3">
            <span className="flex-1">{item.name}</span>
            <button onClick={() => removeItem(item.id)} className="border rounded w-8 h-8">−</button>
            <span>{item.quantity}</span>
            <button onClick={() => addItem(item)} className="border rounded w-8 h-8">+</button>
            <span className="w-24 text-right">${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="text-xl font-bold text-right mt-4">Total: ${total.toFixed(2)}</p>
      <div className="flex justify-between mt-6">
        <button onClick={clearCart} className="underline text-sm">Vaciar carrito</button>
        <Link href="/checkout" className="px-4 py-2 bg-black text-white rounded">Ir a pagar</Link>
      </div>
    </main>
  );
}