# M-Pesewa - Emergency Micro-Lending Platform

![M-Pesewa Logo](assets/images/logo.svg)

**Emergency Micro-Lending in Trusted Circles** - A Progressive Web App (PWA) that enables peer-to-peer emergency micro-lending within trusted social groups across Africa.

## 🌍 Live Demo

[View Live Demo](https://yourusername.github.io/m-pesewa)

*Note: Replace with your GitHub Pages URL*

## 📱 Features

### Core Platform
- **Country → Group → Lender → Borrower Hierarchy** - Strict hierarchical isolation
- **13 African Countries** - Kenya, Uganda, Tanzania, Rwanda, Burundi, Somalia, South Sudan, Ethiopia, DRC, Nigeria, South Africa, Ghana
- **16 Emergency Categories** - Specific loan purposes from transport to business capital
- **Referral-Only Groups** - Trust-based entry with guarantor requirements
- **Dual Role System** - Be both borrower and lender
- **Subscription-Based Lending** - Lenders pay, borrowers don't (except higher tiers)

### For Borrowers
- No subscription fees for basic access
- Request loans from trusted group members
- Up to 4 groups membership (good rating required)
- 7-day repayment with 10% weekly interest
- Daily partial payments allowed
- 5-star rating system
- Blacklist protection for defaults

### For Lenders
- 4 subscription tiers (Basic, Premium, Super, Lender of Lenders)
- Earn 10% weekly interest
- Lend within trusted groups only
- Manual ledger management
- Borrower rating system
- Subscription expiry on 28th monthly

### Platform Management
- Admin dashboard for overrides
- Blacklist management (admin-only removal)
- Debt collectors directory (200+ vetted)
- Country isolation enforcement
- Cross-group/cross-country blocking

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)
- Basic understanding of HTML/CSS/JS

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/m-pesewa.git
   cd m-pesewa

   m-pesewa/
├── index.html                  # Main landing page
├── manifest.json               # PWA manifest
├── service-worker.js           # PWA service worker
├── README.md                   # This file
├── .nojekyll                   # Disable Jekyll processing
├── assets/
│   ├── css/                    # Stylesheets
│   │   ├── main.css           # Global styles
│   │   ├── components.css     # Reusable components
│   │   ├── dashboard.css      # Dashboard layouts
│   │   ├── forms.css          # Form styles
│   │   ├── tables.css         # Table styles
│   │   └── animations.css     # CSS animations
│   ├── js/                     # JavaScript files
│   │   ├── app.js             # Main application logic
│   │   ├── auth.js            # Authentication handling
│   │   ├── roles.js           # Role management
│   │   ├── groups.js          # Groups functionality
│   │   ├── lending.js         # Lending operations
│   │   ├── borrowing.js       # Borrowing operations
│   │   ├── ledger.js          # Ledger management
│   │   ├── blacklist.js       # Blacklist handling
│   │   ├── subscriptions.js   # Subscription management
│   │   ├── countries.js       # Country-specific logic
│   │   ├── collectors.js      # Debt collectors
│   │   ├── calculator.js      # Loan calculator
│   │   ├── pwa.js             # PWA functionality
│   │   └── utils.js           # Utility functions
│   └── images/                 # Images and icons
│       ├── logo.svg           # Main logo
│       ├── icons/             # PWA icons
│       ├── flags/             # Country flags
│       └── categories/        # Category icons
├── pages/                      # All page files
│   ├── dashboard/             # Dashboard pages
│   │   ├── borrower-dashboard.html
│   │   ├── lender-dashboard.html
│   │   └── admin-dashboard.html
│   ├── lending.html           # Lending interface
│   ├── borrowing.html         # Borrowing interface
│   ├── ledger.html            # Ledger management
│   ├── groups.html            # Groups management
│   ├── subscriptions.html     # Subscription management
│   ├── blacklist.html         # Blacklist view
│   ├── debt-collectors.html   # Debt collectors directory
│   ├── about.html             # About page
│   ├── qa.html                # Q&A page
│   ├── contact.html           # Contact form
│   └── countries/             # Country-specific pages
│       ├── index.html         # Countries overview
│       ├── kenya.html         # Kenya page
│       ├── uganda.html        # Uganda page
│       ├── tanzania.html      # Tanzania page
│       ├── rwanda.html        # Rwanda page
│       ├── burundi.html       # Burundi page
│       ├── somalia.html       # Somalia page
│       ├── south-sudan.html   # South Sudan page
│       ├── ethiopia.html      # Ethiopia page
│       ├── drc.html           # DRC page
│       ├── nigeria.html       # Nigeria page
│       ├── south-africa.html  # South Africa page
│       └── ghana.html         # Ghana page
└── data/                      # JSON data files
    ├── countries.json         # Country configurations
    ├── subscriptions.json     # Subscription tiers
    ├── categories.json        # Loan categories
    ├── collectors.json        # Debt collectors data
    ├── demo-groups.json       # Demo groups data
    ├── demo-users.json        # Demo users data
    └── demo-ledgers.json      # Demo ledgers data