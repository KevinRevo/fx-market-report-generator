/**
 * Archive — saved daily infographics (localStorage)
 * Each entry is a self-contained HTML snapshot (inline styles) keyed by type/pair/date/lang.
 */
window.Archive = (() => {
  'use strict';

  const KEY = 'ks_fx_archive_v1';
  let filter = 'all';
  let openId = null;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function persist(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Save (or overwrite) a report snapshot. meta: {type:'daily'|'pair', pair, date, lang, html} */
  function save(meta) {
    const id = [meta.type, meta.pair || 'ALL', meta.date, meta.lang].join('_');
    let list = load().filter(e => e.id !== id);
    list.unshift({
      id, type: meta.type, pair: meta.pair || '', date: meta.date, lang: meta.lang,
      savedAt: new Date().toISOString(), html: meta.html
    });
    // Quota safety: drop oldest until it fits
    while (!persist(list) && list.length > 1) list.pop();
    if (!list.length || !load().some(e => e.id === id)) {
      App.showToast('Espace de stockage insuffisant.', 'error');
      return false;
    }
    App.showToast(meta.lang === 'fr' ? 'Infographie sauvegardée dans les archives ✓' : 'Infographic saved to archive ✓', 'success');
    return true;
  }

  function remove(id) {
    persist(load().filter(e => e.id !== id));
    if (openId === id) openId = null;
    refresh();
  }

  function title(e) {
    return e.type === 'daily' ? 'Daily FX & Macro Report' : `${e.pair} Focus`;
  }

  function setFilter(f) { filter = f; openId = null; refresh(); }
  function open(id) { openId = id; refresh(); }
  function close() { openId = null; refresh(); }

  function refresh() {
    const area = document.getElementById('content-area') || document.querySelector('.content-area');
    if (area && document.getElementById('archive-root')) area.innerHTML = renderArchivePage();
  }

  async function downloadPng(id) {
    const e = load().find(x => x.id === id);
    const el = document.getElementById('archive-report-view')?.firstElementChild;
    if (!e || !el) return;
    App.showToast('Génération PNG...', 'info', 3000);
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#94a3b8', logging: false });
      const a = document.createElement('a');
      a.download = `${e.id}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) { App.showToast('Export impossible.', 'error'); }
  }

  function fmtDate(iso) {
    const d = new Date(iso + (iso.length === 10 ? 'T12:00:00' : ''));
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  }

  function renderArchivePage() {
    const all = load();
    const pairs = [...new Set(all.filter(e => e.type === 'pair').map(e => e.pair))];
    const list = all.filter(e => filter === 'all' || (filter === 'daily' ? e.type === 'daily' : e.pair === filter))
      .sort((a, b) => b.date.localeCompare(a.date) || b.savedAt.localeCompare(a.savedAt));

    const chip = (id, label) => `<button class="btn btn-sm ${filter === id ? 'btn-primary' : 'btn-outline'}" onclick="Archive.setFilter('${id}')">${label}</button>`;

    if (openId) {
      const e = all.find(x => x.id === openId);
      if (e) {
        return `
        <div id="archive-root">
          <div class="report-toolbar">
            <div class="toolbar-title-group"><h3>📁 ${title(e)} — ${fmtDate(e.date)} (${e.lang.toUpperCase()})</h3></div>
            <div class="toolbar-buttons" style="display:flex;gap:8px;">
              <button class="btn btn-outline btn-sm" onclick="Archive.close()">← Retour aux archives</button>
              <button class="btn btn-primary btn-sm" onclick="Archive.downloadPng('${e.id}')">🖼️ Télécharger PNG</button>
              <button class="btn btn-outline btn-sm" style="color:#e11d48" onclick="if(confirm('Supprimer cette archive ?'))Archive.remove('${e.id}')">🗑️ Supprimer</button>
            </div>
          </div>
          <div class="report-preview-scroll-wrapper"><div id="archive-report-view">${e.html}</div></div>
        </div>`;
      }
    }

    return `
      <div id="archive-root">
        <div class="report-toolbar">
          <div class="toolbar-title-group"><h3>📁 Archives des infographies</h3></div>
          <div style="font-size:12px;color:#64748b;">${all.length} infographie(s) sauvegardée(s) sur cet appareil</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0;">
          ${chip('all', 'Toutes')}${chip('daily', '📰 Daily Report')}${pairs.map(p => chip(p, '💱 ' + p)).join('')}
        </div>
        ${list.length === 0 ? `
          <div style="padding:48px;text-align:center;color:#64748b;background:#fff;border:1px dashed #cbd5e1;border-radius:12px;">
            Aucune infographie archivée. Utilisez le bouton <strong>💾 Sauvegarder</strong> dans le Daily Report ou le Pair Focus.
          </div>` : `
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;">
            ${list.map(e => `
              <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
                <div style="font-size:11px;font-weight:700;color:#2563eb;text-transform:uppercase;">${e.type === 'daily' ? '📰 Daily' : '💱 Pair Focus'} · ${e.lang === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}</div>
                <div style="font-size:15px;font-weight:800;color:#1e3a8a;margin:4px 0;">${title(e)}</div>
                <div style="font-size:12.5px;color:#475569;">${fmtDate(e.date)}</div>
                <div style="font-size:10.5px;color:#94a3b8;margin-top:2px;">Sauvegardé le ${new Date(e.savedAt).toLocaleString('fr-FR')}</div>
                <div style="display:flex;gap:6px;margin-top:10px;">
                  <button class="btn btn-primary btn-sm" onclick="Archive.open('${e.id}')">Ouvrir</button>
                  <button class="btn btn-outline btn-sm" style="color:#e11d48" onclick="if(confirm('Supprimer ?'))Archive.remove('${e.id}')">🗑️</button>
                </div>
              </div>`).join('')}
          </div>`}
      </div>`;
  }

  return { save, remove, open, close, setFilter, downloadPng, renderArchivePage, renderArchive: renderArchivePage, initPage() { openId = null; } };
})();
