# M-Pesewa - Emergency Micro-Lending Platform

M-Pesewa is a Progressive Web App (PWA) for emergency micro-lending within trusted social circles across Africa. The platform enables individuals to borrow and lend small amounts for urgent needs through country-specific, referral-only groups.

## Features

- **Strict Hierarchy**: Country → Groups → Lenders → Borrowers/Ledgers
- **16 Emergency Categories**: Specific loan purposes with floating card UI
- **Trust-Based System**: Referral-only group membership, 2 guarantors required
- **Dual Roles**: Users can be both borrowers and lenders (separate registrations)
- **Subscription Tiers**: 4 tiers for lenders (Basic, Premium, Super, Lender of Lenders)
- **Complete PWA**: Installable, offline-capable, mobile-responsive
- **13 Countries**: Kenya, Uganda, Tanzania, Rwanda, Burundi, Somalia, South Sudan, Ethiopia, DRC, Nigeria, South Africa, Ghana

## Business Rules Enforced

- No cross-country lending/borrowing
- No cross-group lending
- Maximum 4 groups per borrower (good rating required)
- Subscription required for lenders (expires 28th monthly)
- 10% weekly interest, 7-day repayment
- 5% daily penalty after 7 days, default after 2 months
- Blacklist system with admin-only removal
- Referral-only group entry

## Project Structure
/
├── index.html # Home page
├── manifest.json # PWA manifest
├── service-worker.js # Service worker for offline
├── README.md # This file
├── .nojekyll # Disable Jekyll on GitHub Pages
├── assets/
│ ├── css/ # All stylesheets
│ ├── js/ # All JavaScript files
│ └── images/ # Icons, logos, flags
├── pages/ # All HTML pages
│ ├── dashboard/ # Role-specific dashboards
│ ├── countries/ # Country-specific pages
│ └── [various pages].html
└── data/ JSON data files for demo


## Deployment on GitHub Pages

1. **Create a GitHub Repository**
   - Create a new repository named `M-Pesewa`
   - Initialize with a README if desired

2. **Upload Files**
   - Upload all project files to the repository
   - Ensure the structure matches exactly

3. **Enable GitHub Pages**
   - Go to repository **Settings**
   - Scroll to **Pages** section
   - Under **Source**, select **main branch** (or your branch)
   - Click **Save**
   - Your site will be published at `https://[username].github.io/M-Pesewa/`

4. **Force HTTPS** (Recommended)
   - In Pages settings, check **Enforce HTTPS**

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/M-Pesewa.git
   cd M-Pesewa