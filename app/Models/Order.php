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
        'tracking_number',
        'estimated_delivery',
        'delivery_date',
        'shipping_method',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'vat' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'estimated_delivery' => 'date',
        'delivery_date' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('order_status', $status);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Accessors
    public function getFormattedTotalAttribute()
    {
        return 'R ' . number_format($this->total_amount, 2);
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('F d, Y');
    }

    public function getItemCountAttribute()
    {
        return $this->items->sum('quantity');
    }

    // Status helpers
    public function isCancellable()
    {
        return in_array($this->order_status, ['pending', 'processing']);
    }

    public function isReturnable()
    {
        return $this->order_status === 'delivered' && 
               $this->created_at->diffInDays(now()) <= 30;
    }

    // Generate order number
    public static function generateOrderNumber()
    {
        $prefix = 'GC-ORD-';
        $date = now()->format('ymd');
        $lastOrder = self::where('order_number', 'like', $prefix . $date . '%')
            ->orderBy('order_number', 'desc')
            ->first();
        
        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -4);
            $nextNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $nextNumber = '0001';
        }
        
        return $prefix . $date . $nextNumber;
    }
}