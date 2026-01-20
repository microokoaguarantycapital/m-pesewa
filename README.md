# M-PESEWA - Emergency Micro-Lending Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Enabled-brightgreen.svg)](https://web.dev/progressive-web-apps/)
[![Responsive](https://img.shields.io/badge/Responsive-Yes-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive)

M-PESEWA is a fintech micro-lending platform that enables emergency loans within trusted groups and countries. The platform follows a strict hierarchy (Global → Country → Groups → Lenders → Borrowers) and operates without holding money.

## 🌟 Features

- **Group-Based Lending**: Lend only to people you know within trusted groups
- **Country Isolation**: No cross-country lending or borrowing
- **Subscription Model**: Lenders pay subscriptions, borrowers use for free
- **Off-Platform Transactions**: M-PESEWA never holds money
- **Professional Ledger System**: i2iFunding-inspired ledger management
- **PWA Ready**: Installable, works offline, fast loading
- **Responsive Design**: Mobile-first approach for all devices

## 🏗️ Architecture

### Project Structure

/
├── index.html # Public landing page
├── manifest.json # PWA manifest
├── service-worker.js # Offline support
├── README.md
├── .nojekyll
├── assets/
│ ├── css/
│ │ ├── main.css # Global typography, layout, responsive
│ │ ├── components.css # Buttons, cards, modals, badges
│ │ ├── dashboard.css # Dashboard-specific styling
│ │ ├── forms.css # Forms, inputs, validations
│ │ ├── tables.css # Data tables
│ │ └── animations.css # Animations & transitions
│ ├── js/
│ │ ├── app.js # Core application logic
│ │ ├── pwa.js # PWA installation & offline features
│ │ ├── utils.js # Utility functions
│ │ ├── auth.js # Authentication (UI only)
│ │ ├── roles.js # Role-based access control
│ │ └── groups.js # Group management
│ ├── images/ # All icons, logos, illustrations
│ └── fonts/
├── pages/
│ ├── dashboard/
│ │ ├── borrower-dashboard.html
│ │ ├── lender-dashboard.html
│ │ └── admin-dashboard.html
│ ├── lending.html # Lending interface
│ ├── ledger.html # Ledger management
│ └── settings.html # User settings
└── components/
├── header.html # Header component
├── footer.html # Footer component
├── navbar.html # Navigation component
├── card.html # Card component
└── modal.html # Modal component

text

### User Roles
1. **Borrowers**: Can borrow emergency loans (max 4 groups, good rating required)
2. **Lenders**: Must have active subscription, lend within groups only
3. **Group Admins**: Manage group members and invitations
4. **Platform Admins**: Override ledgers, manage blacklist (separate system)

### System Rules
- Maximum 4 loans per borrower across groups
- 7-day loan tenure with 10% interest
- 5% daily penalty after 7 days
- Default after 2 months → Global blacklist
- Subscription expiry on 28th of each month
- No cross-country or cross-group lending

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server for local development (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/m-pesewa-frontend.git
   cd m-pesewa-frontend
Local Development

Option A: Use a local web server

bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
Option B: Open index.html directly in browser

Build for Production

No build step required! This is a static PWA

Deploy the entire folder structure to any static hosting

Deployment
GitHub Pages
Push code to GitHub repository

Go to repository Settings → Pages

Select branch (usually main) and folder (/root)

Site will be available at https://username.github.io/repository

Netlify
Drag and drop folder to Netlify

Site will be deployed instantly

Enable HTTPS and custom domain

Firebase Hosting