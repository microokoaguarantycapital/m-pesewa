# M-Pesewa - Emergency Micro-Lending in Trusted Circles

A Progressive Web App (PWA) for peer-to-peer emergency micro-lending within trusted social groups across Africa.

## 🌍 Live Demo
[View Live Demo](https://yourusername.github.io/m-pesewa)  
*Replace with your GitHub Pages URL after deployment*

## 📱 Features

### Core Platform
- **Global → Country → Group → Lender → Borrower Hierarchy** - Strict hierarchical isolation
- **13 African Countries** - Kenya, Uganda, Tanzania, Rwanda, Burundi, Somalia, South Sudan, Ethiopia, DRC, Nigeria, South Africa, Ghana
- **16 Emergency Loan Categories** - Specific consumption needs (Transport, Data, Food, Medicine, etc.)
- **Trust-Based System** - Referral-only group membership with guarantor requirements

### User Roles
- **Borrowers** - No subscription fees, up to 4 groups, 2 guarantors required
- **Lenders** - Tiered subscriptions (Basic, Premium, Super, Lender of Lenders)
- **Dual Roles** - Users can be both borrowers and lenders (separate registrations)
- **Admins** - Platform and group moderation capabilities

### Technical Features
- **Progressive Web App (PWA)** - Installable, offline-capable, push notifications
- **Mobile-First Design** - Fully responsive across all devices
- **GitHub Pages Ready** - Static hosting with no backend required
- **Mock Data System** - Complete demo data for testing

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)
1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages** in repository settings
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main (or master) → / (root)
   - Click Save
3. **Your site will be live at:** `https://yourusername.github.io/m-pesewa`

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
open http://localhost:8000

Option 3: Deploy to Netlify/Vercel
Drag & drop the entire folder to Netlify/Vercel

Or connect repository for continuous deployment

No build process needed - it's static HTML/CSS/JS

🎨 Design System
Colors
Core: #512DA8 (Deep Purple), #7B1FA2 (Primary Purple), #F3E5F5 (Soft Purple)

Growth: #388E3C (Green), #4CAF50, #E8F5E9

Human: #F57C00 (Orange accent), #FFF3E0

Alerts: #D32F2F (Red), #FFEBEE

Neutral: #000000, #424242, #757575, #F7FAFC, #E0E4E8, #FFFFFF

Typography
Primary Font: Inter (system font stack)

Secondary Font: SF Pro Display (Apple system)

Responsive scaling: 14px mobile → 16px desktop

📋 Business Rules
Strict Hierarchy Enforcement
Country Isolation: No cross-country lending/borrowing

Group Isolation: Lenders only lend within their group

Borrower Limits: Max 4 groups (good rating required)

Subscription Enforcement: Expires 28th of each month

Subscription Tiers
Tier	Max/Week	Monthly	Bi-Annual	Annual	CRB
Basic	≤1,500	50	250	500	No
Premium	≤5,000	250	1,500	2,500	No
Super	≤20,000	1,000	5,000	8,500	Yes
Lender of Lenders	≤50,000	500	3,500	6,500	Yes
Loan Terms
Repayment Period: 7 days maximum

Interest: 10% per week (fixed)

Partial Payments: Daily repayments allowed

Penalty: 5% daily after 7 days

Default: After 2 months of non-payment

Group Rules
Minimum Members: 5

Maximum Members: 1,000

Entry: Invitation or referral only

Country-locked: Cannot invite non-citizens

Admin/Founder: One per group, moderates members

🔧 PWA Features
Installation
Add to Home Screen on mobile devices

Desktop installation on Chrome/Edge

Standalone mode (no browser UI)

Offline Capabilities
Service Worker caches all assets

Offline forms with background sync

Cached data for browsing offline

Performance
Lazy loading of images and content

Minified assets (in production)

Fast First Paint (< 1 second)

📱 Pages Overview
Home Page (index.html)

Hero section with platform overview

16 emergency category cards

Success stories

Country selector

Country Pages (pages/countries/)

Dedicated dashboard per country

Local currency display

Country-specific groups

Loan calculator with local currency

Group Pages (pages/groups.html)

Create/join groups

Group management

Member lists and ratings

Dashboard Pages (pages/dashboard/)

Borrower Dashboard: Active loans, repayment schedule, rating

Lender Dashboard: Ledgers, borrowers, subscription status, analytics

Admin Dashboard: Blacklist, ledger overrides, system controls

Transaction Pages

Lending: Create loan offers, manage borrowers

Borrowing: Request loans, view offers, repay

Ledger: Track all loans, update repayments

Management Pages

Blacklist: View defaulters, manage blacklist status

Debt Collectors: 200+ verified collectors directory

Subscriptions: Tier management and payment

About: Platform information and comparisons

Contact: Email form and support

📊 Mock Data
The platform includes complete mock data:

data/countries.json - 13 African countries with currencies, languages, contact info

data/subscriptions.json - All 4 subscription tiers with pricing and limits

data/categories.json - 16 emergency loan categories with icons and descriptions

data/collectors.json - 200+ debt collectors with contact details

data/demo-*.json - Sample groups, users, and ledgers

🛠️ Development
Adding New Features
Create HTML file in pages/ directory

Add CSS to appropriate CSS file

Add JavaScript to appropriate JS file

Update navigation in header/footer

Test offline functionality

Customizing for Your Country
Update data/countries.json with your country details

Modify currency in calculator and forms

Update contact information in footer

Add country flag to assets/images/flags/