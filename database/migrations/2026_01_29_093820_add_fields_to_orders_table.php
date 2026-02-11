<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add tracking and delivery fields
            $table->string('tracking_number')->nullable()->after('payment_method');
            $table->date('estimated_delivery')->nullable()->after('tracking_number');
            $table->date('delivery_date')->nullable()->after('estimated_delivery');
            
            // Add shipping method
            $table->string('shipping_method')->nullable()->after('shipping_amount');
            
            // Add indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index('order_status');
            $table->index('payment_status'); 
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['tracking_number', 'estimated_delivery', 'delivery_date', 'shipping_method']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['order_status']);
            $table->dropIndex(['payment_status']);
        });
    }
};