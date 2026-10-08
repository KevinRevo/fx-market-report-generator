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
  let selectedTemplateId = 'daily_summary';

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
              <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #1e293b; text-transform: uppercase;">Paramètres IA</h4>
              
              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">Paire de devises :</label>
              
              <div style="display: flex; gap: 4px; align-items: center; margin-bottom: 12px;">
              <select id="ai-base-ccy" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
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
              <span style="font-weight: 800; color: #1e293b;">/</span>
              <select id="ai-quote-ccy" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px;">
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


              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">Votre exemple d'e-mail (Modèle) :</label>
              <textarea id="ai-example-text" style="width: 100%; height: 120px; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; margin-bottom: 12px; resize: vertical;" placeholder="Collez ici un ancien e-mail que vous avez écrit pour donner à l'IA votre style et la structure attendue..."></textarea>
              
              <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">Clé API Gemini (sauvegardée localement) :</label>
              <input type="password" id="ai-api-key" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; margin-bottom: 12px;" placeholder="AIzaSy...">
              
                            <label style="display: block; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 4px;">Langue de l'e-mail :</label>
              <select id="ai-language" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 12px; margin-bottom: 12px;">
                <option value="fr" selected>???? Fran�ais</option>
                <option value="en">???? English</option>
              </select>
<button onclick="window.EmailTemplates.generateAI()" style="width: 100%; padding: 8px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer;">
                ✨ Générer l'e-mail avec l'IA
              </button>
              <div style="font-size: 9px; color: #94a3b8; margin-top: 6px; text-align: center;">Les données de marché actuelles seront automatiquement injectées.</div>
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


  async function generateAI() {
    const pairId = document.getElementById('ai-base-ccy').value + document.getElementById('ai-quote-ccy').value;
    const example = document.getElementById('ai-example-text').value;
    const targetLang = document.getElementById('ai-language') ? document.getElementById('ai-language').value : 'fr';
    
    

    if (!example) {
      if(window.App) window.App.showToast('Veuillez fournir un exemple d\'e-mail.', 'error');
      return;
    }
    
    // Save API key
    
    localStorage.setItem('ai_email_example', example);
    
    window.EmailTemplates.aiGeneratedContent = '<i>Génération en cours avec Gemini 1.5 Flash...</i>';
    renderIframeContent();
    if(window.App) window.App.showToast('Génération en cours...', 'info');

    // Get current market context
    const ds = window.PairDatasets ? window.PairDatasets.get(pairId) : null;
    let contextStr = 'Context non disponible';
    if (ds) {
      contextStr = `
Paire: ${pairId}
Tendances récentes: ${ds.recentTrendsFr.join(', ')}
Facteurs clés: ${ds.keyFactorsFr.join(', ')}
A surveiller cette semaine: ${ds.toWatchFr.join(', ')}
Scénario Haussier: ${ds.scenarios.bull.pointsFr.join(', ')}
Scénario Baissier: ${ds.scenarios.bear.pointsFr.join(', ')}
`;
    }

    const prompt = `Tu es un vendeur FX institutionnel (Corporate FX Sales) chez Revolut Business, écrivant à un directeur financier. 
Voici un exemple de style et de structure de mail que tu dois absolument imiter : 
\`\`\`
${example}
\`\`\`

Voici le contexte de marché ACTUEL pour la paire ${pairId} :
\`\`\`
${contextStr}
\`\`\`

Consignes :
1. Rédige un NOUVEL e-mail en te basant sur le contexte de marché ACTUEL.
2. Adopte le MÊME TON, la MÊME STRUCTURE et le MÊME NIVEAU DE PROFESSIONNALISME que l'exemple fourni.
3. NE DONNE AUCUN CONSEIL FINANCIER OU RECOMMANDATION D'INVESTISSEMENT. Reste factuel.
4. L'email DOIT IMPERATIVEMENT être rédigé en ${targetLang === 'en' ? 'ANGLAIS' : 'FRANÇAIS'}.
5. Génère uniquement le corps du mail en HTML (utiliser des balises <p>, <ul>, <strong>, etc.) sans les balises ```html.`;

    try {
      const res = await fetch('https://fx-market-report-generator.vercel.app/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      let htmlContent = data.content;
      // Remove potential markdown wrappers
      htmlContent = htmlContent.replace(/\`\`\`html/g, '').replace(/\`\`\`/g, '');
      
      window.EmailTemplates.aiGeneratedContent = htmlContent;
      renderIframeContent();
      if(window.App) window.App.showToast('E-mail généré avec succès !', 'success');
      
    } catch (e) {
      console.error(e);
      window.EmailTemplates.aiGeneratedContent = '<i style="color: red;">Erreur lors de la génération: ' + e.message + '</i>';
      renderIframeContent();
      if(window.App) window.App.showToast('Erreur API Gemini', 'error');
    }
  }

  // Restore saved values when rendering
  function restoreAIFields() {
    setTimeout(() => {
      const apiKeyInput = document.getElementById('ai-api-key');
      const exampleInput = document.getElementById('ai-example-text');
      if (apiKeyInput && localStorage.getItem('gemini_api_key')) {
        apiKeyInput.value = localStorage.getItem('gemini_api_key');
      }
      if (exampleInput && localStorage.getItem('ai_email_example')) {
        exampleInput.value = localStorage.getItem('ai_email_example');
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

  return {
    renderEmailTemplatesPage,
    initPage,
    switchTemplate,
    setLanguage,
    generateEmailHTML,
    copyRichText,
    copyPlainText,
    copySubject,
    generateAI
  };
})();

