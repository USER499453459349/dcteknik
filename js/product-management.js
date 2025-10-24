/**
 * DC TEKNİK Product Management System
 * Ürün yönetim sistemi ve e-ticaret entegrasyonu
 * 
 * Features:
 * - Product catalog management
 * - Category management
 * - Inventory tracking
 * - Price management
 * - Product search and filtering
 * - Image management
 * - SEO optimization
 * - Bulk operations
 */

class ProductManagement {
    constructor() {
        this.products = new Map();
        this.categories = new Map();
        this.inventory = new Map();
        this.pricing = new Map();
        this.images = new Map();
        this.seo = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🛍️ Product Management System initialized');
        this.setupCategories();
        this.setupDefaultProducts();
        this.setupEventListeners();
        this.loadProducts();
    }
    
    setupCategories() {
        // Dinamo ve elektrik parçaları kategorileri
        this.categories.set('dinamo-parcalari', {
            id: 'dinamo-parcalari',
            name: 'Dinamo Parçaları',
            description: 'Dinamo tamiri için gerekli tüm parçalar',
            icon: '⚡',
            parent: null,
            isActive: true,
            sortOrder: 1
        });
        
        this.categories.set('alternator-parcalari', {
            id: 'alternator-parcalari',
            name: 'Alternatör Parçaları',
            description: 'Alternatör tamiri için gerekli parçalar',
            icon: '🔋',
            parent: null,
            isActive: true,
            sortOrder: 2
        });
        
        this.categories.set('mars-motoru-parcalari', {
            id: 'mars-motoru-parcalari',
            name: 'Marş Motoru Parçaları',
            description: 'Marş motoru tamiri için gerekli parçalar',
            icon: '🚗',
            parent: null,
            isActive: true,
            sortOrder: 3
        });
        
        this.categories.set('klima-parcalari', {
            id: 'klima-parcalari',
            name: 'Klima Parçaları',
            description: 'Klima sistemi parçaları',
            icon: '❄️',
            parent: null,
            isActive: true,
            sortOrder: 4
        });
        
        this.categories.set('elektrik-parcalari', {
            id: 'elektrik-parcalari',
            name: 'Elektrik Parçaları',
            description: 'Genel elektrik parçaları',
            icon: '🔌',
            parent: null,
            isActive: true,
            sortOrder: 5
        });
        
        this.categories.set('araclar', {
            id: 'araclar',
            name: 'Araçlar',
            description: 'Tamir ve bakım araçları',
            icon: '🔧',
            parent: null,
            isActive: true,
            sortOrder: 6
        });
    }
    
    setupDefaultProducts() {
        // Dinamo parçaları
        this.addProduct({
            id: 'dinamo-bobi-12v',
            name: 'Dinamo Bobini 12V',
            description: 'Otomotiv dinamo bobini, 12V, yüksek kalite',
            category: 'dinamo-parcalari',
            sku: 'DIN-BOB-12V-001',
            price: 450.00,
            cost: 300.00,
            stock: 25,
            minStock: 5,
            maxStock: 50,
            weight: 0.8,
            dimensions: { length: 15, width: 10, height: 8 },
            images: ['dinamo-bobi-12v-1.jpg', 'dinamo-bobi-12v-2.jpg'],
            features: ['12V', 'Yüksek Kalite', 'Garantili', 'OEM Uyumlu'],
            compatibility: ['Opel', 'Renault', 'Fiat', 'Peugeot'],
            warranty: '12 ay',
            isActive: true,
            isFeatured: true,
            tags: ['dinamo', 'bobini', '12v', 'otomotiv']
        });
        
        this.addProduct({
            id: 'dinamo-kolektor',
            name: 'Dinamo Kolektör',
            description: 'Dinamo kolektör, fırça takımı ile birlikte',
            category: 'dinamo-parcalari',
            sku: 'DIN-KOL-001',
            price: 280.00,
            cost: 180.00,
            stock: 18,
            minStock: 3,
            maxStock: 30,
            weight: 0.5,
            dimensions: { length: 12, width: 8, height: 6 },
            images: ['dinamo-kolektor-1.jpg'],
            features: ['Fırça Takımı Dahil', 'Yüksek Kalite', 'Garantili'],
            compatibility: ['Genel Uyumlu'],
            warranty: '6 ay',
            isActive: true,
            isFeatured: false,
            tags: ['dinamo', 'kolektor', 'fırça']
        });
        
        // Alternatör parçaları
        this.addProduct({
            id: 'alternator-regulator',
            name: 'Alternatör Regülatör',
            description: 'Alternatör voltaj regülatörü, 14.4V',
            category: 'alternator-parcalari',
            sku: 'ALT-REG-144V-001',
            price: 320.00,
            cost: 200.00,
            stock: 15,
            minStock: 3,
            maxStock: 25,
            weight: 0.3,
            dimensions: { length: 8, width: 6, height: 4 },
            images: ['alternator-regulator-1.jpg'],
            features: ['14.4V', 'Elektronik', 'Garantili', 'OEM Uyumlu'],
            compatibility: ['Opel', 'Renault', 'Fiat'],
            warranty: '12 ay',
            isActive: true,
            isFeatured: true,
            tags: ['alternator', 'regulator', 'voltaj']
        });
        
        // Marş motoru parçaları
        this.addProduct({
            id: 'mars-motoru-bendix',
            name: 'Marş Motoru Bendix',
            description: 'Marş motoru bendix dişlisi, yüksek dayanıklılık',
            category: 'mars-motoru-parcalari',
            sku: 'MAR-BEN-001',
            price: 380.00,
            cost: 250.00,
            stock: 12,
            minStock: 2,
            maxStock: 20,
            weight: 0.6,
            dimensions: { length: 10, width: 10, height: 5 },
            images: ['mars-motoru-bendix-1.jpg'],
            features: ['Yüksek Dayanıklılık', 'Garantili', 'OEM Uyumlu'],
            compatibility: ['Opel', 'Renault', 'Fiat', 'Peugeot'],
            warranty: '12 ay',
            isActive: true,
            isFeatured: false,
            tags: ['mars', 'motoru', 'bendix', 'dişli']
        });
        
        // Klima parçaları
        this.addProduct({
            id: 'klima-kompresor',
            name: 'Klima Kompresörü',
            description: 'Klima kompresörü, yenilenmiş, garantili',
            category: 'klima-parcalari',
            sku: 'KLI-KOM-001',
            price: 1200.00,
            cost: 800.00,
            stock: 8,
            minStock: 1,
            maxStock: 15,
            weight: 8.5,
            dimensions: { length: 20, width: 18, height: 15 },
            images: ['klima-kompresor-1.jpg', 'klima-kompresor-2.jpg'],
            features: ['Yenilenmiş', 'Garantili', 'OEM Uyumlu', 'Test Edilmiş'],
            compatibility: ['Opel', 'Renault', 'Fiat'],
            warranty: '6 ay',
            isActive: true,
            isFeatured: true,
            tags: ['klima', 'kompresor', 'yenilenmiş']
        });
        
        // Elektrik parçaları
        this.addProduct({
            id: 'elektrik-relay',
            name: 'Elektrik Röle',
            description: 'Otomotiv elektrik rölesi, 12V, 4 pin',
            category: 'elektrik-parcalari',
            sku: 'ELE-REL-12V-4P',
            price: 45.00,
            cost: 25.00,
            stock: 50,
            minStock: 10,
            maxStock: 100,
            weight: 0.1,
            dimensions: { length: 5, width: 4, height: 3 },
            images: ['elektrik-relay-1.jpg'],
            features: ['12V', '4 Pin', 'Yüksek Kalite', 'Garantili'],
            compatibility: ['Genel Uyumlu'],
            warranty: '12 ay',
            isActive: true,
            isFeatured: false,
            tags: ['elektrik', 'relay', 'rore', '12v']
        });
        
        // Araçlar
        this.addProduct({
            id: 'multimetre-digital',
            name: 'Dijital Multimetre',
            description: 'Profesyonel dijital multimetre, otomotiv kullanımı için',
            category: 'araclar',
            sku: 'ARA-MUL-DIG-001',
            price: 180.00,
            cost: 120.00,
            stock: 10,
            minStock: 2,
            maxStock: 20,
            weight: 0.4,
            dimensions: { length: 18, width: 8, height: 4 },
            images: ['multimetre-digital-1.jpg'],
            features: ['Dijital', 'Profesyonel', 'Otomotiv', 'Garantili'],
            compatibility: ['Genel Kullanım'],
            warranty: '24 ay',
            isActive: true,
            isFeatured: true,
            tags: ['multimetre', 'dijital', 'araç', 'ölçüm']
        });
    }
    
    addProduct(productData) {
        const product = {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            category: productData.category,
            sku: productData.sku,
            price: productData.price,
            cost: productData.cost,
            stock: productData.stock,
            minStock: productData.minStock,
            maxStock: productData.maxStock,
            weight: productData.weight,
            dimensions: productData.dimensions,
            images: productData.images || [],
            features: productData.features || [],
            compatibility: productData.compatibility || [],
            warranty: productData.warranty,
            isActive: productData.isActive !== undefined ? productData.isActive : true,
            isFeatured: productData.isFeatured || false,
            tags: productData.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0,
            sales: 0,
            rating: 0,
            reviews: []
        };
        
        this.products.set(product.id, product);
        
        // Update inventory
        this.updateInventory(product.id, product.stock);
        
        // Update pricing
        this.updatePricing(product.id, product.price, product.cost);
        
        console.log('✅ Product added:', product.name);
        return product;
    }
    
    updateProduct(id, updateData) {
        const product = this.products.get(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        
        const updatedProduct = {
            ...product,
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        this.products.set(id, updatedProduct);
        
        // Update related data
        if (updateData.stock !== undefined) {
            this.updateInventory(id, updateData.stock);
        }
        
        if (updateData.price !== undefined || updateData.cost !== undefined) {
            this.updatePricing(id, updateData.price || product.price, updateData.cost || product.cost);
        }
        
        console.log('✅ Product updated:', updatedProduct.name);
        return updatedProduct;
    }
    
    deleteProduct(id) {
        const product = this.products.get(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        
        this.products.delete(id);
        this.inventory.delete(id);
        this.pricing.delete(id);
        
        console.log('✅ Product deleted:', product.name);
        return true;
    }
    
    getProduct(id) {
        const product = this.products.get(id);
        if (product) {
            // Increment view count
            product.views++;
            this.products.set(id, product);
        }
        return product;
    }
    
    getAllProducts(filters = {}) {
        let products = Array.from(this.products.values());
        
        // Apply filters
        if (filters.category) {
            products = products.filter(p => p.category === filters.category);
        }
        
        if (filters.isActive !== undefined) {
            products = products.filter(p => p.isActive === filters.isActive);
        }
        
        if (filters.isFeatured !== undefined) {
            products = products.filter(p => p.isFeatured === filters.isFeatured);
        }
        
        if (filters.minPrice !== undefined) {
            products = products.filter(p => p.price >= filters.minPrice);
        }
        
        if (filters.maxPrice !== undefined) {
            products = products.filter(p => p.price <= filters.maxPrice);
        }
        
        if (filters.inStock !== undefined && filters.inStock) {
            products = products.filter(p => p.stock > 0);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        // Sort products
        if (filters.sortBy) {
            products.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'newest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'popular':
                        return b.views - a.views;
                    case 'sales':
                        return b.sales - a.sales;
                    default:
                        return 0;
                }
            });
        }
        
        return products;
    }
    
    searchProducts(query, filters = {}) {
        const searchFilters = {
            ...filters,
            search: query
        };
        
        return this.getAllProducts(searchFilters);
    }
    
    getFeaturedProducts(limit = 6) {
        return this.getAllProducts({ isFeatured: true, isActive: true }).slice(0, limit);
    }
    
    getProductsByCategory(categoryId, limit = null) {
        const products = this.getAllProducts({ category: categoryId, isActive: true });
        return limit ? products.slice(0, limit) : products;
    }
    
    getCategories() {
        return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
    }
    
    getCategory(id) {
        return this.categories.get(id);
    }
    
    addCategory(categoryData) {
        const category = {
            id: categoryData.id,
            name: categoryData.name,
            description: categoryData.description,
            icon: categoryData.icon || '📦',
            parent: categoryData.parent || null,
            isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
            sortOrder: categoryData.sortOrder || 999,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.categories.set(category.id, category);
        console.log('✅ Category added:', category.name);
        return category;
    }
    
    updateCategory(id, updateData) {
        const category = this.categories.get(id);
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        
        const updatedCategory = {
            ...category,
            ...updateData,
            updatedAt: new Date().toISOString()
        };
        
        this.categories.set(id, updatedCategory);
        console.log('✅ Category updated:', updatedCategory.name);
        return updatedCategory;
    }
    
    // Inventory management
    updateInventory(productId, quantity) {
        this.inventory.set(productId, {
            quantity,
            lastUpdated: new Date().toISOString()
        });
    }
    
    getInventory(productId) {
        return this.inventory.get(productId);
    }
    
    checkStock(productId, requestedQuantity) {
        const inventory = this.inventory.get(productId);
        return inventory && inventory.quantity >= requestedQuantity;
    }
    
    updateStock(productId, quantity, operation = 'set') {
        const inventory = this.inventory.get(productId);
        if (!inventory) {
            throw new Error(`Inventory for product ${productId} not found`);
        }
        
        let newQuantity;
        switch (operation) {
            case 'add':
                newQuantity = inventory.quantity + quantity;
                break;
            case 'subtract':
                newQuantity = inventory.quantity - quantity;
                break;
            case 'set':
            default:
                newQuantity = quantity;
                break;
        }
        
        this.updateInventory(productId, newQuantity);
        
        // Update product stock
        const product = this.products.get(productId);
        if (product) {
            product.stock = newQuantity;
            this.products.set(productId, product);
        }
        
        console.log(`✅ Stock updated for product ${productId}: ${newQuantity}`);
        return newQuantity;
    }
    
    getLowStockProducts() {
        const products = Array.from(this.products.values());
        return products.filter(p => p.stock <= p.minStock);
    }
    
    // Pricing management
    updatePricing(productId, price, cost) {
        this.pricing.set(productId, {
            price,
            cost,
            margin: price - cost,
            marginPercent: cost > 0 ? ((price - cost) / cost) * 100 : 0,
            lastUpdated: new Date().toISOString()
        });
    }
    
    getPricing(productId) {
        return this.pricing.get(productId);
    }
    
    // Sales tracking
    recordSale(productId, quantity, totalAmount) {
        const product = this.products.get(productId);
        if (product) {
            product.sales += quantity;
            this.products.set(productId, product);
            
            // Update stock
            this.updateStock(productId, quantity, 'subtract');
            
            console.log(`✅ Sale recorded for product ${productId}: ${quantity} units, ${totalAmount} TL`);
        }
    }
    
    getTopSellingProducts(limit = 10) {
        const products = Array.from(this.products.values());
        return products
            .sort((a, b) => b.sales - a.sales)
            .slice(0, limit);
    }
    
    // Analytics
    getProductAnalytics() {
        const products = Array.from(this.products.values());
        
        return {
            totalProducts: products.length,
            activeProducts: products.filter(p => p.isActive).length,
            featuredProducts: products.filter(p => p.isFeatured).length,
            totalStock: products.reduce((sum, p) => sum + p.stock, 0),
            lowStockProducts: this.getLowStockProducts().length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
            averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
            topCategories: this.getTopCategories(),
            salesSummary: this.getSalesSummary()
        };
    }
    
    getTopCategories() {
        const categoryStats = {};
        
        Array.from(this.products.values()).forEach(product => {
            if (!categoryStats[product.category]) {
                categoryStats[product.category] = {
                    name: this.getCategory(product.category)?.name || product.category,
                    productCount: 0,
                    totalSales: 0,
                    totalValue: 0
                };
            }
            
            categoryStats[product.category].productCount++;
            categoryStats[product.category].totalSales += product.sales;
            categoryStats[product.category].totalValue += product.price * product.stock;
        });
        
        return Object.values(categoryStats)
            .sort((a, b) => b.totalSales - a.totalSales)
            .slice(0, 5);
    }
    
    getSalesSummary() {
        const products = Array.from(this.products.values());
        
        return {
            totalSales: products.reduce((sum, p) => sum + p.sales, 0),
            totalRevenue: products.reduce((sum, p) => sum + (p.price * p.sales), 0),
            averageSalePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
            topSellingProducts: this.getTopSellingProducts(5)
        };
    }
    
    // Event listeners
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
        console.log('📦 Product update received:', data);
        // Handle product update logic
    }
    
    handleStockUpdate(data) {
        console.log('📊 Stock update received:', data);
        // Handle stock update logic
    }
    
    // Data persistence
    saveToLocalStorage() {
        const data = {
            products: Array.from(this.products.entries()),
            categories: Array.from(this.categories.entries()),
            inventory: Array.from(this.inventory.entries()),
            pricing: Array.from(this.pricing.entries())
        };
        
        localStorage.setItem('productManagement', JSON.stringify(data));
        console.log('💾 Product data saved to localStorage');
    }
    
    loadFromLocalStorage() {
        const data = localStorage.getItem('productManagement');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                
                this.products = new Map(parsedData.products || []);
                this.categories = new Map(parsedData.categories || []);
                this.inventory = new Map(parsedData.inventory || []);
                this.pricing = new Map(parsedData.pricing || []);
                
                console.log('📥 Product data loaded from localStorage');
            } catch (error) {
                console.error('❌ Error loading product data:', error);
            }
        }
    }
    
    loadProducts() {
        this.loadFromLocalStorage();
        
        // If no data in localStorage, use default products
        if (this.products.size === 0) {
            console.log('📦 No saved products found, using default products');
        }
        
        // Save current data
        this.saveToLocalStorage();
    }
}

// Initialize product management
const productManagement = new ProductManagement();

// Export for external use
window.productManagement = productManagement;

console.log('✅ Product Management System ready!');
