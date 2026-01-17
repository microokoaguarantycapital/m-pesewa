# M-Pesewa Progressive Web App (PWA)

![M-Pesewa Logo](assets/images/logo.svg)

**Emergency support from people you trust.**  
Borrow or lend short-term emergency loans inside verified groups across Africa.

## 🌍 Overview

M-Pesewa is a frontend-only Progressive Web App (PWA) that enables emergency micro-lending within trusted social groups across 13 African countries. The platform manages trust, reputation, and visibility—not funds—with all monetary transactions occurring off-platform via M-Pesa, Till numbers, Paybill, or direct bank transfers.

### Core Philosophy
- **Emergency consumption loans only**
- **Friends lend to friends inside trusted groups**
- **Platform earns only from lender subscriptions**
- **Strong reputation and blacklist enforcement**
- **No cross-country or cross-group lending**

## 🚀 Live Demo

Deployed on GitHub Pages:  
👉 **https://microokoaguarantycapital.github.io/m-pesewa/**

## 🏗️ Project Structure
/
├── index.html # Main landing page
├── manifest.json # PWA manifest
├── service-worker.js # PWA service worker
├── README.md # This file
├── .nojekyll # Disable Jekyll processing
├── assets/
│ ├── css/ # All stylesheets
│ ├── js/ # All JavaScript files
│ └── images/ Icons, flags, logos
├── pages/ # All HTML pages
│ ├── dashboard/ # Role-specific dashboards
│ ├── countries/ # Country-specific pages
│ └── *.html # Core feature pages
└── data/ # Static JSON data files

text

## 🎯 Key Features

### 1. **Trust-Based Hierarchy**
Global → Country → Groups → Lenders → Borrowers (Ledgers)

text
- **Country Isolation**: No cross-border transactions
- **Group Isolation**: Lenders can only lend within their group
- **Borrower Limits**: Maximum 4 groups (good rating required)
- **Subscription Gating**: Lenders blocked when subscription expires (28th monthly)
- **Admin Supremacy**: Platform admin can override any blacklist or ledger

### 2. **20 Emergency Loan Categories**
Floating cards on homepage for:
- 🚌 Transport Fare
- 📶 Data/Airtime
- 🔥 Cooking Gas
- 🍲 Food
- 💸 Salary Advance
- 📡 Internet/Wi-Fi
- 🛠️ Urgent Repairs (Credo)
- 🚰 Water Bills
- ⛽ Vehicle Fuel
- 🔧 Vehicle Repairs
- 💊 Medicine
- ⚡ Electricity Tokens
- 🎓 School Fees
- 📺 TV Subscription
- 🧾 Daily Sales Advance
- 🏪 Working Capital
- 🛒 Market Loans (Soko)
- 🔄 Fuliza Top-up
- 🏗️ Stall/Kibanda Loans
- 🚶♂️ Hawker/Vendor Loans

### 3. **Dual Role System**
- **Borrowers**: No subscription fees (Basic tier)
- **Lenders**: Tiered subscriptions required (Basic, Premium, Super, Lender-of-Lenders)
- **Dual Roles**: Users can be both, but require separate profiles

### 4. **Subscription Tiers (Lenders Only)**
| Tier | Weekly Limit | Monthly Fee | CRB Check | Max Ledgers |
|------|-------------|-------------|-----------|-------------|
| Basic | ≤1,500 | 50 | No | ≤1,500 |
| Premium | ≤5,000 | 250 | No | ≤10,000 |
| Super | ≤20,000 | 1,000 | Yes | ≤20,000 |
| Lender-of-Lenders | ≤50,000 | 500 | Yes | ≤50,000 |

### 5. **Loan Terms**
- **Repayment Period**: 7 days maximum
- **Interest**: 10% fixed
- **Penalty**: 5% daily after 7 days
- **Default**: After 2 months → Platform-wide blacklist
- **Partial Repayments**: Daily partial payments allowed

### 6. **Reputation & Blacklist System**
- **5-Star Rating System**: Lenders rate borrowers
- **Blacklist Trigger**: Default > 2 months
- **Platform-Wide Visibility**: Blacklisted users visible across all groups
- **Removal**: Only by admin after full repayment (principal + 10% interest + penalties)

### 7. **Additional Modules**
- **Debt Collectors Directory**: 200+ vetted profiles
- **Blacklist Registry**: Public defaulters list
- **Admin Dashboard**: Hidden, direct URL access only
- **Country-Specific Operations**: 13 African countries supported

## 🌐 Supported Countries

| Country | Currency | Code | Contact |
|---------|----------|------|---------|
| Kenya | Kenyan Shilling | KSh | +254 709 219 000 |
| Uganda | Uganda Shilling | UGX | +256 392 175 546 |
| Tanzania | Tanzanian Shilling | TZS | +255 659 073 010 |
| Rwanda | Rwanda Franc | RWF | +250 791 590 801 |
| Burundi | Burundi Franc | BIF | +257 79 000 000 |
| Somalia | Somali Shilling | SOS | +252 63 000 000 |
| South Sudan | South Sudanese Pound | SSP | +27 11 200 000 |
| Ethiopia | Ethiopian Birr | ETB | +251 91 000 000 |
| DR Congo | Congolese Franc | CDF | +243 81 000 000 |
| Nigeria | Nigerian Naira | NGN | +234 800 000 000 |
| South Africa | South African Rand | ZAR | +27 11 000 000 |
| Ghana | Ghanaian Cedi | GHS | +233 24 000 000 |
| Egypt | Egyptian Pound | EGP | +20 100 000 000 |

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, accessible structure
- **CSS3**: Vanilla CSS with CSS Variables for theming
- **JavaScript**: Vanilla ES6+ with modular architecture
- **PWA**: Service Worker, Web App Manifest, offline capability
- **Static JSON**: Demo data for all features
- **GitHub Pages**: Hosting and deployment

## 🚀 Getting Started

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/microokoaguarantycapital/m-pesewa.git
   cd m-pesewa
Open in browser

Simply open index.html in any modern browser

Or use a local server:

bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .
Access at http://localhost:8000

PWA Installation
Visit https://microokoaguarantycapital.github.io/m-pesewa/

Look for install prompt (Chrome/Edge) or

Click "Add to Home Screen" in browser menu (Safari)

📱 PWA Features
Installable: Add to home screen like native app

Offline Capable: Works without internet connection

Fast: Cached assets for instant loading

Responsive: Mobile-first design, desktop optimized

Secure: Served over HTTPS, no backend vulnerabilities

📁 File Structure Details
/assets/css/
main.css - Global styles and typography

components.css - Reusable UI components

dashboard.css - Dashboard-specific styles

forms.css - Form styling and validation

tables.css - Responsive table layouts

animations.css - Transitions and floating effects

/assets/js/
app.js - Main application logic and routing

auth.js - UI-only authentication simulation

roles.js - Role management and switching

groups.js - Group creation and management

lending.js - Lending functionality

borrowing.js - Borrowing functionality

ledger.js - Ledger management

blacklist.js - Blacklist system

subscriptions.js - Subscription management

countries.js - Country isolation logic

collectors.js - Debt collectors directory

calculator.js - Loan calculator with interest

pwa.js - Install and offline handling

utils.js - Utility functions

/data/
countries.json - 13 country configurations

subscriptions.json - 4 subscription tiers

categories.json - 20 loan categories

collectors.json - 200+ debt collector profiles

demo-groups.json - Sample group data

demo-users.json - Sample user profiles

demo-ledgers.json - Sample ledger entries

/pages/
Core Pages: about.html, qa.html, contact.html

Feature Pages: lending.html, borrowing.html, ledger.html, subscriptions.html, blacklist.html, debt-collectors.html

Country Pages: countries/[country].html (13 countries)

Dashboard Pages: dashboard/borrower-dashboard.html, dashboard/lender-dashboard.html, dashboard/admin-dashboard.html

🎨 Design System
Color Palette (Non-negotiable)
Primary Blue: #1E3A8A → #1F3C88 (Navigation, CTAs)

Secondary Green: #16A34A → #22C55E (Success, positive)

CTA Orange: #F59E0B →