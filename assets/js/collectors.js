/**
 * M-PESEWA - Debt Collectors Directory Module
 * Handles the directory of 200 vetted debt collectors across Africa
 */

class DebtCollectorsManager {
    constructor() {
        this.collectors = [];
        this.filteredCollectors = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.currentFilters = {
            country: '',
            city: '',
            serviceType: '',
            minRating: 0,
            isAvailable: true
        };
        
        this.init();
    }

    async init() {
        await this.loadCollectorsData();
        this.renderCollectors();
        this.setupEventListeners();
        this.setupFilters();
    }

    async loadCollectorsData() {
        try {
            // Try to load from localStorage first
            const cachedData = localStorage.getItem('mpesewa_collectors_cache');
            const cacheTime = localStorage.getItem('mpesewa_collectors_cache_time');
            
            // Use cached data if less than 24 hours old
            if (cachedData && cacheTime && (Date.now() - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
                this.collectors = JSON.parse(cachedData);
            } else {
                // Load from JSON file or generate sample data
                await this.loadCollectorsFromFile();
            }
        } catch (error) {
            console.error('Failed to load collectors data:', error);
            // Generate sample data as fallback
            this.generateSampleCollectors();
        }
        
        this.filteredCollectors = [...this.collectors];
    }

    async loadCollectorsFromFile() {
        try {
            const response = await fetch('/data/collectors.json');
            if (response.ok) {
                this.collectors = await response.json();
                // Cache the data
                localStorage.setItem('mpesewa_collectors_cache', JSON.stringify(this.collectors));
                localStorage.setItem('mpesewa_collectors_cache_time', Date.now().toString());
            } else {
                throw new Error('Failed to fetch collectors data');
            }
        } catch (error) {
            console.warn('Using sample collectors data:', error);
            this.generateSampleCollectors();
        }
    }

    generateSampleCollectors() {
        const countries = [
            { code: 'KE', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'] },
            { code: 'UG', name: 'Uganda', cities: ['Kampala', 'Entebbe', 'Jinja', 'Mbale', 'Gulu'] },
            { code: 'TZ', name: 'Tanzania', cities: ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar'] },
            { code: 'RW', name: 'Rwanda', cities: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi'] },
            { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'] },
            { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast'] },
            { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'] }
        ];

        const serviceTypes = [
            'Legal Recovery',
            'Negotiation Service',
            'Asset Tracing',
            'Skip Tracing',
            'Credit Counseling',
            'Debt Restructuring',
            'Court Representation',
            'Mediation Service'
        ];

        const companyNames = [
            'Alpha Recovery Solutions',
            'Prime Debt Management',
            'Elite Collection Agency',
            'Pinnacle Recovery Group',
            'Summit Debt Solutions',
            'Crown Collection Services',
            'Heritage Recovery',
            'Legacy Debt Management',
            'Capital Recovery Partners',
            'Metro Collection Agency'
        ];

        this.collectors = [];

        for (let i = 1; i <= 200; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const city = country.cities[Math.floor(Math.random() * country.cities.length)];
            
            this.collectors.push({
                id: `DC-${i.toString().padStart(4, '0')}`,
                name: `${companyNames[Math.floor(Math.random() * companyNames.length)]} ${i}`,
                company: companyNames[Math.floor(Math.random() * companyNames.length)],
                country: country.name,
                countryCode: country.code,
                city: city,
                address: `${Math.floor(Math.random() * 1000) + 1} ${['Main St', 'Market Rd', 'Industrial Area', 'CBD', 'Service Lane'][Math.floor(Math.random() * 5)]}`,
                phone: this.generatePhoneNumber(country.code),
                email: `info@collector${i}.com`,
                website: `www.collector${i}.com`,
                services: this.randomServices(serviceTypes),
                rating: parseFloat((3 + Math.random() * 2).toFixed(1)), // 3.0 to 5.0
                experience: Math.floor(Math.random() * 20) + 1, // 1-20 years
                successRate: Math.floor(Math.random() * 30) + 70, // 70-100%
                feeStructure: this.randomFeeStructure(),
                languages: this.randomLanguages(),
                isCertified: Math.random() > 0.3,
                isAvailable: Math.random() > 0.2,
                operatingHours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
                licenseNumber: `DC-${country.code}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
                contactPerson: `Mr. ${['John', 'James', 'David', 'Michael', 'Robert'][Math.floor(Math.random() * 5)]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][Math.floor(Math.random() * 5)]}`,
                notes: 'Specializes in small to medium debt recovery. Offers free initial consultation.'
            });
        }

        // Cache the generated data
        localStorage.setItem('mpesewa_collectors_cache', JSON.stringify(this.collectors));
        localStorage.setItem('mpesewa_collectors_cache_time', Date.now().toString());
    }

    generatePhoneNumber(countryCode) {
        const prefixes = {
            'KE': '+2547',
            'UG': '+2567',
            'TZ': '+2556',
            'RW': '+2507',
            'NG': '+2348',
            'GH': '+2332',
            'ZA': '+278'
        };
        
        const prefix = prefixes[countryCode] || '+2547';
        const suffix = Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
        return prefix + suffix;
    }

    randomServices(serviceTypes) {
        const count = Math.floor(Math.random() * 3) + 2; // 2-4 services
        const shuffled = [...serviceTypes].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    randomFeeStructure() {
        const structures = [
            'Contingency (20-30% of recovered amount)',
            'Hourly Rate ($50-$150 per hour)',
            'Flat Fee (Negotiable)',
            'Hybrid (Retainer + Percentage)',
            'No Recovery, No Fee'
        ];
        return structures[Math.floor(Math.random() * structures.length)];
    }

    randomLanguages() {
        const languages = ['English', 'Swahili', 'French', 'Arabic', 'Local Dialects'];
        const count = Math.floor(Math.random() * 3) + 1; // 1-3 languages
        const shuffled = [...languages].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    renderCollectors() {
        const container = document.getElementById('collectorsList');
        if (!container) return;

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageCollectors = this.filteredCollectors.slice(startIndex, endIndex);

        if (pageCollectors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3 class="empty-title">No Collectors Found</h3>
                    <p class="empty-description">Try adjusting your filters to find debt collectors.</p>
                    <button class="btn primary" onclick="collectorsManager.resetFilters()">Reset Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        pageCollectors.forEach(collector => {
            const collectorCard = this.createCollectorCard(collector);
            container.appendChild(collectorCard);
        });

        this.renderPagination();
    }

    createCollectorCard(collector) {
        const card = document.createElement('div');
        card.className = 'collector-card';
        
        const ratingStars = this.renderRatingStars(collector.rating);
        const servicesList = collector.services.map(service => `<span class="service-tag">${service}</span>`).join('');
        
        card.innerHTML = `
            <div class="collector-header">
                <div class="collector-badge">
                    <span class="collector-id">${collector.id}</span>
                    ${collector.isCertified ? '<span class="certified-badge">Certified</span>' : ''}
                    ${!collector.isAvailable ? '<span class="unavailable-badge">Currently Unavailable</span>' : ''}
                </div>
                <h3 class="collector-name">${collector.name}</h3>
                <div class="collector-location">
                    <span class="location-flag">${this.getCountryFlag(collector.countryCode)}</span>
                    <span class="location-text">${collector.city}, ${collector.country}</span>
                </div>
            </div>
            
            <div class="collector-body">
                <div class="collector-rating">
                    <div class="rating-stars">${ratingStars}</div>
                    <span class="rating-value">${collector.rating.toFixed(1)}</span>
                    <span class="rating-count">(${collector.experience} years experience)</span>
                </div>
                
                <div class="collector-stats">
                    <div class="stat">
                        <div class="stat-label">Success Rate</div>
                        <div class="stat-value success">${collector.successRate}%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Fee Structure</div>
                        <div class="stat-value">${collector.feeStructure}</div>
                    </div>
                </div>
                
                <div class="collector-services">
                    <div class="services-label">Services Offered:</div>
                    <div class="services-list">${servicesList}</div>
                </div>
                
                <div class="collector-languages">
                    <strong>Languages:</strong> ${collector.languages.join(', ')}
                </div>
                
                <div class="collector-contact">
                    <div class="contact-info">
                        <div class="contact-item">
                            <span class="contact-icon">📞</span>
                            <span class="contact-text">${collector.phone}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <span class="contact-text">${collector.email}</span>
                        </div>
                        <div class="contact-item">
                            <span class="contact-icon">👤</span>
                            <span class="contact-text">Contact: ${collector.contactPerson}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="collector-footer">
                <div class="collector-actions">
                    <button class="btn small outline contact-btn" data-collector-id="${collector.id}">
                        📞 Contact Now
                    </button>
                    <button class="btn small view-details-btn" data-collector-id="${collector.id}">
                        👁️ View Details
                    </button>
                </div>
                <div class="collector-disclaimer">
                    <small>M-PESEWA does not participate in debt recovery. Contact collectors directly.</small>
                </div>
            </div>
        `;

        // Add event listeners
        const contactBtn = card.querySelector('.contact-btn');
        const detailsBtn = card.querySelector('.view-details-btn');
        
        contactBtn.addEventListener('click', () => this.contactCollector(collector));
        detailsBtn.addEventListener('click', () => this.showCollectorDetails(collector));

        return card;
    }

    renderRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">★</span>';
        }
        
        return stars;
    }

    getCountryFlag(countryCode) {
        const flags = {
            'KE': '🇰🇪',
            'UG': '🇺🇬',
            'TZ': '🇹🇿',
            'RW': '🇷🇼',
            'NG': '🇳🇬',
            'GH': '🇬🇭',
            'ZA': '🇿🇦',
            'ET': '🇪🇹',
            'SN': '🇸🇳'
        };
        
        return flags[countryCode] || '🏳️';
    }

    contactCollector(collector) {
        const message = `Hello, I found your contact through M-PESEWA Debt Collectors Directory.\n\nI need assistance with debt recovery. Could you please provide more information about your services?`;
        
        const whatsappUrl = `https://wa.me/${collector.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        const emailUrl = `mailto:${collector.email}?subject=Debt Recovery Inquiry&body=${encodeURIComponent(message)}`;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'contactCollectorModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Contact ${collector.name}</h3>
                    <button class="modal-close" onclick="document.getElementById('contactCollectorModal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="collector-contact-info">
                        <p><strong>Contact Person:</strong> ${collector.contactPerson}</p>
                        <p><strong>Phone:</strong> ${collector.phone}</p>
                        <p><strong>Email:</strong> ${collector.email}</p>
                        <p><strong>Operating Hours:</strong> ${collector.operatingHours}</p>
                    </div>
                    
                    <div class="contact-options">
                        <p>Choose how you'd like to contact them:</p>
                        <div class="contact-buttons">
                            <a href="${whatsappUrl}" target="_blank" class="btn primary">
                                💬 WhatsApp
                            </a>
                            <a href="${emailUrl}" class="btn outline">
                                📧 Email
                            </a>
                            <button class="btn secondary copy-phone-btn" data-phone="${collector.phone}">
                                📋 Copy Phone
                            </button>
                        </div>
                    </div>
                    
                    <div class="contact-disclaimer">
                        <p><strong>⚠️ Important Disclaimer:</strong></p>
                        <ul>
                            <li>M-PESEWA does not participate in or guarantee debt recovery</li>
                            <li>All agreements are between you and the collector</li>
                            <li>Verify the collector's credentials before engaging</li>
                            <li>Agree on terms and fees in writing before proceeding</li>
                            <li>Report any misconduct to support@m-pesewa.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Add copy phone functionality
        modal.querySelector('.copy-phone-btn').addEventListener('click', (e) => {
            const phone = e.target.dataset.phone;
            navigator.clipboard.writeText(phone).then(() => {
                e.target.textContent = '📋 Copied!';
                setTimeout(() => {
                    e.target.textContent = '📋 Copy Phone';
                }, 2000);
            });
        });
    }

    showCollectorDetails(collector) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'collectorDetailsModal';
        
        const ratingStars = this.renderRatingStars(collector.rating);
        const servicesList = collector.services.map(service => `<li>${service}</li>`).join('');
        
        modal.innerHTML = `
            <div class="modal-content wide">
                <div class="modal-header">
                    <h3>${collector.name} - Detailed Profile</h3>
                    <button class="modal-close" onclick="document.getElementById('collectorDetailsModal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="collector-profile">
                        <div class="profile-header">
                            <div class="profile-badge">
                                <span class="collector-id">${collector.id}</span>
                                ${collector.isCertified ? '<span class="certified-badge">✓ Certified Collector</span>' : ''}
                                <span class="availability-badge ${collector.isAvailable ? 'available' : 'unavailable'}">
                                    ${collector.isAvailable ? 'Available for New Cases' : 'Currently at Capacity'}
                                </span>
                            </div>
                            
                            <div class="profile-location">
                                <span class="location-flag">${this.getCountryFlag(collector.countryCode)}</span>
                                <div class="location-details">
                                    <h4>${collector.city}, ${collector.country}</h4>
                                    <p>${collector.address}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-stats">
                            <div class="stat-card">
                                <div class="stat-value">${collector.rating.toFixed(1)}</div>
                                <div class="stat-label">Rating</div>
                                <div class="rating-stars">${ratingStars}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${collector.successRate}%</div>
                                <div class="stat-label">Success Rate</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${collector.experience} years</div>
                                <div class="stat-label">Experience</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value">${collector.feeStructure.split('(')[0]}</div>
                                <div class="stat-label">Fee Structure</div>
                            </div>
                        </div>
                        
                        <div class="profile-details">
                            <div class="detail-section">
                                <h4>Contact Information</h4>
                                <div class="detail-grid">
                                    <div class="detail-item">
                                        <strong>Phone:</strong> ${collector.phone}
                                    </div>
                                    <div class="detail-item">
                                        <strong>Email:</strong> ${collector.email}
                                    </div>
                                    <div class="detail-item">
                                        <strong>Website:</strong> ${collector.website}
                                    </div>
                                    <div class="detail-item">
                                        <strong>Contact Person:</strong> ${collector.contactPerson}
                                    </div>
                                    <div class="detail-item">
                                        <strong>Operating Hours:</strong> ${collector.operatingHours}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Services Offered</h4>
                                <ul class="services-list">
                                    ${servicesList}
                                </ul>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Languages Spoken</h4>
                                <p>${collector.languages.join(', ')}</p>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Credentials</h4>
                                <div class="credentials">
                                    <p><strong>License Number:</strong> ${collector.licenseNumber}</p>
                                    <p><strong>Certification Status:</strong> ${collector.isCertified ? 'Certified' : 'Not Certified'}</p>
                                </div>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Fee Structure Details</h4>
                                <p>${collector.feeStructure}</p>
                                <p class="fee-note">Note: Fees are negotiable based on case complexity and amount.</p>
                            </div>
                            
                            <div class="detail-section">
                                <h4>Additional Notes</h4>
                                <p>${collector.notes}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="btn primary contact-profile-btn" data-collector-id="${collector.id}">
                            📞 Contact This Collector
                        </button>
                        <button class="btn outline" onclick="document.getElementById('collectorDetailsModal').remove()">
                            Close
                        </button>
                    </div>
                    
                    <div class="disclaimer-section">
                        <h5>⚠️ Important Disclaimer</h5>
                        <p>M-PESEWA provides this directory as a reference service only. We do not:</p>
                        <ul>
                            <li>Endorse or guarantee any collector's services</li>
                            <li>Participate in debt recovery processes</li>
                            <li>Handle payments or mediate disputes</li>
                            <li>Assume liability for collector actions</li>
                        </ul>
                        <p>Always verify credentials and agree on terms in writing before engaging any collector.</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        // Add contact button functionality
        modal.querySelector('.contact-profile-btn').addEventListener('click', () => {
            document.getElementById('collectorDetailsModal').remove();
            this.contactCollector(collector);
        });
    }

    setupFilters() {
        const filterForm = document.getElementById('collectorFilters');
        if (!filterForm) return;

        // Populate country filter
        const countrySelect = document.getElementById('filterCountry');
        if (countrySelect) {
            const countries = [...new Set(this.collectors.map(c => c.country))].sort();
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
        }

        // Setup filter event listeners
        filterForm.addEventListener('input', (e) => {
            if (e.target.matches('select, input')) {
                this.updateFilters();
            }
        });

        filterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.applyFilters();
        });

        // Reset filters button
        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }

    updateFilters() {
        const filterForm = document.getElementById('collectorFilters');
        if (!filterForm) return;

        this.currentFilters = {
            country: filterForm.querySelector('#filterCountry').value,
            city: filterForm.querySelector('#filterCity').value,
            serviceType: filterForm.querySelector('#filterService').value,
            minRating: parseFloat(filterForm.querySelector('#filterRating').value) || 0,
            isAvailable: filterForm.querySelector('#filterAvailable').checked
        };

        this.applyFilters();
    }

    applyFilters() {
        this.filteredCollectors = this.collectors.filter(collector => {
            // Country filter
            if (this.currentFilters.country && collector.country !== this.currentFilters.country) {
                return false;
            }
            
            // City filter
            if (this.currentFilters.city && !collector.city.toLowerCase().includes(this.currentFilters.city.toLowerCase())) {
                return false;
            }
            
            // Service type filter
            if (this.currentFilters.serviceType && !collector.services.some(service => 
                service.toLowerCase().includes(this.currentFilters.serviceType.toLowerCase()))) {
                return false;
            }
            
            // Rating filter
            if (collector.rating < this.currentFilters.minRating) {
                return false;
            }
            
            // Availability filter
            if (this.currentFilters.isAvailable && !collector.isAvailable) {
                return false;
            }
            
            return true;
        });

        this.currentPage = 1;
        this.renderCollectors();
        this.updateResultsCount();
    }

    resetFilters() {
        const filterForm = document.getElementById('collectorFilters');
        if (filterForm) {
            filterForm.reset();
        }
        
        this.currentFilters = {
            country: '',
            city: '',
            serviceType: '',
            minRating: 0,
            isAvailable: true
        };
        
        this.filteredCollectors = [...this.collectors];
        this.currentPage = 1;
        this.renderCollectors();
        this.updateResultsCount();
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `Found ${this.filteredCollectors.length} collector${this.filteredCollectors.length !== 1 ? 's' : ''}`;
        }
    }

    renderPagination() {
        const pagination = document.getElementById('collectorPagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredCollectors.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="pagination">
                <button class="page-item ${this.currentPage === 1 ? 'disabled' : ''}" 
                        onclick="collectorsManager.goToPage(${this.currentPage - 1})" 
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
        `;

        // Show page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="page-item ${i === this.currentPage ? 'active' : ''}" 
                            onclick="collectorsManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `<span class="page-ellipsis">...</span>`;
            }
        }

        paginationHTML += `
                <button class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="collectorsManager.goToPage(${this.currentPage + 1})" 
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredCollectors.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) {
            return;
        }
        
        this.currentPage = page;
        this.renderCollectors();
        
        // Scroll to top of results
        const resultsContainer = document.getElementById('collectorsList');
        if (resultsContainer) {
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchCollectors');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                if (searchTerm.length >= 2) {
                    this.filteredCollectors = this.collectors.filter(collector => 
                        collector.name.toLowerCase().includes(searchTerm) ||
                        collector.company.toLowerCase().includes(searchTerm) ||
                        collector.city.toLowerCase().includes(searchTerm) ||
                        collector.country.toLowerCase().includes(searchTerm) ||
                        collector.services.some(service => service.toLowerCase().includes(searchTerm))
                    );
                } else {
                    this.filteredCollectors = [...this.collectors];
                }
                
                this.currentPage = 1;
                this.renderCollectors();
                this.updateResultsCount();
            });
        }
    }

    // Public API methods
    getCollectorsByCountry(countryCode) {
        return this.collectors.filter(collector => 
            collector.countryCode === countryCode && collector.isAvailable
        );
    }

    getTopRatedCollectors(limit = 10) {
        return [...this.collectors]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    exportCollectorsToCSV() {
        const headers = ['ID', 'Name', 'Company', 'Country', 'City', 'Phone', 'Email', 'Rating', 'Experience', 'Success Rate', 'Services'];
        const csvData = this.collectors.map(collector => [
            collector.id,
            `"${collector.name}"`,
            `"${collector.company}"`,
            collector.country,
            collector.city,
            collector.phone,
            collector.email,
            collector.rating,
            collector.experience,
            `${collector.successRate}%`,
            `"${collector.services.join('; ')}"`
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `m-pesewa-collectors-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
    }
}

// Initialize collectors manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.collectorsManager = new DebtCollectorsManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DebtCollectorsManager;
}