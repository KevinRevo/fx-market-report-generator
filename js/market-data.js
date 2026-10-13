/**
 * Market Data — live FX rates (any currency pair) & economic calendar.
 *
 * - Rates: Yahoo Finance daily bars (through a public CORS proxy), with
 *   automatic inverse-pair lookup and an ECB reference-rate fallback (Frankfurter).
 * - 1D / 1W variations are ALWAYS computed as: current rate vs. the official
 *   daily CLOSE of the previous session / of ~7 days ago.
 * - Calendar: ForexFactory weekly feed, converted to French time (Europe/Paris).
 *
 * Shared by Pair Focus and Email Templates. No API key needed.
 */
(function (root) {
  'use strict';

  const CURRENCIES = {
    EUR: { flag: '🇪🇺', cbFr: 'BCE', cbEn: 'ECB' },
    USD: { flag: '🇺🇸', cbFr: 'Fed', cbEn: 'Fed' },
    GBP: { flag: '🇬🇧', cbFr: 'BoE', cbEn: 'BoE' },
    CHF: { flag: '🇨🇭', cbFr: 'BNS', cbEn: 'SNB' },
    NOK: { flag: '🇳🇴', cbFr: 'Norges Bank', cbEn: 'Norges Bank' },
    SEK: { flag: '🇸🇪', cbFr: 'Riksbank', cbEn: 'Riksbank' },
    DKK: { flag: '🇩🇰', cbFr: 'Danmarks Nationalbank', cbEn: 'Danmarks Nationalbank' },
    RON: { flag: '🇷🇴', cbFr: 'BNR', cbEn: 'NBR' },
    CZK: { flag: '🇨🇿', cbFr: 'CNB', cbEn: 'CNB' },
    HUF: { flag: '🇭🇺', cbFr: 'MNB', cbEn: 'MNB' },
    PLN: { flag: '🇵🇱', cbFr: 'NBP', cbEn: 'NBP' }
  };
  const CODES = Object.keys(CURRENCIES);
  const FLAGS = {};
  CODES.forEach(c => { FLAGS[c] = CURRENCIES[c].flag; });

  // Currencies covered by the ForexFactory calendar feed
  const CALENDAR_COVERED = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'NZD', 'CNY'];

  const cbName = (code, lang) => {
    const c = CURRENCIES[code];
    if (!c) return code;
    return lang === 'en' ? c.cbEn : c.cbFr;
  };

  // ─── Networking ───
  const PROXIES = [
    u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    u => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u)
  ];

  async function fetchText(url, ms) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms || 2500);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.text();
    } finally {
      clearTimeout(timer);
    }
  }

  async function viaProxy(url) {
    let lastErr = new Error('no proxy');
    for (const p of PROXIES) {
      try { return await fetchText(p(url)); } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }

  const cache = new Map();
  async function cached(key, ttlMs, loader) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.t < ttlMs) return hit.v;
    const v = await loader();
    cache.set(key, { t: Date.now(), v });
    return v;
  }

  // ─── Formatting ───
  function fmtRate(price) {
    if (price == null || isNaN(price)) return '–';
    const a = Math.abs(price);
    const dec = a >= 100 ? 2 : a >= 20 ? 3 : a < 0.1 ? 5 : 4;
    return price.toFixed(dec);
  }
  function fmtPct(p) {
    if (p == null || isNaN(p)) return 'n/d';
    return (p >= 0 ? '+' : '') + p.toFixed(2) + '%';
  }

  // ─── Rates ───
  async function yahooBars(symbol) {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) + '?interval=1d&range=1mo';
    const j = JSON.parse(await viaProxy(url));
    const r = j && j.chart && j.chart.result && j.chart.result[0];
    if (!r || !r.meta || r.meta.regularMarketPrice == null) return null;
    const ts = r.timestamp || [];
    const cl = ((r.indicators && r.indicators.quote && r.indicators.quote[0]) || {}).close || [];
    const bars = [];
    ts.forEach((t, i) => { if (cl[i] != null) bars.push({ t, c: cl[i] }); });
    if (!bars.length) return null;
    return {
      price: r.meta.regularMarketPrice,
      regTime: r.meta.regularMarketTime || bars[bars.length - 1].t,
      offset: r.meta.gmtoffset || 0,
      bars
    };
  }

  function invert(d) {
    return {
      price: 1 / d.price,
      regTime: d.regTime,
      offset: d.offset,
      bars: d.bars.map(b => ({ t: b.t, c: 1 / b.c }))
    };
  }

  async function frankfurterBars(base, quote) {
    const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const j = JSON.parse(await fetchText('https://api.frankfurter.dev/v1/' + start + '..?base=' + base + '&symbols=' + quote));
    const days = Object.keys(j.rates || {}).sort();
    if (!days.length) return null;
    const bars = days.map(d => ({ t: Date.parse(d + 'T12:00:00Z') / 1000, c: j.rates[d][quote] })).filter(b => b.c != null);
    if (!bars.length) return null;
    const last = bars[bars.length - 1];
    return { price: last.c, regTime: last.t, offset: 0, bars };
  }

  /** current price vs. official daily closes (previous session / ~1 week ago) */
  function analyse(d) {
    const day = t => new Date((t + (d.offset || 0)) * 1000).toISOString().slice(0, 10);
    const closes = d.bars.slice();
    const regDay = day(d.regTime);
    // the bar of the session in progress is not a "close" yet
    if (closes.length && day(closes[closes.length - 1].t) === regDay) closes.pop();
    const prev = closes.length ? closes[closes.length - 1] : null;
    const weekDay = day(d.regTime - 7 * 86400);
    let week = null;
    closes.forEach(b => { if (day(b.t) <= weekDay) week = b; });
    if (!week) week = closes[0] || null;
    const pct = ref => (ref && ref.c ? ((d.price - ref.c) / ref.c) * 100 : null);
    const history = closes.slice(-4).map(b => b.c);
    history.push(d.price);
    return {
      d1Pct: pct(prev),
      w1Pct: pct(week),
      prevClose: prev ? prev.c : null,
      weekClose: week ? week.c : null,
      prevCloseDay: prev ? day(prev.t) : null,
      weekCloseDay: week ? day(week.t) : null,
      history
    };
  }

  /** Live rate + closing-based variations for ANY pair, e.g. getPair('NOK','SEK') */
  function getPair(base, quote) {
    return cached('pair:' + base + quote, 60000, async () => {
      let d = null;
      let source = 'BCE (taux de référence)';
      // 1. Instant Frankfurter lookup for major European & international pairs (takes ~200ms)
      try {
        d = await frankfurterBars(base, quote);
      } catch (e) { /* fallback to yahoo */ }

      // 2. Fallback to Yahoo Finance bars via proxy if Frankfurter does not cover the cross
      if (!d) {
        source = 'Yahoo Finance (interbancaire)';
        try { d = await yahooBars(base + quote + '=X'); } catch (e) { /* try next */ }
        if (!d) {
          try {
            const inv = await yahooBars(quote + base + '=X');
            if (inv) d = invert(inv);
          } catch (e) { /* fail */ }
        }
      }
      if (!d) throw new Error('Aucune donnée de marché disponible pour ' + base + '/' + quote);
      const a = analyse(d);
      return {
        base, quote,
        name: base + '/' + quote,
        price: d.price,
        rate: fmtRate(d.price),
        d1Pct: a.d1Pct,
        w1Pct: a.w1Pct,
        d1: fmtPct(a.d1Pct),
        w1: fmtPct(a.w1Pct),
        prevClose: a.prevClose,
        weekClose: a.weekClose,
        prevCloseFmt: fmtRate(a.prevClose),
        weekCloseFmt: fmtRate(a.weekClose),
        prevCloseDay: a.prevCloseDay,
        weekCloseDay: a.weekCloseDay,
        history: a.history,
        source,
        asOf: new Date(d.regTime * 1000)
      };
    });
  }

  /** Any Yahoo symbol (Brent 'BZ=F', US 10Y '^TNX', Gold 'GC=F'...) */
  function getQuote(symbol) {
    return cached('q:' + symbol, 60000, async () => {
      const d = await yahooBars(symbol);
      if (!d) throw new Error('Aucune donnée pour ' + symbol);
      const a = analyse(d);
      return { symbol, price: d.price, d1Pct: a.d1Pct, w1Pct: a.w1Pct, d1: fmtPct(a.d1Pct), w1: fmtPct(a.w1Pct) };
    });
  }

  // ─── Calendar (French time) ───
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
    const off1 = (() => { const p = tzParts(guess, tz); return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi) - guess; })();
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

  function getCalendar() {
    return cached('calendar', 10 * 60000, async () => {
      const xml = await viaProxy('https://nfs.faireconomy.media/ff_calendar_thisweek.xml');
      const grab = (ev, tag) => ((new RegExp('<' + tag + '>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</' + tag + '>').exec(ev)) || [])[1];
      const out = [];
      (xml.match(/<event>[\s\S]*?<\/event>/g) || []).forEach(ev => {
        const impact = grab(ev, 'impact');
        if (impact !== 'High' && impact !== 'Medium') return;
        const when = parseFFDate(grab(ev, 'date'), grab(ev, 'time'));
        if (!when) return;
        const title = (grab(ev, 'title') || '').trim();
        if (/bank holiday/i.test(title)) return;
        out.push({
          country: (grab(ev, 'country') || '').trim(),
          title,
          impact,
          ts: when.ms,
          dateStr: parisDateStr(when.ms),
          time: when.allDay ? 'Journée' : parisTimeStr(when.ms)
        });
      });
      out.sort((a, b) => a.ts - b.ts);
      return out;
    });
  }

  /**
   * Events relevant for a list of currencies, upcoming first.
   * Currencies not covered by the feed (NOK, SEK, CZK, HUF, PLN...) fall back to EUR
   * events (flagged `proxy`) since those currencies mostly trade on euro-area news.
   */
  async function getEventsFor(currencies, max) {
    const all = await getCalendar();
    const want = new Set(currencies);
    const proxyCcy = currencies.some(c => !CALENDAR_COVERED.includes(c));
    const rows = all
      .filter(e => want.has(e.country) || (proxyCcy && e.country === 'EUR'))
      .map(e => ({ ...e, proxy: !want.has(e.country) }));
    const limit = max || 6;
    const now = Date.now() - 3 * 3600 * 1000;
    const upcoming = rows.filter(e => e.ts >= now);
    const past = rows.filter(e => e.ts < now).slice(-3);
    return upcoming.length >= 3 ? upcoming.slice(0, limit) : upcoming.concat(past).slice(0, limit);
  }

  root.MarketData = {
    CURRENCIES, CODES, FLAGS, CALENDAR_COVERED,
    cbName, fmtRate, fmtPct,
    getPair, getQuote, getCalendar, getEventsFor,
    _analyse: analyse
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.MarketData;
})(typeof window !== 'undefined' ? window : globalThis);
