<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            // Handle guest cart (using session)
            return Inertia::render('Cart', [
                'cart' => [
                    'cart_items' => [],
                    'subtotal' => 0,
                    'total' => 0
                ]
            ]);
        }
        
        // Get user's cart with items and product details
        $cart = Cart::with(['cartItems.product.category', 'cartItems.product.productImages'])
            ->where('user_id', $user->id)
            ->first();
        
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'session_id' => session()->getId(),
            ]);
        }
        
        return Inertia::render('Cart', [
            'cart' => $cart->load(['cartItems.product.category', 'cartItems.product.productImages'])
        ]);
    }
    
    public function add(Request $request, Product $product)
    {
        $user = Auth::user();
        
        if (!$user) {
            // Handle guest cart (store in session)
            $cartItems = session()->get('cart_items', []);
            
            // Check if product already in cart
            $found = false;
            foreach ($cartItems as &$item) {
                if ($item['product_id'] == $product->id) {
                    $item['quantity'] += $request->quantity ?? 1;
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                $cartItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $request->quantity ?? 1,
                ];
            }
            
            session()->put('cart_items', $cartItems);
            
            return redirect()->back()->with('success', 'Product added to cart!');
        }
        
        // Get or create user's cart
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['session_id' => session()->getId()]
        );
        
        // Check if product already in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();
        
        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $request->quantity ?? 1;
            $cartItem->save();
        } else {
            // Add new item
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity ?? 1,
                'price' => $product->price,
            ]);
        }
        
        return redirect()->back()->with('success', 'Product added to cart!');
    }
    
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        // Check if user owns this cart item
        $user = Auth::user();
        if ($cartItem->cart->user_id !== $user->id) {
            abort(403);
        }
        
        // Check stock availability
        $product = $cartItem->product;
        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'error' => 'Not enough stock available'
            ], 400);
        }
        
        $cartItem->quantity = $request->quantity;
        $cartItem->save();
        
        return response()->json(['success' => true]);
    }
    
    public function remove(CartItem $cartItem)
    {
        $user = Auth::user();
        
        if ($cartItem->cart->user_id !== $user->id) {
            abort(403);
        }
        
        $cartItem->delete();
        
        return response()->json(['success' => true]);
    }
    
    public function clear()
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->cartItems()->delete();
        }
        
        return response()->json(['success' => true]);
    }
}