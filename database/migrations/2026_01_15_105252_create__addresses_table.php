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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('address_type', ['Shipping', 'Billing', 'Both']);    
            $table->string('address_line1');
            $table->string('address_line2')->nullable();
            $table->string('city');
            $table->enum('province', [
                'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
                 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
                 ]);
            $table->string('postal_code',4);
            $table->string('country',100)->default('South Africa');
            $table->char('phone_number',10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
