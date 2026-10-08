const https = require('https');

const YAHOO_SYMBOLS = [
  { key: 'EUR/USD', symbol: 'EURUSD=X' },
  { key: 'EUR/CHF', symbol: 'EURCHF=X' },
  { key: 'CHF/USD', symbol: 'CHFUSD=X' },
  { key: 'CZK/USD', symbol: 'CZKUSD=X' },
  { key: 'USD/HUF', symbol: 'USDHUF=X' },
  { key: 'EUR/PLN', symbol: 'EURPLN=X' },
  { key: 'USD/PLN', symbol: 'USDPLN=X' },
  { key: 'Brent (USD/bbl)', symbol: 'BZ=F' },
  { key: 'WTI (USD/bbl)', symbol: 'CL=F' },
  { key: 'US 10Y Yield', symbol: '^TNX' },
  { key: 'Gold (USD/oz)', symbol: 'GC=F' },
  { key: 'S&P 500', symbol: '^GSPC' },
  { key: 'Euro Stoxx 50', symbol: '^STOXX50E' }
];

function fetchYahooData(symbol) {
  return new Promise((resolve, reject) => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
    
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
             resolve(null);
             return;
          }
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', (e) => resolve(null));
  });
}

function formatPrice(num, key) {
  if (key.includes('HUF') || key.includes('S&P') || key.includes('Stoxx')) return num.toFixed(2);
  if (key.includes('10Y') || key.includes('Brent') || key.includes('WTI')) return num.toFixed(3);
  return num.toFixed(4);
}

module.exports = async function(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {};
  
  try {
    await Promise.all(YAHOO_SYMBOLS.map(async (item) => {
      try {
        const data = await fetchYahooData(item.symbol);
        
        if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
          const meta = data.chart.result[0].meta;
          const quotes = data.chart.result[0].indicators.quote[0].close || [];
          
          if (meta.regularMarketPrice !== undefined) {
            const price = meta.regularMarketPrice;
            const prevClose = meta.chartPreviousClose || quotes[quotes.length - 2] || price;
            const close5d = quotes[0] || prevClose;
            const closeYTD = close5d;
            
            const d1Pct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
            const w1Pct = close5d ? ((price - close5d) / close5d) * 100 : 0;
            const ytdPct = closeYTD ? ((price - closeYTD) / closeYTD) * 100 : 0;
            
            results[item.key] = {
              price,
              formattedPrice: formatPrice(price, item.key),
              d1: (d1Pct >= 0 ? '+' : '') + d1Pct.toFixed(2) + '%',
              w1: (w1Pct >= 0 ? '+' : '') + w1Pct.toFixed(2) + '%',
              ytd: (ytdPct >= 0 ? '+' : '') + ytdPct.toFixed(2) + '%'
            };
          }
        }
      } catch (err) {
        // Skip on error
      }
    }));
    
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
};
