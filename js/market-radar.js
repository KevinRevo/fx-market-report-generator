/**
 * FX Market Intelligence — Matrix & Radar Module
 * Point 3: Matrice de Corrélation & Heatmap Multi-Devises en Direct
 * Point 4: Alerting & Radar de Niveaux Techniques Clés
 * 
 * Kevin Saudubray — Revolut Business FX Hub
 */
window.MarketRadar = (() => {
  'use strict';

  let currentLang = 'fr';
  let activeTab = 'heatmap'; // 'heatmap' | 'radar' | 'commodities' | 'simulator' | 'calendar'
  let cachedQuotes = null;
  let cachedCalendarEvents = null;
  let isLoading = false;
  let simState = {
    pair: 'EURUSD',
    volume: 250000,
    direction: 'buy_foreign', // 'buy_foreign' (importateur) | 'sell_foreign' (exportateur)
    horizon: 6, // months
    customRate: null
  };

  // Major tracked cross pairs for heatmap & radar
  const TRACKED_PAIRS = [
    { base: 'EUR', quote: 'USD', name: 'EUR/USD', flag: '🇪🇺/🇺🇸', group: 'Majors' },
    { base: 'EUR', quote: 'CHF', name: 'EUR/CHF', flag: '🇪🇺/🇨🇭', group: 'G10' },
    { base: 'CHF', quote: 'USD', name: 'CHF/USD', flag: '🇨🇭/🇺🇸', group: 'G10' },
    { base: 'EUR', quote: 'GBP', name: 'EUR/GBP', flag: '🇪🇺/🇬🇧', group: 'G10' },
    { base: 'GBP', quote: 'USD', name: 'GBP/USD', flag: '🇬🇧/🇺🇸', group: 'Majors' },
    { base: 'EUR', quote: 'PLN', name: 'EUR/PLN', flag: '🇪🇺/🇵🇱', group: 'CEE' },
    { base: 'USD', quote: 'PLN', name: 'USD/PLN', flag: '🇺🇸/🇵🇱', group: 'CEE' },
    { base: 'CZK', quote: 'USD', name: 'CZK/USD', flag: '🇨🇿/🇺🇸', group: 'CEE' },
    { base: 'EUR', quote: 'CZK', name: 'EUR/CZK', flag: '🇪🇺/🇨🇿', group: 'CEE' },
    { base: 'USD', quote: 'HUF', name: 'USD/HUF', flag: '🇺🇸/🇭🇺', group: 'CEE' },
    { base: 'EUR', quote: 'HUF', name: 'EUR/HUF', flag: '🇪🇺/🇭🇺', group: 'CEE' },
    { base: 'EUR', quote: 'SEK', name: 'EUR/SEK', flag: '🇪🇺/🇸🇪', group: 'Nordics' },
    { base: 'EUR', quote: 'NOK', name: 'EUR/NOK', flag: '🇪🇺/🇳🇴', group: 'Nordics' }
  ];

  // Key Technical Alert Thresholds (Sensitivities & Triggers)
  const TECHNICAL_THRESHOLDS = [
    {
      pair: 'EUR/USD',
      base: 'EUR',
      quote: 'USD',
      flag: '🇪🇺/🇺🇸',
      supportAlert: 1.1200,
      resistanceAlert: 1.1350,
      correlCommodity: 'Brent Crude ($100+/bbl)',
      correlYield: 'US 10Y Yield (>5.25%)',
      triggerNoticeFr: 'Cassure baissière des 1,1200 : renforcement de la prime de risque géopolitique et différentiel de taux Fed-BCE.',
      triggerNoticeEn: 'Bearish break below 1.1200: geopolitical risk premium and widened Fed-ECB rate differential.',
      salesAngleFr: 'Opportunité immédiate pour les importateurs européens en USD de verrouiller leurs cours d\'achat via un Forward flexible.',
      salesAngleEn: 'Immediate opportunity for Euro-denominated USD importers to lock buy rates with flexible FX Forwards.'
    },
    {
      pair: 'EUR/CHF',
      base: 'EUR',
      quote: 'CHF',
      flag: '🇪🇺/🇨🇭',
      supportAlert: 0.9350,
      resistanceAlert: 0.9500,
      correlCommodity: 'Aversion au risque européenne',
      correlYield: 'Spread OAT-Bund / Dettes souveraines',
      triggerNoticeFr: 'Compression sous 0,9350 : ruée vers la valeur refuge du franc suisse en raison de la volatilité obligataire.',
      triggerNoticeEn: 'Compression below 0.9350: safe-haven flight into CHF driven by sovereign yield volatility.',
      salesAngleFr: 'Urgence pour les entreprises commerçant avec la Suisse : figer les coûts en CHF pour protéger les marges d\'exploitation.',
      salesAngleEn: 'Critical for Swiss-trading corporates: fix CHF costs now to preserve operating margin predictability.'
    },
    {
      pair: 'USD/PLN',
      base: 'USD',
      quote: 'PLN',
      flag: '🇺🇸/🇵🇱',
      supportAlert: 3.8600,
      resistanceAlert: 3.9100,
      correlCommodity: 'Pétrole Brent ($107/bbl) & Gaz européen',
      correlYield: 'Taux NBP (5,75%) vs US 10Y',
      triggerNoticeFr: 'Test des plus hauts annuels (> 3,9000) : renforcement général du dollar face aux devises CEE et coûts de l\'énergie.',
      triggerNoticeEn: 'Testing 18-month highs (> 3.9000): broad USD strength against CEE assets compounded by energy import costs.',
      salesAngleFr: 'Proposer un Forward ladder USD/PLN pour protéger les comptes payables d\'énergie et composants.',
      salesAngleEn: 'Pitch USD/PLN Forward ladders to hedge energy and foreign component procurement.'
    },
    {
      pair: 'CZK/USD',
      base: 'CZK',
      quote: 'USD',
      flag: '🇨🇿/🇺🇸',
      supportAlert: 0.0425,
      resistanceAlert: 0.0440,
      correlCommodity: 'Dépendance énergétique CEE',
      correlYield: 'Taux CNB (3,75%) vs Fed (3,75-4,00%)',
      triggerNoticeFr: 'Repli vers 0,0430 : compression du spread de rendement en faveur des Treasuries américains.',
      triggerNoticeEn: 'Pullback toward 0.0430: yield advantage shifting toward US Treasuries over Koruna holdings.',
      salesAngleFr: 'Structurer des couvertures sur 6 à 12 mois pour sécuriser la conversion des facturations export.',
      salesAngleEn: 'Structure 6 to 12-month hedging lines to protect export revenue conversions.'
    },
    {
      pair: 'EUR/PLN',
      base: 'EUR',
      quote: 'PLN',
      flag: '🇪🇺/🇵🇱',
      supportAlert: 4.3500,
      resistanceAlert: 4.4100,
      correlCommodity: 'Inflation énergétique importée',
      correlYield: 'Écart de taux BCE (2,50%) vs NBP (5,75%)',
      triggerNoticeFr: 'Zone de consolidation 4,3850 : le zloty balance le portage élevé (5,75%) et l\'aversion au risque régionale.',
      triggerNoticeEn: 'Consolidation at 4.3850: Zloty balances attractive 5.75% carry against regional energy inflation headwinds.',
      salesAngleFr: 'Niveau optimal pour les trésoriers payant en PLN pour bloquer un cours plancher compétitif.',
      salesAngleEn: 'Ideal timing for treasurers with PLN payables to lock attractive conversion floors.'
    }
  ];

  // Commodities & Macro Benchmark data
  const MACRO_BENCHMARKS = [
    { name: 'Brent Crude Oil', ticker: 'BZ=F', unit: '$/bbl', benchmark: 107.50, change1D: '+1.45%', change1W: '+4.20%', impactFr: 'Inflation importée accrue en Europe ; soutien au USD et pression sur devises dépendantes de l\'énergie (PLN, EUR).', impactEn: 'Elevated European imported energy costs; structural support for USD and drag on energy-deficit currencies.' },
    { name: 'US 10-Year Treasury Yield', ticker: '^TNX', unit: '%', benchmark: 5.34, change1D: '+0.03%', change1W: '+0.12%', impactFr: 'Attractivité massive du dollar monétaire ; portage très défavorable pour EUR, CHF et devises CEE.', impactEn: 'Strong institutional pull into US dollar fixed-income; steep carry penalty against EUR, CHF and CEE currencies.' },
    { name: 'Gold (Safe Haven)', ticker: 'GC=F', unit: '$/oz', benchmark: 2685.00, change1D: '+0.80%', change1W: '+2.10%', impactFr: 'Reflet de la recherche de couverture géopolitique ; corrélation positive avec les flux vers le Franc Suisse (CHF).', impactEn: 'Indicator of heightened geopolitical hedging demand; closely correlates with safe-haven flows into Swiss Franc.' },
    { name: 'Spread OAT-Bund (France/Allemagne)', ticker: 'OAT10Y', unit: 'bps', benchmark: 82.5, change1D: '+2.8 bps', change1W: '+7.1 bps', impactFr: 'Écartement des primes de risque sur la dette souveraine française ; facteur direct de dépréciation de l\'Euro.', impactEn: 'Widening French sovereign debt risk spread; direct headwind depressing Euro performance vs USD & CHF.' }
  ];

  async function loadMarketRates() {
    if (isLoading) return;
    isLoading = true;
    const M = window.MarketData;

    try {
      const results = await Promise.allSettled(
        TRACKED_PAIRS.map(async p => {
          const res = await M.getPair(p.base, p.quote);
          return {
            ...p,
            rate: res.rate,
            rateVal: parseFloat(res.rate),
            d1Pct: res.d1Pct,
            w1Pct: res.w1Pct,
            d1Str: res.d1,
            w1Str: res.w1,
            history: res.history,
            source: res.source
          };
        })
      );

      cachedQuotes = results.map((r, i) => {
        if (r.status === 'fulfilled' && r.value) return r.value;
        const p = TRACKED_PAIRS[i];
        return {
          ...p,
          rate: '–',
          rateVal: null,
          d1Pct: null,
          w1Pct: null,
          d1Str: '–',
          w1Str: '–',
          history: [],
          source: 'BCE (estimé)'
        };
      });
    } catch (e) {
      console.error('Error fetching radar market rates:', e);
    } finally {
      isLoading = false;
    }
  }

  function getHeatmapBgColor(pct) {
    if (pct == null || isNaN(pct)) return '#f8fafc';
    if (pct > 1.0) return '#dcfce7'; // deep green
    if (pct > 0.3) return '#ecfdf5'; // light green
    if (pct >= 0) return '#f0fdf4';  // very light green
    if (pct < -1.0) return '#fee2e2'; // deep red
    if (pct < -0.3) return '#fef2f2'; // light red
    return '#fff1f2'; // very light red
  }

  function getTextColor(pct) {
    if (pct == null || isNaN(pct)) return '#64748b';
    return pct >= 0 ? '#15803d' : '#b91c1c';
  }

  function renderHeatmapView() {
    const isFr = currentLang === 'fr';
    const quotes = cachedQuotes || TRACKED_PAIRS.map(p => ({ ...p, rate: '...', d1Pct: 0, w1Pct: 0, d1Str: '...', w1Str: '...' }));

    return `
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1e3a8a;">
              ${isFr ? '🌡️ Heatmap Multi-Devises en Direct' : '🌡️ Live Multi-Currency Heatmap'}
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Performances relatives en temps réel (vs clôtures officielles de la séance précédente et 1 semaine).' : 'Real-time relative performances (vs previous session and 1-week official closes).'}
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="refresh-radar-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 12px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              ${isFr ? 'Actualiser le marché' : 'Refresh Market'}
            </button>
          </div>
        </div>

        <!-- Heatmap Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; margin-bottom: 24px;">
          ${quotes.map(q => {
            const d1Bg = getHeatmapBgColor(q.d1Pct);
            const w1Bg = getHeatmapBgColor(q.w1Pct);
            const d1Color = getTextColor(q.d1Pct);
            const w1Color = getTextColor(q.w1Pct);
            return `
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #ffffff; display: flex; flex-direction: column; justify-content: space-between; transition: transform 0.15s, box-shadow 0.15s;" onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='none'">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 18px;">${q.flag}</span>
                    <strong style="font-size: 13px; color: #1e293b;">${q.name}</strong>
                  </div>
                  <span style="font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${q.group}</span>
                </div>

                <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; font-family: 'JetBrains Mono', monospace; margin-bottom: 8px;">
                  ${q.rate}
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                  <div style="background: ${d1Bg}; border-radius: 6px; padding: 4px 6px; text-align: center;">
                    <div style="font-size: 9px; color: #64748b; font-weight: 600;">1J (24h)</div>
                    <div style="font-size: 11px; font-weight: 800; color: ${d1Color}; font-family: 'JetBrains Mono', monospace;">
                      ${q.d1Str}
                    </div>
                  </div>
                  <div style="background: ${w1Bg}; border-radius: 6px; padding: 4px 6px; text-align: center;">
                    <div style="font-size: 9px; color: #64748b; font-weight: 600;">1S (1 Sem.)</div>
                    <div style="font-size: 11px; font-weight: 800; color: ${w1Color}; font-family: 'JetBrains Mono', monospace;">
                      ${q.w1Str}
                    </div>
                  </div>
                </div>

                <button class="open-pair-focus-btn" data-pair="${q.base + q.quote}" style="margin-top: 10px; font-size: 11px; color: #2563eb; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 4px 8px; font-weight: 600; cursor: pointer; text-align: center; width: 100%;">
                  ${isFr ? 'Voir Focus & Forecasts →' : 'View Pair Focus →'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Matrix Summary Table -->
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #f8fafc; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #1e3a8a;">
            ${isFr ? 'Tableau Comparatif & Différentiels de Taux Associés' : 'Comparative Matrix & Related Rate Spreads'}
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left;">
            <thead>
              <tr style="background: #f1f5f9; color: #475569; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 8px 12px;">Paire</th>
                <th style="padding: 8px 12px;">Cours Spot</th>
                <th style="padding: 8px 12px; text-align: center;">Var. 1J</th>
                <th style="padding: 8px 12px; text-align: center;">Var. 1S</th>
                <th style="padding: 8px 12px;">Écart Taux Banques Centrales</th>
                <th style="padding: 8px 12px;">Dynamique de Portage (Carry)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 8px 12px; font-weight: 700;">EUR/USD</td>
                <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e3a8a;">1.1203</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.28%</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.65%</td>
                <td style="padding: 8px 12px; color: #475569;">BCE 2.50% vs Fed 3.75-4.00% (-137 pb)</td>
                <td style="padding: 8px 12px;"><span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">Défavorable EUR</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 8px 12px; font-weight: 700;">EUR/CHF</td>
                <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e3a8a;">0.9360</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.12%</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.45%</td>
                <td style="padding: 8px 12px; color: #475569;">BCE 2.50% vs BNS 0.00% (+250 pb)</td>
                <td style="padding: 8px 12px;"><span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">Refuge CHF compense</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 8px 12px; font-weight: 700;">USD/PLN</td>
                <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e3a8a;">3.8920</td>
                <td style="padding: 8px 12px; text-align: center; color: #16a34a; font-weight: 700;">+0.42%</td>
                <td style="padding: 8px 12px; text-align: center; color: #16a34a; font-weight: 700;">+1.20%</td>
                <td style="padding: 8px 12px; color: #475569;">Fed 3.875% vs NBP 5.75% (-187 pb)</td>
                <td style="padding: 8px 12px;"><span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">Portage PLN élevé</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9; background: #fafafa;">
                <td style="padding: 8px 12px; font-weight: 700;">EUR/PLN</td>
                <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e3a8a;">4.3850</td>
                <td style="padding: 8px 12px; text-align: center; color: #16a34a; font-weight: 700;">+0.15%</td>
                <td style="padding: 8px 12px; text-align: center; color: #16a34a; font-weight: 700;">+0.35%</td>
                <td style="padding: 8px 12px; color: #475569;">BCE 2.50% vs NBP 5.75% (-325 pb)</td>
                <td style="padding: 8px 12px;"><span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">Fort avantage PLN</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 700;">CZK/USD</td>
                <td style="padding: 8px 12px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #1e3a8a;">0.0430</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.35%</td>
                <td style="padding: 8px 12px; text-align: center; color: #dc2626; font-weight: 700;">-0.80%</td>
                <td style="padding: 8px 12px; color: #475569;">CNB 3.75% vs Fed 3.75-4.00% (-12 pb)</td>
                <td style="padding: 8px 12px;"><span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 10px;">Avantage Dollar</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderRadarAlertsView() {
    const isFr = currentLang === 'fr';

    return `
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1e3a8a;">
              ${isFr ? '🎯 Radar de Niveaux Techniques & Alertes Clients' : '🎯 Technical Threshold Radar & Client Action Alerts'}
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Détecteur de cassures de seuils psychologiques & générateurs d\'angles commerciaux immédiats pour les commerciaux Revolut Business.' : 'Breakout detector for key psychological barriers & sales triggers tailored for Revolut Business commercial teams.'}
            </p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${TECHNICAL_THRESHOLDS.map(item => `
            <div style="border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: 6px; padding: 14px; background: #f8fafc;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 20px;">${item.flag}</span>
                  <span style="font-size: 15px; font-weight: 800; color: #1e3a8a;">${item.pair}</span>
                  <span style="background: #e0e7ff; color: #3730a3; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 12px;">
                    Support Clé : ${item.supportAlert} | Résistance : ${item.resistanceAlert}
                  </span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="btn btn-secondary btn-sm copy-alert-snippet-btn" data-pair="${item.pair}" style="font-size: 11px; padding: 4px 10px;">
                    📋 ${isFr ? 'Copier Pitch Client' : 'Copy Sales Angle'}
                  </button>
                  <button class="btn btn-primary btn-sm open-email-templates-btn" data-pair="${item.pair}" style="font-size: 11px; padding: 4px 10px;">
                    ✉️ ${isFr ? 'Générer l\'Email' : 'Open in Email'}
                  </button>
                </div>
              </div>

              <!-- Triggers & Correlations -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px;">
                  <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                    ${isFr ? 'Corrélation Matières Premières' : 'Commodity Correlation'}
                  </div>
                  <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-top: 2px;">
                    🛢️ ${item.correlCommodity}
                  </div>
                </div>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px;">
                  <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                    ${isFr ? 'Facteur Taux & Rendement' : 'Yield Spread Factor'}
                  </div>
                  <div style="font-size: 11px; font-weight: 600; color: #1e293b; margin-top: 2px;">
                    📈 ${item.correlYield}
                  </div>
                </div>
              </div>

              <!-- Context & Sales Pitch -->
              <div style="background: #ffffff; border-radius: 6px; padding: 10px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 6px;">
                <div style="font-size: 11px; color: #334155; line-height: 1.4;">
                  <strong>${isFr ? 'Déclencheur Marché :' : 'Market Catalyst:'}</strong> ${isFr ? item.triggerNoticeFr : item.triggerNoticeEn}
                </div>
                <div style="font-size: 11px; color: #166534; font-weight: 600; line-height: 1.4; background: #f0fdf4; padding: 6px 8px; border-radius: 4px; border-left: 3px solid #16a34a;">
                  <strong>💡 ${isFr ? 'Angle Commercial Recommandé :' : 'Recommended Commercial Action:'}</strong> ${isFr ? item.salesAngleFr : item.salesAngleEn}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderCommoditiesView() {
    const isFr = currentLang === 'fr';

    return `
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1e3a8a;">
              ${isFr ? '🛢️ Radar Matières Premières & Taux Souverains' : '🛢️ Commodities & Sovereign Yield Radar'}
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Mesure des catalyseurs macroéconomiques exogènes (énergie, taux US, spreads obligataires européens).' : 'Tracking exogenous macro drivers (crude oil benchmarks, US yields, European sovereign risk spreads).'}
            </p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
          ${MACRO_BENCHMARKS.map(item => `
            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #1e293b;">${item.name}</h4>
                  <span style="font-size: 10px; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">${item.ticker}</span>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 16px; font-weight: 800; color: #1e3a8a; font-family: 'JetBrains Mono', monospace;">
                    ${item.benchmark} <span style="font-size: 10px; color: #64748b; font-weight: 600;">${item.unit}</span>
                  </div>
                  <div style="font-size: 10px; font-weight: 700; color: ${item.change1D.startsWith('+') ? '#16a34a' : '#dc2626'}; font-family: 'JetBrains Mono', monospace;">
                    1J: ${item.change1D} | 1S: ${item.change1W}
                  </div>
                </div>
              </div>

              <div style="background: #f8fafc; border-radius: 6px; padding: 8px 10px; font-size: 11px; color: #334155; line-height: 1.4; border-left: 3px solid #3b82f6;">
                <strong>${isFr ? 'Impact direct sur les devises :' : 'Direct FX Impact:'}</strong><br>
                ${isFr ? item.impactFr : item.impactEn}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ───────────────────────── POINT 1: SIMULATEUR FX FORWARDS & ROI ─────────────────────────
  function renderSimulatorView() {
    const isFr = currentLang === 'fr';
    const pair = TRACKED_PAIRS.find(p => (p.base + p.quote) === simState.pair) || TRACKED_PAIRS[0];
    const quoteData = cachedQuotes ? cachedQuotes.find(q => q.base === pair.base && q.quote === pair.quote) : null;
    const currentSpot = simState.customRate || (quoteData && quoteData.rateVal ? quoteData.rateVal : 1.1203);
    const vol = simState.volume || 250000;

    // Assumptions for 6-month scenario:
    // Adverse move (+2.5% adverse variation depending on buyer or seller)
    // Favorable move (+2.5% favorable variation)
    const isBuyForeign = simState.direction === 'buy_foreign';
    // If buying foreign (importateur): paying more euros if pair drops (for EUR/USD) or foreign rises
    // Cost in EUR at current spot
    const costSpotEUR = vol / currentSpot;
    // Scenario without hedging if market moves against client by 3.2%
    const adverseRate = isBuyForeign ? currentSpot * 0.968 : currentSpot * 1.032;
    const costAdverseEUR = vol / adverseRate;
    const riskDiffEUR = Math.abs(costAdverseEUR - costSpotEUR);

    // Forward locked cost (assuming small forward point adjustment approx 0.2%)
    const forwardRate = currentSpot * 0.998;
    const forwardCostEUR = vol / forwardRate;
    const guaranteedSavings = Math.abs(costAdverseEUR - forwardCostEUR);

    return `
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1e3a8a;">
              ${isFr ? '🧮 Simulateur de Couverture de Change & ROI Client (FX Forwards)' : '🧮 FX Forward Hedging Simulator & Client ROI'}
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Chiffrez immédiatement les économies et la protection de marge budgétaire pour vos rendez-vous et vos emails prospects.' : 'Instantly quantify margin protection and budget certainty for sales meetings and outreach.'}
            </p>
          </div>
          <button id="copy-sim-pitch-btn" class="btn btn-secondary btn-sm" style="font-size: 11px; padding: 6px 12px;">
            📋 ${isFr ? 'Copier le Pitch Chiffré pour Email' : 'Copy Pitch Snippet for Email'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px;">
          <!-- Controls Panel -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">
                ${isFr ? 'Paire de devises exposée :' : 'Currency Pair Exposure:'}
              </label>
              <select id="sim-pair-select" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">
                ${TRACKED_PAIRS.map(p => `
                  <option value="${p.base + p.quote}" ${(p.base + p.quote) === simState.pair ? 'selected' : ''}>
                    ${p.flag} ${p.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">
                ${isFr ? 'Profil commercial de l\'entreprise :' : 'Corporate Trade Profile:'}
              </label>
              <select id="sim-direction-select" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">
                <option value="buy_foreign" ${simState.direction === 'buy_foreign' ? 'selected' : ''}>
                  ${isFr ? `Importateur (Règlements fournisseurs en ${pair.quote})` : `Importer (Supplier Payables in ${pair.quote})`}
                </option>
                <option value="sell_foreign" ${simState.direction === 'sell_foreign' ? 'selected' : ''}>
                  ${isFr ? `Exportateur (Encaissements clients en ${pair.quote})` : `Exporter (Client Receivables in ${pair.quote})`}
                </option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">
                ${isFr ? `Volume commercial à couvrir (${pair.quote}) :` : `Trade Volume to Hedge (${pair.quote}):`}
              </label>
              <input type="number" id="sim-volume-input" value="${vol}" step="10000" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 13px; font-family: 'JetBrains Mono', monospace; font-weight: 700;">
            </div>

            <div>
              <label style="display: block; font-size: 11px; font-weight: 700; color: #334155; margin-bottom: 4px;">
                ${isFr ? 'Horizon de couverture (Échéance) :' : 'Hedging Horizon (Maturity):'}
              </label>
              <select id="sim-horizon-select" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 600;">
                <option value="3" ${simState.horizon === 3 ? 'selected' : ''}>3 mois (Trimestre T4)</option>
                <option value="6" ${simState.horizon === 6 ? 'selected' : ''}>6 mois (Semestre T4-T1)</option>
                <option value="12" ${simState.horizon === 12 ? 'selected' : ''}>12 mois (Budget Annuel)</option>
              </select>
            </div>

            <div style="background: #eff6ff; border-radius: 6px; padding: 10px; font-size: 11px; color: #1e40af; border: 1px solid #bfdbfe;">
              <strong>${isFr ? 'Cours spot de référence :' : 'Benchmark Spot Rate:'}</strong> ${currentSpot.toFixed(4)}<br>
              <span style="font-size: 10px; color: #64748b;">${isFr ? 'Synchronisé en direct avec les marchés interbancaires.' : 'Live synchronized with interbank feeds.'}</span>
            </div>
          </div>

          <!-- Results & ROI Dashboard -->
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <!-- Big ROI Cards -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  ${isFr ? 'Budget au Cours Spot' : 'Budget at Spot'}
                </div>
                <div style="font-size: 20px; font-weight: 800; color: #1e3a8a; font-family: 'JetBrains Mono', monospace; margin: 6px 0;">
                  ${Math.round(costSpotEUR).toLocaleString()} €
                </div>
                <div style="font-size: 10.5px; color: #64748b;">
                  ${isFr ? 'Cours spot : ' + currentSpot.toFixed(4) : 'Spot: ' + currentSpot.toFixed(4)}
                </div>
              </div>

              <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #991b1b; text-transform: uppercase;">
                  ${isFr ? 'Risque Dérive Marché (-3,2%)' : 'Adverse Shift (+3.2% Cost)'}
                </div>
                <div style="font-size: 20px; font-weight: 800; color: #dc2626; font-family: 'JetBrains Mono', monospace; margin: 6px 0;">
                  + ${Math.round(riskDiffEUR).toLocaleString()} €
                </div>
                <div style="font-size: 10.5px; color: #b91c1c;">
                  ${isFr ? 'Surcoût budgétaire non couvert' : 'Unhedged margin erosion'}
                </div>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase;">
                  ${isFr ? 'Marge Sécurisée via Forward' : 'Protected Margin via Forward'}
                </div>
                <div style="font-size: 20px; font-weight: 800; color: #16a34a; font-family: 'JetBrains Mono', monospace; margin: 6px 0;">
                  ${Math.round(guaranteedSavings).toLocaleString()} €
                </div>
                <div style="font-size: 10.5px; color: #15803d; font-weight: 600;">
                  ${isFr ? 'Budget 100% garanti Revolut' : '100% budget predictability'}
                </div>
              </div>
            </div>

            <!-- Detailed Explanation Box -->
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px;">
              <h4 style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #1e3a8a;">
                💡 ${isFr ? 'Synthèse Commerciale & Formulation Prête à l\'Emploi :' : 'Commercial Pitch Ready to Send:'}
              </h4>
              <div id="sim-pitch-text" style="font-size: 12px; line-height: 1.6; color: #334155; background: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                ${isFr ? `
                  « En verrouillant dès aujourd'hui votre cours ${pair.name} pour vos engagements de <strong>${vol.toLocaleString()} ${pair.quote}</strong>, vous éliminez tout risque de dérive sur vos marges d'exploitation du T4 / T1. Une fluctuation adverse de seulement 3,2 % sur le cross représenterait un surcoût direct de <strong>${Math.round(riskDiffEUR).toLocaleString()} €</strong> sur votre compte de résultat. Notre contrat FX Forward flexible vous permet de figer votre cours plancher tout en conservant une souplesse de tirage au fil de vos besoins opérationnels. »
                ` : `
                  "By securing your ${pair.name} conversion today for your upcoming commitments of <strong>${vol.toLocaleString()} ${pair.quote}</strong>, you eliminate margin volatility across Q4 / Q1. An adverse shift of just 3.2% would add an unhedged cost burden of <strong>${Math.round(riskDiffEUR).toLocaleString()} €</strong> directly impacting your bottom-line. Revolut Business FX Forwards guarantee complete budget certainty while offering drawdown flexibility as cash flows require."
                `}
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn btn-primary open-email-templates-btn" style="flex: 1; padding: 10px; font-size: 12px; font-weight: 700;">
                ✉️ ${isFr ? 'Insérer ce scénario dans un Email Commercial →' : 'Insert this Scenario into Sales Email →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ───────────────────────── POINT 4: CALENDRIER ÉCONOMIQUE INTERACTIF ─────────────────────────
  async function loadCalendarEvents() {
    if (cachedCalendarEvents) return cachedCalendarEvents;
    const M = window.MarketData;
    if (!M) return [];
    try {
      const all = await M.getCalendar();
      cachedCalendarEvents = all || [];
      return cachedCalendarEvents;
    } catch (e) {
      console.warn('Calendar loading error:', e);
      return [];
    }
  }

  function renderCalendarView() {
    const isFr = currentLang === 'fr';
    const events = cachedCalendarEvents || [];

    return `
      <div style="background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #1e3a8a;">
              ${isFr ? '📅 Calendrier Économique Interactif & Filtre par Devise' : '📅 Interactive Economic Calendar & Currency Filter'}
            </h3>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Préparez votre prospection commerciale en identifiant les annonces à fort impact (BCE, Fed, BNS, NBP, CPI, NFP).' : 'Prepare weekly sales outreach by pinpointing high-impact risk catalysts (ECB, Fed, SNB, NBP, CPI, NFP).'}
            </p>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <select id="cal-impact-filter" style="padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600;">
              <option value="ALL">${isFr ? 'Tous les impacts' : 'All Impacts'}</option>
              <option value="High" selected>${isFr ? 'Impact Élevé Uniquement (High)' : 'High Impact Only'}</option>
              <option value="Medium">${isFr ? 'Impact Moyen (Medium)' : 'Medium Impact'}</option>
            </select>
            <select id="cal-ccy-filter" style="padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 600;">
              <option value="ALL">${isFr ? 'Toutes les devises' : 'All Currencies'}</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="USD">🇺🇸 USD</option>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="CHF">🇨🇭 CHF</option>
              <option value="JPY">🇯🇵 JPY</option>
            </select>
          </div>
        </div>

        <!-- Events List -->
        <div id="cal-events-container" style="display: flex; flex-direction: column; gap: 8px;">
          ${events.length === 0 ? `
            <div style="padding: 30px; text-align: center; color: #64748b; font-size: 13px;">
              ⏳ ${isFr ? 'Chargement du calendrier ForexFactory en cours...' : 'Loading ForexFactory economic calendar...'}
            </div>
          ` : events.map(e => `
            <div class="cal-event-row" data-impact="${e.impact}" data-country="${e.country}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 6px; background: ${e.impact === 'High' ? '#fef2f2' : '#fffbeb'}; border-left: 4px solid ${e.impact === 'High' ? '#dc2626' : '#f59e0b'}; border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="text-align: center; width: 50px;">
                  <div style="font-size: 12px; font-weight: 800; color: #1e3a8a;">${e.dateStr}</div>
                  <div style="font-size: 9.5px; color: #64748b; font-weight: 600;">${e.time}</div>
                </div>
                <div style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 800; color: #1e293b;">
                  ${e.country}
                </div>
                <div>
                  <div style="font-size: 12.5px; font-weight: 700; color: #1e293b;">${e.title}</div>
                  <div style="font-size: 10px; color: #64748b;">
                    ${isFr ? 'Impact attendu : ' + (e.impact === 'High' ? 'Élevé (Forte volatilité potentielle)' : 'Moyen') : 'Expected impact: ' + e.impact}
                  </div>
                </div>
              </div>
              <button class="btn btn-outline btn-sm copy-event-alert-btn" data-event="${e.title}" data-country="${e.country}" data-date="${e.dateStr} à ${e.time}" style="font-size: 11px; padding: 4px 10px;">
                ⚡ ${isFr ? 'Créer Alerte Client' : 'Create Client Alert'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderPage() {
    const isFr = currentLang === 'fr';

    return `
      <div class="market-radar-container" style="max-width: 1400px; margin: 0 auto; padding: 20px;">
        <!-- Top Toolbar & Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; background: #ffffff; padding: 14px 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div>
            <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #1e3a8a; letter-spacing: 0.5px;">
              ${isFr ? 'MATRICE DE MARCHÉ & RADAR TECHNIQUE' : 'MARKET MATRIX & TECHNICAL RADAR'}
            </h1>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">
              ${isFr ? 'Surveillance multi-devises en direct, simulateur FX Forwards, calendrier interactif et déclencheurs de couverture.' : 'Live multi-currency monitoring, FX Forwards simulator, interactive calendar, and hedging triggers.'}
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <!-- Tab Switcher -->
            <div class="btn-group" style="display: flex; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; flex-wrap: wrap;">
              <button class="radar-tab-btn ${activeTab === 'heatmap' ? 'active' : ''}" data-tab="heatmap" style="padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; background: ${activeTab === 'heatmap' ? '#1e3a8a' : '#ffffff'}; color: ${activeTab === 'heatmap' ? '#ffffff' : '#475569'};">
                🌡️ Heatmap
              </button>
              <button class="radar-tab-btn ${activeTab === 'simulator' ? 'active' : ''}" data-tab="simulator" style="padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; background: ${activeTab === 'simulator' ? '#1e3a8a' : '#ffffff'}; color: ${activeTab === 'simulator' ? '#ffffff' : '#475569'}; border-left: 1px solid #cbd5e1;">
                🧮 ${isFr ? 'Simulateur Forwards & ROI' : 'Forwards Simulator & ROI'}
              </button>
              <button class="radar-tab-btn ${activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar" style="padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; background: ${activeTab === 'calendar' ? '#1e3a8a' : '#ffffff'}; color: ${activeTab === 'calendar' ? '#ffffff' : '#475569'}; border-left: 1px solid #cbd5e1;">
                📅 ${isFr ? 'Calendrier Éco' : 'Eco Calendar'}
              </button>
              <button class="radar-tab-btn ${activeTab === 'radar' ? 'active' : ''}" data-tab="radar" style="padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; background: ${activeTab === 'radar' ? '#1e3a8a' : '#ffffff'}; color: ${activeTab === 'radar' ? '#ffffff' : '#475569'}; border-left: 1px solid #cbd5e1;">
                🎯 ${isFr ? 'Radar Seuils' : 'Thresholds'}
              </button>
              <button class="radar-tab-btn ${activeTab === 'commodities' ? 'active' : ''}" data-tab="commodities" style="padding: 6px 12px; font-size: 11.5px; font-weight: 700; cursor: pointer; border: none; background: ${activeTab === 'commodities' ? '#1e3a8a' : '#ffffff'}; color: ${activeTab === 'commodities' ? '#ffffff' : '#475569'}; border-left: 1px solid #cbd5e1;">
                🛢️ ${isFr ? 'Pétrole & Taux' : 'Oil & Yields'}
              </button>
            </div>

            <!-- Language switch -->
            <div style="display: flex; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
              <button id="radar-lang-fr" style="padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; background: ${isFr ? '#2563eb' : '#ffffff'}; color: ${isFr ? '#ffffff' : '#475569'};">FR</button>
              <button id="radar-lang-en" style="padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; background: ${!isFr ? '#2563eb' : '#ffffff'}; color: ${!isFr ? '#ffffff' : '#475569'}; border-left: 1px solid #cbd5e1;">EN</button>
            </div>
          </div>
        </div>

        <!-- Tab Body Content -->
        <div id="radar-tab-content">
          ${activeTab === 'heatmap' ? renderHeatmapView() :
            activeTab === 'simulator' ? renderSimulatorView() :
            activeTab === 'calendar' ? renderCalendarView() :
            activeTab === 'radar' ? renderRadarAlertsView() :
            renderCommoditiesView()}
        </div>
      </div>
    `;
  }

  function initPage() {
    Promise.allSettled([loadMarketRates(), loadCalendarEvents()]).then(() => {
      const area = document.getElementById('content-area');
      if (area && area.querySelector('.market-radar-container')) {
        area.innerHTML = renderPage();
        bindEvents();
      }
    });
    bindEvents();
  }

  function bindEvents() {
    // Tab switching
    document.querySelectorAll('.radar-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeTab = e.currentTarget.dataset.tab;
        const area = document.getElementById('content-area');
        if (area) {
          area.innerHTML = renderPage();
          bindEvents();
        }
      });
    });

    // Language switching
    document.getElementById('radar-lang-fr')?.addEventListener('click', () => {
      currentLang = 'fr';
      const area = document.getElementById('content-area');
      if (area) {
        area.innerHTML = renderPage();
        bindEvents();
      }
    });

    document.getElementById('radar-lang-en')?.addEventListener('click', () => {
      currentLang = 'en';
      const area = document.getElementById('content-area');
      if (area) {
        area.innerHTML = renderPage();
        bindEvents();
      }
    });

    // Refresh market rates
    document.getElementById('refresh-radar-btn')?.addEventListener('click', () => {
      App.showToast(currentLang === 'fr' ? 'Actualisation de la matrice en cours...' : 'Refreshing currency matrix...', 'info', 2000);
      loadMarketRates().then(() => {
        const area = document.getElementById('content-area');
        if (area) {
          area.innerHTML = renderPage();
          bindEvents();
          App.showToast(currentLang === 'fr' ? 'Matrice actualisée avec succès !' : 'Matrix updated successfully!', 'success');
        }
      });
    });

    // Simulator events
    document.getElementById('sim-pair-select')?.addEventListener('change', (e) => {
      simState.pair = e.target.value;
      const area = document.getElementById('content-area');
      if (area) { area.innerHTML = renderPage(); bindEvents(); }
    });

    document.getElementById('sim-direction-select')?.addEventListener('change', (e) => {
      simState.direction = e.target.value;
      const area = document.getElementById('content-area');
      if (area) { area.innerHTML = renderPage(); bindEvents(); }
    });

    document.getElementById('sim-volume-input')?.addEventListener('input', (e) => {
      simState.volume = parseFloat(e.target.value) || 0;
      const area = document.getElementById('content-area');
      if (area) { area.innerHTML = renderPage(); bindEvents(); }
    });

    document.getElementById('sim-horizon-select')?.addEventListener('change', (e) => {
      simState.horizon = parseInt(e.target.value, 10);
      const area = document.getElementById('content-area');
      if (area) { area.innerHTML = renderPage(); bindEvents(); }
    });

    document.getElementById('copy-sim-pitch-btn')?.addEventListener('click', () => {
      const text = document.getElementById('sim-pitch-text')?.innerText || '';
      navigator.clipboard.writeText(text).then(() => {
        App.showToast(currentLang === 'fr' ? 'Argumentaire chiffré copié !' : 'Calculated pitch copied!', 'success');
      });
    });

    // Calendar filters
    const filterCal = () => {
      const imp = document.getElementById('cal-impact-filter')?.value || 'ALL';
      const ccy = document.getElementById('cal-ccy-filter')?.value || 'ALL';
      document.querySelectorAll('.cal-event-row').forEach(row => {
        const rImp = row.dataset.impact;
        const rCcy = row.dataset.country;
        const matchImp = imp === 'ALL' || rImp === imp;
        const matchCcy = ccy === 'ALL' || rCcy === ccy;
        row.style.display = matchImp && matchCcy ? 'flex' : 'none';
      });
    };
    document.getElementById('cal-impact-filter')?.addEventListener('change', filterCal);
    document.getElementById('cal-ccy-filter')?.addEventListener('change', filterCal);

    document.querySelectorAll('.copy-event-alert-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ev = e.currentTarget.dataset.event;
        const ccy = e.currentTarget.dataset.country;
        const dt = e.currentTarget.dataset.date;
        const isFr = currentLang === 'fr';
        const text = isFr
          ? `[Flash Alerte Marché — ${ccy}]\nÉvènement clé à surveiller : ${ev}\nDate & Heure : ${dt}\nConséquence trésorerie : Risque d'accélération de la volatilité sur les flux de change. Contactez-nous pour modéliser une couverture préalable via Revolut Business.`
          : `[Market Risk Flash — ${ccy}]\nKey catalyst to watch: ${ev}\nDate & Time: ${dt}\nTreasury implication: Heightened FX volatility expected. Connect with Revolut Business to model proactive hedging lines.`;
        navigator.clipboard.writeText(text).then(() => {
          App.showToast(isFr ? `Alerte pour ${ev} copiée !` : `Alert for ${ev} copied!`, 'success');
        });
      });
    });

    // Quick jump to Pair Focus from Heatmap
    document.querySelectorAll('.open-pair-focus-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pair = e.currentTarget.dataset.pair;
        if (window.PairFocus) {
          window.PairFocus.selectPair(pair);
        }
        App.navigateTo('pair-focus');
      });
    });

    // Quick jump to Email Templates
    document.querySelectorAll('.open-email-templates-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        App.navigateTo('email-templates');
      });
    });

    // Copy alert snippet to clipboard
    document.querySelectorAll('.copy-alert-snippet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pair = e.currentTarget.dataset.pair;
        const item = TECHNICAL_THRESHOLDS.find(t => t.pair === pair);
        if (!item) return;

        const isFr = currentLang === 'fr';
        const text = isFr
          ? `[Alerte Déclencheur FX — ${item.pair}]\nNiveaux clés : Support ${item.supportAlert} | Résistance ${item.resistanceAlert}\nCatalyseur : ${item.triggerNoticeFr}\nAction commerciale recommandée : ${item.salesAngleFr}\nSolution : FX Forwards Revolut Business pour verrouiller les cours jusqu'à 12 mois.`
          : `[FX Trigger Alert — ${item.pair}]\nKey levels: Support ${item.supportAlert} | Resistance ${item.resistanceAlert}\nCatalyst: ${item.triggerNoticeEn}\nRecommended commercial action: ${item.salesAngleEn}\nSolution: Revolut Business FX Forwards to lock exchange rates up to 12 months.`;

        navigator.clipboard.writeText(text).then(() => {
          App.showToast(isFr ? `Pitch commercial pour ${pair} copié !` : `Sales angle for ${pair} copied!`, 'success');
        });
      });
    });
  }

  return {
    renderPage,
    initPage,
    loadMarketRates
  };
})();
