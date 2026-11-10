<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
    path: "/api/register",
    summary: "Registrar usuario",
    tags: ["Auth"],
    requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
        required: ["name", "email", "password", "password_confirmation"],
        properties: [
            new OA\Property(property: "name", type: "string", example: "Carlos"),
            new OA\Property(property: "email", type: "string", example: "carlos@test.com"),
            new OA\Property(property: "password", type: "string", example: "password123"),
            new OA\Property(property: "password_confirmation", type: "string", example: "password123")
        ]
    )),
    responses: [
        new OA\Response(response: 201, description: "Usuario creado, devuelve user y token"),
        new OA\Response(response: 422, description: "Datos inválidos")
    ]
)]


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    #[OA\Post(
    path: "/api/login",
    summary: "Iniciar sesión",
    tags: ["Auth"],
    requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
        required: ["email", "password"],
        properties: [
            new OA\Property(property: "email", type: "string", example: "carlos@test.com"),
            new OA\Property(property: "password", type: "string", example: "password123")
        ]
    )),
    responses: [
        new OA\Response(response: 200, description: "Devuelve user y token"),
        new OA\Response(response: 401, description: "Credenciales inválidas")
    ]
)]

    public function login(Request $request)
    {

        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $credentials = $request->only('email', 'password');

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Credenciales Invalidas'], 401);
        }

        return response()->json([
            'user' => Auth::guard('api')->user(), 
            'token' => $token]);
    }
}
