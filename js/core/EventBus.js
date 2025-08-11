/**
 * EventBus - Central event management system
 * Provides publish-subscribe pattern for component communication
 */
export class EventBus {
  constructor() {
    this.events = {};
    this.debug = false; // Set to true for event logging
  }

  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for callback execution
   * @returns {EventBus} - For chaining
   */
  on(event, callback, context) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push({
      callback: callback,
      context: context || null
    });
    
    if (this.debug) {
      console.log(`[EventBus] Subscribed to: ${event}`);
    }
    
    return this;
  }

  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback to remove (optional - removes all if not provided)
   * @returns {EventBus} - For chaining
   */
  off(event, callback) {
    if (!this.events[event]) return this;
    
    if (!callback) {
      delete this.events[event];
      if (this.debug) {
        console.log(`[EventBus] Removed all listeners for: ${event}`);
      }
      return this;
    }
    
    this.events[event] = this.events[event].filter(
      listener => listener.callback !== callback
    );
    
    if (this.debug) {
      console.log(`[EventBus] Removed listener for: ${event}`);
    }
    
    return this;
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {...any} args - Arguments to pass to callbacks
   * @returns {EventBus} - For chaining
   */
  emit(event, ...args) {
    if (!this.events[event]) return this;
    
    if (this.debug) {
      console.log(`[EventBus] Emitting: ${event}`, args);
    }
    
    this.events[event].forEach(listener => {
      try {
        listener.callback.apply(listener.context, args);
      } catch (error) {
        console.error(`[EventBus] Error in listener for ${event}:`, error);
      }
    });
    
    return this;
  }

  /**
   * Subscribe to an event only once
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for callback execution
   * @returns {EventBus} - For chaining
   */
  once(event, callback, context) {
    const onceWrapper = (...args) => {
      callback.apply(context, args);
      this.off(event, onceWrapper);
    };
    
    return this.on(event, onceWrapper, context);
  }

  /**
   * Clear all event listeners
   */
  clear() {
    this.events = {};
    if (this.debug) {
      console.log('[EventBus] Cleared all event listeners');
    }
  }

  /**
   * Get list of registered events
   * @returns {string[]} - Array of event names
   */
  getEvents() {
    return Object.keys(this.events);
  }

  /**
   * Get listener count for an event
   * @param {string} event - Event name
   * @returns {number} - Number of listeners
   */
  getListenerCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
}

// Create singleton instance
const eventBus = new EventBus();
export default eventBus;
