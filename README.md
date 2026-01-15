# M-Pesewa - Emergency Micro-Lending Platform

![M-Pesewa Logo](https://img.shields.io/badge/M--Pesewa-Emergency%20Micro--Lending-512DA8)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployable-brightgreen)
![PWA](https://img.shields.io/badge/PWA-Enabled-388E3C)
![License](https://img.shields.io/badge/License-MIT-blue)

A Progressive Web App (PWA) for emergency micro-lending within trusted social groups across Africa. The platform enables peer-to-peer lending for urgent consumption needs while maintaining strict country and group isolation.

## 🌍 Live Demo
[View Live on GitHub Pages](https://yourusername.github.io/m-pesewa)

## 📱 Features

### Core Platform Hierarchy

Global → Country → Group → Lender → Borrower/Ledger

text

### Strict Enforcement
- **Country Isolation**: No cross-country lending/borrowing
- **Group Isolation**: Lenders only operate within their group
- **Role Separation**: Borrower (free) vs Lender (subscription)
- **Hierarchy Rules**: Borrowers > Lenders > Groups enforced

### User Roles
- **Borrowers**: No subscription, max 4 groups, 2 guarantors required
- **Lenders**: Tiered subscriptions (Basic, Premium, Super, Lender of Lenders)
- **Dual Roles**: Users can be both (separate registrations)
- **Admins**: Platform-level moderation (hidden from users)

### 16 Emergency Categories
1. M-Pesewa Fare (Transport)
2. M-Pesewa Data (Airtime)
3. M-Pesewa Internet/WiFi
4. M-Pesewa Cooking Gas
5. M-Pesewa Food
6. M-Pesewa Advance
7. M-Pesewa Credo (Urgent Repairs)
8. M-Pesewa Water Bill
9. M-Pesewa Fuel
10. M-Pesewa Repairs
11. M-Pesewa Medicine
12. M-Pesewa Electricity Tokens
13. M-Pesewa School Fees
14. M-Pesewa TV Subscription
15. M-Pesa Daily Sales Advance
16. M-Pesa Working Capital Advance

### Loan Rules
- **Max Term**: 7 days
- **Interest**: 10% fixed
- **Penalty**: 5% daily after day 7
- **Default**: After 2 months
- **Partial Repayments**: Allowed daily

## 🚀 Quick Deployment

### GitHub Pages (Recommended)
1. **Fork this repository** to your GitHub account
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main (root)
   - Click Save
3. **Your site is live at**: `https://yourusername.github.io/m-pesewa`

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/m-pesewa.git
cd m-pesewa

# Python 3
python3 -m http.server 8000

# Node.js
npx serve .

# Open browser
open http://localhost:8000
📁 Project Structure
text
/
├── index.html                    # Main landing page
├── manifest.json                 # PWA manifest
├── service-worker.js            # PWA service worker
├── README.md                    # This file
├── .nojekyll                    # Disable Jekyll processing
│
├── assets/                      # All static assets
│   ├── css/
│   │   ├── main.css            # Global styles & typography
│   │   ├── components.css      # Cards, buttons, modals
│   │   ├── dashboard.css       # Dashboard-specific styles
│   │   ├── forms.css           # Form styling
│   │   ├── tables.css          # Table styling
│   │   └── animations.css      # Animations & transitions
│   │
│   ├── js/                     # JavaScript modules
│   └── images/                 # Image assets
│
├── pages/                       # All HTML pages
│   ├── dashboard/              # Dashboard pages
│   ├── countries/              # Country-specific pages
│   └── *.html                  # Other pages
│
└── data/                       # Mock data files
    ├── countries.json
    ├── subscriptions.json
    ├── categories.json
    ├── collectors.json
    ├── demo-groups.json
    ├── demo-users.json
    └── demo-ledgers.json
🎨 Design System
Color Palette (STRICT)
Core: #512DA8 (Deep Purple), #7B1FA2 (Primary Purple)

Growth: #388E3C (Green), #4CAF50

Human: #F57C00 (Orange accent)

Alerts: #D32F2F (Red)

Neutral: #000000, #424242, #FFFFFF

Typography
Primary Font: Inter (system font stack)

Base Size: 16px desktop, 14px mobile

Line Height: 1.5 for readability

📊 Subscription Tiers
Tier	Max/Week	Monthly	Bi-Annual	Annual	CRB
Basic	≤1,500	50	250	500	No
Premium	≤5,000	250	1,500	2,500	No
Super	≤20,000	1,000	5,000	8,500	Yes
Lender of Lenders	≤50,000	500	3,500	6,500	Yes
🔒 Platform Rules
Group Rules
Min Members: 5

Max Members: 1,000

Entry: Invitation/referral only

Country-locked: No cross-country groups

Admin/Founder: One per group

Borrower Limits
Max Groups: 4 (good rating required)

Active Loans: 1 per group

Blacklist: Blocks all borrowing/joining

Rating: 5-star system (lender-rated)

Lender Requirements
Subscription: Required, expires 28th monthly

Access: Blocked if expired

Ledgers: Unlimited per lender

Visibility: Cannot see other lenders' ledgers

📱 PWA Features
Installation
Mobile: Add to Home Screen

Desktop: Install as standalone app

Offline: Service Worker caching

Push Notifications: Loan alerts, reminders

Performance
First Paint: < 1 second

Caching: Assets and API responses

Lazy Loading: Images and components

Background Sync: Form submissions

📄 Pages Overview
Core Pages
Home (/) - Landing with category cards

Countries (/pages/countries/) - Country dashboards

Groups (/pages/groups.html) - Group management

Lending (/pages/lending.html) - Lender dashboard

Borrowing (/pages/borrowing.html) - Borrower dashboard

Ledger (/pages/ledger.html) - Loan tracking

Blacklist (/pages/blacklist.html) - Defaulters registry

Debt Collectors (/pages/debt-collectors.html) - 200+ collectors

Admin (/pages/dashboard/admin-*.html) - Hidden admin panels

Country Pages (13)
Kenya, Uganda, Tanzania, Rwanda, Burundi, Somalia

South Sudan, Ethiopia, DRC, Nigeria, South Africa, Ghana

🛠️ Development
Adding Features
Create HTML file in /pages/

Add CSS to appropriate CSS file

Add JavaScript to appropriate JS file

Update navigation in header/footer

Test offline functionality

Customizing for Your Country
Update /data/countries.json

Modify currency in calculator

Update contact information

Add country flag to /assets/images/flags/