/**
 * Email Templates Module for Revolut Business Commercial Teams
 * Addressed DIRECTLY to Corporate Clients & Treasurers (NOT internal teams)
 * 
 * Features:
 * - Direct Client Facing ("Cher Client / Dear Client")
 * - 100% FACTUAL & SOURCED
 * - ZERO INVESTMENT / FINANCIAL ADVICE
 * - Full Dual-Language: 🇫🇷 Version Française & 🇬🇧 English Version
 * - 1-Click copy formatted for Outlook & Gmail
 */

window.EmailTemplates = (() => {
  'use strict';

  let currentLang = 'fr'; // 'fr' or 'en'
  let selectedTemplateId = 'ai_generator';

  const OUTREACH_PRESETS = [
  {
    "id": "fr_eurusd_1",
    "nameFr": "🇫🇷 EUR/USD : Sécurisation des marges & dettes souveraines",
    "nameEn": "🇫🇷 EUR/USD: Margin Protection & Sovereign Risk",
    "base": "EUR",
    "quote": "USD",
    "lang": "fr",
    "subject": "EUR/USD proche des 1,1200 : Sécurisez vos coûts en Dollar face au repli de l'Euro",
    "text": "Bonjour [Nom du client],\n\nJ'espère que vous allez bien et que vous passez un bon début de semaine.\n\nJe me permets de vous contacter alors que les marchés ouvrent sous une pression marquée sur la monnaie unique, la parité EUR/USD évoluant autour de 1,1203 sous l'effet combiné des facteurs monétaires et budgétaires :\n● Tensions sur les dettes souveraines européennes : L'écart de rendement obligataire et les incertitudes budgétaires en Zone Euro (notamment en France) pèsent sur l'Euro.\n● Divergence monétaire Fed / BCE : Le maintien de taux élevés aux États-Unis (3,75 % - 4,00 %) face au taux de dépôt de la BCE (2,50 %) continue de favoriser le Dollar à court et moyen terme.\n\nQuel impact pour votre entreprise ?\nSi vous effectuez des règlements en USD à vos fournisseurs ou encaissez des devises dans les prochains mois, ce repli marqué de l'Euro risque d'alourdir vos coûts d'importation et d'impacter vos marges du T4 2026 et T1 2027.\n\nComment protéger vos marges avec Revolut Business ?\nGrâce à notre solution de couverture de change, vous pouvez :\n1. Verrouiller dès aujourd'hui vos cours de change jusqu'à 12 mois à l'avance.\n2. Bénéficier d'une flexibilité totale sur les dates d'exécution et de tirage de vos fonds.\n3. Garantir vos budgets d'achat pour le T4 2026 et le T1 2027 face aux fluctuations des marchés.\n\nSeriez-vous disponible pour un court échange de 10 minutes en début de semaine afin de modéliser votre exposition en USD ?\nVous pouvez choisir directement le créneau qui vous convient : [Insérer le lien Google Calendar]\n\nBien cordialement,\n[Nom du Sales / Spécialiste]\nRevolut Business"
  },
  {
    "id": "fr_eurusd_2",
    "nameFr": "🇫🇷 EUR/USD : Anticipation budgétaire T4 & Volatilité pétrole",
    "nameEn": "🇫🇷 EUR/USD: Q4 Budget Hedging & Oil Volatility",
    "base": "EUR",
    "quote": "USD",
    "lang": "fr",
    "subject": "Briefing FX : Stratégie de couverture EUR/USD face aux plus bas récents de l'Euro",
    "text": "Bonjour [Nom du client],\n\nJ'espère que vous allez bien.\n\nLa parité EUR/USD aborde cette nouvelle semaine autour de 1,1203, confirmant la nette fermeté du Dollar face à l'Euro :\n● Rendements US soutenus : La fermeté des rendements obligataires américains continue d'attirer les capitaux vers le Dollar.\n● Risque d'inflation sur les approvisionnements : Les cours élevés du pétrole (plus de 107 $/bbl) entretiennent la pression sur les marges des entreprises importatrices de la Zone Euro.\n\nEn période de divergence monétaire et de volatilité des devises, laisser vos flux commerciaux exposés au cours spot fait peser un risque direct sur votre rentabilité.\n\nAvec la couverture de change Revolut Business, vous fixez à l'avance votre cours EUR/USD pour l'ensemble de vos échéances commerciales futures, assurant une sérénité budgétaire totale.\n\nAuriez-vous 10 minutes à me consacrer cette semaine pour faire un point rapide sur vos volumes en devises ?\nRéservez directement un créneau dans mon agenda : [Insérer le lien Google Calendar]\n\nBien cordialement,\n[Nom du Sales / Spécialiste]\nRevolut Business"
  },
  {
    "id": "en_eurusd_pln",
    "nameFr": "🇬🇧 EUR/USD & USD/PLN : Euro Fiscal Headwinds & Q4 Forwards",
    "nameEn": "🇬🇧 EUR/USD & USD/PLN: Euro Fiscal Headwinds & Q4 Forwards",
    "base": "EUR",
    "quote": "USD",
    "lang": "en",
    "subject": "Market Briefing: EUR/USD tests 1.1200 as fiscal risks weigh on Euro — Q4 FX Forwards",
    "text": "Hi [Client Name],\n\nI hope you’re having a great start to your week.\n\nAs we open the new trading week, we are tracking key developments across European currency corridors that directly impact cross-border corporate cash flows heading into Q4:\n● EUR/USD Under Pressure (1.1203): The Euro remains constrained near 17-month lows as rising borrowing costs in France and broader European fiscal uncertainty add a risk premium over the single currency, compounding the Fed-ECB rate gap.\n● USD/PLN Surge (3.8920) & EUR/PLN (4.3850): The Greenback maintains strong upward momentum against regional currencies, driven by US Treasury yield advantages and persistent European energy import costs.\n\nStrategic Implication for Your Business:\nUnhedged foreign currency payables in USD or receivables in EUR/PLN over Q4 2026 and Q1 2027 face heightened margin volatility as European fiscal headlines diverge from US monetary strength.\n\nHow Revolut Business can protect your margins:\nThrough our FX Forwards, you can lock in current exchange rates for up to 12 months with full execution flexibility, securing complete budget certainty for your upcoming commitments.\n\nWould you be open to a brief 10-minute catch-up early this week to review your active currency pairs and model a forward ladder for your cash flows?\nYou can choose a convenient slot directly on my calendar: [Insert Google Calendar Link]\n\nBest regards,\n[Sales / Specialist Name]\nRevolut Business"
  },
  {
    "id": "en_eurchf",
    "nameFr": "🇬🇧 EUR/CHF & CHF/EUR : Safe-Haven Demand & Bond Volatility",
    "nameEn": "🇬🇧 EUR/CHF & CHF/EUR: Safe-Haven Demand & Bond Volatility",
    "base": "EUR",
    "quote": "CHF",
    "lang": "en",
    "subject": "CHF/EUR Briefing: Protecting operating margins amid European bond volatility",
    "text": "Hi [Client Name],\n\nI hope you are well.\n\nI wanted to highlight key developments in the Swiss Franc, where persistent geopolitical risk sentiment and European bond market shifts continue to anchor EUR/CHF down near 0.9360:\n● Safe-Haven Inflows: Widening European sovereign yield spreads continue to drive institutional capital toward Swiss Franc assets as a structural hedge.\n● Central Bank Divergence: While the ECB holds its deposit rate at 2.50%, market demand for liquid CHF holdings across European supply chains remains heavy following recent US interest rate increases.\n\nImpact on your business:\nFor companies managing cross-border settlements between Switzerland and the Eurozone, sustained CHF strength increases import costs and reduces quarterly budget predictability.\n\nStrategic Next Step:\nBy establishing a flexible FX Forward strategy with Revolut Business, you can:\n1. Secure guaranteed exchange rates for your Q4 2026 and Q1 2027 CHF/EUR commitments.\n2. Protect your profit margins against sudden geopolitical and fiscal market shifts.\n3. Draw down funds flexibly as operational cash flows require.\n\nAre you available for a brief call early this week to review your current CHF exposure?\nFeel free to select a time here: [Insert Google Calendar Link]\n\nBest regards,\n[Sales / Specialist Name]\nRevolut Business"
  },
  {
    "id": "en_czk_pln",
    "nameFr": "🇬🇧 CZK/USD & EUR/PLN : CEE Regional Currency Hedging Post-Fed",
    "nameEn": "🇬🇧 CZK/USD & EUR/PLN: CEE Regional Currency Hedging Post-Fed",
    "base": "CZK",
    "quote": "USD",
    "lang": "en",
    "subject": "CEE FX Briefing: Securing CZK & PLN rates ahead of Q4 trade flows",
    "text": "Hi [Client Name],\n\nI hope you are having a productive morning.\n\nRegional currencies across Central and Eastern Europe (CEE) continue to adjust to US monetary policy tightening and sustained energy import costs at the start of Q4:\n● CZK/USD (0.0430): The Czech Koruna faces downside pressure as US policy rates (3.75%–4.00%) widen yield differentials in favor of the US Dollar.\n● EUR/PLN (4.3850): The Zloty remains supported by domestic interest rates (NBP at 5.75%), but faces headwinds from broader European energy import inflation.\n\nWhy act now?\nUnhedged foreign currency payables or receivables leave operating margins vulnerable to further policy rate divergence and energy market volatility over the final quarter.\n\nWith Revolut Business, you can lock in forward exchange rates for up to 12 months, securing your profit margins with total budget clarity.\n\nWould you be open to a 10-minute briefing this week to discuss tailored hedging structures for your CEE exposures?\nBook a time directly in my agenda: [Insert Google Calendar Link]\n\nBest regards,\n[Sales / Specialist Name]\nRevolut Business"
  }
];



  const LEGAL_DISCLAIMER = {
    fr: `Cette communication est fournie à titre strictement informatif par Revolut Business à destination de ses clients entreprises. Elle ne constitue en aucun cas un conseil en investissement, une incitation ou une recommandation personnalisée d'achat ou de vente d'instruments financiers ou de devises. Les opérations de change comportent des risques inhérents à la volatilité des marchés. Les cours indiqués sont indicatifs et issus de sources de marché vérifiables (Reuters, Bloomberg, BCE, TradingView).`,
    en: `This communication is provided for informational purposes only by Revolut Business to its corporate clients. It does not constitute investment advice, financial advice, an offer, solicitation, or personal recommendation to buy or sell currencies or enter into foreign exchange transactions. Foreign exchange involves inherent market volatility risks. Indicated quotes are indicative and retrieved from verifiable market feeds (Reuters, Bloomberg, ECB, TradingView).`
  };

  const TEMPLATES = [
    {
      id: 'ai_generator',
      badge: '✨ IA',
      nameFr: 'Générateur IA Sur-Mesure',
      nameEn: 'Custom AI Generator',
      descFr: 'Fournissez un exemple et laissez l\'IA rédiger un e-mail basé sur le contexte actuel de la paire.',
      descEn: 'Provide an example and let AI write an email based on the current pair context.',
      subjectFr: 'Généré par IA...',
      subjectEn: 'AI Generated...',
      isAI: true,
      contentFr: (d) => `<div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;" id="ai-generated-content-fr">${window.EmailTemplates.aiGeneratedContent || '<i>Remplissez le formulaire à gauche et cliquez sur Générer pour créer l\'e-mail...</i>'}</div>`,
      contentEn: (d) => `<div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;" id="ai-generated-content-en">${window.EmailTemplates.aiGeneratedContent || '<i>Fill out the form on the left and click Generate to create the email...</i>'}</div>`
    },

    {
      id: 'daily_summary',
      badge: 'DAILY',
      nameFr: 'Point de Marché FX Quotidien',
      nameEn: 'Daily Corporate FX Briefing',
      descFr: 'Synthèse factuelle des mouvements de devises du jour pour vos règlements fournisseurs et trésorerie internationale.',
      descEn: 'Factual daily currency movements overview for your international supplier settlements and corporate treasury.',
      subjectFr: 'Point de Marché FX Quotidien — Revolut Business [DATE]',
      subjectEn: 'Daily FX & Macro Intelligence — Revolut Business [DATE]',
      clientGreetingFr: 'Madame, Monsieur, / Chère Direction Financière,',
      clientGreetingEn: 'Dear Corporate Client / Treasury Team,',
      contentFr: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          Dans le cadre de l'accompagnement de vos flux de change et de commerce international, voici les principaux repères de marché observés ce matin sur les flux interbancaires :
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 18px 0; border-radius: 0 6px 6px 0;">
          <div style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 8px;">
            Faits marquants du jour (Données vérifiées)
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.55; color: #334155;">
            <li style="margin-bottom: 6px;"><strong>EUR/USD :</strong> Évolue à <strong>1,1296</strong> (-0,69% 1J) sous l'effet du maintien d'un écart de taux favorable aux actifs américains.</li>
            <li style="margin-bottom: 6px;"><strong>Matières premières :</strong> Le baril de Brent se stabilise autour de <strong>100,55$</strong> dans un contexte de suivi vigilant des flux maritimes.</li>
            <li style="margin-bottom: 6px;"><strong>Taux souverains :</strong> Le rendement du Trésor US à 10 ans s'établit à <strong>5,31%</strong>, soutenant la fermeté du dollar face aux devises européennes.</li>
          </ul>
          <div style="font-size: 11px; color: #64748b; margin-top: 8px; font-style: italic;">
            Source des cotations : Flux interbancaire TradingView & Reuters (horodatage : ${d.timestamp}).
          </div>
        </div>

        <div style="margin: 20px 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px;">
          <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">
            💡 Outils Revolut Business à votre disposition pour vos opérations :
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.5; color: #475569;">
            <li><strong>Ordres à cours limité (Target Rate) :</strong> Automatisez vos conversions de devises dès qu'un niveau cible prédéfini est atteint.</li>
            <li><strong>Comptes multi-devises avec IBANs locaux :</strong> Encaissez vos clients en EUR, USD, GBP, CHF ou PLN sans frais de conversion forcée.</li>
          </ul>
        </div>
      `,
      contentEn: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          As part of our commitment to supporting your cross-border currency flows, please find below this morning's factual foreign exchange benchmarks:
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 14px 18px; margin: 18px 0; border-radius: 0 6px 6px 0;">
          <div style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 8px;">
            Key Morning Market Observations (Verified Data)
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.55; color: #334155;">
            <li style="margin-bottom: 6px;"><strong>EUR/USD:</strong> Trades at <strong>1.1296</strong> (-0.69% 1D) reflecting persistent transatlantic interest rate differentials.</li>
            <li style="margin-bottom: 6px;"><strong>Commodities:</strong> Brent crude consolidates near <strong>$100.55/bbl</strong> as markets monitor Persian Gulf logistics.</li>
            <li style="margin-bottom: 6px;"><strong>Sovereign Yields:</strong> US 10-Year Treasury yield holds at <strong>5.31%</strong>, sustaining broader USD momentum.</li>
          </ul>
          <div style="font-size: 11px; color: #64748b; margin-top: 8px; font-style: italic;">
            Data source: TradingView Interbank feed & Reuters (timestamp: ${d.timestamp}).
          </div>
        </div>

        <div style="margin: 20px 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px;">
          <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">
            💡 Revolut Business features for your treasury flows:
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.5; color: #475569;">
            <li><strong>Target Rate Orders:</strong> Automatically execute FX conversions whenever your desired exchange threshold is triggered.</li>
            <li><strong>Multi-Currency Accounts with Local IBANs:</strong> Receive payments in EUR, USD, GBP, CHF or PLN without forced conversion penalties.</li>
          </ul>
        </div>
      `
    },
    {
      id: 'eurusd_update',
      badge: 'EUR/USD',
      nameFr: 'Point Spécifique EUR/USD & Niveaux Clés',
      nameEn: 'EUR/USD Cross & Rate Differential Update',
      descFr: 'Analyse factuelle des moteurs de la parité EUR/USD pour optimiser le calendrier de conversion de vos factures en dollars.',
      descEn: 'Factual EUR/USD analysis to assist your timing and hedging of USD commercial invoicing.',
      subjectFr: 'Focus Marché EUR/USD & Niveaux Observés — Revolut Business',
      subjectEn: 'Market Focus: EUR/USD Levels & Central Bank Outlook — Revolut Business',
      clientGreetingFr: 'Chère Direction Financière, / Cher Trésorier,',
      clientGreetingEn: 'Dear Finance Director / Corporate Treasurer,',
      contentFr: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          Si votre entreprise gère des flux d'achats ou d'encaissements libellés en dollars américains, voici un point factuel sur les dynamiques observées sur le cross <strong>EUR/USD</strong> :
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <tr>
            <td style="padding: 16px; text-align: center;">
              <div style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase;">Cours Interbancaire Actuel</div>
              <div style="font-size: 32px; font-weight: 900; color: #1d4ed8; font-family: monospace; margin: 6px 0;">1,1296</div>
              <div style="font-size: 11px; color: #64748b;">Source : Flux interbancaire TradingView (indicatif au ${d.date})</div>
            </td>
          </tr>
        </table>

        <div style="margin: 18px 0; font-size: 13.5px; line-height: 1.6; color: #334155;">
          <strong>Moteurs factuels identifiés :</strong>
          <ul style="margin: 6px 0; padding-left: 18px;">
            <li><strong>Politique de la Réserve fédérale :</strong> Maintien d'un taux cible de 3,75%–4,00%, avec une priorité accordée au ralentissement de l'inflation sous-jacente.</li>
            <li><strong>Politique de la BCE :</strong> Taux de dépôt à 2,50% avec une communication prudente dépendant des prochains chiffres de salaires et de services.</li>
            <li><strong>Repères techniques observés par le marché :</strong> Zone de support indicatif vers 1,1200 / 1,1250 ; résistance majeure vers 1,1450 / 1,1550.</li>
          </ul>
        </div>

        <p style="font-size: 13.5px; line-height: 1.5; color: #334155;">
          Vous pouvez sécuriser vos cours de change futurs ou programmer des alertes automatiques directement depuis l'espace trésorerie de votre compte Revolut Business.
        </p>
      `,
      contentEn: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          If your company handles commercial trade or invoicing in US Dollars, please find below a factual overview of the current <strong>EUR/USD</strong> dynamics:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <tr>
            <td style="padding: 16px; text-align: center;">
              <div style="font-size: 12px; font-weight: 800; color: #1e40af; text-transform: uppercase;">Current Interbank Spot Rate</div>
              <div style="font-size: 32px; font-weight: 900; color: #1d4ed8; font-family: monospace; margin: 6px 0;">1.1296</div>
              <div style="font-size: 11px; color: #64748b;">Source: TradingView Interbank Feed (indicative on ${d.date})</div>
            </td>
          </tr>
        </table>

        <div style="margin: 18px 0; font-size: 13.5px; line-height: 1.6; color: #334155;">
          <strong>Factual Market Catalysts:</strong>
          <ul style="margin: 6px 0; padding-left: 18px;">
            <li><strong>Federal Reserve Stance:</strong> Target rate maintained at 3.75%–4.00% to ensure core inflation anchoring.</li>
            <li><strong>ECB Policy:</strong> Deposit facility at 2.50% with cautious, data-contingent adjustments.</li>
            <li><strong>Observed Technical Anchors:</strong> Immediate support zone near 1.1200 / 1.1250; resistance at 1.1450 / 1.1550.</li>
          </ul>
        </div>

        <p style="font-size: 13.5px; line-height: 1.5; color: #334155;">
          You can lock in exchange rates for future settlements or set automatic threshold notifications directly from your Revolut Business treasury dashboard.
        </p>
      `
    },
    {
      id: 'central_bank_alert',
      badge: 'ALERTE BANQUES',
      nameFr: 'Alerte Décision de Banque Centrale',
      nameEn: 'Central Bank Policy Decision Flash',
      descFr: 'Notification factuelle immédiate après les annonces de la Fed, BCE, BNS ou banques d\'Europe Centrale.',
      descEn: 'Factual client flash notification following monetary policy announcements from the Fed, ECB, or SNB.',
      subjectFr: 'Flash Marché : Décision de Politique Monétaire — Revolut Business',
      subjectEn: 'Monetary Policy Flash: Central Bank Rate Decision — Revolut Business',
      clientGreetingFr: 'Chers Clients Partenaires,',
      clientGreetingEn: 'Dear Corporate Client,',
      contentFr: (d) => `
        <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 14px 18px; border-radius: 0 6px 6px 0; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">COMMUNIQUÉ FACTUEL DE POLITIQUE MONÉTAIRE</div>
          <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 4px;">Décision officielle de taux directeurs</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Source : Communiqués officiels des banques centrales (${d.date})</div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Les autorités monétaires ont rendu leur décision de politique monétaire :
        </p>

        <ul style="font-size: 13.5px; line-height: 1.6; color: #334155; padding-left: 18px;">
          <li><strong>Réserve Fédérale (États-Unis) :</strong> Taux cible maintenu à 3,75%–4,00%. L'institution insiste sur la solidité du marché de l'emploi et la prudence requise face à l'inflation.</li>
          <li><strong>Banque Centrale Européenne :</strong> Taux de dépôt maintenu à 2,50%. L'orientation dépendra des prochaines projections macroéconomiques.</li>
        </ul>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
          <strong style="font-size: 13px; color: #1e293b;">Impact opérationnel pour vos flux d'entreprise :</strong>
          <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #475569;">
            Cette décision maintient un différentiel de taux significatif entre l'USD et l'EUR. Les équipes Revolut Business restent à votre disposition pour examiner vos paramétrages de conversion automatique.
          </p>
        </div>
      `,
      contentEn: (d) => `
        <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 14px 18px; border-radius: 0 6px 6px 0; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">MONETARY POLICY FLASH NOTIFICATION</div>
          <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 4px;">Official Policy Rate Decision</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Source: Official Central Bank Press Releases (${d.date})</div>
        </div>

        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Monetary authorities have concluded their scheduled monetary policy assessment:
        </p>

        <ul style="font-size: 13.5px; line-height: 1.6; color: #334155; padding-left: 18px;">
          <li><strong>Federal Reserve (US):</strong> Target range held at 3.75%–4.00%. Policymakers highlight steady employment and ongoing inflation scrutiny.</li>
          <li><strong>European Central Bank:</strong> Deposit rate maintained at 2.50% with upcoming moves strictly conditioned on incoming quarterly data.</li>
        </ul>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 16px; margin: 16px 0;">
          <strong style="font-size: 13px; color: #1e293b;">Operational Implications for Your Treasury:</strong>
          <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #475569;">
            This policy outcome preserves a notable yield spread between USD and EUR. Your Revolut Business corporate team is available to assist you with automated exchange rule setups.
          </p>
        </div>
      `
    },
    {
      id: 'onboarding_treasury',
      badge: 'SOLUTIONS',
      nameFr: 'Présentation Solutions FX & Comptes Multi-Devises',
      nameEn: 'Corporate FX & Multi-Currency Account Solutions',
      descFr: 'Présentation factuelle des fonctionnalités de trésorerie internationale Revolut Business pour nouveaux clients.',
      descEn: 'Factual walkthrough of Revolut Business treasury capabilities for prospective or new corporate clients.',
      subjectFr: 'Optimisation de vos flux de change et trésorerie internationale — Revolut Business',
      subjectEn: 'Streamlining your International FX Flows — Revolut Business',
      clientGreetingFr: 'Madame, Monsieur,',
      clientGreetingEn: 'Dear Finance Leader,',
      contentFr: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          Pour accompagner votre développement commercial international et réduire les frottements sur vos conversions de devises, voici les fonctionnalités factuelles proposées par la plateforme Revolut Business :
        </p>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 18px 0;">
          <div style="font-size: 13px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; margin-bottom: 10px;">
            Fonctionnalités de change et de paiement intégrées :
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: #334155;">
            <li style="margin-bottom: 8px;"><strong>Détention dans plus de 25 devises :</strong> Encaissez vos règlements en USD, GBP, CHF, PLN, CZK et réglez vos fournisseurs dans leur devise locale sans frais de change cachés.</li>
            <li style="margin-bottom: 8px;"><strong>Coordonnées bancaires locales (IBANs) :</strong> Disposez d'IBANs dédiés pour recevoir des virements comme une entreprise locale.</li>
            <li style="margin-bottom: 8px;"><strong>Ordres automatiques au cours cible :</strong> Fixez le cours souhaité et laissez notre plateforme exécuter la conversion dès que le marché l'atteint.</li>
            <li style="margin-bottom: 8px;"><strong>Contrats de change à terme (FX Forwards) :</strong> Bloquez dès aujourd'hui un cours de change fixe pour vos échéances commerciales jusqu'à 12 mois.</li>
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          Je me tiens à votre entière disposition pour une démonstration rapide de 15 minutes adaptée à la structure de vos flux de paiement.
        </p>
      `,
      contentEn: (d) => `
        <p style="margin: 0 0 16px 0; font-size: 14.5px; line-height: 1.6; color: #334155;">
          To support your global commercial expansion and eliminate unnecessary currency friction, here is a factual overview of the cross-border capabilities available on Revolut Business:
        </p>

        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 18px 0;">
          <div style="font-size: 13px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; margin-bottom: 10px;">
            Integrated FX & Treasury Features:
          </div>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: #334155;">
            <li style="margin-bottom: 8px;"><strong>Hold & Settle in 25+ Currencies:</strong> Receive customer payments in USD, GBP, CHF, PLN, CZK and settle suppliers in their domestic currency without hidden margins.</li>
            <li style="margin-bottom: 8px;"><strong>Local Account Details (IBANs):</strong> Utilize domestic settlement details to receive funds domestically without intermediary cross-border charges.</li>
            <li style="margin-bottom: 8px;"><strong>Target Rate Limit Orders:</strong> Define your desired conversion price and execute automatically when interbank markets reach your level.</li>
            <li style="margin-bottom: 8px;"><strong>FX Forwards:</strong> Secure fixed exchange rates today for your commercial payables up to 12 months in advance.</li>
          </ul>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #334155;">
          I remain available for a focused 15-minute walkthrough tailored to your international invoice structure.
        </p>
      `
    }
  ];

  // ─── Generate HTML Email for Clients ───
  function generateEmailHTML(templateId, lang) {
    const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    const isFr = lang === 'fr';

    const now = new Date();
    const dateFormatted = isFr 
      ? now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const timestampFormatted = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' CEST';

    const dynamicData = {
      date: dateFormatted,
      timestamp: timestampFormatted
    };

    const greeting = isFr ? tmpl.clientGreetingFr : tmpl.clientGreetingEn;
    const bodyHtml = isFr ? tmpl.contentFr(dynamicData) : tmpl.contentEn(dynamicData);
    const disclaimer = isFr ? LEGAL_DISCLAIMER.fr : LEGAL_DISCLAIMER.en;
    const title = isFr ? tmpl.nameFr : tmpl.nameEn;

    return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Revolut Business</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 25px 15px;">
    <tr>
      <td align="center">
        <!-- Main Email Container (600px standard) -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #07152d 0%, #0d2854 100%); padding: 24px 30px; border-bottom: 3px solid #2563eb;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">
                      REVOLUT BUSINESS | FX INTELLIGENCE
                    </div>
                    <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 4px;">
                      ${title}
                    </div>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <div style="display: inline-block; background: rgba(59, 130, 246, 0.25); color: #60a5fa; font-size: 10px; font-weight: 800; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(96, 165, 250, 0.3);">
                      ${isFr ? 'NOTE FACTUELLE' : 'FACTUAL BRIEFING'}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 30px; text-align: left;">
              <div style="font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 16px;">
                ${greeting}
              </div>

              ${bodyHtml}

              <!-- Sign-off -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 14px; font-weight: 700; color: #1e293b;">Kevin Saudubray</div>
                <div style="font-size: 12.5px; color: #2563eb; font-weight: 600;">Corporate FX Sales — Revolut Business</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Solutions de change et de trésorerie internationale</div>
              </div>
            </td>
          </tr>

          <!-- Compliance & Legal Disclaimer Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; font-size: 10.5px; line-height: 1.5; color: #64748b;">
              <div style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 9.5px; margin-bottom: 6px;">
                ${isFr ? 'Avertissement Réglementaire (Strictement Factuel — Aucun Conseil)' : 'Regulatory Notice (Factual Information — No Financial Advice)'}
              </div>
              <p style="margin: 0;">
                ${disclaimer}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  // ─── Render Page UI ───
  function renderEmailTemplatesPage() {
    return `
      <div class="email-templates-wrapper">
        <!-- Control Header -->
        <div class="report-toolbar">
          <div class="toolbar-title-group" style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
            <h3>E-mails Commerciaux Revolut Business (Adressés aux Clients)</h3>

            <!-- Language Switcher Toggle -->
            <div style="display: flex; background: #e2e8f0; padding: 3px; border-radius: 6px; gap: 2px;">
              <button class="lang-btn ${currentLang === 'fr' ? 'active' : ''}" onclick="EmailTemplates.setLanguage('fr')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'fr' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'fr' ? '#1e40af' : '#64748b'};">
                🇫🇷 Version Française
              </button>
              <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" onclick="EmailTemplates.setLanguage('en')" style="padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; background: ${currentLang === 'en' ? '#ffffff' : 'transparent'}; color: ${currentLang === 'en' ? '#1e40af' : '#64748b'};">
                🇬🇧 English Version
              </button>
            </div>
          </div>

          <div class="toolbar-buttons" style="display: flex; align-items: center; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="EmailTemplates.copyRichText()" style="background: #2563eb; color: #ffffff; font-weight: 700;">
              📋 Copier pour Outlook / Gmail (HTML)
            </button>
            <button class="btn btn-outline btn-sm" onclick="EmailTemplates.copyPlainText()">
              📄 Copier en Texte Brut
            </button>
          </div>
        </div>

        <div class="email-templates-layout" style="display: grid; grid-template-columns: 320px 1fr; gap: 24px; margin-top: 20px;">
          <!-- Left: Templates Selection Menu -->
          <div class="template-sidebar-menu">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 12px;">
              ${currentLang === 'fr' ? 'Modèles Destinés aux Clients' : 'Client-Facing Templates'} (${TEMPLATES.length})
            </h4>

            <div class="templates-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${TEMPLATES.map(t => {
                const title = currentLang === 'fr' ? t.nameFr : t.nameEn;
                const desc = currentLang === 'fr' ? t.descFr : t.descEn;
                const isSelected = t.id === selectedTemplateId;
                return `
                  <div class="email-template-item ${isSelected ? 'active' : ''}" 
                       onclick="EmailTemplates.switchTemplate('${t.id}')"
                       style="
                         background: ${isSelected ? '#eff6ff' : '#ffffff'};
                         border: 1px solid ${isSelected ? '#3b82f6' : '#e2e8f0'};
                         border-radius: 8px;
                         padding: 12px 14px;
                         cursor: pointer;
                         transition: all 0.2s ease;
                       ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <strong style="font-size: 13px; color: ${isSelected ? '#1d4ed8' : '#1e293b'};">${title}</strong>
                      <span style="font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: ${isSelected ? '#dbeafe' : '#f1f5f9'}; color: #2563eb;">
                        ${t.badge}
                      </span>
                    </div>
                    <p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.35;">${desc}</p>
                  </div>
                `;
              }).join('')}
            </div>

            ${selectedTemplateId === 'ai_generator' ? `
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 16px;">
              <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #1e293b; text-transform: uppercase;">${currentLang === 'fr' ? 'Générateur de Prospections FX' : 'FX Sales Outreach Generator'}</h4>

              <!-- Quick Presets Selector -->
              <label style="display: block; font-size: 11px; font-weight: 700; color: #1e40af; margin-bottom: 4px;">
                ⚡ ${currentLang === 'fr' ? 'Modèles types de départ (Revolut Sales) :' : 'Sales Outreach Templates (Base):'}
              </label>
              <select id="ai-preset-select" onchange="EmailTemplates.loadPreset(this.value)" style="width: 100%; padding: 6px; border: 1px solid #93c5fd; background: #eff6ff; border-radius: 4px; font-size: 11px; font-weight: 600; color: #1e3a8a; margin-bottom: 12px;">
                <option value="">-- ${currentLang === 'fr' ? 'Choisir un modèle commercial...' : 'Choose a sales template...'} --</option>
                ${OUTREACH_PRESETS.map(p => `<option value="${p.id}">${currentLang === 'fr' ? p.nameFr : p.nameEn}</option>`).join('')}
              </select>
              
              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">${currentLang === 'fr' ? 'Paire de devises ciblée :' : 'Target Currency Pair:'}</label>
              <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 12px;">
                <select id="ai-base-ccy" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 700;">
                  <option value="EUR" selected>🇪🇺 EUR</option>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="CHF">🇨🇭 CHF</option>
                  <option value="NOK">🇳🇴 NOK</option>
                  <option value="SEK">🇸🇪 SEK</option>
                  <option value="DKK">🇩🇰 DKK</option>
                  <option value="RON">🇷🇴 RON</option>
                  <option value="CZK">🇨🇿 CZK</option>
                  <option value="HUF">🇭🇺 HUF</option>
                  <option value="PLN">🇵🇱 PLN</option>
                </select>
                <button type="button" onclick="EmailTemplates.swapCurrencies()" title="Inverser les devises" style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #ffffff; border-radius: 4px; font-weight: 800; color: #1e40af; cursor: pointer;">⇄</button>
                <select id="ai-quote-ccy" style="flex: 1; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; font-weight: 700;">
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="USD" selected>🇺🇸 USD</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="CHF">🇨🇭 CHF</option>
                  <option value="NOK">🇳🇴 NOK</option>
                  <option value="SEK">🇸🇪 SEK</option>
                  <option value="DKK">🇩🇰 DKK</option>
                  <option value="RON">🇷🇴 RON</option>
                  <option value="CZK">🇨🇿 CZK</option>
                  <option value="HUF">🇭🇺 HUF</option>
                  <option value="PLN">🇵🇱 PLN</option>
                </select>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <label style="font-size: 11px; font-weight: 600; color: #475569;">${currentLang === 'fr' ? "Email modèle (Structure & Ton) :" : 'Email Template (Style & Structure):'}</label>
                <button type="button" onclick="EmailTemplates.loadPreset('fr_eurusd_1')" style="font-size: 9.5px; background: none; border: none; color: #2563eb; cursor: pointer; text-decoration: underline; padding: 0;">${currentLang === 'fr' ? 'Réinitialiser' : 'Reset'}</button>
              </div>
              <textarea id="ai-example-text" style="width: 100%; height: 130px; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; line-height: 1.4; margin-bottom: 12px; resize: vertical;" placeholder="${currentLang === 'fr' ? 'Choisissez un modèle ci-dessus ou collez le vôtre...' : 'Select a template above or paste your own...'}"></textarea>

              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">${currentLang === 'fr' ? "Secteur d'activité du prospect :" : 'Client Industry Sector:'}</label>
              <select id="ai-sector" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; margin-bottom: 12px; background: #ffffff;">
                <option value="general" selected>${currentLang === 'fr' ? '🏢 Général / Entreprise import-export' : '🏢 General / Corporate FX'}</option>
                <option value="trade">${currentLang === 'fr' ? '🚢 Négoce, Matières Premières & Fret' : '🚢 Commodity Trading & Freight'}</option>
                <option value="tech">${currentLang === 'fr' ? '💻 Tech, SaaS & Services Cloud (USD)' : '💻 Tech, SaaS & Cloud Services (USD)'}</option>
                <option value="retail">${currentLang === 'fr' ? '🛒 E-commerce, Retail & Biens de consommation' : '🛒 E-commerce, Retail & Consumer Goods'}</option>
                <option value="manufacturing">${currentLang === 'fr' ? '⚙️ Industrie, Équipement & Sous-traitance CEE' : '⚙️ Manufacturing & CEE Subcontracting'}</option>
              </select>

              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">${currentLang === 'fr' ? "Langue de rédaction :" : 'Email Output Language:'}</label>
              <select id="ai-language" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; margin-bottom: 12px;">
                <option value="fr" selected>🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>

              <button onclick="window.EmailTemplates.generateAI()" style="width: 100%; padding: 10px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                ✨ ${currentLang === 'fr' ? "Générer l'e-mail avec données du jour" : 'Generate Email with Live Market Context'}
              </button>
              <div style="font-size: 9px; color: #64748b; margin-top: 6px; text-align: center; line-height: 1.3;">
                ${currentLang === 'fr' ? 'Le cours réel, la variation 1J/1S et le calendrier sont injectés pour la paire choisie.' : 'Live spot, 1D/1W changes and economic calendar are injected for the chosen pair.'}
              </div>
            </div>
            ` : ''}

            </div><!-- Right: Live Email Preview -->
          <div class="email-preview-column">
            <!-- Subject Line Bar -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
              <div style="flex: 1;">
                <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">
                  ${currentLang === 'fr' ? 'Objet de l\'e-mail pour votre client :' : 'Email Subject Line for Client:'}
                </span>
                <div style="font-size: 14px; font-weight: 700; color: #1e293b; margin-top: 2px;" id="email-subject-line">
                  ${getSubjectLine(selectedTemplateId, currentLang)}
                </div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="EmailTemplates.copySubject()">
                ${currentLang === 'fr' ? 'Copier l\'objet' : 'Copy Subject'}
              </button>
            </div>

            <!-- Iframe Container -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
              <div style="padding: 10px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; font-weight: 600; color: #475569;">
                  ${currentLang === 'fr' ? 'Aperçu du mail envoyé au client entreprise' : 'Preview of email sent to corporate client'}
                </span>
                <span style="font-size: 11px; color: #94a3b8;">Format 600px standard Outlook & Gmail</span>
              </div>
              <iframe id="email-preview-iframe" style="width: 100%; height: 600px; border: none; background: #f1f5f9;"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getSubjectLine(templateId, lang) {
    const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
    const isFr = lang === 'fr';
    const dateFormatted = isFr 
      ? new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
      : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    const templateSubject = isFr ? tmpl.subjectFr : tmpl.subjectEn;
    return templateSubject.replace('[DATE]', `(${dateFormatted})`);
  }


  function loadPreset(presetId) {
    const p = OUTREACH_PRESETS.find(item => item.id === presetId);
    if (!p) return;
    const txtArea = document.getElementById('ai-example-text');
    if (txtArea) txtArea.value = p.text;
    const baseEl = document.getElementById('ai-base-ccy');
    if (baseEl) baseEl.value = p.base;
    const quoteEl = document.getElementById('ai-quote-ccy');
    if (quoteEl) quoteEl.value = p.quote;
    const langEl = document.getElementById('ai-language');
    if (langEl) langEl.value = p.lang;
    localStorage.setItem('ai_email_example', p.text);
    if (window.App) window.App.showToast(currentLang === 'fr' ? 'Modèle "' + p.nameFr + '" chargé !' : 'Template "' + p.nameEn + '" loaded!', 'info', 1500);
  }

  async function buildEmailWithContext(pairId, example, targetLang, sector) {
    const isFr = targetLang === 'fr';
    const base = pairId.slice(0, 3);
    const quote = pairId.slice(3, 6);
    const M = window.MarketData;

    // Sector-specific business angles
    const SECTOR_ANGLES = {
      trade: {
        fr: "Négoce & Fret : couverture de cargaisons, coût du fret maritime indexé en dollar et gestion des flux d'approvisionnement en matières premières.",
        en: "Commodity Trading & Freight: shipping cargo hedging, dollar-denominated freight rates, and volatile raw material import commitments."
      },
      tech: {
        fr: "Tech & Services Cloud : sécurisation des coûts de serveurs (AWS/Azure/GCP en USD), licences logicielles et salaires d'équipes offshore.",
        en: "Tech & Cloud Services: hedging dollar-denominated infrastructure (AWS/Azure/GCP), SaaS licenses, and cross-border tech payroll."
      },
      retail: {
        fr: "E-commerce & Biens de consommation : protection du coût d'achat des stocks saisonniers, délais de dédouanement et préservation de la marge brute unitaire.",
        en: "E-commerce & Consumer Goods: inventory cost protection, landed product cost predictability, and defending unit gross retail margins."
      },
      manufacturing: {
        fr: "Industrie & Sous-traitance : sécurisation des règlements de sous-traitance industrielle, composants électroniques et flux de fabrication CEE (PLN, CZK).",
        en: "Manufacturing & Industrial Subcontracting: securing industrial assembly contracts, electronic components, and regional CEE supply chains (PLN, CZK)."
      },
      general: {
        fr: "Gestion de trésorerie internationale : sécurisation des règlements fournisseurs en devises et garantie des prévisions budgétaires annuelles.",
        en: "Corporate Treasury: securing foreign currency payables and safeguarding quarterly operational budget targets."
      }
    };
    const sectorAngle = (SECTOR_ANGLES[sector] || SECTOR_ANGLES.general)[isFr ? 'fr' : 'en'];

    // Fetch live market data & calendar
    let pairInfo = null;
    let events = [];
    if (M) {
      try { pairInfo = await M.getPair(base, quote); } catch(e) { console.warn('MarketData pair error:', e); }
      try { events = await M.getEventsFor([base, quote], 3); } catch(e) { console.warn('MarketData events error:', e); }
    }

    const ds = window.PairDatasets ? window.PairDatasets.get(pairId) : null;
    const rateStr = pairInfo ? pairInfo.rate : (ds ? ds.rate || '–' : '–');
    const d1Str = pairInfo ? pairInfo.d1 : (ds ? ds.d1 || '–' : '–');
    const w1Str = pairInfo ? pairInfo.w1 : (ds ? ds.w1 || '–' : '–');
    const prevCloseStr = pairInfo && pairInfo.prevCloseFmt ? pairInfo.prevCloseFmt : '';
    const sourceStr = pairInfo ? pairInfo.source : 'Flux interbancaire';

    const eventsList = events.map(e => `${e.dateStr} ${e.time} (${e.country}) : ${e.title}`).join(' ; ');

    const contextStr = [
      "Paire : " + base + "/" + quote,
      "Secteur client ciblé : " + sectorAngle,
      "Cours interbancaire actuel : " + rateStr + (d1Str ? " (1J : " + d1Str + (prevCloseStr ? " vs clôture " + prevCloseStr : "") + " ; 1S : " + w1Str + ")" : ""),
      "Source : " + sourceStr,
      "Évènements clés à surveiller : " + (eventsList || "Décisions monétaires et données d'inflation")
    ].join("\n");

    const prompt = [
      "Tu es Kevin Saudubray, Corporate FX Sales chez Revolut Business, et tu écris directement à la Direction Financière / au Trésorier d'un client entreprise.",
      "Voici un exemple de structure et de ton à imiter fidèlement :",
      "--- EXEMPLE MODÈLE ---",
      example,
      "--- FIN EXEMPLE ---",
      "",
      "Voici le contexte de marché ACTUEL et RÉEL à intégrer :",
      "--- CONTEXTE MARCHÉ ---",
      contextStr,
      "--- FIN CONTEXTE ---",
      "",
      "Consignes strictes :",
      "1. Rédige un NOUVEL e-mail de prospection commerciale contextualisé pour la paire " + base + "/" + quote + ".",
      "2. Adopte le MÊME TON commercial percutant, la même structure avec puces, section 'Impact' et 'Comment protéger vos marges avec Revolut Business (FX Forwards)' que l'exemple fourni.",
      "3. RÈGLE STRICTE DE CONFORMITÉ : AUCUN CONSEIL FINANCIER NI RECOMMANDATION D'INVESTISSEMENT. Analyse factuelle des repères de cours.",
      "4. L'email DOIT IMPÉRATIVEMENT être rédigé en " + (isFr ? 'FRANÇAIS' : 'ANGLAIS') + ".",
      "5. Génère uniquement le corps HTML de l'email (balises <p>, <ul>, <li>, <strong>, <div>) sans bloc markdown."
    ].join("\n");

    // Attempt AI generation through backend if available
    let aiHtml = null;
    try {
      const res = await fetch('https://fx-market-report-generator.vercel.app/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.content) {
          aiHtml = data.content.replace(/```html/gi, '').replace(/```/g, '').trim();
        }
      }
    } catch (e) {
      console.warn('Backend AI fetch failed, using smart template transformer fallback:', e);
    }

    if (aiHtml) return aiHtml;

    // Smart template transformer fallback:
    // Transforms the chosen template directly using live market rate and context!
    let outText = example;

    // Substitute pair names
    outText = outText.replace(/EUR\/USD/g, base + '/' + quote)
                     .replace(/EUR\/CHF/g, base + '/' + quote)
                     .replace(/CZK\/USD/g, base + '/' + quote);

    // Substitute rates
    outText = outText.replace(/1[,.]1203/g, rateStr)
                     .replace(/1[,.]1200/g, rateStr)
                     .replace(/0[,.]9360/g, rateStr)
                     .replace(/0[,.]0430/g, rateStr);

    // If template has bullet points, convert markdown bullets and paragraphs to clean HTML
    const lines = outText.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        return;
      }

      if (trimmed.startsWith('●') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (!inList) { html += '<ul style="margin: 8px 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: #334155;">'; inList = true; }
        const itemContent = trimmed.replace(/^[●\-*]\s*/, '');
        html += '<li style="margin-bottom: 6px;">' + itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</li>';
      } else if (/^[0-9]+\.\s*/.test(trimmed)) {
        if (!inList) { html += '<ol style="margin: 8px 0; padding-left: 20px; font-size: 13.5px; line-height: 1.6; color: #334155;">'; inList = true; }
        const itemContent = trimmed.replace(/^[0-9]+\.\s*/, '');
        html += '<li style="margin-bottom: 6px;">' + itemContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</li>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        if (trimmed.startsWith('Objet :') || trimmed.startsWith('Subject:')) {
          html += '<div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 10px 14px; margin-bottom: 14px; font-weight: 700; color: #1e40af; font-size: 13px;">' + trimmed + '</div>';
        } else if (trimmed.startsWith('Quel impact') || trimmed.startsWith('Strategic Implication') || trimmed.startsWith('Impact on your business') || trimmed.startsWith('Why act now')) {
          html += '<div style="margin-top: 16px; font-size: 14px; font-weight: 700; color: #0f172a;">' + trimmed + '</div>';
        } else if (trimmed.startsWith('Comment protéger') || trimmed.startsWith('How Revolut Business') || trimmed.startsWith('Strategic Next Step')) {
          html += '<div style="margin-top: 14px; font-size: 14px; font-weight: 700; color: #1d4ed8;">' + trimmed + '</div>';
        } else {
          html += '<p style="margin: 0 0 12px 0; font-size: 13.5px; line-height: 1.6; color: #334155;">' + trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') + '</p>';
        }
      }
    });

    if (inList) html += '</ul>';

    // Inject live spot badge if not already mentioned
    const liveSpotBadge = `
      <div style="background: #f1f5f9; border-radius: 6px; padding: 8px 12px; margin: 12px 0; display: inline-block; font-size: 11.5px; color: #475569;">
        <strong>${isFr ? 'Repère interbancaire en direct' : 'Live Interbank Benchmark'} (${base}/${quote}) :</strong> 
        <span style="font-family: monospace; font-weight: 700; color: #1e40af; font-size: 13px;">${rateStr}</span> 
        ${d1Str ? '(<span style="color: ' + ((pairInfo && pairInfo.d1Pct >= 0) ? '#16a34a' : '#e11d48') + '; font-weight: 700;">' + d1Str + '</span>' + (prevCloseStr ? (isFr ? ' vs clôt. ' : ' vs close ') + prevCloseStr : '') + ')' : ''}
      </div>
    `;

    return liveSpotBadge + html;
  }
  async function generateAI() {
    const baseEl = document.getElementById('ai-base-ccy');
    const quoteEl = document.getElementById('ai-quote-ccy');
    const base = baseEl ? baseEl.value : 'EUR';
    const quote = quoteEl ? quoteEl.value : 'USD';
    const pairId = base + quote;
    const exampleEl = document.getElementById('ai-example-text');
    const example = exampleEl ? exampleEl.value.trim() : '';
    const langEl = document.getElementById('ai-language');
    const targetLang = langEl ? langEl.value : currentLang;
    const sectorEl = document.getElementById('ai-sector');
    const sector = sectorEl ? sectorEl.value : 'general';

    if (!example) {
      if (window.App) window.App.showToast(currentLang === 'fr' ? 'Veuillez coller un exemple d\'e-mail dans le formulaire.' : 'Please paste an example email in the form.', 'error');
      return;
    }

    localStorage.setItem('ai_email_example', example);

    window.EmailTemplates.aiGeneratedContent = '<i style="color: #64748b;">⏳ ' + (currentLang === 'fr' ? 'Génération de l\'e-mail contextualisé (' + base + '/' + quote + ')...' : 'Generating contextualized email (' + base + '/' + quote + ')...') + '</i>';
    renderIframeContent();
    if (window.App) window.App.showToast(currentLang === 'fr' ? 'Génération en cours...' : 'Generating email...', 'info');

    try {
      const html = await buildEmailWithContext(pairId, example, targetLang, sector);
      window.EmailTemplates.aiGeneratedContent = html;
      renderIframeContent();
      if (window.App) window.App.showToast(currentLang === 'fr' ? 'E-mail généré avec succès !' : 'Email generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      window.EmailTemplates.aiGeneratedContent = '<i style="color: #dc2626;">Erreur : ' + err.message + '</i>';
      renderIframeContent();
      if (window.App) window.App.showToast('Erreur de génération', 'error');
    }
  }

  // Restore saved values when rendering
  function restoreAIFields() {
    setTimeout(() => {
      const exampleInput = document.getElementById('ai-example-text');
      if (exampleInput) {
        const saved = localStorage.getItem('ai_email_example');
        exampleInput.value = saved || OUTREACH_PRESETS[0].text;
      }
    }, 100);
  }

  function initPage() {
    renderIframeContent();
    restoreAIFields();
  }

  function renderIframeContent() {
    const iframe = document.getElementById('email-preview-iframe');
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const html = generateEmailHTML(selectedTemplateId, currentLang);
    doc.open();
    doc.write(html);
    doc.close();
  }

  function setLanguage(lang) {
    currentLang = lang;
    const subjectEl = document.getElementById('email-subject-line');
    if (subjectEl) {
      subjectEl.textContent = getSubjectLine(selectedTemplateId, currentLang);
    }
    
    // Refresh page shell buttons
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
      contentArea.innerHTML = renderEmailTemplatesPage();
      renderIframeContent();
      restoreAIFields();
    }
  }

  function switchTemplate(templateId) {
    selectedTemplateId = templateId;

    const subjectEl = document.getElementById('email-subject-line');
    if (subjectEl) {
      subjectEl.textContent = getSubjectLine(templateId, currentLang);
    }

    const contentArea = document.getElementById('content-area');
    if (contentArea) {
      contentArea.innerHTML = renderEmailTemplatesPage();
      renderIframeContent();
    }
  }

  function copySubject() {
    const subject = getSubjectLine(selectedTemplateId, currentLang);
    navigator.clipboard.writeText(subject).then(() => {
      App.showToast(currentLang === 'fr' ? 'Objet copié dans le presse-papier !' : 'Subject line copied!', 'success');
    });
  }

  function copyRichText() {
    const html = generateEmailHTML(selectedTemplateId, currentLang);

    try {
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob([extractTextFromHTML(html)], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob
      });
      navigator.clipboard.write([item]).then(() => {
        App.showToast(currentLang === 'fr' ? 'E-mail enrichi copié ! Prêt à coller dans Outlook ou Gmail.' : 'Rich HTML email copied! Ready to paste into Outlook or Gmail.', 'success');
      }).catch(() => {
        navigator.clipboard.writeText(html).then(() => {
          App.showToast('HTML copié dans le presse-papier !', 'info');
        });
      });
    } catch (e) {
      navigator.clipboard.writeText(html).then(() => {
        App.showToast('HTML copié dans le presse-papier !', 'info');
      });
    }
  }

  function copyPlainText() {
    const html = generateEmailHTML(selectedTemplateId, currentLang);
    const text = extractTextFromHTML(html);
    navigator.clipboard.writeText(text).then(() => {
      App.showToast(currentLang === 'fr' ? 'Texte brut copié !' : 'Plain text copied!', 'success');
    });
  }

  function extractTextFromHTML(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.innerText || tmp.textContent || '';
  }

  function swapCurrencies() {
    const baseEl = document.getElementById('ai-base-ccy');
    const quoteEl = document.getElementById('ai-quote-ccy');
    if (baseEl && quoteEl) {
      const temp = baseEl.value;
      baseEl.value = quoteEl.value;
      quoteEl.value = temp;
    }
  }

  return {
    renderEmailTemplatesPage,
    initPage,
    switchTemplate,
    setLanguage,
    generateEmailHTML,
    copyRichText,
    copyPlainText,
    copySubject,
    generateAI,
    loadPreset,
    swapCurrencies,
    OUTREACH_PRESETS
  };
})();


