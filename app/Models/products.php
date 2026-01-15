<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;  


class products extends Model
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
    public function categories()
    {
        return $this->belongsTo(categories::class, 'category_id');
    }
}
