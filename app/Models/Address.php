<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $table = 'addresses';

    protected $fillable = [
        'user_id',
        'address_type',
        'is_default',
        'address_line1',
        'address_line2',
        'surburb',
        'city',
        'province',
        'postal_code',
        'country',
        'phone_number',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ordersAsShippingAddress()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }
    public function ordersAsBillingAddress()
    {
        return $this->hasMany(Order::class, 'billing_address_id');
    }
}

