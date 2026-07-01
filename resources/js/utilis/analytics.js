// GA4 E-commerce tracking helpers
export const trackViewItem = (product) => {
    if (!window.gtag) return;
    
    window.gtag('event', 'view_item', {
        currency: 'ZAR',
        value: parseFloat(product.price),
        items: [{
            item_id: product.id.toString(),
            item_name: product.name,
            price: parseFloat(product.price),
            currency: 'ZAR'
        }]
    });
};

export const trackAddToCart = (product, quantity = 1) => {
    if (!window.gtag) return;
    
    window.gtag('event', 'add_to_cart', {
        currency: 'ZAR',
        value: parseFloat(product.price) * quantity,
        items: [{
            item_id: product.id.toString(),
            item_name: product.name,
            price: parseFloat(product.price),
            quantity: quantity,
            currency: 'ZAR'
        }]
    });
};

export const trackBeginCheckout = (cartItems, total) => {
    if (!window.gtag) return;
    
    window.gtag('event', 'begin_checkout', {
        currency: 'ZAR',
        value: parseFloat(total),
        items: cartItems.map(item => ({
            item_id: item.id.toString(),
            item_name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity || 1,
            currency: 'ZAR'
        }))
    });
};

export const trackPurchase = (order, items) => {
    if (!window.gtag) return;
    
    window.gtag('event', 'purchase', {
        transaction_id: order.id.toString(),
        currency: 'ZAR',
        value: parseFloat(order.total),
        tax: parseFloat(order.tax || 0),
        shipping: parseFloat(order.shipping || 0),
        items: items.map(item => ({
            item_id: item.id.toString(),
            item_name: item.name,
            price: parseFloat(item.price),
            quantity: item.quantity || 1,
            currency: 'ZAR'
        }))
    });
};