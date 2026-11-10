<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

class OrderController extends Controller
{
    #[OA\Post(
    path: "/api/orders",
    summary: "Crear una orden",
    tags: ["Orders"],
    security: [["bearerAuth" => []]],
    requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
        required: ["items"],
        properties: [
            new OA\Property(property: "items", type: "array", items: new OA\Items(
                properties: [
                    new OA\Property(property: "product_id", type: "integer", example: 1),
                    new OA\Property(property: "quantity", type: "integer", example: 2)
                ]
            ))
        ]
    )),
    responses: [
        new OA\Response(response: 201, description: "Orden creada"),
        new OA\Response(response: 400, description: "Stock insuficiente"),
        new OA\Response(response: 401, description: "No autenticado")
    ]
)]
    public function store(Request $request){

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $total = 0;
            $products = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    return response()->json(['error' => 'Stock insuficiente para el producto: ' . $product->name], 400);
                }
                $total += $product->price * $item['quantity'];
                $products[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price];
            }
            $order = Order::create([
                'user_id' => auth()->user()->id,
                'total' => $total,
                'status' => 'pending']);

            foreach ($products as $entry) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $entry['product']->id,
                    'quantity' => $entry['quantity'],
                    'price' => $entry['price']]);

                $entry['product']->decrement('stock', $entry['quantity']);
            }
            return response()->json($order->load('items'), 201);
        });
    }

    #[OA\Get(
    path: "/api/orders",
    summary: "Historial de órdenes del usuario",
    tags: ["Orders"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Lista de órdenes"),
        new OA\Response(response: 401, description: "No autenticado")
    ]
)]

    public function index()
    {
        $orders = Order::where('user_id', auth()->user()->id)
        ->with(['items.product', 'payment'])
        ->orderBy('created_at', 'desc')
        ->get();
        return response()->json($orders);
    }
}
