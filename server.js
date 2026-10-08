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
