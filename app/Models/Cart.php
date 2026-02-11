<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;


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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class,'cart_id');
    }

    // Calculate total items in cart
    public function getTotalItemsAttribute(): int
    {
        return $this->cartItems()->sum('quantity');
    }

    // Calculate subtotal
    public function getSubtotalAttribute(): float
    {
        return $this->cartItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });
    }

}
