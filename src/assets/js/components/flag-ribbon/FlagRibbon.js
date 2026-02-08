/**
 * M-Pesewa Flag Ribbon Component
 * Displays country flags with hierarchy enforcement
 * Global → Countries → Groups → Lenders → Borrowers/Ledgers
 */

class FlagRibbon {
    constructor(options = {}) {
        // Configuration
        this.config = {
            mode: options.mode || 'horizontal',
            showLabels: options.showLabels !== false,
            interactive: options.interactive !== false,
            showHierarchy: options.showHierarchy !== false,
            currentCountry: options.currentCountry || null,
            container: options.container || document.body,
            position: options.position || 'top',
            ...options
        };

        // State
        this.state = {
            isVisible: true,
            isExpanded: false,
            selectedCountry: null,
            hierarchyMode: 'global', // global, country, group, lender, borrower
            countries: [],
            groups: [],
            currentUser: null
        };

        // References
        this.container = null;
        this.ribbonElement = null;
        this.flagsContainer = null;
        this.hierarchyElement = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the flag ribbon
     */
    init() {
        this.loadCountryData();
        this.createContainer();
        this.render();
        this.attachEvents();
        this.loadUserState();
    }

    /**
     * Load country data from localStorage or defaults
     */
    loadCountryData() {
        // Try to get from localStorage first
        const storedCountries = localStorage.getItem('mpesewa_countries');
        if (storedCountries) {
            this.state.countries = JSON.parse(storedCountries);
        } else {
            // Default country data
            this.state.countries = [
                { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSh', contact: '+254 709 219 000', isActive: true },
                { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', contact: '+256 392 175 546', isActive: true },
                { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', contact: '+255 659 073 010', isActive: true },
                { code: 'RW', name: 'Rwanda', flag: '🇷🇼', currency: 'RWF', contact: '+250 791 590 801', isActive: true },
                { code: 'CD', name: 'DRC', flag: '🇨🇩', currency: 'CDF', contact: '+243 81 000 0000', isActive: true },
                { code: 'BI', name: 'Burundi', flag: '🇧🇮', currency: 'BIF', contact: '+257 79 000 000', isActive: true },
                { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', contact: '+234 800 000 0000', isActive: true },
                { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', contact: '+233 24 000 0000', isActive: true },
                { code: 'SS', name: 'South Sudan', flag: '🇸🇸', currency: 'SSP', contact: '+211 955 000 000', isActive: true },
                { code: 'SO', name: 'Somalia', flag: '🇸🇴', currency: 'SOS', contact: '+252 63 0000000', isActive: true },
                { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', contact: '+27 11 000 0000', isActive: true },
                { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', contact: '+251 11 000 0000', isActive: true }
            ];
            localStorage.setItem('mpesewa_countries', JSON.stringify(this.state.countries));
        }

        // Load groups if available
        this.loadGroupsData();
    }

    /**
     * Load groups data based on hierarchy
     */
    loadGroupsData() {
        const storedGroups = localStorage.getItem('mpesewa_groups');
        if (storedGroups) {
            this.state.groups = JSON.parse(storedGroups);
        }
    }

    /**
     * Create container for the ribbon
     */
    createContainer() {
        this.container = this.config.container;
        
        // Remove existing ribbon if present
        const existingRibbon = document.querySelector('.mp-flag-ribbon');
        if (existingRibbon) {
            existingRibbon.remove();
        }

        // Create ribbon element
        this.ribbonElement = document.createElement('div');
        this.ribbonElement.className = 'mp-flag-ribbon';
        this.ribbonElement.setAttribute('data-mode', this.config.mode);
        this.ribbonElement.setAttribute('data-position', this.config.position);
        
        // Create flags container
        this.flagsContainer = document.createElement('div');
        this.flagsContainer.className = 'flag-container';
        
        // Create hierarchy display if enabled
        if (this.config.showHierarchy) {
            this.hierarchyElement = document.createElement('div');
            this.hierarchyElement.className = 'hierarchy-display';
        }

        this.ribbonElement.appendChild(this.flagsContainer);
        if (this.hierarchyElement) {
            this.ribbonElement.appendChild(this.hierarchyElement);
        }

        // Insert into DOM based on position
        this.insertIntoDOM();
    }

    /**
     * Insert ribbon into DOM at correct position
     */
    insertIntoDOM() {
        switch(this.config.position) {
            case 'top':
                this.container.insertBefore(this.ribbonElement, this.container.firstChild);
                break;
            case 'bottom':
                this.container.appendChild(this.ribbonElement);
                break;
            case 'header':
                const header = document.querySelector('header');
                if (header) {
                    header.appendChild(this.ribbonElement);
                } else {
                    this.container.insertBefore(this.ribbonElement, this.container.firstChild);
                }
                break;
            case 'footer':
                const footer = document.querySelector('footer');
                if (footer) {
                    footer.insertBefore(this.ribbonElement, footer.firstChild);
                } else {
                    this.container.appendChild(this.ribbonElement);
                }
                break;
            default:
                this.container.appendChild(this.ribbonElement);
        }
    }

    /**
     * Render the flag ribbon
     */
    render() {
        this.flagsContainer.innerHTML = '';
        
        // Add toggle button for expanded view
        if (this.config.interactive) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'ribbon-toggle';
            toggleBtn.innerHTML = '🌍';
            toggleBtn.title = 'Toggle country view';
            toggleBtn.addEventListener('click', () => this.toggleExpand());
            this.flagsContainer.appendChild(toggleBtn);
        }

        // Render flags based on mode
        if (this.config.mode === 'horizontal') {
            this.renderHorizontal();
        } else if (this.config.mode === 'vertical') {
            this.renderVertical();
        } else if (this.config.mode === 'dropdown') {
            this.renderDropdown();
        }

        // Render hierarchy if enabled
        if (this.config.showHierarchy && this.hierarchyElement) {
            this.renderHierarchy();
        }
    }

    /**
     * Render horizontal flag display
     */
    renderHorizontal() {
        this.state.countries.forEach(country => {
            const flagElement = this.createFlagElement(country);
            this.flagsContainer.appendChild(flagElement);
        });
    }

    /**
     * Render vertical flag display
     */
    renderVertical() {
        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-container';
        
        this.state.countries.forEach(country => {
            const flagElement = this.createFlagElement(country);
            verticalContainer.appendChild(flagElement);
        });
        
        this.flagsContainer.appendChild(verticalContainer);
    }

    /**
     * Render dropdown flag selector
     */
    renderDropdown() {
        const dropdown = document.createElement('select');
        dropdown.className = 'country-dropdown';
        dropdown.addEventListener('change', (e) => this.handleCountrySelect(e.target.value));
        
        // Default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select Country';
        dropdown.appendChild(defaultOption);
        
        // Country options
        this.state.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = `${country.flag} ${country.name}`;
            if (this.state.selectedCountry === country.code) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });
        
        this.flagsContainer.appendChild(dropdown);
    }

    /**
     * Create individual flag element
     */
    createFlagElement(country) {
        const flagDiv = document.createElement('div');
        flagDiv.className = 'flag-item';
        flagDiv.setAttribute('data-country', country.code);
        flagDiv.setAttribute('data-currency', country.currency);
        
        // Highlight current country
        if (this.state.selectedCountry === country.code || 
            this.config.currentCountry === country.code) {
            flagDiv.classList.add('active');
        }
        
        // Flag emoji
        const flagEmoji = document.createElement('span');
        flagEmoji.className = 'flag-emoji';
        flagEmoji.textContent = country.flag;
        
        // Country name
        const countryName = document.createElement('span');
        countryName.className = 'country-name';
        countryName.textContent = this.config.showLabels ? country.name : '';
        
        flagDiv.appendChild(flagEmoji);
        if (this.config.showLabels) {
            flagDiv.appendChild(countryName);
        }
        
        // Add click event for interactive mode
        if (this.config.interactive) {
            flagDiv.style.cursor = 'pointer';
            flagDiv.addEventListener('click', () => this.handleFlagClick(country));
            flagDiv.title = `${country.name} - ${country.currency}`;
        }
        
        return flagDiv;
    }

    /**
     * Render hierarchy visualization
     */
    renderHierarchy() {
        this.hierarchyElement.innerHTML = '';
        
        const hierarchyContainer = document.createElement('div');
        hierarchyContainer.className = 'hierarchy-container';
        
        // Global level
        const globalLevel = this.createHierarchyLevel('global', '🌐 Global');
        hierarchyContainer.appendChild(globalLevel);
        
        // Arrow down
        const arrow1 = document.createElement('div');
        arrow1.className = 'hierarchy-arrow';
        arrow1.innerHTML = '↓';
        hierarchyContainer.appendChild(arrow1);
        
        // Countries level
        const countriesLevel = this.createHierarchyLevel('countries', `${this.state.countries.length} Countries`);
        hierarchyContainer.appendChild(countriesLevel);
        
        // Arrow down
        const arrow2 = document.createElement('div');
        arrow2.className = 'hierarchy-arrow';
        arrow2.innerHTML = '↓';
        hierarchyContainer.appendChild(arrow2);
        
        // Groups level
        const groupsCount = this.state.groups.length;
        const groupsLevel = this.createHierarchyLevel('groups', `${groupsCount} Groups`);
        hierarchyContainer.appendChild(groupsLevel);
        
        // Branches for lenders and borrowers
        const branches = document.createElement('div');
        branches.className = 'hierarchy-branches';
        
        // Lenders branch
        const lendersBranch = document.createElement('div');
        lendersBranch.className = 'hierarchy-branch';
        lendersBranch.innerHTML = `
            <div class="branch-arrow">↳</div>
            <div class="branch-label lenders-branch">Lenders</div>
            <div class="branch-arrow">↳</div>
            <div class="branch-label ledgers-branch">Ledgers</div>
        `;
        branches.appendChild(lendersBranch);
        
        // Borrowers branch
        const borrowersBranch = document.createElement('div');
        borrowersBranch.className = 'hierarchy-branch';
        borrowersBranch.innerHTML = `
            <div class="branch-arrow">↳</div>
            <div class="branch-label borrowers-branch">Borrowers</div>
        `;
        branches.appendChild(borrowersBranch);
        
        hierarchyContainer.appendChild(branches);
        this.hierarchyElement.appendChild(hierarchyContainer);
    }

    /**
     * Create hierarchy level element
     */
    createHierarchyLevel(level, label) {
        const levelDiv = document.createElement('div');
        levelDiv.className = `hierarchy-level ${level}`;
        levelDiv.textContent = label;
        
        // Add click event to show details
        levelDiv.addEventListener('click', () => this.showHierarchyDetails(level));
        
        return levelDiv;
    }

    /**
     * Handle flag click event
     */
    handleFlagClick(country) {
        if (!this.config.interactive) return;
        
        this.state.selectedCountry = country.code;
        
        // Update UI
        document.querySelectorAll('.flag-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-country') === country.code) {
                item.classList.add('active');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('mpesewa_selected_country', country.code);
        
        // Dispatch custom event
        const event = new CustomEvent('countrySelected', {
            detail: country
        });
        this.ribbonElement.dispatchEvent(event);
        
        // Update hierarchy if needed
        if (this.config.showHierarchy) {
            this.updateHierarchyForCountry(country);
        }
    }

    /**
     * Handle country selection from dropdown
     */
    handleCountrySelect(countryCode) {
        if (!countryCode) return;
        
        const country = this.state.countries.find(c => c.code === countryCode);
        if (country) {
            this.handleFlagClick(country);
        }
    }

    /**
     * Update hierarchy display for selected country
     */
    updateHierarchyForCountry(country) {
        // Filter groups for this country
        const countryGroups = this.state.groups.filter(g => g.countryCode === country.code);
        
        // Update hierarchy display
        if (this.hierarchyElement) {
            const countriesLevel = this.hierarchyElement.querySelector('.hierarchy-level.countries');
            if (countriesLevel) {
                countriesLevel.textContent = `🇰🇪 ${country.name}`;
                countriesLevel.setAttribute('data-country', country.code);
            }
            
            const groupsLevel = this.hierarchyElement.querySelector('.hierarchy-level.groups');
            if (groupsLevel) {
                groupsLevel.textContent = `${countryGroups.length} Groups in ${country.name}`;
            }
        }
    }

    /**
     * Show hierarchy details
     */
    showHierarchyDetails(level) {
        let details = '';
        
        switch(level) {
            case 'global':
                details = 'M-Pesewa Platform - All Countries';
                break;
            case 'countries':
                details = this.state.countries.map(c => `${c.flag} ${c.name}`).join(', ');
                break;
            case 'groups':
                details = this.state.groups.length > 0 
                    ? this.state.groups.map(g => `${g.name} (${g.memberCount} members)`).join(', ')
                    : 'No groups yet';
                break;
        }
        
        // Show details in a tooltip or modal
        this.showDetailsModal(level, details);
    }

    /**
     * Show details modal
     */
    showDetailsModal(title, content) {
        // Remove existing modal
        const existingModal = document.querySelector('.hierarchy-modal');
        if (existingModal) existingModal.remove();
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'hierarchy-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title.charAt(0).toUpperCase() + title.slice(1)} Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close button event
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Toggle expanded view
     */
    toggleExpand() {
        this.state.isExpanded = !this.state.isExpanded;
        this.ribbonElement.classList.toggle('expanded', this.state.isExpanded);
        
        if (this.state.isExpanded) {
            this.showExpandedView();
        }
    }

    /**
     * Show expanded view with country details
     */
    showExpandedView() {
        // Create expanded view
        const expandedView = document.createElement('div');
        expandedView.className = 'expanded-view';
        
        this.state.countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.className = 'country-card';
            countryCard.innerHTML = `
                <div class="country-header">
                    <span class="country-flag">${country.flag}</span>
                    <span class="country-name">${country.name}</span>
                </div>
                <div class="country-details">
                    <div><strong>Currency:</strong> ${country.currency}</div>
                    <div><strong>Contact:</strong> ${country.contact}</div>
                    <div><strong>Status:</strong> ${country.isActive ? 'Active' : 'Inactive'}</div>
                </div>
            `;
            expandedView.appendChild(countryCard);
        });
        
        // Add to ribbon
        const existingExpanded = this.ribbonElement.querySelector('.expanded-view');
        if (existingExpanded) existingExpanded.remove();
        
        this.ribbonElement.appendChild(expandedView);
    }

    /**
     * Load user state from localStorage
     */
    loadUserState() {
        const userData = localStorage.getItem('mpesewa_user');
        if (userData) {
            this.state.currentUser = JSON.parse(userData);
            if (this.state.currentUser.country) {
                this.state.selectedCountry = this.state.currentUser.country;
            }
        }
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        // Listen for user state changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'mpesewa_user') {
                this.loadUserState();
                this.render();
            }
        });
        
        // Listen for hierarchy mode changes
        window.addEventListener('mpesewa:hierarchyChange', (e) => {
            this.state.hierarchyMode = e.detail.mode;
            this.renderHierarchy();
        });
    }

    /**
     * Public method to update ribbon mode
     */
    setMode(mode) {
        this.config.mode = mode;
        this.ribbonElement.setAttribute('data-mode', mode);
        this.render();
    }

    /**
     * Public method to update position
     */
    setPosition(position) {
        this.config.position = position;
        this.ribbonElement.setAttribute('data-position', position);
        this.insertIntoDOM();
    }

    /**
     * Public method to show/hide labels
     */
    setShowLabels(show) {
        this.config.showLabels = show;
        this.render();
    }

    /**
     * Public method to select country
     */
    selectCountry(countryCode) {
        const country = this.state.countries.find(c => c.code === countryCode);
        if (country) {
            this.handleFlagClick(country);
        }
    }

    /**
     * Public method to get current country
     */
    getCurrentCountry() {
        return this.state.countries.find(c => c.code === this.state.selectedCountry);
    }

    /**
     * Public method to get all countries
     */
    getCountries() {
        return this.state.countries;
    }

    /**
     * Public method to add a group (for testing/demo)
     */
    addGroup(groupData) {
        const group = {
            id: Date.now().toString(),
            countryCode: groupData.countryCode || this.state.selectedCountry,
            name: groupData.name,
            type: groupData.type || 'General',
            memberCount: groupData.memberCount || 0,
            lenders: groupData.lenders || 0,
            borrowers: groupData.borrowers || 0,
            totalLent: groupData.totalLent || 0,
            repaymentRate: groupData.repaymentRate || 0,
            createdAt: new Date().toISOString(),
            ...groupData
        };
        
        this.state.groups.push(group);
        localStorage.setItem('mpesewa_groups', JSON.stringify(this.state.groups));
        
        // Update hierarchy display
        if (this.config.showHierarchy) {
            this.renderHierarchy();
        }
        
        return group;
    }

    /**
     * Public method to remove ribbon
     */
    destroy() {
        if (this.ribbonElement && this.ribbonElement.parentNode) {
            this.ribbonElement.parentNode.removeChild(this.ribbonElement);
        }
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlagRibbon;
}

// Auto-initialize if data-flag-ribbon attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const ribbonElements = document.querySelectorAll('[data-flag-ribbon]');
    ribbonElements.forEach(element => {
        const config = {
            container: element,
            mode: element.getAttribute('data-mode') || 'horizontal',
            showLabels: element.getAttribute('data-labels') !== 'false',
            interactive: element.getAttribute('data-interactive') !== 'false',
            showHierarchy: element.getAttribute('data-hierarchy') === 'true',
            position: element.getAttribute('data-position') || 'top'
        };
        
        window.mpesewaFlagRibbon = new FlagRibbon(config);
    });
});