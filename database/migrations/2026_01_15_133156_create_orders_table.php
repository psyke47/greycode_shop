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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_address_id')->constrained('addresses')->onDelete('cascade');
            $table->foreignId('billing_address_id')->constrained('addresses')->onDelete('cascade');
            $table->enum('order_status', ['pending','paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']);
            $table->enum('payment_status', ['unpaid', 'paid','refunded']);
            $table->decimal('subtotal',12,2);
            $table->decimal('tax_amount', 12,2);
            $table->decimal('shipping_amount', 12,2);
            $table->decimal('discount_amount',12,2)->default(0);
            $table->decimal('total_amount',12,2);
            $table->string('payment_method');
            $table->text('notes')->nullable();
            $table->text('customer_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
