/**
 * TrackingDataManager
 * Manages all tracking data and number generation logic
 * Extracted from the original demo's tracking logic
 */

export class TrackingDataManager {
    constructor() {
        this.data = {
            sessionId: '',
            source: 'google',
            campaign: 'paid',
            trackingType: 'session',
            trackingNumber: '',
            trackingNumberPremium: '',
            currentPage: 'search',
            clickId: '',
            utmSource: 'google',
            utmMedium: 'cpc',
            utmCampaign: 'bizbanking_2025_q2',
            utmTerm: 'small business checking account',
            originalNumber: 'Not yet visible',
            dniRule: 'No active replacement',
            currentStage: 'Stage: Initial Search'
        };
        
        this.config = null;
    }

    initialize(config) {
        this.config = config;
        this.generateNewSession();
    }

    generateNewSession() {
        // Generate tracking numbers
        this.data.trackingNumber = this.generateTrackingNumber();
        this.data.trackingNumberPremium = this.generateTrackingNumber();
        
        // Generate session ID
        this.data.sessionId = this.generateSessionId(this.data.source, this.data.campaign);
        
        // Generate click ID
        this.data.clickId = this.generateClickId(this.data.source);
        
        // Set initial page
        this.data.currentPage = 'search';
        
        // Update UTM parameters based on campaign type
        this.updateUTMParameters();
    }

    generateTrackingNumber() {
        const middle = Math.floor(Math.random() * 900) + 100;
        const last = Math.floor(Math.random() * 9000) + 1000;
        return `800-${middle}-${last}`;
    }

    generateSessionId(source, campaign) {
        const randomNum = Math.floor(Math.random() * 100000);
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        let prefix = "WF_";
        if (campaign === "paid") {
            prefix += "SEM_";
        } else {
            prefix += "ORG_";
        }
        
        return `${prefix}${year}_${month}_${day}_${randomNum}`;
    }

    generateClickId(source) {
        const random = Math.random().toString(36).substring(2, 15);
        
        switch(source) {
            case 'google':
                return `gclid=Cj0KCQjwrMKmBhD0ARIsAKcl6jdP${random}`;
            case 'facebook':
                return `fbclid=IwAR2DfN7Zd5qSdD_${random}`;
            case 'microsoft':
                return `msclkid=7f31a8d${random}`;
            default:
                return '';
        }
    }

    updateUTMParameters() {
        if (this.data.campaign === 'paid') {
            this.data.utmSource = this.data.source;
            this.data.utmMedium = 'cpc';
            this.data.utmCampaign = 'bizbanking_2025_q2';
            this.data.utmTerm = 'small business checking account';
        } else {
            this.data.utmSource = this.data.source;
            this.data.utmMedium = 'organic';
            this.data.utmCampaign = '(not set)';
            this.data.utmTerm = '(not set)';
        }
    }

    setTrafficSource(source) {
        this.data.source = source;
        this.data.utmSource = source;
        this.data.clickId = this.generateClickId(source);
        this.data.sessionId = this.generateSessionId(source, this.data.campaign);
        this.updateUTMParameters();
    }

    setCampaignType(campaign) {
        this.data.campaign = campaign;
        this.data.sessionId = this.generateSessionId(this.data.source, campaign);
        this.updateUTMParameters();
    }

    setTrackingType(type) {
        this.data.trackingType = type;
        
        // If using channel tracking, use the same number for both premium and regular
        if (type === 'channel') {
            this.data.trackingNumberPremium = this.data.trackingNumber;
        } else {
            // For session tracking, generate a different number
            this.data.trackingNumberPremium = this.generateTrackingNumber();
        }
    }

    navigateToPage(page) {
        this.data.currentPage = page;
        
        // Update page-specific tracking data
        switch(page) {
            case 'search':
                this.data.originalNumber = 'Not yet visible';
                this.data.dniRule = 'No active replacement';
                this.data.currentStage = 'Stage: Initial Search';
                break;
                
            case 'landing':
                this.data.originalNumber = 'Not visible on page';
                this.data.dniRule = 'No active replacement';
                this.data.currentStage = 'Stage: Landing Page';
                break;
                
            case 'checking':
                this.data.originalNumber = this.config.phoneNumbers.main;
                this.data.dniRule = `Rule matched: */checking/ → Replace ${this.config.phoneNumbers.main} with tracking number`;
                this.data.currentStage = 'Stage: Checking Overview';
                break;
                
            case 'initiate':
                this.data.originalNumber = this.config.phoneNumbers.main;
                this.data.dniRule = `Rule matched: */checking/initiate/ → Replace ${this.config.phoneNumbers.main} with tracking number`;
                this.data.currentStage = 'Stage: Initiate Product Page';
                break;
                
            case 'navigate':
                this.data.originalNumber = this.config.phoneNumbers.main;
                this.data.dniRule = `Rule matched: */checking/navigate/ → Replace ${this.config.phoneNumbers.main} with tracking number`;
                this.data.currentStage = 'Stage: Navigate Product Page';
                break;
                
            case 'optimize':
                this.data.originalNumber = this.config.phoneNumbers.premium;
                this.data.dniRule = `Rule matched: */checking/optimize/ → Replace ${this.config.phoneNumbers.premium} with tracking number`;
                this.data.currentStage = 'Stage: Optimize Product Page';
                break;
        }
    }

    getCurrentTrackingNumber() {
        if (this.data.currentPage === 'optimize') {
            return this.data.trackingNumberPremium;
        }
        return this.data.trackingNumber;
    }

    getProgressPercentage() {
        const progressMap = {
            'search': 25,
            'landing': 50,
            'checking': 75,
            'initiate': 100,
            'navigate': 100,
            'optimize': 100
        };
        
        return progressMap[this.data.currentPage] || 25;
    }

    reset() {
        this.generateNewSession();
    }

    getData() {
        return { ...this.data };
    }
}