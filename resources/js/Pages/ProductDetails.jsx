import React, { useState, useEffect } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";
import { Heart } from "lucide-react";
import axios from 'axios'; // Add this import
import toast from 'react-hot-toast';
import LoadingSpinner from "../Components/LoadingSpinner";
import PageHead from "../Components/PageHead";

const placeholderSVG =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0U1RTVFNSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==";

export default function ProductDetail({
    product: initialProduct,
    relatedProducts: initialRelated,
}) {
    const { props } = usePage();
    const { auth } = usePage().props; // Add this to get auth user

    console.log("CSRF token from props:", props.csrf_token);
    console.log("All props:", props);

    const product = props.product || initialProduct;
    const relatedProducts = props.relatedProducts || initialRelated || [];

    // Add wishlist state
    /*     const [wishlistItems, setWishlistItems] = useState([]); */
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Check if product is in wishlist on load
    useEffect(() => {
        if (auth?.user && product) {
            axios.get(`/wishlist/check/${product.id}`)
                .then(response => {
                    setIsInWishlist(response.data.in_wishlist);
                })
                .catch(error => {
                    console.error('Error checking wishlist:', error);
                });
        }
    }, [auth?.user, product?.id]);

    const csrfToken =
        props.csrf_token ||
        document.querySelector('meta[name="csrf-token"]')?.content;

    const metaTag = document.querySelector('meta[name="csrf-token"]');
    console.log("Meta tag found:", metaTag);
    console.log("Meta tag content:", metaTag?.content);

    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Add toggleWishlist function
    const toggleWishlist = (productId, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            window.location.href = '/login';
            return;
        }

        if (wishlistLoading) return;

        setWishlistLoading(true);

        if (isInWishlist) {
            axios.delete(`/wishlist/remove/${productId}`)
                .then(response => {
                    setIsInWishlist(false);
                    toast.success('Removed from wishlist');
                })
                .catch(error => {
                    console.error('Error removing from wishlist:', error);
                    toast.error('Failed to remove from wishlist');
                })
                .finally(() => {
                    setWishlistLoading(false);
                });
        } else {
            axios.post(`/wishlist/add/${productId}`)
                .then(response => {
                    setIsInWishlist(true);
                    toast.success('Added to wishlist');
                })
                .catch(error => {
                    console.error('Error adding to wishlist:', error);
                    toast.error('Failed to add to wishlist');
                })
                .finally(() => {
                    setWishlistLoading(false);
                });
        }
    };

    if (!product) {
        return (
            <MainLayout>
                <Head title="Product Not Found" />

                <div className="py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Product not found
                    </h1>
                    <Link
                        href="/products"
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Products
                    </Link>
                </div>
            </MainLayout>
        );
    }

    // Get all product images
    const productImages = product.product_images || [];
    const mainImage =
        productImages.length > 0 ? productImages[selectedImageIndex] : null;

    // Get product image URL
    const getImageUrl = (image) => {
        if (!image) return placeholderSVG;

        const filename = image.url.split("\\").pop().split("/").pop();
        return `/images/${filename}`;
    };

    // Get category
    const category = product.category || {};

    // Format price
    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString("en-ZA", {
            style: "currency",
            currency: "ZAR",
            minimumFractionDigits: 2,
        });
    };

    // Handle quantity changes
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= (product.stock_quantity || 999)) {
            setQuantity(value);
        }
    };

    const incrementQuantity = () => {
        if (quantity < (product.stock_quantity || 999)) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Related product image URL helper
    const getRelatedProductImage = (product) => {
        if (product.product_images && product.product_images.length > 0) {
            const image = product.product_images[0];
            const filename = image.url.split("\\").pop().split("/").pop();
            return `/images/${filename}`;
        }
        return placeholderSVG;
    };

    const handleAddToCart = () => {
        if (addingToCart) return;

        setAddingToCart(true);

        router.post(
            `/cart/add/${product.id}`,
            { quantity: quantity },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast.success('Product added to cart!');
                    setAddingToCart(false);
                },
                onError: (errors) => {
                    console.error("Add to cart errors:", errors);
                    toast.error(errors.message || "Failed to add to cart");
                    setAddingToCart(false);
                },
            },
        );
    };


    return (
        <MainLayout>
            <PageHead
                title={product.name}
                meta={[
                    { name: 'description', content: `Buy ${product.name} for only R ${product.price}. ${product.description?.substring(0, 150)}. Fast delivery in South Africa.` },
                    { name: 'keywords', content: `${product.name}, ${category.name}, electronic component, buy online South Africa` },
                ]}
            >
                <link rel="canonical" href={`https://store.greycode.co.za/products/${product.id}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": getImageUrl(mainImage),
                        "description": product.description?.substring(0, 200),
                        "sku": product.sku || product.id,
                        "offers": {
                            "@type": "Offer",
                            "url": `https://store.greycode.co.za/products/${product.id}`,
                            "priceCurrency": "ZAR",
                            "price": product.price,
                            "itemCondition": "https://schema.org/NewCondition",
                            "availability": product.stock_quantity > 0
                                ? "https://schema.org/InStock"
                                : "https://schema.org/OutOfStock"
                        }
                    })}
                </script>
            </PageHead>

            <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center space-x-2 text-sm text-gray-600">
                            <li>
                                <Link href="/" className="hover:text-blue-600">
                                    Home
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            <li>
                                <Link
                                    href="/products"
                                    className="hover:text-blue-600"
                                >
                                    Products
                                </Link>
                            </li>
                            <li className="text-gray-400">/</li>
                            {category.name && (
                                <>
                                    <li>
                                        <Link
                                            href={`/products?category=${category.id}`}
                                            className="hover:text-blue-600"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                    <li className="text-gray-400">/</li>
                                </>
                            )}
                            <li className="text-gray-900 font-medium truncate">
                                {product.name}
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Product Images */}
                        <div>
                            {/* Main Image with Wishlist Button */}
                            <div className="bg-white rounded-xl shadow-lg p-4 mb-4 relative">
                                <div className="relative h-80 sm:h-96 flex items-center justify-center bg-white rounded-lg overflow-hidden">
                                    <img
                                        src={getImageUrl(mainImage)}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-4"
                                        onError={(e) => {
                                            e.target.src = placeholderSVG;
                                        }}
                                    />

                                    {/* Wishlist Button on Product Detail Page */}
                                    <button
                                        onClick={(e) => toggleWishlist(product.id, e)}
                                        disabled={wishlistLoading}
                                        className={`absolute top-4 right-4 p-3 rounded-full z-10 ${isInWishlist
                                            ? "bg-red-500 text-white"
                                            : "bg-white/90 text-gray-600 hover:bg-red-50"
                                            } shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        {wishlistLoading ? (
                                            <LoadingSpinner size="sm" color={isInWishlist ? "white" : "gray"} />
                                        ) : (
                                            <Heart className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} />
                                        )}
                                    </button>

                                    {product.is_featured && (
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Thumbnail Images */}
                            {productImages.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto pb-2">
                                    {productImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() =>
                                                setSelectedImageIndex(index)
                                            }
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedImageIndex === index
                                                ? "border-blue-500"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(image)}
                                                alt={`${product.name} - ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        placeholderSVG;
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div>
                            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                                {/* Category Badge */}
                                {category.name && (
                                    <div className="mb-4">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                            {category.name}
                                        </span>
                                    </div>
                                )}

                                {/* Product Name */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                {/* Product Price */}
                                <div className="mb-6">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </p>
                                    {product.stock_quantity !== undefined && (
                                        <p
                                            className={`mt-2 text-sm font-medium ${product.stock_quantity > 10
                                                ? "text-green-600"
                                                : product.stock_quantity > 0
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {product.stock_quantity > 10
                                                ? "✓ In Stock"
                                                : product.stock_quantity > 0
                                                    ? `⚠ Only ${product.stock_quantity} left in stock`
                                                    : "✗ Out of Stock"}
                                        </p>
                                    )}
                                </div>

                                {/* Product Description */}
                                {product.description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                            Description
                                        </h2>
                                        <div className="prose max-w-none text-gray-600">
                                            <p className="whitespace-pre-line">
                                                {product.description}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Quantity and Add to Cart */}
                                <div className="mb-8">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:justify-between">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={decrementQuantity}
                                                disabled={quantity <= 1}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock_quantity || 999}
                                                value={quantity}
                                                onChange={handleQuantityChange}
                                                className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                                            />
                                            <button
                                                onClick={incrementQuantity}
                                                disabled={quantity >= (product.stock_quantity || 999)}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={product.stock_quantity === 0 || addingToCart}
                                            className="flex-1 sm:flex-initial bg-greycode-light-blue text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {addingToCart ? (
                                                <>
                                                    <LoadingSpinner size="sm" color="white" />
                                                    Adding to Cart...
                                                </>
                                            ) : product.stock_quantity === 0 ? (
                                                "Out of Stock"
                                            ) : (
                                                "Add to Cart"
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                        Product Details
                                    </h2>
                                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {category.name && (
                                            <>
                                                <dt className="text-sm font-medium text-gray-600">
                                                    Category
                                                </dt>
                                                <dd className="text-sm text-gray-900">
                                                    {category.name}
                                                </dd>
                                            </>
                                        )}
                                        <dt className="text-sm font-medium text-gray-600">
                                            Status
                                        </dt>
                                        <dd className="text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full ${product.is_active
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {product.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </dd>
                                        <dt className="text-sm font-medium text-gray-600">
                                            Featured
                                        </dt>
                                        <dd className="text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full ${product.is_featured
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {product.is_featured
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Related Products
                                </h2>
                                <Link
                                    href="/products"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View All →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts
                                    .slice(0, 4)
                                    .map((relatedProduct) => (
                                        <Link
                                            key={relatedProduct.id}
                                            href={`/products/${relatedProduct.id}`}
                                            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                        >
                                            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={getRelatedProductImage(
                                                        relatedProduct,
                                                    )}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-contain p-4"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            placeholderSVG;
                                                    }}
                                                />
                                                {relatedProduct.is_featured && (
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-md font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2 line-clamp-2">
                                                    {relatedProduct.name}
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {formatPrice(
                                                            relatedProduct.price,
                                                        )}
                                                    </p>
                                                    <span className="text-blue-600 group-hover:text-blue-800 font-medium text-sm">
                                                        View →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Back to Products Link */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg"
                        >
                            ← Back to All Products
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}