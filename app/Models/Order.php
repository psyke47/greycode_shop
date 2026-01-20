<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        'order_number',
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'order_status',
        'payment_status',
        'subtotal',
        'vat',
        'shipping_amount',
        'discount_amount',
        'total_amount',
        'currency',
        'payment_method',
        'notes',
        'customer_note',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'vat' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }   

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }
    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

}
