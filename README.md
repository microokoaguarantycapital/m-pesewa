# M-Pesewa - Emergency Micro-Lending Platform

[![PWA](https://img.shields.io/badge/PWA-✓-512DA8.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deploy-388E3C.svg)](https://pages.github.com)

**M-Pesewa** is a revolutionary Progressive Web App (PWA) for emergency micro-lending within trusted social circles across Africa. The platform enables friends, families, and professional groups to lend and borrow for short-term consumption needs, with all transactions happening off-platform.

## 🌍 Core Philosophy

- **Emergency consumption loans** only
- **Friends lend to friends** inside trusted groups
- Platform earns **only from lender subscriptions**
- Strong reputation and **blacklist enforcement**
- **No cross-country or cross-group lending**

## 🏗️ Platform Hierarchy (STRICT)
Country → Groups → Lenders → Borrowers (Ledgers)

text

### Key Rules Enforced:
- ✅ Country isolation: No cross-border transactions
- ✅ Group isolation: Lenders cannot lend outside their group
- ✅ Borrower limits: Maximum of 4 groups, only with good rating
- ✅ Subscription gating: Lenders blocked when subscription expires (28th monthly)
- ✅ Admin supremacy: Admin can override any blacklist or ledger

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/m-pesewa.git
cd m-pesewa

Project Structure
text
/
├── index.html                      # Main landing page
├── manifest.json                   # PWA manifest
├── service-worker.js              # Service worker for offline support
├── README.md                      # This file
├── .nojekyll                      # Disable Jekyll on GitHub Pages
├── assets/
│   ├── css/                       # All stylesheets
│   │   ├── main.css              # Global styles
│   │   ├── components.css        # Reusable components
│   │   ├── dashboard.css         # Dashboard layouts
│   │   ├── forms.css             # Form styles
│   │   ├── tables.css            # Table styles
│   │   └── animations.css        # Animations & transitions
│   ├── js/                        # All JavaScript files
│   │   ├── app.js                # App bootstrap & routing
│   │   ├── auth.js               # Authentication logic
│   │   ├── roles.js              # Role-based access
│   │   ├── groups.js             # Group management
│   │   ├── lending.js            # Lender functionality
│   │   ├── borrowing.js          # Borrower functionality
│   │   ├── ledger.js             # Ledger management
│   │   ├── blacklist.js          # Blacklist system
│   │   ├── subscriptions.js      # Subscription handling
│   │   ├── countries.js          # Country isolation
│   │   ├── collectors.js         # Debt collectors
│   │   ├── calculator.js         # Loan calculator
│   │   ├── pwa.js                # PWA installation
│   │   └── utils.js              # Utility functions
│   └── images/                    # Images & icons (placeholders)
├── pages/                         # All HTML pages
│   ├── dashboard/                 # Dashboard pages
│   │   ├── borrower-dashboard.html
│   │   ├── lender-dashboard.html
│   │   └── admin-dashboard.html
│   ├── lending.html              # Lending page
│   ├── borrowing.html            # Borrowing page
│   ├── ledger.html               # Ledger management
│   ├── groups.html               # Groups page
│   ├── subscriptions.html        # Subscriptions page
│   ├── blacklist.html            # Blacklist page
│   ├── debt-collectors.html      # Debt collectors (200+)
│   ├── about.html                # About page
│   ├── qa.html                   # Q&A page
│   ├── contact.html              # Contact page
│   └── countries/                # Country-specific pages
│       ├── index.html            # Countries overview
│       ├── kenya.html            # Kenya dashboard
│       ├── uganda.html           # Uganda dashboard
│       ├── tanzania.html         # Tanzania dashboard
│       ├── rwanda.html           # Rwanda dashboard
│       ├── burundi.html          # Burundi dashboard
│       ├── somalia.html          # Somalia dashboard
│       ├── south-sudan.html      # South Sudan dashboard
│       ├── ethiopia.html         # Ethiopia dashboard
│       ├── DRC.html              # DRC dashboard
│       ├── nigeria.html          # Nigeria dashboard
│       ├── south-africa.html     # South Africa dashboard
│       └── ghana.html            # Ghana dashboard
└── data/                         # Mock data for demo
    ├── countries.json            # Country configurations
    ├── subscriptions.json        # Subscription tiers
    ├── categories.json           # 16 emergency categories
    ├── collectors.json           # 200 debt collectors
    ├── demo-groups.json          # Sample groups
    ├── demo-users.json           # Sample users
    └── demo-ledgers.json         # Sample ledgers

    🚨 Emergency Loan Categories (16)
M-pesewa Fare - Transport fees

M-pesewa Data - Airtime/data bundles

M-pesewa Cooking Gas - Cooking gas

M-pesewa Food - Food expenses

M-pesewa Advance - Salary advance

M-pesewa Wifi - Internet access

M-pesewa Credo - Urgent repairs/tools

M-pesewa Water Bill - Water bills

M-pesewa Bike/Car/Tuktuk Fuel - Vehicle fuel

M-pesewa Bike/Car/Tuktuk Repair - Vehicle repair

M-pesewa Medicine - Medical expenses

M-pesewa Electricity Tokens - Electricity tokens

M-pesewa School Fees - School fees

M-pesewa TV Subscription - TV subscriptions

M-Pesa Daily Sales Advance - Daily business advance

M-Pesa Working Capital Advance - Working capital

📊 Subscription Tiers (Lenders Only)
Tier	Max/Week	Monthly	Bi-Annual	Annual	CRB
Basic	≤ 1,500	50	250	500	No
Premium	≤ 5,000	250	1,500	2,500	No
Super	≤ 20,000	1,000	5,000	8,500	Yes
Lender of Lenders	≤ 50,000	500	3,500	6,500	Yes