import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import axios from 'axios';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState({});

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = () => {
        axios.get('/wishlist/items')
            .then(response => {
                setWishlistItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching wishlist:', error);
                setLoading(false);
            });
    };

   const removeFromWishlist = (productId) => {
    axios.delete(`/wishlist/remove/${productId}`)
        .then(() => {
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            toast.success('Removed from wishlist');
        })
        .catch(error => {
            console.error('Error removing:', error);
            toast.error('Failed to remove from wishlist');
        });
};

    const addToCart = (productId) => {
        // Prevent double-clicks
        if (cartLoading[productId]) return;
        
        setCartLoading(prev => ({ ...prev, [productId]: true }));

        router.post(
            `/cart/add/${productId}`, 
            { quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Remove from wishlist after adding to cart
                    removeFromWishlist(productId);
                    setCartLoading(prev => ({ ...prev, [productId]: false }));
                },
                onError: (errors) => {
                    console.error('Error adding to cart:', errors);
                    toast.error(errors.message || 'Failed to add to cart');
                    setCartLoading(prev => ({ ...prev, [productId]: false }));
                }
            }
        );
    };

    const getProductImage = (product) => {
        if (product.product_images && product.product_images.length > 0) {
            const image = product.product_images[0];
            const filename = image.url.split('\\').pop().split('/').pop();
            return `/images/${filename}`;
        }
        return placeholderSVG;
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="My Wishlist" />

            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <Heart className="mx-auto h-16 w-16 text-gray-300" />
                        <h3 className="mt-4 text-xl font-medium text-gray-900">Your wishlist is empty</h3>
                        <p className="mt-2 text-gray-500 max-w-md mx-auto">
                            Save items you love by clicking the heart icon on any product
                        </p>
                        <Link
                            href="/products"
                            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">
                            You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistItems.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${product.id}`}>
                                        <div className="h-48 overflow-hidden bg-gray-50">
                                            <img
                                                src={getProductImage(product)}
                                                alt={product.name}
                                                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src = placeholderSVG;
                                                }}
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-4">
                                        <Link href={`/products/${product.id}`}>
                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xl font-bold text-gray-900">
                                                R {parseFloat(product.price).toFixed(2)}
                                            </span>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={cartLoading[product.id]}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromWishlist(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove from Wishlist"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                            <p className="text-xs text-orange-600 mt-3">
                                                Only {product.stock_quantity} left in stock
                                            </p>
                                        )}

                                        {product.stock_quantity === 0 && (
                                            <p className="text-xs text-red-600 mt-3">
                                                Out of stock
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}