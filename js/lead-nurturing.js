/**
 * Lead Nurturing & Scoring System
 * DC TEKNİK - Dinamocu Serdar
 * Version: 1.0.0
 */

class LeadNurturing {
    constructor() {
        this.config = {
            scoringEnabled: true,
            nurturingEnabled: true,
            followUpEnabled: true,
            segmentationEnabled: true
        };
        
        this.leadScoring = {
            // Lead scoring criteria
            criteria: {
                pageViews: { weight: 1, maxPoints: 10 },
                timeOnSite: { weight: 2, maxPoints: 20 },
                formSubmissions: { weight: 5, maxPoints: 50 },
                whatsappClicks: { weight: 3, maxPoints: 30 },
                phoneCalls: { weight: 4, maxPoints: 40 },
                blogReads: { weight: 2, maxPoints: 20 },
                servicePageViews: { weight: 3, maxPoints: 30 },
                repeatVisits: { weight: 2, maxPoints: 20 },
                downloadActions: { weight: 4, maxPoints: 40 },
                socialShares: { weight: 1, maxPoints: 10 }
            },
            
            // Lead scoring thresholds
            thresholds: {
                cold: 0,
                warm: 25,
                hot: 50,
                qualified: 75
            }
        };
        
        this.leadSegments = {
            newVisitor: {
                name: 'Yeni Ziyaretçi',
                criteria: 'first_visit',
                nurturing: 'welcome_sequence'
            },
            interestedVisitor: {
                name: 'İlgili Ziyaretçi',
                criteria: 'multiple_page_views',
                nurturing: 'education_sequence'
            },
            potentialCustomer: {
                name: 'Potansiyel Müşteri',
                criteria: 'form_submission',
                nurturing: 'conversion_sequence'
            },
            hotLead: {
                name: 'Sıcak Lead',
                criteria: 'high_engagement',
                nurturing: 'urgent_sequence'
            }
        };
        
        this.nurturingSequences = {
            welcome_sequence: [
                { delay: 0, action: 'send_welcome_email' },
                { delay: 24, action: 'send_service_info' },
                { delay: 72, action: 'send_expert_tips' },
                { delay: 168, action: 'send_special_offer' }
            ],
            
            education_sequence: [
                { delay: 0, action: 'send_blog_post' },
                { delay: 48, action: 'send_case_study' },
                { delay: 120, action: 'send_expert_advice' },
                { delay: 240, action: 'send_testimonial' }
            ],
            
            conversion_sequence: [
                { delay: 0, action: 'send_personalized_offer' },
                { delay: 12, action: 'send_urgency_message' },
                { delay: 36, action: 'send_final_offer' },
                { delay: 84, action: 'send_follow_up' }
            ],
            
            urgent_sequence: [
                { delay: 0, action: 'send_immediate_response' },
                { delay: 2, action: 'send_phone_call_reminder' },
                { delay: 24, action: 'send_exclusive_offer' }
            ]
        };
        
        this.leads = [];
        this.nurturingQueue = [];
        
        this.init();
    }
    
    init() {
        this.loadLeads();
        this.startLeadTracking();
        this.startNurturing();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Track page views
        this.trackPageView();
        
        // Track user interactions
        document.addEventListener('click', (e) => {
            this.trackUserInteraction(e.target);
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackFormSubmission(e.target);
        });
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on site
        this.trackTimeOnSite();
    }
    
    trackPageView() {
        const leadId = this.getOrCreateLeadId();
        const currentLead = this.getLead(leadId);
        
        currentLead.pageViews = (currentLead.pageViews || 0) + 1;
        currentLead.lastPageView = new Date().toISOString();
        currentLead.currentPage = window.location.pathname;
        
        // Update lead score
        this.updateLeadScore(currentLead);
        
        // Save lead
        this.saveLead(currentLead);
        
        // Check for nurturing triggers
        this.checkNurturingTriggers(currentLead);
    }
    
    trackUserInteraction(element) {
        const leadId = this.getOrCreateLeadId();
        const currentLead = this.getLead(leadId);
        
        // Track different types of interactions
        if (element.closest('[data-whatsapp]')) {
            currentLead.whatsappClicks = (currentLead.whatsappClicks || 0) + 1;
            currentLead.lastWhatsAppClick = new Date().toISOString();
        }
        
        if (element.closest('[data-phone]')) {
            currentLead.phoneCalls = (currentLead.phoneCalls || 0) + 1;
            currentLead.lastPhoneCall = new Date().toISOString();
        }
        
        if (element.closest('.blog-post')) {
            currentLead.blogReads = (currentLead.blogReads || 0) + 1;
            currentLead.lastBlogRead = new Date().toISOString();
        }
        
        if (element.closest('.service-card')) {
            currentLead.servicePageViews = (currentLead.servicePageViews || 0) + 1;
            currentLead.lastServiceView = new Date().toISOString();
        }
        
        // Update lead score
        this.updateLeadScore(currentLead);
        
        // Save lead
        this.saveLead(currentLead);
    }
    
    trackFormSubmission(form) {
        const leadId = this.getOrCreateLeadId();
        const currentLead = this.getLead(leadId);
        
        currentLead.formSubmissions = (currentLead.formSubmissions || 0) + 1;
        currentLead.lastFormSubmission = new Date().toISOString();
        
        // Extract form data
        const formData = new FormData(form);
        currentLead.formData = Object.fromEntries(formData);
        
        // Update lead score
        this.updateLeadScore(currentLead);
        
        // Save lead
        this.saveLead(currentLead);
        
        // Trigger immediate nurturing
        this.triggerNurturingSequence(currentLead, 'conversion_sequence');
    }
    
    trackScrollDepth() {
        let maxScrollDepth = 0;
        let scrollCheckInterval;
        
        scrollCheckInterval = setInterval(() => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
            
            if (scrollDepth >= 75 && !this.scrollDepthTracked) {
                this.scrollDepthTracked = true;
                const leadId = this.getOrCreateLeadId();
                const currentLead = this.getLead(leadId);
                
                currentLead.deepScroll = true;
                currentLead.maxScrollDepth = maxScrollDepth;
                
                this.updateLeadScore(currentLead);
                this.saveLead(currentLead);
            }
        }, 1000);
        
        // Clear interval after 30 seconds
        setTimeout(() => {
            clearInterval(scrollCheckInterval);
        }, 30000);
    }
    
    trackTimeOnSite() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnSite = Math.round((Date.now() - startTime) / 1000);
            
            const leadId = this.getOrCreateLeadId();
            const currentLead = this.getLead(leadId);
            
            currentLead.timeOnSite = (currentLead.timeOnSite || 0) + timeOnSite;
            currentLead.lastSessionTime = new Date().toISOString();
            
            this.updateLeadScore(currentLead);
            this.saveLead(currentLead);
        });
    }
    
    updateLeadScore(lead) {
        if (!this.config.scoringEnabled) return;
        
        let totalScore = 0;
        
        // Calculate score based on criteria
        Object.keys(this.leadScoring.criteria).forEach(criterion => {
            const value = lead[criterion] || 0;
            const config = this.leadScoring.criteria[criterion];
            
            let points = 0;
            if (criterion === 'pageViews') {
                points = Math.min(value * config.weight, config.maxPoints);
            } else if (criterion === 'timeOnSite') {
                points = Math.min(Math.floor(value / 60) * config.weight, config.maxPoints);
            } else {
                points = Math.min(value * config.weight, config.maxPoints);
            }
            
            totalScore += points;
        });
        
        lead.score = totalScore;
        lead.scoreUpdated = new Date().toISOString();
        
        // Determine lead status
        lead.status = this.getLeadStatus(totalScore);
        
        // Update segment
        lead.segment = this.getLeadSegment(lead);
    }
    
    getLeadStatus(score) {
        if (score >= this.leadScoring.thresholds.qualified) return 'qualified';
        if (score >= this.leadScoring.thresholds.hot) return 'hot';
        if (score >= this.leadScoring.thresholds.warm) return 'warm';
        return 'cold';
    }
    
    getLeadSegment(lead) {
        if (lead.score >= 75) return 'hotLead';
        if (lead.formSubmissions > 0) return 'potentialCustomer';
        if (lead.pageViews > 3) return 'interestedVisitor';
        return 'newVisitor';
    }
    
    checkNurturingTriggers(lead) {
        // Check if lead needs nurturing
        if (lead.segment && this.nurturingSequences[this.leadSegments[lead.segment].nurturing]) {
            this.triggerNurturingSequence(lead, this.leadSegments[lead.segment].nurturing);
        }
    }
    
    triggerNurturingSequence(lead, sequenceName) {
        const sequence = this.nurturingSequences[sequenceName];
        if (!sequence) return;
        
        sequence.forEach(step => {
            const executionTime = new Date(Date.now() + step.delay * 60 * 60 * 1000);
            
            this.nurturingQueue.push({
                leadId: lead.id,
                action: step.action,
                executionTime: executionTime.toISOString(),
                sequenceName: sequenceName,
                status: 'pending'
            });
        });
        
        this.saveNurturingQueue();
    }
    
    startNurturing() {
        // Process nurturing queue every 5 minutes
        setInterval(() => {
            this.processNurturingQueue();
        }, 5 * 60 * 1000);
        
        // Process immediately
        this.processNurturingQueue();
    }
    
    processNurturingQueue() {
        const now = new Date();
        const pendingActions = this.nurturingQueue.filter(
            action => new Date(action.executionTime) <= now && action.status === 'pending'
        );
        
        pendingActions.forEach(action => {
            this.executeNurturingAction(action);
            action.status = 'completed';
        });
        
        if (pendingActions.length > 0) {
            this.saveNurturingQueue();
        }
    }
    
    executeNurturingAction(action) {
        const lead = this.getLead(action.leadId);
        if (!lead) return;
        
        switch (action.action) {
            case 'send_welcome_email':
                this.sendWelcomeEmail(lead);
                break;
            case 'send_service_info':
                this.sendServiceInfo(lead);
                break;
            case 'send_expert_tips':
                this.sendExpertTips(lead);
                break;
            case 'send_special_offer':
                this.sendSpecialOffer(lead);
                break;
            case 'send_blog_post':
                this.sendBlogPost(lead);
                break;
            case 'send_case_study':
                this.sendCaseStudy(lead);
                break;
            case 'send_expert_advice':
                this.sendExpertAdvice(lead);
                break;
            case 'send_testimonial':
                this.sendTestimonial(lead);
                break;
            case 'send_personalized_offer':
                this.sendPersonalizedOffer(lead);
                break;
            case 'send_urgency_message':
                this.sendUrgencyMessage(lead);
                break;
            case 'send_final_offer':
                this.sendFinalOffer(lead);
                break;
            case 'send_follow_up':
                this.sendFollowUp(lead);
                break;
            case 'send_immediate_response':
                this.sendImmediateResponse(lead);
                break;
            case 'send_phone_call_reminder':
                this.sendPhoneCallReminder(lead);
                break;
            case 'send_exclusive_offer':
                this.sendExclusiveOffer(lead);
                break;
        }
        
        // Track nurturing action
        this.trackEvent('nurturing_action_executed', {
            action: action.action,
            leadId: action.leadId,
            sequenceName: action.sequenceName
        });
    }
    
    // Nurturing action methods
    sendWelcomeEmail(lead) {
        if (window.emailMarketing) {
            window.emailMarketing.sendEmail('welcome', lead.email, { name: lead.name });
        }
    }
    
    sendServiceInfo(lead) {
        // Send service information based on lead interests
        const services = this.getRecommendedServices(lead);
        this.sendWhatsAppMessage(lead, `Hizmetlerimiz hakkında bilgi almak ister misiniz? ${services.join(', ')}`);
    }
    
    sendExpertTips(lead) {
        // Send expert tips based on lead behavior
        const tips = this.getExpertTips(lead);
        this.sendWhatsAppMessage(lead, `Uzman tavsiyelerimiz: ${tips}`);
    }
    
    sendSpecialOffer(lead) {
        // Send special offer based on lead score
        const offer = this.getSpecialOffer(lead);
        this.sendWhatsAppMessage(lead, `Özel teklifimiz: ${offer}`);
    }
    
    sendBlogPost(lead) {
        // Send relevant blog post
        const blogPost = this.getRelevantBlogPost(lead);
        this.sendWhatsAppMessage(lead, `Blog yazımızı okuyun: ${blogPost}`);
    }
    
    sendCaseStudy(lead) {
        // Send case study
        this.sendWhatsAppMessage(lead, 'Başarı hikayelerimizi inceleyin!');
    }
    
    sendExpertAdvice(lead) {
        // Send expert advice
        this.sendWhatsAppMessage(lead, 'Uzman tavsiyelerimiz için bizi arayın!');
    }
    
    sendTestimonial(lead) {
        // Send customer testimonial
        this.sendWhatsAppMessage(lead, 'Müşteri yorumlarımızı okuyun!');
    }
    
    sendPersonalizedOffer(lead) {
        // Send personalized offer
        const offer = this.getPersonalizedOffer(lead);
        this.sendWhatsAppMessage(lead, `Size özel teklif: ${offer}`);
    }
    
    sendUrgencyMessage(lead) {
        // Send urgency message
        this.sendWhatsAppMessage(lead, 'Sınırlı süre! Hemen arayın!');
    }
    
    sendFinalOffer(lead) {
        // Send final offer
        this.sendWhatsAppMessage(lead, 'Son şans! Özel fiyat teklifimiz!');
    }
    
    sendFollowUp(lead) {
        // Send follow-up message
        this.sendWhatsAppMessage(lead, 'Nasılsınız? Hala yardıma ihtiyacınız var mı?');
    }
    
    sendImmediateResponse(lead) {
        // Send immediate response
        this.sendWhatsAppMessage(lead, 'Hemen size dönüş yapıyoruz!');
    }
    
    sendPhoneCallReminder(lead) {
        // Send phone call reminder
        this.sendWhatsAppMessage(lead, 'Bizi aramayı unutmayın! +90 535 356 24 69');
    }
    
    sendExclusiveOffer(lead) {
        // Send exclusive offer
        this.sendWhatsAppMessage(lead, 'Sadece sizin için özel indirim!');
    }
    
    sendWhatsAppMessage(lead, message) {
        // In a real implementation, this would send via WhatsApp Business API
        console.log('WhatsApp message would be sent:', {
            to: lead.phone || lead.email,
            message: message
        });
    }
    
    // Helper methods
    getRecommendedServices(lead) {
        const services = [];
        if (lead.servicePageViews > 0) services.push('Dinamo Tamiri');
        if (lead.blogReads > 0) services.push('Alternatör Servisi');
        return services.length > 0 ? services : ['Dinamo Tamiri', 'Alternatör Servisi'];
    }
    
    getExpertTips(lead) {
        return 'Dinamo bakımı için düzenli kontrol yapın!';
    }
    
    getSpecialOffer(lead) {
        return 'İlk kez gelen müşterilerimize %20 indirim!';
    }
    
    getRelevantBlogPost(lead) {
        return 'Dinamo tamiri rehberi';
    }
    
    getPersonalizedOffer(lead) {
        return 'Size özel %15 indirim!';
    }
    
    // Lead management methods
    getOrCreateLeadId() {
        let leadId = localStorage.getItem('dcteknik_lead_id');
        if (!leadId) {
            leadId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('dcteknik_lead_id', leadId);
        }
        return leadId;
    }
    
    getLead(leadId) {
        let lead = this.leads.find(l => l.id === leadId);
        if (!lead) {
            lead = {
                id: leadId,
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                score: 0,
                status: 'cold',
                segment: 'newVisitor'
            };
            this.leads.push(lead);
        }
        return lead;
    }
    
    saveLead(lead) {
        const index = this.leads.findIndex(l => l.id === lead.id);
        if (index >= 0) {
            this.leads[index] = lead;
        } else {
            this.leads.push(lead);
        }
        this.saveLeads();
    }
    
    saveLeads() {
        try {
            localStorage.setItem('dcteknik_leads', JSON.stringify(this.leads));
        } catch (error) {
            console.log('Error saving leads:', error);
        }
    }
    
    loadLeads() {
        try {
            const stored = localStorage.getItem('dcteknik_leads');
            if (stored) {
                this.leads = JSON.parse(stored);
            }
        } catch (error) {
            console.log('Error loading leads:', error);
        }
    }
    
    saveNurturingQueue() {
        try {
            localStorage.setItem('dcteknik_nurturing_queue', JSON.stringify(this.nurturingQueue));
        } catch (error) {
            console.log('Error saving nurturing queue:', error);
        }
    }
    
    loadNurturingQueue() {
        try {
            const stored = localStorage.getItem('dcteknik_nurturing_queue');
            if (stored) {
                this.nurturingQueue = JSON.parse(stored);
            }
        } catch (error) {
            console.log('Error loading nurturing queue:', error);
        }
    }
    
    trackEvent(eventName, eventData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Lead_Nurturing',
                event_label: eventData.leadId || 'unknown',
                value: eventData.value || 0
            });
        }
    }
    
    // Public methods
    getLeadStats() {
        return {
            totalLeads: this.leads.length,
            coldLeads: this.leads.filter(l => l.status === 'cold').length,
            warmLeads: this.leads.filter(l => l.status === 'warm').length,
            hotLeads: this.leads.filter(l => l.status === 'hot').length,
            qualifiedLeads: this.leads.filter(l => l.status === 'qualified').length,
            averageScore: this.leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / this.leads.length
        };
    }
    
    exportLeads() {
        return {
            leads: this.leads,
            nurturingQueue: this.nurturingQueue,
            exportDate: new Date().toISOString()
        };
    }
}

// Initialize Lead Nurturing
const leadNurturing = new LeadNurturing();

// Export for global access
window.leadNurturing = leadNurturing;
