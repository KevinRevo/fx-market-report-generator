/**
 * Standalone Automated News Scraper for FX Market Report Generator
 * Fetches real-time RSS feeds across French and English institutional sources,
 * enforces strict date freshness (<= 14 days) and FX/Macro relevance filtering,
 * normalizes dates, pairs, categories, and saves to data/live-press-review.json.
 */

const fs = require('fs');
const path = require('path');

const MAX_AGE_DAYS = 14;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 3600 * 1000;

const PRESS_FEEDS = [
  // French Trusted FX & Macro Sources
  { id: 'investing_fr_fx', name: 'Investing.com (FR)', lang: 'fr', defCat: 'FX & Devises', strictFilter: false, url: 'https://fr.investing.com/rss/news_1.rss' },
  { id: 'investing_fr_ana', name: 'Investing.com (FR)', lang: 'fr', defCat: 'Macroéconomie', strictFilter: true, url: 'https://fr.investing.com/rss/market_overview.rss' },
  { id: 'investing_fr_comm', name: 'Investing.com (FR)', lang: 'fr', defCat: 'Énergie & Pétrole', strictFilter: true, url: 'https://fr.investing.com/rss/news_11.rss' },
  { id: 'investing_fr_eco', name: 'Investing.com (FR)', lang: 'fr', defCat: 'Macroéconomie', strictFilter: true, url: 'https://fr.investing.com/rss/news_14.rss' },
  { id: 'bfm_eco', name: 'BFM Business', lang: 'fr', defCat: 'Macroéconomie', strictFilter: true, url: 'https://www.bfmtv.com/rss/economie/' },
  { id: 'lefigaro_eco', name: 'Le Figaro Économie', lang: 'fr', defCat: 'Macroéconomie', strictFilter: true, url: 'https://www.lefigaro.fr/rss/figaro_economie.xml' },
  { id: 'lemonde_eco', name: 'Le Monde (Éco)', lang: 'fr', defCat: 'Macroéconomie', strictFilter: true, url: 'https://www.lemonde.fr/economie/rss_full.xml' },

  // English Trusted FX & Macro Sources
  { id: 'fxstreet', name: 'FXStreet', lang: 'en', defCat: 'FX & Devises', strictFilter: false, url: 'https://www.fxstreet.com/rss/news' },
  { id: 'ing', name: 'ING Think', lang: 'en', defCat: 'Banques Centrales', strictFilter: true, url: 'https://think.ing.com/rss' },
  { id: 'investing_en', name: 'Investing.com', lang: 'en', defCat: 'FX & Devises', strictFilter: false, url: 'https://www.investing.com/rss/news_1.rss' },
  { id: 'ecb_press', name: 'BCE / ECB', lang: 'en', defCat: 'Banques Centrales', strictFilter: false, url: 'https://www.ecb.europa.eu/rss/press.html' },
  { id: 'fed_press', name: 'Federal Reserve', lang: 'en', defCat: 'Banques Centrales', strictFilter: false, url: 'https://www.federalreserve.gov/feeds/press_all.xml' },
  { id: 'theguardian_biz', name: 'The Guardian (Business)', lang: 'en', defCat: 'Macroéconomie', strictFilter: true, url: 'https://www.theguardian.com/business/rss' },
  { id: 'sky_biz', name: 'Sky News (Business)', lang: 'en', defCat: 'Macroéconomie', strictFilter: true, url: 'https://feeds.skynews.com/feeds/rss/business.xml' }
];

function cleanHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ')
            .trim();
}

function isRelevantFxMacro(title, desc, strictFilter) {
  const text = ((title || '') + ' ' + (desc || '')).toLowerCase();

  // Hard blacklist for off-topic consumer/crypto/political fluff
  const blacklist = /\b(bitcoin|ethereum|solana|dogecoin|xrp|memecoin|altcoin|crypto|nft|shiba|cardano|migrants?|rwanda|présidentielle 2027|football|ligue 1|rugby|tennis|cinema|cinéma|netflix|spotify|assassinat|procès|meurtre|explosion|journaliste|immobilier locatif|assurance-vie|livret a|retraite par|smic|allocation|grève sncf|airbus|boeing|iphone|nvidia|apple|tesla|amazon|google|meta|microsoft|open ?ai|chatgpt|casino|kretinsky)\b/i;
  const hasExplicitFxOrCentralBank = /\b(eur\/usd|eurusd|eur\/chf|eurchf|eur\/gbp|eurgbp|eur\/pln|eurpln|usd\/pln|usdpln|usd\/huf|usdhuf|czk\/usd|czkusd|chf\/usd|chfusd|gbp\/usd|gbpusd|forex|taux de change|devises?|exchange rate|dxy|dollar index|fed\b|fomc|bce\b|ecb\b|bns\b|snb\b|boe\b|bank of england|banque d'angleterre|nbp\b|mnb\b|cnb\b|powell|lagarde|politique monétaire|monetary policy|taux directeurs?|interest rate)\b/i.test(text);

  if (blacklist.test(text) && !hasExplicitFxOrCentralBank) {
    return false;
  }

  if (!strictFilter) return true;

  // Strict relevance keywords for general economy/business/research feeds
  const fxMacroRegex = /\b(euro|dollar|usd|eur|chf|gbp|pln|huf|czk|zloty|forint|koruna|couronne tchèque|franc suisse|livre sterling|sterling|yen|jpy|devise|devises|forex|fx|taux de change|exchange rate|fed|fomc|bce|ecb|bns|snb|boe|nbp|mnb|cnb|banque centrale|central bank|powell|lagarde|taux directeurs?|interest rate|rate cut|rate hike|inflation|cpi|ipch|hicp|pce|pib|gdp|pmi|emploi américain|payrolls|nfp|retail sales|ventes au détail|obligataire|treasury|yield|rendement|spread|déficit|dette souveraine|sovereign debt|brent|wti|pétrole|crude oil|opec|opep|tarifs?|droits de douane|trade war|geopolitic|géopolitique)\b/i;
  return fxMacroRegex.test(text);
}

function detectCategory(title, desc, defCat) {
  const text = (title + ' ' + (desc || '')).toLowerCase();
  if (/\b(oil|pétrole|petrole|brent|wti|crude|opec|opep|gaz|gas|hormuz|énergie|energy)\b/.test(text)) return 'Énergie & Pétrole';
  if (/\b(fed|bce|ecb|powell|lagarde|taux directeurs?|interest rates?|fomc|bns|snb|boe|bank of england|banque d'angleterre|nbp|mnb|cnb|rate hike|rate cut|monetary policy|politique monétaire|banque centrale|central bank)\b/.test(text)) return 'Banques Centrales';
  if (/\b(war|guerre|iran|israel|ukraine|russie|russia|china|chine|taiwan|sanctions?|trump|conflit|otan|nato|red sea|mer rouge|houthi|geopolitic|géopolitique|tariffs?|droits de douane)\b/.test(text)) return 'Géopolitique';
  if (/\b(dollar|euro|forex|devises?|taux de change|exchange rate|dxy|pound|sterling|yen|franc suisse|zloty|forint|koruna|fx|gbp|chf|jpy|eur\/usd|currencies)\b/.test(text)) return 'FX & Devises';
  return defCat || 'Macroéconomie';
}

function detectPairs(title, desc) {
  const text = ((title || '') + ' ' + (desc || '')).toLowerCase();
  const pairs = new Set();

  if (/eur\/usd|eurusd|euro-dollar|euro dollar|\beuro\b.*\bdollar\b|\bdollar\b.*\beuro\b/.test(text)) pairs.add('EUR/USD');
  if (/eur\/chf|eurchf|franc suisse|swiss franc|\bbns\b|\bsnb\b/.test(text)) pairs.add('EUR/CHF');
  if (/chf\/usd|chfusd|usd\/chf|usdchf/.test(text)) {
    pairs.add('CHF/USD');
    pairs.add('EUR/CHF');
  }
  if (/\bpln\b|zloty|złoty|\bnbp\b|pologne|poland|polish/.test(text)) {
    pairs.add('EUR/PLN');
    pairs.add('USD/PLN');
  }
  if (/eur\/pln|eurpln/.test(text)) pairs.add('EUR/PLN');
  if (/usd\/pln|usdpln/.test(text)) pairs.add('USD/PLN');
  if (/\bhuf\b|forint|\bmnb\b|hongrie|hungary|hungarian|usd\/huf|usdhuf/.test(text)) pairs.add('USD/HUF');
  if (/\bczk\b|koruna|couronne tchèque|\bcnb\b|république tchèque|czech|czk\/usd|czkusd/.test(text)) pairs.add('CZK/USD');
  if (/\bgbp\b|pound|sterling|\bboe\b|bank of england|banque d'angleterre|livre sterling|eur\/gbp|gbp\/usd/.test(text)) {
    pairs.add('EUR/GBP');
    pairs.add('GBP/USD');
  }
  if (/\bbce\b|\becb\b|lagarde|zone euro|eurozone|euro area/.test(text)) {
    pairs.add('EUR/USD');
    pairs.add('EUR/CHF');
  }
  if (/\bfed\b|powell|fomc|dollar|greenback|billet vert|treasury|\bdxy\b|\bnfp\b|payrolls/.test(text)) {
    pairs.add('EUR/USD');
    pairs.add('CHF/USD');
  }
  if (pairs.size === 0) {
    pairs.add('EUR/USD');
  }
  return Array.from(pairs);
}

function parisIsoDate(epochMs) {
  return new Date(epochMs).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
}

function parisFullDateStr(epochMs) {
  return new Date(epochMs).toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function timeAgo(date) {
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return "à l'instant";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `il y a ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays} j`;
}

function detectKeyDossier(title, desc, pubTime, now) {
  const text = ((title || '') + ' ' + (desc || '')).toLowerCase();
  const isStructuralTopic = /dette souveraine|sovereign debt|divergence|structural|budget|déficit|fomc|bce|ecb|rate cut|rate hike|tariffs|droits de douane|inflation|payrolls|gdp|pib/.test(text);
  const isOlder = (now - pubTime) > (12 * 3600 * 1000);
  return isStructuralTopic || isOlder;
}

async function runScraper() {
  console.log('Starting live news scraping across all sources...');
  const now = Date.now();
  const todayIso = parisIsoDate(now);
  const articles = [];
  const seenTitles = new Set();

  await Promise.allSettled(PRESS_FEEDS.map(async (feed) => {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(7000)
      });
      if (!res.ok) {
        console.warn(`Feed HTTP ${res.status} (${feed.name})`);
        return;
      }

      const xml = await res.text();
      const grab = (item, tag) => {
        const m = item.match(new RegExp('<' + tag + '>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/' + tag + '>'));
        return m ? m[1].trim() : '';
      };

      const items = xml.match(/<item[\s\S]*?>[\s\S]*?<\/item>/g) || [];
      items.slice(0, 25).forEach(it => {
        let title = cleanHtml(grab(it, 'title'));
        let link = grab(it, 'link').replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim();
        let desc = cleanHtml(grab(it, 'description'));
        let pubDateStr = grab(it, 'pubDate') || grab(it, 'dc:date') || grab(it, 'published') || grab(it, 'updated');

        if (!title || title.length < 15 || !link || !link.startsWith('http')) return;
        if (title.startsWith('- ')) return;

        // Parse date strictly — reject undated or >14 days old or >24h future
        if (!pubDateStr) return;
        let normalizedDateStr = pubDateStr.trim();
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(normalizedDateStr)) {
          normalizedDateStr = normalizedDateStr.replace(' ', 'T') + 'Z';
        }
        const d = new Date(normalizedDateStr);
        if (isNaN(d.getTime())) return;
        const pubTime = d.getTime();
        if (now - pubTime > MAX_AGE_MS) return;
        if (pubTime - now > 24 * 3600 * 1000) return;

        // Strict FX/Macro relevance filter
        if (!isRelevantFxMacro(title, desc, feed.strictFilter)) return;

        const normTitle = title.toLowerCase().slice(0, 55);
        if (seenTitles.has(normTitle)) return;
        seenTitles.add(normTitle);

        const artIso = parisIsoDate(pubTime);
        const artDateStr = parisFullDateStr(pubTime);
        const isToday = (artIso === todayIso);
        const isKey = detectKeyDossier(title, desc, pubTime, now);

        articles.push({
          id: feed.id + '-' + pubTime + '-' + Math.random().toString(36).substr(2, 6),
          title,
          summary: desc ? (desc.length > 200 ? desc.slice(0, 197) + '...' : desc) : '',
          link,
          publisher: feed.name,
          sourceId: feed.id,
          lang: feed.lang,
          category: detectCategory(title, desc, feed.defCat),
          pairs: detectPairs(title, desc),
          isToday,
          isKeyDossier: isKey,
          pubTime,
          isoDate: artIso,
          dateStr: artDateStr,
          timeAgo: timeAgo(d)
        });
      });
    } catch (e) {
      console.warn(`Scrape warning (${feed.name}):`, e.message);
    }
  }));

  // Sort newest first
  articles.sort((a, b) => b.pubTime - a.pubTime);

  const frCount = articles.filter(a => a.lang === 'fr').length;
  const enCount = articles.filter(a => a.lang === 'en').length;
  const todayCount = articles.filter(a => a.isToday).length;
  const keyCount = articles.filter(a => a.isKeyDossier).length;

  const outData = {
    success: true,
    total: articles.length,
    stats: {
      fr: frCount,
      en: enCount,
      today: todayCount,
      keyDossiers: keyCount
    },
    articles,
    timestamp: new Date().toISOString()
  };

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const outPath = path.join(dataDir, 'live-press-review.json');
  fs.writeFileSync(outPath, JSON.stringify(outData, null, 2), 'utf8');

  console.log(`✓ Scraped ${articles.length} verified recent FX/macro articles (${todayCount} from today ${todayIso}, ${frCount} FR, ${enCount} EN).`);
  console.log(`✓ Saved output to ${outPath}`);
}

runScraper();
