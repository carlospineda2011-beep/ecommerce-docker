<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use OpenApi\Attributes as OA;

class PaymentController extends Controller

{
    #[OA\Post(
    path: "/api/payments",
    summary: "Pagar una orden con Stripe",
    tags: ["Payments"],
    security: [["bearerAuth" => []]],
    requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
        required: ["order_id"],
        properties: [
            new OA\Property(property: "order_id", type: "integer", example: 1)
        ]
    )),
    responses: [
        new OA\Response(response: 201, description: "Pago exitoso"),
        new OA\Response(response: 403, description: "La orden no pertenece al usuario"),
        new OA\Response(response: 422, description: "La orden ya fue pagada")
    ]
)]
    public function store(Request $request)
    {
         $request->validate([
         'order_id' => 'required|exists:orders,id',
    ]);

    $order = Order::find($request->order_id);

    if ($order->user_id !== auth()->user()->id) {
        return response()->json(['error' => 'Esta order no te pertenece'], 403);
    }

    if ($order->status === 'paid') {
        return response()->json(['error' => 'Esta order ya fue pagada'], 422);
    }

    Stripe::setApiKey(config('services.stripe.secret'));

    $paymentIntent = PaymentIntent::create([
        'amount' => (int) ($order->total * 100), // Stripe expects the amount in cents
        'currency' => 'usd',
        'payment_method' => 'pm_card_visa', // For testing purposes.
        'confirm' => true,
        'automatic_payment_methods' => [
            'enabled' => true,
            'allow_redirects' => 'never',
        ],
    ]);


    return DB::transaction(function () use ($order, $paymentIntent) {
        $payment = Payment::create([
            'order_id' => $order->id,
            'stripe_payment_id' => $paymentIntent->id,
            'amount' => $order->total,
            'status' => $paymentIntent->status, // This will be 'succeeded' if the payment was successful
        ]);

        $order->update(['status' => 'paid']);

        return response()->json([
            'payment' => $payment,
            'order' => $order
        ], 201);
    });
    }


}
