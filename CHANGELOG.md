# Changelog

All notable changes to the M-Pesewa PWA will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dark mode support for better accessibility
- Advanced analytics dashboard for lenders
- Group chat functionality within circles
- Bulk ledger management tools
- API documentation portal
- Webhook support for third-party integrations

### Changed
- Improved service worker caching strategy
- Enhanced offline capabilities
- Updated security headers and CSP
- Optimized image loading with lazy loading

### Fixed
- Currency conversion issues in multi-country views
- Form validation edge cases in registration
- PWA installation prompt timing
- Offline synchronization conflicts

## [2.0.0] - 2024-01-24

### Major Release: Complete PWA Rewrite

#### Added
- **Complete Progressive Web App architecture**
  - Service worker with advanced caching strategies
  - Web App Manifest with proper PWA configuration
  - Offline functionality with background sync
  - Push notification support
  - Installable app experience

- **Country Module Expansion**
  - 13 African countries fully supported
  - Country-specific dashboards and calculators
  - Local currency handling (KSh, UGX, TZS, RWF, etc.)
  - Country flag badge system
  - Local contact information per country

- **Emergency Hub (20 Categories)**
  - Complete implementation of all 20 emergency loan categories
  - Individual pages for each emergency type
  - Category-specific lending rules
  - Success stories for each category

- **User Role System**
  - Dual-role support (borrower/lender)
  - Role switching capability
  - Separate dashboards for each role
  - Profile management for both roles

- **Subscription Tier System**
  - Basic tier (≤1,500/week)
  - Premium tier (≤5,000/week)
  - Super tier (≤20,000/week)
  - Lender of Lenders tier (≤50,000/week)
  - Subscription expiry management (28th of each month)

- **Ledger Management System**
  - Unlimited ledgers per lender
  - Automated ledger creation on loan approval
  - Manual repayment tracking
  - Interest (10%) and penalty (5% daily) calculation
  - Ledger status tracking (Active/Cleared)

- **Blacklist & Reputation System**
  - 5-star borrower rating system
  - Blacklist badge for defaulters (2+ months)
  - Blacklist removal by admin only
  - Public blacklist registry

- **Debt Collectors Module**
  - 200+ vetted debt collectors database
  - Searchable by name, location, country
  - Platform-managed validation system

- **Admin Dashboard**
  - Complete admin interface
  - User management capabilities
  - Ledger override permissions
  - Blacklist management
  - System health monitoring

- **Security Features**
  - PWA security headers
  - Content Security Policy (CSP)
  - XSS protection
  - Clickjacking prevention
  - Secure authentication flows

#### Changed
- **Complete UI/UX Redesign**
  - Modern, clean financial aesthetic
  - Mobile-first responsive design
  - Brand color palette implementation
  - Professional typography system
  - Floating card design with glow effects

- **Navigation Overhaul**
  - Sticky header with dropdown menus
  - Mobile-friendly hamburger menu
  - Breadcrumb navigation
  - Context-aware navigation

- **Performance Improvements**
  - Optimized asset loading
  - Lazy loading for images
  - Code splitting for JavaScript
  - Minimized CSS and JS bundles

- **Accessibility Enhancements**
  - WCAG AA compliance (4.5:1 contrast ratio)
  - Screen reader support
  - Keyboard navigation
  - Focus management
  - ARIA labels and roles

#### Technical Infrastructure
- **File Structure** - Organized enterprise-grade architecture
- **State Management** - Centralized store with slices
- **Routing System** - Client-side routing with guards
- **Component Library** - Atomic design system
- **CSS Architecture** - Design tokens and utility classes
- **Build Process** - GitHub Pages deployment ready

## [1.5.0] - 2020-06-15

### Added
- Initial country expansion beyond Kenya
- Basic group management functionality
- Simple ledger tracking system
- Email notification system
- Basic mobile responsiveness

### Changed
- Updated color scheme to current brand colors
- Improved form validation
- Enhanced security measures
- Better error handling

### Fixed
- Cross-browser compatibility issues
- Mobile display problems
- Form submission bugs
- Login session management

## [1.0.0] - 2016-11-30

### Initial Release
- Basic peer-to-peer lending platform
- Kenya-only operations
- Simple web interface
- Manual ledger tracking
- Basic user authentication
- Email-based communication

### Features
- User registration and profiles
- Basic loan request system
- Simple interest calculation (10%)
- Manual repayment tracking
- Email notifications

## Release Naming Convention

- **Major releases** (X.0.0): Significant new features or breaking changes
- **Minor releases** (0.X.0): New features without breaking changes
- **Patch releases** (0.0.X): Bug fixes and minor improvements

## Version Support Policy

| Version | Status       | Support Until | Notes                          |
|---------|--------------|---------------|--------------------------------|
| 2.0.0   | Current      | TBD           | Full PWA with all features     |
| 1.5.0   | Maintenance  | 2024-06-30    | Security fixes only            |
| 1.0.0   | Deprecated   | 2020-12-31    | No longer supported            |

## Breaking Changes

### From 1.5.0 to 2.0.0
- Complete rewrite from PHP backend to frontend PWA
- New file structure and architecture
- Different authentication system
- Changed API endpoints
- Updated database schema (if applicable)

### From 1.0.0 to 1.5.0
- Added multi-country support
- Introduced subscription tiers
- Changed user interface design
- Updated security protocols

## Migration Guides

### Migrating from 1.5.0 to 2.0.0
1. Export user data from old system
2. Install new PWA on fresh domain/subdomain
3. Import user data using migration tools
4. Notify users of new platform
5. Run parallel systems for 30 days
6. Decommission old system

### Migrating from 1.0.0 to 1.5.0
[Historical migration guide removed as version is deprecated]

## Known Issues

### Version 2.0.0
- [ ] Offline synchronization may have conflicts in edge cases
- [ ] Some older browsers may not support all PWA features
- [ ] Large ledger exports may timeout on slow connections
- [ ] Push notifications may be delayed on some mobile devices

### Version 1.5.0
- [Fixed] Mobile responsiveness issues on very small screens
- [Fixed] Email notifications sometimes marked as spam
- [Fixed] Session timeout not properly handled

### Version 1.0.0
- [Fixed] Security vulnerabilities in authentication
- [Fixed] Data loss in certain edge cases
- [Fixed] Performance issues with large datasets

## Deprecation Schedule

### To be deprecated in next major release:
- Support for Internet Explorer 11
- HTTP/1.1 protocol support (moving to HTTP/2 only)
- Old authentication tokens format

### Recently deprecated:
- jQuery dependencies (removed in 2.0.0)
- Bootstrap 3.x (replaced with custom CSS in 2.0.0)
- PHP backend (replaced with PWA in 2.0.0)

## Contributing to This Changelog

When adding entries to this changelog, please follow these guidelines:

1. **One change per line** - Each change should be on its own line
2. **Group by type** - Use Added/Changed/Fixed/Deprecated/Removed/Security
3. **Link to issues** - Reference GitHub issue numbers when applicable
4. **Be descriptive** - Explain what changed and why
5. **User-focused** - Write from the user's perspective
6. **Date format** - Use ISO 8601 format (YYYY-MM-DD)

Example:
```markdown
### Added
- New dashboard widget for loan statistics (#123)

### Fixed
- Login form validation error on mobile devices (#456)