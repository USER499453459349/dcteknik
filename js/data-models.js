/**
 * DC TEKNİK Data Models
 * Veritabanı veri modelleri ve yönetimi
 * 
 * Features:
 * - Customer management
 * - Service management
 * - Appointment scheduling
 * - Work order tracking
 * - Inventory management
 * - Financial transactions
 * - Analytics and reporting
 */

class DataModels {
    constructor() {
        this.models = {
            user: new UserModel(),
            customer: new CustomerModel(),
            service: new ServiceModel(),
            appointment: new AppointmentModel(),
            technician: new TechnicianModel(),
            workOrder: new WorkOrderModel(),
            inventory: new InventoryModel(),
            financialTransaction: new FinancialTransactionModel(),
            customerFeedback: new CustomerFeedbackModel(),
            systemLog: new SystemLogModel(),
            notification: new NotificationModel(),
            siteAnalytics: new SiteAnalyticsModel(),
            performanceMetrics: new PerformanceMetricsModel(),
            searchHistory: new SearchHistoryModel(),
            favorite: new FavoriteModel()
        };
        
        this.init();
    }
    
    init() {
        console.log('🗄️ Data Models initialized');
        this.setupValidation();
        this.setupRelationships();
    }
    
    setupValidation() {
        // Validation rules for each model
        this.validationRules = {
            user: {
                email: { required: true, type: 'email', maxLength: 255 },
                phone: { required: false, type: 'phone', maxLength: 20 },
                name: { required: true, type: 'string', maxLength: 100 },
                surname: { required: true, type: 'string', maxLength: 100 }
            },
            customer: {
                company_name: { required: false, type: 'string', maxLength: 200 },
                tax_number: { required: false, type: 'string', maxLength: 20 },
                contact_person: { required: false, type: 'string', maxLength: 100 },
                contact_email: { required: false, type: 'email', maxLength: 255 }
            },
            service: {
                name: { required: true, type: 'string', maxLength: 200 },
                description: { required: false, type: 'text' },
                base_price: { required: false, type: 'decimal', min: 0 },
                estimated_duration: { required: false, type: 'integer', min: 0 }
            }
        };
    }
    
    setupRelationships() {
        // Model relationships
        this.relationships = {
            user: {
                hasMany: ['customers', 'technicians', 'notifications'],
                belongsTo: []
            },
            customer: {
                hasMany: ['appointments', 'workOrders', 'financialTransactions', 'customerFeedback'],
                belongsTo: ['user']
            },
            service: {
                hasMany: ['appointments', 'workOrders'],
                belongsTo: []
            },
            appointment: {
                hasMany: ['workOrders'],
                belongsTo: ['customer', 'service', 'technician']
            },
            workOrder: {
                hasMany: ['financialTransactions', 'customerFeedback'],
                belongsTo: ['customer', 'service', 'technician', 'appointment']
            }
        };
    }
    
    /**
     * Get model by name
     */
    getModel(modelName) {
        return this.models[modelName];
    }
    
    /**
     * Validate data against model rules
     */
    validate(modelName, data) {
        const rules = this.validationRules[modelName];
        if (!rules) return { isValid: true, errors: [] };
        
        const errors = [];
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];
            
            if (rule.required && (!value || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }
            
            if (value && rule.type === 'email' && !this.isValidEmail(value)) {
                errors.push(`${field} must be a valid email`);
            }
            
            if (value && rule.type === 'phone' && !this.isValidPhone(value)) {
                errors.push(`${field} must be a valid phone number`);
            }
            
            if (value && rule.maxLength && value.length > rule.maxLength) {
                errors.push(`${field} must be less than ${rule.maxLength} characters`);
            }
            
            if (value && rule.min !== undefined && value < rule.min) {
                errors.push(`${field} must be greater than or equal to ${rule.min}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
}

/**
 * User Model
 */
class UserModel {
    constructor() {
        this.tableName = 'users';
        this.fields = [
            'id', 'email', 'phone', 'name', 'surname', 'company',
            'role', 'status', 'created_at', 'updated_at', 'last_login',
            'preferences'
        ];
    }
    
    create(data) {
        return {
            id: null,
            email: data.email,
            phone: data.phone || null,
            name: data.name,
            surname: data.surname,
            company: data.company || null,
            role: data.role || 'customer',
            status: data.status || 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: null,
            preferences: data.preferences || {}
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            email: data.email,
            phone: data.phone,
            name: data.name,
            surname: data.surname,
            company: data.company,
            role: data.role,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at,
            last_login: data.last_login,
            preferences: data.preferences
        };
    }
}

/**
 * Customer Model
 */
class CustomerModel {
    constructor() {
        this.tableName = 'customers';
        this.fields = [
            'id', 'user_id', 'company_name', 'tax_number', 'address',
            'city', 'district', 'postal_code', 'contact_person',
            'contact_phone', 'contact_email', 'customer_type',
            'priority_level', 'total_orders', 'total_spent',
            'last_service_date', 'notes', 'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id,
            company_name: data.company_name || null,
            tax_number: data.tax_number || null,
            address: data.address || null,
            city: data.city || null,
            district: data.district || null,
            postal_code: data.postal_code || null,
            contact_person: data.contact_person || null,
            contact_phone: data.contact_phone || null,
            contact_email: data.contact_email || null,
            customer_type: data.customer_type || 'individual',
            priority_level: data.priority_level || 'medium',
            total_orders: 0,
            total_spent: 0.00,
            last_service_date: null,
            notes: data.notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            company_name: data.company_name,
            tax_number: data.tax_number,
            address: data.address,
            city: data.city,
            district: data.district,
            postal_code: data.postal_code,
            contact_person: data.contact_person,
            contact_phone: data.contact_phone,
            contact_email: data.contact_email,
            customer_type: data.customer_type,
            priority_level: data.priority_level,
            total_orders: data.total_orders,
            total_spent: data.total_spent,
            last_service_date: data.last_service_date,
            notes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Service Model
 */
class ServiceModel {
    constructor() {
        this.tableName = 'services';
        this.fields = [
            'id', 'name', 'description', 'category', 'subcategory',
            'base_price', 'hourly_rate', 'estimated_duration',
            'is_active', 'features', 'requirements', 'warranty_period',
            'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            name: data.name,
            description: data.description || null,
            category: data.category || null,
            subcategory: data.subcategory || null,
            base_price: data.base_price || 0.00,
            hourly_rate: data.hourly_rate || 0.00,
            estimated_duration: data.estimated_duration || null,
            is_active: data.is_active !== undefined ? data.is_active : true,
            features: data.features || {},
            requirements: data.requirements || null,
            warranty_period: data.warranty_period || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            name: data.name,
            description: data.description,
            category: data.category,
            subcategory: data.subcategory,
            base_price: data.base_price,
            hourly_rate: data.hourly_rate,
            estimated_duration: data.estimated_duration,
            is_active: data.is_active,
            features: data.features,
            requirements: data.requirements,
            warranty_period: data.warranty_period,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Appointment Model
 */
class AppointmentModel {
    constructor() {
        this.tableName = 'appointments';
        this.fields = [
            'id', 'customer_id', 'service_id', 'appointment_date',
            'duration', 'status', 'priority', 'notes', 'assigned_technician',
            'location_type', 'address', 'estimated_cost', 'actual_cost',
            'payment_status', 'payment_method', 'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            customer_id: data.customer_id,
            service_id: data.service_id,
            appointment_date: data.appointment_date,
            duration: data.duration,
            status: data.status || 'scheduled',
            priority: data.priority || 'medium',
            notes: data.notes || null,
            assigned_technician: data.assigned_technician || null,
            location_type: data.location_type || 'office',
            address: data.address || null,
            estimated_cost: data.estimated_cost || null,
            actual_cost: data.actual_cost || null,
            payment_status: data.payment_status || 'pending',
            payment_method: data.payment_method || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            customer_id: data.customer_id,
            service_id: data.service_id,
            appointment_date: data.appointment_date,
            duration: data.duration,
            status: data.status,
            priority: data.priority,
            notes: data.notes,
            assigned_technician: data.assigned_technician,
            location_type: data.location_type,
            address: data.address,
            estimated_cost: data.estimated_cost,
            actual_cost: data.actual_cost,
            payment_status: data.payment_status,
            payment_method: data.payment_method,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Technician Model
 */
class TechnicianModel {
    constructor() {
        this.tableName = 'technicians';
        this.fields = [
            'id', 'user_id', 'employee_id', 'specialization',
            'experience_years', 'hourly_rate', 'availability_schedule',
            'current_location', 'is_available', 'rating', 'total_jobs',
            'skills', 'certifications', 'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id,
            employee_id: data.employee_id || null,
            specialization: data.specialization || [],
            experience_years: data.experience_years || 0,
            hourly_rate: data.hourly_rate || 0.00,
            availability_schedule: data.availability_schedule || {},
            current_location: data.current_location || null,
            is_available: data.is_available !== undefined ? data.is_available : true,
            rating: 0.00,
            total_jobs: 0,
            skills: data.skills || [],
            certifications: data.certifications || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            employee_id: data.employee_id,
            specialization: data.specialization,
            experience_years: data.experience_years,
            hourly_rate: data.hourly_rate,
            availability_schedule: data.availability_schedule,
            current_location: data.current_location,
            is_available: data.is_available,
            rating: data.rating,
            total_jobs: data.total_jobs,
            skills: data.skills,
            certifications: data.certifications,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Work Order Model
 */
class WorkOrderModel {
    constructor() {
        this.tableName = 'work_orders';
        this.fields = [
            'id', 'appointment_id', 'customer_id', 'technician_id',
            'service_id', 'order_number', 'status', 'priority',
            'start_time', 'end_time', 'actual_duration',
            'problem_description', 'solution_description',
            'parts_used', 'labor_cost', 'parts_cost', 'total_cost',
            'warranty_start_date', 'warranty_end_date',
            'customer_feedback', 'customer_rating', 'internal_notes',
            'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            appointment_id: data.appointment_id || null,
            customer_id: data.customer_id,
            technician_id: data.technician_id || null,
            service_id: data.service_id,
            order_number: this.generateOrderNumber(),
            status: data.status || 'pending',
            priority: data.priority || 'medium',
            start_time: data.start_time || null,
            end_time: data.end_time || null,
            actual_duration: data.actual_duration || null,
            problem_description: data.problem_description || null,
            solution_description: data.solution_description || null,
            parts_used: data.parts_used || [],
            labor_cost: data.labor_cost || 0.00,
            parts_cost: data.parts_cost || 0.00,
            total_cost: data.total_cost || 0.00,
            warranty_start_date: data.warranty_start_date || null,
            warranty_end_date: data.warranty_end_date || null,
            customer_feedback: data.customer_feedback || null,
            customer_rating: data.customer_rating || null,
            internal_notes: data.internal_notes || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    generateOrderNumber() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `WO-${timestamp}-${random}`.toUpperCase();
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            appointment_id: data.appointment_id,
            customer_id: data.customer_id,
            technician_id: data.technician_id,
            service_id: data.service_id,
            order_number: data.order_number,
            status: data.status,
            priority: data.priority,
            start_time: data.start_time,
            end_time: data.end_time,
            actual_duration: data.actual_duration,
            problem_description: data.problem_description,
            solution_description: data.solution_description,
            parts_used: data.parts_used,
            labor_cost: data.labor_cost,
            parts_cost: data.parts_cost,
            total_cost: data.total_cost,
            warranty_start_date: data.warranty_start_date,
            warranty_end_date: data.warranty_end_date,
            customer_feedback: data.customer_feedback,
            customer_rating: data.customer_rating,
            internal_notes: data.internal_notes,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Inventory Model
 */
class InventoryModel {
    constructor() {
        this.tableName = 'inventory';
        this.fields = [
            'id', 'part_number', 'name', 'description', 'category',
            'brand', 'model', 'unit_price', 'quantity_in_stock',
            'minimum_stock_level', 'maximum_stock_level', 'supplier',
            'supplier_contact', 'last_purchase_date', 'last_purchase_price',
            'location', 'condition', 'warranty_period', 'is_active',
            'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            part_number: data.part_number,
            name: data.name,
            description: data.description || null,
            category: data.category || null,
            brand: data.brand || null,
            model: data.model || null,
            unit_price: data.unit_price || 0.00,
            quantity_in_stock: data.quantity_in_stock || 0,
            minimum_stock_level: data.minimum_stock_level || 5,
            maximum_stock_level: data.maximum_stock_level || 100,
            supplier: data.supplier || null,
            supplier_contact: data.supplier_contact || null,
            last_purchase_date: data.last_purchase_date || null,
            last_purchase_price: data.last_purchase_price || null,
            location: data.location || null,
            condition: data.condition || 'new',
            warranty_period: data.warranty_period || 0,
            is_active: data.is_active !== undefined ? data.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            part_number: data.part_number,
            name: data.name,
            description: data.description,
            category: data.category,
            brand: data.brand,
            model: data.model,
            unit_price: data.unit_price,
            quantity_in_stock: data.quantity_in_stock,
            minimum_stock_level: data.minimum_stock_level,
            maximum_stock_level: data.maximum_stock_level,
            supplier: data.supplier,
            supplier_contact: data.supplier_contact,
            last_purchase_date: data.last_purchase_date,
            last_purchase_price: data.last_purchase_price,
            location: data.location,
            condition: data.condition,
            warranty_period: data.warranty_period,
            is_active: data.is_active,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Financial Transaction Model
 */
class FinancialTransactionModel {
    constructor() {
        this.tableName = 'financial_transactions';
        this.fields = [
            'id', 'work_order_id', 'customer_id', 'transaction_type',
            'amount', 'currency', 'payment_method', 'transaction_date',
            'description', 'reference_number', 'status', 'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            work_order_id: data.work_order_id || null,
            customer_id: data.customer_id,
            transaction_type: data.transaction_type,
            amount: data.amount,
            currency: data.currency || 'TRY',
            payment_method: data.payment_method,
            transaction_date: data.transaction_date || new Date().toISOString(),
            description: data.description || null,
            reference_number: data.reference_number || null,
            status: data.status || 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            work_order_id: data.work_order_id,
            customer_id: data.customer_id,
            transaction_type: data.transaction_type,
            amount: data.amount,
            currency: data.currency,
            payment_method: data.payment_method,
            transaction_date: data.transaction_date,
            description: data.description,
            reference_number: data.reference_number,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * Customer Feedback Model
 */
class CustomerFeedbackModel {
    constructor() {
        this.tableName = 'customer_feedback';
        this.fields = [
            'id', 'customer_id', 'work_order_id', 'rating',
            'feedback_text', 'feedback_type', 'is_anonymous',
            'response_text', 'responded_by', 'response_date',
            'is_public', 'created_at', 'updated_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            customer_id: data.customer_id,
            work_order_id: data.work_order_id || null,
            rating: data.rating,
            feedback_text: data.feedback_text || null,
            feedback_type: data.feedback_type,
            is_anonymous: data.is_anonymous || false,
            response_text: data.response_text || null,
            responded_by: data.responded_by || null,
            response_date: data.response_date || null,
            is_public: data.is_public || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            customer_id: data.customer_id,
            work_order_id: data.work_order_id,
            rating: data.rating,
            feedback_text: data.feedback_text,
            feedback_type: data.feedback_type,
            is_anonymous: data.is_anonymous,
            response_text: data.response_text,
            responded_by: data.responded_by,
            response_date: data.response_date,
            is_public: data.is_public,
            created_at: data.created_at,
            updated_at: data.updated_at
        };
    }
}

/**
 * System Log Model
 */
class SystemLogModel {
    constructor() {
        this.tableName = 'system_logs';
        this.fields = [
            'id', 'user_id', 'action', 'table_name', 'record_id',
            'old_values', 'new_values', 'ip_address', 'user_agent',
            'session_id', 'created_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id || null,
            action: data.action,
            table_name: data.table_name || null,
            record_id: data.record_id || null,
            old_values: data.old_values || null,
            new_values: data.new_values || null,
            ip_address: data.ip_address || null,
            user_agent: data.user_agent || null,
            session_id: data.session_id || null,
            created_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            action: data.action,
            table_name: data.table_name,
            record_id: data.record_id,
            old_values: data.old_values,
            new_values: data.new_values,
            ip_address: data.ip_address,
            user_agent: data.user_agent,
            session_id: data.session_id,
            created_at: data.created_at
        };
    }
}

/**
 * Notification Model
 */
class NotificationModel {
    constructor() {
        this.tableName = 'notifications';
        this.fields = [
            'id', 'user_id', 'title', 'message', 'type',
            'priority', 'is_read', 'read_at', 'action_url',
            'expires_at', 'created_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id,
            title: data.title,
            message: data.message,
            type: data.type || 'info',
            priority: data.priority || 'medium',
            is_read: false,
            read_at: null,
            action_url: data.action_url || null,
            expires_at: data.expires_at || null,
            created_at: new Date().toISOString()
        };
    }
    
    update(id, data) {
        return {
            ...data,
            id,
            updated_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            title: data.title,
            message: data.message,
            type: data.type,
            priority: data.priority,
            is_read: data.is_read,
            read_at: data.read_at,
            action_url: data.action_url,
            expires_at: data.expires_at,
            created_at: data.created_at
        };
    }
}

/**
 * Site Analytics Model
 */
class SiteAnalyticsModel {
    constructor() {
        this.tableName = 'site_analytics';
        this.fields = [
            'id', 'page_url', 'page_title', 'session_id', 'user_id',
            'ip_address', 'user_agent', 'referrer', 'country', 'city',
            'device_type', 'browser', 'os', 'screen_resolution',
            'time_on_page', 'bounce', 'conversion_type', 'conversion_value',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term',
            'utm_content', 'created_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            page_url: data.page_url,
            page_title: data.page_title || null,
            session_id: data.session_id || null,
            user_id: data.user_id || null,
            ip_address: data.ip_address || null,
            user_agent: data.user_agent || null,
            referrer: data.referrer || null,
            country: data.country || null,
            city: data.city || null,
            device_type: data.device_type || 'desktop',
            browser: data.browser || null,
            os: data.os || null,
            screen_resolution: data.screen_resolution || null,
            time_on_page: data.time_on_page || null,
            bounce: data.bounce || false,
            conversion_type: data.conversion_type || null,
            conversion_value: data.conversion_value || null,
            utm_source: data.utm_source || null,
            utm_medium: data.utm_medium || null,
            utm_campaign: data.utm_campaign || null,
            utm_term: data.utm_term || null,
            utm_content: data.utm_content || null,
            created_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            page_url: data.page_url,
            page_title: data.page_title,
            session_id: data.session_id,
            user_id: data.user_id,
            ip_address: data.ip_address,
            user_agent: data.user_agent,
            referrer: data.referrer,
            country: data.country,
            city: data.city,
            device_type: data.device_type,
            browser: data.browser,
            os: data.os,
            screen_resolution: data.screen_resolution,
            time_on_page: data.time_on_page,
            bounce: data.bounce,
            conversion_type: data.conversion_type,
            conversion_value: data.conversion_value,
            utm_source: data.utm_source,
            utm_medium: data.utm_medium,
            utm_campaign: data.utm_campaign,
            utm_term: data.utm_term,
            utm_content: data.utm_content,
            created_at: data.created_at
        };
    }
}

/**
 * Performance Metrics Model
 */
class PerformanceMetricsModel {
    constructor() {
        this.tableName = 'performance_metrics';
        this.fields = [
            'id', 'session_id', 'page_url', 'metric_type',
            'metric_value', 'metric_rating', 'device_type',
            'network_type', 'browser', 'os', 'timestamp'
        ];
    }
    
    create(data) {
        return {
            id: null,
            session_id: data.session_id || null,
            page_url: data.page_url,
            metric_type: data.metric_type,
            metric_value: data.metric_value,
            metric_rating: data.metric_rating,
            device_type: data.device_type || 'desktop',
            network_type: data.network_type || null,
            browser: data.browser || null,
            os: data.os || null,
            timestamp: data.timestamp || new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            session_id: data.session_id,
            page_url: data.page_url,
            metric_type: data.metric_type,
            metric_value: data.metric_value,
            metric_rating: data.metric_rating,
            device_type: data.device_type,
            network_type: data.network_type,
            browser: data.browser,
            os: data.os,
            timestamp: data.timestamp
        };
    }
}

/**
 * Search History Model
 */
class SearchHistoryModel {
    constructor() {
        this.tableName = 'search_history';
        this.fields = [
            'id', 'user_id', 'search_query', 'search_type',
            'results_count', 'clicked_result_id', 'search_filters',
            'ip_address', 'user_agent', 'created_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id || null,
            search_query: data.search_query,
            search_type: data.search_type || 'general',
            results_count: data.results_count || 0,
            clicked_result_id: data.clicked_result_id || null,
            search_filters: data.search_filters || {},
            ip_address: data.ip_address || null,
            user_agent: data.user_agent || null,
            created_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            search_query: data.search_query,
            search_type: data.search_type,
            results_count: data.results_count,
            clicked_result_id: data.clicked_result_id,
            search_filters: data.search_filters,
            ip_address: data.ip_address,
            user_agent: data.user_agent,
            created_at: data.created_at
        };
    }
}

/**
 * Favorite Model
 */
class FavoriteModel {
    constructor() {
        this.tableName = 'favorites';
        this.fields = [
            'id', 'user_id', 'item_type', 'item_id', 'created_at'
        ];
    }
    
    create(data) {
        return {
            id: null,
            user_id: data.user_id,
            item_type: data.item_type,
            item_id: data.item_id,
            created_at: new Date().toISOString()
        };
    }
    
    format(data) {
        return {
            id: data.id,
            user_id: data.user_id,
            item_type: data.item_type,
            item_id: data.item_id,
            created_at: data.created_at
        };
    }
}

// Initialize data models
const dataModels = new DataModels();

// Export for external use
window.dataModels = dataModels;

console.log('✅ Data Models ready!');
