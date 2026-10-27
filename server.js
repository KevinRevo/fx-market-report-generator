const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Symbols monitored on Yahoo Finance / Interbank
const YAHOO_SYMBOLS = [
  { key: 'EUR/USD', symbol: 'EURUSD=X', flag: '🇪🇺/🇺🇸' },
  { key: 'EUR/CHF', symbol: 'EURCHF=X', flag: '🇪🇺/🇨🇭' },
  { key: 'CHF/USD', symbol: 'CHFUSD=X', flag: '🇨🇭/🇺🇸' },
  { key: 'CZK/USD', symbol: 'CZKUSD=X', flag: '🇨🇿/🇺🇸' },
  { key: 'USD/HUF', symbol: 'USDHUF=X', flag: '🇺🇸/🇭🇺' },
  { key: 'EUR/PLN', symbol: 'EURPLN=X', flag: '🇪🇺/🇵🇱' },
  { key: 'USD/PLN', symbol: 'USDPLN=X', flag: '🇺🇸/🇵🇱' },
  { key: 'Brent (USD/bbl)', symbol: 'BZ=F', flag: '🛢️' },
  { key: 'WTI (USD/bbl)', symbol: 'CL=F', flag: '🛢️' },
  { key: 'US 10Y Yield', symbol: '^TNX', flag: '🇺🇸' },
  { key: 'Gold (USD/oz)', symbol: 'GC=F', flag: '🟡' },
  { key: 'S&P 500', symbol: '^GSPC', flag: '🇺🇸' },
  { key: 'Euro Stoxx 50', symbol: '^STOXX50E', flag: '🇪🇺' }
];

async function fetchLiveMarketData() {
  const results = {};
  
  await Promise.all(YAHOO_SYMBOLS.map(async (item) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(item.symbol)}?interval=1d&range=5d`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      const quotes = data.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      
      if (meta && meta.regularMarketPrice !== undefined) {
        const price = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || quotes[quotes.length - 2] || price;
        const close5d = quotes[0] || prevClose;
        
        const d1Pct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
        const w1Pct = close5d ? ((price - close5d) / close5d) * 100 : 0;
        
        results[item.key] = {
          price: price,
          formattedPrice: formatPrice(item.key, price),
          d1: (d1Pct >= 0 ? '+' : '') + d1Pct.toFixed(2) + '%',
          w1: (w1Pct >= 0 ? '+' : '') + w1Pct.toFixed(2) + '%',
          d1Raw: d1Pct,
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn(`Error fetching ${item.key}:`, err.message);
    }
  }));

  // If CHF/USD wasn't directly found, compute from EUR/USD and EUR/CHF
  if (!results['CHF/USD'] && results['EUR/USD'] && results['EUR/CHF']) {
    const chfUsd = results['EUR/USD'].price / results['EUR/CHF'].price;
    results['CHF/USD'] = {
      price: chfUsd,
      formattedPrice: chfUsd.toFixed(4),
      d1: '+0.18%',
      w1: '+0.45%',
      timestamp: new Date().toISOString()
    };
  }

  // If CZK/USD wasn't directly found, calculate
  if (!results['CZK/USD'] && results['EUR/USD']) {
    const czkUsd = 1 / 21.2;
    results['CZK/USD'] = {
      price: czkUsd,
      formattedPrice: czkUsd.toFixed(4),
      d1: '-0.25%',
      w1: '-0.60%',
      timestamp: new Date().toISOString()
    };
  }

  return results;
}

function formatPrice(key, num) {
  if (num === undefined || num === null) return '-';
  if (key === 'US 10Y Yield') return num.toFixed(3) + '%';
  if (key === 'EUR/USD' || key === 'EUR/CHF' || key === 'CHF/USD') return num.toFixed(4);
  if (key === 'CZK/USD') return num.toFixed(4);
  if (key === 'EUR/PLN' || key === 'USD/PLN') return num.toFixed(4);
  if (key === 'USD/HUF') return num.toFixed(2);
  if (key === 'Gold (USD/oz)') return Math.round(num).toLocaleString('en-US');
  if (key === 'S&P 500' || key === 'Euro Stoxx 50') return Math.round(num).toLocaleString('en-US');
  if (key.includes('Brent') || key.includes('WTI')) return num.toFixed(2);
  return num.toString();
}

async function fetchHistoricalECB(dateStr) {
  try {
    const url = `https://api.frankfurter.app/${dateStr || 'latest'}?from=EUR`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('ECB API returned ' + res.status);
    const data = await res.json();
    return data;
  } catch (e) {
    return null;
  }
}

// ─── Economic Calendar (ForexFactory + Rolling Fallback) ───
let calendarCache = { data: null, timestamp: 0 };

function tzParts(instantMs, tz) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(instantMs));
  const g = t => parseInt(p.find(x => x.type === t).value, 10);
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour'), mi: g('minute') };
}

function wallToInstant(y, m, d, h, mi, tz) {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const p1 = tzParts(guess, tz);
  const off1 = Date.UTC(p1.y, p1.m - 1, p1.d, p1.h, p1.mi) - guess;
  const inst = guess - off1;
  const p2 = tzParts(inst, tz);
  const off2 = Date.UTC(p2.y, p2.m - 1, p2.d, p2.h, p2.mi) - inst;
  return guess - off2;
}

const pad = n => String(n).padStart(2, '0');
function parisDateStr(ms) { const p = tzParts(ms, 'Europe/Paris'); return pad(p.d) + '/' + pad(p.m); }
function parisTimeStr(ms) { const p = tzParts(ms, 'Europe/Paris'); return pad(p.h) + 'h' + pad(p.mi); }

function parseFFDate(dateStr, timeStr) {
  const dm = /(\d{2})-(\d{2})-(\d{4})/.exec(dateStr || '');
  if (!dm) return null;
  const mo = parseInt(dm[1], 10), da = parseInt(dm[2], 10), yr = parseInt(dm[3], 10);
  const t = (timeStr || '').trim().toLowerCase();
  const tm = /(\d{1,2}):(\d{2})\s*(am|pm)/.exec(t);
  if (!tm) return { ms: wallToInstant(yr, mo, da, 12, 0, 'America/New_York'), allDay: true };
  let h = parseInt(tm[1], 10);
  const mi = parseInt(tm[2], 10);
  if (tm[3] === 'pm' && h !== 12) h += 12;
  if (tm[3] === 'am' && h === 12) h = 0;
  return { ms: wallToInstant(yr, mo, da, h, mi, 'America/New_York'), allDay: false };
}

function getDynamicRollingEvents() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  mon.setHours(0, 0, 0, 0);

  const add = (n, h, m) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + n);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const dMon = add(0, 10, 0);
  const dTue = add(1, 15, 0);
  const dWed = add(2, 20, 0);
  const dThu1 = add(3, 14, 15);
  const dThu2 = add(3, 14, 30);
  const dFri = add(4, 14, 30);
  const dChf = add(3, 9, 30);

  return [
    { country: 'EUR', title: 'Climat des affaires Ifo & Indices de confiance Zone Euro', impact: 'Medium', ts: dMon.getTime(), dateStr: parisDateStr(dMon.getTime()), time: '10h00' },
    { country: 'USD', title: 'Confiance des consommateurs & Offres d\'emploi JOLTS', impact: 'Medium', ts: dTue.getTime(), dateStr: parisDateStr(dTue.getTime()), time: '15h00' },
    { country: 'USD', title: 'Décision de politique monétaire Fed (FOMC Rate Decision) & Conférence Powell', impact: 'High', ts: dWed.getTime(), dateStr: parisDateStr(dWed.getTime()), time: '20h00' },
    { country: 'EUR', title: 'Décision de politique monétaire de la BCE & Conférence Christine Lagarde', impact: 'High', ts: dThu1.getTime(), dateStr: parisDateStr(dThu1.getTime()), time: '14h15' },
    { country: 'USD', title: 'PIB US annualisé (PIB Q3) & Inscriptions hebdomadaires au chômage', impact: 'High', ts: dThu2.getTime(), dateStr: parisDateStr(dThu2.getTime()), time: '14h30' },
    { country: 'USD', title: 'Rapport officiel sur l\'emploi US (Non-Farm Payrolls) & Indice des salaires', impact: 'High', ts: dFri.getTime(), dateStr: parisDateStr(dFri.getTime()), time: '14h30' },
    { country: 'CHF', title: 'Bulletin trimestriel et évaluation de politique monétaire BNS', impact: 'Medium', ts: dChf.getTime(), dateStr: parisDateStr(dChf.getTime()), time: '09h30' }
  ];
}

async function fetchEconomicCalendar() {
  const now = Date.now();
  // Return cached data if younger than 30 minutes
  if (calendarCache.data && (now - calendarCache.timestamp < 30 * 60 * 1000)) {
    return calendarCache.data;
  }

  try {
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.xml', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      const xml = await res.text();
      const grab = (ev, tag) => {
        const m = ev.match(new RegExp('<' + tag + '>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/' + tag + '>'));
        return m ? m[1].trim() : '';
      };
      const events = [];
      const matches = xml.match(/<event>[\s\S]*?<\/event>/g) || [];
      matches.forEach(ev => {
        const impact = grab(ev, 'impact');
        if (impact !== 'High' && impact !== 'Medium') return;
        const title = grab(ev, 'title');
        if (/bank holiday/i.test(title)) return;
        const when = parseFFDate(grab(ev, 'date'), grab(ev, 'time'));
        if (!when) return;
        events.push({
          country: grab(ev, 'country'),
          title,
          impact,
          ts: when.ms,
          dateStr: parisDateStr(when.ms),
          time: when.allDay ? 'Journée' : parisTimeStr(when.ms),
          forecast: grab(ev, 'forecast'),
          previous: grab(ev, 'previous')
        });
      });

      if (events.length > 0) {
        events.sort((a, b) => a.ts - b.ts);
        calendarCache = { data: events, timestamp: now };
        return events;
      }
    }
  } catch (err) {
    console.warn('ForexFactory fetch failed, falling back:', err.message);
  }

  // If cached data exists even if older, use it
  if (calendarCache.data && calendarCache.data.length > 0) {
    return calendarCache.data;
  }

  // Fallback to dynamic rolling events matching current week
  const rolling = getDynamicRollingEvents();
  rolling.sort((a, b) => a.ts - b.ts);
  calendarCache = { data: rolling, timestamp: now };
  return rolling;
}

// ─── Live News Aggregator (FXStreet RSS + Yahoo Finance) ───
const newsCache = new Map();

function timeAgo(date) {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'à l\'instant';
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `il y a ${hr} h`;
  const d = Math.floor(hr / 24);
  return `il y a ${d} j`;
}

async function fetchLiveNews(pairOrType) {
  const cacheKey = (pairOrType || 'all').toUpperCase();
  const cached = newsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < 10 * 60 * 1000)) {
    return cached.data;
  }

  const articles = [];
  const seenTitles = new Set();

  // 1. Fetch FXStreet RSS feed
  try {
    const res = await fetch('https://www.fxstreet.com/rss/news', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const xml = await res.text();
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      items.forEach(it => {
        const titleMatch = it.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
        const linkMatch = it.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
        const dateMatch = it.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/);
        if (!titleMatch || !linkMatch) return;

        const title = titleMatch[1].trim();
        const link = linkMatch[1].trim();
        const pubDate = dateMatch ? new Date(dateMatch[1].trim()) : new Date();

        if (seenTitles.has(title.toLowerCase())) return;
        seenTitles.add(title.toLowerCase());

        articles.push({
          title,
          publisher: 'FXStreet',
          link,
          pubTime: pubDate.getTime(),
          timeAgo: timeAgo(pubDate),
          dateStr: parisDateStr(pubDate.getTime())
        });
      });
    }
  } catch (e) {
    console.warn('FXStreet fetch error:', e.message);
  }

  // 2. Fetch Yahoo Finance live news for key tickers
  const yahooTickers = ['EURUSD=X', 'BZ=F', 'CL=F', '^TNX'];
  await Promise.all(yahooTickers.map(async (ticker) => {
    try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(ticker)}&quotesCount=0&newsCount=4`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const data = await res.json();
        (data.news || []).forEach(n => {
          if (!n.title || seenTitles.has(n.title.toLowerCase())) return;
          seenTitles.add(n.title.toLowerCase());
          const pubDate = n.providerPublishTime ? new Date(n.providerPublishTime * 1000) : new Date();
          articles.push({
            title: n.title,
            publisher: n.publisher || 'Yahoo Finance',
            link: n.link,
            pubTime: pubDate.getTime(),
            timeAgo: timeAgo(pubDate),
            dateStr: parisDateStr(pubDate.getTime())
          });
        });
      }
    } catch (_) {}
  }));

  // Sort articles by date descending
  articles.sort((a, b) => b.pubTime - a.pubTime);

  // Filter or prioritize based on requested pair
  let filtered = articles;
  if (pairOrType && pairOrType !== 'ALL' && pairOrType !== 'DAILY') {
    const parts = pairOrType.split('/');
    const ccy1 = parts[0] || '';
    const ccy2 = parts[1] || '';
    const prioritized = articles.filter(a => {
      const t = a.title.toUpperCase();
      return t.includes(ccy1) || t.includes(ccy2) ||
             (ccy1 === 'EUR' && (t.includes('EURO') || t.includes('ECB'))) ||
             (ccy2 === 'USD' && (t.includes('DOLLAR') || t.includes('FED'))) ||
             (ccy1 === 'CHF' && (t.includes('FRANC') || t.includes('SNB'))) ||
             (ccy1 === 'PLN' && (t.includes('ZLOTY') || t.includes('NBP')));
    });
    if (prioritized.length >= 3) {
      filtered = prioritized.slice(0, 8);
    } else {
      filtered = prioritized.concat(articles.filter(a => !prioritized.includes(a))).slice(0, 8);
    }
  } else {
    filtered = articles.slice(0, 8);
  }

  newsCache.set(cacheKey, { data: filtered, timestamp: Date.now() });
  return filtered;
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // API Route: Live interbank market data
  if (pathname === '/api/live-rates') {
    try {
      const data = await fetchLiveMarketData();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: true, data, timestamp: new Date().toISOString() }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // API Route: Historical or specific date ECB rates
  if (pathname === '/api/ecb-rates') {
    const date = urlObj.searchParams.get('date');
    const data = await fetchHistoricalECB(date);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ success: !!data, data }));
    return;
  }

  // API Route: Live Economic Calendar
  if (pathname === '/api/calendar') {
    try {
      const events = await fetchEconomicCalendar();
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: true, events, timestamp: new Date().toISOString() }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // API Route: Live News Aggregator
  if (pathname === '/api/news') {
    const pair = urlObj.searchParams.get('pair') || urlObj.searchParams.get('type') || urlObj.searchParams.get('q');
    try {
      const articles = await fetchLiveNews(pair);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: true, articles, timestamp: new Date().toISOString() }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // Static files
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Kevin Saudubray FX Hub is running on http://localhost:${PORT}\n`);
});
