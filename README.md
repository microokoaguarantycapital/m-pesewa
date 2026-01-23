# 🏦 M-Pesewa | Emergency Micro-Lending PWA

![M-Pesewa Logo](https://m-pesewa.com/assets/images/logos/logo-512x512.png)

**Trust-based emergency micro-lending platform for African communities**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-✓-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue.svg)](https://pages.github.com/)
[![Africa Focus](https://img.shields.io/badge/Focus-Africa%2013%20countries-orange.svg)](https://m-pesewa.com/countries.html)

## 🌟 Overview

M-Pesewa is a Progressive Web App (PWA) for emergency micro-lending within trusted circles across Africa. The platform enables individuals to lend and borrow small amounts for emergency consumption needs through verified, trusted groups.

### 🎯 Core Philosophy
- **Emergency consumption loans only** (no business capital, no investments)
- **Friends lend to friends** inside trusted groups
- **Platform earns only from lender subscriptions** (borrowers pay nothing)
- **All loans happen OFF-PLATFORM** (M-Pesa, Till, Paybill, Bank transfers)
- **Platform manages trust, reputation, and structure only**

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 72+, Safari 13+)
- GitHub account for deployment
- Basic understanding of HTML/CSS/JavaScript

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/m-pesewa-pwa.git

# Navigate to project directory
cd m-pesewa-pwa

# Install live server (if not installed)
npm install -g live-server

# Start local server
live-server --port=8080

📱 PWA Features
✅ Progressive Enhancement
Works on any device with a web browser

Progressive enhancement for modern browsers

Fallback support for older browsers

📴 Offline Capabilities
View saved ledgers and borrower ratings offline

Prepare loan applications without internet

Automatic sync when connection restores

Background sync for pending transactions

🔔 Push Notifications
Real-time loan request notifications

Repayment reminders

Subscription expiry alerts

System announcements

📱 Installable
Install as native app on mobile/desktop

App icon on home screen

Full-screen experience

Independent window

🏗️ Project Structure
text
m-pesewa-pwa/
├── index.html                    # Main landing page
├── offline.html                  # Offline fallback page
├── 404.html                      # Page not found
├── manifest.json                 # PWA manifest
├── service-worker.js             # Service worker
├── robots.txt                    # SEO crawler rules
├── sitemap.xml                   # SEO sitemap
├── .nojekyll                     # GitHub Pages config
├── README.md                     # This file
├── LICENSE                       # MIT License
├── CHANGELOG.md                  # Version history
├── SECURITY.md                   # Security policy
├── CONTRIBUTING.md               # Contribution guidelines
├── VERSION                       # Current version
│
├── assets/                       # Static assets
│   ├── css/                      # Stylesheets
│   ├── images/                   # Images and icons
│   ├── fonts/                    # Web fonts
│   └── lottie/                   # Animations
│
├── core/                         # App bootstrapping
├── state/                        # State management
├── router/                       # Client-side routing
├── layout/                       # Layout components
├── navigation/                   # Navigation logic
├── countries/                    # Country-specific modules
├── flag-ribbon/                  # Country flag display
├── groups/                       # Groups module
├── auth/                         # Authentication
├── user/                         # User management
├── borrower/                     # Borrower module
├── lender/                       # Lender module
├── ledger/                       # Ledger system
├── subscription/                 # Subscription management
├── blacklist/                    # Blacklist system
├── admin/                        # Admin dashboard
├── global-pages/                 # Global pages
├── notifications/                # Notifications
├── sync/                         # Data synchronization
├── pwa/                          # PWA utilities
├── testing/                      # Test utilities
├── utils/                        # Utility functions
├── components/                   # UI components
├── policies/                     # Business policies
├── analytics/                    # Analytics tracking
├── i18n/                         # Internationalization
├── security/                     # Security modules
└── audit/                        # Audit logging
🎨 Design System
Color Palette
Color	Hex	Usage
Primary Blue	#003366	Headers, footers, main headings
Secondary Blue	#0099ff	Links, floating card glow
Action Orange	#f37021	Borrower buttons, Apply Now
Trust Green	#28a745	Lender sections, success indicators
Neutral Light	#f8f9fa	Section separation background
Pure White	#ffffff	Main cards, body background
Typography
Primary Font: Inter (Sans-serif)

Headings: Poppins (Sans-serif)

Base Size: 16px

Line Height: 1.5

Components
Cards: Floating with light sky blue glow (#0099ff)

Buttons: Rounded corners with appropriate contrast

Forms: Clean, accessible, with validation

Navigation: Sticky