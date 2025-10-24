-- DC TEKNİK Database Schema
-- Veritabanı yapısı ve tablo tasarımı

-- Database oluştur
CREATE DATABASE IF NOT EXISTS dcteknik_db;
USE dcteknik_db;

-- 1. Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    role ENUM('admin', 'customer', 'employee') DEFAULT 'customer',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    preferences JSON,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
);

-- 2. Müşteri bilgileri tablosu
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(200),
    tax_number VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    customer_type ENUM('individual', 'corporate') DEFAULT 'individual',
    priority_level ENUM('low', 'medium', 'high', 'vip') DEFAULT 'medium',
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    last_service_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_customer_type (customer_type),
    INDEX idx_priority (priority_level),
    INDEX idx_last_service (last_service_date)
);

-- 3. Hizmetler tablosu
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    base_price DECIMAL(10,2),
    hourly_rate DECIMAL(10,2),
    estimated_duration INT, -- dakika cinsinden
    is_active BOOLEAN DEFAULT TRUE,
    features JSON,
    requirements TEXT,
    warranty_period INT, -- ay cinsinden
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- 4. Randevular tablosu
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    service_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration INT NOT NULL, -- dakika cinsinden
    status ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    notes TEXT,
    assigned_technician INT,
    location_type ENUM('office', 'on_site', 'customer_location') DEFAULT 'office',
    address TEXT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    payment_status ENUM('pending', 'paid', 'partial', 'overdue') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'transfer', 'installment') NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);

-- 5. Teknisyenler tablosu
CREATE TABLE IF NOT EXISTS technicians (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    employee_id VARCHAR(20) UNIQUE,
    specialization JSON, -- uzmanlık alanları
    experience_years INT,
    hourly_rate DECIMAL(10,2),
    availability_schedule JSON, -- çalışma saatleri
    current_location POINT,
    is_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_jobs INT DEFAULT 0,
    skills JSON,
    certifications JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_available (is_available),
    INDEX idx_rating (rating)
);

-- 6. İş emirleri tablosu
CREATE TABLE IF NOT EXISTS work_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    customer_id INT NOT NULL,
    technician_id INT,
    service_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    actual_duration INT, -- dakika cinsinden
    problem_description TEXT,
    solution_description TEXT,
    parts_used JSON, -- kullanılan parçalar
    labor_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    warranty_start_date DATE,
    warranty_end_date DATE,
    customer_feedback TEXT,
    customer_rating INT CHECK (customer_rating >= 1 AND customer_rating <= 5),
    internal_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_start_time (start_time)
);

-- 7. Envanter tablosu
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    unit_price DECIMAL(10,2),
    quantity_in_stock INT DEFAULT 0,
    minimum_stock_level INT DEFAULT 5,
    maximum_stock_level INT DEFAULT 100,
    supplier VARCHAR(200),
    supplier_contact VARCHAR(255),
    last_purchase_date DATE,
    last_purchase_price DECIMAL(10,2),
    location VARCHAR(100),
    condition ENUM('new', 'used', 'refurbished') DEFAULT 'new',
    warranty_period INT, -- ay cinsinden
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_part_number (part_number),
    INDEX idx_category (category),
    INDEX idx_stock_level (quantity_in_stock),
    INDEX idx_active (is_active)
);

-- 8. Finansal işlemler tablosu
CREATE TABLE IF NOT EXISTS financial_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    work_order_id INT,
    customer_id INT NOT NULL,
    transaction_type ENUM('income', 'expense', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    payment_method ENUM('cash', 'card', 'transfer', 'installment') NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    reference_number VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_type (transaction_type),
    INDEX idx_status (status)
);

-- 9. Müşteri geri bildirimleri tablosu
CREATE TABLE IF NOT EXISTS customer_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    work_order_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    feedback_type ENUM('service', 'technician', 'pricing', 'communication', 'timing') NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    response_text TEXT,
    responded_by INT,
    response_date TIMESTAMP NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL,
    FOREIGN KEY (responded_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_rating (rating),
    INDEX idx_feedback_type (feedback_type),
    INDEX idx_created_at (created_at)
);

-- 10. Sistem logları tablosu
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_table_name (table_name),
    INDEX idx_created_at (created_at)
);

-- 11. Bildirimler tablosu
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    action_url VARCHAR(500),
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_priority (priority)
);

-- 12. Site analitikleri tablosu
CREATE TABLE IF NOT EXISTS site_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(200),
    session_id VARCHAR(100),
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(20),
    time_on_page INT, -- saniye cinsinden
    bounce BOOLEAN DEFAULT FALSE,
    conversion_type VARCHAR(100),
    conversion_value DECIMAL(10,2),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_page_url (page_url),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at),
    INDEX idx_device_type (device_type),
    INDEX idx_conversion_type (conversion_type)
);

-- 13. Performans metrikleri tablosu
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100),
    page_url VARCHAR(500),
    metric_type ENUM('lcp', 'fid', 'cls', 'fcp', 'ttfb', 'inp') NOT NULL,
    metric_value DECIMAL(10,3) NOT NULL,
    metric_rating ENUM('good', 'needs-improvement', 'poor') NOT NULL,
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    network_type VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_type (metric_type),
    INDEX idx_metric_rating (metric_rating),
    INDEX idx_timestamp (timestamp),
    INDEX idx_session_id (session_id)
);

-- 14. Arama geçmişi tablosu
CREATE TABLE IF NOT EXISTS search_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    search_query VARCHAR(500) NOT NULL,
    search_type ENUM('service', 'part', 'technician', 'general') DEFAULT 'general',
    results_count INT DEFAULT 0,
    clicked_result_id INT,
    search_filters JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_search_query (search_query),
    INDEX idx_search_type (search_type),
    INDEX idx_created_at (created_at)
);

-- 15. Favoriler tablosu
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_type ENUM('service', 'technician', 'part') NOT NULL,
    item_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, item_type, item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_item_type (item_type)
);

-- Views oluştur
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.user_id,
    u.name,
    u.surname,
    u.email,
    u.phone,
    c.company_name,
    c.customer_type,
    c.priority_level,
    c.total_orders,
    c.total_spent,
    c.last_service_date,
    COUNT(a.id) as total_appointments,
    COUNT(wo.id) as total_work_orders
FROM customers c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN appointments a ON c.id = a.customer_id
LEFT JOIN work_orders wo ON c.id = wo.customer_id
GROUP BY c.id;

CREATE VIEW technician_performance AS
SELECT 
    t.id,
    t.user_id,
    u.name,
    u.surname,
    t.employee_id,
    t.rating,
    t.total_jobs,
    COUNT(wo.id) as completed_jobs,
    AVG(wo.customer_rating) as avg_customer_rating,
    SUM(wo.total_cost) as total_revenue
FROM technicians t
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN work_orders wo ON t.id = wo.technician_id AND wo.status = 'completed'
GROUP BY t.id;

CREATE VIEW service_analytics AS
SELECT 
    s.id,
    s.name,
    s.category,
    s.base_price,
    COUNT(wo.id) as total_orders,
    AVG(wo.total_cost) as avg_order_value,
    AVG(wo.actual_duration) as avg_duration,
    AVG(wo.customer_rating) as avg_rating
FROM services s
LEFT JOIN work_orders wo ON s.id = wo.service_id AND wo.status = 'completed'
GROUP BY s.id;

-- Stored Procedures
DELIMITER //

CREATE PROCEDURE GetCustomerStats(IN customer_id INT)
BEGIN
    SELECT 
        c.id,
        c.company_name,
        c.total_orders,
        c.total_spent,
        c.last_service_date,
        COUNT(a.id) as total_appointments,
        COUNT(wo.id) as total_work_orders,
        AVG(wo.customer_rating) as avg_rating
    FROM customers c
    LEFT JOIN appointments a ON c.id = a.customer_id
    LEFT JOIN work_orders wo ON c.id = wo.customer_id
    WHERE c.id = customer_id
    GROUP BY c.id;
END //

CREATE PROCEDURE GetTechnicianWorkload(IN technician_id INT, IN date_from DATE, IN date_to DATE)
BEGIN
    SELECT 
        wo.id,
        wo.order_number,
        wo.status,
        wo.start_time,
        wo.end_time,
        wo.actual_duration,
        wo.total_cost,
        c.company_name,
        s.name as service_name
    FROM work_orders wo
    JOIN customers c ON wo.customer_id = c.id
    JOIN services s ON wo.service_id = s.id
    WHERE wo.technician_id = technician_id
    AND DATE(wo.start_time) BETWEEN date_from AND date_to
    ORDER BY wo.start_time;
END //

CREATE PROCEDURE GetInventoryAlerts()
BEGIN
    SELECT 
        id,
        part_number,
        name,
        quantity_in_stock,
        minimum_stock_level
    FROM inventory
    WHERE quantity_in_stock <= minimum_stock_level
    AND is_active = TRUE
    ORDER BY (quantity_in_stock - minimum_stock_level);
END //

DELIMITER ;

-- Triggers
DELIMITER //

CREATE TRIGGER update_customer_stats_after_work_order
AFTER INSERT ON work_orders
FOR EACH ROW
BEGIN
    UPDATE customers 
    SET 
        total_orders = total_orders + 1,
        total_spent = total_spent + NEW.total_cost,
        last_service_date = CURDATE()
    WHERE id = NEW.customer_id;
END //

CREATE TRIGGER update_technician_stats_after_work_order
AFTER UPDATE ON work_orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE technicians 
        SET 
            total_jobs = total_jobs + 1,
            rating = (
                SELECT AVG(customer_rating) 
                FROM work_orders 
                WHERE technician_id = NEW.technician_id 
                AND status = 'completed' 
                AND customer_rating IS NOT NULL
            )
        WHERE id = NEW.technician_id;
    END IF;
END //

DELIMITER ;

-- İndeksler
CREATE INDEX idx_appointments_customer_date ON appointments(customer_id, appointment_date);
CREATE INDEX idx_work_orders_status_date ON work_orders(status, start_time);
CREATE INDEX idx_financial_transactions_date_amount ON financial_transactions(transaction_date, amount);
CREATE INDEX idx_site_analytics_url_date ON site_analytics(page_url, created_at);

-- Başlangıç verileri
INSERT INTO services (name, description, category, base_price, estimated_duration, warranty_period) VALUES
('Dinamo Tamiri', 'Otomotiv dinamo tamiri ve bakımı', 'Elektrik', 150.00, 120, 6),
('Alternatör Tamiri', 'Alternatör arıza teşhisi ve tamiri', 'Elektrik', 200.00, 90, 6),
('Marş Motoru Tamiri', 'Marş motoru arıza teşhisi ve tamiri', 'Elektrik', 180.00, 60, 6),
('Klima Kompresör Tamiri', 'Klima kompresör arıza teşhisi ve tamiri', 'Klima', 300.00, 180, 12),
('Elektrik Arıza Teşhisi', 'Genel elektrik arıza teşhisi', 'Elektrik', 100.00, 30, 0);

INSERT INTO users (email, phone, name, surname, role, status) VALUES
('admin@dcteknik.com', '+90 555 123 4567', 'Admin', 'User', 'admin', 'active'),
('teknisyen1@dcteknik.com', '+90 555 234 5678', 'Ahmet', 'Yılmaz', 'employee', 'active'),
('teknisyen2@dcteknik.com', '+90 555 345 6789', 'Mehmet', 'Kaya', 'employee', 'active');

-- Veritabanı optimizasyonu
OPTIMIZE TABLE users, customers, services, appointments, technicians, work_orders, inventory, financial_transactions, customer_feedback, system_logs, notifications, site_analytics, performance_metrics, search_history, favorites;

-- Analiz ve istatistikler
ANALYZE TABLE users, customers, services, appointments, technicians, work_orders, inventory, financial_transactions, customer_feedback, system_logs, notifications, site_analytics, performance_metrics, search_history, favorites;
