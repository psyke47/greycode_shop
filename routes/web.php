<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;


Route::get('/', function () {
    return Inertia::render('Homepage', ['name' => 'Greycode Shop']);
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
});

Route::get('/products', function () {
    return Inertia::render('Products');
});

Route::get('/product-details', function () {
    return Inertia::render('ProductDetails');
});

Route::get('/cart', function () {
    return Inertia::render('Cart');
});
Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});
Route::get('/order', function () {
    return Inertia::render('Order');
});
Route::get('/order-details', function () {
    return Inertia::render('OrderDetails');
});
Route::get('/user-profile', function () {
    return Inertia::render('UserProfile');
});
Route::get('/tracking', function () {
    return Inertia::render('Tracking');
});

/* Login and Sign up routes are commented out for future implementation */
Route::get('/login', function () {
    return Inertia::render('Login');
});
Route::get('/signup', function () {
    return Inertia::render('Signup');
});


/* Product routes */
//Route::resource('products', ProductController::class);
Route::post('/products/category/', [ProductController::class, 'getByCategory']);
Route::post('/products/search/', [ProductController::class, 'search']);
Route::post('/products/sort', [ProductController::class, 'sort']);
Route::post('/products/filter/price', [ProductController::class, 'filterByPriceRange']);

/* Additional routes can be added here */
