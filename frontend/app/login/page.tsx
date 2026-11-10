"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, {});

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Correo" required className="border rounded p-2" />
        <input name="password" type="password" placeholder="Contraseña" required className="border rounded p-2" />
        {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
        <button disabled={pending} className="bg-black text-white rounded p-2 disabled:opacity-50">
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tienes cuenta? <Link href="/registro" className="underline">Regístrate</Link>
      </p>
    </main>
  );
}