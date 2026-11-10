"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.API_BASE_URL;

export type AuthState = { error?: string };

async function saveToken(token: string) {
  const store = await cookies();
  store.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hora, igual que el JWT
  });
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  if (!res.ok) return { error: "Correo o contraseña incorrectos" };

  const data = await res.json();
  await saveToken(data.token);
  redirect("/productos");
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    }),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.message ?? "No se pudo registrar" };

  await saveToken(data.token);
  redirect("/productos");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete("token");
  redirect("/login");
}