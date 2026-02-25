<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display user's wishlist
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->with('message', 'Please login to view your wishlist');
        }

        $wishlist = $user->wishlist()
            ->with(['category', 'productImages'])
            ->get();

        return Inertia::render('Wishlist', [
            'wishlist' => $wishlist
        ]);
    }

    /**
     * Add product to wishlist
     */
    public function add(Product $product)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Check if already in wishlist
        $exists = $user->wishlist()
            ->where('product_id', $product->id)
            ->exists();

        if (!$exists) {
            $user->wishlist()->attach($product->id);
        }

        // Return wishlist count for header
        $count = $user->wishlist()->count();

        return response()->json([
            'success' => true,
            'message' => 'Added to wishlist',
            'count' => $count
        ]);
    }

    /**
     * Remove product from wishlist
     */
    public function remove(Product $product)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user->wishlist()->detach($product->id);

        $count = $user->wishlist()->count();

        return response()->json([
            'success' => true,
            'message' => 'Removed from wishlist',
            'count' => $count
        ]);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function check(Product $product)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['in_wishlist' => false]);
        }

        $inWishlist = $user->wishlist()
            ->where('product_id', $product->id)
            ->exists();

        return response()->json(['in_wishlist' => $inWishlist]);
    }

    /**
     * Move wishlist item to cart
     */
    public function moveToCart(Product $product)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Add to cart logic here (use your existing cart system)
        // This depends on how your cart works

        // Then remove from wishlist
        $user->wishlist()->detach($product->id);

        return response()->json([
            'success' => true,
            'message' => 'Moved to cart'
        ]);
    }

    public function count()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['count' => 0]);
        }

        $count = $user->wishlist()->count();

        return response()->json(['count' => $count]);
    }

    public function items()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([]);
        }

        $items = $user->wishlist()
            ->with(['category', 'productImages'])
            ->get();

        return response()->json($items);
    }
}
