<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    
    ->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Throwable $e, $request) {
        if ($request->is('api/*')) {
            $status = 500;
            $message = 'Error interno del servidor';

            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                $status = 404;
                $message = 'Recurso no encontrado';
            } elseif ($e instanceof \Illuminate\Auth\AuthenticationException) {
                $status = 401;
                $message = 'No autenticado';
            } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $e->errors(),
                ], 422);
            } elseif ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                $status = 403;
                $message = 'No autorizado';
            } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                $status = 404;
                $message = 'Ruta no encontrada';
            }

            return response()->json(['message' => $message], $status);
        }
    });
})->create();
