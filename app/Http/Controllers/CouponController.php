<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CouponController extends Controller
{
    public function validate(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'subtotal' => 'required|numeric|min:0'
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.'
            ], 404);
        }

        // Check if coupon is expired
        if ($coupon->expires_at && now() > $coupon->expires_at) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has expired.'
            ], 400);
        }

        // Check usage limit
        if ($coupon->usage_limit !== null && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has reached its usage limit.'
            ], 400);
        }

        // Calculate discount
        $discount = 0;
        if ($coupon->type === 'fixed') {
            $discount = min($coupon->value, $request->subtotal);
        } else { // percentage
            $discount = ($coupon->value / 100) * $request->subtotal;
        }

        return response()->json([
            'valid' => true,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
                'discount' => round($discount, 2)
            ],
            'message' => 'Coupon applied successfully!'
        ]);
    }
}