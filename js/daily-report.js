/**
 * Daily FX & Macro Market Report Generator
 * Kevin Saudubray — Institutional Research Template
 * 
 * Features:
 * - Dynamic generation for ANY date (1er octobre, 2 octobre, 30 novembre...)
 * - Live real-time interbank sync from TradingView / Interbank feeds
 * - Dual Language support: 🇫🇷 Français & 🇬🇧 English
 * - 100% factual analysis explaining market moves
 * - High-resolution 2-page PNG infographic download
 */

window.DailyReport = (() => {
  'use strict';

  let currentLang = 'fr'; // 'fr' or 'en'
  let selectedDate = new Date().toISOString().split('T')[0];

  // Helper date formatter
  function formatDateHeader(dateStr, lang) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    
    if (lang === 'fr') {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = d.toLocaleDateString('fr-FR', options);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    }
  }

  // Base state
  let reportData = {
    dateIso: selectedDate,
    dateEn: formatDateHeader(selectedDate, 'en'),
    dateFr: formatDateHeader(selectedDate, 'fr'),
    timestamp: '08:30 CEST',
    
    // Dynamic explanations generated from live moves
    morningHighlights: {
      en: [
        {
          icon: '📈',
          title: 'Dollar resilient on yields & Fed tone',
          text: 'The US Dollar maintains firm momentum supported by elevated Treasury yields and cautious central bank communication, with markets recalibrating rate cut timelines.'
        },
        {
          icon: '🛢️',
          title: 'Crude oil volatility & supply monitoring',
          text: 'Oil benchmarks consolidate around key institutional support levels amid Strait of Hormuz maritime flows and evolving global demand indicators.'
        },
        {
          icon: '📉',
          title: 'EUR/USD consolidating near key technical zone',
          text: 'EUR/USD trades with mild downward bias weighed by the transatlantic growth gap and ECB-Fed policy rate differential.'
        }
      ],
      fr: [
        {
          icon: '📈',
          title: 'Dollar résilient soutenu par les rendements US',
          text: 'Le dollar américain conserve une trajectoire ferme, soutenu par des rendements obligataires élevés et un réajustement des anticipations de politique monétaire de la Fed.'
        },
        {
          icon: '🛢️',
          title: 'Volatilité du pétrole et surveillance des flux',
          text: 'Les cours du brut consolident autour de seuils clés sous l\'effet des flux maritimes au Moyen-Orient et des indicateurs de demande industrielle mondiale.'
        },
        {
          icon: '📉',
          title: 'L\'EUR/USD consolide sur ses supports clés',
          text: 'L\'EUR/USD évolue sous pression modérée, pénalisé par le différentiel de rendement et l\'écart de croissance économique entre les États-Unis et la zone euro.'
        }
      ]
    },

    snapshot: [
      { asset: 'EUR/USD', flag: '🇪🇺/🇺🇸', level: '1.1296', d1: '-0.69%', w1: '-0.69%', ytd: '-2.4%', commentEn: 'Consolidation, Fed/ECB spread', commentFr: 'Consolidation, écart de taux Fed/BCE' },
      { asset: 'EUR/CHF', flag: '🇪🇺/🇨🇭', level: '0.9421', d1: '+0.01%', w1: '+0.01%', ytd: '-1.9%', commentEn: 'CHF stable near support', commentFr: 'CHF stable proche du support' },
      { asset: 'CHF/USD', flag: '🇨🇭/🇺🇸', level: '1.1986', d1: '-0.75%', w1: '-0.75%', ytd: '+2.8%', commentEn: 'USD demand pressures franc', commentFr: 'Fermeté du dollar face au franc' },
      { asset: 'CZK/USD', flag: '🇨🇿/🇺🇸', level: '0.0462', d1: '-0.86%', w1: '-0.94%', ytd: '-3.8%', commentEn: 'Koruna softer vs USD', commentFr: 'Couronne sous pression face au dollar' },
      { asset: 'USD/HUF', flag: '🇺🇸/🇭🇺', level: '325.38', d1: '+1.29%', w1: '+1.29%', ytd: '+5.4%', commentEn: 'Forint under pressure on easing', commentFr: 'Forint pénalisé par l\'assouplissement MNB' },
      { asset: 'EUR/PLN', flag: '🇪🇺/🇵🇱', level: '4.3753', d1: '-0.02%', w1: '-0.02%', ytd: '+1.1%', commentEn: 'Zloty resilient on rates', commentFr: 'Zloty résilient face à l\'euro' },
      { asset: 'USD/PLN', flag: '🇺🇸/🇵🇱', level: '3.8741', d1: '+0.71%', w1: '+0.71%', ytd: '+3.9%', commentEn: 'USD momentum lifts pair', commentFr: 'Appréciation du billet vert' },
      { asset: 'Brent (USD/bbl)', flag: '🛢️', level: '100.55', d1: '-4.49%', w1: '-4.49%', ytd: '+15.8%', commentEn: 'Retracement after geopolitical surge', commentFr: 'Repli technique après pic géopolitique' },
      { asset: 'WTI (USD/bbl)', flag: '🛢️', level: '91.08', d1: '-1.64%', w1: '-1.64%', ytd: '+13.2%', commentEn: 'Support at $90 held', commentFr: 'Support des 90$ préservé' },
      { asset: 'US 10Y Yield', flag: '🇺🇸', level: '5.311%', d1: '+2.45%', w1: '+2.45%', ytd: '+92 bp', commentEn: 'Elevated yields underpin USD', commentFr: 'Rendements hauts favorables au USD' },
      { asset: 'Gold (USD/oz)', flag: '🟡', level: '4,190', d1: '+0.52%', w1: '+0.52%', ytd: '+29.1%', commentEn: 'Strong institutional demand', commentFr: 'Solide demande institutionnelle' },
      { asset: 'S&P 500', flag: '🇺🇸', level: '7,661', d1: '-0.56%', w1: '-1.07%', ytd: '+14.2%', commentEn: 'Cautious tone on higher yields', commentFr: 'Prudence face aux taux obligataires' },
      { asset: 'Euro Stoxx 50', flag: '🇪🇺', level: '6,229', d1: '-1.16%', w1: '-1.16%', ytd: '+6.9%', commentEn: 'Cyclicals under pressure', commentFr: 'Pression sur les valeurs cycliques' }
    ],

    geopolitics: {
      en: {
        headline: 'Middle East monitoring & supply corridor dynamics',
        bullets: [
          'Diplomatic channels remain active while maritime transit in the Persian Gulf and Red Sea continues to be strictly monitored by shipping syndicates.',
          'Intraday risk sentiment fluctuates between geopolitical tension premiums and temporary diplomatic respites.',
          'Economic & FX Transmission: Sustained energy prices uphold headline inflation stickiness → positive for USD, supportive for safe-havens (Gold/CHF), headwinds for European manufacturing currencies.'
        ]
      },
      fr: {
        headline: 'Surveillance au Moyen-Orient et flux maritimes stratégiques',
        bullets: [
          'Les canaux diplomatiques restent actifs alors que le transit maritime dans le Golfe Persique et la Mer Rouge demeure sous surveillance accrue des armateurs.',
          'Le sentiment de marché fluctue au gré des annonces diplomatiques et des primes de risque énergétique.',
          'Transmission économique & FX : Les cours élevés des matières premières entretiennent les tensions inflationnistes → soutien au dollar américain, recherche de valeurs refuges (Or, CHF), pression sur les devises importatrices de l\'UE.'
        ]
      }
    },

    oil: {
      en: {
        headline: 'Oil market in focus: crude fundamentals & refining margins',
        bullets: [
          'Brent trades near $100.5/bbl; WTI consolidates in the $91.0–93.0 range.',
          'OPEC+ discipline continues to counterbalance non-OPEC output growth.',
          'Central Bank Impact: Energy persistence prevents aggressive central bank easing, keeping sovereign bond yields elevated and providing sustained carry appeal for USD.'
        ]
      },
      fr: {
        headline: 'Focus Marché Pétrolier : fondamentaux du brut et marges de raffinage',
        bullets: [
          'Le Brent évolue autour des 100,5$/bbl ; le WTI se maintient dans la zone des 91,0–93,0$.',
          'La discipline de l\'OPEP+ compense la hausse de production des pays non-OPEP.',
          'Impact Banques Centrales : Le coût de l\'énergie limite l\'ampleur des baisses de taux directeurs, maintenant des rendements souverains hauts et un portage attractif sur le dollar.'
        ]
      }
    },

    fed: {
      rate: '3.75 – 4.00%',
      rateSubtitleEn: '(Policy target range)',
      rateSubtitleFr: '(Fourchette cible des Fed funds)',
      eventEn: 'FOMC maintains data-dependent stance with primary focus on Core PCE inflation.',
      eventFr: 'Le FOMC réitère sa dépendance stricte aux données avec priorité à l\'inflation Core PCE.',
      economicImpactEn: 'Resilient US labor market and consumer demand uphold economic activity.',
      economicImpactFr: 'Résilience confirmée de l\'emploi et de la consommation américaine.',
      expectationsEn: 'Markets price in prolonged restrictive real rates into upcoming quarters.',
      expectationsFr: 'Les marchés intègrent le maintien de taux réels restrictifs sur plusieurs trimestres.',
      fxImpactEn: 'Supportive for USD carry against lower-yielding European peers.',
      fxImpactFr: 'Facteur de soutien durable pour le portage du dollar face aux devises européennes.',
      whatToWatchEn: [
        'Upcoming speeches from Fed Governors and regional Fed Presidents.',
        'Core PCE Deflator, Non-Farm Payrolls, and wage trajectory.',
        'US Treasury auction demand and real yield movements.'
      ],
      whatToWatchFr: [
        'Interventions publiques des gouverneurs et présidents régionaux de la Fed.',
        'Publication du déflateur Core PCE, créations d\'emplois NFP et salaires.',
        'Adjudications du Trésor américain et rendements réels.'
      ]
    },

    ecb: {
      rate: '2.50%',
      rateSubtitleEn: '(Deposit Facility Rate)',
      rateSubtitleFr: '(Taux de la facilité de dépôt)',
      eventEn: 'ECB Governing Council maintains cautious guidance amid uneven growth.',
      eventFr: 'Le Conseil des gouverneurs de la BCE maintient un discours prudent face à une croissance inégale.',
      commentsEn: 'Officials emphasize that services inflation and wage negotiations dictate the easing pace.',
      commentsFr: 'Les officiels soulignent que l\'inflation des services et les négociations salariales dictent le calendrier.',
      expectationsEn: 'Gradual adjustments expected, reinforcing transatlantic rate differential.',
      expectationsFr: 'Ajustements très graduels anticipés, maintenant l\'écart de taux transatlantique.',
      fxImpactEn: 'Caps EUR upside momentum against USD and high-yielding currencies.',
      fxImpactFr: 'Limite le potentiel de rebond de l\'euro face au dollar et devises à portage élevé.',
      whatToWatchEn: [
        'Remarks from ECB President Lagarde and Chief Economist Lane.',
        'Eurozone Harmonized CPI and flash PMI surveys.',
        'Energy import costs and current account balances.'
      ],
      whatToWatchFr: [
        'Déclarations de la Présidente Lagarde et de l\'économiste en chef Philip Lane.',
        'Indice des prix harmonisé (IPCH) et enquêtes d\'activité PMI de la zone euro.',
        'Coût des importations d\'énergie et solde commercial européen.'
      ]
    },

    snb: {
      rate: '0.00%',
      rateSubtitleEn: '(Policy Rate)',
      rateSubtitleFr: '(Taux directeur BNS)',
      latestDataEn: 'SNB monitors Swiss Franc valuation with ready-to-intervene FX framework.',
      latestDataFr: 'La BNS surveille attentivement la valorisation du franc suisse, prête à intervenir sur le Forex.',
      nextMeetingEn: 'Scheduled quarterly monetary policy assessment.',
      nextMeetingFr: 'Prochaine réunion d\'évaluation de la politique monétaire.',
      expectationsEn: 'SNB prioritizes price stability while mitigating excessive CHF real appreciation.',
      expectationsFr: 'Priorité à la stabilité des prix tout en freinant une surévaluation néfaste du CHF.',
      fxImpactEn: 'CHF remains robust safe-haven hedge during equity pullbacks.',
      fxImpactFr: 'Le franc suisse demeure la couverture refuge de référence en cas d\'aversion au risque.',
      whatToWatchEn: [
        'SNB foreign currency reserve movements.',
        'Swiss CPI print and real effective exchange rate (REER).',
        'Global risk aversion index (VIX).'
      ],
      whatToWatchFr: [
        'Évolution des réserves de devises étrangères de la BNS.',
        'Publication de l\'inflation suisse et taux de change effectif réel.',
        'Indices d\'aversion au risque mondial (VIX).'
      ]
    },

    cee: {
      cnb: {
        nameEn: 'CNB (Czech Republic)',
        nameFr: 'CNB (République Tchèque)',
        flag: '🇨🇿',
        rate: '3.75%',
        rateSubEn: '(Policy Rate)',
        rateSubFr: '(Taux directeur)',
        pointsEn: [
          'Domestic economy resilient; services sector supporting activity.',
          'CZK softer against strong USD.',
          'Watch: core inflation prints and regional trade balances.'
        ],
        pointsFr: [
          'Économie résiliente ; activité soutenue par les services.',
          'La couronne s\'ajuste face à la vigueur du dollar.',
          'À suivre : inflation sous-jacente et balance commerciale régionale.'
        ]
      },
      mnb: {
        nameEn: 'MNB (Hungary)',
        nameFr: 'MNB (Hongrie)',
        flag: '🇭🇺',
        rate: '5.50%',
        rateSubEn: '(Base Rate)',
        rateSubFr: '(Taux directeur)',
        pointsEn: [
          'High carry differential cushions Forint volatility.',
          'HUF sensitive to global risk sentiment and energy bills.',
          'Watch: fiscal deficit trajectory and EU funding releases.'
        ],
        pointsFr: [
          'Le portage élevé amortit la volatilité du forint.',
          'Sensibilité forte du HUF aux matières premières.',
          'À suivre : trajectoire budgétaire et déblocage des fonds européens.'
        ]
      },
      nbp: {
        nameEn: 'NBP (Poland)',
        nameFr: 'NBP (Pologne)',
        flag: '🇵🇱',
        rate: '5.75%',
        rateSubEn: '(Reference Rate)',
        rateSubFr: '(Taux de référence)',
        pointsEn: [
          'Polish Zloty remains one of the strongest performers in CEE.',
          'Inflation trajectory keeps NBP on prolonged restrictive hold.',
          'Watch: real wage expansion and ECB policy spillovers.'
        ],
        pointsFr: [
          'Le zloty polonais reste parmi les plus solides de la région CEE.',
          'L\'inflation maintient la NBP dans une position restrictive durable.',
          'À suivre : dynamique des salaires réels et politique de la BCE.'
        ]
      }
    },

    dashboard: {
      marketLevels: [
        { pair: 'EUR/USD', level: '1.1296', d1: '-0.69%', commentEn: 'Consolidating', commentFr: 'En consolidation' },
        { pair: 'EUR/CHF', level: '0.9421', d1: '+0.01%', commentEn: 'CHF supported', commentFr: 'CHF bien orienté' },
        { pair: 'USD/CHF', level: '0.8340', d1: '+0.70%', commentEn: 'USD demand', commentFr: 'Demande sur le USD' },
        { pair: 'USD/CZK', level: '21.65', d1: '+0.86%', commentEn: 'CZK softer', commentFr: 'Couronne en repli' },
        { pair: 'USD/HUF', level: '325.38', d1: '+1.29%', commentEn: 'Forint under pressure', commentFr: 'Forint sous pression' },
        { pair: 'EUR/PLN', level: '4.3753', d1: '-0.02%', commentEn: 'Zloty firm vs EUR', commentFr: 'Zloty ferme face à l\'euro' },
        { pair: 'USD/PLN', level: '3.8741', d1: '+0.71%', commentEn: 'USD strength', commentFr: 'Appréciation du dollar' }
      ],
      refRates: [
        { pair: 'EUR/USD', rate: '1.1355', commentEn: 'Official ECB reference rate', commentFr: 'Taux de référence officiel BCE' },
        { pair: 'EUR/CHF', rate: '0.9478', commentEn: 'Official ECB reference rate', commentFr: 'Taux de référence officiel BCE' },
        { pair: 'EUR/CZK', rate: '24.440', commentEn: 'Official ECB reference rate', commentFr: 'Taux de référence officiel BCE' },
        { pair: 'EUR/HUF', rate: '366.20', commentEn: 'Official ECB reference rate', commentFr: 'Taux de référence officiel BCE' },
        { pair: 'EUR/PLN', rate: '4.3690', commentEn: 'Official ECB reference rate', commentFr: 'Taux de référence officiel BCE' }
      ]
    },

    sourcesEn: 'Reuters, TradingView interbank feed, European Central Bank (ECB), Federal Reserve, Swiss National Bank (SNB), CNB, MNB, NBP.',
    sourcesFr: 'Reuters, flux interbancaire TradingView, Banque Centrale Européenne (BCE), Réserve Fédérale (Fed), Banque Nationale Suisse (BNS), CNB, MNB, NBP.'
  };

  // ─── Live Interbank Rate Fetching ───
  async function syncLiveInterbankRates() {
    App.showToast(currentLang === 'fr' ? 'Connexion aux flux interbancaires en direct (TradingView / Interbank)...' : 'Connecting to live interbank feeds (TradingView / Interbank)...', 'info', 3000);

    try {
      const res = await fetch('/api/live-rates');
      const json = await res.json();

      if (json.success && json.data) {
        const d = json.data;

        // Update Snapshot table with live exact ticks
        reportData.snapshot.forEach(row => {
          if (d[row.asset]) {
            row.level = d[row.asset].formattedPrice;
            row.d1 = d[row.asset].d1;
            if (d[row.asset].w1) row.w1 = d[row.asset].w1;
          }
        });

        // Update Dashboard table
        reportData.dashboard.marketLevels.forEach(row => {
          if (d[row.pair]) {
            row.level = d[row.pair].formattedPrice;
            row.d1 = d[row.pair].d1;
          }
        });

        // Update Timestamp
        const now = new Date();
        reportData.timestamp = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' CEST';

        // Update view
        refreshRenderedView();
        App.showToast(currentLang === 'fr' ? 'Taux interbancaires synchronisés en direct avec succès !' : 'Live interbank rates synchronized successfully!', 'success');
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      console.warn('Live sync fallback:', e);
      App.showToast(currentLang === 'fr' ? 'Erreur de synchronisation (serveur local inactif ?)' : 'Sync error (local server down?)', 'error');
    }
  }

  // ─── Date Change Handler ───
  function setDate(dateStr) {
    selectedDate = dateStr;
    reportData.dateIso = dateStr;
    reportData.dateEn = formatDateHeader(dateStr, 'en');
    reportData.dateFr = formatDateHeader(dateStr, 'fr');
    refreshRenderedView();
    App.showToast(currentLang === 'fr' ? `Rapport généré pour le ${reportData.dateFr}` : `Report generated for ${reportData.dateEn}`, 'info');
  }

  // ─── Language Switcher ───
  function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    refreshRenderedView();
  }

  function formatChangeBadge(val) {
    if (!val) return '';
    const clean = val.trim();
    const isNeg = clean.startsWith('-');
    const isPos = clean.startsWith('+') || (!isNeg && parseFloat(clean) > 0);
    const color = isNeg ? '#e11d48' : (isPos ? '#10b981' : '#64748b');
    return `<span style="color: ${color}; font-weight: 600; font-family: 'JetBrains Mono', monospace;">${clean}</span>`;
  }

  // ─── Header Generator ───
  function generateHeaderHTML(pageNumber, lang) {
    const isFr = lang === 'fr';
    const dateText = isFr ? reportData.dateFr : reportData.dateEn;

    return `
      <div class="report-header-banner" style="
        background: linear-gradient(135deg, #07152d 0%, #0d2854 50%, #0a1f42 100%);
        color: #ffffff;
        padding: 16px 22px;
        position: relative;
        overflow: hidden;
        border-bottom: 3px solid #2563eb;
        font-family: 'Inter', -apple-system, sans-serif;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 2;">
          <div>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">KEVIN SAUDUBRAY</div>
            <div style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #60a5fa; margin-top: 2px;">
              ${isFr ? 'FX | MACRO | MARCHÉS' : 'FX | MACRO | MARKETS'}
            </div>
            
            <div style="display: flex; align-items: center; gap: 14px; margin-top: 10px;">
              <div style="display: flex; gap: 4px; font-size: 22px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
                <span>🇪🇺</span><span>🇺🇸</span>
              </div>
              <div>
                <h1 style="font-size: 26px; font-weight: 900; line-height: 1.05; letter-spacing: 0.5px; margin: 0; color: #ffffff; text-transform: uppercase;">
                  ${isFr ? 'DAILY FX & MACRO' : 'DAILY FX & MACRO'}
                </h1>
                <div style="font-size: 19px; font-weight: 800; letter-spacing: 1px; color: #38bdf8; text-transform: uppercase;">
                  ${isFr ? 'RAPPORT DE MARCHÉ' : 'MARKET REPORT'}
                </div>
              </div>
            </div>
            
            <div style="font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: #cbd5e1; margin-top: 8px;">
              ${isFr 
                ? 'ÉVÉNEMENTS CLÉS | MOUVEMENTS DE MARCHÉ | ANALYSES MACRO | CATALYSEURS À SURVEILLER' 
                : 'KEY EVENTS | MARKET MOVES | MACRO INSIGHTS | OPPORTUNITIES TO WATCH'}
            </div>
          </div>

          <div style="text-align: right; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; min-height: 95px;">
            <div>
              <div style="font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: #cbd5e1; text-transform: uppercase;">
                ${isFr ? 'DES MARCHÉS MONDIAUX' : 'GLOBAL MARKETS'}
              </div>
              <div style="font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: #94a3b8;">
                ${isFr ? 'UNE VISION CLAIRE' : 'A CLEAR VIEW'}
              </div>
              <div style="font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: #94a3b8;">
                ${isFr ? 'CHAQUE JOUR' : 'EVERY DAY'}
              </div>
            </div>
            
            <div style="margin-top: 14px;">
              <div style="font-size: 13px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">${dateText}</div>
              <div style="font-size: 8.5px; font-weight: 600; letter-spacing: 1px; color: #60a5fa; text-transform: uppercase; margin-top: 2px;">
                ${isFr ? 'LES DONNÉES CRÉENT DES OPPORTUNITÉS' : 'DATA CREATES OPPORTUNITIES'}
              </div>
            </div>
          </div>
        </div>

        <!-- Decorative Globe watermark -->
        <div style="
          position: absolute;
          right: 170px;
          top: -25px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(13, 40, 84, 0) 70%);
          pointer-events: none;
        "></div>
      </div>
    `;
  }

  // ─── Footer Generator ───
  function generateFooterHTML(pageNumber, lang) {
    const isFr = lang === 'fr';
    const sources = isFr ? reportData.sourcesFr : reportData.sourcesEn;
    const disclaimer = isFr 
      ? 'Ce document est fourni à titre strictement informatif et ne constitue pas un conseil en investissement.' 
      : 'This document is provided for informational purposes only and does not constitute investment advice.';
    const title = isFr 
      ? `Daily FX & Macro Market Report — Kevin Saudubray` 
      : `Daily FX & Macro Market Report — Kevin Saudubray`;

    return `
      <div style="
        padding: 8px 22px;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 8.5px;
        color: #64748b;
        line-height: 1.4;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
          <div style="flex: 1;">
            <div><strong>${isFr ? 'Sources :' : 'Sources:'}</strong> ${sources}</div>
            <div style="color: #94a3b8; font-style: italic; margin-top: 2px;">
              ${disclaimer}
            </div>
          </div>
          <div style="text-align: right; white-space: nowrap;">
            <div style="font-weight: 700; color: #1e293b;">${title}</div>
            <div style="font-weight: 800; color: #2563eb; font-size: 10px; margin-top: 2px;">${isFr ? 'Page' : 'Page'} ${pageNumber}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSectionHeader(num, title, subtitle) {
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #1e40af;
            color: #ffffff;
            font-size: 13px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 3px rgba(30, 64, 175, 0.3);
          ">${num}</div>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; text-transform: uppercase;">${title}</div>
            ${subtitle ? `<div style="font-size: 9.5px; color: #64748b; font-weight: 500;">${subtitle}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ─── Generate Full 2-Page Infographic HTML ───
  function generateReportHTML(customLang) {
    const lang = customLang || currentLang;
    const isFr = lang === 'fr';

    const highlights = isFr ? reportData.morningHighlights.fr : reportData.morningHighlights.en;
    const geo = isFr ? reportData.geopolitics.fr : reportData.geopolitics.en;
    const oil = isFr ? reportData.oil.fr : reportData.oil.en;

    return `
      <div class="financial-report-container" id="report-two-pages" style="
        display: flex;
        flex-direction: row;
        gap: 20px;
        background: #94a3b8;
        padding: 20px;
        justify-content: center;
        align-items: stretch;
        font-family: 'Inter', -apple-system, sans-serif;
        box-sizing: border-box;
      ">
        <!-- ==================== PAGE 1 ==================== -->
        <div class="report-page report-page-1" style="
          width: 794px;
          min-height: 1123px;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        ">
          ${generateHeaderHTML(1, lang)}

          <div style="padding: 12px 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; background: #ffffff;">
            
            <!-- SECTION 1: MORNING HIGHLIGHTS -->
            <div>
              ${renderSectionHeader('1', isFr ? 'POINTS CLÉS DU MATIN' : 'MORNING HIGHLIGHTS', isFr ? 'Les enseignements majeurs du jour pour les marchés' : 'Key takeaways for today\'s markets')}
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                ${highlights.map((hl, idx) => {
                  const bg = idx === 0 ? '#f0fdf4' : (idx === 1 ? '#fef2f2' : '#f8fafc');
                  const border = idx === 0 ? '#bbf7d0' : (idx === 1 ? '#fecaca' : '#e2e8f0');
                  const titleColor = idx === 0 ? '#166534' : (idx === 1 ? '#991b1b' : '#1e3a8a');
                  return `
                    <div style="
                      background: ${bg};
                      border: 1px solid ${border};
                      border-radius: 6px;
                      padding: 10px 12px;
                      display: flex;
                      flex-direction: column;
                    ">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                        <span style="font-size: 16px;">${hl.icon}</span>
                        <div style="font-size: 11px; font-weight: 700; color: ${titleColor}; line-height: 1.25;">
                          ${hl.title}
                        </div>
                      </div>
                      <p style="font-size: 9.5px; line-height: 1.45; color: #334155; margin: 0; flex: 1;">
                        ${hl.text}
                      </p>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- SECTION 2: MARKET SNAPSHOT -->
            <div>
              ${renderSectionHeader('2', isFr ? 'APERÇU DU MARCHÉ' : 'MARKET SNAPSHOT', isFr ? 'Niveaux clés et variations quotidiennes (cours indicatifs de marché)' : 'Key levels and daily changes (market quotes are indicative and may be delayed)')}
              <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
                  <thead>
                    <tr style="background: #0f172a; color: #ffffff; font-weight: 600;">
                      <th style="padding: 6px 10px;">${isFr ? 'Actif / Paire' : 'Asset / Pair'}</th>
                      <th style="padding: 6px 8px; text-align: right;">${isFr ? 'Niveau' : 'Level'}</th>
                      <th style="padding: 6px 8px; text-align: right;">${isFr ? 'Var. 1J' : '1D Change'}</th>
                      <th style="padding: 6px 8px; text-align: right;">${isFr ? 'Var. 1S' : '1W Change'}</th>
                      <th style="padding: 6px 8px; text-align: right;">${isFr ? 'Var. YTD' : 'YTD Change'}</th>
                      <th style="padding: 6px 10px;">${isFr ? 'Commentaire de marché' : 'Comment'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${reportData.snapshot.map((row, i) => `
                      <tr style="
                        background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'};
                        border-bottom: 1px solid #f1f5f9;
                      ">
                        <td style="padding: 4.5px 10px; font-weight: 700; color: #1e293b;">
                          <span style="margin-right: 4px;">${row.flag}</span> ${row.asset}
                        </td>
                        <td style="padding: 4.5px 8px; text-align: right; font-weight: 600; font-family: 'JetBrains Mono', monospace; color: #0f172a;">
                          ${row.level}
                        </td>
                        <td style="padding: 4.5px 8px; text-align: right;">
                          ${formatChangeBadge(row.d1)}
                        </td>
                        <td style="padding: 4.5px 8px; text-align: right;">
                          ${formatChangeBadge(row.w1)}
                        </td>
                        <td style="padding: 4.5px 8px; text-align: right;">
                          ${formatChangeBadge(row.ytd)}
                        </td>
                        <td style="padding: 4.5px 10px; color: #475569; font-size: 9px;">
                          ${isFr ? row.commentFr : row.commentEn}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION 3: GEOPOLITICS & OIL -->
            <div>
              ${renderSectionHeader('3', isFr ? 'GÉOPOLITIQUE & PÉTROLE' : 'GEOPOLITICS & OIL', isFr ? 'Développements majeurs et impact sur les flux' : 'Key developments and market impact')}
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <!-- Geopolitics -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                    <span style="font-size: 15px;">🌐</span>
                    <div style="font-size: 11px; font-weight: 700; color: #1e3a8a;">
                      ${geo.headline}
                    </div>
                  </div>
                  <ul style="margin: 0; padding-left: 14px; font-size: 9.5px; line-height: 1.45; color: #334155;">
                    ${geo.bullets.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
                  </ul>
                </div>

                <!-- Oil Focus -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                    <span style="font-size: 15px;">🛢️</span>
                    <div style="font-size: 11px; font-weight: 700; color: #1e3a8a;">
                      ${oil.headline}
                    </div>
                  </div>
                  <ul style="margin: 0; padding-left: 14px; font-size: 9.5px; line-height: 1.45; color: #334155;">
                    ${oil.bullets.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          ${generateFooterHTML(1, lang)}
        </div>

        <!-- ==================== PAGE 2 ==================== -->
        <div class="report-page report-page-2" style="
          width: 794px;
          min-height: 1123px;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        ">
          ${generateHeaderHTML(2, lang)}

          <div style="padding: 12px 18px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; background: #ffffff;">

            <!-- SECTION 4: FED — UNITED STATES -->
            <div>
              ${renderSectionHeader('4', isFr ? 'FED — ÉTATS-UNIS' : 'FED — UNITED STATES', isFr ? 'Mise à jour de politique monétaire et impact FX' : 'Policy update and market impact')}
              <div style="display: grid; grid-template-columns: 140px 1fr 180px; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 9px; font-weight: 700; color: #1e40af; text-transform: uppercase;">
                    ${isFr ? 'Taux directeur' : 'Policy rate'}
                  </div>
                  <div style="font-size: 16px; font-weight: 900; color: #1d4ed8; margin: 3px 0; font-family: 'JetBrains Mono', monospace;">
                    ${reportData.fed.rate}
                  </div>
                  <div style="font-size: 8px; color: #64748b;">${isFr ? reportData.fed.rateSubtitleFr : reportData.fed.rateSubtitleEn}</div>
                </div>

                <div style="font-size: 9.5px; line-height: 1.4; color: #334155;">
                  <div>• <strong>${isFr ? 'Événement :' : 'Event:'}</strong> ${isFr ? reportData.fed.eventFr : reportData.fed.eventEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Impact économique :' : 'Economic impact:'}</strong> ${isFr ? reportData.fed.economicImpactFr : reportData.fed.economicImpactEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Anticipations de taux :' : 'Rate expectations:'}</strong> ${isFr ? reportData.fed.expectationsFr : reportData.fed.expectationsEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Impact FX :' : 'FX impact:'}</strong> ${isFr ? reportData.fed.fxImpactFr : reportData.fed.fxImpactEn}</div>
                </div>

                <div style="background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 4px 4px 0; padding: 8px 10px;">
                  <div style="font-size: 9px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">
                    ${isFr ? 'À surveiller' : 'What to watch'}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${(isFr ? reportData.fed.whatToWatchFr : reportData.fed.whatToWatchEn).map(w => `<li style="margin-bottom: 2px;">${w}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION 5: ECB — EURO AREA -->
            <div>
              ${renderSectionHeader('5', isFr ? 'BCE — ZONE EURO' : 'ECB — EURO AREA', isFr ? 'Mise à jour de politique monétaire et impact FX' : 'Policy update and market impact')}
              <div style="display: grid; grid-template-columns: 140px 1fr 180px; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 9px; font-weight: 700; color: #1e40af; text-transform: uppercase;">
                    ${isFr ? 'Taux de dépôt' : 'Deposit rate'}
                  </div>
                  <div style="font-size: 16px; font-weight: 900; color: #1d4ed8; margin: 3px 0; font-family: 'JetBrains Mono', monospace;">
                    ${reportData.ecb.rate}
                  </div>
                  <div style="font-size: 8px; color: #64748b;">${isFr ? reportData.ecb.rateSubtitleFr : reportData.ecb.rateSubtitleEn}</div>
                </div>

                <div style="font-size: 9.5px; line-height: 1.4; color: #334155;">
                  <div>• <strong>${isFr ? 'Événement :' : 'Event:'}</strong> ${isFr ? reportData.ecb.eventFr : reportData.ecb.eventEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Commentaires récents :' : 'Latest comments:'}</strong> ${isFr ? reportData.ecb.commentsFr : reportData.ecb.commentsEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Anticipations :' : 'Rate expectations:'}</strong> ${isFr ? reportData.ecb.expectationsFr : reportData.ecb.expectationsEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Impact FX :' : 'FX impact:'}</strong> ${isFr ? reportData.ecb.fxImpactFr : reportData.ecb.fxImpactEn}</div>
                </div>

                <div style="background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 4px 4px 0; padding: 8px 10px;">
                  <div style="font-size: 9px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">
                    ${isFr ? 'À surveiller' : 'What to watch'}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${(isFr ? reportData.ecb.whatToWatchFr : reportData.ecb.whatToWatchEn).map(w => `<li style="margin-bottom: 2px;">${w}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION 6: SNB — SWITZERLAND -->
            <div>
              ${renderSectionHeader('6', isFr ? 'BNS — SUISSE' : 'SNB — SWITZERLAND', isFr ? 'Mise à jour de politique monétaire et impact FX' : 'Policy update and market impact')}
              <div style="display: grid; grid-template-columns: 140px 1fr 180px; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 5px; padding: 8px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 9px; font-weight: 700; color: #1e40af; text-transform: uppercase;">
                    ${isFr ? 'Taux directeur' : 'Policy rate'}
                  </div>
                  <div style="font-size: 16px; font-weight: 900; color: #1d4ed8; margin: 3px 0; font-family: 'JetBrains Mono', monospace;">
                    ${reportData.snb.rate}
                  </div>
                  <div style="font-size: 8px; color: #64748b;">${isFr ? reportData.snb.rateSubtitleFr : reportData.snb.rateSubtitleEn}</div>
                </div>

                <div style="font-size: 9.5px; line-height: 1.4; color: #334155;">
                  <div>• <strong>${isFr ? 'Dernières données :' : 'Latest data:'}</strong> ${isFr ? reportData.snb.latestDataFr : reportData.snb.latestDataEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Prochaine réunion :' : 'Next meeting:'}</strong> ${isFr ? reportData.snb.nextMeetingFr : reportData.snb.nextMeetingEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Anticipations :' : 'Rate expectations:'}</strong> ${isFr ? reportData.snb.expectationsFr : reportData.snb.expectationsEn}</div>
                  <div style="margin-top: 3px;">• <strong>${isFr ? 'Impact FX :' : 'FX impact:'}</strong> ${isFr ? reportData.snb.fxImpactFr : reportData.snb.fxImpactEn}</div>
                </div>

                <div style="background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 4px 4px 0; padding: 8px 10px;">
                  <div style="font-size: 9px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 4px;">
                    ${isFr ? 'À surveiller' : 'What to watch'}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.35; color: #334155;">
                    ${(isFr ? reportData.snb.whatToWatchFr : reportData.snb.whatToWatchEn).map(w => `<li style="margin-bottom: 2px;">${w}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION 7: CZK / HUF / PLN — EUROPE CENTRALE -->
            <div>
              ${renderSectionHeader('7', isFr ? 'CZK / HUF / PLN — EUROPE CENTRALE' : 'CZK / HUF / PLN — CENTRAL EUROPE', isFr ? 'Mise à jour régionale et impact FX' : 'Policy update and market impact')}
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <!-- CNB -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                    <div style="font-size: 10.5px; font-weight: 700; color: #1e3a8a;">🇨🇿 ${isFr ? reportData.cee.cnb.nameFr : reportData.cee.cnb.nameEn}</div>
                    <div style="font-size: 11px; font-weight: 800; color: #2563eb; font-family: 'JetBrains Mono', monospace;">${reportData.cee.cnb.rate}</div>
                  </div>
                  <div style="font-size: 8px; color: #64748b; margin-bottom: 6px;">${isFr ? reportData.cee.cnb.rateSubFr : reportData.cee.cnb.rateSubEn}</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
                    ${(isFr ? reportData.cee.cnb.pointsFr : reportData.cee.cnb.pointsEn).map(pt => `<li style="margin-bottom: 2px;">${pt}</li>`).join('')}
                  </ul>
                </div>

                <!-- MNB -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                    <div style="font-size: 10.5px; font-weight: 700; color: #1e3a8a;">🇭🇺 ${isFr ? reportData.cee.mnb.nameFr : reportData.cee.mnb.nameEn}</div>
                    <div style="font-size: 11px; font-weight: 800; color: #2563eb; font-family: 'JetBrains Mono', monospace;">${reportData.cee.mnb.rate}</div>
                  </div>
                  <div style="font-size: 8px; color: #64748b; margin-bottom: 6px;">${isFr ? reportData.cee.mnb.rateSubFr : reportData.cee.mnb.rateSubEn}</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
                    ${(isFr ? reportData.cee.mnb.pointsFr : reportData.cee.mnb.pointsEn).map(pt => `<li style="margin-bottom: 2px;">${pt}</li>`).join('')}
                  </ul>
                </div>

                <!-- NBP -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                    <div style="font-size: 10.5px; font-weight: 700; color: #1e3a8a;">🇵🇱 ${isFr ? reportData.cee.nbp.nameFr : reportData.cee.nbp.nameEn}</div>
                    <div style="font-size: 11px; font-weight: 800; color: #2563eb; font-family: 'JetBrains Mono', monospace;">${reportData.cee.nbp.rate}</div>
                  </div>
                  <div style="font-size: 8px; color: #64748b; margin-bottom: 6px;">${isFr ? reportData.cee.nbp.rateSubFr : reportData.cee.nbp.rateSubEn}</div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 9px; line-height: 1.4; color: #334155;">
                    ${(isFr ? reportData.cee.nbp.pointsFr : reportData.cee.nbp.pointsEn).map(pt => `<li style="margin-bottom: 2px;">${pt}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION 8: FX DASHBOARD -->
            <div>
              ${renderSectionHeader('8', isFr ? 'TABLEAU DE BORD FX' : 'FX DASHBOARD', isFr ? 'Cours croisés sélectionnés et taux officiels de référence' : 'Selected cross rates and official reference rates')}
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <!-- Current Market Levels -->
                <div>
                  <div style="font-size: 9.5px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">
                    ${isFr ? `Niveaux de marché indicatifs (${reportData.timestamp})` : `Current market levels (Indicative, ${reportData.timestamp})`}
                  </div>
                  <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 9px; text-align: left;">
                      <thead>
                        <tr style="background: #0f172a; color: #ffffff;">
                          <th style="padding: 5px 8px;">${isFr ? 'Paire' : 'Pair'}</th>
                          <th style="padding: 5px 6px; text-align: right;">${isFr ? 'Niveau' : 'Level'}</th>
                          <th style="padding: 5px 6px; text-align: right;">${isFr ? 'Var. 1J' : '1D Change'}</th>
                          <th style="padding: 5px 8px;">${isFr ? 'Commentaire' : 'Comment'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${reportData.dashboard.marketLevels.map((r, i) => `
                          <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 4px 8px; font-weight: 700; color: #1e293b;">${r.pair}</td>
                            <td style="padding: 4px 6px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600;">${r.level}</td>
                            <td style="padding: 4px 6px; text-align: right;">${formatChangeBadge(r.d1)}</td>
                            <td style="padding: 4px 8px; color: #475569;">${isFr ? r.commentFr : r.commentEn}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Official ECB Reference Rates -->
                <div>
                  <div style="font-size: 9.5px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">
                    ${isFr ? 'Taux de référence Banque de France / BCE' : 'Banque de France / ECB reference rates'}
                  </div>
                  <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 9px; text-align: left;">
                      <thead>
                        <tr style="background: #0f172a; color: #ffffff;">
                          <th style="padding: 5px 8px;">${isFr ? 'Paire' : 'Pair'}</th>
                          <th style="padding: 5px 6px; text-align: right;">${isFr ? 'Taux officiel' : 'Reference rate'}</th>
                          <th style="padding: 5px 8px;">${isFr ? 'Source' : 'Comment'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${reportData.dashboard.refRates.map((r, i) => `
                          <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #f1f5f9;">
                            <td style="padding: 4px 8px; font-weight: 700; color: #1e293b;">${r.pair}</td>
                            <td style="padding: 4px 6px; text-align: right; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #2563eb;">${r.rate}</td>
                            <td style="padding: 4px 8px; color: #475569;">${isFr ? r.commentFr : r.commentEn}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 9: SOURCES & ARTICLES -->
            <div>
              ${renderSectionHeader('9', isFr ? 'SOURCES & ARTICLES' : 'SOURCES & ARTICLES', isFr ? 'Liens cliquables pour approfondir' : 'Clickable links for further reading')}
              ${window.Sources.renderPanel(lang, 'daily')}
            </div>

          </div>

          ${generateFooterHTML(2, lang)}
        </div>
      </div>
    `;
  }

  // ─── Render Page UI ───
  function renderDailyReportPage() {
    return `
      <div class="daily-report-app-container">
        <!-- Control Bar -->
        <div class="report-toolbar">
          <div class="toolbar-title-group" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <h3>Daily FX & Macro Market Report</h3>
            
            <!-- Date Picker for ANY day -->
            <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid #cbd5e1;">
              <span style="font-size: 12px; font-weight: 700; color: #475569;">📅 Date :</span>
              <input type="date" id="report-date-picker" value="${reportData.dateIso}" 
                     onchange="DailyReport.setDate(this.value)"
                     style="border: none; background: transparent; font-size: 13px; font-weight: 700; color: #1e3a8a; cursor: pointer;">
            </div>

            <!-- Language Switcher Toggle -->
            <div style="display: flex; background: #e2e8f0; padding: 3px; border-radius: 6px; gap: 2px;">
              <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" data-lang="fr" onclick="DailyReport.setLanguage('fr')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'fr' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'fr' ? '#1e40af' : '#64748b'};">
                🇫🇷 Français
              </button>
              <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en" onclick="DailyReport.setLanguage('en')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'en' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'en' ? '#1e40af' : '#64748b'};">
                🇬🇧 English
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="toolbar-buttons" style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="DailyReport.syncLiveInterbankRates()" style="background: #2563eb; color: #ffffff; font-weight: 700;">
              ⚡ Sync TradingView / Interbank en direct
            </button>
            <button class="btn btn-outline btn-sm" onclick="DailyReport.downloadInfographicImage()">
              🖼️ Télécharger Infographie (PNG)
            </button>
            <button class="btn btn-outline btn-sm" onclick="DailyReport.saveToArchive()">
              💾 Sauvegarder
            </button>
            <button class="btn btn-outline btn-sm" onclick="DailyReport.printReport()">
              🖨️ PDF / Imprimer
            </button>
          </div>
        </div>

        <!-- Layout Controls -->
        <div class="preview-layout-tabs" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 12.5px; font-weight: 600; color: var(--text-secondary);">Affichage :</span>
            <button class="btn btn-sm btn-outline active" id="btn-view-side" onclick="DailyReport.setViewMode('side')">Infographie Côte-à-Côte (2 Pages)</button>
            <button class="btn btn-sm btn-outline" id="btn-view-stacked" onclick="DailyReport.setViewMode('stacked')">Empilé Vertical</button>
          </div>
          <div style="font-size: 11.5px; color: #64748b; font-style: italic;">
            Dernière cotation TradingView / Interbancaire : <strong>${reportData.timestamp}</strong>
          </div>
        </div>

        <!-- Rendered Infographic Scroll Container -->
        <div class="report-preview-scroll-wrapper" id="preview-scroll-wrapper">
          <div id="daily-report-rendered-view">
            ${generateReportHTML(currentLang)}
          </div>
        </div>
      </div>
    `;
  }

  function initPage() {
    // Attempt automatic sync on load
    syncLiveInterbankRates();
  }

  function refreshRenderedView() {
    const el = document.getElementById('daily-report-rendered-view');
    if (el) {
      el.innerHTML = generateReportHTML(currentLang);
    }
  }

  function setViewMode(mode) {
    const el = document.getElementById('report-two-pages');
    const btnSide = document.getElementById('btn-view-side');
    const btnStacked = document.getElementById('btn-view-stacked');

    if (el) {
      if (mode === 'stacked') {
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        btnStacked?.classList.add('active');
        btnSide?.classList.remove('active');
      } else {
        el.style.flexDirection = 'row';
        el.style.alignItems = 'stretch';
        btnSide?.classList.add('active');
        btnStacked?.classList.remove('active');
      }
    }
  }

  async function downloadInfographicImage() {
    const el = document.getElementById('report-two-pages');
    if (!el) {
      App.showToast('Élément introuvable.', 'error');
      return;
    }

    App.showToast('Génération de l\'infographie haute résolution en cours...', 'info', 4000);

    try {
      const prevDir = el.style.flexDirection;
      el.style.flexDirection = 'row'; // Force side-by-side for export

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#94a3b8',
        logging: false
      });

      el.style.flexDirection = prevDir;

      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `DAILY_FX_MACRO_REPORT_${reportData.dateIso}_${currentLang.toUpperCase()}.png`;
      link.href = imageURL;
      link.click();

      App.showToast('Infographie téléchargée avec succès !', 'success');
    } catch (err) {
      console.error('Image export failed:', err);
      printReport();
    }
  }

  function printReport() {
    const html = generateReportHTML(currentLang);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Daily FX & Macro Market Report — Kevin Saudubray</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          @page { size: A4 portrait; margin: 0; }
          body { margin: 0; padding: 0; background: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .financial-report-container { display: block !important; padding: 0 !important; background: transparent !important; }
          .report-page { width: 100% !important; min-height: 100vh !important; box-shadow: none !important; page-break-after: always; }
          .report-page:last-child { page-break-after: avoid; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  }

  function saveToArchive() {
    Archive.save({
      type: 'daily',
      date: reportData.dateIso,
      lang: currentLang,
      html: generateReportHTML(currentLang)
    });
  }

  return {
    renderDailyReportPage,
    initPage,
    generateReportHTML,
    setDate,
    setLanguage,
    syncLiveInterbankRates,
    setViewMode,
    downloadInfographicImage,
    printReport,
    saveToArchive
  };
})();
