# M-Pesewa PWA - Emergency Micro-Lending Platform

![M-Pesewa Logo](https://microokoaguarantycapital.github.io/m-pesewa/assets/images/logo.svg)

**Emergency support from people you trust.**  
A Progressive Web App for emergency micro-lending within trusted social groups across Africa.

## 🌍 Live Demo
👉 [https://microokoaguarantycapital.github.io/m-pesewa/](https://microokoaguarantycapital.github.io/m-pesewa/)

## 📱 About M-Pesewa

M-Pesewa is an emergency micro-lending platform built around trusted social groups. It enables individuals within the same country and group to lend and borrow short-term consumption loans. All monetary transactions occur outside the platform - M-Pesewa manages trust, structure, reputation, and visibility, not funds.

### Core Philosophy
- Emergency consumption loans only
- Friends lend to friends inside trusted groups
- Platform earns only from lender subscriptions
- Strong reputation and blacklist enforcement
- No cross-country or cross-group lending

## 🏗️ Project Structure
/
├── index.html # Main landing page
├── manifest.json # PWA manifest
├── service-worker.js # PWA service worker
├── README.md # Project documentation
├── .nojekyll # Disable Jekyll on GitHub Pages
│
├── assets/
│ ├── css/ # All stylesheets
│ │ ├── main.css # Global styles & typography
│ │ ├── components.css # Cards, buttons, modals
│ │ ├── dashboard.css # Dashboard-specific styles
│ │ ├── forms.css # Form styling
│ │ ├── tables.css # Table styling
│ │ └── animations.css # Animations & transitions
│ │
│ ├── js/ # All JavaScript files
│ │ ├── app.js # App bootstrap & routing
│ │ ├── auth.js # Authentication logic (UI only)
│ │ ├── roles.js # Role management
│ │ ├── groups.js # Group creation & management
│ │ ├── lending.js # Lending functionality
│ │ ├── borrowing.js # Borrowing functionality
│ │ ├── ledger.js # Ledger management
│ │ ├── blacklist.js # Blacklist system
│ │ ├── subscriptions.js # Subscription management
│ │ ├── countries.js # Country isolation logic
│ │ ├── collectors.js # Debt collectors directory
│ │ ├── calculator.js # Loan calculator
│ │ ├── pwa.js # Install & offline handling
│ │ └── utils.js # Utilities & helpers
│ │
│ └── images/ # All images and icons
│ ├── logo.svg
│ ├── icons/ # PWA icons
│ ├── flags/ # Country flags
│ └── categories/ # Loan category icons
│
├── pages/ # All HTML pages
│ ├── dashboard/
│ │ ├── borrower-dashboard.html
│ │ ├── lender-dashboard.html
│ │ └── admin-dashboard.html # Hidden / no nav links
│ │
│ ├── lending.html
│ ├── borrowing.html
│ ├── ledger.html
│ ├── groups.html
│ ├── subscriptions.html
│ ├── blacklist.html
│ ├── debt-collectors.html
│ ├── about.html
│ ├── qa.html
│ └── contact.html
│
├── pages/countries/ # Country-specific pages
│ ├── index.html # Countries overview
│ ├── kenya.html
│ ├── uganda.html
│ ├── tanzania.html
│ ├── rwanda.html
│ ├── nigeria.html
│ ├── ghana.html
│ ├── south-africa.html
│ ├── egypt.html
│ ├── morocco.html
│ ├── ethiopia.html
│ └── senegal.html
│
└── data/ # Static JSON data files
├── countries.json # Country configurations
├── subscriptions.json # Subscription tiers
├── categories.json # Loan categories
├── collectors.json # 200 debt collectors
├── demo-groups.json # Sample groups
├── demo-users.json # Sample users
└── demo-ledgers.json # Sample ledgers

text

## 🚀 Features

### PWA Capabilities
- ✅ Installable on any device (Android, iOS, Desktop)
- ✅ Works offline with service worker caching
- ✅ Fast loading with asset precaching
- ✅ Push notifications support
- ✅ Background sync for forms
- ✅ Responsive design (mobile-first)

### Platform Features
- **20 Emergency Loan Categories**: Floating cards with animations
- **Country Isolation**: 13 African countries supported
- **Group-Based Trust**: Referral-only group membership
- **Dual Roles**: Users can be both borrowers and lenders
- **Subscription Tiers**: Four lender subscription levels
- **Ledger System**: Automatic ledger generation
- **Blacklist Registry**: Platform-wide defaulters list
- **Debt Collectors**: 200+ vetted recovery agents
- **Admin Dashboard**: Hidden management interface

### Strict Hierarchy Enforcement
Global → Country → Groups → Lenders → Borrowers (Ledgers)

text

## 📋 Business Rules

### Country Rules
- No cross-country lending or borrowing
- Each country has its own currency
- Country flag badges on all groups
- Unlimited groups per country

### Group Rules
- Minimum 5 members, maximum 1000 per group
- Referral/invitation only
- One Admin/Founder per group
- Country-locked (cannot invite non-citizens)
- Members join as either Lenders or Borrowers

### Lender Rules
- Must have active subscription (Basic, Premium, Super, Lender-of-Lenders)
- Subscription expires on 28th of each month
- Can only lend within their group
- Can create unlimited ledgers
- Can also be a borrower (dual role)

### Borrower Rules
- No subscription fees (except for Premium/Super tiers)
- Can join up to 4 groups (good rating required)
- One active loan per group at a time
- Maximum loan duration: 7 days
- Interest: 10% per week
- 5% daily penalty after 7 days
- Default after 2 months → blacklist

### Loan Terms
- Maximum repayment period: 7 days
- Interest: 10% fixed per week
- Daily partial repayments allowed
- Minimum loan: as low as 5 units of local currency
- 5% daily penalty after day 7
- Default classification after 2 months

## 🛠️ Technology Stack

- **HTML5**: Semantic markup, PWA manifest
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Service Workers**: Offline capabilities, caching
- **Web App Manifest**: Installable PWA
- **Static JSON**: Demo data simulation
- **GitHub Pages**: Hosting and deployment

## 🚦 Getting Started

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/microokoaguarantycapital/m-pesewa.git

   PWA Installation
Visit https://microokoaguarantycapital.github.io/m-pesewa/

On mobile: Tap "Add to Home Screen" when prompted

On desktop: Look for the install icon in the address bar

The app will work offline once installed

📱 Supported Countries
Country	Currency	Flag	Contact
Kenya	KSh	🇰🇪	+254 709 219 000
Uganda	UGX	🇺🇬	+256 392 175 546
Tanzania	TZS	🇹🇿	+255 659 073 010
Rwanda	RWF	🇷🇼	+250 791 590 801
Nigeria	NGN	🇳🇬	+234 800 000 0000
Ghana	GHS	🇬🇭	+233 24 000 0000
South Africa	ZAR	🇿🇦	+27 11 000 0000
Ethiopia	ETB	🇪🇹	+251 91 000 000
Somalia	SOS	🇸🇴	+252 63 000 0000
South Sudan	SSP	🇸🇸	+27 11 200 0000
DRC	CDF	🇨🇩	+243 81 000 0000
Burundi	BIF	🇧🇮	+257 79 000 000
Egypt	EGP	🇪🇬	+20 100 000 0000
📊 Subscription Tiers
Basic Tier
Max: ≤1,500 local currency per week

Subscription: 50/month, 250/bi-annual, 500/annual

No CRB check

Ledgers cannot exceed 1,500

Premium Tier
Max: ≤5,000 per week

Subscription: 250/month, 1,500/bi-annual, 2,500/annual

No CRB check

Ledgers cannot exceed 10,000

Super Tier
Max: ≤20,000 per week

Subscription: 1,000/month, 5,000/bi-annual, 8,500/annual

CRB check required

Ledgers cannot exceed 20,000

Lender-of-Lenders Tier
Max: ≤50,000

Subscription: 500/month, 3,500/bi-annual, 6,500/annual

CRB required

Interest and repayment period decided by main lender

Minimum repayment period: 1 month

🔒 Security & Privacy
No Fund Handling: All transactions occur off-platform

Data Minimization: Only essential information collected

Group Privacy: Group data visible only to members

Blacklist Transparency: Public defaulters registry

GDPR Compliance: Right to be forgotten implemented

📈 Performance Metrics
Target Repayment Rate: 99%

Default Rate: <1%

Group Growth: Unlimited per country

User Satisfaction: >95% lender retention

Platform Uptime: 99.9% (GitHub Pages SLA)

🎨 Design System
Colors
Primary Green: #2E7D32

Secondary Teal: #00695C

Accent Orange: #FF8F00

Background Light: #F5F5F5

Text Dark: #212121

Text Light: #757575

Typography
Headings: 'Segoe UI', system-ui, sans-serif

Body: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif

Monospace: 'SF Mono', Monaco, 'Cascadia Code', monospace

Components
Floating Cards: 20 emergency categories with subtle animations

Stat Cards: Key metrics with growth indicators

Form Elements: Accessible inputs with validation

Data Tables: Responsive tables with sorting/filtering

Modals: Centered dialogs with backdrop

Navigation: Sticky header with dropdowns

🤝 Contributing
This is a frontend-only PWA demonstration. Contributions are welcome for:

UI Improvements: Better animations, responsive fixes

Accessibility: ARIA labels, keyboard navigation

Performance: Better caching strategies, code splitting

Documentation: More detailed guides, translations

Contribution Guidelines
Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

⚠️ Important Notes
Non-Negotiable Rules
❌ No backend code or APIs

❌ No databases or servers

❌ No Firebase or authentication services

❌ No payment integrations

❌ No frameworks (React, Vue, etc.)

✅ All logic is UI-only, simulated with static JSON

File Structure Rules
✅ index.html MUST exist at root

✅ manifest.json MUST exist at root

✅ service-worker.js MUST exist at root

✅ .nojekyll MUST exist at root

❌ NO /src, /dist, /public, /frontend folders

❌ NO framework build pipelines

📄 License
Copyright © 2024 Microoko Aguaranty Capital. All rights reserved.

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

📞 Contact
Platform Support: support@m-pesewa.com
Business Inquiries: info@m-pesewa.com
Technical Issues: GitHub Issues

Headquarters:
Microoko Aguaranty Capital
Nairobi, Kenya
+254 709 219 000

