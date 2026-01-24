# README.md
# M-Pesewa - Emergency Micro-Lending Platform

<div align="center">

![M-Pesewa Logo](assets/images/logo192.png)

## 🌍 Trusted Circle Lending Across Africa

**Emergency Micro-Lending in Trusted Circles**  
*Borrow when you need it, lend when you can.*

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success)](https://microokoaguarantycapital.github.io/m-pesewa/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue)](https://microokoaguarantycapital.github.io/m-pesewa/)
[![License](https://img.shields.io/badge/License-MPL%202.0-orange)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-green)](VERSION)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Core Philosophy](#core-philosophy)
- [Hierarchical Structure](#hierarchical-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Contact](#contact)

## 🎯 Overview

M-Pesewa is a **real fintech platform** (NOT a demo) for emergency micro-lending within trusted circles across 12 African countries. The platform enables friends to lend to friends, family members to support each other, and communities to create their own financial safety nets.

### 🌟 Key Differentiators

- **No platform-held funds** - All transactions happen directly between users
- **Trust-first model** - Lending only within known groups
- **Emergency-focused** - 20 specific loan categories for real needs
- **Subscription-based** - Revenue only from lender subscriptions
- **Country isolation** - No cross-border lending/borrowing

## 🏗️ Core Philosophy

### Problem → Solution → Trust Flow

1. **Problem**: Emergency financial needs (transport, data, food, medicine, etc.)
2. **Solution**: Trusted circle lending with 7-day terms, 10% interest
3. **Trust**: Group accountability, 5-star ratings, blacklist system

### For Borrowers
- No need to ask for help or favors
- Post loan requests in trusted groups
- Borrow faster from people who already know you
- Fair interest rates agreed willingly
- One request reaches many lenders

### For Lenders
- Earn passive income from day one
- Lend confidently based on borrower ratings
- Start lending with as little as 0.1$
- Support people you trust while earning returns
- No pressure to lend - you choose who to support

## 🌐 Hierarchical Structure

### STRICT Core Hierarchy (Non-Negotiable)

Global
└── Countries (12 Sub-Saharan African countries)
└── Groups (unlimited per country)
├── Lenders (min 5, max 1000 total users per group)
│ └── Ledgers (Borrowers currently in loan state)
└── Borrowers (available for loans, default state)

text

### Country Isolation Rules
- ✅ No cross-country lending or borrowing
- ✅ Each country operates independently
- ✅ Local currency and regulations enforced
- ✅ Country-specific contact information

### Supported Countries
1. 🇰🇪 Kenya (KSh)
2. 🇺🇬 Uganda (UGX)
3. 🇹🇿 Tanzania (TZS)
4. 🇷🇼 Rwanda (RWF)
5. 🇧🇮 Burundi (BIF)
6. 🇨🇩 DRC (USD/CDF)
7. 🇳🇬 Nigeria (NGN)
8. 🇬🇭 Ghana (GHS)
9. 🇸🇸 South Sudan (SSP)
10. 🇸🇴 Somalia (SOS)
11. 🇿🇦 South Africa (ZAR)
12. 🇪🇹 Ethiopia (ETB)

## ✨ Features

### 🚀 Emergency Hub (20 Categories)
1. 🚌 M-pesewa Fare - Transport emergencies
2. 📶 M-pesewa Data - Internet connectivity
3. 🔥 M-pesewa Cooking Gas - Cooking fuel
4. 🍲 M-pesewa Food - Meal emergencies
5. 📡 M-pesewa Wifi - Home internet
6. 🚰 M-pesewa Water Bill - Water access
7. ⚡ M-pesewa Electricity Tokens - Power supply
8. 📺 M-pesewa TV Subscription - Entertainment
9. ⛽ M-pesewa Fuel - Vehicle fuel
10. 🔧 M-pesewa Repair - Equipment repairs
11. 🛠️ M-pesewa Credo - Urgent repairs
12. 🧾 M-Pesa Daily Sales Advance - Business cash flow
13. 🏪 M-Pesa Working Capital Advance - Business capital
14. 🛒 M-Pesewa Soko Loan - Market money
15. 🏗️ M-Pesewa Kidandaski Loan - Stall money
16. 🚶‍♂️ M-Pesewa Hawker Loan - Street vendor capital
17. 🔄 M-fuliziwa Loan - M-Pesa top-up
18. 💊 M-pesewa Medicine - Health emergencies
19. 🎓 M-pesewa School Fees - Education
20. 💸 M-pesewa Advance - Quick cash

### 🔒 Security & Compliance
- **5-Star Rating System** - Lender ratings for borrowers
- **Blacklist System** - Defaulters registry with admin oversight
- **Debt Collectors** - 200+ vetted collectors across countries
- **Subscription Enforcement** - Lenders blocked on expiry (28th of each month)
- **Admin Supremacy** - Platform admin can override any blacklist or ledger

### 💰 Subscription Tiers (Lenders Only)
| Tier | Weekly Limit | Monthly Fee | Features |
|------|--------------|-------------|----------|
| **Basic** | ≤ 1,500 local currency | 50 | No CRB, ≤ 1,500 ledgers |
| **Premium** | ≤ 5,000 local currency | 250 | No CRB, ≤ 10,000 ledgers |
| **Super** | ≤ 20,000 local currency | 1,000 | CRB required, ≤ 20,000 ledgers |
| **Lender of Lenders** | ≤ 50,000 local currency | 500 | CRB required, custom terms |

### 📊 Ledger System
- Auto-generated on loan approval
- Unlimited ledgers per lender
- Tracks: Borrower details, guarantors, amounts, dates, interest (10%), penalties (5% daily after 7 days)
- Status: Active / Cleared
- Admin can override or update

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup, PWA capabilities
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No frameworks, maximum performance
- **Service Workers** - Offline capabilities, background sync
- **IndexedDB** - Client-side data storage
- **Web App Manifest** - Installable PWA

### Architecture
- **Modular Design** - 30+ modules with clear separation
- **State Management** - Custom store with persistence
- **Router** - Client-side routing with guards
- **Component System** - Atomic design principles
- **Design Tokens** - Consistent theming system

### Development Tools
- **GitHub Pages** - Hosting and deployment
- **Git** - Version control
- **Prettier** - Code formatting
- **Live Server** - Development server

## 🚀 Installation

### Prerequisites
- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+)
- Git (for development)
- GitHub account (for deployment)

### Local Development
```bash
# Clone the repository
git clone https://github.com/microokoaguarantycapital/m-pesewa.git

# Navigate to project directory
cd m-pesewa

# Open in browser (no build step required)
# Simply open index.html in your browser

# Or use a local server
python3 -m http.server 8000
# Then visit http://localhost:8000
GitHub Pages Deployment
The site is automatically deployed to GitHub Pages when pushed to the main branch. Visit:

text
https://microokoaguarantycapital.github.io/m-pesewa/
💻 Development
Project Structure
text
/
├── index.html              # Main entry point
├── offline.html           # Offline fallback
├── 404.html              # Custom 404 page
├── manifest.json         # PWA manifest
├── service-worker.js     # Service worker
├── robots.txt           # Search engine directives
├── sitemap.xml          # SEO sitemap
├── .nojekyll            # Disable Jekyll processing
├── README.md            # This file
├── LICENSE              # Mozilla Public License 2.0
├── CHANGELOG.md         # Version history
├── SECURITY.md          # Security policy
├── CONTRIBUTING.md      # Contribution guidelines
├── VERSION              # Version file
│
├── assets/              # Static assets
│   ├── css/            # Stylesheets
│   ├── images/         # Images and icons
│   ├── fonts/          # Web fonts
│   └── lottie/         # Animations
│
├── core/               # Application core
├── state/              # State management
├── router/             # Routing system
├── layout/             # Layout components
├── navigation/         # Navigation logic
├── countries/          # Country modules
├── flag-ribbon/        # Country flags
├── groups/             # Groups module
├── auth/               # Authentication
├── user/               # User management
├── borrower/           # Borrower module
├── lender/             # Lender module
├── ledger/             # Ledger system
├── subscription/       # Subscriptions
├── blacklist/          # Blacklist system
├── admin/              # Admin module
├── global-pages/       # Global pages
├── notifications/      # Notifications
├── sync/               # Sync engine
├── pwa/                # PWA features
├── testing/            # Testing utilities
├── utils/              # Utility functions
├── components/         # UI components
├── policies/           # Business policies
├── analytics/          # Analytics
├── i18n/               # Internationalization
├── security/           # Security modules
└── audit/              # Audit logging
Development Guidelines
Follow the Hierarchy: Never break the Global → Country → Groups → Lenders → Borrowers chain

Use Design Tokens: All colors, spacing, typography must use tokens from tokens.css

Mobile First: Develop for mobile first, then enhance for desktop

Accessibility: Maintain WCAG AA compliance (4.5:1 contrast ratios)

Performance: Keep payloads small, use lazy loading where appropriate

Offline First: Design for offline capability, sync when online

Code Style
HTML: Semantic elements, ARIA labels where needed

CSS: BEM naming convention, custom properties for theming

JavaScript: ES6+ features, async/await for promises, strict mode

Comments: JSDoc for functions, inline comments for complex logic

📦 Deployment
GitHub Pages
The site is configured for automatic deployment to GitHub Pages. To deploy manually:

Push to the main branch

GitHub Actions will automatically deploy

Visit https://microokoaguarantycapital.github.io/m-pesewa/

Custom Domain
To use a custom domain:

Add CNAME file with domain name

Configure DNS settings with your domain provider

Update GitHub Pages settings in repository settings

PWA Installation
Users can install the app:

Desktop: Click install button in address bar

Mobile: "Add to Home Screen" from browser menu

Requirements: HTTPS, service worker, manifest

🤝 Contributing
We welcome contributions! Please see CONTRIBUTING.md for detailed guidelines.

Quick Start for Contributors
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

Contribution Areas
Bug Fixes: Report or fix issues

Features: New functionality aligned with platform goals

Documentation: Improve docs, add examples

Translations: Add support for more languages

Accessibility: Improve accessibility features

Performance: Optimize loading and runtime performance

🔒 Security
Security Policy
Please see SECURITY.md for our security policy and reporting procedures.

Key Security Features
No Server-Side Storage: All data stored client-side

Encryption: Data encrypted in IndexedDB

Authentication: Username/password with optional Google login

Authorization: Role-based access control

Audit Logging: All actions logged for accountability

Input Validation: Client-side validation for all inputs

CSP Headers: Content Security Policy implemented

Reporting Vulnerabilities
If you discover a security vulnerability, please:

Do not disclose publicly

Email security@mpesewa.com

Include detailed reproduction steps

We will respond within 48 hours

📄 License
This project is licensed under the Mozilla Public License 2.0 - see the LICENSE file for details.

Key License Points
✅ Can use commercially

✅ Can modify

✅ Can distribute

✅ Can place warranty

✅ Patent grant from contributors

⚠️ Must disclose source

⚠️ Must license modifications under MPL 2.0

⚠️ Must include original copyright notices

📞 Contact
Platform Information
Website: https://microokoaguarantycapital.github.io/m-pesewa/

Email: info@mpesewa.com

Phone: +254 709 219 000 (Kenya)

Country Contacts
Kenya: +254 709 219 000

Uganda: +256 392 175 546

Tanzania: +255 659 073 010

Rwanda: +250 791 590 801

Somalia: +252 63 0000000

DRC: +243 81 000 0000

Burundi: +257 79 000 000

Nigeria: +234 800 000 0000

Ghana: +233 24 000 0000

South Africa: +27 11 000 0000

South Sudan: +27 11 200 0000

Ethiopia: +251 11 000 0000

Technical Support
Email: support@mpesewa.com

Issues: GitHub Issues

Documentation: This README and inline code comments

Business Inquiries
Partnerships: partners@mpesewa.com

Legal: legal@mpesewa.com

Press: press@mpesewa.com

🙏 Acknowledgments
Success Stories Featured
Mama Jimmy - Gas emergency while cooking

John Kimani - Transport to job interview

Pastor Ndungu - Data for online service

Ibrahim - Boda rider fuel emergency

Platform Objectives
Provide emergency access to small funds

Reduce predatory lending in communities

Monetize via subscriptions only

Enforce hierarchy & isolation

Build group accountability

Target Users
Individuals with emergency needs

Informal & professional lenders

Churches, families, and social groups

Community lenders

Small business associations

<div align="center">
Built with ❤️ for Africa's financial inclusion

© 2016–2026, M-Pesewa.com (Technology Pvt. Ltd.) — All Rights Reserved

Home | How It Works | Contact | Terms

</div> ```
