/**
 * DC TEKNİK Query Engine
 * Gelişmiş sorgu motoru ve veri analizi
 * 
 * Features:
 * - Advanced query building
 * - Data filtering and sorting
 * - Aggregation functions
 * - Real-time data processing
 * - Query optimization
 * - Caching and performance
 */

class QueryEngine {
    constructor() {
        this.queries = new Map();
        this.cache = new Map();
        this.performanceMetrics = {
            queryCount: 0,
            totalTime: 0,
            averageTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
        
        this.init();
    }
    
    init() {
        console.log('🔍 Query Engine initialized');
        this.setupQueryBuilder();
        this.setupAggregation();
        this.setupOptimization();
    }
    
    setupQueryBuilder() {
        this.queryBuilder = {
            select: (fields) => {
                return new QueryBuilder().select(fields);
            },
            
            from: (table) => {
                return new QueryBuilder().from(table);
            },
            
            where: (conditions) => {
                return new QueryBuilder().where(conditions);
            },
            
            join: (table, condition) => {
                return new QueryBuilder().join(table, condition);
            },
            
            groupBy: (fields) => {
                return new QueryBuilder().groupBy(fields);
            },
            
            orderBy: (fields) => {
                return new QueryBuilder().orderBy(fields);
            },
            
            limit: (count) => {
                return new QueryBuilder().limit(count);
            }
        };
    }
    
    setupAggregation() {
        this.aggregation = {
            count: (field = '*') => `COUNT(${field})`,
            sum: (field) => `SUM(${field})`,
            avg: (field) => `AVG(${field})`,
            min: (field) => `MIN(${field})`,
            max: (field) => `MAX(${field})`,
            distinct: (field) => `COUNT(DISTINCT ${field})`
        };
    }
    
    setupOptimization() {
        this.optimization = {
            enableCaching: true,
            cacheTimeout: 5 * 60 * 1000, // 5 minutes
            maxCacheSize: 1000,
            queryTimeout: 30000 // 30 seconds
        };
    }
    
    /**
     * Execute query
     */
    async execute(query, options = {}) {
        const startTime = Date.now();
        this.performanceMetrics.queryCount++;
        
        try {
            // Check cache first
            const cacheKey = this.getCacheKey(query);
            if (this.optimization.enableCaching && this.cache.has(cacheKey)) {
                const cachedResult = this.cache.get(cacheKey);
                if (Date.now() - cachedResult.timestamp < this.optimization.cacheTimeout) {
                    this.performanceMetrics.cacheHits++;
                    console.log('📦 Cache hit for query:', query);
                    return cachedResult.data;
                } else {
                    this.cache.delete(cacheKey);
                }
            }
            
            this.performanceMetrics.cacheMisses++;
            
            // Optimize query
            const optimizedQuery = this.optimizeQuery(query);
            
            // Execute query
            const result = await this.runQuery(optimizedQuery, options);
            
            // Cache result
            if (this.optimization.enableCaching) {
                this.cacheResult(cacheKey, result);
            }
            
            // Update performance metrics
            const executionTime = Date.now() - startTime;
            this.performanceMetrics.totalTime += executionTime;
            this.performanceMetrics.averageTime = this.performanceMetrics.totalTime / this.performanceMetrics.queryCount;
            
            console.log(`📊 Query executed in ${executionTime}ms:`, query);
            
            return result;
        } catch (error) {
            console.error('❌ Query execution failed:', error);
            throw error;
        }
    }
    
    /**
     * Get cache key
     */
    getCacheKey(query) {
        return JSON.stringify(query);
    }
    
    /**
     * Cache result
     */
    cacheResult(key, data) {
        if (this.cache.size >= this.optimization.maxCacheSize) {
            // Remove oldest entries
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    /**
     * Optimize query
     */
    optimizeQuery(query) {
        // Add query optimization logic here
        return query;
    }
    
    /**
     * Run query (mock implementation)
     */
    async runQuery(query, options = {}) {
        // This would be replaced with actual database connection
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [],
                    count: 0,
                    executionTime: Date.now()
                });
            }, 100);
        });
    }
    
    /**
     * Customer queries
     */
    customerQueries = {
        // Get all customers with pagination
        getAll: (page = 1, limit = 20, filters = {}) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('customers')
                .where(filters)
                .orderBy(['created_at DESC'])
                .limit(limit)
                .offset((page - 1) * limit)
                .build();
            
            return this.execute(query);
        },
        
        // Get customer by ID with related data
        getById: (id) => {
            const query = this.queryBuilder
                .select([
                    'c.*',
                    'u.name',
                    'u.surname',
                    'u.email',
                    'u.phone'
                ])
                .from('customers c')
                .join('users u', 'c.user_id = u.id')
                .where({ 'c.id': id })
                .build();
            
            return this.execute(query);
        },
        
        // Search customers
        search: (searchTerm, filters = {}) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('customers')
                .where({
                    ...filters,
                    $or: [
                        { company_name: { $like: `%${searchTerm}%` } },
                        { contact_person: { $like: `%${searchTerm}%` } },
                        { contact_email: { $like: `%${searchTerm}%` } }
                    ]
                })
                .orderBy(['company_name ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get customer statistics
        getStats: (id) => {
            const queries = {
                totalOrders: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('work_orders')
                    .where({ customer_id: id })
                    .build(),
                
                totalSpent: this.queryBuilder
                    .select([this.aggregation.sum('total_cost')])
                    .from('work_orders')
                    .where({ customer_id: id, status: 'completed' })
                    .build(),
                
                averageRating: this.queryBuilder
                    .select([this.aggregation.avg('customer_rating')])
                    .from('work_orders')
                    .where({ customer_id: id, customer_rating: { $not: null } })
                    .build(),
                
                lastServiceDate: this.queryBuilder
                    .select(['MAX(end_time) as last_service'])
                    .from('work_orders')
                    .where({ customer_id: id, status: 'completed' })
                    .build()
            };
            
            return Promise.all(Object.values(queries).map(query => this.execute(query)));
        },
        
        // Get top customers by revenue
        getTopByRevenue: (limit = 10) => {
            const query = this.queryBuilder
                .select([
                    'c.id',
                    'c.company_name',
                    'c.contact_person',
                    this.aggregation.sum('wo.total_cost').as('total_revenue'),
                    this.aggregation.count('wo.id').as('total_orders')
                ])
                .from('customers c')
                .join('work_orders wo', 'c.id = wo.customer_id')
                .where({ 'wo.status': 'completed' })
                .groupBy(['c.id', 'c.company_name', 'c.contact_person'])
                .orderBy(['total_revenue DESC'])
                .limit(limit)
                .build();
            
            return this.execute(query);
        }
    };
    
    /**
     * Service queries
     */
    serviceQueries = {
        // Get all services with analytics
        getAllWithAnalytics: () => {
            const query = this.queryBuilder
                .select([
                    's.*',
                    this.aggregation.count('wo.id').as('total_orders'),
                    this.aggregation.avg('wo.total_cost').as('avg_order_value'),
                    this.aggregation.avg('wo.actual_duration').as('avg_duration'),
                    this.aggregation.avg('wo.customer_rating').as('avg_rating')
                ])
                .from('services s')
                .leftJoin('work_orders wo', 's.id = wo.service_id')
                .where({ 's.is_active': true })
                .groupBy(['s.id'])
                .orderBy(['s.name ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get services by category
        getByCategory: (category) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('services')
                .where({ category, is_active: true })
                .orderBy(['name ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get popular services
        getPopular: (limit = 10) => {
            const query = this.queryBuilder
                .select([
                    's.*',
                    this.aggregation.count('wo.id').as('order_count')
                ])
                .from('services s')
                .join('work_orders wo', 's.id = wo.service_id')
                .where({ 'wo.status': 'completed' })
                .groupBy(['s.id'])
                .orderBy(['order_count DESC'])
                .limit(limit)
                .build();
            
            return this.execute(query);
        }
    };
    
    /**
     * Appointment queries
     */
    appointmentQueries = {
        // Get appointments by date range
        getByDateRange: (startDate, endDate, filters = {}) => {
            const query = this.queryBuilder
                .select([
                    'a.*',
                    'c.company_name',
                    'c.contact_person',
                    's.name as service_name',
                    't.name as technician_name'
                ])
                .from('appointments a')
                .join('customers c', 'a.customer_id = c.id')
                .join('services s', 'a.service_id = s.id')
                .leftJoin('technicians t', 'a.assigned_technician = t.id')
                .where({
                    ...filters,
                    'a.appointment_date': { $between: [startDate, endDate] }
                })
                .orderBy(['a.appointment_date ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get appointments by status
        getByStatus: (status) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('appointments')
                .where({ status })
                .orderBy(['appointment_date ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get technician schedule
        getTechnicianSchedule: (technicianId, date) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('appointments')
                .where({
                    assigned_technician: technicianId,
                    appointment_date: { $date: date }
                })
                .orderBy(['appointment_date ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get appointment statistics
        getStats: (dateFrom, dateTo) => {
            const queries = {
                total: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('appointments')
                    .where({
                        appointment_date: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                completed: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('appointments')
                    .where({
                        status: 'completed',
                        appointment_date: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                cancelled: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('appointments')
                    .where({
                        status: 'cancelled',
                        appointment_date: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                noShow: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('appointments')
                    .where({
                        status: 'no_show',
                        appointment_date: { $between: [dateFrom, dateTo] }
                    })
                    .build()
            };
            
            return Promise.all(Object.values(queries).map(query => this.execute(query)));
        }
    };
    
    /**
     * Work Order queries
     */
    workOrderQueries = {
        // Get work orders by status
        getByStatus: (status) => {
            const query = this.queryBuilder
                .select([
                    'wo.*',
                    'c.company_name',
                    's.name as service_name',
                    't.name as technician_name'
                ])
                .from('work_orders wo')
                .join('customers c', 'wo.customer_id = c.id')
                .join('services s', 'wo.service_id = s.id')
                .leftJoin('technicians t', 'wo.technician_id = t.id')
                .where({ 'wo.status': status })
                .orderBy(['wo.created_at DESC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get work orders by customer
        getByCustomer: (customerId) => {
            const query = this.queryBuilder
                .select([
                    'wo.*',
                    's.name as service_name',
                    't.name as technician_name'
                ])
                .from('work_orders wo')
                .join('services s', 'wo.service_id = s.id')
                .leftJoin('technicians t', 'wo.technician_id = t.id')
                .where({ 'wo.customer_id': customerId })
                .orderBy(['wo.created_at DESC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get work order statistics
        getStats: (dateFrom, dateTo) => {
            const queries = {
                total: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('work_orders')
                    .where({
                        created_at: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                completed: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('work_orders')
                    .where({
                        status: 'completed',
                        created_at: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                totalRevenue: this.queryBuilder
                    .select([this.aggregation.sum('total_cost')])
                    .from('work_orders')
                    .where({
                        status: 'completed',
                        created_at: { $between: [dateFrom, dateTo] }
                    })
                    .build(),
                
                averageRating: this.queryBuilder
                    .select([this.aggregation.avg('customer_rating')])
                    .from('work_orders')
                    .where({
                        status: 'completed',
                        customer_rating: { $not: null },
                        created_at: { $between: [dateFrom, dateTo] }
                    })
                    .build()
            };
            
            return Promise.all(Object.values(queries).map(query => this.execute(query)));
        }
    };
    
    /**
     * Inventory queries
     */
    inventoryQueries = {
        // Get low stock items
        getLowStock: () => {
            const query = this.queryBuilder
                .select(['*'])
                .from('inventory')
                .where({
                    $expr: 'quantity_in_stock <= minimum_stock_level',
                    is_active: true
                })
                .orderBy(['quantity_in_stock ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get inventory by category
        getByCategory: (category) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('inventory')
                .where({ category, is_active: true })
                .orderBy(['name ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Search inventory
        search: (searchTerm) => {
            const query = this.queryBuilder
                .select(['*'])
                .from('inventory')
                .where({
                    $or: [
                        { name: { $like: `%${searchTerm}%` } },
                        { part_number: { $like: `%${searchTerm}%` } },
                        { description: { $like: `%${searchTerm}%` } }
                    ],
                    is_active: true
                })
                .orderBy(['name ASC'])
                .build();
            
            return this.execute(query);
        }
    };
    
    /**
     * Analytics queries
     */
    analyticsQueries = {
        // Get dashboard data
        getDashboardData: () => {
            const queries = {
                totalCustomers: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('customers')
                    .build(),
                
                totalServices: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('services')
                    .where({ is_active: true })
                    .build(),
                
                totalAppointments: this.queryBuilder
                    .select([this.aggregation.count('*')])
                    .from('appointments')
                    .where({
                        appointment_date: { $gte: new Date().toISOString().split('T')[0] }
                    })
                    .build(),
                
                totalRevenue: this.queryBuilder
                    .select([this.aggregation.sum('total_cost')])
                    .from('work_orders')
                    .where({
                        status: 'completed',
                        created_at: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
                    })
                    .build()
            };
            
            return Promise.all(Object.values(queries).map(query => this.execute(query)));
        },
        
        // Get revenue trends
        getRevenueTrends: (days = 30) => {
            const query = this.queryBuilder
                .select([
                    'DATE(created_at) as date',
                    this.aggregation.sum('total_cost').as('revenue'),
                    this.aggregation.count('*').as('orders')
                ])
                .from('work_orders')
                .where({
                    status: 'completed',
                    created_at: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() }
                })
                .groupBy(['DATE(created_at)'])
                .orderBy(['date ASC'])
                .build();
            
            return this.execute(query);
        },
        
        // Get customer acquisition
        getCustomerAcquisition: (days = 30) => {
            const query = this.queryBuilder
                .select([
                    'DATE(created_at) as date',
                    this.aggregation.count('*').as('new_customers')
                ])
                .from('customers')
                .where({
                    created_at: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString() }
                })
                .groupBy(['DATE(created_at)'])
                .orderBy(['date ASC'])
                .build();
            
            return this.execute(query);
        }
    };
    
    /**
     * Performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            cacheHitRate: this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses),
            cacheSize: this.cache.size
        };
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Query cache cleared');
    }
}

/**
 * Query Builder Class
 */
class QueryBuilder {
    constructor() {
        this.query = {
            select: [],
            from: null,
            joins: [],
            where: {},
            groupBy: [],
            having: {},
            orderBy: [],
            limit: null,
            offset: null
        };
    }
    
    select(fields) {
        this.query.select = Array.isArray(fields) ? fields : [fields];
        return this;
    }
    
    from(table) {
        this.query.from = table;
        return this;
    }
    
    join(table, condition, type = 'INNER') {
        this.query.joins.push({ table, condition, type });
        return this;
    }
    
    leftJoin(table, condition) {
        return this.join(table, condition, 'LEFT');
    }
    
    rightJoin(table, condition) {
        return this.join(table, condition, 'RIGHT');
    }
    
    where(conditions) {
        this.query.where = { ...this.query.where, ...conditions };
        return this;
    }
    
    groupBy(fields) {
        this.query.groupBy = Array.isArray(fields) ? fields : [fields];
        return this;
    }
    
    having(conditions) {
        this.query.having = { ...this.query.having, ...conditions };
        return this;
    }
    
    orderBy(fields) {
        this.query.orderBy = Array.isArray(fields) ? fields : [fields];
        return this;
    }
    
    limit(count) {
        this.query.limit = count;
        return this;
    }
    
    offset(count) {
        this.query.offset = count;
        return this;
    }
    
    build() {
        return this.query;
    }
}

// Initialize query engine
const queryEngine = new QueryEngine();

// Export for external use
window.queryEngine = queryEngine;

console.log('✅ Query Engine ready!');
