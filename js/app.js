/**
 * Main Application Entry Point
 * Initializes the Marchex DNI Demo application
 */

import configLoader from './utils/ConfigLoader.js';
import eventBus from './core/EventBus.js';

class MarchexDniDemo {
  constructor() {
    this.config = null;
    this.components = {};
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('[App] Starting Marchex DNI Demo...');
      
      // Show loading screen
      this.showLoading(true);
      
      // Load configuration
      this.config = await configLoader.initialize();
      
      if (!configLoader.validateConfig()) {
        throw new Error('Invalid configuration');
      }
      
      // Initialize event listeners
      this.setupEventListeners();
      
      // Initialize UI
      this.initializeUI();
      
      // Mark as initialized
      this.isInitialized = true;
      
      // Hide loading screen and show app
      this.showLoading(false);
      this.showApp();
      
      console.log('[App] Initialization complete');
      
    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.showError('Failed to initialize demo. Please refresh the page.');
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Reset button
    const resetBtn = document.getElementById('reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetDemo());
    }
    
    // Listen for journey events
    eventBus.on('journey:stateChanged', this.handleStateChange.bind(this));
    eventBus.on('journey:reset', this.handleReset.bind(this));
    eventBus.on('serp:clicked', this.handleSerpClick.bind(this));
    eventBus.on('call:simulated', this.handleCallSimulated.bind(this));
    
    console.log('[App] Event listeners configured');
  }

  /**
   * Initialize UI components
   */
  initializeUI() {
    // Populate traffic source dropdown
    this.populateTrafficSources();
    
    // Show welcome screen
    this.showWelcomeScreen();
    
    console.log('[App] UI initialized');
  }

  /**
   * Populate traffic source dropdown
   */
  populateTrafficSources() {
    const select = document.getElementById('traffic-source');
    if (!select) return;
    
    // Clear existing options
    select.innerHTML = '<option value="">Select source...</option>';
    
    // Add traffic sources from config
    const sources = this.config.tracking.sources;
    for (const [key, source] of Object.entries(sources)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = source.displayName;
      select.appendChild(option);
    }
    
    // Add change listener
    select.addEventListener('change', (e) => {
      if (e.target.value) {
        this.startJourney(e.target.value);
      }
    });
  }

  /**
   * Start customer journey with selected traffic source
   * @param {string} sourceId - Traffic source identifier
   */
  async startJourney(sourceId) {
    console.log(`[App] Starting journey with source: ${sourceId}`);
    
    try {
      // This will be implemented when we create the journey components
      // For now, just log the action
      const source = this.config.tracking.sources[sourceId];
      if (source) {
        console.log('[App] Traffic source selected:', source.displayName);
        alert(`Journey will start with: ${source.displayName}\n\nThis feature will be implemented in Phase 2.`);
      }
    } catch (error) {
      console.error('[App] Error starting journey:', error);
    }
  }

  /**
   * Handle state change events
   * @param {Object} data - State change data
   */
  handleStateChange(data) {
    console.log('[App] State changed:', data);
    // Update UI based on new state
  }

  /**
   * Handle SERP click events
   * @param {Object} data - Click data
   */
  handleSerpClick(data) {
    console.log('[App] SERP clicked:', data);
    // Transition to post-click state
  }

  /**
   * Handle call simulation events
   * @param {Object} data - Call data
   */
  handleCallSimulated(data) {
    console.log('[App] Call simulated:', data);
    // Show call analytics
  }

  /**
   * Handle reset events
   */
  handleReset() {
    console.log('[App] Journey reset');
    this.showWelcomeScreen();
  }

  /**
   * Reset the demo
   */
  resetDemo() {
    if (confirm('Reset the demo to the initial state?')) {
      console.log('[App] Resetting demo...');
      
      // Reset UI
      document.getElementById('traffic-source').value = '';
      this.showWelcomeScreen();
      
      // Clear any active components
      eventBus.emit('journey:reset');
      
      console.log('[App] Demo reset complete');
    }
  }

  /**
   * Show/hide loading screen
   * @param {boolean} show - Whether to show loading screen
   */
  showLoading(show) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Show main app
   */
  showApp() {
    const app = document.getElementById('app');
    if (app) {
      app.classList.remove('d-none');
      app.classList.add('fade-in');
    }
  }

  /**
   * Show welcome screen
   */
  showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const serpView = document.getElementById('serp-view');
    const websiteView = document.getElementById('website-view');
    
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (serpView) serpView.style.display = 'none';
    if (websiteView) websiteView.classList.add('d-none');
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Error</h4>
          <p>${message}</p>
          <hr>
          <button class="btn btn-primary" onclick="location.reload()">
            <i class="fas fa-redo"></i> Reload Page
          </button>
        </div>
      `;
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new MarchexDniDemo();
  app.init();
  
  // Make app instance globally available for debugging
  window.dniDemo = app;
});
