"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

type Props = { id: number; name: string; price: number; stock: number };

export default function AddToCartButton({ id, name, price, stock }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (stock === 0) {
    return <p className="mt-6 text-red-600">Agotado</p>;
  }

  return (
    <button
      onClick={() => {
        addItem({ id, name, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="mt-6 px-4 py-2 bg-black text-white rounded"
    >
      {added ? "¡Agregado! ✅" : "Agregar al carrito"}
    </button>
  );
}