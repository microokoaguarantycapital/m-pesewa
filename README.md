# M-Pesewa - Emergency Micro-Lending PWA

M-Pesewa is a Progressive Web Application (PWA) for emergency micro-lending built on trusted social groups. The platform enables friends and family to lend to each other for emergency needs within verified, country-locked groups.

## 🌍 Platform Overview

**Core Philosophy**: Trust-based lending without platform custody of funds
**Revenue Model**: Lender subscriptions only (Borrowers pay nothing)
**Geography**: 13 African countries with strict country isolation

## 🏗️ Architecture

### Strict Hierarchy
Global
└── Countries (13 countries)
└── Groups (unlimited per country)
├── Lenders (must have subscription)
│ └── Ledgers (Borrowers in active loan state)
└── Borrowers (default state, max 4 groups)

text

### Key Rules
- **No cross-country lending/borrowing**
- **No cross-group lending** 
- **Borrowers > Lenders > Groups** (always enforced)
- **One active loan per group per category per borrower**
- **Max 4 groups per borrower** (good rating required)
- **Subscription expires 28th monthly** (blocks lender access)

## 📁 Project Structure
/
├── index.html # Main landing page
├── manifest.json # PWA manifest
├── service-worker.js # PWA service worker
├── README.md # This file
├── .nojekyll # GitHub Pages config
├── assets/ # Static assets
│ ├── css/ # Stylesheets
│ ├── js/ # JavaScript modules
│ └── images/ # Images, icons, flags
├── pages/ # Application pages
│ ├── dashboard/ # Role dashboards
│ ├── countries/ # Country-specific pages
│ └── *.html # Feature pages
└── data/ # Demo JSON data

text

## 🚀 Quick Start

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/m-pesewa.git
   cd m-pesewa