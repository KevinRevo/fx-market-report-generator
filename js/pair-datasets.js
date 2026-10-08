/**
 * Pair-specific analysis datasets (EUR/CHF, CHF/USD, CZK/USD, USD/HUF, EUR/PLN, USD/PLN).
 * EUR/USD keeps its original dataset inside pair-focus.js.
 *
 * Policy rates / stances are consistent with the Daily Report dataset
 * (Fed 3.75–4.00%, ECB DFR 2.50%, SNB 0.00%, CNB 3.75%, MNB 5.50%, NBP 5.75%).
 * Price targets are NOT invented: scenario zones are computed from the live spot
 * with the tokens {bullR} {cenR} {bearR}; bank price targets are left to the
 * linked research (no unverified forecasts are displayed).
 */
window.PairDatasets = (() => {
  'use strict';

  const D = {};

  // ───────────────────────── EUR/CHF ─────────────────────────
  D.EURCHF = {
    sub: ['Le franc suisse reste soutenu par son statut de valeur refuge', 'The Swiss franc stays supported by its safe-haven status'],
    trends: {
      fr: ['Cross très peu volatil, proche de ses plus bas historiques', 'Le CHF résiste malgré un taux directeur BNS à 0%', 'Le différentiel BCE–BNS (2,50% vs 0,00%) ne suffit pas à affaiblir le franc'],
      en: ['Low-volatility cross trading near multi-year lows', 'CHF resilient despite the SNB policy rate at 0%', 'ECB–SNB differential (2.50% vs 0.00%) fails to weaken the franc']
    },
    factors: {
      fr: ['Demande de valeurs refuges en cas d\'aversion au risque', 'BNS prête à intervenir sur le marché des changes', 'Inflation suisse très basse, marge de manœuvre limitée sur les taux', 'Facture énergétique plus lourde pour la zone euro'],
      en: ['Safe-haven demand during risk-off episodes', 'SNB ready to intervene in FX markets', 'Very low Swiss inflation, limited room on rates', 'Heavier energy bill for the euro area']
    },
    drivers: [
      { flag: '🇪🇺', title: ['BCE', 'ECB'], fr: ['Taux de dépôt à 2,50%', 'Inflation des services sous surveillance', 'Trajectoire graduelle dépendante des données'], en: ['Deposit rate at 2.50%', 'Services inflation under scrutiny', 'Gradual, data-dependent path'] },
      { flag: '🇨🇭', title: ['BNS', 'SNB'], fr: ['Taux directeur à 0,00%', 'Stabilité des prix : inflation proche de zéro', 'Intervention FX possible contre un CHF trop fort'], en: ['Policy rate at 0.00%', 'Price stability: inflation near zero', 'FX intervention possible against excessive CHF strength'] },
      { flag: '🛡️', title: ['Flux refuge', 'Safe-haven flows'], fr: ['Le CHF profite des replis des actions', 'VIX et tensions géopolitiques : indicateurs clés', 'Corrélation inverse EUR/CHF vs aversion au risque'], en: ['CHF benefits from equity pullbacks', 'VIX and geopolitics: key gauges', 'EUR/CHF inversely correlated with risk aversion'] },
      { flag: '🌐', title: ['Énergie & géopolitique', 'Energy & geopolitics'], fr: ['Brent au-dessus de 100 $/bbl', 'Zone euro importatrice nette d\'énergie', 'Suisse moins exposée : avantage relatif pour le CHF'], en: ['Brent above $100/bbl', 'Euro area is a net energy importer', 'Switzerland less exposed: relative CHF advantage'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (EUR/CHF ↑)', 'Bullish scenario (EUR/CHF ↑)'], fr: ['Retour de l\'appétit pour le risque', 'Intervention ou communication ferme de la BNS', 'Détente sur les prix de l\'énergie'], en: ['Risk appetite returns', 'SNB intervention or firm communication', 'Easing energy prices'], c: ['Rebond vers la zone {bullR}.', 'Rebound toward the {bullR} zone.'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart BCE–BNS stable', 'Flux refuge contenus', 'Données conformes au consensus'], en: ['Stable ECB–SNB gap', 'Contained safe-haven flows', 'Data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (EUR/CHF ↓)', 'Bearish scenario (EUR/CHF ↓)'], fr: ['Choc d\'aversion au risque', 'Escalade géopolitique', 'Détérioration de la croissance en zone euro'], en: ['Risk-off shock', 'Geopolitical escalation', 'Deteriorating euro-area growth'], c: ['Test de la zone {bearR}.', 'Test of the {bearR} zone.'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des deux banques centrales du cross', 'Official stances of the two central banks behind the cross'],
    banks: [
      { name: 'BCE', logo: '🇪🇺', fr: ['Taux de dépôt maintenu à 2,50%', 'Approche réunion par réunion, dépendante des données'], en: ['Deposit rate held at 2.50%', 'Meeting-by-meeting, data-dependent approach'] },
      { name: 'BNS', logo: '🇨🇭', fr: ['Taux directeur à 0,00%', 'Prête à intervenir sur le marché des changes si nécessaire'], en: ['Policy rate at 0.00%', 'Ready to intervene in FX markets if needed'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de taux de 250 pb en faveur de l\'euro', 'Le statut refuge du CHF compense ce différentiel'], en: ['250 bp rate gap in favour of the euro', 'CHF safe-haven status offsets this differential'] }
    ],
    watch: {
      fr: ['Prochaine réunion de la BNS et communication de ses membres', 'Inflation suisse (IPC) et zone euro (IPCH flash)', 'Indicateurs d\'aversion au risque (VIX) et pétrole', 'Évolution des réserves de change de la BNS'],
      en: ['Next SNB meeting and board communication', 'Swiss CPI and euro-area flash HICP', 'Risk-aversion gauges (VIX) and oil', 'Changes in SNB FX reserves']
    },
    seller: ['Vendeur d\'EUR : surveiller la zone haute {bullR} comme repère de conversion en CHF.', 'EUR seller: monitor the upper {bullR} zone as a CHF conversion benchmark.'],
    buyer: ['Acheteur d\'EUR : surveiller la zone basse {bearR} comme repère d\'achat d\'euros contre CHF.', 'EUR buyer: monitor the lower {bearR} zone as a benchmark for buying EUR against CHF.'],
    sources: 'Reuters, TradingView, BCE, BNS'
  };

  // ───────────────────────── CHF/USD ─────────────────────────
  D.CHFUSD = {
    sub: ['Le franc face à un dollar porté par les rendements américains', 'The franc facing a dollar lifted by US yields'],
    trends: {
      fr: ['Le CHF s\'inscrit en repli face au dollar sur la séance', 'Rendements US élevés : le portage pèse sur le franc', 'Le statut refuge limite l\'ampleur de la baisse'],
      en: ['CHF easing against the dollar on the session', 'Elevated US yields: carry weighs on the franc', 'Safe-haven status limits the extent of the decline']
    },
    factors: {
      fr: ['Fourchette Fed funds 3,75–4,00% vs BNS à 0,00%', 'Rendement US 10 ans au-dessus de 5,30%', 'Demande de refuge soutenant le franc', 'Risque d\'intervention BNS en cas de CHF trop fort'],
      en: ['Fed funds 3.75–4.00% vs SNB at 0.00%', 'US 10-year yield above 5.30%', 'Safe-haven demand supporting the franc', 'SNB intervention risk if CHF is too strong']
    },
    drivers: [
      { flag: '🇺🇸', title: ['Réserve fédérale (Fed)', 'Federal Reserve (Fed)'], fr: ['Taux cible 3,75–4,00% maintenu', 'Priorité à l\'ancrage de l\'inflation', 'Soutien durable au dollar'], en: ['Target range 3.75–4.00% maintained', 'Priority on anchoring inflation', 'Durable support for the dollar'] },
      { flag: '🇨🇭', title: ['BNS', 'SNB'], fr: ['Taux directeur à 0,00%', 'Cadre d\'intervention FX actif', 'Inflation suisse très faible'], en: ['Policy rate at 0.00%', 'FX intervention framework active', 'Very low Swiss inflation'] },
      { flag: '📊', title: ['Rendements US', 'US Yields'], fr: ['10 ans au-dessus de 5,30%', 'Écart de rendement massif vs la Suisse', 'Portage défavorable au franc'], en: ['10-year above 5.30%', 'Very wide yield gap vs Switzerland', 'Carry unfavourable to the franc'] },
      { flag: '🛡️', title: ['Refuge & géopolitique', 'Safe haven & geopolitics'], fr: ['Le CHF et l\'or bénéficient de l\'aversion au risque', 'Brent au-dessus de 100 $/bbl', 'Phases de stress = soutien ponctuel au franc'], en: ['CHF and gold benefit from risk aversion', 'Brent above $100/bbl', 'Stress phases = temporary franc support'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (CHF/USD ↑)', 'Bullish scenario (CHF/USD ↑)'], fr: ['Anticipations de baisse des taux Fed en hausse', 'Recul des rendements US', 'Épisode d\'aversion au risque'], en: ['Fed easing expectations rise', 'US yields retreat', 'Risk-off episode'], c: ['Appréciation du franc vers {bullR}.', 'Franc appreciation toward {bullR}.'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart de taux Fed–BNS stable', 'Flux refuge modérés', 'Données US conformes au consensus'], en: ['Stable Fed–SNB gap', 'Moderate safe-haven flows', 'US data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (CHF/USD ↓)', 'Bearish scenario (CHF/USD ↓)'], fr: ['Inflation US persistante, Fed « higher for longer »', 'Rendements US en hausse', 'Intervention de la BNS contre le franc'], en: ['Sticky US inflation, Fed "higher for longer"', 'Rising US yields', 'SNB intervention against the franc'], c: ['Repli vers la zone {bearR}.', 'Decline toward the {bearR} zone.'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des banques centrales du cross', 'Official stances of the central banks behind the cross'],
    banks: [
      { name: 'Fed', logo: '🇺🇸', fr: ['Fourchette cible 3,75–4,00%', 'Dépendance stricte aux données, focus Core PCE'], en: ['Target range 3.75–4.00%', 'Strictly data-dependent, Core PCE focus'] },
      { name: 'BNS', logo: '🇨🇭', fr: ['Taux directeur à 0,00%', 'Prête à intervenir contre un franc excessivement fort'], en: ['Policy rate at 0.00%', 'Ready to act against an excessively strong franc'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de taux de plus de 375 pb en faveur du USD', 'Le refuge CHF est le principal contrepoids'], en: ['Rate gap of over 375 bp in favour of USD', 'CHF safe-haven is the main counterweight'] }
    ],
    watch: {
      fr: ['Core PCE, payrolls et interventions des membres de la Fed', 'Prochaine réunion de la BNS', 'Rendements du Trésor US (2 ans / 10 ans)', 'Aversion au risque (VIX), or et pétrole'],
      en: ['Core PCE, payrolls and Fed speakers', 'Next SNB meeting', 'US Treasury yields (2Y / 10Y)', 'Risk aversion (VIX), gold and oil']
    },
    seller: ['Vendeur de CHF : surveiller la zone haute {bullR} comme repère de conversion en USD.', 'CHF seller: monitor the upper {bullR} zone as a USD conversion benchmark.'],
    buyer: ['Acheteur de CHF : surveiller la zone basse {bearR} comme repère d\'achat de francs contre USD.', 'CHF buyer: monitor the lower {bearR} zone as a benchmark for buying CHF against USD.'],
    sources: 'Reuters, TradingView, Fed, BNS'
  };

  // ───────────────────────── CZK/USD ─────────────────────────
  D.CZKUSD = {
    sub: ['La couronne tchèque face à un dollar soutenu par les rendements US', 'The Czech koruna facing a dollar supported by US yields'],
    trends: {
      fr: ['La couronne s\'ajuste à la baisse face au dollar', 'Pression liée aux rendements américains élevés', 'Sensibilité marquée au sentiment de risque régional'],
      en: ['Koruna adjusting lower against the dollar', 'Pressure from elevated US yields', 'High sensitivity to regional risk sentiment']
    },
    factors: {
      fr: ['Taux CNB à 3,75% vs Fed 3,75–4,00%', 'Rendement US 10 ans au-dessus de 5,30%', 'Dépendance de la région aux importations d\'énergie', 'Évolution de l\'EUR/CZK (principal partenaire commercial)'],
      en: ['CNB rate at 3.75% vs Fed 3.75–4.00%', 'US 10-year yield above 5.30%', 'Region\'s reliance on energy imports', 'EUR/CZK dynamics (main trading partner)']
    },
    drivers: [
      { flag: '🇺🇸', title: ['Réserve fédérale (Fed)', 'Federal Reserve (Fed)'], fr: ['Taux cible 3,75–4,00%', 'Taux réels positifs durables', 'Dollar soutenu face aux devises CEE'], en: ['Target range 3.75–4.00%', 'Durable positive real rates', 'Dollar supported against CEE currencies'] },
      { flag: '🇨🇿', title: ['CNB', 'CNB'], fr: ['Taux directeur à 3,75%', 'Économie résiliente, services solides', 'Inflation sous-jacente à surveiller'], en: ['Policy rate at 3.75%', 'Resilient economy, solid services', 'Core inflation to monitor'] },
      { flag: '📊', title: ['Rendements US', 'US Yields'], fr: ['10 ans au-dessus de 5,30%', 'Attractivité accrue du portage USD', 'Pression sur les devises émergentes européennes'], en: ['10-year above 5.30%', 'Greater appeal of USD carry', 'Pressure on European emerging currencies'] },
      { flag: '🌐', title: ['Risque & énergie', 'Risk & energy'], fr: ['Brent au-dessus de 100 $/bbl', 'Région importatrice nette d\'énergie', 'Sensibilité à l\'économie allemande'], en: ['Brent above $100/bbl', 'Region is a net energy importer', 'Sensitivity to the German economy'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (CZK/USD ↑)', 'Bullish scenario (CZK/USD ↑)'], fr: ['Anticipations de baisse des taux Fed', 'Recul des rendements US', 'Détente énergétique'], en: ['Fed easing expectations', 'US yields retreat', 'Energy relief'], c: ['Appréciation de la couronne vers {bullR}.', 'Koruna appreciation toward {bullR}.'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart CNB–Fed stable', 'Volatilité contenue', 'Données conformes au consensus'], en: ['Stable CNB–Fed gap', 'Contained volatility', 'Data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (CZK/USD ↓)', 'Bearish scenario (CZK/USD ↓)'], fr: ['Inflation US persistante', 'Aversion au risque dans la région', 'Croissance allemande décevante'], en: ['Sticky US inflation', 'Regional risk aversion', 'Disappointing German growth'], c: ['Repli vers la zone {bearR}.', 'Decline toward the {bearR} zone.'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des banques centrales du cross', 'Official stances of the central banks behind the cross'],
    banks: [
      { name: 'Fed', logo: '🇺🇸', fr: ['Fourchette cible 3,75–4,00%', 'Taux réels restrictifs maintenus'], en: ['Target range 3.75–4.00%', 'Restrictive real rates maintained'] },
      { name: 'CNB', logo: '🇨🇿', fr: ['Taux directeur à 3,75%', 'Focus sur l\'inflation sous-jacente'], en: ['Policy rate at 3.75%', 'Focus on core inflation'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de taux proche de zéro avec la Fed', 'Les rendements longs US font la différence'], en: ['Rate gap close to zero with the Fed', 'US long-end yields make the difference'] }
    ],
    watch: {
      fr: ['Inflation tchèque et décisions de la CNB', 'Core PCE et payrolls américains', 'Évolution de l\'EUR/CZK et de la croissance allemande', 'Prix du pétrole et du gaz'],
      en: ['Czech inflation and CNB decisions', 'US Core PCE and payrolls', 'EUR/CZK and German growth trends', 'Oil and gas prices']
    },
    seller: ['Vendeur de CZK : surveiller la zone haute {bullR} comme repère de conversion en USD.', 'CZK seller: monitor the upper {bullR} zone as a USD conversion benchmark.'],
    buyer: ['Acheteur de CZK : surveiller la zone basse {bearR} comme repère d\'achat de couronnes contre USD.', 'CZK buyer: monitor the lower {bearR} zone as a benchmark for buying CZK against USD.'],
    sources: 'Reuters, TradingView, Fed, CNB'
  };

  // ───────────────────────── USD/HUF ─────────────────────────
  D.USDHUF = {
    sub: ['Un forint sous pression face à un dollar ferme', 'A forint under pressure against a firm dollar'],
    trends: {
      fr: ['Le forint se déprécie nettement face au dollar', 'Mouvement amplifié par l\'appétit réduit pour le risque', 'Le portage MNB amortit seulement en partie la pression'],
      en: ['Forint depreciating notably against the dollar', 'Move amplified by weaker risk appetite', 'MNB carry only partly cushions the pressure']
    },
    factors: {
      fr: ['Taux MNB à 5,50% vs Fed 3,75–4,00%', 'Rendement US 10 ans au-dessus de 5,30%', 'Sensibilité du HUF au prix de l\'énergie', 'Trajectoire budgétaire et fonds européens'],
      en: ['MNB rate at 5.50% vs Fed 3.75–4.00%', 'US 10-year yield above 5.30%', 'HUF sensitivity to energy prices', 'Fiscal path and EU funds']
    },
    drivers: [
      { flag: '🇺🇸', title: ['Réserve fédérale (Fed)', 'Federal Reserve (Fed)'], fr: ['Taux cible 3,75–4,00%', 'Taux réels élevés durables', 'Dollar soutenu face aux devises CEE'], en: ['Target range 3.75–4.00%', 'Durable high real rates', 'Dollar supported against CEE currencies'] },
      { flag: '🇭🇺', title: ['MNB', 'MNB'], fr: ['Taux de base à 5,50%', 'Portage élevé : amortisseur de volatilité', 'Marge de baisse limitée par l\'inflation'], en: ['Base rate at 5.50%', 'High carry: volatility cushion', 'Easing room limited by inflation'] },
      { flag: '📊', title: ['Rendements US', 'US Yields'], fr: ['10 ans au-dessus de 5,30%', 'Réduit l\'avantage de portage du HUF', 'Pression sur les devises à bêta élevé'], en: ['10-year above 5.30%', 'Erodes the HUF carry advantage', 'Pressure on high-beta currencies'] },
      { flag: '🌐', title: ['Risque, énergie & budget', 'Risk, energy & fiscal'], fr: ['Brent au-dessus de 100 $/bbl', 'Hongrie très dépendante des importations d\'énergie', 'Déficit budgétaire et déblocage des fonds UE'], en: ['Brent above $100/bbl', 'Hungary highly dependent on energy imports', 'Budget deficit and EU funds release'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (USD/HUF ↑)', 'Bullish scenario (USD/HUF ↑)'], fr: ['Aversion au risque en hausse', 'Rendements US plus élevés', 'Nouvelle hausse du pétrole'], en: ['Rising risk aversion', 'Higher US yields', 'Another rise in oil'], c: ['Poursuite vers la zone {bullR} (forint plus faible).', 'Extension toward {bullR} (weaker forint).'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart MNB–Fed stable', 'Volatilité élevée mais contenue', 'Données conformes au consensus'], en: ['Stable MNB–Fed gap', 'Elevated but contained volatility', 'Data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (USD/HUF ↓)', 'Bearish scenario (USD/HUF ↓)'], fr: ['Anticipations de baisse des taux Fed', 'Retour de l\'appétit pour le risque', 'Déblocage des fonds européens'], en: ['Fed easing expectations', 'Risk appetite returns', 'Release of EU funds'], c: ['Repli vers la zone {bearR} (forint plus fort).', 'Decline toward {bearR} (stronger forint).'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des banques centrales du cross', 'Official stances of the central banks behind the cross'],
    banks: [
      { name: 'Fed', logo: '🇺🇸', fr: ['Fourchette cible 3,75–4,00%', 'Priorité à l\'inflation Core PCE'], en: ['Target range 3.75–4.00%', 'Priority on Core PCE inflation'] },
      { name: 'MNB', logo: '🇭🇺', fr: ['Taux de base à 5,50%', 'Vigilance sur l\'inflation et la stabilité du forint'], en: ['Base rate at 5.50%', 'Vigilance on inflation and forint stability'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de taux d\'environ 150 pb en faveur du HUF', 'Insuffisant face à l\'aversion au risque'], en: ['Rate gap of about 150 bp in favour of HUF', 'Insufficient against risk aversion'] }
    ],
    watch: {
      fr: ['Décisions et communication de la MNB', 'Inflation hongroise et déficit budgétaire', 'Core PCE et payrolls américains', 'Prix du pétrole et du gaz'],
      en: ['MNB decisions and communication', 'Hungarian inflation and budget deficit', 'US Core PCE and payrolls', 'Oil and gas prices']
    },
    seller: ['Vendeur de USD : surveiller la zone haute {bullR} comme repère de conversion en HUF.', 'USD seller: monitor the upper {bullR} zone as a HUF conversion benchmark.'],
    buyer: ['Acheteur de USD : surveiller la zone basse {bearR} comme repère d\'achat de dollars contre HUF.', 'USD buyer: monitor the lower {bearR} zone as a benchmark for buying USD against HUF.'],
    sources: 'Reuters, TradingView, Fed, MNB'
  };

  // ───────────────────────── EUR/PLN ─────────────────────────
  D.EURPLN = {
    sub: ['Un zloty résilient face à l\'euro grâce au différentiel de taux', 'A resilient zloty against the euro thanks to the rate differential'],
    trends: {
      fr: ['Cross stable, le zloty reste parmi les plus solides de la CEE', 'Le différentiel NBP–BCE (5,75% vs 2,50%) soutient le PLN', 'Faible volatilité sur la séance'],
      en: ['Stable cross, the zloty remains among CEE\'s strongest', 'NBP–ECB differential (5.75% vs 2.50%) supports PLN', 'Low volatility on the session']
    },
    factors: {
      fr: ['Écart de taux de 325 pb en faveur du zloty', 'NBP en position restrictive durable', 'Croissance polonaise supérieure à celle de la zone euro', 'Coûts énergétiques pour la région'],
      en: ['325 bp rate gap in favour of the zloty', 'NBP on a prolonged restrictive hold', 'Polish growth above the euro area', 'Energy costs for the region']
    },
    drivers: [
      { flag: '🇪🇺', title: ['BCE', 'ECB'], fr: ['Taux de dépôt à 2,50%', 'Politique graduelle et prudente', 'Croissance inégale en zone euro'], en: ['Deposit rate at 2.50%', 'Gradual, cautious policy', 'Uneven euro-area growth'] },
      { flag: '🇵🇱', title: ['NBP', 'NBP'], fr: ['Taux de référence à 5,75%', 'Inflation maintenant une posture restrictive', 'Salaires réels en hausse'], en: ['Reference rate at 5.75%', 'Inflation sustaining a restrictive stance', 'Rising real wages'] },
      { flag: '📊', title: ['Écart de rendement', 'Yield differential'], fr: ['Différentiel Pologne–zone euro élevé', 'Portage favorable au zloty', 'Risque : réduction des écarts si le NBP assouplit'], en: ['Wide Poland–euro-area differential', 'Carry favourable to the zloty', 'Risk: spread compression if NBP eases'] },
      { flag: '🌐', title: ['Risque & énergie', 'Risk & energy'], fr: ['Brent au-dessus de 100 $/bbl', 'Proximité géographique de l\'Ukraine', 'Sentiment de risque régional'], en: ['Brent above $100/bbl', 'Geographic proximity to Ukraine', 'Regional risk sentiment'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (EUR/PLN ↑)', 'Bullish scenario (EUR/PLN ↑)'], fr: ['Assouplissement plus rapide du NBP', 'Aversion au risque régionale', 'Tensions géopolitiques près de la Pologne'], en: ['Faster NBP easing', 'Regional risk aversion', 'Geopolitical tensions near Poland'], c: ['Zloty plus faible : zone {bullR}.', 'Weaker zloty: {bullR} zone.'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart NBP–BCE stable', 'Volatilité contenue', 'Données conformes au consensus'], en: ['Stable NBP–ECB gap', 'Contained volatility', 'Data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (EUR/PLN ↓)', 'Bearish scenario (EUR/PLN ↓)'], fr: ['NBP maintenant des taux élevés plus longtemps', 'Croissance polonaise robuste', 'Appétit pour le risque en CEE'], en: ['NBP keeping rates high for longer', 'Robust Polish growth', 'CEE risk appetite'], c: ['Zloty plus fort : zone {bearR}.', 'Stronger zloty: {bearR} zone.'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des banques centrales du cross', 'Official stances of the central banks behind the cross'],
    banks: [
      { name: 'BCE', logo: '🇪🇺', fr: ['Taux de dépôt maintenu à 2,50%', 'Inflation des services sous surveillance'], en: ['Deposit rate held at 2.50%', 'Services inflation under scrutiny'] },
      { name: 'NBP', logo: '🇵🇱', fr: ['Taux de référence à 5,75%', 'Posture restrictive prolongée'], en: ['Reference rate at 5.75%', 'Prolonged restrictive stance'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de 325 pb en faveur du PLN', 'Principal soutien du zloty'], en: ['325 bp gap in favour of PLN', 'Main support for the zloty'] }
    ],
    watch: {
      fr: ['Décisions et conférences du NBP', 'Inflation polonaise et zone euro (IPCH)', 'Salaires réels et croissance en Pologne', 'Prix de l\'énergie et situation en Ukraine'],
      en: ['NBP decisions and press conferences', 'Polish and euro-area inflation (HICP)', 'Real wages and Polish growth', 'Energy prices and the situation in Ukraine']
    },
    seller: ['Vendeur d\'EUR : surveiller la zone haute {bullR} comme repère de conversion en PLN.', 'EUR seller: monitor the upper {bullR} zone as a PLN conversion benchmark.'],
    buyer: ['Acheteur d\'EUR : surveiller la zone basse {bearR} comme repère d\'achat d\'euros contre PLN.', 'EUR buyer: monitor the lower {bearR} zone as a benchmark for buying EUR against PLN.'],
    sources: 'Reuters, TradingView, BCE, NBP'
  };

  // ───────────────────────── USD/PLN ─────────────────────────
  D.USDPLN = {
    sub: ['Un dollar qui s\'apprécie face à un zloty soutenu par ses taux', 'A dollar gaining against a zloty supported by its rates'],
    trends: {
      fr: ['Le dollar progresse face au zloty sur la séance', 'Rendements US élevés : le portage USD se renforce', 'Le zloty reste soutenu par le taux NBP à 5,75%'],
      en: ['Dollar gaining against the zloty on the session', 'Elevated US yields: USD carry strengthens', 'Zloty remains supported by the 5.75% NBP rate']
    },
    factors: {
      fr: ['Taux NBP à 5,75% vs Fed 3,75–4,00%', 'Rendement US 10 ans au-dessus de 5,30%', 'EUR/USD en consolidation (le zloty suit l\'euro)', 'Énergie et géopolitique régionale'],
      en: ['NBP rate at 5.75% vs Fed 3.75–4.00%', 'US 10-year yield above 5.30%', 'EUR/USD consolidating (the zloty tracks the euro)', 'Energy and regional geopolitics']
    },
    drivers: [
      { flag: '🇺🇸', title: ['Réserve fédérale (Fed)', 'Federal Reserve (Fed)'], fr: ['Taux cible 3,75–4,00%', 'Taux réels positifs durables', 'Dollar soutenu face aux devises CEE'], en: ['Target range 3.75–4.00%', 'Durable positive real rates', 'Dollar supported against CEE currencies'] },
      { flag: '🇵🇱', title: ['NBP', 'NBP'], fr: ['Taux de référence à 5,75%', 'Posture restrictive prolongée', 'Zloty soutenu par le portage'], en: ['Reference rate at 5.75%', 'Prolonged restrictive stance', 'Zloty supported by carry'] },
      { flag: '📊', title: ['Rendements US', 'US Yields'], fr: ['10 ans au-dessus de 5,30%', 'Réduit l\'avantage de portage du PLN', 'Soutien au dollar face aux devises CEE'], en: ['10-year above 5.30%', 'Erodes the PLN carry advantage', 'Supports USD against CEE currencies'] },
      { flag: '🌐', title: ['Risque & énergie', 'Risk & energy'], fr: ['Brent au-dessus de 100 $/bbl', 'Proximité géographique de l\'Ukraine', 'Demande de liquidités en USD en cas de stress'], en: ['Brent above $100/bbl', 'Geographic proximity to Ukraine', 'USD liquidity demand during stress'] }
    ],
    scen: {
      bull: { t: ['Scénario haussier (USD/PLN ↑)', 'Bullish scenario (USD/PLN ↑)'], fr: ['Inflation US persistante', 'Rendements US en hausse', 'Aversion au risque en CEE'], en: ['Sticky US inflation', 'Rising US yields', 'CEE risk aversion'], c: ['Dollar plus fort : zone {bullR}.', 'Stronger dollar: {bullR} zone.'] },
      central: { t: ['Scénario central (Range)', 'Central scenario (Range)'], fr: ['Écart NBP–Fed stable', 'Volatilité contenue', 'Données conformes au consensus'], en: ['Stable NBP–Fed gap', 'Contained volatility', 'Data in line with consensus'], c: ['Évolution dans la zone {cenR}.', 'Trading within the {cenR} range.'] },
      bear: { t: ['Scénario baissier (USD/PLN ↓)', 'Bearish scenario (USD/PLN ↓)'], fr: ['Anticipations de baisse des taux Fed', 'Recul des rendements US', 'Rebond de l\'euro et du zloty'], en: ['Fed easing expectations', 'US yields retreat', 'Euro and zloty rebound'], c: ['Dollar plus faible : zone {bearR}.', 'Weaker dollar: {bearR} zone.'] }
    },
    banksTitle: ['CE QUE DISENT LES BANQUES CENTRALES', 'CENTRAL BANK STANCES'],
    banksSub: ['Positions officielles des banques centrales du cross', 'Official stances of the central banks behind the cross'],
    banks: [
      { name: 'Fed', logo: '🇺🇸', fr: ['Fourchette cible 3,75–4,00%', 'Priorité à l\'inflation Core PCE'], en: ['Target range 3.75–4.00%', 'Priority on Core PCE inflation'] },
      { name: 'NBP', logo: '🇵🇱', fr: ['Taux de référence à 5,75%', 'Posture restrictive prolongée'], en: ['Reference rate at 5.75%', 'Prolonged restrictive stance'] },
      { name: 'Lecture croisée', logo: '⚖️', fr: ['Écart de taux d\'environ 175 pb en faveur du PLN', 'Contrebalancé par les rendements longs US'], en: ['Rate gap of about 175 bp in favour of PLN', 'Offset by US long-end yields'] }
    ],
    watch: {
      fr: ['Core PCE et payrolls américains', 'Décisions et conférences du NBP', 'Inflation polonaise et salaires réels', 'EUR/USD et prix de l\'énergie'],
      en: ['US Core PCE and payrolls', 'NBP decisions and press conferences', 'Polish inflation and real wages', 'EUR/USD and energy prices']
    },
    seller: ['Vendeur de USD : surveiller la zone haute {bullR} comme repère de conversion en PLN.', 'USD seller: monitor the upper {bullR} zone as a PLN conversion benchmark.'],
    buyer: ['Acheteur de USD : surveiller la zone basse {bearR} comme repère d\'achat de dollars contre PLN.', 'USD buyer: monitor the lower {bearR} zone as a benchmark for buying USD against PLN.'],
    sources: 'Reuters, TradingView, Fed, NBP'
  };

  /** Convert compact dataset → structure used by pair-focus renderer. */
  function toPairData(ds) {
    const keys = ['fed', 'bce', 'yields', 'geopolitics'];
    const drivers = {};
    ds.drivers.forEach((d, i) => {
      drivers[keys[i]] = { titleFr: d.title[0], titleEn: d.title[1], flag: d.flag, pointsFr: d.fr, pointsEn: d.en };
    });
    const sc = (s) => ({ titleFr: s.t[0], titleEn: s.t[1], pointsFr: s.fr, pointsEn: s.en, targetFr: s.c[0], targetEn: s.c[1] });
    return {
      subFr: ds.sub[0], subEn: ds.sub[1],
      recentTrendsFr: ds.trends.fr, recentTrendsEn: ds.trends.en,
      keyFactorsFr: ds.factors.fr, keyFactorsEn: ds.factors.en,
      drivers,
      scenarios: { bull: sc(ds.scen.bull), central: sc(ds.scen.central), bear: sc(ds.scen.bear) },
      forecasts: null, // no unverified bank targets → placeholder row rendered
      banksTitleFr: ds.banksTitle[0], banksTitleEn: ds.banksTitle[1],
      banksSubFr: ds.banksSub[0], banksSubEn: ds.banksSub[1],
      bankViews: ds.banks.map(b => ({ name: b.name, logo: b.logo, pointsFr: b.fr, pointsEn: b.en })),
      toWatchFr: ds.watch.fr, toWatchEn: ds.watch.en,
      commercialReading: { sellerFr: ds.seller[0], sellerEn: ds.seller[1], buyerFr: ds.buyer[0], buyerEn: ds.buyer[1] },
      sourcesText: ds.sources,
      fixedLevels: null
    };
  }

  return { get: (id) => (D[id] ? toPairData(D[id]) : null) };
})();
