# M-Pesewa PWA

Emergency micro-lending platform built around trusted social groups. Enables individuals within the same country and group to lend and borrow short-term consumption loans.

## Features

- ✅ Progressive Web App (PWA) - Installable & offline capable
- ✅ Country isolation (13 African countries supported)
- ✅ Group-based lending circles
- ✅ Borrower & Lender dashboards
- ✅ Emergency loan categories (20+)
- ✅ Subscription-based lending tiers
- ✅ Ledger management system
- ✅ Blacklist registry
- ✅ Debt collectors directory
- ✅ Admin dashboard (hidden)

## Technology Stack

- HTML5
- CSS3 (Vanilla)
- Vanilla JavaScript
- PWA (Service Workers, Manifest)
- Static JSON for demo data

## Project Structure
/
├── index.html
├── manifest.json
├── service-worker.js
├── README.md
├── .nojekyll
├── assets/
│ ├── css/
│ ├── js/
│ └── images/
├── pages/
│ ├── dashboard/
│ ├── countries/
│ └── [all other pages]
└── data/
└── [JSON data files]

text

## Core Rules

1. **Hierarchy**: Global → Country → Groups → Lenders → Borrowers
2. **Isolation**: No cross-country lending or borrowing
3. **Group Limits**: Min 5, Max 1000 members per group
4. **Borrower Limits**: Max 4 groups (good rating required)
5. **Subscription**: Lenders must maintain active subscription
6. **Expiry**: Subscription expires 28th monthly
7. **Admin**: Can override any ledger or blacklist

## Supported Countries

1. Kenya (KSh)
2. Uganda (UGX)
3. Tanzania (TZS)
4. Rwanda (RWF)
5. Burundi (BIF)
6. Somalia (SOS)
7. South Sudan (SSP)
8. Ethiopia (ETB)
9. DRC (CDF)
10. Nigeria (NGN)
11. South Africa (ZAR)
12. Ghana (GHS)

## Deployment

Deploy to GitHub Pages:
1. Push to `main` branch
2. Go to Repository Settings → Pages
3. Select `main` branch as source
4. Site will be available at: `https://microokoaguarantycapital.github.io/m-pesewa/`

## Development

No build process required. All files are static HTML/CSS/JS.

## License

Proprietary - All rights reserved.