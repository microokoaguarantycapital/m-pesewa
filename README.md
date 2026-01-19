<!-- FILE: README.md -->
# M-Pesewa PWA Frontend

Emergency micro-lending platform built around trusted social groups. This is the complete, production-grade frontend Progressive Web App for M-Pesewa.

## 🌍 Platform Overview

M-Pesewa is an emergency micro-lending platform that enables individuals within the same country and trusted social group to lend and borrow short-term consumption loans. The platform manages trust, reputation, and structure—not money.

## 🚀 Key Features

### Core Hierarchy
- **Global** → **Countries (13)** → **Groups (unlimited)** → **Lenders** → **Borrowers/Ledgers**
- Borrowers must outnumber lenders in every group
- No cross-country lending
- No cross-group lending
- One active loan per group per borrower
- Max 4 groups per borrower (rating-dependent)

### User Roles
- **Borrower**: Default state, no subscription required for basic access
- **Lender**: Subscription-gated access (Basic, Premium, Super, Lender-of-Lenders tiers)
- **Group Admin**: Founder who mobilizes, invites, and moderates group members
- **Platform Admin**: Hidden, outside hierarchy (direct URL access only)

### Trust Architecture
- Referral-only entry with 2 guarantors mandatory
- 5-star borrower rating system
- Platform-wide blacklist propagation
- Debt collectors directory (200+ vetted profiles)

### Loan Terms
- Emergency consumption loans only (20 categories)
- Maximum 7-day repayment period
- 10% fixed interest per week
- 5% daily penalty after day 7
- Default after 2 months triggers blacklist

### Platform Economics
- Platform earns ONLY from lender subscriptions
- All money moves off-platform (M-Pesa, Bank, Till, Paybill)
- Borrowers pay no fees (except for higher UI tiers)
- Subscription expiry on 28th of each month

## 📁 Project Structure
/
├── index.html # Homepage
├── manifest.json # PWA manifest
├── service-worker.js # Service worker for offline support
├── .nojekyll # GitHub Pages config
├── README.md # This file
├── assets/ # Static assets
│ ├── css/ # Stylesheets
│ ├── js/ # JavaScript modules
│ └── img/ # Images and icons
└── pages/ # Application pages
├── about.html # About page
├── auth.html # Authentication
├── borrowing.html # Borrower listing
├── lending.html # Lender dashboard
├── ledger.html # Ledger management
├── groups.html # Groups directory
├── subscriptions.html # Subscription tiers
├── blacklist.html # Blacklist registry
├── debt-collectors.html # Debt collectors directory
├── qa.html # FAQ page
├── contact.html # Contact page
├── terms.html # Terms & Conditions
├── privacy.html # Privacy Policy
├── dashboard/ # User dashboards
│ ├── borrower-dashboard.html
│ ├── lender-dashboard.html
│ └── admin-dashboard.html
└── countries/ # Country-specific pages
├── index.html
├── kenya.html
├── uganda.html
├── tanzania.html
└── ... (13 countries)

text

## 🛠️ Technical Requirements

### PWA Features
- Installable on mobile and desktop
- Offline support via service worker
- Fast loading with asset caching
- Mobile-first responsive design
- Sticky header and footer

### UI/UX Benchmark
- Visual design benchmarked against i2ifunding.com
- Exact color palette, spacing, and typography
- Table layouts and borrower listing structure
- Filters, chips, pagination components
- Desktop-to-mobile responsive behavior

### Frontend Validation
- Registration form validation
- Loan calculator with accurate math
- Subscription tier enforcement
- Country and role locking
- Blacklist propagation logic

## 🌐 Supported Countries (13)

1. Kenya (KSh) - +254709219000
2. Uganda (UGX) - +256392175546
3. Tanzania (TZS) - +255659073010
4. Rwanda (RWF) - +250791590801
5. Burundi (BIF) - +25779000000
6. Somalia (SOS) - +252630000000
7. South Sudan (SSP) - +27112000000
8. Ethiopia (ETB) - +25191000000
9. DRC (CDF) - +243810000000
10. Nigeria (NGN) - +2348000000000
11. Ghana (GHS) - +233240000000
12. South Africa (ZAR) - +27110000000

## 🔧 Development Setup

1. Clone the repository
2. Serve files using a local web server
3. Access via HTTPS for PWA features
4. Deploy to GitHub Pages for production

## 📊 Success Metrics

- Target repayment rate: 99%
- Defaults: <1%
- Growth in trusted groups
- Increased lender participation
- Improved emergency access for communities

## ⚠️ Important Disclaimers

- M-Pesewa is NOT a bank, NOT a lender, and does NOT hold user funds
- All money transfers happen directly between users off-platform
- Platform liability is limited to trust infrastructure only
- Use of platform is at user's own risk

## 📞 Contact

- General Inquiries: info@m-pesewa.com
- Support: support@mpesewa.com
- Legal: legal@mpesewa.com

---

**Last Updated:** January 17, 2026  
**Version:** 1.0.0