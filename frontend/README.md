# Mi Tienda – Frontend E-commerce en Next.js

Frontend en **Next.js 16 (App Router) + TypeScript + Tailwind** que consume la API REST
de e-commerce creada en Laravel 12 (JWT + Swagger + Stripe). Implementa el flujo completo
de compra: catálogo → carrito → orden → pago → historial.

## Configuración de variables de entorno

Copia `.env.example` como `.env.local`:

```
API_BASE_URL=http://127.0.0.1:8000/api
```

La variable no usa el prefijo `NEXT_PUBLIC_`, así que solo existe en el servidor:
el navegador nunca conoce la URL de la API ni el token.

## Pasos para ejecutar

1. Levantar la API Laravel (`ecommerce-api`): `php artisan serve`
2. Instalar dependencias: `npm install`
3. Crear `.env.local` (ver arriba)
4. Modo desarrollo: `npm run dev`
5. Modo producción: `npm run build` y luego `npm start`
6. Abrir http://localhost:3000/productos

## Rutas implementadas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/productos` | Pública | Catálogo (Server Component + Suspense) |
| `/productos/[id]` | Pública | Detalle de producto |
| `/registro` | Pública | Registro (Server Action) |
| `/login` | Pública | Inicio de sesión (Server Action) |
| `/carrito` | Pública | Carrito con estado local (Context + localStorage) |
| `/checkout` | Protegida | Crea la orden y paga con Stripe (Server Action) |
| `/checkout/exito` | Protegida | Confirmación de compra |
| `/historial` | Protegida | Órdenes del usuario (Suspense) |

## Decisiones técnicas

- **Lecturas:** Server Components con `fetch` en el servidor.
- **Mutaciones:** Server Actions para login, registro, crear orden y pago.
- **Seguridad del token:** el JWT se guarda en una cookie `httpOnly` y `sameSite=lax`,
  inaccesible desde JavaScript del navegador.
- **Rutas protegidas:** `proxy.ts` redirige a `/login` si no hay sesión.
- **Precios seguros:** al crear la orden solo se envían `product_id` y `quantity`;
  la API calcula el total con los precios de la base de datos.
- **UI actualizada tras mutaciones:** `revalidatePath()` en catálogo, detalle e historial.
- **Caché:** el catálogo se revalida cada 60 s; el historial usa `no-store` por ser
  información privada.
- **Resiliencia:** `loading.tsx` y `error.tsx` en catálogo y checkout, y `Suspense`
  en el catálogo y el historial.

## Endpoints consumidos

`GET /products`, `GET /products/{id}`, `POST /register`, `POST /login`,
`POST /orders`, `GET /orders`, `POST /payments`

## Evidencias

Las capturas están en la carpeta `/evidencias`: Swagger, flujo de compra y Lighthouse.