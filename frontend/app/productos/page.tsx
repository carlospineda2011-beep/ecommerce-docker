import { Suspense } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";


async function ProductList() {
  const products = await getProducts();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
  <div key={p.id} className="border rounded-lg p-4 hover:shadow flex flex-col">
    <Link href={`/productos/${p.id}`} className="font-semibold hover:underline">
      {p.name}
    </Link>
    <p className="text-sm text-gray-500">{p.category ?? "Sin categoría"}</p>
    <p className="mt-2 font-bold">${Number(p.price).toFixed(2)}</p>
    <AddToCartButton id={p.id} name={p.name} price={Number(p.price)} stock={p.stock} />
  </div>
))}
    </div>
  );
}

export default function ProductosPage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>
      <Suspense fallback={<p>Cargando productos...</p>}>
        <ProductList />
      </Suspense>
    </main>
  );
}