/**
 * M-PESEWA DRC PAGES & ROUTING
 * COUNTRY-SPECIFIC PAGES FOR DEMOCRATIC REPUBLIC OF CONGO
 * Last Updated: 2026-01-24
 */

const DRC_PAGES = {
    // ============================================
    // 1️⃣ PAGE HIERARCHY & STRUCTURE
    // ============================================
    PAGE_HIERARCHY: {
        LEVEL_1: {
            HOME: '/cd/index.html',
            ABOUT: '/cd/about.html',
            HOW_IT_WORKS: '/cd/how-it-works.html',
            CONTACT: '/cd/contact.html'
        },
        
        LEVEL_2: {
            BORROWER: {
                DASHBOARD: '/cd/borrower/dashboard.html',
                APPLY: '/cd/borrower/apply.html',
                HISTORY: '/cd/borrower/history.html',
                REPAYMENTS: '/cd/borrower/repayments.html',
                DISPUTES: '/cd/borrower/disputes.html'
            },
            
            LENDER: {
                DASHBOARD: '/cd/lender/dashboard.html',
                PORTFOLIO: '/cd/lender/portfolio.html',
                HISTORY: '/cd/lender/history.html',
                RULES: '/cd/lender/rules.html',
                RISK: '/cd/lender/risk.html'
            },
            
            EMERGENCY_HUB: {
                INDEX: '/cd/emergency/index.html',
                CATEGORIES: {
                    FARE: '/cd/emergency/fare.html',
                    DATA: '/cd/emergency/data.html',
                    GAS: '/cd/emergency/gas.html',
                    FOOD: '/cd/emergency/food.html',
                    WATER: '/cd/emergency/water.html',
                    ELECTRICITY: '/cd/emergency/electricity.html',
                    TV: '/cd/emergency/tv.html',
                    FUEL: '/cd/emergency/fuel.html',
                    REPAIR: '/cd/emergency/repair.html',
                    CREDO: '/cd/emergency/credo.html',
                    SALES: '/cd/emergency/sales.html',
                    CAPITAL: '/cd/emergency/capital.html',
                    SOKO: '/cd/emergency/soko.html',
                    KIDANDASKI: '/cd/emergency/kidandaski.html',
                    HAWKER: '/cd/emergency/hawker.html',
                    FULIZIWA: '/cd/emergency/fuliziwa.html',
                    MEDICINE: '/cd/emergency/medicine.html',
                    SCHOOL: '/cd/emergency/school.html',
                    ADVANCE: '/cd/emergency/advance.html'
                }
            },
            
            SUBSCRIPTION: {
                PLANS: '/cd/subscription/plans.html',
                CURRENT: '/cd/subscription/current.html',
                UPGRADE: '/cd/subscription/upgrade.html',
                HISTORY: '/cd/subscription/history.html',
                INVOICES: '/cd/subscription/invoices.html',
                EXPIRED: '/cd/subscription/expired.html'
            }
        },
        
        LEVEL_3: {
            GROUPS: {
                LIST: '/cd/groups/list.html',
                CREATE: '/cd/groups/create.html',
                DASHBOARD: '/cd/groups/dashboard.html',
                MEMBERS: '/cd/groups/members.html',
                SETTINGS: '/cd/groups/settings.html',
                INVITES: '/cd/groups/invites.html'
            },
            
            LEDGERS: {
                LIST: '/cd/ledgers/list.html',
                VIEW: '/cd/ledgers/view.html',
                UPDATE: '/cd/ledgers/update.html',
                HISTORY: '/cd/ledgers/history.html',
                DISPUTES: '/cd/ledgers/disputes.html'
            }
        },
        
        LEVEL_4: {
            ADMIN: {
                DASHBOARD: '/cd/admin/dashboard.html',
                USERS: '/cd/admin/users.html',
                GROUPS: '/cd/admin/groups.html',
                LEDGERS: '/cd/admin/ledgers.html',
                BLACKLIST: '/cd/admin/blacklist.html',
                AUDIT: '/cd/admin/audit.html'
            }
        }
    },
    
    // ============================================
    // 2️⃣ PAGE TEMPLATES & CONTENT
    // ============================================
    TEMPLATES: {
        HOME_PAGE: {
            TITLE: 'M-PESEWA RDC | Finance d\'Urgence dans des Cercles de Confiance',
            META_DESCRIPTION: 'Plateforme congolaise de microcrédit d\'urgence entre amis et famille. Prêts responsables dans des groupes de confiance.',
            HERO: {
                TITLE: 'Finance d\'urgence, faite de manière responsable',
                SUBTITLE: 'Accédez à des petits prêts à but spécifique auprès de membres de confiance de votre communauté. Pas de banques, pas de processus longs - juste de l\'aide réelle de personnes réelles.',
                CTA_PRIMARY: 'Obtenir de l\'aide d\'urgence',
                CTA_SECONDARY: 'Comment ça marche'
            },
            
            TRUST_INDICATORS: [
                'Prêt basé sur la communauté',
                'Règles et conformité spécifiques à la RDC',
                'Conçu pour des besoins urgents de la vie réelle',
                'Pas de modèles de prêt prédateurs'
            ],
            
            FEATURES: [
                {
                    TITLE: 'Groupes de Confiance',
                    DESCRIPTION: 'Rejoignez des cercles d\'amis, de famille ou de collègues',
                    ICON: '👥'
                },
                {
                    TITLE: 'Prêts d\'Urgence',
                    DESCRIPTION: '20 catégories pour des besoins spécifiques',
                    ICON: '🚨'
                },
                {
                    TITLE: 'Reputation',
                    DESCRIPTION: 'Système de notation 5 étoiles pour la transparence',
                    ICON: '⭐'
                },
                {
                    TITLE: 'Isolation Pays',
                    DESCRIPTION: 'Opérations strictement à l\'intérieur de la RDC',
                    ICON: '🇨🇩'
                }
            ]
        },
        
        BORROWER_DASHBOARD: {
            TITLE: 'Tableau de Bord Emprunteur | M-PESEWA RDC',
            SECTIONS: [
                {
                    ID: 'active-loans',
                    TITLE: 'Mes Prêts Actifs',
                    COLUMNS: ['Montant', 'Date de prêt', 'Date d\'échéance', 'Intérêt', 'Actions']
                },
                {
                    ID: 'borrow-history',
                    TITLE: 'Historique des Emprunts',
                    COLUMNS: ['Date', 'Montant', 'Prêteur', 'Statut', 'Évaluation']
                },
                {
                    ID: 'reputation',
                    TITLE: 'Ma Réputation',
                    METRICS: ['Note moyenne', 'Prêts remboursés', 'Retards', 'Groupes actifs']
                },
                {
                    ID: 'quick-actions',
                    TITLE: 'Actions Rapides',
                    ACTIONS: ['Demander un prêt', 'Voir les catégories', 'Contacter un prêteur', 'Mettre à jour le profil']
                }
            ],
            
            WIDGETS: [
                {
                    TYPE: 'loan-calculator',
                    TITLE: 'Calculateur de Prêt',
                    FIELDS: ['Montant (CDF)', 'Durée (jours)', 'Intérêt estimé', 'Remboursement total']
                },
                {
                    TYPE: 'repayment-schedule',
                    TITLE: 'Calendrier de Remboursement',
                    FIELDS: ['Date', 'Montant dû', 'Intérêt', 'Total']
                },
                {
                    TYPE: 'group-status',
                    TITLE: 'Statut des Groupes',
                    FIELDS: ['Nom du groupe', 'Membres', 'Prêteurs actifs', 'Taux de remboursement']
                }
            ]
        },
        
        LENDER_DASHBOARD: {
            TITLE: 'Tableau de Bord Prêteur | M-PESEWA RDC',
            SECTIONS: [
                {
                    ID: 'portfolio-overview',
                    TITLE: 'Aperçu du Portefeuille',
                    METRICS: ['Montant total prêté', 'Prêts actifs', 'Taux de remboursement', 'Intérêts gagnés']
                },
                {
                    ID: 'active-ledgers',
                    TITLE: 'Registres Actifs',
                    COLUMNS: ['Emprunteur', 'Montant', 'Date de prêt', 'Échéance', 'Intérêt dû', 'Actions']
                },
                {
                    ID: 'subscription-status',
                    TITLE: 'Statut d\'Abonnement',
                    FIELDS: ['Niveau', 'Limite hebdomadaire', 'Date d\'expiration', 'Renouvellement']
                },
                {
                    ID: 'risk-metrics',
                    TITLE: 'Métriques de Risque',
                    METRICS: ['Défauts', 'Retards moyens', 'Concentration', 'Diversification']
                }
            ],
            
            WIDGETS: [
                {
                    TYPE: 'lending-calculator',
                    TITLE: 'Calculateur de Prêt',
                    FIELDS: ['Montant (CDF)', 'Retour hebdomadaire', 'Retour annuel']
                },
                {
                    TYPE: 'borrower-requests',
                    TITLE: 'Demandes d\'Emprunt',
                    FIELDS: ['Emprunteur', 'Montant', 'Catégorie', 'Note', 'Actions']
                },
                {
                    TYPE: 'performance-chart',
                    TITLE: 'Performance du Portefeuille',
                    CHART_TYPE: 'line',
                    DATA_POINTS: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4']
                }
            ]
        },
        
        EMERGENCY_CATEGORY_PAGE: {
            TEMPLATE: {
                HEADER: {
                    TITLE: 'M-PESEWA [CATEGORY] | RDC',
                    BREADCRUMB: ['Accueil', 'Hub d\'Urgence', '[Catégorie]']
                },
                
                CONTENT: {
                    DESCRIPTION: '[Description localisée de la catégorie]',
                    USE_CASES: ['Cas d\'usage 1', 'Cas d\'usage 2', 'Cas d\'usage 3'],
                    ELIGIBILITY: ['Critère 1', 'Critère 2', 'Critère 3'],
                    DOCUMENTS: ['Document 1', 'Document 2', 'Document 3']
                },
                
                CALCULATOR: {
                    TITLE: 'Calculateur de Prêt',
                    MIN_AMOUNT: 500,
                    MAX_AMOUNT: 48000,
                    DEFAULT_TERM: 7,
                    INTEREST_RATE: 10,
                    PENALTY_RATE: 5
                },
                
                LENDER_NETWORK: {
                    TITLE: 'Prêteurs Disponibles',
                    FILTERS: ['Par groupe', 'Par localisation', 'Par note', 'Par limite']
                },
                
                CTA: {
                    PRIMARY: 'Demander ce prêt',
                    SECONDARY: 'Voir les prêteurs',
                    TERTIARY: 'En savoir plus'
                }
            }
        }
    },
    
    // ============================================
    // 3️⃣ ROUTING & NAVIGATION RULES
    // ============================================
    ROUTING_RULES: {
        // Country isolation enforcement
        COUNTRY_GUARD: {
            RULE: 'All routes must start with /cd/ for DRC users',
            REDIRECT: '/countries/select.html if country mismatch',
            VALIDATION: 'Check localStorage.mpesewa_country === "CD"'
        },
        
        // Role-based routing
        ROLE_GUARDS: {
            BORROWER: {
                ALLOWED: [
                    '/cd/borrower/',
                    '/cd/emergency/',
                    '/cd/groups/',
                    '/cd/how-it-works.html'
                ],
                RESTRICTED: [
                    '/cd/lender/',
                    '/cd/subscription/upgrade.html',
                    '/cd/admin/'
                ]
            },
            
            LENDER: {
                ALLOWED: [
                    '/cd/lender/',
                    '/cd/emergency/',
                    '/cd/groups/',
                    '/cd/subscription/',
                    '/cd/ledgers/'
                ],
                RESTRICTED: [
                    '/cd/borrower/apply.html',
                    '/cd/admin/'
                ]
            },
            
            GROUP_ADMIN: {
                ALLOWED: [
                    '/cd/groups/settings.html',
                    '/cd/groups/invites.html',
                    '/cd/groups/members.html'
                ],
                INHERITS: ['LENDER', 'BORROWER']
            },
            
            COUNTRY_ADMIN: {
                ALLOWED: ['/cd/admin/'],
                INHERITS: ['GROUP_ADMIN']
            }
        },
        
        // Subscription-based routing
        SUBSCRIPTION_GUARDS: {
            BASIC: {
                MAX_LOAN_AMOUNT: 3000,
                ALLOWED_PAGES: ['/cd/lender/dashboard.html', '/cd/lender/portfolio.html'],
                RESTRICTED_PAGES: ['/cd/lender/risk.html', '/cd/subscription/upgrade.html']
            },
            
            PREMIUM: {
                MAX_LOAN_AMOUNT: 12000,
                ALLOWED_PAGES: ['/cd/lender/risk.html', '/cd/lender/rules.html'],
                RESTRICTED_PAGES: []
            },
            
            SUPER: {
                MAX_LOAN_AMOUNT: 48000,
                ALLOWED_PAGES: ['/cd/lender/risk.html', '/cd/lender/rules.html'],
                RESTRICTED_PAGES: []
            },
            
            EXPIRED: {
                REDIRECT: '/cd/subscription/expired.html',
                ALLOWED_PAGES: ['/cd/subscription/current.html', '/cd/subscription/upgrade.html']
            }
        },
        
        // Blacklist restrictions
        BLACKLIST_GUARDS: {
            BORROWER: {
                REDIRECT: '/cd/blacklist/status.html',
                ALLOWED_PAGES: ['/cd/blacklist/status.html', '/cd/contact.html'],
                RESTRICTED_ACTIONS: ['apply-loan', 'join-group']
            },
            
            LENDER: {
                REDIRECT: '/cd/contact.html',
                ALLOWED_PAGES: ['/cd/contact.html', '/cd/subscription/current.html'],
                RESTRICTED_ACTIONS: ['disburse-loan', 'update-ledger']
            }
        }
    },
    
    // ============================================
    // 4️⃣ LOCALIZED CONTENT
    // ============================================
    LOCALIZED_CONTENT: {
        LANGUAGES: {
            FR: {
                CODE: 'fr',
                NAME: 'Français',
                DEFAULT: true
            },
            
            SW: {
                CODE: 'sw',
                NAME: 'Swahili',
                DEFAULT: false
            },
            
            LN: {
                CODE: 'ln',
                NAME: 'Lingala',
                DEFAULT: false
            }
        },
        
        TRANSLATIONS: {
            COMMON: {
                WELCOME: {
                    FR: 'Bienvenue sur M-PESEWA RDC',
                    SW: 'Karibu kwenye M-PESEWA DRC',
                    LN: 'Boyei na M-PESEWA RDC'
                },
                
                LOGIN: {
                    FR: 'Connexion',
                    SW: 'Ingia',
                    LN: 'Kota'
                },
                
                SIGNUP: {
                    FR: 'S\'inscrire',
                    SW: 'Jisajili',
                    LN: 'Saini'
                }
            },
            
            NAVIGATION: {
                HOME: {
                    FR: 'Accueil',
                    SW: 'Nyumbani',
                    LN: 'Liboso'
                },
                
                BORROWERS: {
                    FR: 'Emprunteurs',
                    SW: 'Wakopaji',
                    LN: 'Basali'
                },
                
                LENDERS: {
                    FR: 'Prêteurs',
                    SW: 'Wakopeshi',
                    LN: 'Bapeyi'
                },
                
                EMERGENCY_HUB: {
                    FR: 'Hub d\'Urgence',
                    SW: 'Kituo cha Dharura',
                    LN: 'Esika ya Kobongisama'
                }
            },
            
            EMERGENCY_CATEGORIES: {
                FARE: {
                    FR: 'M-pesewa Transport',
                    SW: 'M-pesewa Usafiri',
                    LN: 'M-pesewa Mosala'
                },
                
                DATA: {
                    FR: 'M-pesewa Données',
                    SW: 'M-pesewa Data',
                    LN: 'M-pesewa Ba données'
                },
                
                GAS: {
                    FR: 'M-pesewa Gaz de Cuisine',
                    SW: 'M-pesewa Gesi ya Kupikia',
                    LN: 'M-pesewa Gaz ya kobikisa'
                }
            }
        },
        
        CURRENCY_FORMAT: {
            FR: {
                SYMBOL: 'FC',
                FORMAT: '#,##0 FC',
                DECIMAL_SEPARATOR: ',',
                THOUSAND_SEPARATOR: ' '
            },
            
            SW: {
                SYMBOL: 'FC',
                FORMAT: '#,##0 FC',
                DECIMAL_SEPARATOR: '.',
                THOUSAND_SEPARATOR: ','
            },
            
            LN: {
                SYMBOL: 'FC',
                FORMAT: '#,##0 FC',
                DECIMAL_SEPARATOR: ',',
                THOUSAND_SEPARATOR: '.'
            }
        },
        
        DATE_FORMAT: {
            FR: 'DD/MM/YYYY',
            SW: 'DD/MM/YYYY',
            LN: 'DD/MM/YYYY'
        }
    },
    
    // ============================================
    // 5️⃣ PAGE COMPONENTS & WIDGETS
    // ============================================
    COMPONENTS: {
        LOAN_CALCULATOR: {
            ID: 'cd-loan-calculator',
            CONFIG: {
                CURRENCY: 'CDF',
                MIN_AMOUNT: 500,
                MAX_AMOUNT: 48000,
                DEFAULT_AMOUNT: 5000,
                INTEREST_RATE: 10,
                TERM_DAYS: 7,
                PENALTY_RATE: 5
            },
            
            FIELDS: [
                {
                    ID: 'loan-amount',
                    LABEL: {
                        FR: 'Montant du prêt (CDF)',
                        SW: 'Kiasi cha mkopo (CDF)',
                        LN: 'Mokumba ya mosala (CDF)'
                    },
                    TYPE: 'number',
                    STEP: 100,
                    REQUIRED: true
                },
                
                {
                    ID: 'loan-term',
                    LABEL: {
                        FR: 'Durée (jours)',
                        SW: 'Muda (siku)',
                        LN: 'Mokolo (mikolo)'
                    },
                    TYPE: 'number',
                    MIN: 1,
                    MAX: 7,
                    DEFAULT: 7
                }
            ],
            
            CALCULATIONS: [
                {
                    ID: 'interest',
                    LABEL: {
                        FR: 'Intérêt (10%)',
                        SW: 'Riba (10%)',
                        LN: 'Litanga (10%)'
                    },
                    FORMULA: 'amount * 0.10'
                },
                
                {
                    ID: 'total-repayment',
                    LABEL: {
                        FR: 'Remboursement total',
                        SW: 'Jumla ya kulipa',
                        LN: 'Mobeko mobimba'
                    },
                    FORMULA: 'amount + interest'
                },
                
                {
                    ID: 'daily-payment',
                    LABEL: {
                        FR: 'Paiement quotidien',
                        SW: 'Malipo ya kila siku',
                        LN: 'Mobeko ya mokolo na mokolo'
                    },
                    FORMULA: 'totalRepayment / term'
                }
            ]
        },
        
        REPUTATION_BADGE: {
            ID: 'cd-reputation-badge',
            LEVELS: [
                {
                    RATING: 4.5,
                    LABEL: {
                        FR: 'Excellente réputation',
                        SW: 'Sifa bora sana',
                        LN: 'Lisanga ya malamu mingi'
                    },
                    COLOR: '#28a745',
                    ICON: '⭐⭐⭐⭐⭐'
                },
                
                {
                    RATING: 3.5,
                    LABEL: {
                        FR: 'Bonne réputation',
                        SW: 'Sifa nzuri',
                        LN: 'Lisanga ya malamu'
                    },
                    COLOR: '#17a2b8',
                    ICON: '⭐⭐⭐⭐☆'
                },
                
                {
                    RATING: 2.5,
                    LABEL: {
                        FR: 'Réputation moyenne',
                        SW: 'Sifa ya wastani',
                        LN: 'Lisanga ya katikati'
                    },
                    COLOR: '#ffc107',
                    ICON: '⭐⭐⭐☆☆'
                },
                
                {
                    RATING: 1.5,
                    LABEL: {
                        FR: 'Réputation à améliorer',
                        SW: 'Sifa inahitaji kuboreshwa',
                        LN: 'Lisanga ezali na kosala'
                    },
                    COLOR: '#fd7e14',
                    ICON: '⭐⭐☆☆☆'
                },
                
                {
                    RATING: 0,
                    LABEL: {
                        FR: 'Nouvelle réputation',
                        SW: 'Sifa mpya',
                        LN: 'Lisanga ya sika'
                    },
                    COLOR: '#6c757d',
                    ICON: '⭐☆☆☆☆'
                }
            ]
        },
        
        BLACKLIST_BADGE: {
            ID: 'cd-blacklist-badge',
            TYPES: [
                {
                    LEVEL: 'SEVERE',
                    LABEL: {
                        FR: 'LISTE NOIRE - Défaut grave',
                        SW: 'ORODHA NYEUSI - Deni kubwa',
                        LN: 'LISANGA YA MOINDE - Mobeko te'
                    },
                    COLOR: '#dc3545',
                    CONDITIONS: ['Default > 60 days', 'Amount > 100,000 CDF', 'Multiple defaults']
                },
                
                {
                    LEVEL: 'WARNING',
                    LABEL: {
                        FR: 'AVERTISSEMENT - Retards fréquents',
                        SW: 'ONYO - Ucheleweshaji mara kwa mara',
                        LN: 'LISANGA YA KOBEBA - Bozangi mbala na mbala'
                    },
                    COLOR: '#ffc107',
                    CONDITIONS: ['Multiple delays', 'Pattern of late payments', 'Poor communication']
                }
            ]
        },
        
        GROUP_MEMBER_LIST: {
            ID: 'cd-group-members',
            COLUMNS: [
                {
                    KEY: 'name',
                    LABEL: {
                        FR: 'Nom',
                        SW: 'Jina',
                        LN: 'Nkombo'
                    },
                    SORTABLE: true
                },
                
                {
                    KEY: 'role',
                    LABEL: {
                        FR: 'Rôle',
                        SW: 'Jukumu',
                        LN: 'Loisi'
                    },
                    SORTABLE: true
                },
                
                {
                    KEY: 'rating',
                    LABEL: {
                        FR: 'Note',
                        SW: 'Ukadiriaji',
                        LN: 'Mokano'
                    },
                    SORTABLE: true
                },
                
                {
                    KEY: 'loans',
                    LABEL: {
                        FR: 'Prêts',
                        SW: 'Mikopo',
                        LN: 'Misala'
                    },
                    SORTABLE: true
                },
                
                {
                    KEY: 'status',
                    LABEL: {
                        FR: 'Statut',
                        SW: 'Hali',
                        LN: 'Etat'
                    },
                    SORTABLE: true
                }
            ],
            
            ACTIONS: [
                {
                    ID: 'view-profile',
                    LABEL: {
                        FR: 'Voir profil',
                        SW: 'Tazama wasifu',
                        LN: 'Tala lisanga'
                    },
                    ICON: '👁️'
                },
                
                {
                    ID: 'send-message',
                    LABEL: {
                        FR: 'Envoyer message',
                        SW: 'Tuma ujumbe',
                        LN: 'Tinda sango'
                    },
                    ICON: '💬'
                },
                
                {
                    ID: 'report-issue',
                    LABEL: {
                        FR: 'Signaler problème',
                        SW: 'Ripoti tatizo',
                        LN: 'Zongisa motuna'
                    },
                    ICON: '🚨'
                }
            ]
        }
    },
    
    // ============================================
    // 6️⃣ FORM CONFIGURATIONS
    // ============================================
    FORMS: {
        BORROWER_REGISTRATION: {
            ID: 'cd-borrower-registration',
            STEPS: [
                {
                    TITLE: {
                        FR: 'Informations Personnelles',
                        SW: 'Taarifa Binafsi',
                        LN: 'Ba ndenge na ngai'
                    },
                    FIELDS: [
                        {
                            ID: 'full-name',
                            LABEL: { FR: 'Nom complet', SW: 'Jina kamili', LN: 'Nkombo mobimba' },
                            TYPE: 'text',
                            REQUIRED: true,
                            VALIDATION: /^[A-Za-zÀ-ÿ\s]{3,50}$/
                        },
                        
                        {
                            ID: 'national-id',
                            LABEL: { FR: 'Numéro CNI', SW: 'Nambari ya kitambulisho', LN: 'Numéro ya CNI' },
                            TYPE: 'text',
                            REQUIRED: true,
                            VALIDATION: /^[0-9]{2}[A-Z]{2}[0-9]{6}$/
                        },
                        
                        {
                            ID: 'phone-number',
                            LABEL: { FR: 'Numéro de téléphone', SW: 'Nambari ya simu', LN: 'Numéro ya telefone' },
                            TYPE: 'tel',
                            REQUIRED: true,
                            VALIDATION: /^(?:\+243|0)(8[1-9]|9[0-9])[0-9]{7}$/
                        }
                    ]
                },
                
                {
                    TITLE: {
                        FR: 'Localisation et Groupe',
                        SW: 'Eneo na Kikundi',
                        LN: 'Esika na lisanga'
                    },
                    FIELDS: [
                        {
                            ID: 'province',
                            LABEL: { FR: 'Province', SW: 'Mkoa', LN: 'Province' },
                            TYPE: 'select',
                            REQUIRED: true,
                            OPTIONS: [
                                'Kinshasa', 'Kongo Central', 'Kwango', 'Kwilu', 'Mai-Ndombe', 
                                'Kasai', 'Kasai Central', 'Kasai Oriental', 'Lomami', 'Sankuru',
                                'Maniema', 'South Kivu', 'North Kivu', 'Ituri', 'Haut-Uele', 
                                'Tshopo', 'Bas-Uele', 'Nord-Ubangi', 'Sud-Ubangi', 'Mongala',
                                'Equateur', 'Tshuapa', 'Tanganyika', 'Haut-Lomami', 'Lualaba',
                                'Haut-Katanga'
                            ]
                        },
                        
                        {
                            ID: 'city',
                            LABEL: { FR: 'Ville/Commune', SW: 'Jiji/Kata', LN: 'Mboka/Commune' },
                            TYPE: 'text',
                            REQUIRED: true
                        },
                        
                        {
                            ID: 'group-selection',
                            LABEL: { FR: 'Rejoindre un groupe', SW: 'Jiunge na kikundi', LN: 'Kotisana na lisanga' },
                            TYPE: 'radio',
                            OPTIONS: [
                                { VALUE: 'join', LABEL: { FR: 'Rejoindre un groupe existant', SW: 'Jiunge na kikundi kilichopo', LN: 'Kotisana na lisanga ezali' } },
                                { VALUE: 'create', LABEL: { FR: 'Créer un nouveau groupe', SW: 'Anzisha kikundi kipya', LN: 'Sala lisanga ya sika' } }
                            ]
                        }
                    ]
                },
                
                {
                    TITLE: {
                        FR: 'Références et Garants',
                        SW: 'Vyeo na Wadhamini',
                        LN: 'Bato ya koninga'
                    },
                    FIELDS: [
                        {
                            ID: 'referrer-1',
                            LABEL: { FR: 'Référent 1 (Nom et téléphone)', SW: 'Mtoa ushahidi 1 (Jina na simu)', LN: 'Moto ya koninga 1 (Nkombo na telefone)' },
                            TYPE: 'text',
                            REQUIRED: true
                        },
                        
                        {
                            ID: 'referrer-2',
                            LABEL: { FR: 'Référent 2 (Nom et téléphone)', SW: 'Mtoa ushahidi 2 (Jina na simu)', LN: 'Moto ya koninga 2 (Nkombo na telefone)' },
                            TYPE: 'text',
                            REQUIRED: true
                        },
                        
                        {
                            ID: 'guarantor-1',
                            LABEL: { FR: 'Garant 1 (Nom et téléphone)', SW: 'Mdhamini 1 (Jina na simu)', LN: 'Mondimi 1 (Nkombo na telefone)' },
                            TYPE: 'text',
                            REQUIRED: true
                        }
                    ]
                }
            ],
            
            VALIDATION_RULES: {
                MIN_AGE: 18,
                MAX_GROUPS: 4,
                REFERRERS_REQUIRED: 2,
                GUARANTORS_REQUIRED: 1
            }
        },
        
        LOAN_APPLICATION: {
            ID: 'cd-loan-application',
            FIELDS: [
                {
                    ID: 'category',
                    LABEL: { FR: 'Catégorie d\'urgence', SW: 'Aina ya dharura', LN: 'Lisanga ya kobongisama' },
                    TYPE: 'select',
                    REQUIRED: true,
                    OPTIONS: [
                        { VALUE: 'fare', LABEL: { FR: 'Transport', SW: 'Usafiri', LN: 'Mosalisi' } },
                        { VALUE: 'data', LABEL: { FR: 'Données internet', SW: 'Data ya intaneti', LN: 'Ba données ya internet' } },
                        { VALUE: 'gas', LABEL: { FR: 'Gaz de cuisine', SW: 'Gesi ya kupikia', LN: 'Gaz ya kobikisa' } },
                        { VALUE: 'food', LABEL: { FR: 'Nourriture', SW: 'Chakula', LN: 'Bilanga' } },
                        { VALUE: 'medicine', LABEL: { FR: 'Médicaments', SW: 'Dawa', LN: 'Monganga' } }
                    ]
                },
                
                {
                    ID: 'amount',
                    LABEL: { FR: 'Montant (CDF)', SW: 'Kiasi (CDF)', LN: 'Mokumba (CDF)' },
                    TYPE: 'number',
                    REQUIRED: true,
                    MIN: 500,
                    MAX: 48000,
                    STEP: 100
                },
                
                {
                    ID: 'purpose',
                    LABEL: { FR: 'Description du besoin', SW: 'Maelezo ya hitaji', LN: 'Ndeso ya esengeli' },
                    TYPE: 'textarea',
                    REQUIRED: true,
                    MAX_LENGTH: 500,
                    PLACEHOLDER: {
                        FR: 'Décrivez précisément pourquoi vous avez besoin de ce prêt...',
                        SW: 'Eleza kwa usahihi kwa nini unahitaji mkopo huu...',
                        LN: 'Sakola na ndenge esengeli mpo na nini ozali na esengeli ya mosala oyo...'
                    }
                },
                
                {
                    ID: 'repayment-plan',
                    LABEL: { FR: 'Plan de remboursement', SW: 'Mpango wa kulipa', LN: 'Etaleli ya mobeko' },
                    TYPE: 'select',
                    REQUIRED: true,
                    OPTIONS: [
                        { VALUE: '7-days', LABEL: { FR: '7 jours (intérêt 10%)', SW: 'Siku 7 (riba 10%)', LN: 'Mikolo 7 (litanga 10%)' } },
                        { VALUE: 'partial', LABEL: { FR: 'Paiements partiels quotidiens', SW: 'Malipo ya kila siku', LN: 'Mobeko ya mokolo na mokolo' } }
                    ]
                }
            ],
            
            VALIDATION: {
                MAX_ACTIVE_LOANS: 1,
                MIN_DAYS_BETWEEN_LOANS: 0,
                GROUP_APPROVAL_REQUIRED: true,
                LENDER_ACCEPTANCE_REQUIRED: true
            }
        }
    },
    
    // ============================================
    // 7️⃣ ANALYTICS & TRACKING
    // ============================================
    ANALYTICS: {
        TRACKING_CODES: {
            GOOGLE_ANALYTICS: 'UA-DRC-2026-001',
            FACEBOOK_PIXEL: 'DRC-6789012345',
            HOTJAR: 'DRC-123456'
        },
        
        EVENTS: {
            PAGE_VIEWS: [
                'cd_home_view',
                'cd_borrower_dashboard_view',
                'cd_lender_dashboard_view',
                'cd_emergency_category_view'
            ],
            
            USER_ACTIONS: [
                'cd_user_registration',
                'cd_loan_application',
                'cd_loan_disbursement',
                'cd_repayment_made',
                'cd_subscription_purchase'
            ],
            
            CONVERSION_GOALS: [
                'cd_borrower_signup',
                'cd_lender_signup',
                'cd_first_loan',
                'cd_subscription_upgrade'
            ]
        },
        
        DASHBOARD_METRICS: {
            DAILY: [
                'new_users',
                'loan_applications',
                'disbursements',
                'repayments',
                'defaults'
            ],
            
            WEEKLY: [
                'active_users',
                'loan_volume',
                'repayment_rate',
                'default_rate',
                'revenue'
            ],
            
            MONTHLY: [
                'user_growth',
                'portfolio_growth',
                'risk_metrics',
                'compliance_status',
                'regional_distribution'
            ]
        }
    },
    
    // ============================================
    // 8️⃣ ERROR PAGES & MESSAGES
    // ============================================
    ERROR_PAGES: {
        404: {
            TITLE: {
                FR: 'Page non trouvée - M-PESEWA RDC',
                SW: 'Ukurasa haupatikani - M-PESEWA DRC',
                LN: 'Lokasa ezali te - M-PESEWA RDC'
            },
            
            MESSAGE: {
                FR: 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.',
                SW: 'Samahani, ukurasa unaoutafuta haupo au umehamishwa.',
                LN: 'Bolimbisi, lokasa ozali koluka ezali te to esalaki kokoma mosusu.'
            },
            
            ACTIONS: [
                { TEXT: { FR: 'Retour à l\'accueil', SW: 'Rudi nyumbani', LN: 'Zonga na liboso' }, LINK: '/cd/index.html' },
                { TEXT: { FR: 'Contactez-nous', SW: 'Wasiliana nasi', LN: 'Benga biso' }, LINK: '/cd/contact.html' }
            ]
        },
        
        403: {
            TITLE: {
                FR: 'Accès refusé - M-PESEWA RDC',
                SW: 'Ufikiaji umekataliwa - M-PESEWA DRC',
                LN: 'Kokota epekisami - M-PESEWA RDC'
            },
            
            MESSAGE: {
                FR: 'Vous n\'avez pas l\'autorisation d\'accéder à cette page.',
                SW: 'Huna ruhusa ya kufikia ukurasa huu.',
                LN: 'Ozali na ndingisa ya kokota na lokasa oyo te.'
            },
            
            REASONS: [
                { FR: 'Abonnement expiré', SW: 'Usajili umeisha', LN: 'Abonnement esili' },
                { FR: 'Liste noire active', SW: 'Orodha nyeusi inatumika', LN: 'Lisanga ya moinde ezali' },
                { FR: 'Violation des règles', SW: 'Ukiukaji wa kanuni', LN: 'Kobukana na mitindo' }
            ]
        },
        
        500: {
            TITLE: {
                FR: 'Erreur serveur - M-PESEWA RDC',
                SW: 'Hitilafu ya seva - M-PESEWA DRC',
                LN: 'Libunga ya serveur - M-PESEWA RDC'
            },
            
            MESSAGE: {
                FR: 'Une erreur technique s\'est produite. Notre équipe a été notifiée.',
                SW: 'Hitilafu ya kiufundi imetokea. Timu yetu imeonywa.',
                LN: 'Libunga ya teknik esalemaki. Bato na biso bayebaki.'
            },
            
            CONTACT: {
                PHONE: '+243 81 000 0000',
                WHATSAPP: '+243 89 000 0000',
                EMAIL: 'support@m-pesewa.cd'
            }
        }
    },
    
    // ============================================
    // 9️⃣ SEO CONFIGURATION
    // ============================================
    SEO_CONFIG: {
        HOME: {
            TITLE: 'M-PESEWA RDC | Prêts d\'Urgence entre Amis et Famille',
            DESCRIPTION: 'Plateforme congolaise de microcrédit d\'urgence. Prêts responsables de 500 à 48,000 CDF dans des cercles de confiance. Inscription gratuite pour emprunteurs.',
            KEYWORDS: 'prêt urgence RDC, microcrédit Congo, finance communautaire Kinshasa, emprunter Congo, prêter Congo, groupe de confiance'
        },
        
        BORROWER: {
            TITLE: 'Emprunteur | M-PESEWA RDC',
            DESCRIPTION: 'Obtenez des prêts d\'urgence de 500 à 48,000 CDF dans votre communauté. 20 catégories d\'urgence, pas de frais d\'abonnement.',
            KEYWORDS: 'emprunter RDC, prêt urgence, microcrédit Kinshasa, finance d\'urgence, prêt entre amis Congo'
        },
        
        LENDER: {
            TITLE: 'Prêteur | M-PESEWA RDC',
            DESCRIPTION: 'Devenez prêteur sur M-PESEWA RDC. Prêtez à des personnes de confiance dans votre communauté et gagnez 10% d\'intérêt hebdomadaire.',
            KEYWORDS: 'prêter RDC, investir Congo, revenus passifs, microfinance, prêt communautaire'
        },
        
        EMERGENCY_CATEGORIES: {
            BASE_TITLE: 'M-PESEWA [CATEGORY] | Prêts d\'Urgence RDC',
            BASE_DESCRIPTION: 'Prêts d\'urgence [CATEGORY] en RDC. Montants de 500 à 48,000 CDF, remboursement en 7 jours.',
            KEYWORDS_TEMPLATE: 'prêt [category] RDC, urgence [category] Congo, microcrédit [category] Kinshasa'
        }
    }
};

// ============================================
// PAGE UTILITIES & FUNCTIONS
// ============================================

// Page routing and guard functions
export const pageUtils = {
    // Check if user can access a page
    canAccessPage: (pagePath, userData) => {
        const { role, subscription, isBlacklisted, country } = userData;
        
        // Country guard
        if (!pagePath.startsWith('/cd/') || country !== 'CD') {
            return {
                allowed: false,
                reason: 'COUNTRY_MISMATCH',
                redirect: '/countries/select.html'
            };
        }
        
        // Blacklist guard
        if (isBlacklisted) {
            const blacklistGuard = DRC_PAGES.ROUTING_RULES.BLACKLIST_GUARDS[role];
            if (blacklistGuard && !blacklistGuard.ALLOWED_PAGES.some(allowed => pagePath.startsWith(allowed))) {
                return {
                    allowed: false,
                    reason: 'BLACKLISTED',
                    redirect: blacklistGuard.REDIRECT
                };
            }
        }
        
        // Role guard
        const roleGuard = DRC_PAGES.ROUTING_RULES.ROLE_GUARDS[role];
        if (roleGuard) {
            const isAllowed = roleGuard.ALLOWED.some(allowed => pagePath.startsWith(allowed));
            const isRestricted = roleGuard.RESTRICTED.some(restricted => pagePath.startsWith(restricted));
            
            if (!isAllowed || isRestricted) {
                return {
                    allowed: false,
                    reason: 'ROLE_RESTRICTION',
                    redirect: role === 'BORROWER' ? '/cd/borrower/dashboard.html' : '/cd/lender/dashboard.html'
                };
            }
        }
        
        // Subscription guard for lenders
        if (role === 'LENDER' && subscription) {
            const subscriptionGuard = DRC_PAGES.ROUTING_RULES.SUBSCRIPTION_GUARDS[subscription.tier];
            if (subscriptionGuard) {
                if (subscriptionGuard.RESTRICTED_PAGES.some(restricted => pagePath.startsWith(restricted))) {
                    return {
                        allowed: false,
                        reason: 'SUBSCRIPTION_RESTRICTION',
                        redirect: '/cd/subscription/upgrade.html'
                    };
                }
                
                // Check expired subscription
                if (subscription.status === 'EXPIRED' && pagePath !== '/cd/subscription/expired.html') {
                    return {
                        allowed: false,
                        reason: 'SUBSCRIPTION_EXPIRED',
                        redirect: '/cd/subscription/expired.html'
                    };
                }
            }
        }
        
        return { allowed: true };
    },
    
    // Generate page navigation based on user role
    generateNavigation: (userRole) => {
        const baseNav = [
            {
                id: 'home',
                label: DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS.NAVIGATION.HOME.FR,
                path: DRC_PAGES.PAGE_HIERARCHY.LEVEL_1.HOME,
                icon: '🏠'
            }
        ];
        
        if (userRole === 'BORROWER' || userRole === 'LENDER' || userRole === 'GROUP_ADMIN') {
            baseNav.push({
                id: 'emergency-hub',
                label: DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS.NAVIGATION.EMERGENCY_HUB.FR,
                path: DRC_PAGES.PAGE_HIERARCHY.LEVEL_2.EMERGENCY_HUB.INDEX,
                icon: '🚨',
                children: Object.values(DRC_PAGES.PAGE_HIERARCHY.LEVEL_2.EMERGENCY_HUB.CATEGORIES).map((path, index) => ({
                    id: `category-${index}`,
                    label: Object.values(DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS.EMERGENCY_CATEGORIES)[index]?.FR || 'Catégorie',
                    path,
                    icon: ['🚌', '📶', '🔥', '🍲', '🚰', '⚡', '📺', '⛽', '🔧', '🛠️', '🧾', '🏪', '🛒', '🏗️', '🚶‍♂️', '🔄', '💊', '🎓', '💸'][index]
                }))
            });
        }
        
        if (userRole === 'BORROWER') {
            baseNav.push({
                id: 'borrower-dashboard',
                label: DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS.NAVIGATION.BORROWERS.FR,
                path: DRC_PAGES.PAGE_HIERARCHY.LEVEL_2.BORROWER.DASHBOARD,
                icon: '💼'
            });
        }
        
        if (userRole === 'LENDER' || userRole === 'GROUP_ADMIN') {
            baseNav.push({
                id: 'lender-dashboard',
                label: DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS.NAVIGATION.LENDERS.FR,
                path: DRC_PAGES.PAGE_HIERARCHY.LEVEL_2.LENDER.DASHBOARD,
                icon: '💰'
            });
            
            if (userRole === 'LENDER') {
                baseNav.push({
                    id: 'subscription',
                    label: 'Abonnement',
                    path: DRC_PAGES.PAGE_HIERARCHY.LEVEL_2.SUBSCRIPTION.CURRENT,
                    icon: '📋'
                });
            }
        }
        
        return baseNav;
    },
    
    // Localize page content
    localizeContent: (contentKey, language = 'FR') => {
        const keys = contentKey.split('.');
        let value = DRC_PAGES.LOCALIZED_CONTENT.TRANSLATIONS;
        
        for (const key of keys) {
            value = value[key];
            if (!value) return contentKey; // Return key if translation not found
        }
        
        return value[language] || value.FR || contentKey;
    },
    
    // Format currency for display
    formatCurrency: (amount, language = 'FR') => {
        const format = DRC_PAGES.LOCALIZED_CONTENT.CURRENCY_FORMAT[language];
        if (!format) {
            return `${amount} FC`;
        }
        
        const formatted = amount.toLocaleString('fr-CD', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        return `${formatted} ${format.SYMBOL}`;
    }
};

// Export the pages configuration
export default DRC_PAGES;

// Freeze the configuration to prevent modifications
Object.freeze(DRC_PAGES);
Object.freeze(DRC_PAGES.PAGE_HIERARCHY);
Object.freeze(DRC_PAGES.ROUTING_RULES);
Object.freeze(DRC_PAGES.LOCALIZED_CONTENT);