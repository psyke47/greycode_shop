<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  


class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'price',
        'stock_quantity',
        'is_featured',
        'is_active',
    ];

    protected $casts=[
        'price'=>'decimal:2',
        'stock_quantity'=>'integer',
        'is_featured'=>'boolean',
        'is_active'=>'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }
}
