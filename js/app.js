/**
 * Main Application Entry Point
 * Coordinates the refactored DNI Demo
 */

import { ConfigLoader } from './modules/ConfigLoader.js';
import { TrackingPanel } from './components/TrackingPanel.js';
import { WebsiteSimulator } from './components/WebsiteSimulator.js';
import { TrackingDataManager } from './modules/TrackingDataManager.js';
import { JourneyController } from './modules/JourneyController.js';

class MarchexDNIDemo {
    constructor() {
        this.config = null;
        this.configLoader = new ConfigLoader();
        this.trackingData = new TrackingDataManager();
        this.journeyController = null;
        this.trackingPanel = null;
        this.websiteSimulator = null;
    }

    async init() {
        try {
            // Load configuration
            const brandId = this.getBrandFromUrl() || 'wells-fargo';
            this.config = await this.configLoader.load(brandId);
            
            // Apply brand theme
            this.applyBrandTheme();
            
            // Initialize components
            this.initializeComponents();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize tracking data
            this.trackingData.initialize(this.config);
            
            // Start in pre-click state
            this.journeyController.startJourney();
            
            console.log('Demo initialized successfully');
        } catch (error) {
            console.error('Failed to initialize demo:', error);
        }
    }

    getBrandFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('brand');
    }

    applyBrandTheme() {
        // Update brand styles
        document.documentElement.style.setProperty('--brand-primary', this.config.brand.colors.primary);
        document.documentElement.style.setProperty('--brand-secondary', this.config.brand.colors.secondary);
        document.documentElement.style.setProperty('--brand-tertiary', this.config.brand.colors.tertiary);
        
        // Update brand name
        document.querySelectorAll('.brand-name').forEach(el => {
            el.textContent = this.config.brand.displayName;
        });
        
        // Update page title
        document.title = `${this.config.brand.name} Business Banking - Marchex DNI Demo`;
    }

    initializeComponents() {
        // Initialize tracking panel
        const trackingContainer = document.getElementById('tracking-panel-container');
        this.trackingPanel = new TrackingPanel(trackingContainer, this.config, this.trackingData);
        
        // Initialize website simulator
        const websiteContainer = document.getElementById('website-container');
        this.websiteSimulator = new WebsiteSimulator(websiteContainer, this.config, this.trackingData);
        
        // Initialize journey controller
        this.journeyController = new JourneyController(
            this.trackingPanel,
            this.websiteSimulator,
            this.trackingData,
            this.config
        );
        
        // Render initial state
        this.trackingPanel.render();
        this.websiteSimulator.render();
    }

    setupEventListeners() {
        // Listen for journey events
        document.addEventListener('journey:stateChanged', (e) => {
            this.handleStateChange(e.detail);
        });
        
        document.addEventListener('journey:pageChanged', (e) => {
            this.handlePageChange(e.detail);
        });
        
        document.addEventListener('call:simulated', (e) => {
            this.handleCallSimulated(e.detail);
        });
    }

    handleStateChange(detail) {
        // Update progress bar
        this.updateProgressBar(detail.progress);
        
        // Update tracking panel
        this.trackingPanel.update();
    }

    handlePageChange(detail) {
        // Update URL display
        document.querySelectorAll('.page-display span').forEach(el => {
            el.textContent = detail.url;
        });
        
        // Update tracking data
        this.trackingPanel.update();
    }

    handleCallSimulated(detail) {
        // Show call modal
        this.showCallModal(detail);
        
        // Update tracking panel to show call data
        this.trackingPanel.showCallData(detail);
    }

    updateProgressBar(progress) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    showCallModal(callData) {
        // Update modal content
        const modalSource = document.getElementById('modal-source');
        if (modalSource) {
            modalSource.textContent = callData.source;
        }
        
        // Show modal using Bootstrap
        $('#callMadeModal').modal('show');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new MarchexDNIDemo();
    app.init();
    
    // Make available globally for debugging
    window.dniDemo = app;
});