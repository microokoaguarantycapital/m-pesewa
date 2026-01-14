# M-Pesewa - Emergency Micro-Lending PWA

[![PWA](https://img.shields.io/badge/PWA-Ready-512DA8)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployable-brightgreen)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

A revolutionary Progressive Web App for emergency micro-lending within trusted social groups across Africa.

## 🌍 Live Demo
Deploy to GitHub Pages for instant live demo:
- Fork this repository
- Go to Settings → Pages
- Set source to "Deploy from branch"
- Branch: `main` → `/ (root)`
- Save

Your site will be live at: `https://yourusername.github.io/m-pesewa`

## 🚀 Quick Start

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/m-pesewa.git
cd m-pesewa

# Python 3 server
python3 -m http.server 8000

# Or with Node.js
npx serve .

# Open browser
open http://localhost:8000

🏗️ Project Structure
text
/
├── index.html                 # Main landing page (REQUIRED AT ROOT)
├── manifest.json              # PWA manifest
├── service-worker.js          # PWA service worker
├── README.md                  # This file
├── .nojekyll                  # Disable Jekyll processing
│
├── assets/                    # All static assets
│   ├── css/                   # Stylesheets
│   │   ├── main.css
│   │   ├── components.css
│   │   ├── dashboard.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   └── animations.css
│   │
│   ├── js/                    # JavaScript modules
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── roles.js
│   │   ├── groups.js
│   │   ├── lending.js
│   │   ├── borrowing.js
│   │   ├── ledger.js
│   │   ├── blacklist.js
│   │   ├── subscriptions.js
│   │   ├── countries.js
│   │   ├── collectors.js
│   │   ├── calculator.js
│   │   ├── pwa.js
│   │   └── utils.js
│   │
│   └── images/               # Image assets
│       ├── logo.svg
│       ├── icons/
│       ├── flags/
│       └── categories/
│
├── pages/                    # All HTML pages
│   ├── dashboard/
│   │   ├── borrower-dashboard.html
│   │   ├── lender-dashboard.html
│   │   └── admin-dashboard.html
│   │
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
│   │
│   └── countries/           # Country-specific pages
│       ├── index.html
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
│
└── data/                    # Mock data files
    ├── countries.json
    ├── subscriptions.json
    ├── categories.json
    ├── collectors.json
    ├── demo-groups.json
    ├── demo-users.json
    └── demo-ledgers.json
🎨 Design System
Color Palette (STRICT)
Core: #512DA8 (Deep Purple), #7B1FA2 (Primary Purple), #F3E5F5 (Soft Purple)

Growth: #388E3C (Green), #4CAF50, #E8F5E9

Human: #F57C00 (Orange accent), #FFF3E0

Alerts: #D32F2F (Red), #FFEBEE

Neutral: #000000, #424242, #757575, #F7FAFC, #E0E4E8, #FFFFFF

Typography
Primary: Inter (Google Fonts)

Secondary: Montserrat (Headings)

Text color: #000000 only (Non-negotiable)

📋 Business Rules (STRICT)
Hierarchy Enforcement
text
Global → Country → Group → Lender → Borrower/Ledger
✅ No cross-country lending/borrowing

✅ No cross-group lending

✅ Borrowers max 4 groups (good rating required)

✅ Lenders must have active subscriptions

✅ Subscription expires 28th monthly

✅ Borrowers pay NO subscription

✅ Admin can override blacklist/ledgers

Subscription Tiers
Tier	Max/Week	Monthly	Bi-Annual	Annual	CRB
Basic	≤1,500	50	250	500	No
Premium	≤5,000	250	1,500	2,500	No
Super	≤20,000	1,000	5,000	8,500	Yes
Lender of Lenders	≤50,000	500	3,500	6,500	Yes
Loan Terms
Repayment: 7 days maximum

Interest: 10% fixed weekly

Penalty: 5% daily after 7 days

Default: After 2 months

Partial repayments allowed

🛠️ Technical Stack
Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+)

PWA: Service Workers, Web App Manifest

Hosting: GitHub Pages compatible

Data: Static JSON (mock/demo data only)

No Backend: Phase 1 is frontend-only

🔧 Development
Adding New Features
Create HTML file in /pages/ directory

Add CSS to appropriate CSS file

Add JavaScript to appropriate JS file

Update navigation in header/footer

Test offline functionality

PWA Installation
Users can:

Visit the site on mobile/desktop

Browser will prompt "Add to Home Screen"

App installs as native-like application

Works offline with cached assets

📊 Mock Data
All demo data is in /data/ directory:

countries.json: 13 African countries with currencies

subscriptions.json: All tier configurations

categories.json: 16 emergency loan categories

collectors.json: 200+ debt collectors

demo-*.json: Sample groups, users, ledgers

🔒 Security Notes
FRONTEND ONLY - NO REAL AUTHENTICATION

All authentication is UI simulation only

No real payment processing

No sensitive data storage

No backend API calls

For Production:

Implement backend authentication

Add real payment processing

Implement database

Add SSL/TLS encryption

Comply with financial regulations

🌐 Supported Countries (13)
Kenya (KSh)

Uganda (UGX)

Tanzania (TZS)

Rwanda (RWF)

Burundi (BIF)

Somalia (SOS)

South Sudan (SSP)

Ethiopia (ETB)

DRC (CDF/USD)

Nigeria (NGN)

South Africa (ZAR)

Ghana (GHS)

📞 Support
Documentation: This README

Issues: GitHub Issues

Email: support@mpesewa.com

📄 License
MIT License - See LICENSE file for details.

<div align="center"> <strong>M-Pesewa</strong> - Emergency Micro-Lending in Trusted Circles<br> <sub>Building trust-based financial ecosystems across Africa</sub> </div> ```