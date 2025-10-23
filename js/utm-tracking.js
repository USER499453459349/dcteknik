// UTM Tracking Helper for DC TEKNİK
(function() {
    'use strict';
    
    // UTM Campaign Templates
    const UTM_CAMPAIGNS = {
        social_media: {
            facebook: {
                source: 'facebook',
                medium: 'social',
                campaign_template: 'facebook_promo_{date}',
                content_template: 'post_{post_id}',
                term_template: 'dinamo_tamiri'
            },
            instagram: {
                source: 'instagram',
                medium: 'social',
                campaign_template: 'instagram_story_{date}',
                content_template: 'story_{story_id}',
                term_template: 'alternator_service'
            },
            whatsapp: {
                source: 'whatsapp',
                medium: 'social',
                campaign_template: 'whatsapp_share_{date}',
                content_template: 'contact_share',
                term_template: 'dinamocu_servisi'
            }
        },
        search_ads: {
            google_ads: {
                source: 'google',
                medium: 'cpc',
                campaign_template: 'dinamo_tamiri_{location}',
                content_template: 'ad_group_{ad_group_id}',
                term_template: '{keyword}'
            },
            bing_ads: {
                source: 'bing',
                medium: 'cpc',
                campaign_template: 'bing_dinamo_{date}',
                content_template: 'ad_group_{ad_group_id}',
                term_template: '{keyword}'
            }
        },
        local_seo: {
            google_my_business: {
                source: 'google_my_business',
                medium: 'local',
                campaign_template: 'gmb_listing',
                content_template: 'profile_view',
                term_template: 'sultanbeyli_dinamocu'
            },
            yandex_maps: {
                source: 'yandex_maps',
                medium: 'local',
                campaign_template: 'yandex_maps_{date}',
                content_template: 'map_listing',
                term_template: 'dinamo_tamiri_sultanbeyli'
            }
        },
        email_marketing: {
            newsletter: {
                source: 'newsletter',
                medium: 'email',
                campaign_template: 'newsletter_{date}',
                content_template: 'email_{email_id}',
                term_template: 'dinamo_tips'
            },
            promotion: {
                source: 'email',
                medium: 'email',
                campaign_template: 'promo_{date}',
                content_template: 'promotional_email',
                term_template: 'discount_offer'
            }
        }
    };
    
    // Generate UTM parameters
    function generateUTM(campaignType, campaignName, customParams = {}) {
        const campaign = UTM_CAMPAIGNS[campaignType] && UTM_CAMPAIGNS[campaignType][campaignName];
        if (!campaign) {
            console.warn('Unknown campaign:', campaignType, campaignName);
            return {};
        }
        
        const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
        
        const utmParams = {
            utm_source: campaign.source,
            utm_medium: campaign.medium,
            utm_campaign: campaign.campaign_template.replace('{date}', today),
            utm_content: campaign.content_template,
            utm_term: campaign.term_template
        };
        
        // Replace custom parameters
        Object.keys(customParams).forEach(key => {
            const placeholder = `{${key}}`;
            Object.keys(utmParams).forEach(utmKey => {
                utmParams[utmKey] = utmParams[utmKey].replace(placeholder, customParams[key]);
            });
        });
        
        return utmParams;
    }
    
    // Build UTM URL
    function buildUTMURL(baseURL, utmParams) {
        const url = new URL(baseURL);
        Object.keys(utmParams).forEach(key => {
            url.searchParams.set(key, utmParams[key]);
        });
        return url.toString();
    }
    
    // Store UTM parameters in session storage
    function storeUTMParams(utmParams) {
        try {
            sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
            console.log('📊 UTM parameters stored:', utmParams);
        } catch (e) {
            console.warn('Failed to store UTM parameters:', e);
        }
    }
    
    // Extract UTM parameters from URL
    function extractUTMFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
            if (urlParams.has(param)) {
                utmParams[param] = urlParams.get(param);
            }
        });
        
        if (Object.keys(utmParams).length > 0) {
            storeUTMParams(utmParams);
            return utmParams;
        }
        
        return null;
    }
    
    // Generate sharing URLs with UTM parameters
    function generateSharingURLs(pageURL, campaignType, campaignName, customParams = {}) {
        const utmParams = generateUTM(campaignType, campaignName, customParams);
        
        const sharingURLs = {
            facebook: buildUTMURL(pageURL, {
                ...utmParams,
                utm_content: 'facebook_share'
            }),
            twitter: buildUTMURL(pageURL, {
                ...utmParams,
                utm_source: 'twitter',
                utm_content: 'twitter_share'
            }),
            whatsapp: buildUTMURL(pageURL, {
                ...utmParams,
                utm_source: 'whatsapp',
                utm_medium: 'social',
                utm_content: 'whatsapp_share'
            }),
            linkedin: buildUTMURL(pageURL, {
                ...utmParams,
                utm_source: 'linkedin',
                utm_content: 'linkedin_share'
            }),
            email: buildUTMURL(pageURL, {
                ...utmParams,
                utm_medium: 'email',
                utm_content: 'email_share'
            })
        };
        
        return sharingURLs;
    }
    
    // Track UTM parameter usage
    function trackUTMUsage(utmParams) {
        if (typeof gtag !== 'undefined' && Object.keys(utmParams).length > 0) {
            gtag('event', 'utm_parameter_used', {
                event_category: 'marketing',
                event_label: `${utmParams.utm_source}_${utmParams.utm_medium}_${utmParams.utm_campaign}`,
                utm_source: utmParams.utm_source,
                utm_medium: utmParams.utm_medium,
                utm_campaign: utmParams.utm_campaign,
                utm_content: utmParams.utm_content,
                utm_term: utmParams.utm_term,
                value: 1
            });
            
            console.log('📊 UTM usage tracked:', utmParams);
        }
    }
    
    // Initialize UTM tracking
    function initUTMTracking() {
        console.log('🔗 UTM tracking initialized');
        
        // Extract UTM parameters from current URL
        const utmParams = extractUTMFromURL();
        if (utmParams) {
            trackUTMUsage(utmParams);
        }
        
        // Add UTM parameters to internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href*="dctenık.com"]');
        internalLinks.forEach(link => {
            const currentUTM = getStoredUTM();
            if (Object.keys(currentUTM).length > 0) {
                const url = new URL(link.href);
                Object.keys(currentUTM).forEach(key => {
                    url.searchParams.set(key, currentUTM[key]);
                });
                link.href = url.toString();
            }
        });
    }
    
    // Helper function to get stored UTM parameters
    function getStoredUTM() {
        try {
            return JSON.parse(sessionStorage.getItem('utm_params') || '{}');
        } catch (e) {
            return {};
        }
    }
    
    // Generate campaign URLs for marketing materials
    function generateCampaignURLs(campaignType, campaignName, customParams = {}) {
        const utmParams = generateUTM(campaignType, campaignName, customParams);
        const baseURL = window.location.origin;
        
        return {
            homepage: buildUTMURL(`${baseURL}/`, utmParams),
            blog: buildUTMURL(`${baseURL}/blog.html`, utmParams),
            bobin: buildUTMURL(`${baseURL}/bobin.html`, utmParams),
            contact: buildUTMURL(`${baseURL}/#contact`, utmParams)
        };
    }
    
    // Export functions for global use
    window.UTMTracking = {
        generateUTM,
        buildUTMURL,
        storeUTMParams,
        extractUTMFromURL,
        generateSharingURLs,
        trackUTMUsage,
        generateCampaignURLs,
        getStoredUTM
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUTMTracking);
    } else {
        initUTMTracking();
    }
})();

