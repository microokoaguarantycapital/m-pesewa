# M-Pesewa - Emergency Micro-Lending Platform

## Overview
M-Pesewa is a revolutionary Progressive Web App (PWA) for emergency micro-lending within trusted social circles. The platform enables friends, families, and professional groups to lend to one another for short-term consumption needs across 13 African countries.

## 🌍 Key Features
- **Trust-Based Lending**: Referral-only groups with country isolation
- **16 Emergency Categories**: Specific loan purposes from transport to medicine
- **Dual Role System**: Users can be both borrowers and lenders
- **Subscription Model**: Lenders pay subscriptions, borrowers don't
- **Blacklist System**: Platform-wide defaulters registry
- **Country Isolation**: No cross-border lending/borrowing
- **PWA Capable**: Installable, offline-ready, mobile-friendly

## 📋 Platform Hierarchy (STRICT)
Country → Groups → Lenders → Borrowers (Ledgers)

text

### Rules Enforced:
- ✅ No cross-country lending or borrowing
- ✅ No cross-group lending
- ✅ Maximum 4 groups per borrower (good rating required)
- ✅ Lenders must have active subscriptions (expire 28th monthly)
- ✅ Borrowers pay NO subscriptions
- ✅ Admin can override blacklists and ledgers

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
Serve locally (no build required):

bash
# Using Python
python3 -m http.server 8000

# Or using Node.js
npx serve .
Open in browser:

text
http://localhost:8000
🌐 GitHub Pages Deployment
Method 1: Automatic (Recommended)
Fork this repository to your GitHub account

Go to Settings → Pages

Under Source, select Deploy from a branch

Select main branch and / (root) folder

Click Save

Your site will be available at: https://yourusername.github.io/m-pesewa

Method 2: Manual Upload
Download all files from this repository

Create a new repository named m-pesewa

Upload all files to the root of the repository

Enable GitHub Pages in repository settings

📁 Project Structure
text
/
├── index.html                    # Main landing page
├── manifest.json                 # PWA manifest
├── service-worker.js            # PWA service worker
├── README.md                    # This file
├── .nojekyll                    # Disable Jekyll processing
├── assets/
│   ├── css/
│   │   ├── main.css            # Global styles
│   │   ├── components.css      # UI components
│   │   ├── dashboard.css       # Dashboard styles
│   │   ├── forms.css           # Form styles
│   │   ├── tables.css          # Table styles
│   │   └── animations.css      # Animation styles
│   ├── js/
│   │   ├── app.js              # App bootstrap & routing
│   │   ├── auth.js             # Authentication (UI only)
│   │   ├── roles.js            # Role-based logic
│   │   ├── groups.js           # Group management
│   │   ├── lending.js          # Lender actions
│   │   ├── borrowing.js        # Borrower actions
│   │   ├── ledger.js           # Ledger management
│   │   ├── blacklist.js        # Blacklist system
│   │   ├── subscriptions.js    # Subscription handling
│   │   ├── countries.js        # Country isolation
│   │   ├── collectors.js       # Debt collectors
│   │   ├── calculator.js       # Loan calculator
│   │   ├── pwa.js              # PWA installation
│   │   └── utils.js            # Utility functions
│   └── images/                  # Images & icons
├── pages/
│   ├── dashboard/
│   │   ├── borrower-dashboard.html
│   │   ├── lender-dashboard.html
│   │   └── admin-dashboard.html
│   ├── lending.html
│   ├── borrowing.html
│   ├── ledger.html
│   ├── groups.html
│   ├── subscriptions.html
│   ├── blacklist.html
│   ├── debt-collectors.html
│   ├── about.html
│   ├── qa.html
│   ├── contact.html
│   └── countries/
│       ├── index.html          # Countries overview
│       ├── kenya.html
│       ├── uganda.html
│       ├── tanzania.html
│       ├── rwanda.html
│       ├── burundi.html
│       ├── somalia.html
│       ├── south-sudan.html
│       ├── ethiopia.html
│       ├── DRC.html
│       ├── nigeria.html
│       ├── south-africa.html
│       └── ghana.html
└── data/
    ├── countries.json          # Country configurations
    ├── subscriptions.json      # Subscription tiers
    ├── categories.json         # Loan categories
    ├── collectors.json         # 200 debt collectors
    ├── demo-groups.json        # Sample groups
    ├── demo-users.json         # Sample users
    └── demo-ledgers.json       # Sample ledgers
🎨 Design System
Colors (STRICT)
text
Core: #512DA8 (Deep Purple), #7B1FA2 (Primary Purple), #F3E5F5 (Soft Purple)
Growth: #388E3C (Green), #4CAF50, #E8F5E9
Human: #F57C00 (Orange accent), #FFF3E0
Alerts: #D32F2F (Red), #FFEBEE
Neutral: #000000, #424242, #757575, #F7FAFC, #E0E4E8, #FFFFFF
Typography
Primary: Inter (sans-serif)

Headings: Montserrat (bold, modern)

Base Size: 16px (responsive)

🔧 Technical Details
PWA Features
✅ Installable on mobile/desktop

✅ Offline functionality

✅ Push notifications (stub)

✅ Service Worker caching

✅ Manifest configuration

✅ Responsive design

Browser Support
Chrome 50+ ✅

Firefox 48+ ✅

Safari 11.1+ ✅

Edge 79+ ✅

iOS Safari 11.3+ ✅

Performance
Lighthouse score target: 90+ (PWA)

First Contentful Paint: < 2s

Time to Interactive: < 5s

Offline fallback: Yes

📱 Platform Pages
Core Pages
Home (/) - Landing with emergency categories

Countries (/pages/countries/) - Country selection

Groups (/pages/groups.html) - Group management

Lending (/pages/lending.html) - Lender dashboard

Borrowing (/pages/borrowing.html) - Borrower dashboard

Ledger (/pages/ledger.html) - Loan tracking

Blacklist (/pages/blacklist.html) - Defaulters registry

Debt Collectors (/pages/debt-collectors.html) - 200 vetted collectors

Subscriptions (/pages/subscriptions.html) - Tier management

Admin (/pages/dashboard/admin-dashboard.html) - Platform administration

Country-Specific Pages
Each of the 13 countries has:

Dedicated dashboard

Local currency display

Country flag badge

Groups listing

Local contact form

📊 Data Structure
Demo Data Files
All data is static JSON for frontend demonstration:

countries.json: Country configurations, currencies, languages

subscriptions.json: 4 tier levels with pricing and limits

categories.json: 16 emergency loan categories

collectors.json: 200 vetted debt collectors

demo-groups.json: Sample groups (5-1000 members)

demo-users.json: Sample lenders & borrowers

demo-ledgers.json: Sample active loans

Hierarchy Enforcement
The frontend enforces:

Country → Group → Lender → Borrower chain

No cross-country access

Subscription gating for lenders

Blacklist propagation across groups

🛡️ Security Considerations (Frontend Only)
UI-Level Protection
Role-based UI visibility

Country isolation in UI

Subscription checks before lending

Blacklist checks before borrowing

Data Privacy
No real user data stored

Demo data only

No backend integration in Phase 1

All data client-side only

🧪 Testing
Manual Testing Checklist
PWA installation works

Offline mode functions

All 16 categories display

Country isolation works

Subscription tiers display

Loan calculator accurate

Blacklist page loads

Debt collectors list (200 entries)

All country pages accessible

Responsive on mobile/desktop

Browser Testing
Chrome (desktop/mobile)

Firefox (desktop/mobile)

Safari (desktop/mobile)

Edge (desktop)

🔄 Development Workflow
Phase 1: Frontend PWA (Current)
HTML/CSS/JS PWA

Installable, offline-ready

All pages, dashboards, country isolation

Mock data only

GitHub Pages deployable

Phase 2: Backend (Future)
Node.js + Firebase

Authentication

Real database

API endpoints

Payment integration

Phase 3: Mobile App (Future)
React Native

iOS/Android

Same backend APIs

Push notifications

🤝 Contributing
For Developers
Fork the repository

Create a feature branch

Make changes

Test thoroughly

Submit pull request

Code Standards
Semantic HTML5

CSS with BEM methodology

Vanilla JavaScript (ES6+)

Comment complex logic

Follow existing structure

📄 License
This project is proprietary. All rights reserved.

📞 Support
Email: support@mpesewa.com

GitHub Issues: For bug reports

Documentation: This README

🚨 Important Notes
Business Logic (NON-NEGOTIABLE)
The following rules are strictly enforced:

No cross-country lending/borrowing

No cross-group lending

Borrowers max 4 groups (good rating)

Lenders require active subscription

Subscription expires 28th monthly

Admin can override blacklist/ledgers

All loans off-platform (M-Pesa, bank, etc.)

Demo Limitations
No real authentication

No real payments

No backend connectivity

All data is static/mocked

UI simulation only

Production Readiness
This is Phase 1: Frontend PWA only. For production:

Add backend (Phase 2)

Implement real authentication

Add payment processing

Deploy to production hosting

Add monitoring & analytics

🌟 Success Metrics
High repayment rate (target: 99%)

Growth in trusted groups

Reduced default rates

Increased lender participation

Improved emergency access

🙏 Acknowledgments
Built for African communities to solve emergency consumption needs through trusted social circles.

