<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;

class CartController extends Controller
{
    public function showCart(Request $request)
    {
        // Retrieve the cart for the current user or session
        $cart = Cart::where('user_id', $request->user()->id)
                    ->orWhere('session_id', $request->session()->getId())
                    ->with('cartItem.product')
                    ->first();

        return view('cart.show', compact('cart'));
    }

    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Logic to add product to cart
        $cart = Cart::findOrFail($request->input('cart_id'));
        $cart->cartItems()->create([
            'product_id' => $request->input('product_id'),
            'quantity' => $request->input('quantity'),
        ]);

        return redirect()->back()->with('success', 'Product added to cart!');
    }

    public function removeFromCart(Request $request, $itemId)
    {
        $cartItem = CartItem::findOrFail($itemId);
        $cartItem->delete();

        return redirect()->back()->with('success', 'Product removed from cart!');
    }

    public function applyCouponCode(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string',
        ]);

        // Logic to apply discount code goes here
        $cart = Cart::findOrFail($request->input('cart_id'));
        $cart->coupon_code = $request->input('coupon_code');
        // Assume a method to calculate discount
        $cart->discount_amount = $this->calculateDiscount($cart->coupon_code, $cart);
        $cart->save();

        return redirect()->back()->with('success', 'Discount code applied!');
    }

    public function calculateDiscount($couponCode, $cart)
    {
      $coupon = Coupon::where('code', $couponCode)
                      ->where(function($query){
                        $query->whereNull('expires_at')
                                ->orWhere('expires_at', '>', now());
                      })
                      ->first();

        if (!$coupon) {
            return 0.00;
        }

        $cartTotal = $cart->cartItems()
                        ->join('products', 'cart_items.product_id', '=', 'products.id')
                        ->sum(\DB::raw('products.price * cart_items.quantity'));

        if ($coupon->type === 'percentage') {
            return ($coupon->value / 100) * $cartTotal;

        } elseif ($coupon->type === 'fixed') {
            return min($coupon->value, $cartTotal);
        }
        return 0.00;
        }
    

    public function clearCart(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)
                    ->orWhere('session_id', $request->session()->getId())
                    ->first();

        if ($cart) {
            $cart->cartItems()->delete();
        }

        return redirect()->back()->with('success', 'Cart cleared successfully!');
    }
}
