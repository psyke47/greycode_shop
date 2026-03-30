<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\PayFastController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\NotificationController;

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
Route::middleware('auth')->group(function () {
    Route::get('/user-profile', function () {
        return Inertia::render('UserProfile', [
            'auth' => [
                'user' => auth()->user(),
            ],
            'orders' => auth()->user()?->orders ?? [],
        ]);
    });
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

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/signup', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    // ... other protected routes
});

Route::get('/test-redirect', function () {
    return redirect('/test-destination');
});

Route::get('/test-destination', function () {
    return Inertia::render('Test', ['message' => 'Redirect worked!']);
});

//Product routes
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

/// Cart routes
Route::middleware(['auth'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/update/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/remove/{cartItem}', [CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/merge', [CartController::class, 'mergeGuestCart'])->name('cart.merge');
    Route::get('/cart/summary', [CartController::class, 'getCartSummary'])->name('cart.summary');
});

// Order routes
Route::middleware(['auth','verified'])->group(function () {
    // Use consistent naming: all /orders (plural)
    Route::get('/order', [OrderController::class, 'index'])->name('order.index');
    Route::get('/order/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::post('/order/{id}/cancel', [OrderController::class, 'cancel'])->name('order.cancel');
    Route::post('/order/{id}/return', [OrderController::class, 'requestReturn'])->name('order.return');
    Route::get('/order/{id}/invoice', [OrderController::class, 'downloadInvoice'])->name('order.invoice');

});
    // Admin-only routes
// Admin-only routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Order management
    Route::get('/order', [OrderController::class, 'index'])->name('order.index');
    Route::get('/order/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::put('/order/{id}/status', [OrderController::class, 'updateStatus'])->name('order.updateStatus');
    Route::get('/order/dashboard', [OrderController::class, 'dashboard'])->name('order.dashboard');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unread-count');
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    //Products
    Route::get('/admin/product', function () {
        return Inertia::render('Admin/Product');
    })->name('product');
});

// Tracking routes
Route::get('/tracking', [TrackingController::class, 'index'])->name('tracking');
Route::post('/tracking', [TrackingController::class, 'track'])->name('tracking.track');

// Checkout routes (protected)
Route::middleware(['auth'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

// User profile routes


Route::middleware('auth')->group(function () {
    Route::get('/user-profile', [UserProfileController::class, 'edit'])->name('profile.page');
    Route::patch('/user-profile', [UserProfileController::class, 'update'])->name('profile.update');
    Route::put('/address', [UserProfileController::class, 'updateAddress'])->name('profile.update-address');
    Route::put('/password', [UserProfileController::class, 'updatePassword'])->name('profile.update-password');
});

//Forgot password routes
Route::middleware('guest')->group(function () {
    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->name('password.update');
});
// PayFast routes
Route::prefix('payfast')->name('payfast.')->group(function () {
    Route::post('/notify', [PayFastController::class, 'notify'])->name('notify');
    Route::get('/success/{order}', [PayFastController::class, 'success'])->name('return');
    Route::get('/cancel/{order}', [PayFastController::class, 'cancel'])->name('cancel');
});



// Wishlist routes
    Route::middleware(['auth'])->prefix('wishlist')->name('wishlist.')->group(function () {
    Route::get('/', [WishlistController::class, 'index'])->name('index');
    Route::get('/items', [WishlistController::class, 'items'])->name('items');
    Route::post('/add/{product}', [WishlistController::class, 'add'])->name('add');
    Route::delete('/remove/{product}', [WishlistController::class, 'remove'])->name('remove');
    Route::get('/count', [WishlistController::class, 'count'])->name('count');
});

Route::middleware(['auth'])->get('/wishlist/count', [WishlistController::class, 'count'])->name('wishlist.count');
Route::middleware(['auth'])->get('/wishlist/items', [WishlistController::class, 'items'])->name('wishlist.items');

Route::post('/coupon/validate', [CouponController::class, 'validate'])->name('coupon.validate');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

/* Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // existing admin routes...
    Route::get('/notifications', [Admin\NotificationController::class, 'index'])->name('admin.notifications');
    Route::get('/notifications/unread-count', [Admin\NotificationController::class, 'unreadCount'])->name('admin.notifications.unread-count');
    Route::put('/notifications/{notification}/read', [Admin\NotificationController::class, 'markAsRead'])->name('admin.notifications.read');
    Route::put('/notifications/read-all', [Admin\NotificationController::class, 'markAllAsRead'])->name('admin.notifications.read-all');
}); */
