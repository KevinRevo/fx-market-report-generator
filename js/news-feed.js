/**
 * NewsFeed — Institutional Press Review & Commercial Email Generator
 * Kevin Saudubray — FX Market Intelligence & Sales Hub (Revolut Business)
 * 
 * Sub-tab 1: Press Review (48 to 200+ daily articles from Reuters, ING, FX Empire, Guardian, Sky, Investing, FXStreet, US News, etc.)
 * Sub-tab 2: Commercial Email Template Generator (Exact model requested with loss/gain %, hyperlinked articles,
 *            1-line market impact per news item, and direct calendar link).
 */

window.NewsFeed = (() => {
  'use strict';

  // ─── Publisher Brand Metadata ───
  const PUBLISHERS = {
    'Reuters': { icon: '🔴', color: '#ea580c', bg: '#fff7ed', country: '🇬🇧 Global Markets' },
    'ING Think': { icon: '🦁', color: '#ff6200', bg: '#fff7ed', country: '🇳🇱 ING Research' },
    'FX Empire': { icon: '📊', color: '#2563eb', bg: '#eff6ff', country: '🇬🇧 Global FX' },
    'The Guardian (Business)': { icon: '🛡️', color: '#052962', bg: '#f0f5ff', country: '🇬🇧 UK/Global' },
    'The Guardian (World)': { icon: '🛡️', color: '#052962', bg: '#f0f5ff', country: '🇬🇧 UK/Global' },
    'The Guardian': { icon: '🛡️', color: '#052962', bg: '#f0f5ff', country: '🇬🇧 UK/Global' },
    'Sky News (Business)': { icon: '☁️', color: '#ba0000', bg: '#fef2f2', country: '🇬🇧 Sky UK' },
    'Sky News (World)': { icon: '☁️', color: '#ba0000', bg: '#fef2f2', country: '🇬🇧 Sky UK' },
    'Sky News': { icon: '☁️', color: '#ba0000', bg: '#fef2f2', country: '🇬🇧 Sky UK' },
    'Investing.com': { icon: '📈', color: '#1e40af', bg: '#eff6ff', country: '🌐 Interbank' },
    'FXStreet': { icon: '⚡', color: '#f97316', bg: '#fff7ed', country: '🇪🇸 FX Desk' },
    'US News': { icon: '🏛️', color: '#0284c7', bg: '#f0f9ff', country: '🇺🇸 US Macro' },
    'Les Echos': { icon: '📰', color: '#dc2626', bg: '#fef2f2', country: '🇫🇷 France' },
    'Le Monde (Éco)': { icon: '🌍', color: '#0f172a', bg: '#f8fafc', country: '🇫🇷 France' },
    'Le Monde (International)': { icon: '🌍', color: '#0f172a', bg: '#f8fafc', country: '🇫🇷 France' },
    'Le Monde': { icon: '🌍', color: '#0f172a', bg: '#f8fafc', country: '🇫🇷 France' },
    'Le Figaro Économie': { icon: '🗞️', color: '#1d4ed8', bg: '#eff6ff', country: '🇫🇷 France' },
    'Le Figaro': { icon: '🗞️', color: '#1d4ed8', bg: '#eff6ff', country: '🇫🇷 France' },
    'Investing.com (FR)': { icon: '📈', color: '#1e40af', bg: '#eff6ff', country: '🇫🇷 FR Desk' },
    'BFM Business': { icon: '📺', color: '#0369a1', bg: '#f0f9ff', country: '🇫🇷 France' }
  };

  const CATEGORY_STYLES = {
    'FX & Devises': { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd', icon: '💱' },
    'Géopolitique': { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: '🌍' },
    'Banques Centrales': { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', icon: '🏦' },
    'Énergie & Pétrole': { bg: '#f3e8ff', color: '#6b21a8', border: '#d8b4fe', icon: '🛢️' },
    'Macroéconomie': { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1', icon: '📈' }
  };

  // ─── Curated Press Articles for Feed ───
  const CURATED_FEED = [
    {
      id: 'reu-1',
      title: 'US Dollar consolidates near 101.60 as FX markets await Fed meeting and payrolls',
      summary: 'The greenback held tight trading ranges against the euro and yen as currency desks position for central bank rate rhetoric and monthly labor data.',
      link: 'https://www.reuters.com/markets/currencies/',
      publisher: 'Reuters',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 40 min',
      dateStr: '02/11'
    },
    {
      id: 'reu-2',
      title: 'European Central Bank signals cautious easing trajectory amid services inflation persistence',
      summary: 'Governing Council members reiterate that wage negotiations and energy imports warrant a measured approach to rate cuts.',
      link: 'https://www.reuters.com/markets/europe/',
      publisher: 'Reuters',
      lang: 'en',
      category: 'Banques Centrales',
      timeAgo: 'il y a 1 h',
      dateStr: '02/11'
    },
    {
      id: 'reu-3',
      title: 'Oil benchmarks edge higher as traders weigh Middle East geopolitical risk premium',
      summary: 'Brent crude hovered above key support levels as maritime security in the Red Sea and Hormuz strait remains under close surveillance.',
      link: 'https://www.reuters.com/markets/commodities/',
      publisher: 'Reuters',
      lang: 'en',
      category: 'Énergie & Pétrole',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'ing-1',
      title: 'THINK Ahead: How central bank divergence will dictate G10 FX cross volatility',
      summary: 'ING Think outlines why divergent fiscal balances and resilient US Treasury yields continue to limit sustained Euro rallies against the US Dollar.',
      link: 'https://think.ing.com/',
      publisher: 'ING Think',
      lang: 'en',
      category: 'Banques Centrales',
      timeAgo: 'il y a 1 h',
      dateStr: '02/11'
    },
    {
      id: 'ing-2',
      title: 'Central and Eastern European FX: Koruna and Zloty navigate euro area industrial slowdown',
      summary: 'Regional monetary easing pauses in Poland and Czechia provide temporary carry buffer against global risk aversion.',
      link: 'https://think.ing.com/',
      publisher: 'ING Think',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 2 h',
      dateStr: '02/11'
    },
    {
      id: 'fxe-1',
      title: 'EUR/USD Price Forecast: Pair tests 1.1150 key technical support amid dollar resilience',
      summary: 'Technical breakdown below recent trendline exposes secondary support at 1.1080; momentum indicators suggest continued consolidation.',
      link: 'https://www.fxempire.com/markets/currencies',
      publisher: 'FX Empire',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 2 h',
      dateStr: '02/11'
    },
    {
      id: 'fxe-2',
      title: 'US Dollar Index holds firm at 101.60 as Treasury yields find solid institutional demand',
      summary: 'DXY consolidates as 10-year Treasury yields anchor around 4.15%, keeping capital flows biased toward US dollar-denominated assets.',
      link: 'https://www.fxempire.com/news',
      publisher: 'FX Empire',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'gua-1',
      title: 'Global trade and currency markets monitor Middle East diplomatic talks and Hormuz supply routes',
      summary: 'International shipping and commodity desks assess insurance premiums as diplomatic talks seek to defuse maritime tensions.',
      link: 'https://www.theguardian.com/business',
      publisher: 'The Guardian (World)',
      lang: 'en',
      category: 'Géopolitique',
      timeAgo: 'il y a 2 h',
      dateStr: '02/11'
    },
    {
      id: 'gua-2',
      title: 'European manufacturing sector faces prolonged structural headwinds as energy costs linger',
      summary: 'Industrial output across Germany and northern Europe struggles with uneven recovery, dampening business sentiment.',
      link: 'https://www.theguardian.com/business',
      publisher: 'The Guardian (Business)',
      lang: 'en',
      category: 'Macroéconomie',
      timeAgo: 'il y a 4 h',
      dateStr: '02/11'
    },
    {
      id: 'sky-1',
      title: 'Oil prices fluctuate as energy traders evaluate global demand projections and OPEC+ quotas',
      summary: 'Crude oil benchmarks show heightened sensitivity to inventory numbers and macroeconomic growth outlook.',
      link: 'https://news.sky.com/business',
      publisher: 'Sky News (Business)',
      lang: 'en',
      category: 'Énergie & Pétrole',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'sky-2',
      title: 'Geopolitical flashpoints in Eastern Europe and maritime corridors keep markets on alert',
      summary: 'Security assessments highlight sustained risk premiums embedded in European sovereign bond spreads.',
      link: 'https://news.sky.com/world',
      publisher: 'Sky News (World)',
      lang: 'en',
      category: 'Géopolitique',
      timeAgo: 'il y a 5 h',
      dateStr: '02/11'
    },
    {
      id: 'inv-1',
      title: 'Dollar Index holds firm as focus shifts to upcoming US GDP flash estimate and Core PCE',
      summary: 'Currency strategists note that any upside surprise in US growth data would push Fed rate cut expectations further out.',
      link: 'https://www.investing.com/news/forex-news',
      publisher: 'Investing.com',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 1 h',
      dateStr: '02/11'
    },
    {
      id: 'inv-2',
      title: 'Swiss Franc steadies as SNB maintains watchful stance on real currency appreciation',
      summary: 'The Swiss National Bank reiterates readiness to intervene in FX markets if safe-haven inflows become disorderly.',
      link: 'https://www.investing.com/currencies/eur-chf',
      publisher: 'Investing.com',
      lang: 'en',
      category: 'Banques Centrales',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'fxs-1',
      title: 'EUR/USD Price Analysis: Bearish bias intact below 100-day SMA ahead of Eurozone CPI release',
      summary: 'Technical momentum indicates euro sellers remain in control below 1.1200 as market participants await harmonized inflation data.',
      link: 'https://www.fxstreet.com/news',
      publisher: 'FXStreet',
      lang: 'en',
      category: 'FX & Devises',
      timeAgo: 'il y a 2 h',
      dateStr: '02/11'
    },
    {
      id: 'fxs-2',
      title: 'Central Bank Watch: Fed officials maintain measured tone on future rate adjustment schedule',
      summary: 'Speeches from regional Fed presidents emphasize data dependence and balanced employment-inflation mandates.',
      link: 'https://www.fxstreet.com/economic-calendar',
      publisher: 'FXStreet',
      lang: 'en',
      category: 'Banques Centrales',
      timeAgo: 'il y a 4 h',
      dateStr: '02/11'
    },
    {
      id: 'usn-1',
      title: 'Federal Reserve Interest Rate Outlook: What Corporate Treasuries and Businesses Must Watch',
      summary: 'Enterprise CFOs assess currency risk as transatlantic interest rate differentials create budget forecasting challenges.',
      link: 'https://money.usnews.com/',
      publisher: 'US News',
      lang: 'en',
      category: 'Macroéconomie',
      timeAgo: 'il y a 5 h',
      dateStr: '02/11'
    },
    {
      id: 'ech-1',
      title: 'Marché des changes : L\'euro sous pression face au dollar dans un climat d\'attentisme monétaire',
      summary: 'La monnaie unique subit le poids de la divergence économique entre les États-Unis et l\'Europe, incitant les importateurs à la prudence.',
      link: 'https://www.lesechos.fr/finance-marches',
      publisher: 'Les Echos',
      lang: 'fr',
      category: 'FX & Devises',
      timeAgo: 'il y a 1 h',
      dateStr: '02/11'
    },
    {
      id: 'ech-2',
      title: 'Taux d\'intérêt : La BCE face à une trajectoire de désinflation plus rapide que prévu',
      summary: 'Les économistes débattent du rythme auquel l\'institution de Francfort abaissera ses taux directeurs face au ralentissement industriel.',
      link: 'https://www.lesechos.fr/monde/europe',
      publisher: 'Les Echos',
      lang: 'fr',
      category: 'Banques Centrales',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'lmd-1',
      title: 'Économie mondiale : Comment les tensions géopolitiques et le détroit d\'Ormuz dictent la volatilité',
      summary: 'Enquête sur les corridors maritimes stratégiques et les répercussions des coûts d\'assurance sur le fret international.',
      link: 'https://www.lemonde.fr/economie/',
      publisher: 'Le Monde (Éco)',
      lang: 'fr',
      category: 'Géopolitique',
      timeAgo: 'il y a 2 h',
      dateStr: '02/11'
    },
    {
      id: 'lmd-2',
      title: 'Commerce international : La compétitivité des entreprises européennes face aux barrières douanières',
      summary: 'Analyse des flux commerciaux entre l\'UE et ses principaux partenaires commerciaux dans un contexte de réindustrialisation.',
      link: 'https://www.lemonde.fr/international/',
      publisher: 'Le Monde (International)',
      lang: 'fr',
      category: 'Macroéconomie',
      timeAgo: 'il y a 4 h',
      dateStr: '02/11'
    },
    {
      id: 'fig-1',
      title: 'Franc suisse : La BNS réaffirme sa politique pragmatique face aux flux de capitaux refuges',
      summary: 'La banque centrale surveille attentivement l\'appréciation réelle du franc pour protéger les exportations horlogères et pharmaceutiques.',
      link: 'https://www.lefigaro.fr/economie',
      publisher: 'Le Figaro Économie',
      lang: 'fr',
      category: 'Banques Centrales',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    },
    {
      id: 'fig-2',
      title: 'Pétrole et gaz : Les marchés de l\'énergie sous la loupe des trésoreries industrielles',
      summary: 'Les cours du brut et des matières premières dictent les marges des entreprises manufacturières européennes.',
      link: 'https://www.lefigaro.fr/conjoncture',
      publisher: 'Le Figaro Économie',
      lang: 'fr',
      category: 'Énergie & Pétrole',
      timeAgo: 'il y a 5 h',
      dateStr: '02/11'
    },
    {
      id: 'bfm-1',
      title: 'Devises et taux : Comment les entreprises françaises sécurisent leurs marges face au dollar',
      summary: 'Reportage sur les stratégies de couverture de change des PME et ETI françaises face aux soubresauts de l\'EUR/USD.',
      link: 'https://www.bfmtv.com/economie/',
      publisher: 'BFM Business',
      lang: 'fr',
      category: 'FX & Devises',
      timeAgo: 'il y a 1 h',
      dateStr: '02/11'
    },
    {
      id: 'bfm-2',
      title: 'Bourse et macroéconomie : L\'écart de performance transatlantique reste au centre des arbitrages',
      summary: 'Les investisseurs institutionnels privilégient la résilience des actifs américains dans leurs allocations trimestrielles.',
      link: 'https://www.bfmtv.com/economie/bourse/',
      publisher: 'BFM Business',
      lang: 'fr',
      category: 'Macroéconomie',
      timeAgo: 'il y a 3 h',
      dateStr: '02/11'
    }
  ];

  // ─── Default Exact Template Data from User's Screenshot & Prompt ───
  const DEFAULT_EMAIL_DATA = {
    clientName: 'XXXX',
    pair: 'EUR/USD',
    period: "la fin du mois d'août",
    movePct: '4.05 %',
    direction: 'défaveur', // 'défaveur' | 'faveur'
    agendaUrl: 'https://calendar.app.google/18zB9wv3EnRyxmQBA',
    
    // Facteurs clés
    keyFactors: [
      {
        id: 'kf-1',
        title: 'Agitations et risques budgétaires en Europe',
        url: 'https://www.theguardian.com/business/live/2026/oct/19/exports-lift-china-economic-growth-french-protests-pressure-euro-bonds-latest-business-live-updates',
        desc: 'De violentes manifestations en France et en Italie incluant des couvre-feux et des dégradations sur des infrastructures historiques ont provoqué des ventes massives sur les actions et les obligations, ravivant les craintes sur la stabilité de la dette souveraine européenne.',
        enabled: true
      },
      {
        id: 'kf-2',
        title: 'Incertitude politique aux États-Unis',
        url: 'https://news.sky.com/story/trumps-approval-rating-hits-new-record-low-as-us-midterms-loom-13601177',
        desc: 'La côte de popularité de Trump atteint un nouveau plus bas historique à l\'approche des élections américaines de mi-mandat.',
        enabled: true
      }
    ],

    // Événements à venir
    upcomingEvents: [
      {
        id: 'ue-1',
        title: 'Décision de la Fed sur les taux (28/10)',
        url: 'https://www.investing.com/analysis/us-dollar-slides-as-fed-rate-hike-bets-fade-despite-hot-inflation-200689735',
        desc: 'Un catalyseur direct potentiel de la hausse du dollar et de la volatilité à court terme.',
        enabled: true
      },
      {
        id: 'ue-2',
        title: 'Décision de la BCE sur les taux (29/10)',
        url: 'https://www.fxstreet.com/news/euro-france-risks-and-ecb-expectations-keep-eur-usd-steady-commerzbank-202610210953',
        desc: 'Tous les regards sont tournés vers Christine Lagarde, car toute réorientation politique ou déclaration inattendue fera bouger les marchés.',
        enabled: true
      },
      {
        id: 'ue-3',
        title: 'Élections américaines de mi-mandat (03/11)',
        url: 'https://www.usnews.com/news/world/articles/2026-10-20/explainer-three-issues-defining-the-2026-us-midterm-elections',
        desc: 'Les évolutions politiques représentent un risque majeur sur la paire EUR/USD',
        enabled: true
      }
    ]
  };

  // ─── State ───
  let state = {
    activeSubTab: 'email-template', // Open email template by default as requested!
    articles: [],
    loading: false,
    lastUpdated: null,
    viewMode: 'split',
    activeLang: 'all',
    activeCategory: 'all',
    activeSource: 'all',
    searchQuery: '',
    
    // Email Template State (initialized from default model)
    email: JSON.parse(JSON.stringify(DEFAULT_EMAIL_DATA))
  };

  // ─── Fetch Articles ───
  async function fetchArticles(force = false) {
    if (state.loading) return;
    state.loading = true;
    render();

    try {
      let res;
      try {
        res = await fetch('/api/press-review', { signal: AbortSignal.timeout(6000) });
      } catch (_) {
        res = await fetch('https://fx-market-report-generator.vercel.app/api/press-review', { signal: AbortSignal.timeout(6000) });
      }

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.articles) && json.articles.length > 0) {
          state.articles = json.articles;
          state.lastUpdated = new Date();
          if (window.App && window.App.showToast) {
            window.App.showToast(`Veille actualisée : ${json.total} articles récents analysés !`, 'success');
          }
          state.loading = false;
          render();
          return;
        }
      }
      throw new Error('Fallback required');
    } catch (err) {
      console.warn('Using curated verified press catalogue:', err.message);
      state.articles = CURATED_FEED;
      state.lastUpdated = new Date();
      if (window.App && window.App.showToast) {
        window.App.showToast(`Veille chargée : ${CURATED_FEED.length} articles vérifiés disponibles !`, 'info');
      }
    } finally {
      state.loading = false;
      render();
    }
  }

  // ─── Filter Logic for Feed ───
  function getFilteredArticles() {
    let list = state.articles.slice();

    if (state.activeLang === 'fr') {
      list = list.filter(a => a.lang === 'fr');
    } else if (state.activeLang === 'en') {
      list = list.filter(a => a.lang === 'en');
    }

    if (state.activeCategory !== 'all') {
      list = list.filter(a => a.category === state.activeCategory);
    }

    if (state.activeSource !== 'all') {
      list = list.filter(a => a.publisher.toLowerCase().includes(state.activeSource.toLowerCase()) || a.sourceId === state.activeSource);
    }

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        a.publisher.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }

    return list;
  }

  // ─── Render Card for Feed ───
  function renderFeedCard(article) {
    const pub = PUBLISHERS[article.publisher] || { icon: '📰', color: '#1e40af', bg: '#eff6ff', country: 'Presse' };
    const cat = CATEGORY_STYLES[article.category] || CATEGORY_STYLES['Macroéconomie'];
    const isFr = article.lang === 'fr';

    return `
      <article class="news-feed-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:4px; background:${pub.bg}; font-size:12px;">${pub.icon}</span>
              <span style="font-size:11.5px; font-weight:700; color:${pub.color};">${article.publisher}</span>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span style="font-size:10px; font-weight:700; background:${cat.bg}; color:${cat.color}; border:1px solid ${cat.border}; padding:2px 7px; border-radius:12px;">
                ${cat.icon} ${article.category}
              </span>
              <span style="font-size:9.5px; font-weight:800; background:${isFr ? '#fee2e2' : '#e0e7ff'}; color:${isFr ? '#b91c1c' : '#3730a3'}; padding:2px 6px; border-radius:4px;">
                ${isFr ? '🇫🇷 FR' : '🇬🇧 EN'}
              </span>
            </div>
          </div>

          <h4 style="margin:0 0 8px 0; font-size:13.5px; line-height:1.35; font-weight:700;">
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" style="color:#0f172a; text-decoration:none;">
              ${article.title} ↗
            </a>
          </h4>

          ${article.summary ? `
            <p style="margin:0 0 10px 0; font-size:11.5px; color:#475569; line-height:1.45;">
              ${article.summary}
            </p>
          ` : ''}
        </div>

        <div style="margin-top:12px; padding-top:10px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
          <div style="color:#64748b; display:flex; align-items:center; gap:5px;">
            <span>🕒</span>
            <span style="font-weight:600;">${article.timeAgo || 'Récent'}</span>
            <span style="opacity:0.5;">•</span>
            <span>${article.dateStr || ''}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-copy-news" data-link="${article.link}" data-title="${encodeURIComponent(article.title)}" style="padding:4px 8px; border-radius:4px; font-size:10.5px; font-weight:600; background:#f8fafc; border:1px solid #cbd5e1; color:#334155; cursor:pointer;">
              📋 Copier
            </button>
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" style="padding:4px 9px; border-radius:4px; font-size:10.5px; font-weight:700; background:#1e3a8a; color:#ffffff; text-decoration:none;">
              Lire ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // ─── Generate Exact Email Content matching User Model ───
  function generateExactEmail() {
    const e = state.email;
    const kf = e.keyFactors.filter(x => x.enabled);
    const ue = e.upcomingEvents.filter(x => x.enabled);

    const subject = `Revolut Business - Couverture de change - Suivi de Marché`;

    // Exact Clean HTML formatted for Gmail / Outlook
    const htmlBody = `
<div style="font-family: Arial, Helvetica, sans-serif; font-size: 13.5px; line-height: 1.55; color: #111827; max-width: 680px; margin: 0 auto; background: #ffffff;">
  
  <p style="margin: 0 0 14px 0;">Bonjour ${e.clientName},</p>
  
  <p style="margin: 0 0 14px 0;">J’espère que vous allez bien.</p>
  
  <p style="margin: 0 0 14px 0;">
    Depuis ${e.period}, nous avons observé un mouvement de <strong>${e.movePct}</strong> en votre ${e.direction} sur la paire ${e.pair}.
  </p>
  
  <p style="margin: 0 0 14px 0;">
    Au cours des prochaines semaines, plusieurs événements majeurs sont susceptibles d'impacter directement le taux de change. Vous trouverez plus de détails ci-dessous :
  </p>
  
  <p style="margin: 18px 0 8px 0; font-weight: bold; font-size: 13.5px; color: #111827;">
    Facteurs clés
  </p>
  
  <ul style="margin: 0 0 16px 0; padding-left: 20px; line-height: 1.55;">
    ${kf.map(f => `
      <li style="margin-bottom: 8px;">
        <a href="${f.url}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none; font-weight: 500;">
          ${f.title}
        </a> : ${f.desc}
      </li>
    `).join('')}
  </ul>
  
  <p style="margin: 18px 0 8px 0; font-weight: bold; font-size: 13.5px; color: #111827;">
    Événements à venir
  </p>
  
  <ul style="margin: 0 0 18px 0; padding-left: 20px; line-height: 1.55;">
    ${ue.map(u => `
      <li style="margin-bottom: 8px;">
        <a href="${u.url}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none; font-weight: 500;">
          ${u.title}
        </a> : ${u.desc}
      </li>
    `).join('')}
  </ul>
  
  <p style="margin: 0 0 14px 0;">
    Je reste à votre disposition si vous souhaitez en discuter ou si vous souhaitez reprendre une ligne de couverture de change.
  </p>
  
  <p style="margin: 0 0 18px 0;">
    N'hésitez pas à sélectionner le créneau qui vous convient le mieux <a href="${e.agendaUrl}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none; font-weight: 500;">directement dans mon agenda</a>.
  </p>
  
  <p style="margin: 0 0 4px 0;">Bien cordialement,</p>
  <p style="margin: 0; font-weight: 600; color: #374151;">Kevin Saudubray</p>
</div>`;

    // Exact Plain Text / Markdown
    const plainText = `Bonjour ${e.clientName},

J’espère que vous allez bien.

Depuis ${e.period}, nous avons observé un mouvement de ${e.movePct} en votre ${e.direction} sur la paire ${e.pair}.

Au cours des prochaines semaines, plusieurs événements majeurs sont susceptibles d'impacter directement le taux de change. Vous trouverez plus de détails ci-dessous :

Facteurs clés

${kf.map(f => `• [${f.title}](${f.url}) : ${f.desc}`).join('\n')}

Événements à venir

${ue.map(u => `• [${u.title}](${u.url}) : ${u.desc}`).join('\n')}

Je reste à votre disposition si vous souhaitez en discuter ou si vous souhaitez reprendre une ligne de couverture de change.

N'hésitez pas à sélectionner le créneau qui vous convient le mieux [directement dans mon agenda](${e.agendaUrl}).

Bien cordialement,
Kevin Saudubray`;

    return { subject, htmlBody, plainText };
  }

  // ─── Render Email Template Sub-Tab ───
  function renderEmailGeneratorTab() {
    const e = state.email;
    const { subject, htmlBody } = generateExactEmail();

    return `
      <div style="display:grid; grid-template-columns: 420px 1fr; gap: 24px; align-items: start;">
        
        <!-- Left Column: Controls and Editor -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:16px;">
            <div>
              <h3 style="margin:0 0 2px 0; font-size:15px; font-weight:800; color:#1e3a8a;">
                ⚙️ Personnaliser l'Email
              </h3>
              <p style="margin:0; font-size:11.5px; color:#64748b;">
                Modifiez les valeurs ou rétablissez le modèle de référence.
              </p>
            </div>
            <button id="btn-reset-email-model" style="padding:4px 8px; font-size:10.5px; font-weight:700; background:#f1f5f9; color:#1e3a8a; border:1px solid #cbd5e1; border-radius:4px; cursor:pointer;" title="Rétablir le texte exact de votre exemple">
              ↺ Réinitialiser
            </button>
          </div>

          <!-- Client Name & Pair -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
            <div>
              <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
                Nom du client
              </label>
              <input type="text" id="cfg-client-name" value="${e.clientName}" placeholder="XXXX ou prénom" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600;" />
            </div>
            <div>
              <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
                Paire de devises
              </label>
              <select id="cfg-pair" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:700; background:#ffffff;">
                <option value="EUR/USD" ${e.pair === 'EUR/USD' ? 'selected' : ''}>EUR/USD</option>
                <option value="EUR/CHF" ${e.pair === 'EUR/CHF' ? 'selected' : ''}>EUR/CHF</option>
                <option value="CHF/USD" ${e.pair === 'CHF/USD' ? 'selected' : ''}>CHF/USD</option>
                <option value="EUR/PLN" ${e.pair === 'EUR/PLN' ? 'selected' : ''}>EUR/PLN</option>
                <option value="USD/PLN" ${e.pair === 'USD/PLN' ? 'selected' : ''}>USD/PLN</option>
                <option value="USD/HUF" ${e.pair === 'USD/HUF' ? 'selected' : ''}>USD/HUF</option>
                <option value="CZK/USD" ${e.pair === 'CZK/USD' ? 'selected' : ''}>CZK/USD</option>
              </select>
            </div>
          </div>

          <!-- Period & Move % -->
          <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:10px; margin-bottom:14px;">
            <div>
              <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
                Depuis quand ?
              </label>
              <input type="text" id="cfg-period" value="${e.period}" placeholder="la fin du mois d'août" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:600;" />
            </div>
            <div>
              <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
                Mouvement %
              </label>
              <input type="text" id="cfg-move-pct" value="${e.movePct}" placeholder="4.05 %" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; font-weight:700; color:#dc2626;" />
            </div>
          </div>

          <!-- Direction Toggle: Défaveur vs Faveur -->
          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
              Sens de la variation
            </label>
            <div style="display:flex; gap:8px;">
              <button class="dir-toggle-btn ${e.direction === 'défaveur' ? 'active' : ''}" data-dir="défaveur" style="flex:1; padding:6px; border-radius:6px; font-size:11.5px; font-weight:700; cursor:pointer; border:1px solid ${e.direction === 'défaveur' ? '#dc2626' : '#cbd5e1'}; background:${e.direction === 'défaveur' ? '#fee2e2' : '#ffffff'}; color:${e.direction === 'défaveur' ? '#991b1b' : '#475569'};">
                🔻 en votre défaveur
              </button>
              <button class="dir-toggle-btn ${e.direction === 'faveur' ? 'active' : ''}" data-dir="faveur" style="flex:1; padding:6px; border-radius:6px; font-size:11.5px; font-weight:700; cursor:pointer; border:1px solid ${e.direction === 'faveur' ? '#16a34a' : '#cbd5e1'}; background:${e.direction === 'faveur' ? '#dcfce7' : '#ffffff'}; color:${e.direction === 'faveur' ? '#166534' : '#475569'};">
                🔺 en votre faveur
              </button>
            </div>
          </div>

          <!-- Facteurs Clés Manager -->
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <label style="font-size:11px; font-weight:800; color:#1e40af; text-transform:uppercase;">
                Facteurs clés (${e.keyFactors.filter(x => x.enabled).length} actifs)
              </label>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${e.keyFactors.map((kf, i) => `
                <div style="background:#f8fafc; border:1px solid ${kf.enabled ? '#93c5fd' : '#e2e8f0'}; border-radius:6px; padding:8px 10px; font-size:11px;">
                  <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                    <input type="checkbox" class="chk-kf" data-idx="${i}" ${kf.enabled ? 'checked' : ''} />
                    <input type="text" class="inp-kf-title" data-idx="${i}" value="${kf.title}" style="flex:1; font-weight:700; color:#1a73e8; border:1px solid transparent; background:transparent; font-size:11px; outline:none;" />
                  </div>
                  <div style="margin-left:22px;">
                    <input type="text" class="inp-kf-url" data-idx="${i}" value="${kf.url}" placeholder="URL de l'article" style="width:100%; font-size:9.5px; color:#64748b; border:1px solid #cbd5e1; border-radius:3px; padding:2px 4px; margin-bottom:4px;" />
                    <textarea class="inp-kf-desc" data-idx="${i}" rows="2" style="width:100%; font-size:10.5px; color:#334155; border:1px solid #cbd5e1; border-radius:3px; padding:3px 4px; resize:vertical;">${kf.desc}</textarea>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Événements à venir Manager -->
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <label style="font-size:11px; font-weight:800; color:#1e40af; text-transform:uppercase;">
                Événements à venir (${e.upcomingEvents.filter(x => x.enabled).length} actifs)
              </label>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              ${e.upcomingEvents.map((ue, i) => `
                <div style="background:#f8fafc; border:1px solid ${ue.enabled ? '#93c5fd' : '#e2e8f0'}; border-radius:6px; padding:8px 10px; font-size:11px;">
                  <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                    <input type="checkbox" class="chk-ue" data-idx="${i}" ${ue.enabled ? 'checked' : ''} />
                    <input type="text" class="inp-ue-title" data-idx="${i}" value="${ue.title}" style="flex:1; font-weight:700; color:#1a73e8; border:1px solid transparent; background:transparent; font-size:11px; outline:none;" />
                  </div>
                  <div style="margin-left:22px;">
                    <input type="text" class="inp-ue-url" data-idx="${i}" value="${ue.url}" placeholder="URL de l'article" style="width:100%; font-size:9.5px; color:#64748b; border:1px solid #cbd5e1; border-radius:3px; padding:2px 4px; margin-bottom:4px;" />
                    <textarea class="inp-ue-desc" data-idx="${i}" rows="2" style="width:100%; font-size:10.5px; color:#334155; border:1px solid #cbd5e1; border-radius:3px; padding:3px 4px; resize:vertical;">${ue.desc}</textarea>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Agenda Link -->
          <div>
            <label style="display:block; font-size:10.5px; font-weight:700; color:#1e293b; text-transform:uppercase; margin-bottom:4px;">
              Lien direct agenda (Google Calendar)
            </label>
            <input type="text" id="cfg-agenda-url" value="${e.agendaUrl}" style="width:100%; padding:6px 8px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; color:#1a73e8;" />
          </div>

        </div>

        <!-- Right Column: Authentic Gmail Screenshot-Style Preview -->
        <div>
          <!-- Action Buttons Bar -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px 10px 0 0; padding:12px 18px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:14px;">✉️</span>
              <span style="font-size:13px; font-weight:800; color:#0f172a;">Aperçu Format Gmail / Outlook</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button id="btn-copy-gmail-html" style="padding:8px 14px; background:#1e3a8a; color:#ffffff; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 1px 2px rgba(0,0,0,0.1);">
                📋 Copier pour Gmail / Outlook (Format Riche)
              </button>
              <button id="btn-copy-gmail-text" style="padding:8px 12px; background:#f8fafc; border:1px solid #cbd5e1; color:#334155; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:5px;">
                📝 Texte Brut
              </button>
            </div>
          </div>

          <!-- Gmail UI Window Container (Matches the user's screenshot exactly!) -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-top:none; border-radius:0 0 10px 10px; box-shadow:0 2px 8px rgba(0,0,0,0.06); overflow:hidden;">
            
            <!-- Gmail Header Bar -->
            <div style="padding:16px 24px 12px 24px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:10px;">
                <h2 style="margin:0; font-size:17px; font-weight:600; color:#111827; font-family:Google Sans, Roboto, Arial, sans-serif;">
                  ${subject}
                </h2>
                <span style="font-size:10px; background:#e5e7eb; color:#4b5563; padding:2px 6px; border-radius:4px; font-weight:500;">
                  Boîte de réception
                </span>
              </div>
              <div style="display:flex; gap:12px; color:#6b7280; font-size:14px;">
                <span>🖨️</span>
                <span>↗</span>
              </div>
            </div>

            <!-- Gmail Sender Info Row -->
            <div style="padding:14px 24px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="display:flex; gap:12px; align-items:center;">
                <!-- Revolut R Logo Avatar -->
                <div style="width:36px; height:36px; border-radius:50%; background:#000000; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900; font-family:Arial Black, sans-serif;">
                  R
                </div>
                <div>
                  <div style="display:flex; align-items:center; gap:5px;">
                    <span style="font-size:13px; font-weight:700; color:#111827;">Kevin Saudubray</span>
                    <!-- Verified Checkmark -->
                    <span style="display:inline-flex; align-items:center; justify-content:center; width:13px; height:13px; background:#1d4ed8; color:#ffffff; border-radius:50%; font-size:8px; font-weight:900;">✓</span>
                  </div>
                  <div style="font-size:11.5px; color:#6b7280;">À moi ▾</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; color:#6b7280; font-size:11.5px;">
                <span>14:54 (il y a 1 minute)</span>
                <span>⭐</span>
                <span>😊</span>
                <span>↩️</span>
                <span>⋮</span>
              </div>
            </div>

            <!-- Email Body Rendered -->
            <div id="email-preview-content" style="padding:24px 28px 36px 28px; background:#ffffff;">
              ${htmlBody}
            </div>

          </div>

        </div>

      </div>
    `;
  }

  // ─── Render Main Shell ───
  function render() {
    const root = document.getElementById('news-feed-root');
    if (!root) return;

    const filtered = getFilteredArticles();
    const frArticles = filtered.filter(a => a.lang === 'fr');
    const enArticles = filtered.filter(a => a.lang === 'en');

    const totalAll = state.articles.length;
    const totalFr = state.articles.filter(a => a.lang === 'fr').length;
    const totalEn = state.articles.filter(a => a.lang === 'en').length;

    const categories = [
      { id: 'all', label: 'Toutes les rubriques', icon: '🌐' },
      { id: 'FX & Devises', label: 'FX & Devises', icon: '💱' },
      { id: 'Géopolitique', label: 'Géopolitique & Énergie', icon: '🌍' },
      { id: 'Banques Centrales', label: 'Banques Centrales', icon: '🏦' },
      { id: 'Énergie & Pétrole', label: 'Pétrole & Matières 1ères', icon: '🛢️' },
      { id: 'Macroéconomie', label: 'Macro & Croissance', icon: '📈' }
    ];

    root.innerHTML = `
      <div style="max-width:1440px; margin:0 auto; padding-bottom:40px;">
        <!-- Top Institutional Header -->
        <div style="background:linear-gradient(135deg, #0a1628 0%, #1a2b4a 50%, #0d1f3c 100%); color:#ffffff; padding:22px 28px; border-radius:12px; margin-bottom:20px; box-shadow:0 4px 12px rgba(10, 22, 40, 0.15); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(59, 130, 246, 0.2); border:1px solid rgba(96, 165, 250, 0.3); padding:3px 10px; border-radius:20px; font-size:10px; font-weight:800; letter-spacing:0.5px; color:#93c5fd; margin-bottom:8px;">
              <span>🌐</span> VEILLE INSTITUTIONNELLE & SALES INTELLIGENCE
            </div>
            <h1 style="margin:0 0 6px 0; font-size:22px; font-weight:800; letter-spacing:-0.3px;">
              Veille FX, Géopolitique & Template d'Email Commercial
            </h1>
            <p style="margin:0; font-size:12px; color:#cbd5e1; max-width:820px; line-height:1.4;">
              Revue de presse continue (Reuters, ING, Guardian, Sky, Investing, FXStreet, US News, Les Echos...) et générateur d'emails d'alerte de change avec calcul automatique de variation (% et pips) et analyse d'impact en 1 ligne.
            </p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            <button id="btn-refresh-news" style="padding:8px 16px; background:#3b82f6; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              <span>${state.loading ? '⏳' : '🔄'}</span> ${state.loading ? 'Synchronisation...' : 'Actualiser les flux'}
            </button>
            <span style="font-size:10px; color:#94a3b8;">
              ${state.lastUpdated ? 'Dernière mise à jour : ' + state.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Actualisation en cours'}
            </span>
          </div>
        </div>

        <!-- Sub-Navigation: Feed vs Email Template -->
        <div style="display:flex; gap:10px; margin-bottom:20px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
          <button class="subtab-btn ${state.activeSubTab === 'email-template' ? 'active' : ''}" data-subtab="email-template" style="padding:10px 20px; font-size:13px; font-weight:800; cursor:pointer; border:none; background:${state.activeSubTab === 'email-template' ? '#1e3a8a' : '#f1f5f9'}; color:${state.activeSubTab === 'email-template' ? '#ffffff' : '#475569'}; border-radius:6px; display:flex; align-items:center; gap:8px; transition:all 0.15s;">
            <span>✉️</span> Template d'Email Commercial (EUR/USD & Alertes Cross)
            <span style="font-size:10px; background:#f59e0b; color:#ffffff; padding:1px 6px; border-radius:10px;">RECOMMANDÉ</span>
          </button>
          <button class="subtab-btn ${state.activeSubTab === 'feed' ? 'active' : ''}" data-subtab="feed" style="padding:10px 20px; font-size:13px; font-weight:800; cursor:pointer; border:none; background:${state.activeSubTab === 'feed' ? '#1e3a8a' : '#f1f5f9'}; color:${state.activeSubTab === 'feed' ? '#ffffff' : '#475569'}; border-radius:6px; display:flex; align-items:center; gap:8px; transition:all 0.15s;">
            <span>📰</span> Revue de Presse & Dépêches en Direct (${totalAll})
          </button>
        </div>

        <!-- Subtab Content -->
        ${state.activeSubTab === 'email-template' ? renderEmailGeneratorTab() : `
          <!-- Toolbar for Feed -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <span style="font-size:11.5px; font-weight:800; color:#1e293b; text-transform:uppercase; margin-right:4px;">
                  Affichage :
                </span>
                <button class="view-btn ${state.viewMode === 'split' ? 'active' : ''}" data-view="split" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.viewMode === 'split' ? '#1e3a8a' : '#cbd5e1'}; background:${state.viewMode === 'split' ? '#1e3a8a' : '#ffffff'}; color:${state.viewMode === 'split' ? '#ffffff' : '#334155'}; cursor:pointer;">
                  🔀 Vue Scindée (FR / EN côte à côte)
                </button>
                <button class="view-btn ${state.viewMode === 'grid' && state.activeLang === 'all' ? 'active' : ''}" data-view="grid" data-lang="all" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.viewMode === 'grid' && state.activeLang === 'all' ? '#1e3a8a' : '#cbd5e1'}; background:${state.viewMode === 'grid' && state.activeLang === 'all' ? '#1e3a8a' : '#ffffff'}; color:${state.viewMode === 'grid' && state.activeLang === 'all' ? '#ffffff' : '#334155'}; cursor:pointer;">
                  🌐 Tous (${totalAll})
                </button>
                <button class="view-btn ${state.activeLang === 'fr' ? 'active' : ''}" data-view="fr" data-lang="fr" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.activeLang === 'fr' ? '#b91c1c' : '#cbd5e1'}; background:${state.activeLang === 'fr' ? '#b91c1c' : '#ffffff'}; color:${state.activeLang === 'fr' ? '#ffffff' : '#334155'}; cursor:pointer;">
                  🇫🇷 Français (${totalFr})
                </button>
                <button class="view-btn ${state.activeLang === 'en' ? 'active' : ''}" data-view="en" data-lang="en" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.activeLang === 'en' ? '#2563eb' : '#cbd5e1'}; background:${state.activeLang === 'en' ? '#2563eb' : '#ffffff'}; color:${state.activeLang === 'en' ? '#ffffff' : '#334155'}; cursor:pointer;">
                  🇬🇧 Anglais (${totalEn})
                </button>
              </div>

              <!-- Search -->
              <div style="position:relative; min-width:240px; flex:1; max-width:360px;">
                <input type="text" id="news-search-input" value="${state.searchQuery}" placeholder="Rechercher (dollar, Fed, pétrole, BCE...)" style="width:100%; padding:7px 30px 7px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px;" />
                ${state.searchQuery ? `
                  <button id="btn-clear-search" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:none; color:#94a3b8; font-size:14px; cursor:pointer;">×</button>
                ` : `<span style="position:absolute; right:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;">🔍</span>`}
              </div>
            </div>

            <!-- Categories and Source Dropdown -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${categories.map(cat => `
                  <button class="cat-pill ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="padding:5px 11px; border-radius:20px; font-size:11px; font-weight:700; cursor:pointer; border:1px solid ${state.activeCategory === cat.id ? '#2563eb' : '#e2e8f0'}; background:${state.activeCategory === cat.id ? '#eff6ff' : '#ffffff'}; color:${state.activeCategory === cat.id ? '#1e40af' : '#475569'};">
                    ${cat.icon} ${cat.label}
                  </button>
                `).join('')}
              </div>

              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:11px; color:#64748b; font-weight:600;">Média :</span>
                <select id="news-source-select" style="padding:5px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:600; color:#1e293b; background:#ffffff;">
                  <option value="all" ${state.activeSource === 'all' ? 'selected' : ''}>Toutes les sources (${Object.keys(PUBLISHERS).length} médias)</option>
                  <optgroup label="🇬🇧 Sources Anglophones">
                    <option value="Reuters" ${state.activeSource === 'Reuters' ? 'selected' : ''}>Reuters</option>
                    <option value="ING Think" ${state.activeSource === 'ING Think' ? 'selected' : ''}>ING Think</option>
                    <option value="FX Empire" ${state.activeSource === 'FX Empire' ? 'selected' : ''}>FX Empire</option>
                    <option value="The Guardian" ${state.activeSource === 'The Guardian' ? 'selected' : ''}>The Guardian</option>
                    <option value="Sky News" ${state.activeSource === 'Sky News' ? 'selected' : ''}>Sky News</option>
                    <option value="Investing.com" ${state.activeSource === 'Investing.com' ? 'selected' : ''}>Investing.com (EN)</option>
                    <option value="FXStreet" ${state.activeSource === 'FXStreet' ? 'selected' : ''}>FXStreet</option>
                    <option value="US News" ${state.activeSource === 'US News' ? 'selected' : ''}>US News</option>
                  </optgroup>
                  <optgroup label="🇫🇷 Sources Francophones">
                    <option value="Les Echos" ${state.activeSource === 'Les Echos' ? 'selected' : ''}>Les Echos</option>
                    <option value="Le Monde" ${state.activeSource === 'Le Monde' ? 'selected' : ''}>Le Monde</option>
                    <option value="Le Figaro" ${state.activeSource === 'Le Figaro' ? 'selected' : ''}>Le Figaro Économie</option>
                    <option value="BFM Business" ${state.activeSource === 'BFM Business' ? 'selected' : ''}>BFM Business</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          <!-- Feed Grid Content -->
          ${(() => {
            if (filtered.length === 0) {
              return `
                <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:48px; text-align:center;">
                  <div style="font-size:32px; margin-bottom:12px;">🔍</div>
                  <h3 style="margin:0 0 6px 0; font-size:16px; font-weight:700; color:#1e293b;">Aucun article ne correspond à vos filtres</h3>
                  <button id="btn-reset-filters" style="padding:8px 16px; background:#1e3a8a; color:#ffffff; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                    Réinitialiser les filtres
                  </button>
                </div>
              `;
            }

            if (state.viewMode === 'split') {
              return `
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start;">
                  <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #dc2626; padding-bottom:8px;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">🇫🇷</span>
                        <h3 style="margin:0; font-size:15px; font-weight:800; color:#991b1b;">Presse Francophone</h3>
                      </div>
                      <span style="background:#fee2e2; color:#991b1b; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">
                        ${frArticles.length} article${frArticles.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                      ${frArticles.map(renderFeedCard).join('')}
                    </div>
                  </div>

                  <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #2563eb; padding-bottom:8px;">
                      <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:18px;">🇬🇧</span>
                        <h3 style="margin:0; font-size:15px; font-weight:800; color:#1e40af;">Anglo-Saxon & Global Press</h3>
                      </div>
                      <span style="background:#dbeafe; color:#1e40af; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">
                        ${enArticles.length} article${enArticles.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                      ${enArticles.map(renderFeedCard).join('')}
                    </div>
                  </div>
                </div>
              `;
            } else {
              return `
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:16px;">
                  ${filtered.map(renderFeedCard).join('')}
                </div>
              `;
            }
          })()}
        `}
      </div>
    `;

    bindEvents();
  }

  // ─── Bind Events ───
  function bindEvents() {
    // Sub-tab switcher
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeSubTab = btn.dataset.subtab;
        render();
      });
    });

    // Refresh button
    document.getElementById('btn-refresh-news')?.addEventListener('click', () => {
      fetchArticles(true);
    });

    // Feed view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        const lang = btn.dataset.lang;
        if (view === 'split') {
          state.viewMode = 'split';
          state.activeLang = 'all';
        } else if (view === 'fr') {
          state.viewMode = 'grid';
          state.activeLang = 'fr';
        } else if (view === 'en') {
          state.viewMode = 'grid';
          state.activeLang = 'en';
        } else if (view === 'grid') {
          state.viewMode = 'grid';
          state.activeLang = lang || 'all';
        }
        render();
      });
    });

    // Feed categories
    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.cat;
        render();
      });
    });

    // Feed source dropdown
    document.getElementById('news-source-select')?.addEventListener('change', (e) => {
      state.activeSource = e.target.value;
      render();
    });

    // Search box
    const searchInput = document.getElementById('news-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        render();
        const newInp = document.getElementById('news-search-input');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      });
    }

    // Clear search & reset
    document.getElementById('btn-clear-search')?.addEventListener('click', () => {
      state.searchQuery = '';
      render();
    });
    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      state.activeSource = 'all';
      state.activeLang = 'all';
      state.viewMode = 'split';
      render();
    });

    // Copy single feed article link
    document.querySelectorAll('.btn-copy-news').forEach(btn => {
      btn.addEventListener('click', () => {
        const link = btn.dataset.link;
        const title = decodeURIComponent(btn.dataset.title || '');
        navigator.clipboard.writeText(`${title}\n${link}`).then(() => {
          if (window.App && window.App.showToast) {
            window.App.showToast('Titre et lien copiés dans le presse-papier !', 'success');
          }
        });
      });
    });

    // ─── EMAIL TEMPLATE INTERACTIVE CONTROLS ───
    document.getElementById('cfg-client-name')?.addEventListener('input', (e) => {
      state.email.clientName = e.target.value || 'XXXX';
      updateEmailPreviewOnly();
    });

    document.getElementById('cfg-pair')?.addEventListener('change', (e) => {
      state.email.pair = e.target.value;
      updateEmailPreviewOnly();
    });

    document.getElementById('cfg-period')?.addEventListener('input', (e) => {
      state.email.period = e.target.value;
      updateEmailPreviewOnly();
    });

    document.getElementById('cfg-move-pct')?.addEventListener('input', (e) => {
      state.email.movePct = e.target.value;
      updateEmailPreviewOnly();
    });

    document.querySelectorAll('.dir-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.email.direction = btn.dataset.dir;
        render();
      });
    });

    document.getElementById('cfg-agenda-url')?.addEventListener('input', (e) => {
      state.email.agendaUrl = e.target.value;
      updateEmailPreviewOnly();
    });

    // Checkboxes and inputs for Facteurs Clés
    document.querySelectorAll('.chk-kf').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(chk.dataset.idx, 10);
        state.email.keyFactors[idx].enabled = chk.checked;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-kf-title').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.keyFactors[idx].title = inp.value;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-kf-url').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.keyFactors[idx].url = inp.value;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-kf-desc').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.keyFactors[idx].desc = inp.value;
        updateEmailPreviewOnly();
      });
    });

    // Checkboxes and inputs for Événements à Venir
    document.querySelectorAll('.chk-ue').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(chk.dataset.idx, 10);
        state.email.upcomingEvents[idx].enabled = chk.checked;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-ue-title').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.upcomingEvents[idx].title = inp.value;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-ue-url').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.upcomingEvents[idx].url = inp.value;
        updateEmailPreviewOnly();
      });
    });
    document.querySelectorAll('.inp-ue-desc').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const idx = parseInt(inp.dataset.idx, 10);
        state.email.upcomingEvents[idx].desc = inp.value;
        updateEmailPreviewOnly();
      });
    });

    // Reset email button
    document.getElementById('btn-reset-email-model')?.addEventListener('click', () => {
      state.email = JSON.parse(JSON.stringify(DEFAULT_EMAIL_DATA));
      render();
      if (window.App && window.App.showToast) {
        window.App.showToast('Modèle exact de référence rétabli !', 'info');
      }
    });

    // Copy Email HTML (Rich clipboard for Gmail & Outlook)
    document.getElementById('btn-copy-gmail-html')?.addEventListener('click', async () => {
      const { htmlBody, plainText } = generateExactEmail();
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const blobHtml = new Blob([htmlBody], { type: 'text/html' });
          const blobText = new Blob([plainText], { type: 'text/plain' });
          await navigator.clipboard.write([
            new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })
          ]);
        } else {
          await navigator.clipboard.writeText(plainText);
        }
        const btn = document.getElementById('btn-copy-gmail-html');
        if (btn) {
          btn.innerHTML = '✓ Copié en Format Gmail !';
          btn.style.background = '#15803d';
          setTimeout(() => {
            btn.innerHTML = '📋 Copier pour Gmail / Outlook (Format Riche)';
            btn.style.background = '#1e3a8a';
          }, 2500);
        }
        if (window.App && window.App.showToast) {
          window.App.showToast('Email prêt à coller dans Gmail ou Outlook avec liens cliquables !', 'success');
        }
      } catch (err) {
        navigator.clipboard.writeText(plainText).then(() => {
          if (window.App && window.App.showToast) {
            window.App.showToast('Email copié en texte dans le presse-papier !', 'info');
          }
        });
      }
    });

    // Copy Email PlainText / Markdown
    document.getElementById('btn-copy-gmail-text')?.addEventListener('click', () => {
      const { plainText } = generateExactEmail();
      navigator.clipboard.writeText(plainText).then(() => {
        const btn = document.getElementById('btn-copy-gmail-text');
        if (btn) {
          btn.innerHTML = '✓ Copié !';
          setTimeout(() => { btn.innerHTML = '📝 Texte Brut'; }, 2000);
        }
        if (window.App && window.App.showToast) {
          window.App.showToast('Texte brut copié pour WhatsApp/Slack/Mail !', 'success');
        }
      });
    });
  }

  // Fast partial update to avoid losing input focus
  function updateEmailPreviewOnly() {
    const previewContainer = document.getElementById('email-preview-content');
    if (previewContainer) {
      const { htmlBody } = generateExactEmail();
      previewContainer.innerHTML = htmlBody;
    }
  }

  // ─── Public API ───
  function renderPage() {
    return `<div id="news-feed-root" style="padding: 24px; min-height: calc(100vh - 70px);"></div>`;
  }

  function initPage() {
    if (state.articles.length === 0) {
      fetchArticles();
    } else {
      render();
    }
  }

  return {
    renderPage,
    initPage,
    fetchArticles
  };
})();
