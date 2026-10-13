/**
 * Sources — clickable reference links shown at the end of each infographic.
 * Institution links point to official landing pages (stable URLs);
 * "latest news" links are live news queries restricted to the last 2 days,
 * so they always surface recent articles for the report date.
 */
window.Sources = (() => {
  'use strict';

  const news = (q) => `https://news.google.com/search?q=${encodeURIComponent(q + ' when:2d')}`;

  const OFFICIAL = {
    fed: { label: 'Federal Reserve — Press releases', url: 'https://www.federalreserve.gov/newsevents/pressreleases.htm' },
    ecb: { label: 'ECB — Press releases & decisions', url: 'https://www.ecb.europa.eu/press/pr/date/html/index.en.html' },
    ecbfx: { label: 'ECB — Euro reference rates', url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html' },
    snb: { label: 'SNB — Monetary policy decisions', url: 'https://www.snb.ch/en/the-snb/mandates-goals/monetary-policy/decisions' },
    cnb: { label: 'CNB — Monetary policy', url: 'https://www.cnb.cz/en/monetary-policy/' },
    mnb: { label: 'MNB — Monetary policy', url: 'https://www.mnb.hu/en/monetary-policy' },
    nbp: { label: 'NBP — Monetary policy', url: 'https://nbp.pl/en/monetary-policy/' },
    boe: { label: 'BoE — Monetary policy', url: 'https://www.bankofengland.co.uk/monetary-policy' },
    norges: { label: 'Norges Bank — Monetary policy', url: 'https://www.norges-bank.no/en/topics/Monetary-policy/' },
    riksbank: { label: 'Riksbank — Monetary policy', url: 'https://www.riksbank.se/en-gb/monetary-policy/' },
    dnb: { label: 'Danmarks Nationalbank — Monetary policy', url: 'https://www.nationalbanken.dk/en/what-we-do/stable-prices-monetary-and-fx-policy' },
    bnr: { label: 'BNR — Monetary policy', url: 'https://www.bnr.ro/Monetary-Policy-3231.aspx' },
    bls: { label: 'US BLS — CPI & Employment', url: 'https://www.bls.gov/cpi/' },
    eurostat: { label: 'Eurostat — Euro indicators', url: 'https://ec.europa.eu/eurostat/web/euro-indicators' },
    tv: { label: 'TradingView — Major FX rates', url: 'https://www.tradingview.com/markets/currencies/rates-major/' },
    reutersFx: { label: 'Reuters — Currencies', url: 'https://www.reuters.com/markets/currencies/' },
    reutersCom: { label: 'Reuters — Commodities', url: 'https://www.reuters.com/markets/commodities/' },
    ing: { label: 'ING Think — FX research', url: 'https://think.ing.com/' },
    mufg: { label: 'MUFG Global Markets Research', url: 'https://www.mufgresearch.com/' },
    bnp: { label: 'BNP Paribas Economic Research', url: 'https://economic-research.bnpparibas.com/' }
  };

  const CB_BY_CCY = {
    EUR: 'ecb', USD: 'fed', GBP: 'boe', CHF: 'snb', NOK: 'norges', SEK: 'riksbank',
    DKK: 'dnb', RON: 'bnr', CZK: 'cnb', HUF: 'mnb', PLN: 'nbp'
  };
  const DATA_BY_CCY = { USD: 'bls', EUR: 'eurostat' };

  /** [base CB, quote CB, macro data source] for any pair, e.g. 'NOK/SEK' */
  function pairSources(pair) {
    const [base, quote] = String(pair).split('/');
    const a = CB_BY_CCY[base] || 'ecb';
    const b = CB_BY_CCY[quote] || 'fed';
    const d = DATA_BY_CCY[quote] || DATA_BY_CCY[base] || 'ecbfx';
    return [a, b, d];
  }

  function link(l) {
    return `<a href="${l.url}" target="_blank" rel="noopener noreferrer" style="color:#1d4ed8;text-decoration:none;font-weight:600;">${l.label} ↗</a>`;
  }

  function col(title, items) {
    return `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;">
        <div style="font-size:9px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:4px;">${title}</div>
        <ul style="margin:0;padding-left:12px;font-size:8.5px;line-height:1.5;color:#334155;">
          ${items.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>`;
  }

  /** kind: 'daily' | 'pair' ; pair: e.g. 'EUR/CHF' */
  function renderPanel(lang, kind, pair) {
    const fr = lang === 'fr';
    const O = OFFICIAL;
    let c1, c2, c3;

    if (kind === 'daily') {
      c1 = [
        { label: fr ? 'Actu. EUR/USD & dollar (48h)' : 'EUR/USD & dollar news (48h)', url: news('EUR/USD dollar') },
        { label: fr ? 'Actu. pétrole & géopolitique (48h)' : 'Oil & geopolitics news (48h)', url: news('Brent oil Iran Hormuz') },
        { label: fr ? 'Actu. Fed / BCE / BNS (48h)' : 'Fed / ECB / SNB news (48h)', url: news('Fed ECB SNB rates') },
        { label: fr ? 'Actu. zloty, forint, couronne (48h)' : 'Zloty, forint, koruna news (48h)', url: news('zloty forint koruna') }
      ].map(link);
      c2 = [O.fed, O.ecb, O.snb, O.cnb, O.mnb, O.nbp].map(link);
      c3 = [O.tv, O.ecbfx, O.reutersFx, O.reutersCom, O.bls, O.eurostat].map(link);
    } else {
      const [a, b, d] = pairSources(pair);
      c1 = [
        { label: fr ? `Actu. ${pair} (48h)` : `${pair} news (48h)`, url: news(pair + ' forex') },
        { label: fr ? `Prévisions ${pair} des banques` : `${pair} bank forecasts`, url: news(pair + ' forecast ING OR MUFG OR BNP') },
        { label: fr ? 'Actu. banques centrales (48h)' : 'Central bank news (48h)', url: news('central bank rates ' + pair.replace('/', ' ')) }
      ].map(link);
      c2 = [O[a], O[b], O[d]].map(link);
      c3 = [O.tv, O.ecbfx, O.ing, O.mufg, O.bnp, O.reutersFx].map(link);
    }

    return `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        ${col(fr ? 'Articles récents' : 'Latest articles', c1)}
        ${col(fr ? 'Sources officielles' : 'Official sources', c2)}
        ${col(fr ? 'Données & recherche' : 'Data & research', c3)}
      </div>
      <div style="font-size:7.5px;color:#94a3b8;font-style:italic;margin-top:3px;">
        ${fr ? 'Liens cliquables (ouverture dans un nouvel onglet). Les articles récents sont issus d’une recherche d’actualité sur les 48 dernières heures.'
             : 'Clickable links (open in a new tab). Latest articles are a live news search over the past 48 hours.'}
      </div>`;
  }

  return { renderPanel };
})();
