/**
 * FX Report Generator — Main Application Controller
 * Kevin Saudubray — Daily FX & Macro Market Report Generator
 * 
 * Handles navigation, page routing, dashboard, and coordination
 * between DailyReport, PairFocus, and EmailTemplates modules.
 */

window.App = (() => {
  'use strict';

  // ─── State ───
  let currentPage = 'dashboard';
  let sidebarCollapsed = false;

  // ─── Navigation Items ───
  const NAV_ITEMS = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', shortLabel: 'Home' },
    { id: 'daily-report', icon: '📰', label: 'Daily Report', shortLabel: 'Daily' },
    { id: 'pair-focus', icon: '💱', label: 'Pair Focus', shortLabel: 'Pairs' },
    { id: 'email-templates', icon: '✉️', label: 'Email Templates', shortLabel: 'Emails' },
    { id: 'archive', icon: '📁', label: 'Archives', shortLabel: 'Archive' },
  ];

  // ─── Initialize ───
  function init() {
    renderShell();
    navigateTo('dashboard');
    setupEventListeners();
    updateDateTime();
    setInterval(updateDateTime, 60000);
  }

  // ─── Render App Shell ───
  function renderShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-logo">
            <span class="logo-icon">KS</span>
            <span class="logo-text">Kevin Saudubray</span>
          </div>
          <button class="sidebar-toggle" id="sidebar-toggle" title="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <nav class="sidebar-nav">
          ${NAV_ITEMS.map(item => `
            <a href="#" class="nav-item ${item.id === currentPage ? 'active' : ''}" data-page="${item.id}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>
            </a>
          `).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-footer-content">
            <span class="sidebar-version">FX Report Gen v1.0</span>
            <span class="sidebar-copyright">© 2026 Kevin Saudubray</span>
          </div>
        </div>
      </aside>
      <main class="main-area">
        <header class="top-bar">
          <div class="top-bar-left">
            <button class="mobile-menu-btn" id="mobile-menu-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <h2 class="page-title" id="page-title">Dashboard</h2>
          </div>
          <div class="top-bar-right">
            <span class="top-bar-date" id="top-bar-date"></span>
            <div class="top-bar-user">
              <span class="user-avatar">KS</span>
              <span class="user-name">Kevin Saudubray</span>
            </div>
          </div>
        </header>
        <div class="content-area" id="content-area">
          <!-- Page content injected here -->
        </div>
      </main>

      <!-- Toast container -->
      <div class="toast-container" id="toast-container"></div>

      <!-- Modal overlay -->
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-content" id="modal-content"></div>
      </div>
    `;
  }

  // ─── Setup Event Listeners ───
  function setupEventListeners() {
    // Sidebar navigation
    document.addEventListener('click', (e) => {
      const navItem = e.target.closest('.nav-item');
      if (navItem) {
        e.preventDefault();
        const page = navItem.dataset.page;
        navigateTo(page);
      }
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleSidebar);

    // Modal close
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ─── Navigation ───
  function navigateTo(page) {
    currentPage = page;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });

    // Update page title
    const navItem = NAV_ITEMS.find(n => n.id === page);
    const titleEl = document.getElementById('page-title');
    if (titleEl && navItem) {
      titleEl.textContent = navItem.label;
    }

    // Render page content
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    contentArea.classList.add('page-transitioning');

    setTimeout(() => {
      switch (page) {
        case 'dashboard':
          contentArea.innerHTML = renderDashboard();
          setupDashboardListeners();
          break;
        case 'daily-report':
          if (window.DailyReport) {
            contentArea.innerHTML = window.DailyReport.renderDailyReportPage();
            window.DailyReport.initPage?.();
          } else {
            contentArea.innerHTML = renderLoadingState('Daily Report');
          }
          break;
        case 'pair-focus':
          if (window.PairFocus) {
            contentArea.innerHTML = window.PairFocus.renderPairFocusPage();
            window.PairFocus.initPage?.();
          } else {
            contentArea.innerHTML = renderLoadingState('Pair Focus');
          }
          break;
        case 'email-templates':
          if (window.EmailTemplates) {
            contentArea.innerHTML = window.EmailTemplates.renderEmailTemplatesPage();
            window.EmailTemplates.initPage?.();
          } else {
            contentArea.innerHTML = renderLoadingState('Email Templates');
          }
          break;
        case 'archive':
          window.Archive?.initPage();
          contentArea.innerHTML = window.Archive ? window.Archive.renderArchivePage() : renderLoadingState('Archives');
          break;
        default:
          contentArea.innerHTML = renderDashboard();
      }

      contentArea.classList.remove('page-transitioning');
    }, 150);

    // Close mobile sidebar
    if (window.innerWidth < 768) {
      document.getElementById('sidebar')?.classList.remove('open');
    }
  }

  // ─── Dashboard ───
  function renderDashboard() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });

    return `
      <div class="dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Good ${getGreeting()}, Kevin</h1>
            <p>Welcome to your FX Report Generator. Create professional market reports and email templates.</p>
          </div>
          <div class="welcome-date">
            <span class="welcome-date-label">Today</span>
            <span class="welcome-date-value">${dateStr}</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="quick-actions">
          <button class="action-card" data-action="daily-report">
            <div class="action-icon">📰</div>
            <div class="action-info">
              <h4>New Daily Report</h4>
              <p>Generate today's FX & Macro Market Report</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-card" data-action="pair-focus" data-pair="EURUSD">
            <div class="action-icon">💱</div>
            <div class="action-info">
              <h4>EUR/USD Focus</h4>
              <p>Create EUR/USD pair analysis report</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="action-card" data-action="email-templates">
            <div class="action-icon">✉️</div>
            <div class="action-info">
              <h4>Email Template</h4>
              <p>Generate factual emails for Revolut Business</p>
            </div>
            <svg class="action-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Report Types Overview -->
        <div class="section-header">
          <h3>Report Types</h3>
        </div>
        <div class="report-types-grid">
          <div class="report-type-card">
            <div class="report-type-header daily">
              <span class="report-type-badge">DAILY</span>
            </div>
            <h4>Daily FX & Macro Market Report</h4>
            <p>Comprehensive 2-page institutional report with morning highlights, market snapshot, central bank analysis, geopolitics, and FX dashboard.</p>
            <div class="report-type-features">
              <span class="feature-tag">8 Sections</span>
              <span class="feature-tag">2 Pages</span>
              <span class="feature-tag">Market Data</span>
              <span class="feature-tag">Central Banks</span>
            </div>
            <button class="btn btn-primary btn-sm" data-action="daily-report">Create Report →</button>
          </div>

          <div class="report-type-card">
            <div class="report-type-header pair">
              <span class="report-type-badge">PAIR FOCUS</span>
            </div>
            <h4>Currency Pair Focus & Forecasts</h4>
            <p>Detailed pair analysis with current levels, institutional forecasts, market scenarios, and technical dashboard. Priority: EUR/USD.</p>
            <div class="report-type-features">
              <span class="feature-tag">8 Sections</span>
              <span class="feature-tag">2 Pages</span>
              <span class="feature-tag">Forecasts</span>
              <span class="feature-tag">Scenarios</span>
            </div>
            <button class="btn btn-primary btn-sm" data-action="pair-focus">Create Report →</button>
          </div>

          <div class="report-type-card">
            <div class="report-type-header email">
              <span class="report-type-badge">EMAILS</span>
            </div>
            <h4>Email Templates for Revolut Business</h4>
            <p>Professional, factual email templates for commercial teams. No financial advice — pure market data and factual information.</p>
            <div class="report-type-features">
              <span class="feature-tag">6 Templates</span>
              <span class="feature-tag">Factual Only</span>
              <span class="feature-tag">Sourced Data</span>
              <span class="feature-tag">Compliant</span>
            </div>
            <button class="btn btn-primary btn-sm" data-action="email-templates">View Templates →</button>
          </div>
        </div>

        <!-- Key Pairs Monitored -->
        <div class="section-header">
          <h3>Priority FX Pairs</h3>
          <span class="section-subtitle">Core pairs for daily monitoring</span>
        </div>
        <div class="pairs-grid">
          ${renderPairCards()}
        </div>

        <!-- Info Banner -->
        <div class="info-banner">
          <div class="info-banner-icon">ℹ️</div>
          <div class="info-banner-text">
            <strong>Data Integrity Reminder</strong>
            <p>All market data must be manually sourced and verified. Reports contain no auto-generated financial data to ensure accuracy. Every data point should include its source and timestamp.</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderPairCards() {
    const pairs = [
      { pair: 'EUR/USD', flag1: '🇪🇺', flag2: '🇺🇸', desc: 'Euro vs US Dollar' },
      { pair: 'EUR/CHF', flag1: '🇪🇺', flag2: '🇨🇭', desc: 'Euro vs Swiss Franc' },
      { pair: 'CHF/USD', flag1: '🇨🇭', flag2: '🇺🇸', desc: 'Swiss Franc vs US Dollar' },
      { pair: 'CZK/USD', flag1: '🇨🇿', flag2: '🇺🇸', desc: 'Czech Koruna vs US Dollar' },
      { pair: 'USD/HUF', flag1: '🇺🇸', flag2: '🇭🇺', desc: 'US Dollar vs Hungarian Forint' },
      { pair: 'EUR/PLN', flag1: '🇪🇺', flag2: '🇵🇱', desc: 'Euro vs Polish Zloty' },
      { pair: 'USD/PLN', flag1: '🇺🇸', flag2: '🇵🇱', desc: 'US Dollar vs Polish Zloty' },
    ];

    return pairs.map(p => `
      <div class="pair-card" data-action="pair-focus" data-pair="${p.pair.replace('/', '')}">
        <div class="pair-flags">${p.flag1} ${p.flag2}</div>
        <div class="pair-name">${p.pair}</div>
        <div class="pair-desc">${p.desc}</div>
      </div>
    `).join('');
  }

  function setupDashboardListeners() {
    document.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        const action = el.dataset.action;
        navigateTo(action);
      });
    });
  }

  // ─── Sidebar Toggle ───
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 768) {
      sidebar?.classList.toggle('open');
    } else {
      sidebarCollapsed = !sidebarCollapsed;
      sidebar?.classList.toggle('collapsed', sidebarCollapsed);
      document.querySelector('.main-area')?.classList.toggle('sidebar-collapsed', sidebarCollapsed);
    }
  }

  // ─── Modal ───
  function openModal(contentHTML, options = {}) {
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;

    content.className = 'modal-content';
    if (options.wide) content.classList.add('modal-wide');
    if (options.fullscreen) content.classList.add('modal-fullscreen');

    content.innerHTML = `
      <div class="modal-header">
        <h3>${options.title || ''}</h3>
        <button class="modal-close" onclick="App.closeModal()">✕</button>
      </div>
      <div class="modal-body">${contentHTML}</div>
      ${options.footer ? `<div class="modal-footer">${options.footer}</div>` : ''}
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ─── Toast Notifications ───
  function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ─── Utilities ───
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  function updateDateTime() {
    const el = document.getElementById('top-bar-date');
    if (el) {
      el.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      });
    }
  }

  function renderLoadingState(moduleName) {
    return `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading ${moduleName} module...</p>
      </div>
    `;
  }

  // ─── Report Preview (used by all modules) ───
  function openReportPreview(html, title = 'Report Preview') {
    openModal(`
      <div class="report-preview-container">
        <div class="report-preview-actions">
          <button class="btn btn-primary" onclick="App.printReport()">
            🖨️ Print / Export PDF
          </button>
          <button class="btn btn-outline" onclick="App.copyReportHTML()">
            📋 Copy HTML
          </button>
        </div>
        <div class="report-preview-frame" id="report-preview-frame">
          ${html}
        </div>
      </div>
    `, { title, fullscreen: true });

    // Store current report HTML for export
    window._currentReportHTML = html;
  }

  function printReport() {
    const reportHTML = window._currentReportHTML;
    if (!reportHTML) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>FX Report — Kevin Saudubray</title>
        <style>
          @page { size: A4 landscape; margin: 0; }
          body { margin: 0; padding: 0; }
          .report-page { page-break-after: always; }
          .report-page:last-child { page-break-after: auto; }
        </style>
      </head>
      <body>${reportHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }

  function copyReportHTML() {
    const reportHTML = window._currentReportHTML;
    if (!reportHTML) return;

    navigator.clipboard.writeText(reportHTML).then(() => {
      showToast('Report HTML copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy. Try again.', 'error');
    });
  }

  // ─── Public API ───
  return {
    init,
    navigateTo,
    openModal,
    closeModal,
    showToast,
    openReportPreview,
    printReport,
    copyReportHTML,
    toggleSidebar,
  };
})();

// ─── Boot ───
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
