"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";

export default function RegistroPage() {
  const [state, formAction, pending] = useActionState(registerAction, {});

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
      <form action={formAction} className="flex flex-col gap-3">
        <input name="name" placeholder="Nombre" required className="border rounded p-2" />
        <input name="email" type="email" placeholder="Correo" required className="border rounded p-2" />
        <input name="password" type="password" placeholder="Contraseña (mín. 8)" required className="border rounded p-2" />
        <input name="password_confirmation" type="password" placeholder="Confirmar contraseña" required className="border rounded p-2" />
        {state.error && <p className="text-red-600 text-sm">{state.error}</p>}
        <button disabled={pending} className="bg-black text-white rounded p-2 disabled:opacity-50">
          {pending ? "Creando..." : "Registrarme"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tienes cuenta? <Link href="/login" className="underline">Inicia sesión</Link>
      </p>
    </main>
  );
}