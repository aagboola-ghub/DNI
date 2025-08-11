/**
 * ConfigLoader - Handles loading and managing configuration files
 * Loads brand, tracking, and product configurations
 */
export class ConfigLoader {
  constructor() {
    this.config = {
      brand: null,
      tracking: null,
      products: null
    };
    this.brandId = null;
  }

  /**
   * Initialize configuration loading
   * @param {string} brandName - Brand identifier (defaults to 'wells-fargo')
   * @returns {Promise<Object>} - Complete configuration object
   */
  async initialize(brandName = null) {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    this.brandId = brandName || urlParams.get('brand') || 'wells-fargo';
    
    console.log(`[ConfigLoader] Initializing with brand: ${this.brandId}`);
    
    try {
      await this.loadAllConfigs();
      this.applyBrandStyles();
      this.updatePageTitle();
      return this.config;
    } catch (error) {
      console.error('[ConfigLoader] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load all configuration files
   * @returns {Promise<Object>} - Complete configuration
   */
  async loadAllConfigs() {
    const [brand, tracking, products] = await Promise.all([
      this.loadBrandConfig(),
      this.loadTrackingConfig(),
      this.loadProductConfig()
    ]);

    this.config = { brand, tracking, products };
    return this.config;
  }

  /**
   * Load brand configuration
   * @returns {Promise<Object>} - Brand configuration
   */
  async loadBrandConfig() {
    try {
      const response = await fetch(`config/brands/${this.brandId}.json`);
      
      if (!response.ok) {
        console.warn(`[ConfigLoader] Brand '${this.brandId}' not found, loading default`);
        this.brandId = 'wells-fargo';
        return this.loadBrandConfig();
      }
      
      const brandConfig = await response.json();
      this.config.brand = brandConfig;
      
      console.log(`[ConfigLoader] Loaded brand config: ${brandConfig.brand.name}`);
      return brandConfig;
    } catch (error) {
      console.error('[ConfigLoader] Error loading brand config:', error);
      throw error;
    }
  }

  /**
   * Load tracking configuration
   * @returns {Promise<Object>} - Tracking configuration
   */
  async loadTrackingConfig() {
    try {
      const [trafficSources, dniRules] = await Promise.all([
        fetch('config/tracking/traffic-sources.json').then(r => r.json()),
        fetch('config/tracking/dni-rules.json').then(r => r.json())
      ]);

      const trackingConfig = {
        sources: trafficSources.sources,
        placeholders: trafficSources.placeholders,
        numberPools: dniRules.numberPools,
        assignmentRules: dniRules.assignmentRules
      };

      this.config.tracking = trackingConfig;
      
      console.log('[ConfigLoader] Loaded tracking configuration');
      return trackingConfig;
    } catch (error) {
      console.error('[ConfigLoader] Error loading tracking config:', error);
      throw error;
    }
  }

  /**
   * Load product configuration
   * @returns {Promise<Object>} - Product configuration
   */
  async loadProductConfig() {
    try {
      const response = await fetch('config/products/checking-accounts.json');
      
      if (!response.ok) {
        console.warn('[ConfigLoader] Product config not found, using defaults');
        return this.getDefaultProducts();
      }
      
      const productConfig = await response.json();
      this.config.products = productConfig;
      
      console.log('[ConfigLoader] Loaded product configuration');
      return productConfig;
    } catch (error) {
      console.warn('[ConfigLoader] Error loading products, using defaults:', error);
      return this.getDefaultProducts();
    }
  }

  /**
   * Apply brand styles to the page
   */
  applyBrandStyles() {
    if (!this.config.brand) return;
    
    const root = document.documentElement;
    const colors = this.config.brand.brand.colors;
    
    // Set CSS custom properties
    root.style.setProperty('--brand-primary', colors.primary);
    root.style.setProperty('--brand-secondary', colors.secondary);
    root.style.setProperty('--brand-tertiary', colors.tertiary);
    root.style.setProperty('--brand-text', colors.text);
    root.style.setProperty('--brand-bg', colors.background);
    
    // Set fonts
    const fonts = this.config.brand.brand.fonts;
    root.style.setProperty('--brand-font-primary', fonts.primary);
    root.style.setProperty('--brand-font-heading', fonts.heading);
    
    // Update logo
    const logoElement = document.getElementById('brand-logo');
    if (logoElement) {
      logoElement.src = this.config.brand.brand.logo.main;
      logoElement.alt = this.config.brand.brand.name;
    }
    
    console.log('[ConfigLoader] Applied brand styles');
  }

  /**
   * Update page title
   */
  updatePageTitle() {
    if (!this.config.brand) return;
    
    document.title = `${this.config.brand.brand.name} - DNI Demo`;
    
    const titleElement = document.getElementById('demo-title');
    if (titleElement) {
      titleElement.textContent = `${this.config.brand.brand.displayName} - DNI Technology Demo`;
    }
  }

  /**
   * Get default product configuration
   * @returns {Object} - Default products
   */
  getDefaultProducts() {
    return {
      productCategory: "Business Products",
      products: [
        {
          id: "product-1",
          name: "Basic Business Account",
          description: "Essential business banking",
          monthlyFee: "$10",
          features: [
            "Online banking",
            "Mobile app",
            "Debit card"
          ]
        },
        {
          id: "product-2",
          name: "Premium Business Account",
          description: "Advanced business features",
          monthlyFee: "$25",
          features: [
            "Everything in Basic",
            "Wire transfers",
            "Advanced reporting"
          ]
        }
      ]
    };
  }

  /**
   * Get current configuration
   * @returns {Object} - Current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get brand configuration
   * @returns {Object} - Brand configuration
   */
  getBrand() {
    return this.config.brand;
  }

  /**
   * Get tracking configuration
   * @returns {Object} - Tracking configuration
   */
  getTracking() {
    return this.config.tracking;
  }

  /**
   * Get products configuration
   * @returns {Object} - Products configuration
   */
  getProducts() {
    return this.config.products;
  }

  /**
   * Reload configuration with a different brand
   * @param {string} brandName - New brand identifier
   * @returns {Promise<Object>} - New configuration
   */
  async switchBrand(brandName) {
    console.log(`[ConfigLoader] Switching to brand: ${brandName}`);
    return this.initialize(brandName);
  }

  /**
   * Validate configuration
   * @returns {boolean} - True if configuration is valid
   */
  validateConfig() {
    const required = ['brand', 'tracking'];
    
    for (const key of required) {
      if (!this.config[key]) {
        console.error(`[ConfigLoader] Missing required config: ${key}`);
        return false;
      }
    }
    
    // Validate brand config
    if (!this.config.brand.brand || !this.config.brand.content) {
      console.error('[ConfigLoader] Invalid brand configuration structure');
      return false;
    }
    
    // Validate tracking config
    if (!this.config.tracking.sources || !this.config.tracking.numberPools) {
      console.error('[ConfigLoader] Invalid tracking configuration structure');
      return false;
    }
    
    return true;
  }
}

// Create singleton instance
const configLoader = new ConfigLoader();
export default configLoader;
