<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Ecommerce API",
    version: "1.0.0",
    description: "API REST para gestión de e-commerce básico"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]

abstract class Controller
{
    //
}
