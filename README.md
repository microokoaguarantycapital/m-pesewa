# M-Pesewa - Emergency Micro-Lending PWA

![M-Pesewa Logo](assets/images/logo.svg)

**Emergency Micro-Lending in Trusted Circles** - A Progressive Web App (PWA) that enables peer-to-peer emergency micro-lending within trusted social groups across Africa.

## 🌍 Live Demo
[View Live Demo on GitHub Pages](https://yourusername.github.io/m-pesewa/)  
*Replace with your GitHub Pages URL after deployment*

## 📱 Features

### Core Platform
- **Global→ Country → Group → Lender → Borrower Hierarchy** - Strict hierarchical isolation
- **13 African Countries** - Kenya, Uganda, Tanzania, Rwanda, Burundi, Somalia, South Sudan, Ethiopia, DRC, Nigeria, South Africa, Ghana
- **16 Emergency Loan Categories** - Specific consumption needs (Transport, Data, Food, Medicine, etc.)
- **Trust-Based System** - Referral-only group membership with guarantor requirements

### User Roles
- **Borrowers** - No subscription fees, up to 4 groups, 2 guarantors required
- **Lenders** - Tiered subscriptions (Basic, Premium, Super, Lender of Lenders)
- **Dual Roles** - Users can be both borrowers and lenders (separate registrations)
- **Admins** - Platform and group moderation capabilities

### Technical Features
- **Progressive Web App (PWA)** - Installable, offline-capable, push notifications ready
- **Mobile-First Design** - Fully responsive across all devices
- **GitHub Pages Ready** - Static hosting with no backend required
- **Complete Mock Data System** - Fully functional demo with realistic data
- **Color System Compliant** - Strict adherence to specified color palette

## 🚀 Quick Deployment

### Option 1: GitHub Pages (Recommended)
1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` → `/` (root)
   - Click Save
3. **Your site will be live at:** `https://yourusername.github.io/m-pesewa/`

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/m-pesewa.git
cd m-pesewa

# Serve locally (Python 3)
python3 -m http.server 8000

# Or with Node.js
npx serve .

# Open in browser
# Windows: start http://localhost:8000
# Mac: open http://localhost:8000
# Linux: xdg-open http://localhost:8000
Option 3: Netlify/Vercel
Drag & drop the entire folder to Netlify/Vercel

Or connect repository for continuous deployment

No build process needed - it's static HTML/CSS/JS

🎨 Design System
Colors (Strictly Enforced)
text
Core: #512DA8 (Deep Purple), #7B1FA2 (Primary Purple), #F3E5F5 (Soft Purple)
Growth: #388E3C (Green), #4CAF50, #E8F5E9
Human: #F57C00 (Orange accent), #FFF3E0
Alerts: #D32F2F (Red), #FFEBEE
Neutral: #000000, #424242, #757575, #F7FAFC, #E0E4E8, #FFFFFF
Typography
Primary Font: Inter (system font stack)

Secondary Font: SF Pro Display (Apple system)

Responsive scaling: 14px mobile → 16px desktop

Text color: #000000 only (per requirement)

📋 Business Rules (Enforced)
Strict Hierarchy Enforcement
Country Isolation: No cross-country lending/borrowing

Group Isolation: Lenders only lend within their group

Borrower Limits: Max 4 groups (good rating required)

Subscription Enforcement: Expires 28th of each month

Admin Supremacy: Platform Admin can override any blacklist or ledger

Subscription Tiers
Tier	Max/Week	Monthly	Bi-Annual	Annual	CRB
Basic	≤1,500	₵50	₵250	₵500	No
Premium	≤5,000	₵250	₵1,500	₵2,500	No
Super	≤20,000	₵1,000	₵5,000	₵8,500	Yes
Lender of Lenders	≤50,000	₵500	₵3,500	₵6,500	Yes
Loan Terms
Repayment Period: 7 days maximum

Interest: 10% per week (fixed)

Partial Payments: Daily repayments allowed

Penalty: 5% daily after 7 days

Default: After 2 months of non-payment

One active loan per group per category

Max 4 loans total (1 per group)

Group Rules
Minimum Members: 5

Maximum Members: 1,000

Entry: Invitation or referral only

Country-locked: Cannot invite non-citizens

Admin/Founder: One per group, moderates members

Borrowers > Lenders > Groups (enforced at logic level)

📁 Project Structure
text
/
├── index.html                    # Main landing page (REQUIRED AT ROOT)
├── manifest.json                 # PWA manifest
├── service-worker.js            # PWA service worker
├── README.md                    # This file
├── .nojekyll                    # Disable Jekyll processing
│
├── assets/
│   ├── css/
│   │   ├── main.css            # Global styles & typography
│   │   ├── components.css      # Cards, buttons, modals
│   │   ├── dashboard.css       # Dashboard-specific styles
│   │   ├── forms.css           # Form styling
│   │   ├── tables.css          # Table styling
│   │   └── animations.css      # Animations & transitions
│   │
│   ├── js/
│   │   ├── app.js              # App bootstrap & routing
│   │   ├── auth.js             # Authentication logic (UI only)
│   │   ├── roles.js            # Role management
│   │   ├── groups.js           # Group creation & management
│   │   ├── lending.js          # Lending functionality
│   │   ├── borrowing.js        # Borrowing functionality
│   │   ├── ledger.js           # Ledger management
│   │   ├── blacklist.js        # Blacklist system
│   │   ├── subscriptions.js    # Subscription management
│   │   ├── countries.js        # Country isolation logic
│   │   ├── collectors.js       # Debt collectors listing
│   │   ├── calculator.js       # Loan calculator
│   │   ├── pwa.js              # PWA installation & offline
│   │   └── utils.js            # Utilities & helpers
│   │
│   └── images/                  # All image assets
│       ├── logo.svg
│       ├── icons/              # PWA icons
│       ├── flags/              # Country flags
│       └── categories/         # Category icons
│
├── pages/
│   ├── dashboard/
│   │   ├── borrower-dashboard.html
│   │   ├── lender-dashboard.html
│   │   └── admin-dashboard.html   # HIDDEN FROM PUBLIC UI
│   │
│   ├── lending.html            # Lending page
│   ├── borrowing.html          # Borrowing page
│   ├── ledger.html             # Ledger management
│   ├── groups.html             # Groups directory
│   ├── subscriptions.html      # Subscription plans
│   ├── blacklist.html          # Blacklisted users
│   ├── debt-collectors.html    # Debt collectors directory
│   ├── about.html              # About page
│   ├── qa.html                 # Q&A page
│   ├── contact.html            # Contact page
│   │
│   └── countries/              # Country-specific pages
│       ├── index.html          # Countries overview
│       ├── kenya.html          # Kenya dashboard
│       ├── uganda.html         # Uganda dashboard
│       └── ... (11 more countries)
│
└── data/                       # Mock data files
    ├── countries.json          # Country configurations
    ├── subscriptions.json      # Subscription tiers
    ├── categories.json         # Loan categories
    ├── collectors.json         # 200 debt collectors
    ├── demo-groups.json        # Sample groups
    ├── demo-users.json         # Sample users
    └── demo-ledgers.json       # Sample ledgers