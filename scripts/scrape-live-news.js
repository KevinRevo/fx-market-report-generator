/**
 * Standalone Automated News Scraper for FX Market Report Generator
 * Fetches real-time RSS feeds across English and French institutional sources,
 * normalizes dates, pairs, categories, and saves to data/live-press-review.json.
 * Executed locally or via GitHub Actions on a daily / multi-hour schedule.
 */

const fs = require('fs');
const path = require('path');

const PRESS_FEEDS = [
  // English Trusted Sources
  { id: 'reuters', name: 'Reuters', lang: 'en', defCat: 'FX & Devises', url: 'https://news.google.com/rss/search?q=site:reuters.com+(forex+OR+currency+OR+dollar+OR+%22central+bank%22)+when:3d&hl=en-US&gl=US&ceid=US:en' },
  { id: 'ing', name: 'ING Think', lang: 'en', defCat: 'Banques Centrales', url: 'https://think.ing.com/rss' },
  { id: 'fxempire', name: 'FX Empire', lang: 'en', defCat: 'FX & Devises', url: 'https://news.google.com/rss/search?q=site:fxempire.com+(forex+OR+dollar+OR+eurusd)+when:3d&hl=en-US&gl=US&ceid=US:en' },
  { id: 'theguardian_biz', name: 'The Guardian (Business)', lang: 'en', defCat: 'Macroéconomie', url: 'https://www.theguardian.com/business/rss' },
  { id: 'theguardian_world', name: 'The Guardian (World)', lang: 'en', defCat: 'Géopolitique', url: 'https://www.theguardian.com/world/rss' },
  { id: 'sky_biz', name: 'Sky News (Business)', lang: 'en', defCat: 'Macroéconomie', url: 'https://feeds.skynews.com/feeds/rss/business.xml' },
  { id: 'sky_world', name: 'Sky News (World)', lang: 'en', defCat: 'Géopolitique', url: 'https://feeds.skynews.com/feeds/rss/world.xml' },
  { id: 'investing_en', name: 'Investing.com', lang: 'en', defCat: 'Macroéconomie', url: 'https://www.investing.com/rss/news_1.rss' },
  { id: 'fxstreet', name: 'FXStreet', lang: 'en', defCat: 'FX & Devises', url: 'https://www.fxstreet.com/rss/news' },
  { id: 'usnews', name: 'US News', lang: 'en', defCat: 'Macroéconomie', url: 'https://www.usnews.com/rss/money' },

  // French Trusted Sources
  { id: 'lesechos', name: 'Les Echos', lang: 'fr', defCat: 'FX & Devises', url: 'https://news.google.com/rss/search?q=site:lesechos.fr+(devises+OR+dollar+OR+euro+OR+bce+OR+geopolitique)+when:3d&hl=fr&gl=FR&ceid=FR:fr' },
  { id: 'lemonde_eco', name: 'Le Monde (Éco)', lang: 'fr', defCat: 'Macroéconomie', url: 'https://www.lemonde.fr/economie/rss_full.xml' },
  { id: 'lemonde_inter', name: 'Le Monde (International)', lang: 'fr', defCat: 'Géopolitique', url: 'https://www.lemonde.fr/international/rss_full.xml' },
  { id: 'lefigaro_eco', name: 'Le Figaro Économie', lang: 'fr', defCat: 'Macroéconomie', url: 'https://www.lefigaro.fr/rss/figaro_economie.xml' },
  { id: 'investing_fr', name: 'Investing.com (FR)', lang: 'fr', defCat: 'Macroéconomie', url: 'https://fr.investing.com/rss/news_1.rss' },
  { id: 'bfm_bourse', name: 'BFM Business', lang: 'fr', defCat: 'Macroéconomie', url: 'https://news.google.com/rss/search?q=site:bfmtv.com/economie+(bourse+OR+devises+OR+taux+OR+petrole)+when:3d&hl=fr&gl=FR&ceid=FR:fr' }
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

function detectCategory(title, desc, defCat) {
  const text = (title + ' ' + (desc || '')).toLowerCase();
  if (/oil|pétrole|petrole|brent|wti|crude|opec|opep|gaz|gas|hormuz/.test(text)) return 'Énergie & Pétrole';
  if (/fed\b|bce\b|ecb\b|powell|lagarde|taux directeurs?|interest rates?|fomc|bns|snb|boe|bank of england|nbp|rate hike|rate cut|monetary policy|politique monétaire/.test(text)) return 'Banques Centrales';
  if (/war|guerre|tensions?|iran|israel|moyen-orient|ukraine|russie|russia|china|chine|taiwan|sanctions?|trump|conflit|otan|nato|red sea|mer rouge|houthi|geopolitic|géopolitique/.test(text)) return 'Géopolitique';
  if (/dollar|euro|forex|devises?|taux de change|dxy|pound|yen|franc suisse|zloty|forint|koruna|\bfx\b|gbp|chf|jpy|eur\/usd|currencies/.test(text)) return 'FX & Devises';
  return defCat || 'Macroéconomie';
}

function detectPairs(title, desc) {
  const text = ((title || '') + ' ' + (desc || '')).toLowerCase();
  const pairs = new Set();

  if (text.includes('eur/usd') || text.includes('eurusd') || text.includes('euro-dollar') || text.includes('euro dollar')) pairs.add('EUR/USD');
  if (text.includes('eur/chf') || text.includes('eurchf') || text.includes('franc suisse') || text.includes('swiss franc') || text.includes('bns') || text.includes('snb')) pairs.add('EUR/CHF');
  if (text.includes('chf/usd') || text.includes('chfusd') || text.includes('usd/chf') || text.includes('usdchf')) {
    pairs.add('CHF/USD');
    pairs.add('EUR/CHF');
  }
  if (text.includes('pln') || text.includes('zloty') || text.includes('złoty') || text.includes('nbp') || text.includes('poland') || text.includes('pologne')) {
    pairs.add('EUR/PLN');
    pairs.add('USD/PLN');
  }
  if (text.includes('eur/pln') || text.includes('eurpln')) pairs.add('EUR/PLN');
  if (text.includes('usd/pln') || text.includes('usdpln')) pairs.add('USD/PLN');
  if (text.includes('huf') || text.includes('forint') || text.includes('mnb') || text.includes('hungary') || text.includes('hongrie') || text.includes('usd/huf') || text.includes('usdhuf')) pairs.add('USD/HUF');
  if (text.includes('czk') || text.includes('koruna') || text.includes('couronne') || text.includes('cnb') || text.includes('czech') || text.includes('tchèque') || text.includes('czk/usd') || text.includes('czkusd')) pairs.add('CZK/USD');
  if (text.includes('gbp') || text.includes('pound') || text.includes('sterling') || text.includes('boe') || text.includes('bank of england') || text.includes('eur/gbp') || text.includes('gbp/usd')) {
    pairs.add('EUR/GBP');
    pairs.add('GBP/USD');
  }
  if (text.includes('bce') || text.includes('ecb') || text.includes('lagarde') || text.includes('zone euro') || text.includes('eurozone') || text.includes('dette souveraine') || text.includes('french') || text.includes('déficit')) {
    pairs.add('EUR/USD');
    pairs.add('EUR/CHF');
  }
  if (text.includes('fed') || text.includes('powell') || text.includes('fomc') || text.includes('dollar') || text.includes('treasury') || text.includes('midterm') || text.includes('trump') || text.includes('dxy')) {
    pairs.add('EUR/USD');
    pairs.add('CHF/USD');
    pairs.add('USD/PLN');
    pairs.add('USD/HUF');
    pairs.add('CZK/USD');
  }
  if (pairs.size === 0) {
    pairs.add('EUR/USD');
  }
  return Array.from(pairs);
}

function parisDateStr(epochMs) {
  const d = new Date(epochMs);
  return d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit' });
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
  const isStructuralTopic = /agitation|dette souveraine|sovereign debt|midterm|élection|election|trump|divergence|structural|budget|déficit|mandat|fomc decision|bce décision|ecb decision|rate cut cycle|tariffs|droits de douane/.test(text);
  const isOlder = (now - pubTime) > (12 * 3600 * 1000);
  return isStructuralTopic || isOlder;
}

async function runScraper() {
  console.log('Starting live news scraping across all sources...');
  const now = Date.now();
  const todayDateStr = parisDateStr(now);
  const articles = [];
  const seenTitles = new Set();

  await Promise.allSettled(PRESS_FEEDS.map(async (feed) => {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(6000)
      });
      if (!res.ok) return;

      const xml = await res.text();
      const grab = (item, tag) => {
        const m = item.match(new RegExp('<' + tag + '>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/' + tag + '>'));
        return m ? m[1].trim() : '';
      };

      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      items.slice(0, 20).forEach(it => {
        let title = cleanHtml(grab(it, 'title'));
        let link = grab(it, 'link');
        let desc = cleanHtml(grab(it, 'description'));
        let pubDateStr = grab(it, 'pubDate');

        if (!title || title.length < 10) return;
        if (title.endsWith(' - Reuters')) title = title.replace(/ - Reuters$/, '');
        if (title.endsWith(' - Les Échos')) title = title.replace(/ - Les Échos$/, '');
        if (title.endsWith(' - FX Empire')) title = title.replace(/ - FX Empire$/, '');
        if (title.endsWith(' - BFM Bourse')) title = title.replace(/ - BFM Bourse$/, '');

        const normTitle = title.toLowerCase().slice(0, 50);
        if (seenTitles.has(normTitle)) return;
        seenTitles.add(normTitle);

        const d = pubDateStr ? new Date(pubDateStr) : new Date();
        const pubTime = isNaN(d.getTime()) ? now : d.getTime();
        const artDateStr = parisDateStr(pubTime);
        const isToday = (artDateStr === todayDateStr);
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

  console.log(`✓ Scraped ${articles.length} articles total (${todayCount} from today, ${frCount} FR, ${enCount} EN).`);
  console.log(`✓ Saved output to ${outPath}`);
}

runScraper();
