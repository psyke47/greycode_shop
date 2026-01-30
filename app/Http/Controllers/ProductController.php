<?php

namespace App\Http\Controllers;

<<<<<<< HEAD
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $products =Product::with(['category', 'productImages'])->get();
         return view('products.index', compact('products'));
    }

    public function getByCategory(Request $request)
    {
        $categories = $request->input('categories', []); // Array of category IDs or names

        $query = Product::query();

        if (!empty($categories)) {
            // Ensure categories is an array
            $categories = is_array($categories) ? $categories : [$categories];

            $query->whereHas('category', function ($query) use ($categories) {
                $query->whereIn('id', $categories)->orWhereIn('name', $categories);
            });
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return response()->json($products);
    }

    public function search($query)
    {
        $products = Product::where('name', 'LIKE', "%{$query}%")->get();
        return response()->json($products);
    }

    public function sort(Request $request)
    {
        $sortBy = $request->input('sort_by', 'newest'); // Default sorting

        $query = Product::query();

        switch ($sortBy) {
            case 'price_low_to_high':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high_to_low':
                $query->orderBy('price', 'desc');
                break;
            case 'name_a_to_z':
                $query->orderBy('name', 'asc');
                break;
            case 'name_z_to_a':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->get();
        return response()->json($products);
    }

    public function filterByPriceRange(Request $request)
    {
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');

        if (!is_null($minPrice) && !is_null($maxPrice)) {
            $products = Product::whereBetween('price', [(float)$minPrice, (float)$maxPrice])->get();
        } else {
            $products = Product::all();
        }
        return response()->json($products);
    }

}
=======
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
>>>>>>> 0120569833a59db77e09fdc11aaf20f03bbb485f
