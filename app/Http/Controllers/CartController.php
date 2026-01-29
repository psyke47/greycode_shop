<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if (!$user) {
            return $this->handleGuestCart();
        }
        
        $cart = Cart::with([
            'cartItems.product.category', 
            'cartItems.product.productImages'
        ])->where('user_id', $user->id)->first();
        
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $user->id,
                'session_id' => session()->getId(),
            ]);
        }
        
        // Calculate totals
        $cartData = $this->calculateCartTotals($cart);
        
        return Inertia::render('Cart', [
            'cart' => array_merge($cart->toArray(), $cartData)
        ]);
    }
    
    public function add(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'nullable|integer|min:1|max:' . ($product->stock_quantity ?? 999)
        ]);
        
        $quantity = $request->quantity ?? 1;
        
        // Check stock
        if ($product->stock_quantity < $quantity) {
            return redirect()->back()->withErrors([
                'stock' => 'Not enough stock available. Only ' . $product->stock_quantity . ' left.'
            ]);
        }
        
        $user = Auth::user();
        
        if (!$user) {
            return $this->addToGuestCart($product, $quantity);
        }
        
        return $this->addToUserCart($user, $product, $quantity);
    }
    
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);
        
        $user = Auth::user();
        
        if (!$user || $cartItem->cart->user_id !== $user->id) {
            abort(403);
        }
        
        // Check stock
        $product = $cartItem->product;
        if ($product->stock_quantity < $request->quantity) {
            return redirect()->back()->withErrors([
                'stock' => 'Not enough stock available. Only ' . $product->stock_quantity . ' left.'
            ]);
        }
        
        $cartItem->update(['quantity' => $request->quantity]);
        
        // Redirect back to cart page - FIXED: Use 'cart' not 'cart.index'
        return redirect()->route('cart')->with('success', 'Quantity updated successfully!');
    }
    
    public function remove(CartItem $cartItem)
    {
        $user = Auth::user();
        
        if (!$user || $cartItem->cart->user_id !== $user->id) {
            abort(403);
        }
        
        $cartItem->delete();
        
        // Redirect back to cart page - FIXED: Use 'cart' not 'cart.index'
        return redirect()->route('cart')->with('success', 'Item removed from cart!');
    }
    
    public function clear()
    {
        $user = Auth::user();
        
        if (!$user) {
            session()->forget('cart_items');
            return redirect()->route('cart')->with('success', 'Cart cleared!');
        }
        
        $cart = Cart::where('user_id', $user->id)->first();
        
        if ($cart) {
            $cart->cartItems()->delete();
        }
        
        // Redirect back to cart page - FIXED: Use 'cart' not 'cart.index'
        return redirect()->route('cart')->with('success', 'Cart cleared!');
    }
    
    public function mergeGuestCart()
    {
        $user = Auth::user();
        
        if (!$user || !session()->has('cart_items')) {
            return redirect()->route('cart');
        }
        
        $guestCartItems = session()->get('cart_items', []);
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['session_id' => session()->getId()]
        );
        
        foreach ($guestCartItems as $guestItem) {
            $product = Product::find($guestItem['product_id']);
            
            if ($product) {
                $existingItem = CartItem::where('cart_id', $cart->id)
                    ->where('product_id', $product->id)
                    ->first();
                
                if ($existingItem) {
                    $existingItem->increment('quantity', $guestItem['quantity']);
                } else {
                    CartItem::create([
                        'cart_id' => $cart->id,
                        'product_id' => $product->id,
                        'quantity' => $guestItem['quantity'],
                        'price' => $product->price,
                    ]);
                }
            }
        }
        
        // Clear guest cart
        session()->forget('cart_items');
        
        return redirect()->route('cart')->with('success', 'Cart merged successfully!');
    }
    
    public function getCartSummary()
    {
        $user = Auth::user();
        
        if (!$user) {
            $guestCart = session()->get('cart_items', []);
            $itemCount = array_sum(array_column($guestCart, 'quantity'));
            return response()->json(['item_count' => $itemCount]);
        }
        
        $cart = Cart::with('cartItems')->where('user_id', $user->id)->first();
        
        if (!$cart) {
            return response()->json(['item_count' => 0]);
        }
        
        $itemCount = $cart->cartItems->sum('quantity');
        
        return response()->json([
            'item_count' => $itemCount,
            'cart_id' => $cart->id
        ]);
    }
    
    /**
     * PRIVATE HELPER METHODS
     */
    
    private function handleGuestCart()
    {
        $cartItems = session()->get('cart_items', []);
        $subtotal = 0;
        
        foreach ($cartItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }
        
        $shipping = $subtotal > 500 ? 0 : 99;
        $tax = $subtotal * 0.14; // 14% VAT for South Africa
        $total = $subtotal + $shipping + $tax;
        
        return Inertia::render('Cart', [
            'cart' => [
                'cart_items' => $cartItems,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'tax' => $tax,
                'total' => $total,
                'item_count' => array_sum(array_column($cartItems, 'quantity'))
            ]
        ]);
    }
    
    private function addToGuestCart(Product $product, int $quantity)
    {
        $cartItems = session()->get('cart_items', []);
        $found = false;
        
        foreach ($cartItems as &$item) {
            if ($item['product_id'] == $product->id) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            $cartItems[] = [
                'product_id' => $product->id,
                'product' => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'stock_quantity' => $product->stock_quantity,
                    'product_images' => $product->productImages,
                    'category' => $product->category,
                ],
                'price' => $product->price,
                'quantity' => $quantity,
            ];
        }
        
        session()->put('cart_items', $cartItems);
        
        return redirect()->back()->with('success', 'Product added to cart!');
    }
    
    private function addToUserCart($user, Product $product, int $quantity)
    {
        DB::transaction(function () use ($user, $product, $quantity) {
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['session_id' => session()->getId()]
            );
            
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->first();
            
            if ($cartItem) {
                $cartItem->increment('quantity', $quantity);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);
            }
            
            // Update product stock if needed
            if ($product->stock_quantity !== null) {
                $product->decrement('stock_quantity', $quantity);
            }
        });
        
        return redirect()->back()->with('success', 'Product added to cart!');
    }
    
    private function calculateCartTotals(Cart $cart)
    {
        $subtotal = $cart->cartItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        
        $shipping = $subtotal > 500 ? 0 : 99;
        $tax = $subtotal * 0.15; // 15% VAT
        $total = $subtotal + $shipping + $tax;
        $itemCount = $cart->cartItems->sum('quantity');
        
        return [
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'item_count' => $itemCount,
            'free_shipping_threshold' => 500,
            'needs_for_free_shipping' => max(0, 500 - $subtotal)
        ];
    }
}