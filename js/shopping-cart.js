/**
 * DC TEKNİK Shopping Cart System
 * Sepet sistemi ve checkout işlemleri
 * 
 * Features:
 * - Add/remove products
 * - Quantity management
 * - Price calculations
 * - Discount system
 * - Shipping calculations
 * - Checkout process
 * - Order summary
 * - Payment integration
 */

class ShoppingCart {
    constructor() {
        this.items = new Map();
        this.discounts = [];
        this.shipping = {
            freeShippingThreshold: 500, // Free shipping above 500 TL
            standardShipping: 25, // Standard shipping cost
            expressShipping: 45, // Express shipping cost
            calculatedShipping: 0
        };
        this.taxes = {
            kdv: 0.18, // 18% KDV
            calculatedTax: 0
        };
        
        this.init();
    }
    
    init() {
        console.log('🛒 Shopping Cart System initialized');
        this.loadCart();
        this.setupEventListeners();
        this.updateCartDisplay();
    }
    
    // Cart item management
    addItem(productId, quantity = 1, options = {}) {
        const product = window.productManagement?.getProduct(productId);
        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }
        
        // Check stock availability
        if (!window.productManagement.checkStock(productId, quantity)) {
            throw new Error(`Insufficient stock for product ${product.name}`);
        }
        
        const existingItem = this.items.get(productId);
        
        if (existingItem) {
            // Update existing item
            existingItem.quantity += quantity;
            existingItem.updatedAt = new Date().toISOString();
        } else {
            // Add new item
            const cartItem = {
                productId,
                product,
                quantity,
                unitPrice: product.price,
                totalPrice: product.price * quantity,
                options: options,
                addedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.items.set(productId, cartItem);
        }
        
        this.updateCartDisplay();
        this.saveCart();
        
        console.log(`✅ Added ${quantity} x ${product.name} to cart`);
        
        // Dispatch event
        this.dispatchCartEvent('itemAdded', {
            productId,
            quantity,
            product
        });
        
        return this.items.get(productId);
    }
    
    removeItem(productId) {
        const item = this.items.get(productId);
        if (!item) {
            throw new Error(`Item with product id ${productId} not found in cart`);
        }
        
        this.items.delete(productId);
        this.updateCartDisplay();
        this.saveCart();
        
        console.log(`✅ Removed ${item.product.name} from cart`);
        
        // Dispatch event
        this.dispatchCartEvent('itemRemoved', {
            productId,
            item
        });
        
        return true;
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.get(productId);
        if (!item) {
            throw new Error(`Item with product id ${productId} not found in cart`);
        }
        
        if (quantity <= 0) {
            return this.removeItem(productId);
        }
        
        // Check stock availability
        if (!window.productManagement.checkStock(productId, quantity)) {
            throw new Error(`Insufficient stock for product ${item.product.name}`);
        }
        
        item.quantity = quantity;
        item.totalPrice = item.unitPrice * quantity;
        item.updatedAt = new Date().toISOString();
        
        this.items.set(productId, item);
        this.updateCartDisplay();
        this.saveCart();
        
        console.log(`✅ Updated quantity for ${item.product.name} to ${quantity}`);
        
        // Dispatch event
        this.dispatchCartEvent('quantityUpdated', {
            productId,
            quantity,
            item
        });
        
        return item;
    }
    
    clearCart() {
        this.items.clear();
        this.updateCartDisplay();
        this.saveCart();
        
        console.log('✅ Cart cleared');
        
        // Dispatch event
        this.dispatchCartEvent('cartCleared', {});
        
        return true;
    }
    
    getItem(productId) {
        return this.items.get(productId);
    }
    
    getAllItems() {
        return Array.from(this.items.values());
    }
    
    getItemCount() {
        return Array.from(this.items.values()).reduce((total, item) => total + item.quantity, 0);
    }
    
    isEmpty() {
        return this.items.size === 0;
    }
    
    // Price calculations
    calculateSubtotal() {
        return Array.from(this.items.values()).reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);
    }
    
    calculateDiscounts() {
        let totalDiscount = 0;
        
        this.discounts.forEach(discount => {
            if (discount.type === 'percentage') {
                totalDiscount += this.calculateSubtotal() * (discount.value / 100);
            } else if (discount.type === 'fixed') {
                totalDiscount += discount.value;
            }
        });
        
        return totalDiscount;
    }
    
    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        
        if (subtotal >= this.shipping.freeShippingThreshold) {
            this.shipping.calculatedShipping = 0;
        } else {
            this.shipping.calculatedShipping = this.shipping.standardShipping;
        }
        
        return this.shipping.calculatedShipping;
    }
    
    calculateTaxes() {
        const subtotal = this.calculateSubtotal();
        const discounts = this.calculateDiscounts();
        const taxableAmount = subtotal - discounts;
        
        this.taxes.calculatedTax = taxableAmount * this.taxes.kdv;
        
        return this.taxes.calculatedTax;
    }
    
    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const discounts = this.calculateDiscounts();
        const shipping = this.calculateShipping();
        const taxes = this.calculateTaxes();
        
        return subtotal - discounts + shipping + taxes;
    }
    
    // Discount management
    addDiscount(discount) {
        this.discounts.push({
            id: discount.id,
            code: discount.code,
            type: discount.type, // 'percentage' or 'fixed'
            value: discount.value,
            description: discount.description,
            minAmount: discount.minAmount || 0,
            maxDiscount: discount.maxDiscount || null,
            validUntil: discount.validUntil || null,
            isActive: true
        });
        
        this.updateCartDisplay();
        this.saveCart();
        
        console.log(`✅ Discount added: ${discount.code}`);
        
        return true;
    }
    
    removeDiscount(discountId) {
        this.discounts = this.discounts.filter(d => d.id !== discountId);
        this.updateCartDisplay();
        this.saveCart();
        
        console.log(`✅ Discount removed: ${discountId}`);
        
        return true;
    }
    
    validateDiscount(discountCode) {
        // Mock discount validation - in real implementation, this would check with server
        const validDiscounts = {
            'WELCOME10': { type: 'percentage', value: 10, minAmount: 100 },
            'SAVE50': { type: 'fixed', value: 50, minAmount: 200 },
            'FREESHIP': { type: 'shipping', value: 0, minAmount: 0 }
        };
        
        const discount = validDiscounts[discountCode];
        if (!discount) {
            return { valid: false, message: 'Geçersiz indirim kodu' };
        }
        
        const subtotal = this.calculateSubtotal();
        if (discount.minAmount > subtotal) {
            return { 
                valid: false, 
                message: `Minimum ${discount.minAmount} TL alışveriş yapmanız gerekiyor` 
            };
        }
        
        return { valid: true, discount };
    }
    
    applyDiscountCode(discountCode) {
        const validation = this.validateDiscount(discountCode);
        
        if (!validation.valid) {
            throw new Error(validation.message);
        }
        
        const discount = {
            id: Date.now().toString(),
            code: discountCode,
            ...validation.discount,
            description: `İndirim kodu: ${discountCode}`,
            appliedAt: new Date().toISOString()
        };
        
        this.addDiscount(discount);
        
        return discount;
    }
    
    // Checkout process
    async checkout(customerData, paymentData) {
        try {
            console.log('🛒 Starting checkout process...');
            
            if (this.isEmpty()) {
                throw new Error('Sepet boş');
            }
            
            // Validate cart
            await this.validateCart();
            
            // Create order
            const order = await this.createOrder(customerData, paymentData);
            
            // Process payment
            const paymentResult = await this.processPayment(paymentData, order);
            
            if (paymentResult.success) {
                // Update inventory
                await this.updateInventory();
                
                // Clear cart
                this.clearCart();
                
                // Send confirmation
                await this.sendOrderConfirmation(order);
                
                console.log('✅ Checkout completed successfully');
                
                // Dispatch event
                this.dispatchCartEvent('checkoutCompleted', {
                    order,
                    paymentResult
                });
                
                return {
                    success: true,
                    order,
                    paymentResult
                };
            } else {
                throw new Error(paymentResult.message || 'Ödeme işlemi başarısız');
            }
        } catch (error) {
            console.error('❌ Checkout failed:', error);
            
            // Dispatch event
            this.dispatchCartEvent('checkoutFailed', {
                error: error.message
            });
            
            throw error;
        }
    }
    
    async validateCart() {
        const items = this.getAllItems();
        
        for (const item of items) {
            // Check if product still exists and is active
            const product = window.productManagement?.getProduct(item.productId);
            if (!product || !product.isActive) {
                throw new Error(`Ürün artık mevcut değil: ${item.product.name}`);
            }
            
            // Check stock availability
            if (!window.productManagement.checkStock(item.productId, item.quantity)) {
                throw new Error(`Yetersiz stok: ${item.product.name}`);
            }
            
            // Check price changes
            if (product.price !== item.unitPrice) {
                throw new Error(`Fiyat değişikliği: ${item.product.name}`);
            }
        }
        
        return true;
    }
    
    async createOrder(customerData, paymentData) {
        const order = {
            id: this.generateOrderId(),
            customer: customerData,
            items: this.getAllItems(),
            subtotal: this.calculateSubtotal(),
            discounts: this.calculateDiscounts(),
            shipping: this.calculateShipping(),
            taxes: this.calculateTaxes(),
            total: this.calculateTotal(),
            paymentMethod: paymentData.method,
            shippingAddress: customerData.shippingAddress,
            billingAddress: customerData.billingAddress,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save order (in real implementation, this would be saved to database)
        this.saveOrder(order);
        
        console.log('✅ Order created:', order.id);
        
        return order;
    }
    
    async processPayment(paymentData, order) {
        // Mock payment processing
        console.log('💳 Processing payment...');
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock payment success (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            return {
                success: true,
                transactionId: this.generateTransactionId(),
                amount: order.total,
                currency: 'TRY',
                method: paymentData.method,
                processedAt: new Date().toISOString()
            };
        } else {
            return {
                success: false,
                message: 'Ödeme işlemi başarısız oldu'
            };
        }
    }
    
    async updateInventory() {
        const items = this.getAllItems();
        
        for (const item of items) {
            window.productManagement?.updateStock(item.productId, item.quantity, 'subtract');
        }
        
        console.log('✅ Inventory updated');
    }
    
    async sendOrderConfirmation(order) {
        // Mock order confirmation
        console.log('📧 Sending order confirmation...');
        
        // In real implementation, this would send email/SMS
        return true;
    }
    
    // Utility methods
    generateOrderId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `ORD-${timestamp}-${random}`.toUpperCase();
    }
    
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `TXN-${timestamp}-${random}`.toUpperCase();
    }
    
    // Display management
    updateCartDisplay() {
        const cartSummary = this.getCartSummary();
        
        // Update cart icon badge
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            cartBadge.textContent = cartSummary.itemCount;
            cartBadge.style.display = cartSummary.itemCount > 0 ? 'block' : 'none';
        }
        
        // Update cart total
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.textContent = `₺${cartSummary.total.toFixed(2)}`;
        }
        
        // Update cart items display
        this.renderCartItems();
        
        // Dispatch event
        this.dispatchCartEvent('cartUpdated', cartSummary);
    }
    
    renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;
        
        const items = this.getAllItems();
        
        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Sepetiniz boş</div>';
            return;
        }
        
        cartItemsContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="cart-item-image">
                    <img src="/images/products/${item.product.images[0] || 'placeholder.jpg'}" 
                         alt="${item.product.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h4>${item.product.name}</h4>
                    <p class="cart-item-price">₺${item.unitPrice.toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" onclick="shoppingCart.updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="shoppingCart.updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span>₺${item.totalPrice.toFixed(2)}</span>
                    <button class="remove-item-btn" onclick="shoppingCart.removeItem('${item.productId}')">×</button>
                </div>
            </div>
        `).join('');
    }
    
    getCartSummary() {
        return {
            itemCount: this.getItemCount(),
            items: this.getAllItems(),
            subtotal: this.calculateSubtotal(),
            discounts: this.calculateDiscounts(),
            shipping: this.calculateShipping(),
            taxes: this.calculateTaxes(),
            total: this.calculateTotal()
        };
    }
    
    // Event handling
    setupEventListeners() {
        // Listen for product updates
        document.addEventListener('productUpdated', (event) => {
            this.handleProductUpdate(event.detail);
        });
        
        // Listen for stock updates
        document.addEventListener('stockUpdated', (event) => {
            this.handleStockUpdate(event.detail);
        });
    }
    
    handleProductUpdate(data) {
        // Update cart items if product was updated
        const item = this.items.get(data.productId);
        if (item) {
            item.product = data.product;
            item.unitPrice = data.product.price;
            item.totalPrice = item.unitPrice * item.quantity;
            item.updatedAt = new Date().toISOString();
            
            this.items.set(data.productId, item);
            this.updateCartDisplay();
            this.saveCart();
        }
    }
    
    handleStockUpdate(data) {
        // Check if cart items are still available
        const item = this.items.get(data.productId);
        if (item && data.stock < item.quantity) {
            console.warn(`⚠️ Stock reduced for ${item.product.name}, updating quantity`);
            this.updateQuantity(data.productId, data.stock);
        }
    }
    
    dispatchCartEvent(eventType, data) {
        const event = new CustomEvent(`cart:${eventType}`, {
            detail: data
        });
        document.dispatchEvent(event);
    }
    
    // Data persistence
    saveCart() {
        const cartData = {
            items: Array.from(this.items.entries()),
            discounts: this.discounts,
            shipping: this.shipping,
            taxes: this.taxes,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    }
    
    loadCart() {
        const cartData = localStorage.getItem('shoppingCart');
        if (cartData) {
            try {
                const parsedData = JSON.parse(cartData);
                
                this.items = new Map(parsedData.items || []);
                this.discounts = parsedData.discounts || [];
                this.shipping = { ...this.shipping, ...parsedData.shipping };
                this.taxes = { ...this.taxes, ...parsedData.taxes };
                
                console.log('📥 Cart loaded from localStorage');
            } catch (error) {
                console.error('❌ Error loading cart:', error);
            }
        }
    }
    
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Public API
    getCartData() {
        return {
            items: this.getAllItems(),
            summary: this.getCartSummary(),
            isEmpty: this.isEmpty()
        };
    }
}

// Initialize shopping cart
const shoppingCart = new ShoppingCart();

// Export for external use
window.shoppingCart = shoppingCart;

console.log('✅ Shopping Cart System ready!');
