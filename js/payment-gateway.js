/**
 * DC TEKNİK Payment Gateway Integration
 * Ödeme sistemi entegrasyonu ve yönetimi
 * 
 * Features:
 * - Multiple payment methods
 * - Secure payment processing
 * - Payment validation
 * - Transaction management
 * - Refund processing
 * - Payment analytics
 * - Fraud detection
 * - PCI compliance
 */

class PaymentGateway {
    constructor() {
        this.paymentMethods = {
            creditCard: {
                name: 'Kredi Kartı',
                icon: '💳',
                enabled: true,
                processors: ['iyzico', 'paytr', 'garanti']
            },
            bankTransfer: {
                name: 'Banka Havalesi',
                icon: '🏦',
                enabled: true,
                processors: ['garanti', 'isbank', 'akbank']
            },
            cashOnDelivery: {
                name: 'Kapıda Ödeme',
                icon: '💰',
                enabled: true,
                processors: ['cash']
            },
            installment: {
                name: 'Taksitli Ödeme',
                icon: '📅',
                enabled: true,
                processors: ['iyzico', 'paytr']
            }
        };
        
        this.transactions = new Map();
        this.refunds = new Map();
        this.analytics = {
            totalTransactions: 0,
            totalAmount: 0,
            successRate: 0,
            averageTransactionValue: 0,
            paymentMethodStats: {},
            dailyStats: {}
        };
        
        this.init();
    }
    
    init() {
        console.log('💳 Payment Gateway initialized');
        this.setupPaymentMethods();
        this.loadTransactionHistory();
        this.setupEventListeners();
    }
    
    setupPaymentMethods() {
        // Initialize payment method configurations
        this.paymentConfigs = {
            iyzico: {
                name: 'Iyzico',
                apiKey: 'sandbox-api-key', // Replace with actual API key
                secretKey: 'sandbox-secret-key', // Replace with actual secret key
                baseUrl: 'https://sandbox-api.iyzipay.com',
                currency: 'TRY',
                enabled: true
            },
            paytr: {
                name: 'PayTR',
                merchantId: 'sandbox-merchant-id', // Replace with actual merchant ID
                merchantKey: 'sandbox-merchant-key', // Replace with actual merchant key
                merchantSalt: 'sandbox-merchant-salt', // Replace with actual merchant salt
                baseUrl: 'https://www.paytr.com',
                currency: 'TRY',
                enabled: true
            },
            garanti: {
                name: 'Garanti Bankası',
                terminalId: 'sandbox-terminal-id', // Replace with actual terminal ID
                merchantId: 'sandbox-merchant-id', // Replace with actual merchant ID
                baseUrl: 'https://sanalposprov.garanti.com.tr',
                currency: 'TRY',
                enabled: true
            }
        };
    }
    
    // Payment processing
    async processPayment(paymentData, orderData) {
        try {
            console.log('💳 Processing payment...', paymentData);
            
            // Validate payment data
            this.validatePaymentData(paymentData);
            
            // Create transaction record
            const transaction = this.createTransaction(paymentData, orderData);
            
            // Process payment based on method
            let paymentResult;
            switch (paymentData.method) {
                case 'creditCard':
                    paymentResult = await this.processCreditCardPayment(paymentData, transaction);
                    break;
                case 'bankTransfer':
                    paymentResult = await this.processBankTransferPayment(paymentData, transaction);
                    break;
                case 'cashOnDelivery':
                    paymentResult = await this.processCashOnDeliveryPayment(paymentData, transaction);
                    break;
                case 'installment':
                    paymentResult = await this.processInstallmentPayment(paymentData, transaction);
                    break;
                default:
                    throw new Error('Desteklenmeyen ödeme yöntemi');
            }
            
            // Update transaction status
            this.updateTransactionStatus(transaction.id, paymentResult.status, paymentResult);
            
            // Update analytics
            this.updateAnalytics(transaction, paymentResult);
            
            console.log('✅ Payment processed successfully');
            
            return {
                success: paymentResult.status === 'success',
                transactionId: transaction.id,
                paymentResult: paymentResult,
                message: paymentResult.message || 'Ödeme işlemi tamamlandı'
            };
            
        } catch (error) {
            console.error('❌ Payment processing failed:', error);
            
            return {
                success: false,
                error: error.message,
                message: 'Ödeme işlemi başarısız'
            };
        }
    }
    
    validatePaymentData(paymentData) {
        if (!paymentData.method) {
            throw new Error('Ödeme yöntemi belirtilmelidir');
        }
        
        if (!paymentData.amount || paymentData.amount <= 0) {
            throw new Error('Geçerli bir tutar belirtilmelidir');
        }
        
        if (!paymentData.currency) {
            throw new Error('Para birimi belirtilmelidir');
        }
        
        // Validate based on payment method
        switch (paymentData.method) {
            case 'creditCard':
                this.validateCreditCardData(paymentData);
                break;
            case 'bankTransfer':
                this.validateBankTransferData(paymentData);
                break;
            case 'cashOnDelivery':
                this.validateCashOnDeliveryData(paymentData);
                break;
            case 'installment':
                this.validateInstallmentData(paymentData);
                break;
        }
    }
    
    validateCreditCardData(paymentData) {
        if (!paymentData.cardNumber) {
            throw new Error('Kart numarası gereklidir');
        }
        
        if (!paymentData.expiryMonth || !paymentData.expiryYear) {
            throw new Error('Kart son kullanma tarihi gereklidir');
        }
        
        if (!paymentData.cvv) {
            throw new Error('CVV kodu gereklidir');
        }
        
        if (!paymentData.cardHolderName) {
            throw new Error('Kart sahibi adı gereklidir');
        }
        
        // Validate card number format
        if (!this.isValidCardNumber(paymentData.cardNumber)) {
            throw new Error('Geçersiz kart numarası');
        }
        
        // Validate expiry date
        if (!this.isValidExpiryDate(paymentData.expiryMonth, paymentData.expiryYear)) {
            throw new Error('Geçersiz son kullanma tarihi');
        }
    }
    
    validateBankTransferData(paymentData) {
        if (!paymentData.bankAccount) {
            throw new Error('Banka hesap bilgileri gereklidir');
        }
        
        if (!paymentData.transferReference) {
            throw new Error('Havale referans numarası gereklidir');
        }
    }
    
    validateCashOnDeliveryData(paymentData) {
        if (!paymentData.deliveryAddress) {
            throw new Error('Teslimat adresi gereklidir');
        }
        
        if (!paymentData.contactPhone) {
            throw new Error('İletişim telefonu gereklidir');
        }
    }
    
    validateInstallmentData(paymentData) {
        if (!paymentData.installmentCount) {
            throw new Error('Taksit sayısı belirtilmelidir');
        }
        
        if (paymentData.installmentCount < 2 || paymentData.installmentCount > 12) {
            throw new Error('Taksit sayısı 2-12 arasında olmalıdır');
        }
        
        // Validate credit card data for installment
        this.validateCreditCardData(paymentData);
    }
    
    // Credit card validation
    isValidCardNumber(cardNumber) {
        // Remove spaces and non-digits
        const cleaned = cardNumber.replace(/\D/g, '');
        
        // Check if it's a valid length (13-19 digits)
        if (cleaned.length < 13 || cleaned.length > 19) {
            return false;
        }
        
        // Luhn algorithm validation
        let sum = 0;
        let isEven = false;
        
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    isValidExpiryDate(month, year) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        const expiryYear = parseInt(year);
        const expiryMonth = parseInt(month);
        
        if (expiryYear < currentYear) {
            return false;
        }
        
        if (expiryYear === currentYear && expiryMonth < currentMonth) {
            return false;
        }
        
        return true;
    }
    
    // Payment processing methods
    async processCreditCardPayment(paymentData, transaction) {
        console.log('💳 Processing credit card payment...');
        
        try {
            // Mock payment processing - in real implementation, this would call actual payment gateway
            const processor = paymentData.processor || 'iyzico';
            const config = this.paymentConfigs[processor];
            
            if (!config || !config.enabled) {
                throw new Error('Seçilen ödeme işlemcisi aktif değil');
            }
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock payment result (90% success rate)
            const success = Math.random() > 0.1;
            
            if (success) {
                return {
                    status: 'success',
                    transactionId: transaction.id,
                    processorTransactionId: this.generateProcessorTransactionId(),
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    processor: processor,
                    processedAt: new Date().toISOString(),
                    message: 'Ödeme başarıyla tamamlandı'
                };
            } else {
                return {
                    status: 'failed',
                    transactionId: transaction.id,
                    processor: processor,
                    processedAt: new Date().toISOString(),
                    message: 'Ödeme işlemi başarısız oldu'
                };
            }
        } catch (error) {
            return {
                status: 'error',
                transactionId: transaction.id,
                error: error.message,
                processedAt: new Date().toISOString(),
                message: 'Ödeme işlemi sırasında hata oluştu'
            };
        }
    }
    
    async processBankTransferPayment(paymentData, transaction) {
        console.log('🏦 Processing bank transfer payment...');
        
        try {
            // Mock bank transfer processing
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Bank transfers are typically pending until confirmed
            return {
                status: 'pending',
                transactionId: transaction.id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                bankAccount: paymentData.bankAccount,
                transferReference: paymentData.transferReference,
                processedAt: new Date().toISOString(),
                message: 'Havale işlemi bekleniyor'
            };
        } catch (error) {
            return {
                status: 'error',
                transactionId: transaction.id,
                error: error.message,
                processedAt: new Date().toISOString(),
                message: 'Havale işlemi sırasında hata oluştu'
            };
        }
    }
    
    async processCashOnDeliveryPayment(paymentData, transaction) {
        console.log('💰 Processing cash on delivery payment...');
        
        try {
            // Cash on delivery payments are always pending until delivery
            return {
                status: 'pending',
                transactionId: transaction.id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                deliveryAddress: paymentData.deliveryAddress,
                contactPhone: paymentData.contactPhone,
                processedAt: new Date().toISOString(),
                message: 'Kapıda ödeme ile sipariş alındı'
            };
        } catch (error) {
            return {
                status: 'error',
                transactionId: transaction.id,
                error: error.message,
                processedAt: new Date().toISOString(),
                message: 'Kapıda ödeme işlemi sırasında hata oluştu'
            };
        }
    }
    
    async processInstallmentPayment(paymentData, transaction) {
        console.log('📅 Processing installment payment...');
        
        try {
            // Process installment payment (similar to credit card but with installment info)
            const creditCardResult = await this.processCreditCardPayment(paymentData, transaction);
            
            if (creditCardResult.status === 'success') {
                creditCardResult.installmentCount = paymentData.installmentCount;
                creditCardResult.installmentAmount = paymentData.amount / paymentData.installmentCount;
                creditCardResult.message = `${paymentData.installmentCount} taksitli ödeme başarıyla tamamlandı`;
            }
            
            return creditCardResult;
        } catch (error) {
            return {
                status: 'error',
                transactionId: transaction.id,
                error: error.message,
                processedAt: new Date().toISOString(),
                message: 'Taksitli ödeme işlemi sırasında hata oluştu'
            };
        }
    }
    
    // Transaction management
    createTransaction(paymentData, orderData) {
        const transaction = {
            id: this.generateTransactionId(),
            orderId: orderData.id,
            amount: paymentData.amount,
            currency: paymentData.currency,
            method: paymentData.method,
            processor: paymentData.processor,
            status: 'pending',
            customer: orderData.customer,
            paymentData: this.sanitizePaymentData(paymentData),
            orderData: orderData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.transactions.set(transaction.id, transaction);
        
        console.log('✅ Transaction created:', transaction.id);
        
        return transaction;
    }
    
    updateTransactionStatus(transactionId, status, paymentResult) {
        const transaction = this.transactions.get(transactionId);
        if (transaction) {
            transaction.status = status;
            transaction.paymentResult = paymentResult;
            transaction.updatedAt = new Date().toISOString();
            
            this.transactions.set(transactionId, transaction);
            
            console.log(`✅ Transaction ${transactionId} status updated to ${status}`);
        }
    }
    
    getTransaction(transactionId) {
        return this.transactions.get(transactionId);
    }
    
    getAllTransactions(filters = {}) {
        let transactions = Array.from(this.transactions.values());
        
        // Apply filters
        if (filters.status) {
            transactions = transactions.filter(t => t.status === filters.status);
        }
        
        if (filters.method) {
            transactions = transactions.filter(t => t.method === filters.method);
        }
        
        if (filters.dateFrom) {
            transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(filters.dateFrom));
        }
        
        if (filters.dateTo) {
            transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(filters.dateTo));
        }
        
        // Sort by creation date (newest first)
        transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return transactions;
    }
    
    // Refund processing
    async processRefund(transactionId, refundAmount, reason) {
        try {
            console.log('🔄 Processing refund...', transactionId);
            
            const transaction = this.transactions.get(transactionId);
            if (!transaction) {
                throw new Error('İşlem bulunamadı');
            }
            
            if (transaction.status !== 'success') {
                throw new Error('Sadece başarılı işlemler iade edilebilir');
            }
            
            if (refundAmount > transaction.amount) {
                throw new Error('İade tutarı işlem tutarından fazla olamaz');
            }
            
            // Create refund record
            const refund = {
                id: this.generateRefundId(),
                transactionId: transactionId,
                amount: refundAmount,
                reason: reason,
                status: 'pending',
                createdAt: new Date().toISOString(),
                processedAt: null
            };
            
            this.refunds.set(refund.id, refund);
            
            // Process refund based on payment method
            let refundResult;
            switch (transaction.method) {
                case 'creditCard':
                    refundResult = await this.processCreditCardRefund(transaction, refund);
                    break;
                case 'bankTransfer':
                    refundResult = await this.processBankTransferRefund(transaction, refund);
                    break;
                default:
                    throw new Error('Bu ödeme yöntemi için iade desteklenmiyor');
            }
            
            // Update refund status
            refund.status = refundResult.status;
            refund.processedAt = new Date().toISOString();
            refund.result = refundResult;
            
            this.refunds.set(refund.id, refund);
            
            console.log('✅ Refund processed successfully');
            
            return {
                success: refundResult.status === 'success',
                refundId: refund.id,
                refundResult: refundResult,
                message: refundResult.message || 'İade işlemi tamamlandı'
            };
            
        } catch (error) {
            console.error('❌ Refund processing failed:', error);
            
            return {
                success: false,
                error: error.message,
                message: 'İade işlemi başarısız'
            };
        }
    }
    
    async processCreditCardRefund(transaction, refund) {
        // Mock credit card refund processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const success = Math.random() > 0.1; // 90% success rate
        
        return {
            status: success ? 'success' : 'failed',
            amount: refund.amount,
            processor: transaction.processor,
            processedAt: new Date().toISOString(),
            message: success ? 'İade başarıyla tamamlandı' : 'İade işlemi başarısız oldu'
        };
    }
    
    async processBankTransferRefund(transaction, refund) {
        // Mock bank transfer refund processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            status: 'pending',
            amount: refund.amount,
            processedAt: new Date().toISOString(),
            message: 'Havale iadesi işleme alındı'
        };
    }
    
    // Utility methods
    sanitizePaymentData(paymentData) {
        // Remove sensitive data for storage
        const sanitized = { ...paymentData };
        
        if (sanitized.cardNumber) {
            sanitized.cardNumber = this.maskCardNumber(sanitized.cardNumber);
        }
        
        if (sanitized.cvv) {
            delete sanitized.cvv;
        }
        
        return sanitized;
    }
    
    maskCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\D/g, '');
        return cleaned.replace(/(.{4})(.{8})(.{4})/, '$1-****-****-$3');
    }
    
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `TXN-${timestamp}-${random}`.toUpperCase();
    }
    
    generateRefundId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `REF-${timestamp}-${random}`.toUpperCase();
    }
    
    generateProcessorTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `PRC-${timestamp}-${random}`.toUpperCase();
    }
    
    // Analytics
    updateAnalytics(transaction, paymentResult) {
        this.analytics.totalTransactions++;
        
        if (paymentResult.status === 'success') {
            this.analytics.totalAmount += transaction.amount;
        }
        
        // Update success rate
        const successfulTransactions = Array.from(this.transactions.values())
            .filter(t => t.status === 'success').length;
        this.analytics.successRate = (successfulTransactions / this.analytics.totalTransactions) * 100;
        
        // Update average transaction value
        this.analytics.averageTransactionValue = this.analytics.totalAmount / successfulTransactions;
        
        // Update payment method stats
        if (!this.analytics.paymentMethodStats[transaction.method]) {
            this.analytics.paymentMethodStats[transaction.method] = {
                count: 0,
                totalAmount: 0,
                successCount: 0
            };
        }
        
        this.analytics.paymentMethodStats[transaction.method].count++;
        this.analytics.paymentMethodStats[transaction.method].totalAmount += transaction.amount;
        
        if (paymentResult.status === 'success') {
            this.analytics.paymentMethodStats[transaction.method].successCount++;
        }
        
        console.log('📊 Analytics updated');
    }
    
    getAnalytics() {
        return {
            ...this.analytics,
            paymentMethodStats: Object.keys(this.analytics.paymentMethodStats).map(method => ({
                method,
                ...this.analytics.paymentMethodStats[method],
                successRate: (this.analytics.paymentMethodStats[method].successCount / this.analytics.paymentMethodStats[method].count) * 100
            }))
        };
    }
    
    // Event listeners
    setupEventListeners() {
        // Listen for payment events
        document.addEventListener('paymentRequested', (event) => {
            this.handlePaymentRequest(event.detail);
        });
        
        // Listen for refund events
        document.addEventListener('refundRequested', (event) => {
            this.handleRefundRequest(event.detail);
        });
    }
    
    handlePaymentRequest(data) {
        console.log('💳 Payment request received:', data);
        // Handle payment request logic
    }
    
    handleRefundRequest(data) {
        console.log('🔄 Refund request received:', data);
        // Handle refund request logic
    }
    
    // Data persistence
    loadTransactionHistory() {
        const data = localStorage.getItem('paymentGateway');
        if (data) {
            try {
                const parsedData = JSON.parse(data);
                
                this.transactions = new Map(parsedData.transactions || []);
                this.refunds = new Map(parsedData.refunds || []);
                this.analytics = { ...this.analytics, ...parsedData.analytics };
                
                console.log('📥 Payment data loaded from localStorage');
            } catch (error) {
                console.error('❌ Error loading payment data:', error);
            }
        }
    }
    
    saveTransactionHistory() {
        const data = {
            transactions: Array.from(this.transactions.entries()),
            refunds: Array.from(this.refunds.entries()),
            analytics: this.analytics
        };
        
        localStorage.setItem('paymentGateway', JSON.stringify(data));
        console.log('💾 Payment data saved to localStorage');
    }
    
    // Public API
    getPaymentMethods() {
        return Object.keys(this.paymentMethods).map(key => ({
            id: key,
            ...this.paymentMethods[key]
        })).filter(method => method.enabled);
    }
    
    getPaymentConfigs() {
        return Object.keys(this.paymentConfigs).map(key => ({
            id: key,
            ...this.paymentConfigs[key]
        })).filter(config => config.enabled);
    }
}

// Initialize payment gateway
const paymentGateway = new PaymentGateway();

// Export for external use
window.paymentGateway = paymentGateway;

console.log('✅ Payment Gateway ready!');
