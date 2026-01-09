# M-Pesewa - Emergency Micro-Lending Platform

![M-Pesewa Logo](assets/images/logo.svg)

M-Pesewa is a revolutionary, trust-based peer-to-peer emergency micro-lending platform built for trusted social circles across Africa. The platform enables friends, families, and professional groups to lend to one another for short-term consumption needs.

## 🌍 Platform Overview

- **Emergency consumption loans** within trusted groups
- **Country → Groups → Lenders → Borrowers** strict hierarchy
- **No cross-country or cross-group lending**
- **16 specific emergency loan categories**
- **Lender subscriptions only** - Borrowers pay no fees
- **All transactions happen off-platform** (M-Pesa, bank transfers, etc.)

## 🚀 Features

### For Borrowers
- No subscription fees
- Borrow from people you know and trust
- 16 emergency loan categories
- Up to 4 group memberships
- 10% weekly interest, 7-day repayment
- 5% daily penalty after 7 days
- Blacklist protection

### For Lenders
- 4 subscription tiers (Basic, Premium, Super, Lender of Lenders)
- Earn 10% weekly interest
- Lend within trusted groups only
- Subscription expiry on 28th of each month
- Unlimited ledgers
- Borrower rating system

### Platform Management
- Country-specific dashboards (13 African countries)
- Group management (5-1000 members)
- Blacklist system
- Debt collectors directory (200+ vetted)
- Admin override capabilities
- Real-time notifications

## 📁 Project Structure
m-pesewa/
├── index.html # Main landing page
├── manifest.json # PWA manifest
├── service-worker.js # PWA service worker
├── README.md # This file
├── .nojekyll # GitHub Pages config
├── assets/ # Static assets
│ ├── css/ # Stylesheets
│ │ ├── main.css # Global styles
│ │ ├── components.css # UI components
│ │ ├── dashboard.css # Dashboard styles
│ │ ├── forms.css # Form styles
│ │ ├── tables.css # Table styles
│ │ └── animations.css # Animations
│ ├── js/ # JavaScript files
│ │ ├── app.js # Main application logic
│ │ ├── auth.js # Authentication
│ │ ├── roles.js # Role management
│ │ ├── groups.js # Group operations
│ │ ├── lending.js # Lending logic
│ │ ├── borrowing.js # Borrowing logic
│ │ ├── ledger.js # Ledger management
│ │ ├── blacklist.js # Blacklist system
│ │ ├── subscriptions.js # Subscription handling
│ │ ├── countries.js # Country-specific logic
│ │ ├── collectors.js # Debt collectors
│ │ ├── calculator.js # Loan calculator
│ │ ├── pwa.js # PWA functionality
│ │ └── utils.js # Utility functions
│ └── images/ # Images and icons
│ ├── logo.svg # Main logo
│ ├── icons/ # App icons
│ ├── flags/ # Country flags
│ └── categories/ # Loan category icons
├── pages/ # All HTML pages
│ ├── dashboard/ # Dashboard pages
│ │ ├── borrower-dashboard.html
│ │ ├── lender-dashboard.html
│ │ └── admin-dashboard.html
│ ├── lending.html # Lending page
│ ├── borrowing.html # Borrowing page
│ ├── ledger.html # Ledger management
│ ├── groups.html # Groups management
│ ├── subscriptions.html # Subscription management
│ ├── blacklist.html # Blacklist page
│ ├── debt-collectors.html # Debt collectors directory
│ ├── about.html # About page
│ ├── qa.html # Q&A page
│ ├── contact.html # Contact page
│ └── countries/ # Country pages
│ ├── index.html # Countries overview
│ ├── kenya.html # Kenya dashboard
│ ├── uganda.html # Uganda dashboard
│ ├── tanzania.html # Tanzania dashboard
│ ├── rwanda.html # Rwanda dashboard
│ ├── burundi.html # Burundi dashboard
│ ├── somalia.html # Somalia dashboard
│ ├── south-sudan.html # South Sudan dashboard
│ ├── ethiopia.html # Ethiopia dashboard
│ ├── drc.html # DRC dashboard
│ ├── nigeria.html # Nigeria dashboard
│ ├── south-africa.html # South Africa dashboard
│ └── ghana.html # Ghana dashboard
└── data/ # Data files (mock/seed data)
├── countries.json # Country configurations
├── subscriptions.json # Subscription tiers
├── categories.json # Loan categories
├── collectors.json # Debt collectors data
├── demo-groups.json # Sample groups
├── demo-users.json # Sample users
└── demo-ledgers.json # Sample ledgers


## 🛠️ Installation & Deployment

### Prerequisites
- GitHub account
- Basic knowledge of Git

### Deploy to GitHub Pages

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/your-username/m-pesewa.git
   cd m-pesewa