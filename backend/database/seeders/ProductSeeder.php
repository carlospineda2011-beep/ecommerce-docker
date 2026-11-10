<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

    \App\Models\Product::create(['name' => 'Camiseta básica', 'category' => 'Ropa', 'price' => 15.99, 'stock' => 50]);
    \App\Models\Product::create(['name' => 'Laptop HP', 'category' => 'Tecnología', 'price' => 899.99, 'stock' => 10]);
    \App\Models\Product::create(['name' => 'Audífonos Bluetooth', 'category' => 'Tecnología', 'price' => 45.50, 'stock' => 30]);
    \App\Models\Product::create(['name' => 'Zapatos deportivos', 'category' => 'Ropa', 'price' => 65.00, 'stock' => 20]);
    \App\Models\Product::create(['name' => 'Mochila urbana', 'category' => 'Accesorios', 'price' => 35.75, 'stock' => 25]);
    }
}
