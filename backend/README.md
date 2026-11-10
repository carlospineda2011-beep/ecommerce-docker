# Ecommerce API

API REST para un e-commerce básico desarrollada con Laravel 12. Permite gestionar clientes, catálogo de productos, y procesar compras mediante Stripe.

## Requisitos

- PHP 8.2 o superior
- Composer
- MySQL
- Cuenta de Stripe (modo test)

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repo>
cd ecommerce-api

2.	Instalar dependencias:
composer install

3.	Copiar el archivo de entorno y generar la clave de la app:
cp .env.example .env
php artisan key:generate

4.	Configurar la base de datos en .env:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_api
DB_USERNAME=root
DB_PASSWORD=

5.	Configurar las claves de Stripe en .env (obtenidas desde tu dashboard de Stripe en modo test):
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...

6.	Generar la clave JWT:
php artisan jwt:secret

7.	Correr las migraciones y poblar la base de datos:
php artisan migrate
php artisan db:seed --class=ProductSeeder

8.	Generar la documentación Swagger:
php artisan l5-swagger:generate

9.	Iniciar el servidor:
   Php artisan serve 

Documentación de la API

Disponible en: http://127.0.0.1:8000/api/documentation

Endpoints principales

Método	Ruta	Descripción	Auth
POST	/api/register	Registrar usuario	No
POST	/api/login	Iniciar sesión	No
GET	/api/products	Listar productos	No
GET	/api/products/{id}	Ver un producto	No
POST	/api/products	Crear producto	Sí
PUT	/api/products/{id}	Editar producto	Sí
DELETE	/api/products/{id}	Eliminar producto	Sí
POST	/api/orders	Crear orden de compra	Sí
GET	/api/orders	Ver historial de órdenes	Sí
POST	/api/payments	Procesar pago con Stripe	Sí

Autenticación

La API usa JWT. Después de iniciar sesión, incluye el token en el header:

Authorization: Bearer {token}

👨‍💻 Autor: Carlos Peña
Proyecto desarrollado como parte del Bootcamp Full Stack Junior — Kodigo.

