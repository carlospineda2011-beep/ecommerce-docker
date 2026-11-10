"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartCount() {
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return <Link href="/carrito">🛒 Carrito ({mounted ? count : 0})</Link>;
}