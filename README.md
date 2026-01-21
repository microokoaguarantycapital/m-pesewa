# M-PESEWA - Emergency Micro-Lending Platform

![M-PESEWA Logo](/assets/images/logo.svg)

M-PESEWA is a Progressive Web App (PWA) for emergency micro-lending within trusted groups across Africa. This platform enables friends, families, and communities to support each other with small emergency loans transparently, safely, and without exploitation.

## 🌍 Platform Overview

M-PESEWA is **not a bank**. It is a technology platform that:
- Connects trusted groups within countries
- Facilitates emergency lending between known individuals
- Maintains ledgers and enforces reputation systems
- Operates on a subscription model for lenders only

### Key Features
- **Country Isolation**: No cross-border lending or borrowing
- **Group-Based Trust**: Lending only within established trust circles
- **Subscription Model**: Lenders pay subscriptions, borrowers use for FREE
- **Emergency Focus**: Designed for real-life emergency consumption needs
- **No Money Custody**: Platform never holds money - all transactions happen directly

## 🏗️ Project Structure
/
├── index.html # Main public landing page
├── manifest.json # PWA manifest
├── service-worker.js # PWA service worker
├── README.md # This documentation
├── .nojekyll # Disable Jekyll processing
│
├── assets/
│ ├── css/
│ │ ├── main.css # Global styles & typography
│ │ ├── components.css # Cards, buttons, modals
│ │ ├── dashboard.css # Dashboard-specific styles
│ │ ├── forms.css # Form styling
│ │ ├── tables.css # Table styling
│ │ └── animations.css # Animations & transitions
│ │
│ ├── js/
│ │ ├── app.js # App bootstrap & routing
│ │ ├── auth.js # Authentication logic
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
│ └── images/
│ ├── logo.svg
│ ├── icons/ # PWA icons
│ ├── flags/ # Country flags
│ └── categories/ # Loan category icons
│
├── pages/
│ ├── dashboard/
│ │ ├── borrower-dashboard.html
│ │ ├── lender-dashboard.html
│ │ └── admin-dashboard.html
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
├── pages/countries/
│ ├── index.html # Countries overview
│ ├── kenya.html
│ ├── uganda.html
│ ├── tanzania.html
│ └── ... (25 countries)
│
└── data/
├── countries.json # Country configurations
├── subscriptions.json # Subscription tiers
├── categories.json # Loan categories
├── collectors.json # 200 debt collectors
├── demo-groups.json # Sample groups
├── demo-users.json # Sample users
└── demo-ledgers.json # Sample ledgers

text

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server for local development
- Code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/m-pesewa.git
   cd m-pesewa