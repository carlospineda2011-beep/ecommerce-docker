import { Product } from "@/types/product";
import { Order } from "@/types/order";

const API = process.env.API_BASE_URL;

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("No se pudieron cargar los productos");
  return res.json();
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${API}/products/${id}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("No se pudo cargar el producto");
  return res.json();
}

export async function getOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API}/orders`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store", //datos privados, no se deben cachear
  });
  if (!res.ok) throw new Error("No se pudieron cargar los pedidos");
  return res.json();
}