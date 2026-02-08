'use strict';

// Debt collectors system for M-Pesewa
class CollectorsSystem {
    constructor() {
        this.collectors = [];
        this.filteredCollectors = [];
        this.currentFilters = {
            country: '',
            specialization: '',
            rating: ''
        };
        this.init();
    }

    async init() {
        await this.loadCollectors();
        this.renderCollectors();
        this.setupEventListeners();
        this.updateStats();
    }

    async loadCollectors() {
        try {
            const response = await fetch('../data/collectors.json');
            this.collectors = await response.json();
            this.filteredCollectors = [...this.collectors];
        } catch (error) {
            console.error('Failed to load collectors:', error);
            this.collectors = await this.generateDemoCollectors();
            this.filteredCollectors = [...this.collectors];
        }
    }

    async generateDemoCollectors() {
        const countries = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Somalia', 'South Sudan', 'Ethiopia', 'DRC', 'Nigeria', 'South Africa', 'Ghana'];
        const specializations = ['Individual', 'Corporate', 'Legal', 'Financial', 'Microfinance', 'Community', 'Cross-border'];
        const firstNames = ['John', 'Mary', 'David', 'Sarah', 'James', 'Linda', 'Michael', 'Grace', 'Robert', 'Patricia', 'William', 'Elizabeth'];
        const lastNames = ['Mwangi', 'Kamau', 'Ochieng', 'Auma', 'Odhiambo', 'Atieno', 'Okoth', 'Akinyi', 'Kiplagat', 'Chebet', 'Maina', 'Wambui'];
        const companies = ['Alpha Recovery', 'Debt Solutions Ltd', 'Credit Masters', 'Financial Recovery Agency', 'Loan Rescue', 'Debt Free Africa', 'Recovery Experts'];
        
        const collectors = [];
        
        for (let i = 0; i < 200; i++) {
            const country = countries[Math.floor(Math.random() * countries.length)];
            const specialization = specializations[Math.floor(Math.random() * specializations.length)];
            const rating = Math.floor(Math.random() * 5) + 1;
            const isCompany = Math.random() > 0.5;
            
            collectors.push({
                id: `DC${1000 + i}`,
                name: isCompany 
                    ? companies[Math.floor(Math.random() * companies.length)]
                    : `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                type: isCompany ? 'company' : 'individual',
                country: country,
                countryCode: country.substring(0, 3).toUpperCase(),
                city: this.getCityByCountry(country),
                specialization: specialization,
                rating: rating,
                casesResolved: Math.floor(Math.random() * 1000) + 50,
                successRate: 70 + Math.random() * 25, // 70-95%
                experienceYears: Math.floor(Math.random() * 20) + 1,
                contact: {
                    phone: this.generatePhoneNumber(country),
                    email: `contact${i}@collector${isCompany ? 'firm' : ''}.com`,
                    website: isCompany ? `www.collector${i}.com` : '',
                    address: `${Math.floor(Math.random() * 999) + 1} ${this.getStreetName()}, ${this.getCityByCountry(country)}`
                },
                services: this.getServicesBySpecialization(specialization),
                languages: this.getLanguagesByCountry(country),
                fees: {
                    type: Math.random() > 0.5 ? 'percentage' : 'fixed',
                    amount: Math.random() > 0.5 ? '20-30%' : `KSh ${Math.floor(Math.random() * 50000) + 5000}`
                },
                verification: {
                    verified: Math.random() > 0.3,
                    verifiedDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    verifiedBy: 'M-Pesewa Admin'
                },
                status: 'active'
            });
        }
        
        return collectors;
    }

    getCityByCountry(country) {
        const cities = {
            'Kenya': ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
            'Uganda': ['Kampala', 'Entebbe', 'Jinja', 'Mbale', 'Gulu'],
            'Tanzania': ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Zanzibar'],
            'Rwanda': ['Kigali', 'Butare', 'Gisenyi', 'Ruhengeri', 'Byumba'],
            'Burundi': ['Bujumbura', 'Gitega', 'Ngozi', 'Rumonge', 'Kayanza'],
            'Somalia': ['Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Garowe'],
            'South Sudan': ['Juba', 'Wau', 'Malakal', 'Yambio', 'Bor'],
            'Ethiopia': ['Addis Ababa', 'Dire Dawa', 'Mekele', 'Gondar', 'Bahir Dar'],
            'DRC': ['Kinshasa', 'Lubumbashi', 'Mbuji-Mayi', 'Kananga', 'Kisangani'],
            'Nigeria': ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
            'South Africa': ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'],
            'Ghana': ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast']
        };
        
        const countryCities = cities[country] || ['Capital City'];
        return countryCities[Math.floor(Math.random() * countryCities.length)];
    }

    generatePhoneNumber(country) {
        const prefixes = {
            'Kenya': '+254',
            'Uganda': '+256',
            'Tanzania': '+255',
            'Rwanda': '+250',
            'Burundi': '+257',
            'Somalia': '+252',
            'South Sudan': '+211',
            'Ethiopia': '+251',
            'DRC': '+243',
            'Nigeria': '+234',
            'South Africa': '+27',
            'Ghana': '+233'
        };
        
        const prefix = prefixes[country] || '+254';
        const number = Math.floor(Math.random() * 900000000) + 100000000;
        return `${prefix}${number.toString().substring(0, 9)}`;
    }

    getStreetName() {
        const streets = ['Main', 'Market', 'Station', 'University', 'Hospital', 'Airport', 'Bank', 'School', 'Church', 'Mosque'];
        return streets[Math.floor(Math.random() * streets.length)] + ' Street';
    }

    getServicesBySpecialization(specialization) {
        const services = {
            'Individual': ['Personal debt collection', 'Negotiation', 'Payment plans', 'Follow-up'],
            'Corporate': ['Corporate debt recovery', 'Legal proceedings', 'Asset tracing', 'Credit reporting'],
            'Legal': ['Legal notices', 'Court representation', 'Debt settlement agreements', 'Insolvency proceedings'],
            'Financial': ['Financial restructuring', 'Debt counseling', 'Budget planning', 'Credit repair'],
            'Microfinance': ['MFI loan recovery', 'Group lending collections', 'Field collection', 'Community mediation'],
            'Community': ['Community-based collection', 'Mediation', 'Social pressure', 'Family involvement'],
            'Cross-border': ['International debt collection', 'Currency conversion', 'Legal jurisdiction', 'Translation services']
        };
        
        return services[specialization] || ['Debt collection', 'Negotiation', 'Follow-up'];
    }

    getLanguagesByCountry(country) {
        const languages = {
            'Kenya': ['English', 'Swahili'],
            'Uganda': ['English', 'Swahili', 'Luganda'],
            'Tanzania': ['Swahili', 'English'],
            'Rwanda': ['Kinyarwanda', 'English', 'French'],
            'Burundi': ['Kirundi', 'French', 'Swahili'],
            'Somalia': ['Somali', 'Arabic', 'English'],
            'South Sudan': ['English', 'Arabic', 'Dinka'],
            'Ethiopia': ['Amharic', 'English', 'Oromo'],
            'DRC': ['French', 'Lingala', 'Swahili'],
            'Nigeria': ['English', 'Hausa', 'Yoruba', 'Igbo'],
            'South Africa': ['English', 'Afrikaans', 'Zulu', 'Xhosa'],
            'Ghana': ['English', 'Akan', 'Ewe', 'Ga']
        };
        
        return languages[country] || ['English'];
    }

    renderCollectors() {
        const container = document.getElementById('collectors-container');
        if (!container) return;

        if (this.filteredCollectors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">No Collectors Found</h3>
                    <p class="empty-state-description">Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        `;

        this.filteredCollectors.slice(0, 12).forEach(collector => {
            html += this.renderCollectorCard(collector);
        });

        html += '</div>';

        // Add pagination if needed
        if (this.filteredCollectors.length > 12) {
            html += this.renderPagination();
        }

        container.innerHTML = html;
    }

    renderCollectorCard(collector) {
        const ratingStars = '★'.repeat(collector.rating) + '☆'.repeat(5 - collector.rating);
        
        return `
            <div class="card collector-card">
                <div class="card-header">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="avatar ${collector.type === 'company' ? 'avatar-lg bg-primary text-white' : ''}">
                                ${collector.type === 'company' ? '🏢' : collector.name.charAt(0)}
                            </div>
                            <div>
                                <h3 class="card-title">${collector.name}</h3>
                                <p class="card-subtitle">${collector.specialization}</p>
                            </div>
                        </div>
                        ${collector.verification.verified ? `
                            <span class="badge badge-success" title="Verified by ${collector.verification.verifiedBy}">✓ Verified</span>
                        ` : ''}
                    </div>
                </div>
                <div class="card-body">
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="flag-icon">${this.getFlagEmoji(collector.country)}</span>
                                <span>${collector.country}</span>
                            </div>
                            <div class="text-warning">${ratingStars}</div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-3">
                            <div class="text-center">
                                <div class="text-xl font-bold">${collector.casesResolved.toLocaleString()}</div>
                                <div class="text-xs text-muted">Cases Resolved</div>
                            </div>
                            <div class="text-center">
                                <div class="text-xl font-bold">${collector.successRate.toFixed(1)}%</div>
                                <div class="text-xs text-muted">Success Rate</div>
                            </div>
                        </div>
                        
                        <div class="text-sm">
                            <div class="flex justify-between">
                                <span class="text-muted">Experience:</span>
                                <span class="font-semibold">${collector.experienceYears} years</span>
                            </div>
                            <div class="flex justify-between mt-1">
                                <span class="text-muted">Fees:</span>
                                <span class="font-semibold">${collector.fees.amount}</span>
                            </div>
                        </div>
                        
                        <div class="tags">
                            ${collector.services.slice(0, 3).map(service => `
                                <span class="tag">${service}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="flex gap-2">
                        <button class="btn btn-outline flex-1" onclick="collectorsSystem.viewCollectorDetails('${collector.id}')">
                            View Details
                        </button>
                        <button class="btn btn-primary" onclick="collectorsSystem.contactCollector('${collector.id}')" title="Contact">
                            📞
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredCollectors.length / 12);
        
        return `
            <div class="mt-8">
                <div class="flex justify-center">
                    <nav class="pagination">
                        <button class="page-link" onclick="collectorsSystem.goToPage(1)" ${1 === 1 ? 'disabled' : ''}>
                            «
                        </button>
                        ${Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => `
                            <button class="page-link ${page === 1 ? 'active' : ''}" onclick="collectorsSystem.goToPage(${page})">
                                ${page}
                            </button>
                        `).join('')}
                        ${totalPages > 5 ? `
                            <span class="page-link">...</span>
                            <button class="page-link" onclick="collectorsSystem.goToPage(${totalPages})">
                                ${totalPages}
                            </button>
                        ` : ''}
                        <button class="page-link" onclick="collectorsSystem.goToPage(${totalPages})" ${1 === totalPages ? 'disabled' : ''}>
                            »
                        </button>
                    </nav>
                </div>
            </div>
        `;
    }

    goToPage(page) {
        // In a real app, this would load the specific page of results
        // For now, just show a notification
        this.showNotification(`Loading page ${page}...`, 'info');
    }

    viewCollectorDetails(collectorId) {
        const collector = this.collectors.find(c => c.id === collectorId);
        if (!collector) return;

        const modalHtml = `
            <div class="modal-overlay" id="collector-modal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-header">
                        <h3 class="modal-title">Collector Details</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-6">
                            <div class="flex items-center gap-4 mb-4">
                                <div class="avatar ${collector.type === 'company' ? 'avatar-xl bg-primary text-white' : 'avatar-xl'}">
                                    ${collector.type === 'company' ? '🏢' : collector.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold">${collector.name}</h2>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="flag-icon">${this.getFlagEmoji(collector.country)}</span>
                                        <span>${collector.country} • ${collector.city}</span>
                                        ${collector.verification.verified ? `
                                            <span class="badge badge-success">Verified</span>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-primary">${collector.rating}/5</div>
                                    <div class="text-sm text-muted">Rating</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-success">${collector.casesResolved.toLocaleString()}</div>
                                    <div class="text-sm text-muted">Cases</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-warning">${collector.successRate.toFixed(1)}%</div>
                                    <div class="text-sm text-muted">Success Rate</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-danger">${collector.experienceYears} yrs</div>
                                    <div class="text-sm text-muted">Experience</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 class="font-semibold mb-3">Contact Information</h4>
                                <div class="space-y-2">
                                    <div class="flex items-center gap-2">
                                        <span class="text-muted">Phone:</span>
                                        <a href="tel:${collector.contact.phone}" class="font-semibold">${collector.contact.phone}</a>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-muted">Email:</span>
                                        <a href="mailto:${collector.contact.email}" class="font-semibold">${collector.contact.email}</a>
                                    </div>
                                    ${collector.contact.website ? `
                                        <div class="flex items-center gap-2">
                                            <span class="text-muted">Website:</span>
                                            <a href="${collector.contact.website}" target="_blank" class="font-semibold">${collector.contact.website}</a>
                                        </div>
                                    ` : ''}
                                    <div class="flex items-start gap-2">
                                        <span class="text-muted">Address:</span>
                                        <span class="font-semibold">${collector.contact.address}</span>
                                    </div>
                                </div>
                                
                                <h4 class="font-semibold mb-3 mt-4">Services</h4>
                                <div class="tags">
                                    ${collector.services.map(service => `
                                        <span class="tag">${service}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <h4 class="font-semibold mb-3">Specialization & Fees</h4>
                                <div class="space-y-3">
                                    <div>
                                        <div class="text-muted">Specialization</div>
                                        <div class="font-semibold">${collector.specialization}</div>
                                    </div>
                                    <div>
                                        <div class="text-muted">Fee Structure</div>
                                        <div class="font-semibold">${collector.fees.type === 'percentage' ? 'Percentage based' : 'Fixed fee'}: ${collector.fees.amount}</div>
                                    </div>
                                    <div>
                                        <div class="text-muted">Languages</div>
                                        <div class="font-semibold">${collector.languages.join(', ')}</div>
                                    </div>
                                </div>
                                
                                <h4 class="font-semibold mb-3 mt-4">Verification Status</h4>
                                <div class="bg-light rounded-lg p-4">
                                    <div class="flex justify-between items-center">
                                        <div>
                                            <div class="font-semibold">${collector.verification.verified ? 'Verified' : 'Not Verified'}</div>
                                            <div class="text-sm text-muted">
                                                ${collector.verification.verified 
                                                    ? `Verified on ${new Date(collector.verification.verifiedDate).toLocaleDateString()}`
                                                    : 'Pending verification'}
                                            </div>
                                        </div>
                                        ${collector.verification.verified ? `
                                            <div class="text-success text-2xl">✓</div>
                                        ` : `
                                            <div class="text-warning text-2xl">⏳</div>
                                        `}
                                    </div>
                                    ${collector.verification.verified ? `
                                        <div class="text-sm mt-2">
                                            Verified by: ${collector.verification.verifiedBy}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Close</button>
                        <button class="btn btn-primary" onclick="collectorsSystem.contactCollector('${collector.id}', true)">
                            Contact Collector
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    contactCollector(collectorId, fromModal = false) {
        const collector = this.collectors.find(c => c.id === collectorId);
        if (!collector) return;

        if (fromModal) {
            const modal = document.getElementById('collector-modal');
            if (modal) modal.remove();
        }

        const contactModal = `
            <div class="modal-overlay" id="contact-modal">
                <div class="modal-dialog">
                    <div class="modal-header">
                        <h3 class="modal-title">Contact ${collector.name}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-6">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="avatar">
                                    ${collector.type === 'company' ? '🏢' : collector.name.charAt(0)}
                                </div>
                                <div>
                                    <div class="font-semibold">${collector.name}</div>
                                    <div class="text-sm text-muted">${collector.specialization}</div>
                                </div>
                            </div>
                            
                            <div class="alert alert-info">
                                <div class="alert-icon">ℹ️</div>
                                <div class="alert-content">
                                    <div class="alert-title">Important Notice</div>
                                    <p>M-Pesewa does not participate in debt collection. This contact is provided for your convenience only.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="form-label">Your Name</label>
                                <input type="text" class="form-control" id="contact-name" placeholder="Enter your name">
                            </div>
                            <div>
                                <label class="form-label">Your Phone Number</label>
                                <input type="tel" class="form-control" id="contact-phone" placeholder="Enter your phone number">
                            </div>
                            <div>
                                <label class="form-label">Message</label>
                                <textarea class="form-control" id="contact-message" rows="3" placeholder="Briefly describe your debt collection needs..."></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" onclick="collectorsSystem.sendContactRequest('${collector.id}')">
                            Send Contact Request
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', contactModal);
    }

    sendContactRequest(collectorId) {
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const message = document.getElementById('contact-message').value;

        if (!name || !phone || !message) {
            this.showNotification('Please fill in all fields', 'danger');
            return;
        }

        // In a real app, this would send to a backend
        // For now, just show success message
        const modal = document.getElementById('contact-modal');
        if (modal) modal.remove();

        this.showNotification('Contact request sent successfully. The collector will contact you shortly.', 'success');
    }

    getFlagEmoji(country) {
        const flagMap = {
            'Kenya': '🇰🇪',
            'Uganda': '🇺🇬',
            'Tanzania': '🇹🇿',
            'Rwanda': '🇷🇼',
            'Burundi': '🇧🇮',
            'Somalia': '🇸🇴',
            'South Sudan': '🇸🇸',
            'Ethiopia': '🇪🇹',
            'DRC': '🇨🇩',
            'Nigeria': '🇳🇬',
            'South Africa': '🇿🇦',
            'Ghana': '🇬🇭'
        };
        return flagMap[country] || '🏳️';
    }

    filterCollectors() {
        this.filteredCollectors = this.collectors.filter(collector => {
            // Country filter
            if (this.currentFilters.country && collector.country !== this.currentFilters.country) {
                return false;
            }
            
            // Specialization filter
            if (this.currentFilters.specialization && collector.specialization !== this.currentFilters.specialization) {
                return false;
            }
            
            // Rating filter
            if (this.currentFilters.rating && collector.rating < parseInt(this.currentFilters.rating)) {
                return false;
            }
            
            return true;
        });
        
        this.renderCollectors();
        this.updateStats();
    }

    searchCollectors(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredCollectors = [...this.collectors];
        } else {
            this.filteredCollectors = this.collectors.filter(collector =>
                collector.name.toLowerCase().includes(searchTerm) ||
                collector.country.toLowerCase().includes(searchTerm) ||
                collector.city.toLowerCase().includes(searchTerm) ||
                collector.specialization.toLowerCase().includes(searchTerm) ||
                collector.services.some(service => service.toLowerCase().includes(searchTerm))
            );
        }
        
        this.renderCollectors();
        this.updateStats();
    }

    updateStats() {
        const totalElement = document.getElementById('total-collectors');
        const verifiedElement = document.getElementById('verified-collectors');
        const countriesElement = document.getElementById('countries-covered');
        
        if (totalElement) {
            totalElement.textContent = this.filteredCollectors.length;
        }
        
        if (verifiedElement) {
            const verifiedCount = this.filteredCollectors.filter(c => c.verification.verified).length;
            verifiedElement.textContent = verifiedCount;
        }
        
        if (countriesElement) {
            const uniqueCountries = new Set(this.filteredCollectors.map(c => c.country));
            countriesElement.textContent = uniqueCountries.size;
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('collector-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCollectors(e.target.value);
            });
        }
        
        // Filter controls
        const countryFilter = document.getElementById('filter-country');
        const specializationFilter = document.getElementById('filter-specialization');
        const ratingFilter = document.getElementById('filter-rating');
        
        if (countryFilter) {
            countryFilter.addEventListener('change', (e) => {
                this.currentFilters.country = e.target.value;
                this.filterCollectors();
            });
        }
        
        if (specializationFilter) {
            specializationFilter.addEventListener('change', (e) => {
                this.currentFilters.specialization = e.target.value;
                this.filterCollectors();
            });
        }
        
        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => {
                this.currentFilters.rating = e.target.value;
                this.filterCollectors();
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    clearFilters() {
        this.currentFilters = {
            country: '',
            specialization: '',
            rating: ''
        };
        
        // Reset filter controls
        const countryFilter = document.getElementById('filter-country');
        const specializationFilter = document.getElementById('filter-specialization');
        const ratingFilter = document.getElementById('filter-rating');
        const searchInput = document.getElementById('collector-search');
        
        if (countryFilter) countryFilter.value = '';
        if (specializationFilter) specializationFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        if (searchInput) searchInput.value = '';
        
        this.filteredCollectors = [...this.collectors];
        this.renderCollectors();
        this.updateStats();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="notification-content">${message}</div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    // Method to get all collectors
    getAllCollectors() {
        return this.collectors;
    }

    // Method to get verified collectors only
    getVerifiedCollectors() {
        return this.collectors.filter(c => c.verification.verified);
    }

    // Method to get collectors by country
    getCollectorsByCountry(country) {
        return this.collectors.filter(c => c.country === country);
    }
}

// Initialize collectors system
const collectorsSystem = new CollectorsSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = collectorsSystem;
}