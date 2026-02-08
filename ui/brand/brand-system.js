/**
 * M-PESEWA BRAND BLOCK
 * Complete brand identity implementation with strict color scheme
 * Following Section C color guidelines exactly
 */

// Brand Colors - NON-NEGOTIABLE
export const BRAND_COLORS = {
  // Primary Brand Blue - headers, footers, main headings
  PRIMARY_BLUE: '#003366',
  
  // Secondary Brand Blue - links, floating card glow, secondary highlights
  SECONDARY_BLUE: '#0099ff',
  
  // Action Orange - Borrower buttons / Apply Now
  ACTION_ORANGE: '#f37021',
  
  // Trust Green - Lender sections, success indicators
  TRUST_GREEN: '#28a745',
  
  // Neutral Light - section separation background
  NEUTRAL_LIGHT: '#f8f9fa',
  
  // Pure White - main cards, body background
  PURE_WHITE: '#ffffff',
  
  // Text Colors
  DEEP_BLUE_TEXT: '#003366',
  DARK_GRAY_TEXT: '#555555',
  WHITE_TEXT: '#ffffff',
  LIGHT_GRAY_TEXT: '#d1d5db'
};

// Typography Scale
export const TYPOGRAPHY = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    secondary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem'      // 48px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  }
};

// Spacing Scale
export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem'       // 384px
};

// Border Radius
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'
};

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: `0 0 15px ${BRAND_COLORS.SECONDARY_BLUE}33`, // 20% opacity
  'glow-lg': `0 0 30px ${BRAND_COLORS.SECONDARY_BLUE}4d` // 30% opacity
};

// Z-Index Scale
export const Z_INDEX = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 'auto',
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
};

// Animation Durations
export const TRANSITIONS = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  timingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// Brand Identity Components
export const BRAND_COMPONENTS = {
  // Header Styles
  header: {
    background: BRAND_COLORS.PRIMARY_BLUE,
    text: BRAND_COLORS.WHITE_TEXT,
    height: '72px',
    sticky: true,
    dropdownBackground: BRAND_COLORS.PURE_WHITE,
    dropdownText: BRAND_COLORS.DEEP_BLUE_TEXT
  },
  
  // Footer Styles
  footer: {
    background: BRAND_COLORS.PRIMARY_BLUE,
    text: BRAND_COLORS.WHITE_TEXT,
    linkColor: BRAND_COLORS.LIGHT_GRAY_TEXT,
    linkHover: BRAND_COLORS.SECONDARY_BLUE,
    padding: '60px 40px 30px'
  },
  
  // Button Styles
  buttons: {
    borrower: {
      background: BRAND_COLORS.ACTION_ORANGE,
      text: BRAND_COLORS.WHITE_TEXT,
      hover: '#d45c1a',
      focus: '0 0 0 3px rgba(243, 112, 33, 0.5)'
    },
    lender: {
      background: BRAND_COLORS.TRUST_GREEN,
      text: BRAND_COLORS.WHITE_TEXT,
      hover: '#218838',
      focus: '0 0 0 3px rgba(40, 167, 69, 0.5)'
    },
    secondary: {
      background: BRAND_COLORS.SECONDARY_BLUE,
      text: BRAND_COLORS.WHITE_TEXT,
      hover: '#007acc',
      focus: '0 0 0 3px rgba(0, 153, 255, 0.5)'
    },
    outline: {
      background: 'transparent',
      text: BRAND_COLORS.PRIMARY_BLUE,
      border: `2px solid ${BRAND_COLORS.PRIMARY_BLUE}`,
      hover: BRAND_COLORS.PRIMARY_BLUE,
      hoverText: BRAND_COLORS.WHITE_TEXT
    }
  },
  
  // Card Styles
  cards: {
    background: BRAND_COLORS.PURE_WHITE,
    text: BRAND_COLORS.DARK_GRAY_TEXT,
    title: BRAND_COLORS.DEEP_BLUE_TEXT,
    border: '1px solid #e5e7eb',
    borderRadius: BORDER_RADIUS.lg,
    shadow: SHADOWS.DEFAULT,
    glow: SHADOWS.glow,
    padding: SPACING[6],
    hover: {
      transform: 'translateY(-2px)',
      shadow: SHADOWS.lg,
      glow: SHADOWS['glow-lg']
    }
  },
  
  // Section Styles
  sections: {
    light: {
      background: BRAND_COLORS.NEUTRAL_LIGHT,
      text: BRAND_COLORS.DARK_GRAY_TEXT
    },
    dark: {
      background: BRAND_COLORS.PRIMARY_BLUE,
      text: BRAND_COLORS.WHITE_TEXT
    },
    white: {
      background: BRAND_COLORS.PURE_WHITE,
      text: BRAND_COLORS.DARK_GRAY_TEXT
    }
  },
  
  // Form Styles
  forms: {
    input: {
      background: BRAND_COLORS.PURE_WHITE,
      border: '1px solid #d1d5db',
      focusBorder: BRAND_COLORS.SECONDARY_BLUE,
      focusShadow: `0 0 0 3px rgba(0, 153, 255, 0.1)`,
      text: BRAND_COLORS.DEEP_BLUE_TEXT,
      placeholder: '#9ca3af'
    },
    label: {
      text: BRAND_COLORS.DEEP_BLUE_TEXT,
      required: BRAND_COLORS.ACTION_ORANGE
    },
    error: {
      text: '#dc2626',
      border: '#dc2626',
      background: '#fef2f2'
    },
    success: {
      text: BRAND_COLORS.TRUST_GREEN,
      border: BRAND_COLORS.TRUST_GREEN,
      background: '#f0fdf4'
    }
  },
  
  // Alert Styles
  alerts: {
    info: {
      background: '#dbeafe',
      text: '#1e40af',
      border: '#93c5fd',
      icon: BRAND_COLORS.SECONDARY_BLUE
    },
    success: {
      background: '#dcfce7',
      text: '#166534',
      border: '#86efac',
      icon: BRAND_COLORS.TRUST_GREEN
    },
    warning: {
      background: '#fef3c7',
      text: '#92400e',
      border: '#fcd34d',
      icon: BRAND_COLORS.ACTION_ORANGE
    },
    error: {
      background: '#fee2e2',
      text: '#991b1b',
      border: '#fca5a5',
      icon: '#dc2626'
    }
  },
  
  // Badge Styles
  badges: {
    primary: {
      background: BRAND_COLORS.PRIMARY_BLUE,
      text: BRAND_COLORS.WHITE_TEXT
    },
    secondary: {
      background: BRAND_COLORS.SECONDARY_BLUE,
      text: BRAND_COLORS.WHITE_TEXT
    },
    success: {
      background: BRAND_COLORS.TRUST_GREEN,
      text: BRAND_COLORS.WHITE_TEXT
    },
    warning: {
      background: BRAND_COLORS.ACTION_ORANGE,
      text: BRAND_COLORS.WHITE_TEXT
    },
    blacklist: {
      background: '#000000',
      text: BRAND_COLORS.WHITE_TEXT,
      shadow: '0 0 10px rgba(220, 38, 38, 0.5)'
    },
    rating: {
      background: '#fbbf24',
      text: '#92400e'
    }
  }
};

// Brand Rules - STRICT ENFORCEMENT
export const BRAND_RULES = {
  // Color Usage Rules
  colorRules: [
    {
      rule: 'Never place Deep Blue text on Orange or Green buttons',
      enforcement: 'Always use White text on Action Orange and Trust Green buttons'
    },
    {
      rule: 'White background must use Dark text (#003366)',
      enforcement: 'Text on white backgrounds must be #003366 or #555555'
    },
    {
      rule: 'Dark background must use White text (#ffffff)',
      enforcement: 'Text on #003366 or #1f2a37 backgrounds must be #ffffff'
    },
    {
      rule: 'Cards must float with light sky blue glow (#0099ff)',
      enforcement: 'All interactive cards must have box-shadow with #0099ff glow'
    },
    {
      rule: 'Header background must be #003366',
      enforcement: 'Global header must use Primary Brand Blue #003366'
    }
  ],
  
  // Component Rules
  componentRules: [
    {
      rule: 'Header must be responsive, sticky, with dropdowns for all menus',
      enforcement: 'Implement mobile hamburger menu and desktop dropdowns'
    },
    {
      rule: 'Footer must have multi-column layout with Deep Blue background',
      enforcement: '6-column footer structure with #003366 background'
    },
    {
      rule: 'Borrower buttons use #f37021, Lender buttons use #28a745',
      enforcement: 'Color-coded CTAs based on user role'
    },
    {
      rule: 'Hero cards must float with light shadow/glow',
      enforcement: 'Apply SHADOWS.glow to hero section cards'
    },
    {
      rule: 'Sections must have proper padding and visual hierarchy',
      enforcement: 'Use SPACING scale for consistent section padding'
    }
  ],
  
  // Typography Rules
  typographyRules: [
    {
      rule: 'H1/H2 headings use #003366',
      enforcement: 'All main headings use PRIMARY_BLUE color'
    },
    {
      rule: 'Body text uses #555555',
      enforcement: 'Paragraphs and general text use DARK_GRAY_TEXT'
    },
    {
      rule: 'CTA buttons use white text',
      enforcement: 'All call-to-action buttons must have white text'
    },
    {
      rule: 'Navigation flow: Problem → Solution → Trust → Call-to-Action',
      enforcement: 'Landing page must follow this exact sequence'
    }
  ],
  
  // Validation function to check brand compliance
  validateBrandCompliance: (element) => {
    const violations = [];
    
    // Check background/text color combinations
    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    // Rule 1: No Deep Blue text on Orange/Green buttons
    if (element.classList.contains('btn-borrower') || element.classList.contains('btn-lender')) {
      if (textColor === 'rgb(0, 51, 102)' || textColor === '#003366') {
        violations.push('Deep Blue text on Orange/Green button');
      }
    }
    
    // Rule 2: White background with Dark text
    if (bgColor === 'rgb(255, 255, 255)' || bgColor === '#ffffff') {
      const allowedTextColors = ['rgb(0, 51, 102)', 'rgb(85, 85, 85)', '#003366', '#555555'];
      if (!allowedTextColors.includes(textColor)) {
        violations.push('Invalid text color on white background');
      }
    }
    
    // Rule 3: Dark background with White text
    const darkBackgrounds = ['rgb(0, 51, 102)', 'rgb(31, 42, 55)', '#003366', '#1f2a37'];
    if (darkBackgrounds.includes(bgColor) && textColor !== 'rgb(255, 255, 255)') {
      violations.push('Dark background must use white text');
    }
    
    // Rule 4: Cards must have glow
    if (element.classList.contains('card') || element.classList.contains('category-card')) {
      const boxShadow = style.boxShadow;
      if (!boxShadow.includes('rgba(0, 153, 255')) {
        violations.push('Card missing #0099ff glow');
      }
    }
    
    return violations;
  }
};

// Country-specific brand adaptations
export const COUNTRY_BRANDS = {
  KE: { // Kenya
    currency: 'KSh',
    contact: '+254 709 219 000',
    flag: '🇰🇪',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#006400' // Dark green accent
    }
  },
  UG: { // Uganda
    currency: 'UGX',
    contact: '+256 392 175 546',
    flag: '🇺🇬',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#FCD116' // Yellow accent
    }
  },
  TZ: { // Tanzania
    currency: 'TZS',
    contact: '+255 659 073 010',
    flag: '🇹🇿',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#1EB53A' // Green accent
    }
  },
  RW: { // Rwanda
    currency: 'RWF',
    contact: '+250 791 590 801',
    flag: '🇷🇼',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#00A1DE' // Blue accent
    }
  },
  CD: { // DRC
    currency: 'CDF',
    contact: '+243 81 000 0000',
    flag: '🇨🇩',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#CE1126' // Red accent
    }
  },
  BI: { // Burundi
    currency: 'BIF',
    contact: '+257 79 000 000',
    flag: '🇧🇮',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#CE1126' // Red accent
    }
  },
  NG: { // Nigeria
    currency: 'NGN',
    contact: '+234 800 000 0000',
    flag: '🇳🇬',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#008751' // Green accent
    }
  },
  GH: { // Ghana
    currency: 'GHS',
    contact: '+233 24 000 0000',
    flag: '🇬🇭',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#CE1126' // Red accent
    }
  },
  SS: { // South Sudan
    currency: 'SSP',
    contact: '+211 955 000 000',
    flag: '🇸🇸',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#0F47AF' // Blue accent
    }
  },
  SO: { // Somalia
    currency: 'SOS',
    contact: '+252 63 0000000',
    flag: '🇸🇴',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#4189DD' // Light blue accent
    }
  },
  ZA: { // South Africa
    currency: 'ZAR',
    contact: '+27 11 000 0000',
    flag: '🇿🇦',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#FFB612' // Gold accent
    }
  },
  ET: { // Ethiopia
    currency: 'ETB',
    contact: '+251 11 000 0000',
    flag: '🇪🇹',
    theme: {
      primary: BRAND_COLORS.PRIMARY_BLUE,
      secondary: '#DA121A' // Red accent
    }
  }
};

// Brand utility functions
export const BrandUtils = {
  // Get brand colors
  getColors: () => BRAND_COLORS,
  
  // Get country brand
  getCountryBrand: (countryCode) => COUNTRY_BRANDS[countryCode] || COUNTRY_BRANDS.KE,
  
  // Apply brand styles to element
  applyBrandStyles: (element, componentType) => {
    const styles = BRAND_COMPONENTS[componentType];
    if (!styles) return;
    
    Object.keys(styles).forEach(property => {
      if (typeof styles[property] === 'string') {
        element.style[property] = styles[property];
      }
    });
  },
  
  // Create branded button
  createButton: (text, type = 'secondary', size = 'medium') => {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('btn', `btn-${type}`, `btn-${size}`);
    
    const buttonStyle = BRAND_COMPONENTS.buttons[type];
    if (buttonStyle) {
      button.style.backgroundColor = buttonStyle.background;
      button.style.color = buttonStyle.text;
      button.style.border = buttonStyle.border || 'none';
      button.style.padding = size === 'large' ? '12px 24px' : '8px 16px';
      button.style.borderRadius = BORDER_RADIUS.DEFAULT;
      button.style.fontWeight = TYPOGRAPHY.fontWeight.semibold;
      button.style.cursor = 'pointer';
      button.style.transition = 'all 0.2s ease';
      
      // Add hover effect
      button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = buttonStyle.hover;
        if (buttonStyle.hoverText) {
          button.style.color = buttonStyle.hoverText;
        }
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = buttonStyle.background;
        if (buttonStyle.hoverText) {
          button.style.color = buttonStyle.text;
        }
      });
    }
    
    return button;
  },
  
  // Create branded card
  createCard: (content, options = {}) => {
    const card = document.createElement('div');
    card.classList.add('card');
    
    // Apply base card styles
    const cardStyle = BRAND_COMPONENTS.cards;
    card.style.backgroundColor = cardStyle.background;
    card.style.color = cardStyle.text;
    card.style.borderRadius = cardStyle.borderRadius;
    card.style.boxShadow = cardStyle.shadow;
    card.style.padding = cardStyle.padding;
    card.style.border = cardStyle.border;
    card.style.transition = 'all 0.3s ease';
    
    // Add glow if specified
    if (options.glow) {
      card.style.boxShadow = cardStyle.glow;
    }
    
    // Add hover effects if interactive
    if (options.interactive) {
      card.style.cursor = 'pointer';
      card.addEventListener('mouseenter', () => {
        card.style.transform = cardStyle.hover.transform;
        card.style.boxShadow = cardStyle.hover.shadow;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
        card.style.boxShadow = options.glow ? cardStyle.glow : cardStyle.shadow;
      });
    }
    
    // Add content
    if (typeof content === 'string') {
      card.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      card.appendChild(content);
    }
    
    return card;
  },
  
  // Validate brand compliance on page
  validatePageCompliance: () => {
    const violations = [];
    
    // Check all buttons
    document.querySelectorAll('button, .btn, a[role="button"]').forEach(btn => {
      const btnViolations = BRAND_RULES.validateBrandCompliance(btn);
      if (btnViolations.length > 0) {
        violations.push({
          element: btn,
          violations: btnViolations
        });
      }
    });
    
    // Check all cards
    document.querySelectorAll('.card, .category-card, .emergency-card').forEach(card => {
      const cardViolations = BRAND_RULES.validateBrandCompliance(card);
      if (cardViolations.length > 0) {
        violations.push({
          element: card,
          violations: cardViolations
        });
      }
    });
    
    // Check header
    const header = document.querySelector('header');
    if (header) {
      const headerStyle = window.getComputedStyle(header);
      if (headerStyle.backgroundColor !== 'rgb(0, 51, 102)' && headerStyle.backgroundColor !== '#003366') {
        violations.push({
          element: header,
          violations: ['Header background must be #003366']
        });
      }
    }
    
    // Check footer
    const footer = document.querySelector('footer');
    if (footer) {
      const footerStyle = window.getComputedStyle(footer);
      if (footerStyle.backgroundColor !== 'rgb(0, 51, 102)' && footerStyle.backgroundColor !== '#003366') {
        violations.push({
          element: footer,
          violations: ['Footer background must be #003366']
        });
      }
    }
    
    return violations;
  },
  
  // Apply brand CSS variables to document
  applyBrandVariables: () => {
    const root = document.documentElement;
    
    // Color variables
    Object.entries(BRAND_COLORS).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key.toLowerCase().replace(/_/g, '-')}`, value);
    });
    
    // Typography variables
    Object.entries(TYPOGRAPHY.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });
    
    // Spacing variables
    Object.entries(SPACING).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Border radius variables
    Object.entries(BORDER_RADIUS).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key.toLowerCase()}`, value);
    });
    
    // Shadow variables
    Object.entries(SHADOWS).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key.toLowerCase().replace(/_/g, '-')}`, value);
    });
  }
};

// Export brand system
export default {
  colors: BRAND_COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  zIndex: Z_INDEX,
  transitions: TRANSITIONS,
  components: BRAND_COMPONENTS,
  rules: BRAND_RULES,
  countryBrands: COUNTRY_BRANDS,
  utils: BrandUtils
};