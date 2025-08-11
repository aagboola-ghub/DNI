/**
 * TrackingPanel Component
 * Renders and manages the left-side tracking data panel
 */

export class TrackingPanel {
    constructor(container, config, trackingData) {
        this.container = container;
        this.config = config;
        this.trackingData = trackingData;
        this.activeTab = 'session';
        this.callData = null;
    }

    render() {
        this.container.innerHTML = this.getHTML();
        this.attachEventListeners();
        this.update();
    }

    getHTML() {
        return `
            <!-- Demo Controls Card -->
            <div class="card border-0 rounded-0" id="demo-controls">
                <div class="card-header">
                    <h5 class="mb-0">Demo Controls</h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="font-weight-bold mb-2">1. Select Traffic Source:</label>
                        <div class="btn-group btn-group-sm d-flex" role="group">
                            <button type="button" class="btn btn-outline-primary traffic-source-btn active" data-source="google">Google</button>
                            <button type="button" class="btn btn-outline-primary traffic-source-btn" data-source="facebook">Facebook</button>
                            <button type="button" class="btn btn-outline-primary traffic-source-btn" data-source="microsoft">Microsoft</button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="font-weight-bold mb-2">2. Select Marketing Type:</label>
                        <div class="btn-group btn-group-sm d-flex" role="group">
                            <button type="button" class="btn btn-outline-primary traffic-source-btn active" data-campaign="paid">Paid Campaign</button>
                            <button type="button" class="btn btn-outline-primary traffic-source-btn" data-campaign="organic">Organic Search</button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="font-weight-bold mb-2">3. Select Tracking Type:</label>
                        <div class="btn-group btn-group-sm d-flex tracking-type-toggle" role="group">
                            <button type="button" class="btn btn-outline-primary active" data-tracking="session">
                                Session Tracking
                            </button>
                            <button type="button" class="btn btn-outline-primary" data-tracking="channel">
                                Channel Tracking
                            </button>
                        </div>
                    </div>
                    
                    <button id="reset-demo" class="btn btn-primary btn-sm btn-block mt-3">Reset Demo</button>
                </div>
            </div>
            
            <div class="card border-0 rounded-0">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Marchex Tracking Data</h5>
                    <span class="stage-badge" id="current-stage">${this.trackingData.data.currentStage}</span>
                </div>
                <div class="card-body p-0">
                    <ul class="nav nav-tabs nav-justified wf-tablist" id="tracking-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="session-tab" data-tab="session" href="#">Session Data</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="dni-tab" data-tab="dni" href="#">DNI Rules</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="call-tab" data-tab="call" href="#">Call Data</a>
                        </li>
                    </ul>
                    
                    <div class="tab-content p-3">
                        ${this.getSessionDataHTML()}
                        ${this.getDNIRulesHTML()}
                        ${this.getCallDataHTML()}
                    </div>
                </div>
            </div>
        `;
    }

    getSessionDataHTML() {
        const data = this.trackingData.getData();
        const display = this.activeTab === 'session' ? 'block' : 'none';
        
        return `
            <div class="panel-tab-content" id="session-data" style="display: ${display};">
                <div class="data-source-indicator mb-3">
                    <small><strong>Data Source:</strong> Marchex Session Tracking</small>
                </div>
                
                <table class="table table-sm tracking-table">
                    <tbody>
                        <tr>
                            <td width="40%">Session ID</td>
                            <td id="session-id">${data.sessionId}</td>
                        </tr>
                        <tr class="highlight-tracking">
                            <td>Traffic Source</td>
                            <td id="traffic-source">${data.source}</td>
                        </tr>
                        <tr>
                            <td>UTM Source</td>
                            <td id="utm-source">${data.utmSource}</td>
                        </tr>
                        <tr>
                            <td>UTM Medium</td>
                            <td id="utm-medium">${data.utmMedium}</td>
                        </tr>
                        <tr>
                            <td>UTM Campaign</td>
                            <td id="utm-campaign">${data.utmCampaign}</td>
                        </tr>
                        <tr>
                            <td>UTM Term</td>
                            <td id="utm-term">${data.utmTerm}</td>
                        </tr>
                        <tr class="highlight-tracking">
                            <td>Click ID</td>
                            <td id="click-id">${data.campaign === 'paid' ? data.clickId : '(not set)'}</td>
                        </tr>
                        <tr>
                            <td>Landing Page</td>
                            <td id="current-page">${this.getPageDisplay(data.currentPage)}</td>
                        </tr>
                        <tr>
                            <td>Original Number</td>
                            <td id="original-number">${data.originalNumber}</td>
                        </tr>
                        <tr class="highlight-tracking">
                            <td>Tracking Number</td>
                            <td id="tracking-number">${this.getTrackingNumberDisplay(data)}</td>
                        </tr>
                        ${data.campaign === 'paid' || data.campaign === 'organic' ? `
                        <tr class="campaign-data-row" style="display: table-row;">
                            <td>Campaign Type</td>
                            <td id="campaign-type">${data.campaign === 'paid' ? 'Paid Search' : 'Organic Search'}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        `;
    }

    getDNIRulesHTML() {
        const display = this.activeTab === 'dni' ? 'block' : 'none';
        const data = this.trackingData.getData();
        
        return `
            <div class="panel-tab-content" id="dni-data" style="display: ${display};">
                <div class="data-source-indicator mb-3">
                    <small><strong>Data Source:</strong> Marchex DNI Configuration</small>
                </div>
                
                <h6 class="mb-2">Dynamic Number Insertion Rules</h6>
                <table class="table table-sm tracking-table">
                    <thead>
                        <tr>
                            <th>Page Pattern</th>
                            <th>Original Number</th>
                            <th>Pool Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>*/checking/</td>
                            <td>${this.config.phoneNumbers.main}</td>
                            <td>Session-based</td>
                        </tr>
                        <tr>
                            <td>*/checking/initiate/</td>
                            <td>${this.config.phoneNumbers.main}</td>
                            <td>Session-based</td>
                        </tr>
                        <tr>
                            <td>*/checking/navigate/</td>
                            <td>${this.config.phoneNumbers.main}</td>
                            <td>Session-based</td>
                        </tr>
                        <tr>
                            <td>*/checking/optimize/</td>
                            <td>${this.config.phoneNumbers.premium}</td>
                            <td>Session-based</td>
                        </tr>
                    </tbody>
                </table>
                
                <h6 class="mt-4 mb-2">Active Replacement Pattern</h6>
                <div class="alert alert-light border p-2">
                    <small id="dni-rule-pattern">${data.dniRule}</small>
                </div>
            </div>
        `;
    }

    getCallDataHTML() {
        const display = this.activeTab === 'call' ? 'block' : 'none';
        
        if (!this.callData) {
            return `
                <div class="panel-tab-content" id="call-data" style="display: ${display};">
                    <div class="data-source-indicator mb-3">
                        <small><strong>Data Source:</strong> Marchex Call Analytics</small>
                    </div>
                    
                    <div class="text-center p-3 mb-3 bg-light border rounded">
                        <p class="mb-1"><small>A call would include all tracking data</small></p>
                        <h6 class="mb-0">No Call Made Yet</h6>
                    </div>
                </div>
            `;
        }
        
        // Return full call data HTML when call has been made
        return this.getCallDataFullHTML(display);
    }

    getCallDataFullHTML(display) {
        // This would contain the full call analytics HTML
        // Implementation continues...
        return `<div class="panel-tab-content" id="call-data" style="display: ${display};"><!-- Call data content --></div>`;
    }

    getPageDisplay(page) {
        const pageMap = {
            'search': 'Google Search Results',
            'landing': `${this.config.brand.domain}/biz/`,
            'checking': `${this.config.brand.domain}/biz/checking/`,
            'initiate': `${this.config.brand.domain}/biz/checking/initiate/`,
            'navigate': `${this.config.brand.domain}/biz/checking/navigate/`,
            'optimize': `${this.config.brand.domain}/biz/checking/optimize/`
        };
        
        return pageMap[page] || 'Unknown Page';
    }

    getTrackingNumberDisplay(data) {
        if (data.currentPage === 'search' || data.currentPage === 'landing') {
            return 'Not yet assigned';
        }
        
        return data.currentPage === 'optimize' ? 
            data.trackingNumberPremium : 
            data.trackingNumber;
    }

    attachEventListeners() {
        // Traffic source buttons
        this.container.querySelectorAll('.traffic-source-btn[data-source]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.container.querySelectorAll('.traffic-source-btn[data-source]').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.trackingData.setTrafficSource(e.target.dataset.source);
                this.update();
            });
        });
        
        // Campaign type buttons
        this.container.querySelectorAll('.traffic-source-btn[data-campaign]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.container.querySelectorAll('.traffic-source-btn[data-campaign]').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.trackingData.setCampaignType(e.target.dataset.campaign);
                this.update();
            });
        });
        
        // Tracking type buttons
        this.container.querySelectorAll('.tracking-type-toggle .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.container.querySelectorAll('.tracking-type-toggle .btn').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');
                this.trackingData.setTrackingType(e.target.dataset.tracking);
                this.update();
            });
        });
        
        // Tab switching
        this.container.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Reset button
        const resetBtn = this.container.querySelector('#reset-demo');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.reset();
            });
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        
        // Update tab UI
        this.container.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        this.container.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content visibility
        this.container.querySelectorAll('.panel-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        this.container.querySelector(`#${tabName}-data`).style.display = 'block';
    }

    update() {
        // Update all dynamic fields
        const data = this.trackingData.getData();
        
        // Update session data fields
        this.updateField('session-id', data.sessionId);
        this.updateField('traffic-source', data.source);
        this.updateField('utm-source', data.utmSource);
        this.updateField('utm-medium', data.utmMedium);
        this.updateField('utm-campaign', data.utmCampaign);
        this.updateField('utm-term', data.utmTerm);
        this.updateField('click-id', data.campaign === 'paid' ? data.clickId : '(not set)');
        this.updateField('current-page', this.getPageDisplay(data.currentPage));
        this.updateField('original-number', data.originalNumber);
        this.updateField('tracking-number', this.getTrackingNumberDisplay(data));
        this.updateField('campaign-type', data.campaign === 'paid' ? 'Paid Search' : 'Organic Search');
        
        // Update DNI rule
        this.updateField('dni-rule-pattern', data.dniRule);
        
        // Update stage badge
        this.updateField('current-stage', data.currentStage);
    }

    updateField(id, value) {
        const element = this.container.querySelector(`#${id}`);
        if (element) {
            element.textContent = value;
        }
    }

    showCallData(callData) {
        this.callData = callData;
        this.switchTab('call');
        this.render(); // Re-render to show call data
    }

    reset() {
        this.trackingData.reset();
        this.callData = null;
        this.activeTab = 'session';
        this.render();
        
        // Dispatch reset event
        document.dispatchEvent(new CustomEvent('demo:reset'));
    }
}