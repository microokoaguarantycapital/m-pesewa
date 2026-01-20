# M-PESEWA - Emergency Micro-Lending Platform

![M-PESEWA Logo](./assets/images/logo.svg)

## 📋 Overview

M-PESEWA is a technology platform that helps friends, families, and communities support each other with small emergency loans — transparently, safely, and without exploitation. This is not a bank, but a trust-based peer-to-peer lending platform operating across 25 African countries.

## 🎯 Key Features

### For Borrowers
- **Emergency Loans**: Small amounts for real emergencies (KES 500 - KES 20,000)
- **No Subscriptions**: Borrowers use the platform for FREE
- **Group-Based Trust**: Borrow from people who know you in trusted groups
- **Fair Interest**: Maximum 10% interest rate
- **Transparent Process**: Clear terms, no hidden fees
- **Multiple Groups**: Join up to 4 groups with good rating
- **Quick Access**: Funds within hours, not days

### For Lenders
- **Subscription Model**: Choose from Basic, Premium, Super, or Lender of Lenders plans
- **Group Scoped**: Lend only to people in your trusted groups
- **Passive Income**: Earn up to 10% interest on idle money
- **Unlimited Ledgers**: Create unlimited lending records
- **Risk Management**: Group accountability and blacklist enforcement
- **Full Control**: Set your own terms within platform limits
- **Professional Dashboard**: i2iFunding-style interface for serious lending

### Platform Architecture
- **Strict Hierarchy**: Global → Country → Groups → Lenders → Borrowers
- **Country Isolation**: No cross-country lending or borrowing
- **Group Isolation**: Lending stays within trusted circles
- **No Money Custody**: Platform never holds user funds
- **Subscription Revenue**: Only lenders pay subscription fees
- **Legal Compliance**: Full terms, privacy policy, and regulatory compliance

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup)
- GitHub account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/m-pesewa.git
   cd m-pesewa

   File Structure

text
/
├── index.html                 # Public landing page
├── manifest.json              # PWA manifest
├── service-worker.js          # Offline support
├── .nojekyll                  # GitHub Pages config
├── README.md                  # This file
├── assets/
│   ├── css/                   # All stylesheets
│   ├── js/                    # All JavaScript files
│   ├── images/                # Icons, logos, illustrations
│   └── fonts/                 # Custom fonts
├── pages/                     # All page templates
└── components/                # Reusable components
📱 PWA Features
Installable: Add to home screen on mobile and desktop

Offline Support: Works without internet connection

Fast Loading: Cached assets for instant loading

Push Notifications: Real-time updates (requires backend)

Background Sync: Sync data when back online

Responsive Design: Mobile-first, works on all devices

🔧 Technical Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)

Styling: CSS Grid, Flexbox, CSS Custom Properties

PWA: Service Workers, Web App Manifest

Icons: SVG icons with PNG fallbacks

Fonts: Inter font family

Responsive: Mobile-first responsive design

📄 Pages Structure
Public Pages
index.html - Landing page (Home)

about.html - About M-PESEWA

qa.html - Frequently Asked Questions

contact.html - Contact information

countries/index.html - Country selection

countries/kenya.html - Kenya dashboard (example)

blacklist.html - Defaulters registry (read-only)

debt-collectors.html - Vetted debt collectors directory

User Pages
borrowing.html - Borrower loan request

lending.html - Lender borrower listing

ledger.html - Lender ledger management

groups.html - Group management

subscriptions.html - Subscription plans

dashboard/borrower-dashboard.html - Borrower dashboard

dashboard/lender-dashboard.html - Lender dashboard

dashboard/admin-dashboard.html - Admin dashboard

🎨 Design System
Colors
Primary Purple: #2B1D4F

Primary Gold: #FFC107

Secondary Blue: #2196F3

Secondary Green: #4CAF50

Secondary Red: #F44336

Light Gray: #F5F7FB

Dark Background: #1F153B

Typography
Primary Font: Inter

Font Weights: 300, 400, 500, 600, 700

Base Size: 16px

Scale: Modular scale for headings

Components
Buttons (Primary, Secondary, Outline, etc.)

Cards (Stats, Feature, Pricing, etc.)

Forms (Inputs, Selects, Validation)

Tables (Sortable, Filterable, Responsive)

Modals (Various sizes and types)

Badges (Status, Role, Category)

Alerts (Success, Warning, Error, Info)

🔒 Security & Privacy
No Sensitive Data: Platform doesn't handle money or store bank details

Local Storage: User data stored locally (for demo)

HTTPS: Required for PWA features

Privacy Policy: Complete privacy compliance

Terms & Conditions: Full legal documentation

GDPR Ready: Data protection compliant