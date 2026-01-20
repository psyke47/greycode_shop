<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $table = 'carts';

    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_code',
        'discount_amount',
        'expires_at',
    ];

    protected $casts =[
        'discount_amount' => 'decimal:2',
        'expires_at' => 'timestamp',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class,'cart_id');
    }

}
