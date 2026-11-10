import Link from "next/link";
import { getToken } from "@/lib/session";
import { logoutAction } from "@/app/actions/auth";
import CartCount from "@/components/CartCount";

export default async function Header() {
  const token = await getToken();

  return (
    <header className="border-b">
      <nav className="max-w-5xl mx-auto p-4 flex items-center gap-4 text-sm">
        <Link href="/productos" className="font-bold text-lg mr-auto">Mi Tienda</Link>
        <CartCount />
        {token ? (
          <>
            <Link href="/historial">Mis compras</Link>
            <form action={logoutAction}>
              <button className="underline">Salir</button>
            </form>
          </>
        ) : (
          <Link href="/login">Ingresar</Link>
        )}
      </nav>
    </header>
  );
}