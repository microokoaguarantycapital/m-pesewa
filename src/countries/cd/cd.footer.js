/**
 * M-PESEWA DRC FOOTER CONFIGURATION
 * STRICT COUNTRY-SPECIFIC FOOTER FOR DEMOCRATIC REPUBLIC OF CONGO
 * Last Updated: 2026-01-24
 */

const DRC_FOOTER = {
    // ============================================
    // 1️⃣ FOOTER STRUCTURE & HIERARCHY
    // ============================================
    STRUCTURE: {
        VERSION: '3.1',
        UPDATED: '2026-01-24',
        COLUMNS: 6,
        MAX_LINKS_PER_COLUMN: 8,
        STICKY_FOOTER: true,
        SHOW_ON_ALL_PAGES: true
    },

    // ============================================
    // 2️⃣ BRANDING & IDENTITY
    // ============================================
    BRANDING: {
        LOGO: {
            TEXT: 'M-PESEWA RDC',
            SUBTEXT: 'Finance d\'Urgence dans des Cercles de Confiance',
            COUNTRY_BADGE: '🇨🇩'
        },
        
        TAGLINE: {
            FR: 'Votre partenaire de confiance pour les prêts d\'urgence en RDC',
            SW: 'Mshirika wako wa kuaminika kwa mikopo ya dharura nchini DRC',
            LN: 'Mokonzi na yo ya kondima mpo na misala ya kobongisama na RDC'
        },
        
        LEGAL_ENTITY: 'M-PESEWA RDC SARL',
        REGISTRATION_NUMBER: 'RC/KIN/2020/B/12345',
        TAX_ID: 'ID-2020-001234-KIN'
    },

    // ============================================
    // 3️⃣ COLUMN 1: BORROWING (Emprunt)
    // ============================================
    COLUMN_1: {
        TITLE: {
            FR: 'Emprunter',
            SW: 'Kopa',
            LN: 'Kosala'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'Obtenir un Prêt d\'Urgence',
                    SW: 'Pata Mkopo wa Dharura',
                    LN: 'Zwa Mosala ya Kobongisama'
                },
                URL: '/cd/borrower/apply.html',
                ICON: '🚨',
                PRIORITY: 1
            },
            
            {
                TEXT: {
                    FR: 'Prêt Personnel en Ligne',
                    SW: 'Mkopo Binafsi Mtandaoni',
                    LN: 'Mosala ya Molimo na Intaneti'
                },
                URL: '/cd/borrower/apply.html?type=personal',
                ICON: '💻',
                PRIORITY: 2
            },
            
            {
                TEXT: {
                    FR: 'Prêt pour Affaires',
                    SW: 'Mkopo wa Biashara',
                    LN: 'Mosala ya Business'
                },
                URL: '/cd/borrower/apply.html?type=business',
                ICON: '🏢',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Comment Demander',
                    SW: 'Jinsi ya Kuomba',
                    LN: 'Ndenge ya Kosenga'
                },
                URL: '/cd/how-it-works.html#borrower',
                ICON: '❓',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Emprunteurs Actifs',
                    SW: 'Wakopaji Waliohai',
                    LN: 'Basali Ba Kati'
                },
                URL: '/cd/community/borrowers.html',
                ICON: '👥',
                PRIORITY: 5
            },
            
            {
                TEXT: {
                    FR: 'Calculateur de Prêt',
                    SW: 'Kikokotoo cha Mkopo',
                    LN: 'Mosalisi ya Mosala'
                },
                URL: '/cd/tools/calculator.html',
                ICON: '🧮',
                PRIORITY: 6
            },
            
            {
                TEXT: {
                    FR: 'FAQ pour Emprunteurs',
                    SW: 'Maswali ya Wakopaji',
                    LN: 'Mituna ya Basali'
                },
                URL: '/cd/faq.html#borrower',
                ICON: '💡',
                PRIORITY: 7
            }
        ],
        
        DESCRIPTION: {
            FR: 'Accès rapide à des prêts d\'urgence pour vos besoins quotidiens',
            SW: 'Ufikiaji wa haraka kwa mikopo ya dharura kwa mahitaji yako ya kila siku',
            LN: 'Kokota na mbangu na misala ya kobongisama mpo na bango na yo ya mokolo na mokolo'
        }
    },

    // ============================================
    // 4️⃣ COLUMN 2: LENDING (Prêt)
    // ============================================
    COLUMN_2: {
        TITLE: {
            FR: 'Prêter',
            SW: 'Kopesha',
            LN: 'Kopeya'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'Prêt Intelligent',
                    SW: 'Mkoko Mwerevu',
                    LN: 'Mosala ya Mayele'
                },
                URL: '/cd/lender/rules.html',
                ICON: '🧠',
                PRIORITY: 1
            },
            
            {
                TEXT: {
                    FR: 'Pourquoi Prêter chez M-PESEWA?',
                    SW: 'Kwa Nini Kukopesha kwa M-PESEWA?',
                    LN: 'Mpo na Nini Kopeya na M-PESEWA?'
                },
                URL: '/cd/lender/why-lend.html',
                ICON: '⭐',
                PRIORITY: 2
            },
            
            {
                TEXT: {
                    FR: 'Comment Commencer à Prêter',
                    SW: 'Jinsi ya Kuanza Kukopesha',
                    LN: 'Ndenge ya Kobanda Kopeya'
                },
                URL: '/cd/lender/how-to-lend.html',
                ICON: '🚀',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Prêteurs Actifs',
                    SW: 'Wakopeshi Waliohai',
                    LN: 'Bapeyi Ba Kati'
                },
                URL: '/cd/community/lenders.html',
                ICON: '💰',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Gestion des Registres',
                    SW: 'Usimamizi wa Rekodi',
                    LN: 'Kobongisa Ba Registre'
                },
                URL: '/cd/lender/portfolio.html',
                ICON: '📊',
                PRIORITY: 5
            },
            
            {
                TEXT: {
                    FR: 'Analyse des Risques',
                    SW: 'Uchambuzi wa Hatari',
                    LN: 'Koyekola Ba Risque'
                },
                URL: '/cd/lender/risk.html',
                ICON: '📈',
                PRIORITY: 6
            },
            
            {
                TEXT: {
                    FR: 'Abonnements Prêteur',
                    SW: 'Usajili wa Wakopeshi',
                    LN: 'Ba Abonnement ya Bapeyi'
                },
                URL: '/cd/subscription/plans.html',
                ICON: '📋',
                PRIORITY: 7
            }
        ],
        
        DESCRIPTION: {
            FR: 'Générez des revenus en aidant votre communauté de manière responsable',
            SW: 'Zarisha mapato kwa kusaidia jamii yako kwa njia ya wajibu',
            LN: 'Sala ba revenu na kosalisa communautaire na yo na ndenge ya responsabilité'
        }
    },

    // ============================================
    // 5️⃣ COLUMN 3: HOW IT WORKS (Fonctionnement)
    // ============================================
    COLUMN_3: {
        TITLE: {
            FR: 'Fonctionnement',
            SW: 'Jinsi Inavyofanya Kazi',
            LN: 'Ndenge Esalaka'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'Prêt P2P Expliqué',
                    SW: 'Mkopo P2P Umeelezwa',
                    LN: 'Mosala P2P Esengeli'
                },
                URL: '/cd/how-it-works.html',
                ICON: '🔄',
                PRIORITY: 1
            },
            
            {
                TEXT: {
                    FR: 'Notre Rôle',
                    SW: 'Jukumu Letu',
                    LN: 'Loisi na Bisö'
                },
                URL: '/cd/about.html#our-role',
                ICON: '🎯',
                PRIORITY: 2
            },
            
            {
                TEXT: {
                    FR: 'Abonnements',
                    SW: 'Usajili',
                    LN: 'Ba Abonnement'
                },
                URL: '/cd/subscription/plans.html',
                ICON: '💳',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Liste Noire',
                    SW: 'Orodha Nyeusi',
                    LN: 'Lisanga ya Moinde'
                },
                URL: '/cd/blacklist/public.html',
                ICON: '🚫',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Recouvreurs de Créances',
                    SW: 'Wakusanyaji Deni',
                    LN: 'Batokisi ya Ba Dette'
                },
                URL: '/cd/collectors.html',
                ICON: '👮',
                PRIORITY: 5
            },
            
            {
                TEXT: {
                    FR: 'Système de Réputation',
                    SW: 'Mfumo wa Sifa',
                    LN: 'Système ya Lisanga'
                },
                URL: '/cd/how-it-works.html#reputation',
                ICON: '⭐',
                PRIORITY: 6
            },
            
            {
                TEXT: {
                    FR: 'Isolation par Pays',
                    SW: 'Ujitenga kwa Nchi',
                    LN: 'Kokabwana na Mboka'
                },
                URL: '/cd/how-it-works.html#country-isolation',
                ICON: '🌍',
                PRIORITY: 7
            }
        ],
        
        DESCRIPTION: {
            FR: 'Comprendre notre modèle unique de prêt communautaire',
            SW: 'Elewa muundo wetu wa kipekee wa mkopo wa kijamii',
            LN: 'Yeba modele na bisö ya mosala ya communautaire'
        }
    },

    // ============================================
    // 6️⃣ COLUMN 4: ABOUT US (À Propos)
    // ============================================
    COLUMN_4: {
        TITLE: {
            FR: 'À Propos',
            SW: 'Kuhusu Sisi',
            LN: 'Etali Bisö'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'À Propos de M-PESEWA',
                    SW: 'Kuhusu M-PESEWA',
                    LN: 'Etali M-PESEWA'
                },
                URL: '/cd/about.html',
                ICON: '🏢',
                PRIORITY: 1
            },
            
            {
                TEXT: {
                    FR: 'Équipe & Conseil Consultatif',
                    SW: 'Timu na Baraza la Ushauri',
                    LN: 'Bato na Conseil ya Kotosa'
                },
                URL: '/cd/about.html#team',
                ICON: '👥',
                PRIORITY: 2
            },
            
            {
                TEXT: {
                    FR: 'Actualités & Carrières',
                    SW: 'Habari & Ajira',
                    LN: 'Ba Sango & Ba Karriere'
                },
                URL: '/cd/news.html',
                ICON: '📰',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Blog / FAQ',
                    SW: 'Blog / Maswali',
                    LN: 'Blog / Mituna'
                },
                URL: '/cd/faq.html',
                ICON: '📝',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Nous Contacter',
                    SW: 'Wasiliana Nasi',
                    LN: 'Benga Bisö'
                },
                URL: '/cd/contact.html',
                ICON: '📞',
                PRIORITY: 5
            },
            
            {
                TEXT: {
                    FR: 'Presse & Médias',
                    SW: 'Vyombo vya Habari',
                    LN: 'Ba Presse & Ba Media'
                },
                URL: '/cd/press.html',
                ICON: '🎙️',
                PRIORITY: 6
            },
            
            {
                TEXT: {
                    FR: 'Partenariats',
                    SW: 'Ushirikiano',
                    LN: 'Ba Partenariat'
                },
                URL: '/cd/partners.html',
                ICON: '🤝',
                PRIORITY: 7
            }
        ],
        
        DESCRIPTION: {
            FR: 'Découvrez notre mission, notre équipe et notre impact',
            SW: 'Gundua dhamira yetu, timu yetu na athari yetu',
            LN: 'Yeba mission na bisö, bato na bisö mpe impact na bisö'
        }
    },

    // ============================================
    // 7️⃣ COLUMN 5: LEGAL & COMPLIANCE (Légal)
    // ============================================
    COLUMN_5: {
        TITLE: {
            FR: 'Légal & Conformité',
            SW: 'Kisheria & Uzingatiaji',
            LN: 'Mibeko & Kobongisama'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'Conditions Générales',
                    SW: 'Masharti ya Jumla',
                    LN: 'Ba Condition Générale'
                },
                URL: '/cd/terms.html',
                ICON: '📄',
                PRIORITY: 1,
                REQUIRES_COOKIES: true
            },
            
            {
                TEXT: {
                    FR: 'Politique de Confidentialité',
                    SW: 'Sera ya Faragha',
                    LN: 'Politique ya Confidentialité'
                },
                URL: '/cd/privacy.html',
                ICON: '🔒',
                PRIORITY: 2,
                REQUIRES_COOKIES: true
            },
            
            {
                TEXT: {
                    FR: 'Traitement des Réclamations',
                    SW: 'Uchakataji wa Malalamiko',
                    LN: 'Kobongisa Ba Réclamation'
                },
                URL: '/cd/grievance.html',
                ICON: '⚖️',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Code de Bonnes Pratiques',
                    SW: 'Kanuni za Mazoea Bora',
                    LN: 'Code ya Ba Pratique ya Malamu'
                },
                URL: '/cd/fair-practices.html',
                ICON: '✅',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Conformité AML/CFT',
                    SW: 'Uzingatiaji AML/CFT',
                    LN: 'Kobongisama AML/CFT'
                },
                URL: '/cd/compliance/aml.html',
                ICON: '💰',
                PRIORITY: 5
            },
            
            {
                TEXT: {
                    FR: 'Protection des Données',
                    SW: 'Ulinzi wa Data',
                    LN: 'Kobatela Ba Données'
                },
                URL: '/cd/compliance/data-protection.html',
                ICON: '📱',
                PRIORITY: 6
            },
            
            {
                TEXT: {
                    FR: 'Rapports Réglementaires',
                    SW: 'Ripoti za Udhibiti',
                    LN: 'Ba Rapport Réglementaire'
                },
                URL: '/cd/compliance/reports.html',
                ICON: '📊',
                PRIORITY: 7
            }
        ],
        
        DESCRIPTION: {
            FR: 'Conformité totale avec les lois de la RDC',
            SW: 'Uzingatiaji kamili wa sheria za DRC',
            LN: 'Kobongisama mobimba na mibeko ya RDC'
        }
    },

    // ============================================
    // 8️⃣ COLUMN 6: PARTNERSHIPS & SOCIAL (Partenariats)
    // ============================================
    COLUMN_6: {
        TITLE: {
            FR: 'Partenariats',
            SW: 'Ushirikiano',
            LN: 'Ba Partenariat'
        },
        
        LINKS: [
            {
                TEXT: {
                    FR: 'Devenir Partenaire',
                    SW: 'Kuwa Mshirika',
                    LN: 'Kozala Partenaire'
                },
                URL: '/cd/partners/join.html',
                ICON: '🤝',
                PRIORITY: 1
            },
            
            {
                TEXT: {
                    FR: 'Partenaires Bancaires',
                    SW: 'Washirika Benki',
                    LN: 'Ba Partenaire ya Banki'
                },
                URL: '/cd/partners/banks.html',
                ICON: '🏦',
                PRIORITY: 2
            },
            
            {
                TEXT: {
                    FR: 'Opérateurs Télécoms',
                    SW: 'Waendeshaji Simu',
                    LN: 'Ba Opérateur ya Télécom'
                },
                URL: '/cd/partners/telcos.html',
                ICON: '📱',
                PRIORITY: 3
            },
            
            {
                TEXT: {
                    FR: 'Agents M-PESEWA',
                    SW: 'Maajenti wa M-PESEWA',
                    LN: 'Ba Agent ya M-PESEWA'
                },
                URL: '/cd/partners/agents.html',
                ICON: '👨‍💼',
                PRIORITY: 4
            },
            
            {
                TEXT: {
                    FR: 'Programme d\'Affiliation',
                    SW: 'Mpango wa Ushirika',
                    LN: 'Programme ya Affiliation'
                },
                URL: '/cd/partners/affiliate.html',
                ICON: '👥',
                PRIORITY: 5
            }
        ],
        
        SOCIAL_MEDIA: [
            {
                PLATFORM: 'Facebook',
                ICON: '📘',
                URL: 'https://facebook.com/mpesewa.drc',
                USERNAME: '@mpesewa.drc'
            },
            
            {
                PLATFORM: 'Twitter',
                ICON: '🐦',
                URL: 'https://twitter.com/mpesewa_drc',
                USERNAME: '@mpesewa_drc'
            },
            
            {
                PLATFORM: 'Instagram',
                ICON: '📸',
                URL: 'https://instagram.com/mpesewa.drc',
                USERNAME: '@mpesewa.drc'
            },
            
            {
                PLATFORM: 'LinkedIn',
                ICON: '💼',
                URL: 'https://linkedin.com/company/mpesewa-drc',
                USERNAME: 'M-PESEWA RDC'
            },
            
            {
                PLATFORM: 'YouTube',
                ICON: '📺',
                URL: 'https://youtube.com/@mpesewa_drc',
                USERNAME: '@mpesewa_drc'
            },
            
            {
                PLATFORM: 'WhatsApp',
                ICON: '💬',
                URL: 'https://wa.me/243810000000',
                USERNAME: '+243 81 000 0000'
            }
        ],
        
        DESCRIPTION: {
            FR: 'Rejoignez notre réseau croissant de partenaires',
            SW: 'Jiunge na mtandao wetu unaokua wa washirika',
            LN: 'Kotisana na réseau na bisö ya ba partenaire'
        }
    },

    // ============================================
    // 9️⃣ COUNTRY TICKER & CONTACTS
    // ============================================
    COUNTRY_INFO: {
        TICKER: {
            ENABLED: true,
            SPEED: '20s',
            DIRECTION: 'left-to-right',
            COUNTRIES: [
                '🇨🇩 République Démocratique du Congo',
                '🇰🇪 Kenya',
                '🇺🇬 Uganda',
                '🇹🇿 Tanzania',
                '🇷🇼 Rwanda',
                '🇧🇮 Burundi',
                '🇸🇸 South Sudan',
                '🇿🇦 South Africa',
                '🇳🇬 Nigeria',
                '🇬🇭 Ghana',
                '🇪🇹 Ethiopia',
                '🇸🇴 Somalia'
            ]
        },
        
        CONTACT_INFO: {
            PRIMARY: {
                PHONE: '+243 81 000 0000',
                WHATSAPP: '+243 89 000 0000',
                EMAIL: 'info@m-pesewa.cd',
                ADDRESS: 'Avenue des Aviateurs, Gombe, Kinshasa, RDC'
            },
            
            REGIONAL_OFFICES: [
                {
                    CITY: 'Kinshasa',
                    PHONE: '+243 81 111 1111',
                    ADDRESS: 'Immeuble Gécamines, Gombe'
                },
                
                {
                    CITY: 'Lubumbashi',
                    PHONE: '+243 81 222 2222',
                    ADDRESS: 'Avenue du Commerce, Lubumbashi'
                },
                
                {
                    CITY: 'Goma',
                    PHONE: '+243 81 333 3333',
                    ADDRESS: 'Avenue de la Paix, Goma'
                },
                
                {
                    CITY: 'Bukavu',
                    PHONE: '+243 81 444 4444',
                    ADDRESS: 'Avenue Pende, Bukavu'
                }
            ],
            
            SUPPORT_HOURS: {
                WEEKDAYS: '07:00 - 19:00',
                SATURDAY: '08:00 - 16:00',
                SUNDAY: '09:00 - 14:00',
                TIMEZONE: 'GMT+1 (Kinshasa)'
            }
        }
    },

    // ============================================
    // 🔟 BOTTOM BAR & LEGAL
    // ============================================
    BOTTOM_BAR: {
        COPYRIGHT: {
            TEXT: {
                FR: '© 2016–2026, M-PESEWA RDC SARL — Tous droits réservés',
                SW: '© 2016–2026, M-PESEWA RDC SARL — Haki zote zimehifadhiwa',
                LN: '© 2016–2026, M-PESEWA RDC SARL — Ba droit mobimba'
            },
            
            VERSION: 'v3.1.0',
            BUILD_DATE: '2026-01-24'
        },
        
        LEGAL_LINKS: [
            {
                TEXT: { FR: 'Plan du Site', SW: 'Ramani ya Tovuti', LN: 'Plan ya Site' },
                URL: '/cd/sitemap.html'
            },
            
            {
                TEXT: { FR: 'Accessibilité', SW: 'Upatikanaji', LN: 'Accessibilité' },
                URL: '/cd/accessibility.html'
            },
            
            {
                TEXT: { FR: 'Sécurité', SW: 'Usalama', LN: 'Sécurité' },
                URL: '/cd/security.html'
            },
            
            {
                TEXT: { FR: 'Signaler un Problème', SW: 'Ripoti Tatizo', LN: 'Kolobela Motuna' },
                URL: '/cd/report.html'
            },
            
            {
                TEXT: { FR: 'Préférences Cookies', SW: 'Mapendezi ya Kuki', LN: 'Ba Préférence ya Cookie' },
                URL: '/cd/cookie-settings.html',
                REQUIRES_COOKIES: true
            }
        ],
        
        REGULATORY_DISCLOSURES: [
            {
                TEXT: {
                    FR: 'Agréé par la Banque Centrale du Congo',
                    SW: 'Imekubaliwa na Benki Kuu ya Congo',
                    LN: 'Emekanisa na Banque Centrale du Congo'
                },
                LICENSE: 'DFS-2021-0456-DRC'
            },
            
            {
                TEXT: {
                    FR: 'Enregistré à la DGI',
                    SW: 'Imeandikishwa kwa DGI',
                    LN: 'Emekomisama na DGI'
                },
                REG_NUMBER: 'ID-2020-001234-KIN'
            },
            
            {
                TEXT: {
                    FR: 'Membre de l\'Association des Fintechs de RDC',
                    SW: 'Mwanachama wa Chama cha Fintech za DRC',
                    LN: 'Moto ya Association ya Ba Fintech ya RDC'
                },
                MEMBERSHIP: 'AFT-RDC-2023-001'
            }
        ]
    },

    // ============================================
    // 1️⃣1️⃣ ACCESSIBILITY FEATURES
    // ============================================
    ACCESSIBILITY: {
        HIGH_CONTRAST: true,
        SCREEN_READER_SUPPORT: true,
        KEYBOARD_NAVIGATION: true,
        FONT_SIZE_ADJUSTMENT: true,
        LANGUAGE_SWITCHER: true,
        
        LANGUAGES: [
            { CODE: 'fr', NAME: 'Français', DEFAULT: true },
            { CODE: 'sw', NAME: 'Swahili', DEFAULT: false },
            { CODE: 'ln', NAME: 'Lingala', DEFAULT: false }
        ],
        
        ACCESSIBILITY_STATEMENT: {
            URL: '/cd/accessibility.html',
            COMPLIANCE: 'WCAG 2.1 AA',
            LAST_TESTED: '2026-01-15',
            TESTED_BY: 'Accessibilité RDC SARL'
        }
    },

    // ============================================
    // 1️⃣2️⃣ PERFORMANCE & SEO
    // ============================================
    PERFORMANCE: {
        LAZY_LOADING: true,
        PRELOAD_CRITICAL_LINKS: true,
        CACHE_STRATEGY: 'stale-while-revalidate',
        FOOTER_LOAD_PRIORITY: 'low',
        
        SEO: {
            SCHEMA_MARKUP: true,
            STRUCTURED_DATA: {
                '@type': 'FinancialService',
                'name': 'M-PESEWA RDC',
                'url': 'https://mpesewa.cd',
                'areaServed': 'Democratic Republic of the Congo',
                'contactPoint': {
                    '@type': 'ContactPoint',
                    'telephone': '+243-81-000-0000',
                    'contactType': 'customer service',
                    'availableLanguage': ['French', 'Swahili', 'Lingala']
                }
            }
        }
    }
};

// ============================================
// FOOTER UTILITY FUNCTIONS
// ============================================

// Generate footer HTML
export const generateFooterHTML = (language = 'FR') => {
    const footer = DRC_FOOTER;
    
    return `
<!-- M-PESEWA DRC FOOTER - Version ${footer.STRUCTURE.VERSION} -->
<footer id="mp-footer-drc" class="mp-footer mp-footer-cd" role="contentinfo">
    <div class="footer-top">
        <div class="container">
            <div class="footer-brand">
                <div class="footer-logo">
                    <span class="logo-text">${footer.BRANDING.LOGO.TEXT}</span>
                    <span class="logo-subtext">${footer.BRANDING.LOGO.SUBTEXT}</span>
                    <span class="country-badge">${footer.BRANDING.LOGO.COUNTRY_BADGE}</span>
                </div>
                <p class="footer-tagline">${footer.BRANDING.TAGLINE[language]}</p>
            </div>
            
            <div class="footer-grid">
                <!-- Column 1: Borrowing -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_1.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_1.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_1.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Column 2: Lending -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_2.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_2.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_2.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Column 3: How It Works -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_3.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_3.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_3.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Column 4: About Us -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_4.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_4.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_4.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Column 5: Legal -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_5.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_5.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_5.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- Column 6: Partnerships -->
                <div class="footer-column">
                    <h3 class="footer-column-title">${footer.COLUMN_6.TITLE[language]}</h3>
                    <p class="footer-column-desc">${footer.COLUMN_6.DESCRIPTION[language]}</p>
                    <ul class="footer-links">
                        ${footer.COLUMN_6.LINKS.map(link => `
                            <li>
                                <a href="${link.URL}" class="footer-link">
                                    <span class="link-icon">${link.ICON}</span>
                                    <span>${link.TEXT[language]}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div class="footer-social">
                        <h4 class="social-title">${language === 'FR' ? 'Suivez-nous' : language === 'SW' ? 'Tufuate' : 'Landela bisö'}</h4>
                        <div class="social-icons">
                            ${footer.COLUMN_6.SOCIAL_MEDIA.map(social => `
                                <a href="${social.URL}" class="social-icon" aria-label="${social.PLATFORM}" target="_blank" rel="noopener noreferrer">
                                    ${social.ICON}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Country Ticker -->
    ${footer.COUNTRY_INFO.TICKER.ENABLED ? `
    <div class="country-ticker">
        <div class="ticker-track" style="animation-duration: ${footer.COUNTRY_INFO.TICKER.SPEED};">
            ${footer.COUNTRY_INFO.TICKER.COUNTRIES.join(' • ')} •
            ${footer.COUNTRY_INFO.TICKER.COUNTRIES.join(' • ')}
        </div>
    </div>
    ` : ''}
    
    <!-- Contact Information -->
    <div class="footer-contact">
        <div class="container">
            <div class="contact-grid">
                <div class="contact-info">
                    <h4>${language === 'FR' ? 'Contactez-nous' : language === 'SW' ? 'Wasiliana Nasi' : 'Benga bisö'}</h4>
                    <p><strong>📞 ${footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.PHONE}</strong></p>
                    <p><strong>💬 WhatsApp: ${footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.WHATSAPP}</strong></p>
                    <p><strong>✉️ ${footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.EMAIL}</strong></p>
                    <p>${footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.ADDRESS}</p>
                    <p class="support-hours">
                        ${language === 'FR' ? 'Heures de support:' : language === 'SW' ? 'Saa za usaidizi:' : 'Ba heure ya support:'}
                        ${footer.COUNTRY_INFO.CONTACT_INFO.SUPPORT_HOURS.WEEKDAYS} 
                        (${language === 'FR' ? 'Lun-Ven' : language === 'SW' ? 'Jumatatu-Ijumaa' : 'Lundi-Vendredi'})
                    </p>
                </div>
                
                <div class="regional-offices">
                    <h4>${language === 'FR' ? 'Bureaux Régionaux' : language === 'SW' ? 'Ofisi za Kikanda' : 'Ba Bureau Régional'}</h4>
                    ${footer.COUNTRY_INFO.CONTACT_INFO.REGIONAL_OFFICES.map(office => `
                        <div class="office">
                            <strong>${office.CITY}:</strong> ${office.PHONE}<br>
                            <small>${office.ADDRESS}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bottom Bar -->
    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-content">
                <!-- Copyright -->
                <div class="copyright">
                    ${footer.BOTTOM_BAR.COPYRIGHT.TEXT[language]}
                    <span class="version">${footer.BOTTOM_BAR.COPYRIGHT.VERSION}</span>
                </div>
                
                <!-- Legal Links -->
                <div class="footer-legal-links">
                    ${footer.BOTTOM_BAR.LEGAL_LINKS.map(link => `
                        <a href="${link.URL}" class="legal-link">${link.TEXT[language]}</a>
                        <span class="separator">|</span>
                    `).join('').slice(0, -29)} <!-- Remove last separator -->
                </div>
                
                <!-- Regulatory Disclosures -->
                <div class="regulatory-disclosures">
                    ${footer.BOTTOM_BAR.REGULATORY_DISCLOSURES.map(disclosure => `
                        <div class="disclosure">
                            <span class="disclosure-icon">✅</span>
                            <span class="disclosure-text">${disclosure.TEXT[language]}</span>
                            ${disclosure.LICENSE ? `<span class="license">${disclosure.LICENSE}</span>` : ''}
                            ${disclosure.REG_NUMBER ? `<span class="reg-number">${disclosure.REG_NUMBER}</span>` : ''}
                            ${disclosure.MEMBERSHIP ? `<span class="membership">${disclosure.MEMBERSHIP}</span>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <!-- Language Switcher -->
                ${footer.ACCESSIBILITY.LANGUAGE_SWITCHER ? `
                <div class="language-switcher">
                    <select id="footer-language-selector" class="language-selector">
                        ${footer.ACCESSIBILITY.LANGUAGES.map(lang => `
                            <option value="${lang.CODE}" ${lang.DEFAULT ? 'selected' : ''}>
                                ${lang.NAME}
                            </option>
                        `).join('')}
                    </select>
                </div>
                ` : ''}
            </div>
        </div>
    </div>
</footer>
<!-- END M-PESEWA DRC FOOTER -->
    `;
};

// Get localized footer text
export const getLocalizedFooterText = (key, language = 'FR') => {
    const keys = key.split('.');
    let value = DRC_FOOTER;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return key; // Return key if not found
        }
    }
    
    // If value is an object with language keys
    if (value && typeof value === 'object' && language in value) {
        return value[language];
    }
    
    return value || key;
};

// Validate footer structure
export const validateFooterStructure = () => {
    const errors = [];
    const warnings = [];
    const footer = DRC_FOOTER;
    
    // Check all columns exist
    const columns = ['COLUMN_1', 'COLUMN_2', 'COLUMN_3', 'COLUMN_4', 'COLUMN_5', 'COLUMN_6'];
    columns.forEach(col => {
        if (!footer[col]) {
            errors.push(`MISSING_COLUMN: ${col}`);
        }
    });
    
    // Check column titles
    columns.forEach(col => {
        const column = footer[col];
        if (column && column.TITLE) {
            if (!column.TITLE.FR || !column.TITLE.SW || !column.TITLE.LN) {
                warnings.push(`INCOMPLETE_TRANSLATIONS: ${col}.TITLE`);
            }
        }
    });
    
    // Check contact information
    if (!footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.PHONE) {
        errors.push('MISSING_PRIMARY_PHONE');
    }
    
    if (!footer.COUNTRY_INFO.CONTACT_INFO.PRIMARY.EMAIL) {
        warnings.push('MISSING_PRIMARY_EMAIL');
    }
    
    // Check legal links
    const requiredLegalLinks = ['terms', 'privacy', 'grievance'];
    const legalLinks = footer.BOTTOM_BAR.LEGAL_LINKS.map(link => 
        link.URL.toLowerCase().split('/').pop().replace('.html', '')
    );
    
    requiredLegalLinks.forEach(link => {
        if (!legalLinks.some(l => l.includes(link))) {
            warnings.push(`MISSING_LEGAL_LINK: ${link}`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        validatedAt: new Date().toISOString(),
        columnCount: columns.length,
        totalLinks: columns.reduce((acc, col) => {
            return acc + (footer[col]?.LINKS?.length || 0);
        }, 0)
    };
};

// Export the footer configuration
export default DRC_FOOTER;

// Freeze the configuration to prevent modifications
Object.freeze(DRC_FOOTER);
Object.freeze(DRC_FOOTER.COLUMN_1);
Object.freeze(DRC_FOOTER.COLUMN_2);
Object.freeze(DRC_FOOTER.COLUMN_3);
Object.freeze(DRC_FOOTER.COLUMN_4);
Object.freeze(DRC_FOOTER.COLUMN_5);
Object.freeze(DRC_FOOTER.COLUMN_6);