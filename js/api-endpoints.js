/**
 * DC TEKNİK API Endpoints
 * Veritabanı API uç noktaları ve yönetimi
 * 
 * Features:
 * - RESTful API endpoints
 * - CRUD operations
 * - Data validation
 * - Error handling
 * - Authentication
 * - Rate limiting
 * - Caching
 */

class APIEndpoints {
    constructor() {
        this.baseURL = '/api';
        this.endpoints = {
            users: '/users',
            customers: '/customers',
            services: '/services',
            appointments: '/appointments',
            technicians: '/technicians',
            workOrders: '/work-orders',
            inventory: '/inventory',
            financialTransactions: '/financial-transactions',
            customerFeedback: '/customer-feedback',
            systemLogs: '/system-logs',
            notifications: '/notifications',
            siteAnalytics: '/site-analytics',
            performanceMetrics: '/performance-metrics',
            searchHistory: '/search-history',
            favorites: '/favorites'
        };
        
        this.cache = new Map();
        this.rateLimit = new Map();
        this.init();
    }
    
    init() {
        console.log('🔗 API Endpoints initialized');
        this.setupRateLimiting();
        this.setupCaching();
        this.setupInterceptors();
    }
    
    setupRateLimiting() {
        // Rate limiting: 100 requests per minute per IP
        this.rateLimitConfig = {
            windowMs: 60 * 1000, // 1 minute
            maxRequests: 100,
            message: 'Too many requests, please try again later.'
        };
    }
    
    setupCaching() {
        // Cache configuration
        this.cacheConfig = {
            defaultTTL: 5 * 60 * 1000, // 5 minutes
            maxSize: 1000
        };
    }
    
    setupInterceptors() {
        // Request interceptor
        this.requestInterceptor = (config) => {
            // Add authentication token
            const token = this.getAuthToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            
            // Add request timestamp
            config.headers['X-Request-Time'] = Date.now();
            
            return config;
        };
        
        // Response interceptor
        this.responseInterceptor = (response) => {
            // Log API calls
            this.logAPICall(response.config, response);
            
            // Update cache
            this.updateCache(response.config.url, response.data);
            
            return response;
        };
    }
    
    /**
     * Get authentication token
     */
    getAuthToken() {
        return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    }
    
    /**
     * Log API calls
     */
    logAPICall(config, response) {
        const logData = {
            url: config.url,
            method: config.method,
            status: response.status,
            timestamp: Date.now(),
            duration: Date.now() - config.headers['X-Request-Time']
        };
        
        console.log('📊 API Call:', logData);
        
        // Send to analytics if available
        if (window.analyticsEngine) {
            window.analyticsEngine.track('api_call', logData);
        }
    }
    
    /**
     * Update cache
     */
    updateCache(url, data) {
        const cacheKey = this.getCacheKey(url);
        const cacheItem = {
            data,
            timestamp: Date.now(),
            ttl: this.cacheConfig.defaultTTL
        };
        
        this.cache.set(cacheKey, cacheItem);
        
        // Clean up expired cache entries
        this.cleanupCache();
    }
    
    /**
     * Get cache key
     */
    getCacheKey(url) {
        return url.split('?')[0]; // Remove query parameters
    }
    
    /**
     * Clean up expired cache entries
     */
    cleanupCache() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    }
    
    /**
     * Check rate limit
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const windowStart = now - this.rateLimitConfig.windowMs;
        
        if (!this.rateLimit.has(identifier)) {
            this.rateLimit.set(identifier, []);
        }
        
        const requests = this.rateLimit.get(identifier);
        const recentRequests = requests.filter(timestamp => timestamp > windowStart);
        
        if (recentRequests.length >= this.rateLimitConfig.maxRequests) {
            throw new Error(this.rateLimitConfig.message);
        }
        
        recentRequests.push(now);
        this.rateLimit.set(identifier, recentRequests);
    }
    
    /**
     * Make API request
     */
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const identifier = this.getClientIdentifier();
        
        try {
            // Check rate limit
            this.checkRateLimit(identifier);
            
            // Check cache
            const cacheKey = this.getCacheKey(url);
            if (options.method === 'GET' && this.cache.has(cacheKey)) {
                const cacheItem = this.cache.get(cacheKey);
                if (Date.now() - cacheItem.timestamp < cacheItem.ttl) {
                    console.log('📦 Cache hit:', url);
                    return cacheItem.data;
                }
            }
            
            // Make request
            const config = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                ...options
            };
            
            // Apply request interceptor
            const interceptedConfig = this.requestInterceptor(config);
            
            const response = await fetch(url, interceptedConfig);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Apply response interceptor
            this.responseInterceptor({ config: interceptedConfig, data, status: response.status });
            
            return data;
        } catch (error) {
            console.error('❌ API Request failed:', error);
            throw error;
        }
    }
    
    /**
     * Get client identifier for rate limiting
     */
    getClientIdentifier() {
        // Use IP address or user ID for rate limiting
        return 'anonymous'; // This would be replaced with actual client identifier
    }
    
    /**
     * User API endpoints
     */
    userAPI = {
        // Get all users
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.users}?${queryString}`);
        },
        
        // Get user by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.users}/${id}`);
        },
        
        // Create user
        create: (data) => {
            return this.makeRequest(this.endpoints.users, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update user
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.users}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete user
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.users}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get user profile
        getProfile: () => {
            return this.makeRequest(`${this.endpoints.users}/profile`);
        },
        
        // Update user profile
        updateProfile: (data) => {
            return this.makeRequest(`${this.endpoints.users}/profile`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
    };
    
    /**
     * Customer API endpoints
     */
    customerAPI = {
        // Get all customers
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.customers}?${queryString}`);
        },
        
        // Get customer by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.customers}/${id}`);
        },
        
        // Create customer
        create: (data) => {
            return this.makeRequest(this.endpoints.customers, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update customer
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.customers}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete customer
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.customers}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get customer statistics
        getStats: (id) => {
            return this.makeRequest(`${this.endpoints.customers}/${id}/stats`);
        },
        
        // Search customers
        search: (query, filters = {}) => {
            const params = { q: query, ...filters };
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.customers}/search?${queryString}`);
        }
    };
    
    /**
     * Service API endpoints
     */
    serviceAPI = {
        // Get all services
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.services}?${queryString}`);
        },
        
        // Get service by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.services}/${id}`);
        },
        
        // Create service
        create: (data) => {
            return this.makeRequest(this.endpoints.services, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update service
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.services}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete service
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.services}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get services by category
        getByCategory: (category) => {
            return this.makeRequest(`${this.endpoints.services}/category/${category}`);
        },
        
        // Get service analytics
        getAnalytics: (id) => {
            return this.makeRequest(`${this.endpoints.services}/${id}/analytics`);
        }
    };
    
    /**
     * Appointment API endpoints
     */
    appointmentAPI = {
        // Get all appointments
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.appointments}?${queryString}`);
        },
        
        // Get appointment by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.appointments}/${id}`);
        },
        
        // Create appointment
        create: (data) => {
            return this.makeRequest(this.endpoints.appointments, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update appointment
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.appointments}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete appointment
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.appointments}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get appointments by date range
        getByDateRange: (startDate, endDate) => {
            return this.makeRequest(`${this.endpoints.appointments}/date-range?start=${startDate}&end=${endDate}`);
        },
        
        // Get appointments by customer
        getByCustomer: (customerId) => {
            return this.makeRequest(`${this.endpoints.appointments}/customer/${customerId}`);
        },
        
        // Get appointments by technician
        getByTechnician: (technicianId) => {
            return this.makeRequest(`${this.endpoints.appointments}/technician/${technicianId}`);
        },
        
        // Reschedule appointment
        reschedule: (id, newDate) => {
            return this.makeRequest(`${this.endpoints.appointments}/${id}/reschedule`, {
                method: 'PUT',
                body: JSON.stringify({ appointment_date: newDate })
            });
        }
    };
    
    /**
     * Technician API endpoints
     */
    technicianAPI = {
        // Get all technicians
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.technicians}?${queryString}`);
        },
        
        // Get technician by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.technicians}/${id}`);
        },
        
        // Create technician
        create: (data) => {
            return this.makeRequest(this.endpoints.technicians, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update technician
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.technicians}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete technician
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.technicians}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get available technicians
        getAvailable: (date, duration) => {
            return this.makeRequest(`${this.endpoints.technicians}/available?date=${date}&duration=${duration}`);
        },
        
        // Get technician performance
        getPerformance: (id) => {
            return this.makeRequest(`${this.endpoints.technicians}/${id}/performance`);
        },
        
        // Update technician availability
        updateAvailability: (id, availability) => {
            return this.makeRequest(`${this.endpoints.technicians}/${id}/availability`, {
                method: 'PUT',
                body: JSON.stringify({ availability_schedule: availability })
            });
        }
    };
    
    /**
     * Work Order API endpoints
     */
    workOrderAPI = {
        // Get all work orders
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.workOrders}?${queryString}`);
        },
        
        // Get work order by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.workOrders}/${id}`);
        },
        
        // Create work order
        create: (data) => {
            return this.makeRequest(this.endpoints.workOrders, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update work order
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.workOrders}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete work order
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.workOrders}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get work orders by status
        getByStatus: (status) => {
            return this.makeRequest(`${this.endpoints.workOrders}/status/${status}`);
        },
        
        // Get work orders by customer
        getByCustomer: (customerId) => {
            return this.makeRequest(`${this.endpoints.workOrders}/customer/${customerId}`);
        },
        
        // Get work orders by technician
        getByTechnician: (technicianId) => {
            return this.makeRequest(`${this.endpoints.workOrders}/technician/${technicianId}`);
        },
        
        // Start work order
        start: (id) => {
            return this.makeRequest(`${this.endpoints.workOrders}/${id}/start`, {
                method: 'PUT'
            });
        },
        
        // Complete work order
        complete: (id, data) => {
            return this.makeRequest(`${this.endpoints.workOrders}/${id}/complete`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
    };
    
    /**
     * Inventory API endpoints
     */
    inventoryAPI = {
        // Get all inventory items
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.inventory}?${queryString}`);
        },
        
        // Get inventory item by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.inventory}/${id}`);
        },
        
        // Create inventory item
        create: (data) => {
            return this.makeRequest(this.endpoints.inventory, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update inventory item
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.inventory}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete inventory item
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.inventory}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get low stock items
        getLowStock: () => {
            return this.makeRequest(`${this.endpoints.inventory}/low-stock`);
        },
        
        // Search inventory
        search: (query) => {
            return this.makeRequest(`${this.endpoints.inventory}/search?q=${query}`);
        },
        
        // Update stock
        updateStock: (id, quantity) => {
            return this.makeRequest(`${this.endpoints.inventory}/${id}/stock`, {
                method: 'PUT',
                body: JSON.stringify({ quantity })
            });
        }
    };
    
    /**
     * Financial Transaction API endpoints
     */
    financialTransactionAPI = {
        // Get all transactions
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.financialTransactions}?${queryString}`);
        },
        
        // Get transaction by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.financialTransactions}/${id}`);
        },
        
        // Create transaction
        create: (data) => {
            return this.makeRequest(this.endpoints.financialTransactions, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Update transaction
        update: (id, data) => {
            return this.makeRequest(`${this.endpoints.financialTransactions}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        // Delete transaction
        delete: (id) => {
            return this.makeRequest(`${this.endpoints.financialTransactions}/${id}`, {
                method: 'DELETE'
            });
        },
        
        // Get transactions by date range
        getByDateRange: (startDate, endDate) => {
            return this.makeRequest(`${this.endpoints.financialTransactions}/date-range?start=${startDate}&end=${endDate}`);
        },
        
        // Get revenue summary
        getRevenueSummary: (period = 'month') => {
            return this.makeRequest(`${this.endpoints.financialTransactions}/revenue-summary?period=${period}`);
        }
    };
    
    /**
     * Analytics API endpoints
     */
    analyticsAPI = {
        // Get site analytics
        getSiteAnalytics: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.siteAnalytics}?${queryString}`);
        },
        
        // Get performance metrics
        getPerformanceMetrics: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.performanceMetrics}?${queryString}`);
        },
        
        // Get dashboard data
        getDashboardData: () => {
            return this.makeRequest(`${this.endpoints.siteAnalytics}/dashboard`);
        },
        
        // Get conversion funnel
        getConversionFunnel: () => {
            return this.makeRequest(`${this.endpoints.siteAnalytics}/conversion-funnel`);
        },
        
        // Get user behavior
        getUserBehavior: () => {
            return this.makeRequest(`${this.endpoints.siteAnalytics}/user-behavior`);
        }
    };
    
    /**
     * Search API endpoints
     */
    searchAPI = {
        // Global search
        global: (query, filters = {}) => {
            const params = { q: query, ...filters };
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`/search?${queryString}`);
        },
        
        // Search customers
        customers: (query) => {
            return this.makeRequest(`${this.endpoints.customers}/search?q=${query}`);
        },
        
        // Search services
        services: (query) => {
            return this.makeRequest(`${this.endpoints.services}/search?q=${query}`);
        },
        
        // Search inventory
        inventory: (query) => {
            return this.makeRequest(`${this.endpoints.inventory}/search?q=${query}`);
        },
        
        // Get search suggestions
        getSuggestions: (query) => {
            return this.makeRequest(`/search/suggestions?q=${query}`);
        }
    };
    
    /**
     * Notification API endpoints
     */
    notificationAPI = {
        // Get all notifications
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.makeRequest(`${this.endpoints.notifications}?${queryString}`);
        },
        
        // Get notification by ID
        getById: (id) => {
            return this.makeRequest(`${this.endpoints.notifications}/${id}`);
        },
        
        // Create notification
        create: (data) => {
            return this.makeRequest(this.endpoints.notifications, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        // Mark as read
        markAsRead: (id) => {
            return this.makeRequest(`${this.endpoints.notifications}/${id}/read`, {
                method: 'PUT'
            });
        },
        
        // Mark all as read
        markAllAsRead: () => {
            return this.makeRequest(`${this.endpoints.notifications}/mark-all-read`, {
                method: 'PUT'
            });
        },
        
        // Get unread count
        getUnreadCount: () => {
            return this.makeRequest(`${this.endpoints.notifications}/unread-count`);
        }
    };
    
    /**
     * Utility methods
     */
    utils = {
        // Clear cache
        clearCache: () => {
            this.cache.clear();
            console.log('🧹 Cache cleared');
        },
        
        // Get cache stats
        getCacheStats: () => {
            return {
                size: this.cache.size,
                keys: Array.from(this.cache.keys())
            };
        },
        
        // Test API connection
        testConnection: async () => {
            try {
                const response = await this.makeRequest('/health');
                console.log('✅ API connection successful');
                return true;
            } catch (error) {
                console.error('❌ API connection failed:', error);
                return false;
            }
        }
    };
}

// Initialize API endpoints
const apiEndpoints = new APIEndpoints();

// Export for external use
window.apiEndpoints = apiEndpoints;

console.log('✅ API Endpoints ready!');
