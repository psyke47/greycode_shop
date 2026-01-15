<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class address extends Model
{
    protected $table = 'addresses';

    protected $fillable = [
        'user_id',
        'address_type',
        'address_line1',
        'address_line2',
        'city',
        'province',
        'postal_code',
        'Country',
        'phone_number',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

