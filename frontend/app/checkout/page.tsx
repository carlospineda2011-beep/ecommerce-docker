"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { checkoutAction } from "@/app/actions/checkout";

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <main className="p-6">Cargando...</main>;

    if (items.length === 0) {
        return (
            <main className="max-w-3xl mx-auto p-6">
                <p>No hay productos en el carrito.</p>
                <Link href="/productos" className="underline">Ver productos</Link>
            </main>
        );
    }

    function handlePay() {
        setError(null);
        startTransition(async () => {
            const result = await checkoutAction(
                items.map((i) => ({ product_id: i.id, quantity: i.quantity }))
            );
            if (result.ok) {
                clearCart();
                router.push(`/checkout/exito?orden=${result.orderId}`);
            } else {
                setError(result.error);
            }
        });
    }

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Confirmar Compra</h1>
            <ul className="divide-y mb-4">
                {items.map((i) => (
                    <li key={i.id} className="py-2 flex justify-between">
                        <span>{i.name} x {i.quantity}</span>
                        <span>${(i.price * i.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <p className="text-xl font-bold text-right">Total: ${total.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-4">Se procesará el pago con Stripe.</p>
            {error && <p className="text-red-600 mt-4">{error}</p>}
            <button
                onClick={handlePay}
                disabled={isPending}
                className="mt-6 w-full bg-black text-white rounded p-3 disabled:opacity-50"
            >
                {isPending ? "Procesando..." : "Pagar con Stripe"}
            </button>
        </main> 
    );
}