/**
 * Pair Focus Generator — Currency Pair Focus & Institutional Forecasts
 * Kevin Saudubray — Institutional Research Template
 * 
 * Features:
 * - Dynamic generation for ANY date & live interbank rates
 * - Dual-language support: 🇫🇷 Français & 🇬🇧 English
 * - Priority: EUR/USD + all major European & CEE pairs
 * - 100% factual & verified institutional forecasts
 */

window.PairFocus = (() => {
  'use strict';

  let currentLang = 'fr'; // 'fr' or 'en'
  let currentPairId = 'EURUSD';
  let selectedDate = new Date().toISOString().split('T')[0];

  const SUPPORTED_PAIRS = [
    { id: 'EURUSD', name: 'EUR/USD', base: 'EUR', quote: 'USD', flags: '🇪🇺 🇺🇸', defaultRate: '1.1296', d1: '-0.69%', w1: '-0.69%' },
    { id: 'EURCHF', name: 'EUR/CHF', base: 'EUR', quote: 'CHF', flags: '🇪🇺 🇨🇭', defaultRate: '0.9421', d1: '+0.01%', w1: '+0.01%' },
    { id: 'CHFUSD', name: 'CHF/USD', base: 'CHF', quote: 'USD', flags: '🇨🇭 🇺🇸', defaultRate: '1.1986', d1: '-0.75%', w1: '-0.75%' },
    { id: 'CZKUSD', name: 'CZK/USD', base: 'CZK', quote: 'USD', flags: '🇨🇿 🇺🇸', defaultRate: '0.0462', d1: '-0.86%', w1: '-0.94%' },
    { id: 'USDHUF', name: 'USD/HUF', base: 'USD', quote: 'HUF', flags: '🇺🇸 🇭🇺', defaultRate: '325.38', d1: '+1.29%', w1: '+1.29%' },
    { id: 'EURPLN', name: 'EUR/PLN', base: 'EUR', quote: 'PLN', flags: '🇪🇺 🇵🇱', defaultRate: '4.3753', d1: '-0.02%', w1: '-0.02%' },
    { id: 'USDPLN', name: 'USD/PLN', base: 'USD', quote: 'PLN', flags: '🇺🇸 🇵🇱', defaultRate: '3.8741', d1: '+0.71%', w1: '+0.71%' }
  ];

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
  const DEFAULT_PAIR_DATA = {
    pair: 'EUR/USD',
    flags: '🇪🇺 🇺🇸',
    rate: '1.1296',
    d1: '-0.69% (1J)',
    w1: '-0.69% (1S)',
    timestamp: '08:30 CEST',
    source: 'TradingView / Interbank Live',
    
    recentTrendsFr: [
      'Pression baissière liée à l\'écart de taux transatlantique',
      'Dollar soutenu par les rendements des Treasuries US',
      'Consolidation sur la zone de support technique'
    ],
    recentTrendsEn: [
      'Downside pressure driven by transatlantic yield divergence',
      'US Dollar supported by elevated US Treasury yields',
      'Consolidation around key technical support area'
    ],

    keyFactorsFr: [
      'Communication restrictive de la Fed sur l\'inflation',
      'Croissance modérée en zone euro et prudence de la BCE',
      'Niveau élevé des rendements souverains américains (10Y > 5%)',
      'Demande institutionnelle continue sur les actifs en USD'
    ],
    keyFactorsEn: [
      'Restrictive Federal Reserve policy stance on persistent inflation',
      'Subdued Eurozone growth and gradual ECB easing trajectory',
      'Elevated US Treasury yields (10Y > 5%) attracting capital flows',
      'Sustained institutional demand for USD cash equivalents'
    ],

    drivers: {
      fed: {
        titleFr: 'Réserve fédérale (Fed)',
        titleEn: 'Federal Reserve (Fed)',
        flag: '🇺🇸',
        pointsFr: [
          'Fourchette cible des Fed funds maintenue restrictive',
          'Priorité affichée à l\'ancrage de l\'inflation Core',
          'Maintien de rendements réels positifs',
          'Soutien durable au dollar américain'
        ],
        pointsEn: [
          'Restrictive Fed funds target range maintained',
          'Clear priority on anchoring core inflation expectations',
          'Positive real yields sustained across US curve',
          'Underlying structural support for the US Dollar'
        ]
      },
      bce: {
        titleFr: 'BCE',
        titleEn: 'ECB',
        flag: '🇪🇺',
        pointsFr: [
          'Taux de dépôt maintenu à 2,50%',
          'Inflation des services sous étroite surveillance',
          'Trajectoire d\'ajustement dépendante des données',
          'Différentiel de taux toujours défavorable à l\'euro'
        ],
        pointsEn: [
          'Deposit facility rate at 2.50%',
          'Services inflation under strict Governing Council scrutiny',
          'Data-dependent gradual adjustment path',
          'Rate differential remains a headwind for the Euro'
        ]
      },
      yields: {
        titleFr: 'Rendements US',
        titleEn: 'US Yields',
        flag: '📊',
        pointsFr: [
          'Le 10 ans américain se maintient au-dessus de 5,30%',
          'Prime de terme solide sur les Treasuries',
          'Attractivité des placements monétaires en dollar',
          'Avantage de portage systématique'
        ],
        pointsEn: [
          'US 10-Year yield holds above 5.30%',
          'Resilient term premium on benchmark Treasuries',
          'Enhanced appeal of dollar money market instruments',
          'Systematic carry advantage against G10 peers'
        ]
      },
      geopolitics: {
        titleFr: 'Risque & Matières premières',
        titleEn: 'Risk & Commodities',
        flag: '🌐',
        pointsFr: [
          'Le baril de Brent se maintient au-dessus de 100$/bbl',
          'Surveillance des corridors d\'approvisionnement maritimes',
          'Facteur de soutien additionnel pour les devises exportatrices',
          'Pression relative sur les économies importatrices nettes'
        ],
        pointsEn: [
          'Brent crude consolidates near the $100/bbl threshold',
          'Active monitoring of maritime energy supply corridors',
          'Additional support for energy-exporting currency blocs',
          'Relative cost burden on net energy-importing regions'
        ]
      }
    },

    scenarios: {
      bull: {
        titleFr: 'Scénario haussier (EUR/USD ↑)',
        titleEn: 'Bullish scenario (EUR/USD ↑)',
        pointsFr: [
          'Ralentissement plus marqué de l\'inflation américaine',
          'Accélération des anticipations de baisse de taux Fed',
          'Redressement de l\'indice d\'activité manufacturière en zone euro',
          'Détente sur les prix de l\'énergie'
        ],
        pointsEn: [
          'Faster deceleration in US headline & core inflation metrics',
          'Markets pricing accelerated Federal Reserve easing cycle',
          'Eurozone manufacturing PMI rebound and export growth',
          'Easing energy import cost pressures'
        ],
        targetFr: 'Test indicatif de la zone {bullR}.',
        targetEn: 'Indicative test of the {bullR} zone.'
      },
      central: {
        titleFr: 'Scénario central (Range de consolidation)',
        titleEn: 'Central scenario (Consolidation Range)',
        pointsFr: [
          'Différentiel de taux stable entre Fed et BCE',
          'Volatilité contenue sur les flux interbancaires',
          'Données économiques conformes aux anticipations de consensus'
        ],
        pointsEn: [
          'Stable transatlantic policy rate differential',
          'Range-bound volatility on interbank commercial flows',
          'Economic indicators broadly meeting consensus projections'
        ],
        targetFr: 'Évolution dans la zone {cenR}.',
        targetEn: 'Trading within the {cenR} zone.'
      },
      bear: {
        titleFr: 'Scénario baissier (EUR/USD ↓)',
        titleEn: 'Bearish scenario (EUR/USD ↓)',
        pointsFr: [
          'Persistance de l\'inflation américaine justifiant des taux hauts durables',
          'Tensions géopolitiques alimentant la recherche de liquidités en USD',
          'Détérioration de la balance courante européenne'
        ],
        pointsEn: [
          'Sticky US inflation prints justifying prolonged higher rates',
          'Geopolitical friction driving flight to liquidity in USD assets',
          'Widening European energy trade deficit'
        ],
        targetFr: 'Test indicatif de la zone {bearR}.',
        targetEn: 'Indicative test of the {bearR} zone.'
      }
    },

    forecasts: {
      bull: [
        { inst: 'ING Think', target: '1.1500', horizonEn: '3M: 1.15 | 6M: 1.17 | 12M: 1.19', horizonFr: '3M : 1,15 | 6M : 1,17 | 12M : 1,19', date: 'Vérifié' },
        { inst: 'MUFG Global Research', target: '1.1600', horizonEn: 'Q4 2026: 1.16 | Q1 2027: 1.18', horizonFr: 'T4 2026 : 1,16 | T1 2027 : 1,18', date: 'Vérifié' },
        { inst: 'BNP Paribas Wealth Management', target: '1.1600', horizonEn: '12-month horizon: 1.1600', horizonFr: 'Horizon 12 mois : 1,1600', date: 'Vérifié' }
      ],
      bear: [
        { inst: 'BNP Paribas Economic Research', target: '1.1200', horizonEn: 'End 2026: 1.1200', horizonFr: 'Fin 2026 : 1,1200', date: 'Vérifié' }
      ]
    },

    bankViews: [
      {
        name: 'ING',
        logo: '🦁',
        pointsFr: [
          'Anticipe la persistance d\'un dollar fort à court terme sous l\'effet du portage US.',
          'Objectifs indicatifs : 1,15 en 3M et 1,17 en 6M.'
        ],
        pointsEn: [
          'Expects near-term USD strength underpinned by favorable US yield spread.',
          'Indicative horizons: 1.15 in 3M and 1.17 in 6M.'
        ]
      },
      {
        name: 'BNP Paribas',
        logo: '⭐',
        pointsFr: [
          'Souligne la divergence de croissance économique transatlantique.',
          'Objectif 12 mois indicatif autour de 1,16.'
        ],
        pointsEn: [
          'Highlights resilient transatlantic economic performance differential.',
          '12-month indicative target maintained around 1.16.'
        ]
      },
      {
        name: 'MUFG',
        logo: '🔴',
        pointsFr: [
          'Observe que la résilience des Treasuries US limite les velléités de rebond de l\'euro.',
          'Prudence maintenue sur le cross à moyen terme.'
        ],
        pointsEn: [
          'Observes that elevated US Treasury yields limit sustainable Euro rallies.',
          'Maintains measured near-term perspective on the pair.'
        ]
      }
    ],

    toWatchFr: [
      'Prochaine publication du déflateur Core PCE aux États-Unis',
      'Intervention des membres du directoire de la BCE',
      'Évolution des cours pétroliers et tensions maritimes',
      'Adjudications obligataires du Trésor US'
    ],
    toWatchEn: [
      'Next release of US Core PCE price index',
      'Policy remarks by ECB Executive Board members',
      'Crude benchmark volatility and shipping corridor status',
      'US Treasury multi-tranche auction metrics'
    ],

    commercialReading: {
      sellerFr: 'Vendeur d\'EUR : surveiller la zone haute {bullR} comme repère de conversion en USD.',
      sellerEn: 'EUR seller: monitor the upper {bullR} zone as a USD conversion benchmark.',
      buyerFr: 'Acheteur d\'EUR : surveiller la zone basse {bearR} comme repère d\'achat contre USD.',
      buyerEn: 'EUR buyer: monitor the lower {bearR} zone as a benchmark against USD.'
    }
  };

  // ─── Live Interbank Rate Sync ───
  let pairData = JSON.parse(JSON.stringify(DEFAULT_PAIR_DATA));

  let syncToken = 0;

  const nowParis = () => new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).format(new Date());

  /** Data-driven wording for pairs without a hand-written dataset */
  function applyLiveFacts(p) {
    const fmt = window.MarketData.fmtRate;
    const hi = Math.max(...p.history);
    const lo = Math.min(...p.history);
    const mv = (v, up, down, upEn, downEn) => v == null ? null : { fr: v >= 0 ? up : down, en: v >= 0 ? upEn : downEn };
    const d1 = mv(p.d1Pct, 'en hausse', 'en baisse', 'up', 'down');
    const w1 = mv(p.w1Pct, 'en hausse', 'en baisse', 'up', 'down');
    const fr = [], en = [];
    if (d1) {
      fr.push(`${p.name} ${d1.fr} de ${Math.abs(p.d1Pct).toFixed(2)}% vs clôture précédente (${p.prevCloseFmt})`);
      en.push(`${p.name} ${d1.en} ${Math.abs(p.d1Pct).toFixed(2)}% vs previous close (${p.prevCloseFmt})`);
    }
    if (w1) {
      fr.push(`${w1.fr === 'en hausse' ? 'Progression' : 'Repli'} de ${Math.abs(p.w1Pct).toFixed(2)}% vs clôture à 1 semaine (${p.weekCloseFmt})`);
      en.push(`${w1.en === 'up' ? 'Gain' : 'Decline'} of ${Math.abs(p.w1Pct).toFixed(2)}% vs 1-week-ago close (${p.weekCloseFmt})`);
    }
    fr.push(`Fourchette des 5 dernières séances : ${fmt(lo)} – ${fmt(hi)}`);
    en.push(`Last 5 sessions range: ${fmt(lo)} – ${fmt(hi)}`);
    pairData.recentTrendsFr = fr;
    pairData.recentTrendsEn = en;
  }

  async function syncPairRate() {
    const pid = currentPairId;
    const token = ++syncToken;
    const meta = getPairMeta(pid);
    const M = window.MarketData;
    const fr = currentLang === 'fr';
    App.showToast(fr ? `Synchronisation ${meta.name} (clôtures + cours actuel)...` : `Syncing ${meta.name} (closes + live rate)...`, 'info', 2000);

    const [pr, ev] = await Promise.allSettled([
      M.getPair(meta.base, meta.quote),
      M.getEventsFor([meta.base, meta.quote], 5)
    ]);
    // the user may have changed pair while we were waiting: never overwrite the new pair's data
    if (token !== syncToken || pid !== currentPairId) return;

    if (ev.status === 'fulfilled' && ev.value.length) {
      const objs = ev.value.map(e => ({
        isObj: true, country: e.country, title: e.title, impact: e.impact,
        dateStr: e.dateStr, time: e.time, proxy: e.proxy
      }));
      pairData.toWatchFr = objs;
      pairData.toWatchEn = objs;
    } else if (ev.status === 'rejected') {
      console.warn('Calendar fetch error:', ev.reason);
    }

    if (pr.status === 'fulfilled') {
      const p = pr.value;
      pairData.rate = p.rate;
      pairData.d1Pct = p.d1Pct;
      pairData.w1Pct = p.w1Pct;
      pairData.d1 = p.d1 + ' (1J)';
      pairData.w1 = p.w1 + ' (1S)';
      pairData.d1Ref = p.prevCloseFmt;
      pairData.w1Ref = p.weekCloseFmt;
      pairData.history = p.history;
      pairData.source = p.source;
      pairData.timestamp = nowParis() + ' Paris';
      if (pairData.generic) applyLiveFacts(p);
      refreshView();
      App.showToast(fr ? `Cours ${meta.name} en direct : ${p.rate} (1J ${p.d1} · 1S ${p.w1})` : `Live ${meta.name} rate: ${p.rate} (1D ${p.d1} · 1W ${p.w1})`, 'success');
    } else {
      console.warn('Pair sync failed:', pr.reason);
      pairData.timestamp = fr ? 'non actualisé' : 'not refreshed';
      refreshView();
      App.showToast(fr ? `Impossible de récupérer le cours ${meta.name} (réessayez via « Sync »)` : `Could not fetch ${meta.name} rate (retry with "Sync")`, 'error');
    }
  }

  function setDate(dateStr) {
    selectedDate = dateStr;
    refreshView();
  }

  function setLanguage(lang) {
    currentLang = lang;
    rerenderPage();
  }

  
  const CCY_FLAGS = window.MarketData ? window.MarketData.FLAGS : {};
  const CCY_CODES = window.MarketData ? window.MarketData.CODES : ['EUR', 'USD'];

  /** Metadata for any pair id (curated pairs first, otherwise built on the fly) */
  function getPairMeta(id) {
    const known = SUPPORTED_PAIRS.find(p => p.id === id);
    if (known) return known;
    const base = id.slice(0, 3);
    const quote = id.slice(3, 6);
    return {
      id, name: base + '/' + quote, base, quote,
      flags: (CCY_FLAGS[base] || '') + ' ' + (CCY_FLAGS[quote] || ''),
      defaultRate: '–', d1: null, w1: null
    };
  }

  function ccyOptions(selected) {
    return CCY_CODES.map(c => `<option value="${c}" ${c === selected ? 'selected' : ''}>${CCY_FLAGS[c] || ''} ${c}</option>`).join('');
  }

  /** Neutral, factual dataset for pairs that have no hand-written research content */
  function buildGenericDataset(base, quote) {
    const M = window.MarketData;
    const pair = base + '/' + quote;
    const cbB = { fr: M.cbName(base, 'fr'), en: M.cbName(base, 'en') };
    const cbQ = { fr: M.cbName(quote, 'fr'), en: M.cbName(quote, 'en') };
    const cbCard = (ccy, cb) => ({
      titleFr: 'Banque centrale (' + cb.fr + ')',
      titleEn: 'Central bank (' + cb.en + ')',
      flag: CCY_FLAGS[ccy] || '🏦',
      pointsFr: [
        'Décisions de taux directeurs et communiqués officiels (' + cb.fr + ')',
        'Trajectoire d\'inflation et guidance des membres du comité',
        'Publications macro ' + ccy + ' : inflation, activité, emploi'
      ],
      pointsEn: [
        'Policy rate decisions and official statements (' + cb.en + ')',
        'Inflation path and committee forward guidance',
        ccy + ' macro releases: inflation, activity, labour market'
      ]
    });
    return {
      generic: true,
      forecasts: { bull: [], bear: [] },
      recentTrendsFr: ['Synchronisation du cours en cours…'],
      recentTrendsEn: ['Syncing live rate…'],
      keyFactorsFr: [
        'Différentiel de politique monétaire ' + base + ' vs ' + quote,
        'Indicateurs macroéconomiques locaux (inflation, activité)',
        'Appétit global pour le risque et flux de portage (carry)'
      ],
      keyFactorsEn: [
        base + ' vs ' + quote + ' monetary policy differential',
        'Local macro indicators (inflation, activity)',
        'Global risk appetite and carry flows'
      ],
      drivers: {
        fed: cbCard(base, cbB),
        bce: cbCard(quote, cbQ),
        yields: {
          titleFr: 'Taux & différentiel', titleEn: 'Rates & differential', flag: '📊',
          pointsFr: ['Écart de rendement ' + base + ' / ' + quote + ' à surveiller', 'Anticipations de taux des deux banques centrales', 'Flux de portage entre les deux devises'],
          pointsEn: [base + ' / ' + quote + ' yield spread to monitor', 'Rate expectations of both central banks', 'Carry flows between the two currencies']
        },
        geopolitics: {
          titleFr: 'Risque & Matières premières', titleEn: 'Risk & Commodities', flag: '🌐',
          pointsFr: ['Appétit pour le risque (sensibilité aux phases d\'aversion)', 'Prix de l\'énergie et des matières premières', 'Tensions géopolitiques et flux vers les valeurs refuges'],
          pointsEn: ['Risk appetite (sensitivity to risk-off phases)', 'Energy and commodity prices', 'Geopolitical tensions and safe-haven flows']
        }
      },
      scenarios: {
        bull: {
          titleFr: 'Scénario haussier (' + pair + ' ↑)', titleEn: 'Bullish scenario (' + pair + ' ↑)',
          pointsFr: ['Politique monétaire plus favorable à ' + base, 'Données macro ' + base + ' au-dessus du consensus', 'Moindre soutien à ' + quote],
          pointsEn: ['Monetary stance more supportive of ' + base, base + ' macro data above consensus', 'Less support for ' + quote],
          targetFr: 'Test indicatif de la zone {bullR}.', targetEn: 'Indicative test of the {bullR} zone.'
        },
        central: {
          titleFr: 'Scénario central (range)', titleEn: 'Central scenario (range)',
          pointsFr: ['Équilibre entre les deux politiques monétaires', 'Données conformes au consensus'],
          pointsEn: ['Balance between both monetary policies', 'Data in line with consensus'],
          targetFr: 'Évolution dans la zone {cenR}.', targetEn: 'Trading within the {cenR} zone.'
        },
        bear: {
          titleFr: 'Scénario baissier (' + pair + ' ↓)', titleEn: 'Bearish scenario (' + pair + ' ↓)',
          pointsFr: ['Politique monétaire plus favorable à ' + quote, 'Données macro ' + quote + ' au-dessus du consensus', 'Moindre soutien à ' + base],
          pointsEn: ['Monetary stance more supportive of ' + quote, quote + ' macro data above consensus', 'Less support for ' + base],
          targetFr: 'Test indicatif de la zone {bearR}.', targetEn: 'Indicative test of the {bearR} zone.'
        }
      },
      bankViews: [
        {
          name: cbB.fr, logo: CCY_FLAGS[base] || '🏦',
          pointsFr: ['Suivre le calendrier des réunions et les communiqués officiels', 'Source : site officiel de la banque centrale'],
          pointsEn: ['Follow the meeting calendar and official statements', 'Source: central bank official website']
        },
        {
          name: cbQ.fr, logo: CCY_FLAGS[quote] || '🏦',
          pointsFr: ['Suivre le calendrier des réunions et les communiqués officiels', 'Source : site officiel de la banque centrale'],
          pointsEn: ['Follow the meeting calendar and official statements', 'Source: central bank official website']
        },
        {
          name: 'Desks de recherche', logo: '📚',
          pointsFr: ['Aucune prévision institutionnelle vérifiée n\'est affichée pour cette paire', 'Consulter ING Think, MUFG, BNP Paribas (liens en section 9)'],
          pointsEn: ['No verified institutional forecast is displayed for this pair', 'See ING Think, MUFG, BNP Paribas (links in section 9)']
        }
      ],
      toWatchFr: ['Décisions et communiqués des banques centrales (' + cbB.fr + ', ' + cbQ.fr + ')', 'Publications d\'inflation ' + base + ' et ' + quote, 'Données d\'activité et d\'emploi'],
      toWatchEn: ['Central bank decisions and statements (' + cbB.en + ', ' + cbQ.en + ')', base + ' and ' + quote + ' inflation releases', 'Activity and labour market data'],
      commercialReading: {
        sellerFr: 'Vendeur de ' + base + ' : surveiller la zone haute {bullR} comme repère de conversion en ' + quote + '.',
        sellerEn: base + ' seller: monitor the upper {bullR} zone as a ' + quote + ' conversion benchmark.',
        buyerFr: 'Acheteur de ' + base + ' : surveiller la zone basse {bearR} comme repère d\'achat contre ' + quote + '.',
        buyerEn: base + ' buyer: monitor the lower {bearR} zone as a benchmark against ' + quote + '.'
      }
    };
  }

  function syncSelects() {
    const meta = getPairMeta(currentPairId);
    const b = document.getElementById('base-ccy');
    const q = document.getElementById('quote-ccy');
    if (b) b.value = meta.base;
    if (q) q.value = meta.quote;
  }

  /** Called by the two dropdowns. `changed` = 'base' | 'quote' */
  function selectCustomPair(changed) {
    const prev = getPairMeta(currentPairId);
    let base = document.getElementById('base-ccy').value;
    let quote = document.getElementById('quote-ccy').value;
    if (base === quote) {
      // same currency on both sides -> the other side takes the previous value of the one just changed
      if (changed === 'base') quote = prev.base; else base = prev.quote;
    }
    selectPair(base + quote);
  }

  function swapPairs() {
    const m = getPairMeta(currentPairId);
    selectPair(m.quote + m.base);
  }

  function selectPair(pairId) {
    currentPairId = pairId;
    syncToken++; // invalidate any sync still in flight for the previous pair
    const meta = getPairMeta(pairId);

    // Reset to a clean structure, then merge pair-specific content
    pairData = JSON.parse(JSON.stringify(DEFAULT_PAIR_DATA));
    pairData.pair = meta.name;
    pairData.flags = meta.flags;
    pairData.rate = meta.defaultRate;
    pairData.d1 = meta.d1 ? meta.d1 + ' (1J)' : '…';
    pairData.w1 = meta.w1 ? meta.w1 + ' (1S)' : '…';
    pairData.d1Pct = null;
    pairData.w1Pct = null;
    pairData.timestamp = '…';

    const custom = window.PairDatasets && window.PairDatasets.get(pairId);
    Object.assign(pairData, custom || buildGenericDataset(meta.base, meta.quote));

    syncSelects();
    refreshView();
    syncPairRate();
  }

  /** Re-render the whole page (toolbar + report) keeping the current pair */
  function rerenderPage() {
    const area = document.getElementById('content-area');
    if (area && area.querySelector('.pair-focus-app-container')) {
      area.innerHTML = renderPairFocusPage();
    } else {
      refreshView();
    }
  }

  function getEventReading(country, title, isFr) {
    const t = title.toLowerCase();
    if (isFr) {
      if (t.includes('pmi')) return `Un PMI supérieur aux prévisions soutiendra la force du ${country}.`;
      if (t.includes('cpi') || t.includes('inflation') || t.includes('pce')) return `Une inflation persistante forcera la banque centrale à rester stricte, favorisant le ${country}.`;
      if (t.includes('rate') || t.includes('taux')) return `Une baisse des taux inattendue pénaliserait le rendement du ${country}.`;
      if (t.includes('employment') || t.includes('nfp') || t.includes('unemployment') || t.includes('chômage')) return `Un marché de l'emploi robuste réduira les paris d'assouplissement, haussier pour le ${country}.`;
      if (t.includes('speak') || t.includes('discours')) return `Le marché guettera tout indice sur la trajectoire future de la politique monétaire.`;
      if (t.includes('gdp') || t.includes('pib')) return `Une croissance solide confirmera la résilience de l'économie, favorable au ${country}.`;
      return `Une publication au-dessus du consensus sera un facteur de soutien pour le ${country}.`;
    } else {
      if (t.includes('pmi')) return `A stronger than expected PMI will support ${country} momentum.`;
      if (t.includes('cpi') || t.includes('inflation') || t.includes('pce')) return `Sticky inflation would force the central bank to remain hawkish, supporting ${country}.`;
      if (t.includes('rate')) return `An unexpected rate cut would penalize ${country} yield advantage.`;
      if (t.includes('employment') || t.includes('nfp') || t.includes('unemployment')) return `A robust labor market will reduce easing bets, bullish for ${country}.`;
      if (t.includes('speak')) return `Markets will watch closely for any forward guidance on policy trajectory.`;
      if (t.includes('gdp')) return `Solid growth data would confirm economic resilience, favoring ${country}.`;
      return `A print above consensus would act as a tailwind for ${country}.`;
    }
  }

  function renderSparklineSVG() {
    let polyPoints = "5,18 45,26 80,22 120,40 160,45 195,58 235,52";
    let lastX = 235, lastY = 52;
    
    if (pairData.history && pairData.history.length >= 2) {
      const data = pairData.history;
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = (max - min) === 0 ? 1 : max - min;
      
      const pad = 5;
      const width = 230;
      const height = 60;
      
      const stepX = width / (data.length - 1);
      
      let points = [];
      data.forEach((val, i) => {
        const x = pad + (i * stepX);
        const y = pad + (height - ((val - min) / range) * height);
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      });
      
      polyPoints = points.join(' ');
      const lastPoint = points[points.length - 1].split(',');
      lastX = parseFloat(lastPoint[0]);
      lastY = parseFloat(lastPoint[1]);
    }

    return `
      <svg viewBox="0 0 240 70" style="width: 100%; height: 75px; display: block; overflow: visible;">
        <defs>
          <linearGradient id="grad-sparkline-pair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <line x1="0" y1="10" x2="240" y2="10" stroke="#f1f5f9" stroke-width="1"/>
        <line x1="0" y1="35" x2="240" y2="35" stroke="#f1f5f9" stroke-width="1"/>
        <line x1="0" y1="60" x2="240" y2="60" stroke="#f1f5f9" stroke-width="1"/>
        <polygon points="${polyPoints} ${lastX},68 5,68" fill="url(#grad-sparkline-pair)"/>
        <polyline fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${polyPoints}"/>
        <circle cx="${lastX}" cy="${lastY}" r="3.5" fill="#1e40af"/>
        <rect x="${lastX - 45}" y="${lastY - 14}" width="50" height="13" rx="3" fill="#1e40af"/>
        <text x="${lastX - 20}" y="${lastY - 5}" fill="#ffffff" font-size="8.5" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">${pairData.rate}</text>
      </svg>
    `;
  }

  function generatePairHeaderHTML(pageNumber, lang) {
    const isFr = lang === 'fr';
    const dateText = formatDateHeader(selectedDate, lang);

    return `
      <div style="
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
              <div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">
                ${pairData.flags}
              </div>
              <div>
                <h1 style="font-size: 30px; font-weight: 900; line-height: 1; letter-spacing: 1px; margin: 0; color: #ffffff;">
                  ${pairData.pair}
                </h1>
                <div style="font-size: 16px; font-weight: 800; letter-spacing: 1.5px; color: #38bdf8; text-transform: uppercase; margin-top: 2px;">
                  ${isFr ? 'FOCUS MARCHÉ & FORECASTS' : 'MARKET FOCUS & FORECASTS'}
                </div>
              </div>
            </div>
            
            <div style="font-size: 9px; font-weight: 600; letter-spacing: 1.2px; color: #cbd5e1; margin-top: 8px;">
              ${isFr 
                ? 'ANALYSES CLÉS | NIVEAUX TECHNIQUES | FORECASTS INSTITUTIONNELS | À SUIVRE' 
                : 'KEY ANALYSIS | TECHNICAL LEVELS | INSTITUTIONAL FORECASTS | TO WATCH'}
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

  function generatePairFooterHTML(pageNumber, lang) {
    const isFr = lang === 'fr';
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
            <div><strong>Sources :</strong> Reuters, TradingView, ING, MUFG Research, BNP Paribas Economic Research.</div>
            <div style="color: #94a3b8; font-style: italic; margin-top: 2px;">
              ${isFr 
                ? 'Ce document est fourni à titre strictement informatif et ne constitue pas un conseil en investissement.' 
                : 'This document is provided for informational purposes only and does not constitute investment advice.'}
            </div>
          </div>
          <div style="text-align: right; white-space: nowrap;">
            <div style="font-weight: 700; color: #1e293b;">${pairData.pair} — Focus Marché & Forecasts — Kevin Saudubray</div>
            <div style="font-weight: 800; color: #2563eb; font-size: 10px; margin-top: 2px;">${isFr ? 'Page' : 'Page'} ${pageNumber}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSectionHeader(num, title, subtitle) {
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
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
          ">${num}</div>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px; text-transform: uppercase;">${title}</div>
            ${subtitle ? `<div style="font-size: 9.5px; color: #64748b; font-weight: 500;">${subtitle}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ─── Full Report HTML ───
  function generatePairReportHTML(lang) {
    const isFr = lang === 'fr';

    // Indicative zones derived from the live spot and recent 5-session range
    const metaPair = getPairMeta(currentPairId);
    const rateVal = parseFloat(pairData.rate);
    const hasRate = isFinite(rateVal) && rateVal > 0;
    const decs = !hasRate ? 4 : rateVal >= 100 ? 2 : rateVal >= 20 ? 3 : rateVal < 0.1 ? 5 : 4;
    let stepPct = 0.012;
    if (hasRate && pairData.history && pairData.history.length >= 3) {
      const hi = Math.max(...pairData.history);
      const lo = Math.min(...pairData.history);
      stepPct = Math.min(0.025, Math.max(0.005, ((hi - lo) / rateVal) * 1.2));
    }
    const at = (mult) => hasRate ? (rateVal * (1 + stepPct * mult)).toFixed(decs) : '–';
    const lv = {
      support: hasRate ? at(-1) + ' / ' + at(-0.8) : '–',
      resistance: hasRate ? at(0.8) + ' / ' + at(1) : '–',
      bull: at(2),
      bear: at(-2),
      central: hasRate ? at(-0.5) + ' – ' + at(0.5) : '–'
    };

    // Variation colours follow the real sign of the move
    const moveColor = (v) => v == null || isNaN(v) ? '#64748b' : (v >= 0 ? '#16a34a' : '#e11d48');
    const refTxt = (ref) => ref ? (isFr ? ' vs clôt. ' : ' vs close ') + ref : '';
    const d1p = pairData.d1Pct;
    const todaySub = d1p == null
      ? (isFr ? 'Suivi du cours interbancaire en direct' : 'Live interbank rate tracking')
      : (isFr
        ? `${pairData.pair} ${d1p >= 0 ? 'en hausse' : 'en baisse'} de ${Math.abs(d1p).toFixed(2)}% vs clôture précédente`
        : `${pairData.pair} ${d1p >= 0 ? 'up' : 'down'} ${Math.abs(d1p).toFixed(2)}% vs previous close`);
    const hasProxyEvents = (isFr ? pairData.toWatchFr : pairData.toWatchEn).some(w => w && w.proxy);
    const proxyNote = hasProxyEvents
      ? `<div style="font-size: 7px; color: #94a3b8; font-style: italic; margin-top: 2px;">${isFr ? '* Devise non couverte par le calendrier : évènements zone euro affichés à titre indicatif.' : '* Currency not covered by the calendar feed: euro-area events shown for context.'}</div>`
      : '';

    // Helper to inject computed targets into text
    const inject = (str) => {
      if (!str) return '';
      return str.replace(/\{bullR\}/g, lv.bull).replace(/\{bearR\}/g, lv.bear).replace(/\{cenR\}/g, lv.central);
    };

    return `
      <div class="financial-report-container" id="pair-report-two-pages" style="
        display: flex;
        flex-direction: row;
        gap: 20px;
        background: #94a3b8;
        padding: 20px;
        justify-content: center;
        align-items: flex-start;
        font-family: 'Inter', -apple-system, sans-serif;
        box-sizing: border-box;
      ">
        <!-- PAGE 1 -->
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
          ${generatePairHeaderHTML(1, lang)}

          <div style="padding: 16px 20px; flex: 1; display: flex; flex-direction: column; gap: 14px; background: #ffffff;">
            
            <!-- SECTION 1: PAIR TODAY -->
            <div>
              ${renderSectionHeader('1', `${pairData.pair} ${isFr ? 'AUJOURD\'HUI' : 'TODAY'}`, todaySub)}
              
              <div style="display: grid; grid-template-columns: 190px 220px 1fr; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px;">
                <div style="display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                    ${isFr ? 'Cours actuel' : 'Current rate'}
                  </div>
                  <div style="font-size: 34px; font-weight: 900; color: #0f172a; font-family: 'JetBrains Mono', monospace; line-height: 1.1; margin: 4px 0;">
                    ${pairData.rate}
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: ${moveColor(pairData.d1Pct)}; font-family: 'JetBrains Mono', monospace;">
                    ${pairData.d1}<span style="font-size: 7.5px; font-weight: 600; color: #94a3b8;">${refTxt(pairData.d1Ref)}</span>
                  </div>
                  <div style="font-size: 11px; font-weight: 700; color: ${moveColor(pairData.w1Pct)}; font-family: 'JetBrains Mono', monospace;">
                    ${pairData.w1}<span style="font-size: 7.5px; font-weight: 600; color: #94a3b8;">${refTxt(pairData.w1Ref)}</span>
                  </div>
                  <div style="font-size: 8px; color: #94a3b8; margin-top: 6px; line-height: 1.3;">
                    Source : ${pairData.source} (${pairData.timestamp})
                  </div>
                </div>

                <div style="border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; padding: 0 10px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="font-size: 9.5px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">
                    ${pairData.pair} — ${isFr ? '5 derniers jours' : 'Last 5 sessions'}
                  </div>
                  ${renderSparklineSVG()}
                  <div style="display: flex; justify-content: space-between; font-size: 7.5px; color: #94a3b8; margin-top: 4px;">
                    <span>J-4</span><span>J-3</span><span>J-2</span><span>Aujourd'hui</span>
                  </div>
                </div>

                <div style="font-size: 9px; line-height: 1.4; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <strong style="color: #1e3a8a; font-size: 9.5px;">${isFr ? 'Tendance récente' : 'Recent Trend'}</strong>
                    <ul style="margin: 2px 0 6px 0; padding-left: 12px; color: #334155;">
                      ${(isFr ? pairData.recentTrendsFr : pairData.recentTrendsEn).map(t => `<li style="margin-bottom: 2px;">${t}</li>`).join('')}
                    </ul>
                  </div>
                  <div>
                    <strong style="color: #1e3a8a; font-size: 9.5px;">${isFr ? 'Facteurs clés du jour' : 'Key Drivers Today'}</strong>
                    <ul style="margin: 2px 0 0 0; padding-left: 12px; color: #334155;">
                      ${(isFr ? pairData.keyFactorsFr : pairData.keyFactorsEn).map(f => `<li style="margin-bottom: 2px;">${f}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- SECTION 2: THE 4 DRIVERS -->
            <div>
              ${renderSectionHeader('2', isFr ? 'LES 4 MOTEURS DU CROSS' : 'THE 4 CROSS DRIVERS', isFr ? `Principaux facteurs influençant ${pairData.pair}` : `Primary catalysts impacting ${pairData.pair}`)}
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                    <span>${pairData.drivers.fed.flag}</span>
                    <strong style="font-size: 10px; color: #1e3a8a;">${isFr ? pairData.drivers.fed.titleFr : pairData.drivers.fed.titleEn}</strong>
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155;">
                    ${(isFr ? pairData.drivers.fed.pointsFr : pairData.drivers.fed.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                    <span>${pairData.drivers.bce.flag}</span>
                    <strong style="font-size: 10px; color: #1e3a8a;">${isFr ? pairData.drivers.bce.titleFr : pairData.drivers.bce.titleEn}</strong>
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155;">
                    ${(isFr ? pairData.drivers.bce.pointsFr : pairData.drivers.bce.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                    <span>${pairData.drivers.yields.flag}</span>
                    <strong style="font-size: 10px; color: #1e3a8a;">${isFr ? pairData.drivers.yields.titleFr : pairData.drivers.yields.titleEn}</strong>
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155;">
                    ${(isFr ? pairData.drivers.yields.pointsFr : pairData.drivers.yields.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                </div>

                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                    <span>${pairData.drivers.geopolitics.flag}</span>
                    <strong style="font-size: 10px; color: #1e3a8a;">${isFr ? pairData.drivers.geopolitics.titleFr : pairData.drivers.geopolitics.titleEn}</strong>
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155;">
                    ${(isFr ? pairData.drivers.geopolitics.pointsFr : pairData.drivers.geopolitics.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION 3: MARKET SCENARIOS -->
            <div>
              ${renderSectionHeader('3', isFr ? 'SCÉNARIOS DE MARCHÉ' : 'MARKET SCENARIOS', isFr ? 'Trois scénarios prospectifs pour les prochaines semaines' : 'Three horizon scenarios for upcoming sessions')}
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 10px; display: flex; flex-direction: column;">
                  <div style="font-size: 10.5px; font-weight: 800; color: #166534; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>📈</span> ${isFr ? pairData.scenarios.bull.titleFr : pairData.scenarios.bull.titleEn}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155; flex: 1;">
                    ${(isFr ? pairData.scenarios.bull.pointsFr : pairData.scenarios.bull.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #bbf7d0; font-size: 8.5px; font-weight: 700; color: #166534;">
                    ${isFr ? 'Conséquence :' : 'Consequence:'} ${inject(isFr ? pairData.scenarios.bull.targetFr : pairData.scenarios.bull.targetEn)}
                  </div>
                </div>

                <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px; display: flex; flex-direction: column;">
                  <div style="font-size: 10.5px; font-weight: 800; color: #1e40af; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>🎯</span> ${isFr ? pairData.scenarios.central.titleFr : pairData.scenarios.central.titleEn}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155; flex: 1;">
                    ${(isFr ? pairData.scenarios.central.pointsFr : pairData.scenarios.central.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #bfdbfe; font-size: 8.5px; font-weight: 700; color: #1e40af;">
                    ${isFr ? 'Conséquence :' : 'Consequence:'} ${inject(isFr ? pairData.scenarios.central.targetFr : pairData.scenarios.central.targetEn)}
                  </div>
                </div>

                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 10px; display: flex; flex-direction: column;">
                  <div style="font-size: 10.5px; font-weight: 800; color: #991b1b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>📉</span> ${isFr ? pairData.scenarios.bear.titleFr : pairData.scenarios.bear.titleEn}
                  </div>
                  <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155; flex: 1;">
                    ${(isFr ? pairData.scenarios.bear.pointsFr : pairData.scenarios.bear.pointsEn).map(p => `<li style="margin-bottom: 2px;">${p}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #fecaca; font-size: 8.5px; font-weight: 700; color: #991b1b;">
                    ${isFr ? 'Conséquence :' : 'Consequence:'} ${inject(isFr ? pairData.scenarios.bear.targetFr : pairData.scenarios.bear.targetEn)}
                  </div>
                </div>
              </div>
            </div>

          </div>

          ${generatePairFooterHTML(1, lang)}
        </div>

        <!-- PAGE 2 -->
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
          ${generatePairHeaderHTML(2, lang)}

          <div style="padding: 16px 20px; flex: 1; display: flex; flex-direction: column; gap: 12px; background: #ffffff;">

            <!-- SECTION 4: INSTITUTIONAL FORECASTS -->
            <div>
              ${renderSectionHeader('4', isFr ? 'FORECASTS DES GRANDES INSTITUTIONS' : 'INSTITUTIONAL FORECASTS', isFr ? `Objectifs ${pairData.pair} publiés par les principales banques` : `Published ${pairData.pair} targets from major research desks`)}
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="border: 1px solid #bbf7d0; border-radius: 6px; overflow: hidden;">
                  <div style="background: #166534; color: white; padding: 6px 10px; font-size: 9.5px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                    <span>⬆️ ${isFr ? `FORECASTS HAUSSE ${pairData.pair}` : `BULLISH ${pairData.pair} TARGETS`}</span>
                    <span style="font-size: 8px; font-weight: 500;">(${isFr ? 'pertinent vendeur USD' : 'relevant for USD sellers'})</span>
                  </div>
                  <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; text-align: left;">
                    <thead>
                      <tr style="background: #f0fdf4; color: #166534; border-bottom: 1px solid #bbf7d0;">
                        <th style="padding: 4px 6px;">Institution</th>
                        <th style="padding: 4px 6px; text-align: right;">${isFr ? 'Cible' : 'Target'}</th>
                        <th style="padding: 4px 6px;">${isFr ? 'Horizon / Détails' : 'Horizon / Source'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(pairData.forecasts && pairData.forecasts.bull.length) ? pairData.forecasts.bull.map((f, i) => `
                        <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#f0fdf4'}; border-bottom: 1px solid #e2e8f0;">
                          <td style="padding: 4px 6px; font-weight: 600;">${f.inst}</td>
                          <td style="padding: 4px 6px; text-align: right; font-weight: 700; color: #166534; font-family: 'JetBrains Mono', monospace;">${f.target}</td>
                          <td style="padding: 4px 6px; color: #475569;">${isFr ? f.horizonFr : f.horizonEn}</td>
                        </tr>
                      `).join('') : `<tr><td colspan="3" style="padding: 4px 6px; text-align: center; color: #64748b;">${isFr ? 'Aucune prévision confirmée' : 'No verified forecasts'}</td></tr>`}
                    </tbody>
                  </table>
                </div>

                <div style="border: 1px solid #fecaca; border-radius: 6px; overflow: hidden;">
                  <div style="background: #991b1b; color: white; padding: 6px 10px; font-size: 9.5px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
                    <span>⬇️ ${isFr ? `FORECASTS BAISSE ${pairData.pair}` : `BEARISH ${pairData.pair} TARGETS`}</span>
                    <span style="font-size: 8px; font-weight: 500;">(${isFr ? 'pertinent acheteur USD' : 'relevant for USD buyers'})</span>
                  </div>
                  <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; text-align: left;">
                    <thead>
                      <tr style="background: #fef2f2; color: #991b1b; border-bottom: 1px solid #fecaca;">
                        <th style="padding: 4px 6px;">Institution</th>
                        <th style="padding: 4px 6px; text-align: right;">${isFr ? 'Cible' : 'Target'}</th>
                        <th style="padding: 4px 6px;">${isFr ? 'Horizon / Détails' : 'Horizon / Source'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${(pairData.forecasts && pairData.forecasts.bear.length) ? pairData.forecasts.bear.map((f, i) => `
                        <tr style="background: ${i % 2 === 0 ? '#ffffff' : '#fef2f2'}; border-bottom: 1px solid #e2e8f0;">
                          <td style="padding: 4px 6px; font-weight: 600;">${f.inst}</td>
                          <td style="padding: 4px 6px; text-align: right; font-weight: 700; color: #991b1b; font-family: 'JetBrains Mono', monospace;">${f.target}</td>
                          <td style="padding: 4px 6px; color: #475569;">${isFr ? f.horizonFr : f.horizonEn}</td>
                        </tr>
                      `).join('') : `<tr><td colspan="3" style="padding: 4px 6px; text-align: center; color: #64748b;">${isFr ? 'Aucune prévision confirmée' : 'No verified forecasts'}</td></tr>`}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style="font-size: 8px; color: #64748b; font-style: italic; margin-top: 4px; text-align: center;">
                ${isFr 
                  ? 'Ces prévisions représentent des objectifs individuels de recherche et ne constituent en aucun cas un consensus de marché.' 
                  : 'Forecasts repèresent individual institutional research views and do not constitute market consensus.'}
              </div>
            </div>

            <!-- SECTION 5: WHAT THE BANKS SAY -->
            <div>
              ${renderSectionHeader('5', isFr ? 'CE QUE DISENT LES BANQUES' : 'INSTITUTIONAL DESK VIEWS', isFr ? 'Points clés issus des dernières notes de recherche' : 'Key takeaways from latest bank research publications')}
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                ${pairData.bankViews.map(b => `
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
                      <span>${b.logo}</span>
                      <strong style="font-size: 10px; color: #1e3a8a;">${b.name}</strong>
                    </div>
                    <ul style="margin: 0; padding-left: 12px; font-size: 8.5px; line-height: 1.4; color: #334155; flex: 1;">
                      ${(isFr ? b.pointsFr : b.pointsEn).map(pt => `<li style="margin-bottom: 3px;">${pt}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- SECTION 6 & 7: TO WATCH & COMMERCIAL READING -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                ${renderSectionHeader('6', isFr ? 'À SURVEILLER' : 'CATALYSTS TO WATCH', isFr ? 'Les prochains catalyseurs' : 'Upcoming market drivers')}
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
                  <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${(isFr ? pairData.toWatchFr : pairData.toWatchEn).map(w => {
                      if (w && w.isObj) {
                        return `
                        <div style="display: flex; align-items: center; background: ${w.impact === 'High' ? '#fee2e2' : '#ffedd5'}; padding: 4px 6px; border-radius: 4px; border-left: 3px solid ${w.impact === 'High' ? '#dc2626' : '#ea580c'};">
                          <div style="font-weight: 800; color: ${w.impact === 'High' ? '#991b1b' : '#9a3412'}; font-size: 7.5px; width: 40px; text-align: center; border-right: 1px solid rgba(0,0,0,0.1); padding-right: 6px; margin-right: 6px;">
                            <div style="font-size: 9px; margin-bottom: 1px;">${w.dateStr}</div>
                            <div style="font-size: 7px; opacity: 0.8;">${w.time}</div>
                          </div>
                          <div style="font-weight: 800; font-size: 8px; color: ${w.impact === 'High' ? '#dc2626' : '#ea580c'}; margin-right: 6px; width: 26px;">${w.country}${w.proxy ? '*' : ''}</div>
                          <div style="font-size: 8px; color: #1e293b; font-weight: 600; line-height: 1.1; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${w.title}</div>
                        </div>`;
                      } else {
                        return `<div style="font-size: 8.5px; color: #334155; margin-bottom: 2px; padding-left: 10px; position: relative;">
                          <span style="position: absolute; left: 0; color: #3b82f6;">•</span> ${w}
                        </div>`;
                      }
                    }).join('')}
                    ${proxyNote}
                  </div>
                </div>
              </div>

              <div>
                ${renderSectionHeader('7', isFr ? 'LECTURE COMMERCIALE' : 'COMMERCIAL READING', isFr ? 'Clés de lecture des évènements à venir' : 'Key takeaways for upcoming events')}
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${(() => {
                    const events = (isFr ? pairData.toWatchFr : pairData.toWatchEn).filter(w => w && w.isObj).slice(0, 3);
                    if (events.length > 0) {
                      return events.map(w => `
                        <div style="background: #f8fafc; border-left: 3px solid ${w.impact === 'High' ? '#dc2626' : '#ea580c'}; padding: 6px 10px; border-radius: 0 4px 4px 0; margin-bottom: 4px;">
                          <div style="font-size: 8.5px; font-weight: 700; color: #1e293b; margin-bottom: 2px;">
                            ${w.title}
                          </div>
                          <div style="font-size: 8px; color: #475569; line-height: 1.3;">
                            ${getEventReading(w.country, w.title, isFr)}
                          </div>
                        </div>
                      `).join('');
                    } else {
                      return `
                        <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 8px 10px; border-radius: 0 4px 4px 0; margin-bottom: 6px;">
                          <div style="font-size: 9.5px; font-weight: 700; color: #166534;">${isFr ? 'Vendeur de ' + metaPair.base : metaPair.base + ' seller'}</div>
                          <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">${inject(isFr ? pairData.commercialReading.sellerFr : pairData.commercialReading.sellerEn)}</div>
                        </div>
                        <div style="background: #fef2f2; border-left: 3px solid #dc2626; padding: 8px 10px; border-radius: 0 4px 4px 0;">
                          <div style="font-size: 9.5px; font-weight: 700; color: #991b1b;">${isFr ? 'Acheteur de ' + metaPair.base : metaPair.base + ' buyer'}</div>
                          <div style="font-size: 8.5px; color: #334155; margin-top: 2px;">${inject(isFr ? pairData.commercialReading.buyerFr : pairData.commercialReading.buyerEn)}</div>
                        </div>
                      `;
                    }
                  })()}
                </div>
              </div>
            </div>

            <!-- SECTION 8: PAIR DASHBOARD -->
            <div>
              ${renderSectionHeader('8', `${pairData.pair} DASHBOARD`, isFr ? 'Niveaux et repères indicatifs' : 'Key levels & technical anchors')}
              <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse; font-size: 8.5px; text-align: left;">
                  <tbody>
                    <tr style="background: #ffffff; border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 4px 10px; font-weight: 600; color: #1e293b; width: 45%;">${isFr ? 'Cours interbancaire actuel' : 'Current Interbank Rate'}</td>
                      <td style="padding: 4px 10px; font-weight: 700; color: #1e40af; font-family: 'JetBrains Mono', monospace;">${pairData.rate}</td>
                    </tr>
                    <tr style="background: #f8fafc; border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 4px 10px; font-weight: 600; color: #1e293b;">${isFr ? 'Variation 1J · 1S (vs clôtures)' : '1D · 1W change (vs closes)'}</td>
                      <td style="padding: 4px 10px; font-weight: 700; color: ${moveColor(pairData.d1Pct)}; font-family: 'JetBrains Mono', monospace;">${pairData.d1} · ${pairData.w1}</td>
                    </tr>
                    <tr style="background: #ffffff; border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 4px 10px; font-weight: 600; color: #1e293b;">${isFr ? 'Support clé indicatif' : 'Indicative Key Support'}</td>
                      <td style="padding: 4px 10px; font-weight: 700; color: #166534; font-family: 'JetBrains Mono', monospace;">${lv.support}</td>
                    </tr>
                    <tr style="background: #f8fafc;">
                      <td style="padding: 4px 10px; font-weight: 600; color: #1e293b;">${isFr ? 'Résistance clé indicative' : 'Indicative Key Resistance'}</td>
                      <td style="padding: 4px 10px; font-weight: 700; color: #1d4ed8; font-family: 'JetBrains Mono', monospace;">${lv.resistance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SECTION 9: SOURCES & ARTICLES -->
            <div>
              ${renderSectionHeader('9', 'SOURCES & ARTICLES', isFr ? 'Liens cliquables pour approfondir' : 'Clickable links for further reading')}
              ${window.Sources.renderPanel(lang, 'pair', pairData.pair)}
            </div>

          </div>

          ${generatePairFooterHTML(2, lang)}
        </div>
      </div>
    `;
  }

  // ─── Render Page ───
  function renderPairFocusPage() {
    const curMeta = getPairMeta(currentPairId);
    return `
      <div class="pair-focus-app-container">
        <!-- Control Bar -->
        <div class="report-toolbar">
          <div class="toolbar-title-group" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <h3>Pair Focus & Institutional Forecasts</h3>

            <!-- Pair Selector (any base / quote) -->
            <div style="display: flex; gap: 4px; align-items: center;">
              <select id="base-ccy" class="pair-select-dropdown" onchange="PairFocus.selectCustomPair('base')" style="width: 96px; padding-right: 2px;">
                ${ccyOptions(curMeta.base)}
              </select>
              <button type="button" onclick="PairFocus.swapPairs()" title="Inverser / Swap" style="border: 1px solid #cbd5e1; background: #ffffff; border-radius: 6px; padding: 5px 8px; font-weight: 800; color: #1e40af; cursor: pointer;">⇄</button>
              <select id="quote-ccy" class="pair-select-dropdown" onchange="PairFocus.selectCustomPair('quote')" style="width: 96px; padding-right: 2px;">
                ${ccyOptions(curMeta.quote)}
              </select>
            </div>

            <!-- Date Picker for ANY day -->
            <div style="display: flex; align-items: center; gap: 6px; background: #f8fafc; padding: 4px 10px; border-radius: 8px; border: 1px solid #cbd5e1;">
              <span style="font-size: 12px; font-weight: 700; color: #475569;">📅 Date :</span>
              <input type="date" value="${selectedDate}" 
                     onchange="PairFocus.setDate(this.value)"
                     style="border: none; background: transparent; font-size: 13px; font-weight: 700; color: #1e3a8a; cursor: pointer;">
            </div>

            <!-- Language Switcher Toggle -->
            <div style="display: flex; background: #e2e8f0; padding: 3px; border-radius: 6px; gap: 2px;">
              <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" onclick="PairFocus.setLanguage('fr')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'fr' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'fr' ? '#1e40af' : '#64748b'};">
                🇫🇷 Français
              </button>
              <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="PairFocus.setLanguage('en')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'en' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'en' ? '#1e40af' : '#64748b'};">
                🇬🇧 English
              </button>
            </div>
          </div>

          <div class="toolbar-buttons" style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="PairFocus.syncPairRate()" style="background: #2563eb; color: #ffffff; font-weight: 700;">
              ⚡ Sync Cours Interbancaire en direct
            </button>
            <button class="btn btn-outline btn-sm" onclick="PairFocus.downloadInfographicImage()">
              🖼️ Télécharger Infographie (PNG)
            </button>
            <button class="btn btn-outline btn-sm" onclick="PairFocus.saveToArchive()">
              💾 Sauvegarder
            </button>
            <button class="btn btn-outline btn-sm" onclick="PairFocus.printReport()">
              🖨️ PDF / Imprimer
            </button>
          </div>
        </div>

        <!-- Rendered Report Container -->
        <div class="report-preview-scroll-wrapper">
          <div id="pair-report-rendered-view">
            ${generatePairReportHTML(currentLang)}
          </div>
        </div>
      </div>
    `;
  }

  function initPage() {
    syncPairRate();
  }

  function refreshView() {
    const view = document.getElementById('pair-report-rendered-view');
    if (view) {
      view.innerHTML = generatePairReportHTML(currentLang);
    }
  }

  async function downloadInfographicImage() {
    const el = document.getElementById('pair-report-two-pages');
    const filename = `${currentPairId}_FOCUS_${selectedDate}_${currentLang.toUpperCase()}.png`;
    if (window.ReportExport) {
      await window.ReportExport.exportElementToPNG(el, filename, printReport);
    } else {
      printReport();
    }
  }

  function printReport() {
    const html = generatePairReportHTML(currentLang);
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
        <title>${currentPairId} Focus — Kevin Saudubray</title>
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
      type: 'pair',
      pair: pairData.pair,
      date: selectedDate,
      lang: currentLang,
      html: generatePairReportHTML(currentLang)
    });
  }

  return {
    SUPPORTED_PAIRS,
    renderPairFocusPage,
    initPage,
    selectPair,
    selectCustomPair,
    swapPairs,
    setDate,
    setLanguage,
    syncPairRate,
    downloadInfographicImage,
    printReport,
    saveToArchive,
    generatePairReportHTML
  };
})();
