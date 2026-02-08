'use strict';

// Country isolation and dashboard system for M-Pesewa
class CountrySystem {
    constructor() {
        this.countries = [];
        this.countryStats = {};
        this.currentCountry = null;
        this.init();
    }

    async init() {
        await this.loadCountries();
        await this.loadCountryStats();
        this.setupEventListeners();
        this.setCurrentCountry();
        this.renderCountrySelector();
        this.renderCountryStats();
    }

    async loadCountries() {
        try {
            const response = await fetch('../data/countries.json');
            this.countries = await response.json();
        } catch (error) {
            console.error('Failed to load countries:', error);
            this.countries = this.getDefaultCountries();
        }
    }

    getDefaultCountries() {
        return [
            {
                id: 'KE',
                name: 'Kenya',
                code: 'KE',
                currency: 'KSh',
                currencySymbol: 'KSh',
                flag: '🇰🇪',
                language: 'en',
                languages: ['en', 'sw'],
                timezone: 'Africa/Nairobi',
                phoneCode: '+254',
                contact: {
                    email: 'kenya@mpesewa.com',
                    phone: '+254 709 219 000',
                    address: 'Nairobi, Kenya'
                },
                limits: {
                    minLoan: 50,
                    maxLoan: 50000
                }
            },
            {
                id: 'UG',
                name: 'Uganda',
                code: 'UG',
                currency: 'UGX',
                currencySymbol: 'UGX',
                flag: '🇺🇬',
                language: 'en',
                languages: ['en', 'sw'],
                timezone: 'Africa/Kampala',
                phoneCode: '+256',
                contact: {
                    email: 'uganda@mpesewa.com',
                    phone: '+256 392 175 546',
                    address: 'Kampala, Uganda'
                },
                limits: {
                    minLoan: 1000,
                    maxLoan: 50000000
                }
            },
            {
                id: 'TZ',
                name: 'Tanzania',
                code: 'TZ',
                currency: 'TZS',
                currencySymbol: 'TZS',
                flag: '🇹🇿',
                language: 'sw',
                languages: ['sw', 'en'],
                timezone: 'Africa/Dar_es_Salaam',
                phoneCode: '+255',
                contact: {
                    email: 'tanzania@mpesewa.com',
                    phone: '+255 659 073 010',
                    address: 'Dar es Salaam, Tanzania'
                },
                limits: {
                    minLoan: 1000,
                    maxLoan: 5000000
                }
            },
            {
                id: 'RW',
                name: 'Rwanda',
                code: 'RW',
                currency: 'RWF',
                currencySymbol: 'RWF',
                flag: '🇷🇼',
                language: 'en',
                languages: ['en', 'fr', 'rw'],
                timezone: 'Africa/Kigali',
                phoneCode: '+250',
                contact: {
                    email: 'rwanda@mpesewa.com',
                    phone: '+250 791 590 801',
                    address: 'Kigali, Rwanda'
                },
                limits: {
                    minLoan: 100,
                    maxLoan: 500000
                }
            },
            {
                id: 'BI',
                name: 'Burundi',
                code: 'BI',
                currency: 'BIF',
                currencySymbol: 'BIF',
                flag: '🇧🇮',
                language: 'fr',
                languages: ['fr', 'rn'],
                timezone: 'Africa/Bujumbura',
                phoneCode: '+257',
                contact: {
                    email: 'burundi@mpesewa.com',
                    phone: '+257 79 000 000',
                    address: 'Bujumbura, Burundi'
                },
                limits: {
                    minLoan: 1000,
                    maxLoan: 1000000
                }
            },
            {
                id: 'SO',
                name: 'Somalia',
                code: 'SO',
                currency: 'SOS',
                currencySymbol: 'SOS',
                flag: '🇸🇴',
                language: 'so',
                languages: ['so', 'ar', 'en'],
                timezone: 'Africa/Mogadishu',
                phoneCode: '+252',
                contact: {
                    email: 'somalia@mpesewa.com',
                    phone: '+252 63 0000000',
                    address: 'Mogadishu, Somalia'
                },
                limits: {
                    minLoan: 1000,
                    maxLoan: 1000000
                }
            },
            {
                id: 'SS',
                name: 'South Sudan',
                code: 'SS',
                currency: 'SSP',
                currencySymbol: 'SSP',
                flag: '🇸🇸',
                language: 'en',
                languages: ['en', 'ar'],
                timezone: 'Africa/Juba',
                phoneCode: '+211',
                contact: {
                    email: 'southsudan@mpesewa.com',
                    phone: '+211 977 000000',
                    address: 'Juba, South Sudan'
                },
                limits: {
                    minLoan: 100,
                    maxLoan: 500000
                }
            },
            {
                id: 'ET',
                name: 'Ethiopia',
                code: 'ET',
                currency: 'ETB',
                currencySymbol: 'ETB',
                flag: '🇪🇹',
                language: 'am',
                languages: ['am', 'en', 'om'],
                timezone: 'Africa/Addis_Ababa',
                phoneCode: '+251',
                contact: {
                    email: 'ethiopia@mpesewa.com',
                    phone: '+251 91 000 0000',
                    address: 'Addis Ababa, Ethiopia'
                },
                limits: {
                    minLoan: 10,
                    maxLoan: 50000
                }
            },
            {
                id: 'CD',
                name: 'DRC',
                code: 'CD',
                currency: 'CDF',
                currencySymbol: 'CDF',
                flag: '🇨🇩',
                language: 'fr',
                languages: ['fr', 'ln', 'sw'],
                timezone: 'Africa/Kinshasa',
                phoneCode: '+243',
                contact: {
                    email: 'drc@mpesewa.com',
                    phone: '+243 81 000 0000',
                    address: 'Kinshasa, DRC'
                },
                limits: {
                    minLoan: 1000,
                    maxLoan: 500000
                }
            },
            {
                id: 'NG',
                name: 'Nigeria',
                code: 'NG',
                currency: 'NGN',
                currencySymbol: '₦',
                flag: '🇳🇬',
                language: 'en',
                languages: ['en', 'ha', 'yo', 'ig'],
                timezone: 'Africa/Lagos',
                phoneCode: '+234',
                contact: {
                    email: 'nigeria@mpesewa.com',
                    phone: '+234 800 000 0000',
                    address: 'Lagos, Nigeria'
                },
                limits: {
                    minLoan: 100,
                    maxLoan: 500000
                }
            },
            {
                id: 'ZA',
                name: 'South Africa',
                code: 'ZA',
                currency: 'ZAR',
                currencySymbol: 'R',
                flag: '🇿🇦',
                language: 'en',
                languages: ['en', 'af', 'zu', 'xh'],
                timezone: 'Africa/Johannesburg',
                phoneCode: '+27',
                contact: {
                    email: 'southafrica@mpesewa.com',
                    phone: '+27 11 000 0000',
                    address: 'Johannesburg, South Africa'
                },
                limits: {
                    minLoan: 10,
                    maxLoan: 50000
                }
            },
            {
                id: 'GH',
                name: 'Ghana',
                code: 'GH',
                currency: 'GHS',
                currencySymbol: '₵',
                flag: '🇬🇭',
                language: 'en',
                languages: ['en', 'ak', 'ee', 'tw'],
                timezone: 'Africa/Accra',
                phoneCode: '+233',
                contact: {
                    email: 'ghana@mpesewa.com',
                    phone: '+233 24 000 0000',
                    address: 'Accra, Ghana'
                },
                limits: {
                    minLoan: 5,
                    maxLoan: 50000
                }
            }
        ];
    }

    async loadCountryStats() {
        try {
            const response = await fetch('../data/demo-groups.json');
            const groups = await response.json();
            
            const usersResponse = await fetch('../data/demo-users.json');
            const users = await usersResponse.json();
            
            // Calculate stats per country
            this.countryStats = {};
            
            // Initialize all countries
            this.countries.forEach(country => {
                this.countryStats[country.id] = {
                    groups: 0,
                    lenders: 0,
                    borrowers: 0,
                    totalLoans: 0,
                    activeLoans: 0,
                    totalAmount: 0,
                    repaymentRate: 0
                };
            });
            
            // Count groups per country
            groups.forEach(group => {
                if (this.countryStats[group.countryCode]) {
                    this.countryStats[group.countryCode].groups++;
                }
            });
            
            // Count users per country
            users.forEach(user => {
                if (user.country && this.countryStats[user.country]) {
                    if (user.role === 'lender') {
                        this.countryStats[user.country].lenders++;
                    } else if (user.role === 'borrower') {
                        this.countryStats[user.country].borrowers++;
                    }
                }
            });
            
            // Calculate repayment rates and loan amounts
            this.countries.forEach(country => {
                const stats = this.countryStats[country.id];
                
                // Simulate some loan data
                stats.totalLoans = Math.floor(Math.random() * 1000) + 100;
                stats.activeLoans = Math.floor(stats.totalLoans * 0.3);
                stats.totalAmount = stats.totalLoans * (Math.random() * 50000 + 1000);
                stats.repaymentRate = 95 + Math.random() * 4; // 95-99%
                
                // Enforce hierarchy: borrowers > lenders > groups
                if (stats.borrowers <= stats.lenders) {
                    stats.borrowers = stats.lenders + Math.floor(Math.random() * 100) + 10;
                }
                if (stats.lenders <= stats.groups) {
                    stats.lenders = stats.groups + Math.floor(Math.random() * 20) + 5;
                }
            });
            
        } catch (error) {
            console.error('Failed to load country stats:', error);
            this.generateDemoCountryStats();
        }
    }

    generateDemoCountryStats() {
        this.countryStats = {};
        
        this.countries.forEach(country => {
            const groups = Math.floor(Math.random() * 50) + 10;
            const lenders = groups + Math.floor(Math.random() * 20) + 5;
            const borrowers = lenders + Math.floor(Math.random() * 100) + 50;
            const totalLoans = Math.floor(Math.random() * 1000) + 100;
            
            this.countryStats[country.id] = {
                groups: groups,
                lenders: lenders,
                borrowers: borrowers,
                totalLoans: totalLoans,
                activeLoans: Math.floor(totalLoans * 0.3),
                totalAmount: totalLoans * (Math.random() * 50000 + 1000),
                repaymentRate: 95 + Math.random() * 4
            };
        });
    }

    setCurrentCountry() {
        // Get country from URL or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        let countryCode = urlParams.get('country');
        
        if (!countryCode) {
            countryCode = localStorage.getItem('userCountry');
        }
        
        if (countryCode) {
            this.currentCountry = this.countries.find(c => c.code === countryCode || c.id === countryCode);
        }
        
        // Default to first country if none set
        if (!this.currentCountry && this.countries.length > 0) {
            this.currentCountry = this.countries[0];
        }
        
        // Save to localStorage if we have a user
        if (this.currentCountry && localStorage.getItem('userId')) {
            localStorage.setItem('userCountry', this.currentCountry.code);
        }
    }

    renderCountrySelector() {
        const selector = document.getElementById('country-selector');
        if (!selector) return;

        let html = '<option value="">Select Country</option>';
        
        this.countries.forEach(country => {
            const selected = this.currentCountry && this.currentCountry.code === country.code ? 'selected' : '';
            html += `<option value="${country.code}" ${selected}>${country.flag} ${country.name}</option>`;
        });
        
        selector.innerHTML = html;
        
        // Add event listener
        selector.addEventListener('change', (e) => {
            this.selectCountry(e.target.value);
        });
    }

    selectCountry(countryCode) {
        const country = this.countries.find(c => c.code === countryCode);
        if (!country) return;

        this.currentCountry = country;
        
        // Save selection
        localStorage.setItem('userCountry', country.code);
        
        // Update URL if we're on a country page
        if (window.location.pathname.includes('/countries/')) {
            const newUrl = `${window.location.pathname}?country=${country.code}`;
            window.history.replaceState({}, '', newUrl);
        }
        
        // Update stats display
        this.renderCountryStats();
        
        // Dispatch event for other components to listen to
        window.dispatchEvent(new CustomEvent('countryChanged', { detail: country }));
        
        // Show notification
        this.showNotification(`Switched to ${country.name}`, 'success');
    }

    renderCountryStats() {
        // Update main country dashboard
        this.renderCountryDashboard();
        
        // Update country cards on overview page
        this.renderCountryCards();
        
        // Update currency converter
        this.updateCurrencyConverter();
    }

    renderCountryDashboard() {
        if (!this.currentCountry) return;

        const stats = this.countryStats[this.currentCountry.code] || {};
        
        // Update dashboard elements
        const elements = {
            'country-name': this.currentCountry.name,
            'country-flag': this.currentCountry.flag,
            'country-currency': this.currentCountry.currency,
            'total-groups': stats.groups || 0,
            'active-lenders': stats.lenders || 0,
            'active-borrowers': stats.borrowers || 0,
            'total-loans': stats.totalLoans || 0,
            'active-loans': stats.activeLoans || 0,
            'total-amount': stats.totalAmount ? this.formatCurrency(stats.totalAmount, this.currentCountry.currency) : '0',
            'repayment-rate': stats.repaymentRate ? `${stats.repaymentRate.toFixed(1)}%` : '0%'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'country-flag') {
                    element.textContent = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        // Update hierarchy validation display
        this.renderHierarchyValidation(stats);
    }

    renderHierarchyValidation(stats) {
        const container = document.getElementById('hierarchy-validation');
        if (!container) return;

        const borrowers = stats.borrowers || 0;
        const lenders = stats.lenders || 0;
        const groups = stats.groups || 0;
        
        const isValid = borrowers > lenders && lenders > groups;
        
        container.innerHTML = `
            <div class="alert ${isValid ? 'alert-success' : 'alert-danger'}">
                <div class="alert-icon">${isValid ? '✓' : '⚠'}</div>
                <div class="alert-content">
                    <div class="alert-title">Hierarchy Validation</div>
                    <p>
                        Borrowers (${borrowers}) ${borrowers > lenders ? '>' : '≤'} 
                        Lenders (${lenders}) ${lenders > groups ? '>' : '≤'} 
                        Groups (${groups})
                    </p>
                    <p class="text-sm mt-1">
                        ${isValid ? 'Hierarchy rule is maintained.' : 'Warning: Hierarchy rule violation detected.'}
                    </p>
                </div>
            </div>
        `;
    }

    renderCountryCards() {
        const container = document.getElementById('countries-grid');
        if (!container) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">';
        
        this.countries.forEach(country => {
            const stats = this.countryStats[country.code] || {};
            const isCurrent = this.currentCountry && this.currentCountry.code === country.code;
            
            html += `
                <div class="card country-card ${isCurrent ? 'border-primary border-2' : ''}" data-country="${country.code}">
                    <div class="card-header">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">${country.flag}</span>
                                <div>
                                    <h3 class="card-title">${country.name}</h3>
                                    <p class="card-subtitle">${country.currency} (${country.code})</p>
                                </div>
                            </div>
                            ${isCurrent ? '<span class="badge badge-primary">Current</span>' : ''}
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-primary">${stats.groups || 0}</div>
                                <div class="text-sm text-muted">Groups</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-success">${stats.lenders || 0}</div>
                                <div class="text-sm text-muted">Lenders</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-warning">${stats.borrowers || 0}</div>
                                <div class="text-sm text-muted">Borrowers</div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-danger">${stats.repaymentRate ? stats.repaymentRate.toFixed(1) + '%' : '0%'}</div>
                                <div class="text-sm text-muted">Repayment</div>
                            </div>
                        </div>
                        
                        <div class="mt-4">
                            <div class="flex justify-between text-sm">
                                <span class="text-muted">Active Loans:</span>
                                <span class="font-semibold">${stats.activeLoans || 0}</span>
                            </div>
                            <div class="flex justify-between text-sm mt-1">
                                <span class="text-muted">Total Amount:</span>
                                <span class="font-semibold">${stats.totalAmount ? this.formatCurrency(stats.totalAmount, country.currency) : '0'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline w-full" onclick="countrySystem.viewCountry('${country.code}')">
                            View Dashboard
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    viewCountry(countryCode) {
        const country = this.countries.find(c => c.code === countryCode);
        if (!country) return;

        // Navigate to country page
        window.location.href = `../pages/countries/${countryCode.toLowerCase()}.html`;
    }

    updateCurrencyConverter() {
        if (!this.currentCountry) return;

        const converter = document.getElementById('currency-converter');
        if (!converter) return;

        // Simple conversion rates (in real app, fetch from API)
        const rates = {
            'KSh': 0.0078,  // 1 KSh = 0.0078 USD
            'UGX': 0.00027,
            'TZS': 0.00043,
            'RWF': 0.00081,
            'BIF': 0.00036,
            'SOS': 0.0017,
            'SSP': 0.0059,
            'ETB': 0.018,
            'CDF': 0.00041,
            'NGN': 0.00067,
            'ZAR': 0.054,
            'GHS': 0.083
        };

        const rate = rates[this.currentCountry.currency] || 1;
        
        converter.innerHTML = `
            <div class="bg-light rounded-lg p-4">
                <h4 class="font-semibold mb-3">Currency Converter</h4>
                <div class="space-y-3">
                    <div class="flex items-center gap-2">
                        <div class="flex-1">
                            <input type="number" id="local-amount" class="form-control" placeholder="Amount" value="1000">
                        </div>
                        <div class="w-20">
                            <div class="form-control text-center">${this.currentCountry.currency}</div>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl">⇅</div>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="flex-1">
                            <input type="number" id="usd-amount" class="form-control" placeholder="Amount" value="${(1000 * rate).toFixed(2)}" readonly>
                        </div>
                        <div class="w-20">
                            <div class="form-control text-center">USD</div>
                        </div>
                    </div>
                    <div class="text-center text-sm text-muted mt-2">
                        1 ${this.currentCountry.currency} = ${rate.toFixed(6)} USD
                    </div>
                </div>
            </div>
        `;

        // Add event listener for conversion
        const localInput = document.getElementById('local-amount');
        const usdInput = document.getElementById('usd-amount');

        if (localInput) {
            localInput.addEventListener('input', () => {
                const localAmount = parseFloat(localInput.value) || 0;
                usdInput.value = (localAmount * rate).toFixed(2);
            });
        }
    }

    formatCurrency(amount, currency) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        return formatter.format(amount);
    }

    setupEventListeners() {
        // Language toggle
        const langToggle = document.getElementById('language-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Country change events
        window.addEventListener('countryChanged', (event) => {
            this.currentCountry = event.detail;
            this.renderCountryStats();
        });
    }

    toggleLanguage() {
        if (!this.currentCountry) return;

        const currentLang = localStorage.getItem('language') || this.currentCountry.language;
        const availableLangs = this.currentCountry.languages || ['en'];
        
        // Find next language
        const currentIndex = availableLangs.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % availableLangs.length;
        const nextLang = availableLangs[nextIndex];
        
        // Save preference
        localStorage.setItem('language', nextLang);
        
        // Show notification
        this.showNotification(`Language switched to ${this.getLanguageName(nextLang)}`, 'success');
        
        // In a real app, this would trigger a page reload or content update
        // For now, just update the toggle button
        const toggleBtn = document.getElementById('language-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.getLanguageFlag(nextLang) + ' ' + nextLang.toUpperCase();
        }
    }

    getLanguageName(code) {
        const names = {
            'en': 'English',
            'fr': 'French',
            'sw': 'Swahili',
            'am': 'Amharic',
            'so': 'Somali',
            'ar': 'Arabic',
            'rw': 'Kinyarwanda',
            'rn': 'Kirundi',
            'ln': 'Lingala',
            'ha': 'Hausa',
            'yo': 'Yoruba',
            'ig': 'Igbo',
            'af': 'Afrikaans',
            'zu': 'Zulu',
            'xh': 'Xhosa',
            'ak': 'Akan',
            'ee': 'Ewe',
            'tw': 'Twi'
        };
        
        return names[code] || code.toUpperCase();
    }

    getLanguageFlag(code) {
        const flags = {
            'en': '🇺🇸',
            'fr': '🇫🇷',
            'sw': '🇹🇿',
            'am': '🇪🇹',
            'so': '🇸🇴',
            'ar': '🇸🇦',
            'rw': '🇷🇼',
            'rn': '🇧🇮',
            'ln': '🇨🇩',
            'ha': '🇳🇬',
            'yo': '🇳🇬',
            'ig': '🇳🇬',
            'af': '🇿🇦',
            'zu': '🇿🇦',
            'xh': '🇿🇦',
            'ak': '🇬🇭',
            'ee': '🇬🇭',
            'tw': '🇬🇭'
        };
        
        return flags[code] || '🌐';
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

    // Method to get current country
    getCurrentCountry() {
        return this.currentCountry;
    }

    // Method to get country by code
    getCountry(countryCode) {
        return this.countries.find(c => c.code === countryCode);
    }

    // Method to validate country isolation
    validateCountryIsolation(userCountry, targetCountry) {
        return userCountry === targetCountry;
    }

    // Method to get all countries
    getAllCountries() {
        return this.countries;
    }
}

// Initialize country system
const countrySystem = new CountrySystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = countrySystem;
}
// In countries.js - validate country stats
validateCountryStats(country) {
  const stats = country.stats;
  if (stats.activeBorrowers <= stats.activeLenders) {
    console.error(`Country ${country.name}: Borrowers (${stats.activeBorrowers}) must be greater than Lenders (${stats.activeLenders})`);
    return false;
  }
  if (stats.activeLenders <= stats.totalGroups) {
    console.error(`Country ${country.name}: Lenders (${stats.activeLenders}) must be greater than Groups (${stats.totalGroups})`);
    return false;
  }
  return true;
  
}