<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('order_items', function (Blueprint $table) {
        if (!Schema::hasColumn('order_items', 'order_id')) {
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
        }
        if (!Schema::hasColumn('order_items', 'product_id')) {
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
        }
        if (!Schema::hasColumn('order_items', 'quantity')) {
            $table->integer('quantity');
        }
        if (!Schema::hasColumn('order_items', 'price')) {
            $table->decimal('price', 10, 2);
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['order_id', 'product_id', 'quantity', 'price']);
        });
    }
};
