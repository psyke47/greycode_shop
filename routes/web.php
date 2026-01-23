<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;

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

Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/register', [AuthController::class, 'register'])->name('register.post');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');