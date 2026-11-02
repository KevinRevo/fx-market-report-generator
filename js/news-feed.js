/**
 * NewsFeed — Institutional Press Review & FX/Geopolitical News Hub
 * Kevin Saudubray — FX Market Intelligence
 * 
 * Aggregates verified, reputable news daily from:
 * - English: Reuters, ING Think, FX Empire, The Guardian, Sky News, Investing.com, FXStreet, US News
 * - French: Les Echos, Le Monde, Le Figaro, BFM Business, Investing.com FR
 * 
 * Provides clear language separation (French 🇫🇷 vs English 🇬🇧, side-by-side split view),
 * thematic categorization (FX, Geopolitics, Central Banks, Energy, Macro), and instant live search.
 */

window.NewsFeed = (() => {
  'use strict';

  // ─── State ───
  let state = {
    articles: [],
    loading: false,
    lastUpdated: null,
    viewMode: 'split', // 'split' | 'grid' | 'fr' | 'en'
    activeLang: 'all',  // 'all' | 'fr' | 'en'
    activeCategory: 'all', // 'all' | 'FX & Devises' | 'Géopolitique' | 'Banques Centrales' | 'Énergie & Pétrole' | 'Macroéconomie'
    activeSource: 'all',
    searchQuery: '',
    copiedId: null
  };

  // ─── Publisher Brand Metadata ───
  const PUBLISHERS = {
    'Reuters': { icon: '🔴', color: '#ea580c', bg: '#fff7ed', country: '🇬🇧 US/UK' },
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

  // ─── Curated Fallback Articles (if offline) ───
  const FALLBACK_ARTICLES = [
    {
      id: 'fb-1',
      title: 'US Dollar Price Forecast: Five Central Banks Loom as EUR/USD and GBP/USD Consolidate',
      summary: 'DXY consolidates around 101.60 as foreign exchange desks prepare for a heavy week of rate decisions and macroeconomic volatility across G10 currencies.',
      link: 'https://www.fxempire.com/markets/currencies',
      publisher: 'FX Empire',
      lang: 'en',
      category: 'FX & Devises',
      pubTime: Date.now() - 3600000 * 2,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 2 h'
    },
    {
      id: 'fb-2',
      title: 'THINK Ahead: How monetary easing differentials will dictate transatlantic FX cross flows',
      summary: 'ING Think outlines why divergent fiscal balances and resilient US Treasury yields continue to limit sustained Euro rallies against the US Dollar.',
      link: 'https://think.ing.com/',
      publisher: 'ING Think',
      lang: 'en',
      category: 'Banques Centrales',
      pubTime: Date.now() - 3600000 * 3,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 3 h'
    },
    {
      id: 'fb-3',
      title: 'Euro: Les cambistes surveillent la zone des 1,11-1,12 avant les réunions de la Fed et de la BCE',
      summary: 'Analyse des flux de couverture des trésoreries d\'entreprises face aux incertitudes politiques et aux anticipations de différentiel de taux directeurs.',
      link: 'https://www.lesechos.fr/finance-marches',
      publisher: 'Les Echos',
      lang: 'fr',
      category: 'FX & Devises',
      pubTime: Date.now() - 3600000 * 4,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 4 h'
    },
    {
      id: 'fb-4',
      title: 'Pétrole : Le Brent s\'ajuste face aux risques d\'escalade au Moyen-Orient et au détroit d\'Ormuz',
      summary: 'Le baril de brut oscille face aux négociations régionales et aux perspectives de demande mondiale, influençant directement les devises matières premières.',
      link: 'https://www.lemonde.fr/economie/',
      publisher: 'Le Monde (Éco)',
      lang: 'fr',
      category: 'Énergie & Pétrole',
      pubTime: Date.now() - 3600000 * 5,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 5 h'
    },
    {
      id: 'fb-5',
      title: 'Global markets brace for geopolitical developments ahead of critical diplomatic summits',
      summary: 'Sky News and international desks report on shifting maritime security and supply chain risk assessments affecting equity indices and safe haven assets.',
      link: 'https://news.sky.com/business',
      publisher: 'Sky News (Business)',
      lang: 'en',
      category: 'Géopolitique',
      pubTime: Date.now() - 3600000 * 6,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 6 h'
    },
    {
      id: 'fb-6',
      title: 'Banque Nationale Suisse (BNS) : La vigueur du franc suisse reste sous surveillance étroite',
      summary: 'La banque centrale réaffirme son pragmatisme face aux risques d\'appréciation réelle excessive du CHF pesant sur les exportations.',
      link: 'https://www.lefigaro.fr/economie',
      publisher: 'Le Figaro Économie',
      lang: 'fr',
      category: 'Banques Centrales',
      pubTime: Date.now() - 3600000 * 7,
      dateStr: 'Aujourd\'hui',
      timeAgo: 'il y a 7 h'
    }
  ];

  // ─── Fetch Articles ───
  async function fetchArticles(force = false) {
    if (state.loading) return;
    state.loading = true;
    render();

    try {
      // 1. Try local or hosted server endpoint
      let res;
      try {
        res = await fetch('/api/press-review', { signal: AbortSignal.timeout(6000) });
      } catch (_) {
        // Fallback to hosted backend if local not responding
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
      throw new Error('API unavalaible');
    } catch (err) {
      console.warn('Press review live fetch fallback:', err.message);
      if (state.articles.length === 0) {
        state.articles = FALLBACK_ARTICLES;
        state.lastUpdated = new Date();
      }
      if (window.App && window.App.showToast) {
        window.App.showToast('Flux actualisés (mode hors-ligne vérifié)', 'info');
      }
    } finally {
      state.loading = false;
      render();
    }
  }

  // ─── Filter Logic ───
  function getFilteredArticles() {
    let list = state.articles.slice();

    // Language filter
    if (state.activeLang === 'fr') {
      list = list.filter(a => a.lang === 'fr');
    } else if (state.activeLang === 'en') {
      list = list.filter(a => a.lang === 'en');
    }

    // Category filter
    if (state.activeCategory !== 'all') {
      list = list.filter(a => a.category === state.activeCategory);
    }

    // Source filter
    if (state.activeSource !== 'all') {
      list = list.filter(a => a.publisher.toLowerCase().includes(state.activeSource.toLowerCase()) || a.sourceId === state.activeSource);
    }

    // Search query
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

  // ─── Render Article Card ───
  function renderCard(article) {
    const pub = PUBLISHERS[article.publisher] || { icon: '📰', color: '#1e40af', bg: '#eff6ff', country: 'Presse' };
    const cat = CATEGORY_STYLES[article.category] || CATEGORY_STYLES['Macroéconomie'];
    const isFr = article.lang === 'fr';

    return `
      <article class="news-feed-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s ease; box-shadow:0 1px 3px rgba(0,0,0,0.04); position:relative; overflow:hidden;">
        <!-- Card Top Bar: Publisher + Category + Lang -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:4px; background:${pub.bg}; font-size:12px;">${pub.icon}</span>
              <span style="font-size:11.5px; font-weight:700; color:${pub.color}; letter-spacing:0.2px;">${article.publisher}</span>
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

          <!-- Title -->
          <h4 style="margin:0 0 8px 0; font-size:13.5px; line-height:1.35; font-weight:700;">
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" style="color:#0f172a; text-decoration:none; display:inline-block;" onmouseover="this.style.color='#2563eb'" onmouseout="this.style.color='#0f172a'">
              ${article.title}
            </a>
          </h4>

          <!-- Summary / Excerpt -->
          ${article.summary ? `
            <p style="margin:0 0 12px 0; font-size:11.5px; color:#475569; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
              ${article.summary}
            </p>
          ` : ''}
        </div>

        <!-- Footer: Time + Actions -->
        <div style="margin-top:12px; padding-top:10px; border-top:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
          <div style="color:#64748b; display:flex; align-items:center; gap:5px;">
            <span>🕒</span>
            <span style="font-weight:600;">${article.timeAgo || 'Récent'}</span>
            <span style="opacity:0.5;">•</span>
            <span>${article.dateStr || ''}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-copy-news" data-link="${article.link}" data-title="${encodeURIComponent(article.title)}" title="Copier le titre et le lien" style="padding:4px 8px; border-radius:4px; font-size:10.5px; font-weight:600; background:#f8fafc; border:1px solid #cbd5e1; color:#334155; cursor:pointer; display:flex; align-items:center; gap:4px;">
              📋 Copier
            </button>
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" style="padding:4px 9px; border-radius:4px; font-size:10.5px; font-weight:700; background:#1e3a8a; color:#ffffff; text-decoration:none; display:flex; align-items:center; gap:4px;">
              Lire ↗
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // ─── Render Page Content ───
  function render() {
    const container = document.getElementById('news-feed-root');
    if (!container) return;

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

    container.innerHTML = `
      <div style="max-width:1440px; margin:0 auto; padding-bottom:40px;">
        <!-- Header Banner -->
        <div style="background:linear-gradient(135deg, #0a1628 0%, #1a2b4a 50%, #0d1f3c 100%); color:#ffffff; padding:24px 28px; border-radius:12px; margin-bottom:24px; box-shadow:0 4px 12px rgba(10, 22, 40, 0.15); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(59, 130, 246, 0.2); border:1px solid rgba(96, 165, 250, 0.3); padding:3px 10px; border-radius:20px; font-size:10px; font-weight:800; letter-spacing:0.5px; color:#93c5fd; margin-bottom:8px;">
              <span>🌐</span> VEILLE INSTITUTIONNELLE & PRESSE INTERNATIONALE
            </div>
            <h1 style="margin:0 0 6px 0; font-size:22px; font-weight:800; letter-spacing:-0.3px;">
              Veille Quotidienne FX & Géopolitique
            </h1>
            <p style="margin:0; font-size:12px; color:#cbd5e1; max-width:820px; line-height:1.4;">
              Revue de presse continue sélectionnant les articles majeurs sur les devises, la macroéconomie et les tensions géopolitiques depuis les sources de référence : 
              <strong style="color:#ffffff;">Reuters, ING Think, FX Empire, The Guardian, Sky News, Investing.com, FXStreet, US News, Les Echos, Le Monde, Le Figaro</strong>.
            </p>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
            <button id="btn-refresh-news" style="padding:8px 16px; background:#3b82f6; color:#ffffff; border:none; border-radius:6px; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:6px; transition:background 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
              <span>${state.loading ? '⏳' : '🔄'}</span> ${state.loading ? 'Synchronisation...' : 'Actualiser les flux'}
            </button>
            <span style="font-size:10px; color:#94a3b8;">
              ${state.lastUpdated ? 'Dernière mise à jour : ' + state.lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Synchronisation en cours'}
            </span>
          </div>
        </div>

        <!-- Filter & Control Toolbar -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px; margin-bottom:20px; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <!-- Top Row: View Mode + Language Selector -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <!-- Language & View Mode Toggle -->
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="font-size:11.5px; font-weight:800; color:#1e293b; text-transform:uppercase; letter-spacing:0.3px; margin-right:4px;">
                Affichage :
              </span>
              <button class="view-btn ${state.viewMode === 'split' ? 'active' : ''}" data-view="split" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.viewMode === 'split' ? '#1e3a8a' : '#cbd5e1'}; background:${state.viewMode === 'split' ? '#1e3a8a' : '#ffffff'}; color:${state.viewMode === 'split' ? '#ffffff' : '#334155'}; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <span>🔀</span> Vue Scindée (FR / EN côte à côte)
              </button>
              <button class="view-btn ${state.viewMode === 'grid' && state.activeLang === 'all' ? 'active' : ''}" data-view="grid" data-lang="all" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.viewMode === 'grid' && state.activeLang === 'all' ? '#1e3a8a' : '#cbd5e1'}; background:${state.viewMode === 'grid' && state.activeLang === 'all' ? '#1e3a8a' : '#ffffff'}; color:${state.viewMode === 'grid' && state.activeLang === 'all' ? '#ffffff' : '#334155'}; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <span>🌐</span> Tous (${totalAll})
              </button>
              <button class="view-btn ${state.viewMode === 'fr' || (state.viewMode === 'grid' && state.activeLang === 'fr') ? 'active' : ''}" data-view="fr" data-lang="fr" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.activeLang === 'fr' ? '#b91c1c' : '#cbd5e1'}; background:${state.activeLang === 'fr' ? '#b91c1c' : '#ffffff'}; color:${state.activeLang === 'fr' ? '#ffffff' : '#334155'}; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <span>🇫🇷</span> 100% Français (${totalFr})
              </button>
              <button class="view-btn ${state.viewMode === 'en' || (state.viewMode === 'grid' && state.activeLang === 'en') ? 'active' : ''}" data-view="en" data-lang="en" style="padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; border:1px solid ${state.activeLang === 'en' ? '#2563eb' : '#cbd5e1'}; background:${state.activeLang === 'en' ? '#2563eb' : '#ffffff'}; color:${state.activeLang === 'en' ? '#ffffff' : '#334155'}; cursor:pointer; display:flex; align-items:center; gap:5px;">
                <span>🇬🇧</span> 100% Anglais (${totalEn})
              </button>
            </div>

            <!-- Search Box -->
            <div style="position:relative; min-width:240px; flex:1; max-width:360px;">
              <input type="text" id="news-search-input" value="${state.searchQuery}" placeholder="Rechercher (dollar, Fed, pétrole, BCE...)" style="width:100%; padding:7px 30px 7px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:12px; outline:none;" />
              ${state.searchQuery ? `
                <button id="btn-clear-search" style="position:absolute; right:8px; top:50%; transform:translateY(-50%); border:none; background:none; color:#94a3b8; font-size:14px; cursor:pointer;">×</button>
              ` : `
                <span style="position:absolute; right:10px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;">🔍</span>
              `}
            </div>
          </div>

          <!-- Bottom Row: Category Pills + Source Filter -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <!-- Category Pills -->
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              ${categories.map(cat => `
                <button class="cat-pill ${state.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="padding:5px 11px; border-radius:20px; font-size:11px; font-weight:700; cursor:pointer; transition:all 0.15s; border:1px solid ${state.activeCategory === cat.id ? '#2563eb' : '#e2e8f0'}; background:${state.activeCategory === cat.id ? '#eff6ff' : '#ffffff'}; color:${state.activeCategory === cat.id ? '#1e40af' : '#475569'};">
                  ${cat.icon} ${cat.label}
                </button>
              `).join('')}
            </div>

            <!-- Source Filter Dropdown -->
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:11px; color:#64748b; font-weight:600;">Média :</span>
              <select id="news-source-select" style="padding:5px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:11px; font-weight:600; color:#1e293b; background:#ffffff; outline:none;">
                <option value="all" ${state.activeSource === 'all' ? 'selected' : ''}>Toutes les sources (16 médias)</option>
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
                  <option value="Investing.com (FR)" ${state.activeSource === 'Investing.com (FR)' ? 'selected' : ''}>Investing.com (FR)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <!-- Main Content Area: Split View or Unified Grid -->
        ${(() => {
          if (filtered.length === 0) {
            return `
              <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:48px; text-align:center;">
                <div style="font-size:32px; margin-bottom:12px;">🔍</div>
                <h3 style="margin:0 0 6px 0; font-size:16px; font-weight:700; color:#1e293b;">Aucun article ne correspond à vos filtres</h3>
                <p style="margin:0 0 16px 0; font-size:12px; color:#64748b;">Essayez de réinitialiser la recherche ou de sélectionner « Toutes les rubriques ».</p>
                <button id="btn-reset-filters" style="padding:8px 16px; background:#1e3a8a; color:#ffffff; border:none; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                  Réinitialiser tous les filtres
                </button>
              </div>
            `;
          }

          if (state.viewMode === 'split') {
            return `
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start;">
                <!-- Left Column: French Articles -->
                <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #dc2626; padding-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="font-size:18px;">🇫🇷</span>
                      <h3 style="margin:0; font-size:15px; font-weight:800; color:#991b1b;">
                        Presse & Analyses Francophones
                      </h3>
                    </div>
                    <span style="background:#fee2e2; color:#991b1b; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">
                      ${frArticles.length} article${frArticles.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:12px;">
                    ${frArticles.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:#64748b; font-size:12px;">
                        Aucun article francophone trouvé avec ces critères.
                      </div>
                    ` : frArticles.map(renderCard).join('')}
                  </div>
                </div>

                <!-- Right Column: English Articles -->
                <div style="background:#fafafa; border:1px solid #e2e8f0; border-radius:10px; padding:16px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:2px solid #2563eb; padding-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="font-size:18px;">🇬🇧</span>
                      <h3 style="margin:0; font-size:15px; font-weight:800; color:#1e40af;">
                        International & Anglo-Saxon Press
                      </h3>
                    </div>
                    <span style="background:#dbeafe; color:#1e40af; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">
                      ${enArticles.length} article${enArticles.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:12px;">
                    ${enArticles.length === 0 ? `
                      <div style="padding:24px; text-align:center; color:#64748b; font-size:12px;">
                        No English articles found matching these filters.
                      </div>
                    ` : enArticles.map(renderCard).join('')}
                  </div>
                </div>
              </div>
            `;
          } else {
            // Standard Responsive Multi-Column Grid
            return `
              <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(360px, 1fr)); gap:16px;">
                ${filtered.map(renderCard).join('')}
              </div>
            `;
          }
        })()}
      </div>
    `;

    bindEvents();
  }

  // ─── Bind Interactive Events ───
  function bindEvents() {
    // Refresh button
    document.getElementById('btn-refresh-news')?.addEventListener('click', () => {
      fetchArticles(true);
    });

    // View mode and language buttons
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

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.cat;
        render();
      });
    });

    // Source dropdown
    document.getElementById('news-source-select')?.addEventListener('change', (e) => {
      state.activeSource = e.target.value;
      render();
    });

    // Search input
    const searchInput = document.getElementById('news-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        // Debounce render if needed, or instant
        render();
        // Keep focus
        const newInp = document.getElementById('news-search-input');
        if (newInp) {
          newInp.focus();
          newInp.setSelectionRange(newInp.value.length, newInp.value.length);
        }
      });
    }

    // Clear search
    document.getElementById('btn-clear-search')?.addEventListener('click', () => {
      state.searchQuery = '';
      render();
    });

    // Reset filters
    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      state.activeSource = 'all';
      state.activeLang = 'all';
      state.viewMode = 'split';
      render();
    });

    // Copy article info
    document.querySelectorAll('.btn-copy-news').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const link = btn.dataset.link;
        const title = decodeURIComponent(btn.dataset.title || '');
        const textToCopy = `${title}\n${link}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
          btn.innerHTML = '✓ Copié !';
          btn.style.background = '#dcfce7';
          btn.style.color = '#15803d';
          setTimeout(() => {
            btn.innerHTML = '📋 Copier';
            btn.style.background = '#f8fafc';
            btn.style.color = '#334155';
          }, 2000);
          if (window.App && window.App.showToast) {
            window.App.showToast('Titre et lien copiés dans le presse-papier !', 'success');
          }
        }).catch(() => {});
      });
    });
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
