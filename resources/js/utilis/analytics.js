// resources/js/utils/analytics.js
// GA4 E-commerce tracking helpers

const isDev = import.meta.env.APP_ENV === 'local' || import.meta.env.APP_ENV === 'development';

const log = (...args) => {
    if (isDev) {
        console.log('[GA4 Debug]', ...args);
    }
};

/**
 * Track page view (handled automatically by GoogleAnalytics component)
 */

/**
 * Track product list view
 */
export const trackViewItemList = (items, category = '') => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'view_item_list', {
            currency: 'ZAR',
            items: items.slice(0, 20).map(item => ({
                item_id: item.id?.toString() || '',
                item_name: item.name || '',
                price: parseFloat(item.price) || 0,
                currency: 'ZAR',
                item_category: item.category || category,
                index: items.indexOf(item),
            }))
        });
        log('view_item_list tracked for', items.length, 'items');
    } catch (error) {
        console.error('GA4 trackViewItemList error:', error);
    }
};

/**
 * Track product view
 */
export const trackViewItem = (product) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'view_item', {
            currency: 'ZAR',
            value: parseFloat(product.price) || 0,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.name || '',
                price: parseFloat(product.price) || 0,
                currency: 'ZAR',
                item_category: product.category || '',
                item_brand: product.brand || '',
                item_variant: product.variant || '',
            }]
        });
        log('view_item tracked for:', product.name);
    } catch (error) {
        console.error('GA4 trackViewItem error:', error);
    }
};

/**
 * Track product click/select
 */
export const trackSelectItem = (product, position = 0, listName = 'products') => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'select_item', {
            currency: 'ZAR',
            value: parseFloat(product.price) || 0,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.name || '',
                price: parseFloat(product.price) || 0,
                currency: 'ZAR',
                item_category: product.category || '',
                index: position,
            }],
            item_list_name: listName,
        });
        log('select_item tracked for:', product.name, 'at position:', position);
    } catch (error) {
        console.error('GA4 trackSelectItem error:', error);
    }
};

/**
 * Track add to cart
 */
export const trackAddToCart = (product, quantity = 1) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'add_to_cart', {
            currency: 'ZAR',
            value: parseFloat(product.price) * quantity,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.name || '',
                price: parseFloat(product.price) || 0,
                quantity: quantity,
                currency: 'ZAR',
                item_category: product.category || '',
            }]
        });
        log('add_to_cart tracked for:', product.name, 'x', quantity);
    } catch (error) {
        console.error('GA4 trackAddToCart error:', error);
    }
};

/**
 * Track remove from cart
 */
export const trackRemoveFromCart = (product, quantity = 1) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'remove_from_cart', {
            currency: 'ZAR',
            value: parseFloat(product.price) * quantity,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.name || '',
                price: parseFloat(product.price) || 0,
                quantity: quantity,
                currency: 'ZAR',
            }]
        });
        log('remove_from_cart tracked for:', product.name);
    } catch (error) {
        console.error('GA4 trackRemoveFromCart error:', error);
    }
};

/**
 * Track view cart
 */
export const trackViewCart = (cartItems, total) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'view_cart', {
            currency: 'ZAR',
            value: parseFloat(total) || 0,
            items: cartItems.map(item => ({
                item_id: item.id?.toString() || '',
                item_name: item.name || '',
                price: parseFloat(item.price) || 0,
                quantity: item.quantity || 1,
                currency: 'ZAR',
            }))
        });
        log('view_cart tracked with', cartItems.length, 'items');
    } catch (error) {
        console.error('GA4 trackViewCart error:', error);
    }
};

/**
 * Track begin checkout
 */
export const trackBeginCheckout = (cartItems, total, shipping = 0, tax = 0) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'begin_checkout', {
            currency: 'ZAR',
            value: parseFloat(total) || 0,
            shipping: parseFloat(shipping) || 0,
            tax: parseFloat(tax) || 0,
            items: cartItems.map(item => ({
                item_id: item.id?.toString() || '',
                item_name: item.name || '',
                price: parseFloat(item.price) || 0,
                quantity: item.quantity || 1,
                currency: 'ZAR',
            }))
        });
        log('begin_checkout tracked with', cartItems.length, 'items');
    } catch (error) {
        console.error('GA4 trackBeginCheckout error:', error);
    }
};

/**
 * Track purchase (should be called after successful payment)
 */
export const trackPurchase = (order, items) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'purchase', {
            transaction_id: order.id?.toString() || '',
            currency: 'ZAR',
            value: parseFloat(order.total) || 0,
            tax: parseFloat(order.tax) || 0,
            shipping: parseFloat(order.shipping) || 0,
            items: items.map(item => ({
                item_id: item.id?.toString() || '',
                item_name: item.name || '',
                price: parseFloat(item.price) || 0,
                quantity: item.quantity || 1,
                currency: 'ZAR',
                item_category: item.category || '',
            }))
        });
        log('purchase tracked for order:', order.id);
    } catch (error) {
        console.error('GA4 trackPurchase error:', error);
    }
};

/**
 * Track wishlist actions
 */
export const trackAddToWishlist = (product) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'add_to_wishlist', {
            currency: 'ZAR',
            value: parseFloat(product.price) || 0,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.name || '',
                price: parseFloat(product.price) || 0,
                currency: 'ZAR',
                item_category: product.category || '',
            }]
        });
        log('add_to_wishlist tracked for:', product.name);
    } catch (error) {
        console.error('GA4 trackAddToWishlist error:', error);
    }
};

/**
 * Track search
 */
export const trackSearch = (searchTerm, results = 0) => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'search', {
            search_term: searchTerm || '',
            number_of_results: results,
        });
        log('search tracked:', searchTerm, '-', results, 'results');
    } catch (error) {
        console.error('GA4 trackSearch error:', error);
    }
};

/**
 * Track contact form submission
 */
export const trackContact = (formType = 'general') => {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    try {
        window.gtag('event', 'generate_lead', {
            currency: 'ZAR',
            value: 0,
            form_type: formType,
        });
        log('contact form tracked');
    } catch (error) {
        console.error('GA4 trackContact error:', error);
    }
};

// Export all functions
export default {
    trackViewItemList,
    trackViewItem,
    trackSelectItem,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackBeginCheckout,
    trackPurchase,
    trackAddToWishlist,
    trackSearch,
    trackContact,
};