<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
public function index()
{
    $products = Product::with(['category', 'productImages'])->get(); // Should include ALL products

    return Inertia::render('Admin/Products', [
        'products' => $products,
        'categories' => Category::all(),
    ]);
}


    /**
     * Show form to create a new product (frontend only for now).
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Admin/Product', [
            'product' => null,
            'categories' => $categories,
            'isEditing' => false,
        ]);
    }

    /**
     * Store a new product (disabled until product list is confirmed).
     */
    public function store(Request $request)
    {
        // Temporarily disabled – waiting for product list from supervisor
        return back()->with('info', 'Product creation is currently disabled. Waiting for product list confirmation.');
        
        // Uncomment when ready:
        /*
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product = Product::create($validated);
        
        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
        */
    }

    /**
     * Show form to edit a product.
     */
    public function edit($id)
{
    $product = Product::findOrFail($id);
    $categories = Category::all();
    
    return Inertia::render('Admin/ProductEdit', [
        'product' => $product,
        'categories' => $categories,
    ]);
}

    /**
     * Update a product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

   /**
 * Toggle product active status (deactivate/reactivate)
 */
public function toggleActive($id)
{
    $product = Product::findOrFail($id);
    $product->update(['is_active' => !$product->is_active]);

    $status = $product->is_active ? 'activated' : 'deactivated';

    return redirect()->route('admin.products.index')
        ->with('success', "Product {$status} successfully.");
}
}