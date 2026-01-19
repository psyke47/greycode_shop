<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'order_status',
        'payment_status',
        'subtotal',
        'tax_amount',
        'shipping_amount',
        'discount_amount',
        'total_amount',
        'payment_method',
        'notes',
        'customer_note',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }   
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

}
