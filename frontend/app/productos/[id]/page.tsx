import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-500">{product.category ?? "Sin categoría"}</p>
      <p className="mt-4">{product.description}</p>
      <p className="mt-4 text-2xl font-bold">${Number(product.price).toFixed(2)}</p>
      <p className="text-sm">Stock: {product.stock}</p>
    </main>
  );
}