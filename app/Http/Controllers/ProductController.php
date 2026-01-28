<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'productImages'])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => request()->only(['search', 'category', 'min_price', 'max_price', 'sort'])
        ]);
    }
    
    public function show(Product $product)
    {
         // ADD THIS CHECK: Only show active products
        if (!$product->is_active) {
            abort(404);
        }
        
        // Load relationships
        $product->load(['category', 'productImages']);

        // Get related products (same category, excluding current product)
        $relatedProducts = Product::with(['productImages'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->inRandomOrder() // Random order for variety
            ->limit(6)
            ->get();
        
        return Inertia::render('ProductDetails', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }
    
}