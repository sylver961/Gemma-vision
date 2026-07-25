import { SampleScenario } from '../types';

// Data URI images generated for rich visual camera scenarios
const SVG_CROSSWALK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231a202c"/><rect x="0" y="240" width="600" height="160" fill="%232d3748"/><path d="M50 250 L100 400 M180 250 L250 400 M310 250 L400 400 M440 250 L550 400" stroke="%23ffffff" stroke-width="24"/><rect x="420" y="80" width="20" height="200" fill="%23718096"/><circle cx="430" cy="110" fill="%23e53e3e" r="14"/><rect x="450" y="100" width="120" height="70" fill="%23f6e05e" rx="6"/><text x="460" y="140" font-family="sans-serif" font-weight="bold" font-size="18" fill="%231a202c">BOULANGERIE</text><text x="460" y="160" font-family="sans-serif" font-size="12" fill="%232d3748">Le Pain Doré</text><rect x="80" y="210" width="90" height="60" fill="%234a5568" rx="4"/><text x="90" y="240" font-family="sans-serif" font-size="14" fill="%23e2e8f0">POTEAU 2m</text></svg>`;

const SVG_STAIRS = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><path d="M 100 350 L 500 350 L 500 310 L 440 310 L 440 270 L 380 270 L 380 230 L 320 230 L 320 190 L 260 190 L 260 150 L 200 150" fill="%23334155" stroke="%23f59e0b" stroke-width="4"/><rect x="80" y="80" width="140" height="240" fill="%231e293b" stroke="%23ef4444" stroke-width="3"/><text x="95" y="120" font-family="sans-serif" font-weight="bold" font-size="16" fill="%23f87171">ATTENTION</text><text x="95" y="145" font-family="sans-serif" font-size="13" fill="%23cbd5e1">Plante suspendue</text><text x="95" y="165" font-family="sans-serif" font-size="13" fill="%23cbd5e1">Hauteur de tête !</text><rect x="300" y="170" width="180" height="40" fill="%23ef4444" rx="6"/><text x="315" y="195" font-family="sans-serif" font-weight="bold" font-size="15" fill="%23ffffff">ESCALIER DESCENDANT</text></svg>`;

const SVG_BUS_STOP = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23111827"/><rect x="80" y="60" width="160" height="280" fill="%231f2937" rx="8" stroke="%233b82f6" stroke-width="3"/><rect x="100" y="80" width="120" height="60" fill="%232563eb" rx="4"/><text x="110" y="120" font-family="sans-serif" font-weight="bold" font-size="28" fill="%23ffffff">BUS 38</text><rect x="100" y="160" width="120" height="150" fill="%23374151" rx="4"/><text x="110" y="190" font-family="sans-serif" font-size="13" fill="%23f3f4f6">Arrêt: République</text><text x="110" y="220" font-family="sans-serif" font-size="14" fill="%2310b981">Prochain: 4 min</text><text x="110" y="245" font-family="sans-serif" font-size="14" fill="%239ca3af">Suivant: 12 min</text><rect x="320" y="240" width="220" height="70" fill="%234b5563" rx="6"/><text x="340" y="280" font-family="sans-serif" font-size="16" fill="%23fbbf24">BANC PUBLIC (1.5m)</text></svg>`;

const SVG_STORE_SHELF = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2318181b"/><rect x="40" y="80" width="520" height="15" fill="%2352525b"/><rect x="40" y="200" width="520" height="15" fill="%2352525b"/><rect x="40" y="320" width="520" height="15" fill="%2352525b"/><rect x="80" y="100" width="90" height="100" fill="%23dc2626" rx="6"/><text x="90" y="140" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23ffffff">LAIT EN</text><text x="90" y="160" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23ffffff">POUDRE</text><text x="90" y="185" font-family="sans-serif" font-size="12" fill="%23fca5a5">4.50 €</text><rect x="220" y="100" width="100" height="100" fill="%2316a34a" rx="6"/><text x="230" y="140" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23ffffff">JUS D'ORANGE</text><text x="230" y="160" font-family="sans-serif" font-size="12" fill="%23ffffff">100% PUR</text><text x="230" y="185" font-family="sans-serif" font-size="12" fill="%2386efac">2.20 €</text><rect x="370" y="100" width="110" height="100" fill="%23d97706" rx="6"/><text x="380" y="140" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23ffffff">CÉRÉALES</text><text x="380" y="160" font-family="sans-serif" font-size="12" fill="%23ffffff">BIO MIEL</text><text x="380" y="185" font-family="sans-serif" font-size="12" fill="%23fde68a">3.90 €</text></svg>`;

const SVG_DOCUMENT = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2309090b"/><rect x="120" y="20" width="360" height="360" fill="%23ffffff" rx="8" stroke="%23333336" stroke-width="2"/><text x="150" y="60" font-family="sans-serif" font-weight="bold" font-size="16" fill="%2318181b">RÉPUBLIQUE FRANÇAISE</text><text x="150" y="85" font-family="sans-serif" font-size="12" fill="%2352525b">Ministère de la Santé • Avis de convocation</text><line x1="150" y1="100" x2="450" y2="100" stroke="%23e4e4e7" stroke-width="2"/><text x="150" y="130" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2327272a">Objet : Renouvellement des Droits MDPH</text><text x="150" y="160" font-family="sans-serif" font-size="11" fill="%233f3f46">Madame, Monsieur,</text><text x="150" y="185" font-family="sans-serif" font-size="11" fill="%233f3f46">Nous vous confirmons votre rendez-vous pour la prise en</text><text x="150" y="205" font-family="sans-serif" font-size="11" fill="%233f3f46">charge de votre carte d assistance visuelle le 12 Octobre à 14h.</text><rect x="150" y="230" width="300" height="50" fill="%23f4f4f5" rx="6"/><text x="165" y="252" font-family="sans-serif" font-weight="bold" font-size="12" fill="%2316a34a">Montant des indemnités revalorisées : 950 €</text><text x="165" y="270" font-family="sans-serif" font-size="11" fill="%2352525b">Paiement effectif le 5 de chaque mois.</text><text x="150" y="310" font-family="sans-serif" font-size="10" fill="%2371717a">Veuillez vous munir de votre pièce d identité et justificatif.</text></svg>`;

const SVG_PRODUCT_BARCODE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230c0a09"/><rect x="150" y="40" width="300" height="320" fill="%23ea580c" rx="16"/><text x="180" y="90" font-family="sans-serif" font-weight="black" font-size="22" fill="%23ffffff">JUS D ORANGE</text><text x="180" y="115" font-family="sans-serif" font-weight="bold" font-size="14" fill="%23fef08a">100% PUR JUS BIO • TROPICANA</text><rect x="180" y="135" width="240" height="80" fill="%237c2d12" rx="8"/><text x="195" y="160" font-family="sans-serif" font-weight="bold" font-size="12" fill="%23ffffff">Ingrédients : 100% Oranges d Espagne</text><text x="195" y="180" font-family="sans-serif" font-size="11" fill="%23fed7aa">Allergènes : Aucun • Sans sucre ajouté</text><text x="195" y="200" font-family="sans-serif" font-weight="bold" font-size="13" fill="%23e6ff00">Prix : 2,45 € (1L)</text><rect x="220" y="235" width="160" height="70" fill="%23ffffff" rx="4"/><path d="M 230 245 L 230 290 M 235 245 L 235 290 M 245 245 L 245 290 M 250 245 L 250 290 M 265 245 L 265 290 M 275 245 L 275 290 M 285 245 L 285 290 M 295 245 L 295 290 M 310 245 L 310 290 M 325 245 L 325 290 M 340 245 L 340 290 M 355 245 L 355 290 M 365 245 L 365 290" stroke="%23000000" stroke-width="3"/><text x="240" y="300" font-family="monospace" font-size="10" fill="%23000000">3 700123 456789</text></svg>`;

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'street-crossing',
    title: 'Trottoir & Boulangerie (RUE)',
    category: 'street',
    imageUrl: SVG_CROSSWALK,
    userPrompt: "Gemma, qu'est-ce qu'il y a devant moi ?",
    description: "Trottoir avec passage piéton, poteau électrique à droite et enseigne de magasin 'Le Pain Doré'.",
    simulatedData: {
      thoughtProcess: "Analyse du contexte extérieur. Je détecte un trottoir dégagé au centre avec marquage blanc de passage piéton. À 2 mètres sur la droite se trouve un poteau métallique. Plus loin à droite, je détecte l'enseigne d'un commerce 'Le Pain Doré - Boulangerie'. Pas de véhicule en approche immédiate.",
      publicResponse: "Je vois un trottoir avec un poteau à environ 2 mètres sur votre droite. Devant vous, le passage piéton est dégagé. À droite, il y a la boulangerie 'Le Pain Doré'. Souhaitez-vous que je vérifie ses horaires d'ouverture ?",
      safetyLevel: 'SAFE',
      summary: "Voie dégagée devant, poteau sur la droite à 2m. Boulangerie visible.",
      obstacles: [
        {
          id: 'obs-1',
          name: 'Poteau métallique',
          category: 'obstacle',
          distanceMeters: 2.0,
          position: 'right',
          hazardLevel: 'WARNING',
          description: 'Poteau vertical situé à 2m sur la droite du trottoir.',
          box2d: [200, 700, 700, 740]
        }
      ],
      ocrTextDetected: ["BOULANGERIE", "Le Pain Doré"],
      suggestedAction: {
        actionType: 'search_web',
        prompt: "Vérifier les horaires de la boulangerie Le Pain Doré",
        details: "Le Pain Doré"
      }
    }
  },
  {
    id: 'stairs-hazard',
    title: 'Escalier & Obstacle Suspendu (ALERTE)',
    category: 'indoor',
    imageUrl: SVG_STAIRS,
    userPrompt: "Est-ce que le couloir est sûr ?",
    description: "Escalier descendant abrupt à 1.5 mètre avec une plante suspendue à hauteur de tête.",
    simulatedData: {
      thoughtProcess: "ALERTE SÉCURITÉ CRITIQUE : Détection immédiate d'une marche d'escalier descendante à 1.5m au centre de la trajectoire. De plus, à gauche, une plante suspendue est à hauteur de visage (1.8m). Risque de chute ou de collision.",
      publicResponse: "ATTENTION ! Escalier descendant à seulement 1,5 mètre juste devant vous ! Ralentissez. Attention également à un obstacle suspendu à hauteur de tête sur la gauche.",
      safetyLevel: 'CRITICAL',
      summary: "ALERTE : Escalier descendant à 1.5m devant ! Obstacle suspendu à gauche.",
      obstacles: [
        {
          id: 'obs-stairs',
          name: 'Escalier descendant',
          category: 'step',
          distanceMeters: 1.5,
          position: 'center',
          hazardLevel: 'CRITICAL',
          description: 'Marches descendantes brusques. Risque imminent de chute.',
          box2d: [425, 500, 875, 830]
        },
        {
          id: 'obs-plant',
          name: 'Obstacle suspendu (plante)',
          category: 'overhead',
          distanceMeters: 1.2,
          position: 'left',
          hazardLevel: 'WARNING',
          description: 'Plante suspendue à hauteur de tête.',
          box2d: [200, 130, 800, 360]
        }
      ],
      ocrTextDetected: ["ATTENTION", "Plante suspendue", "ESCALIER DESCENDANT"]
    }
  },
  {
    id: 'bus-stop',
    title: 'Arrêt de Bus Ligne 38 (TRANSPORT)',
    category: 'transit',
    imageUrl: SVG_BUS_STOP,
    userPrompt: "Quel est ce panneau de bus ?",
    description: "Panneau d'arrêt de bus Ligne 38 avec horaire numérique et banc public à droite.",
    simulatedData: {
      thoughtProcess: "Analyse OCR et repérage d'espace transit. Le panneau indique 'BUS 38 - Arrêt République'. Le prochain passage est affiché dans 4 minutes. À droite à 1.5 mètre se trouve un banc public dégagé.",
      publicResponse: "Vous êtes à l'arrêt de bus 'République'. C'est la ligne Bus 38. Le panneau indique que le prochain bus arrive dans 4 minutes. Un banc public est libre sur votre droite à 1.5 mètre.",
      safetyLevel: 'SAFE',
      summary: "Arrêt Bus 38 République. Prochain passage : 4 min. Banc à droite.",
      obstacles: [
        {
          id: 'obs-bench',
          name: 'Banc public',
          category: 'obstacle',
          distanceMeters: 1.5,
          position: 'right',
          hazardLevel: 'SAFE',
          description: 'Banc en bois disponible pour s\'asseoir.',
          box2d: [600, 530, 775, 900]
        }
      ],
      ocrTextDetected: ["BUS 38", "Arrêt: République", "Prochain: 4 min", "Suivant: 12 min"],
      suggestedAction: {
        actionType: 'check_schedule',
        prompt: "Consulter les prochains passages du Bus 38 à République",
        details: "Bus 38"
      }
    }
  },
  {
    id: 'store-shelf',
    title: 'Rayon Épicerie / Produits (MAGASIN)',
    category: 'store',
    imageUrl: SVG_STORE_SHELF,
    userPrompt: "Peux-tu me lire les étiquettes du rayon ?",
    description: "Étagères avec produits alimentaires : Lait en poudre (4.50€), Jus d'orange (2.20€), Céréales Bio Miel (3.90€).",
    simulatedData: {
      thoughtProcess: "Lecture OCR haute précision pour les achats. De gauche à droite sur l'étagère du haut : 1) Boîte rouge : 'Lait en poudre' à 4,50 €. 2) Bouteille verte : 'Jus d'orange 100% pur' à 2,20 €. 3) Paquet jaune : 'Céréales Bio Miel' à 3,90 €.",
      publicResponse: "Au rayon devant vous, de gauche à droite : Du Lait en poudre à 4 euros 50, du Jus d'orange 100% pur à 2 euros 20, et des Céréales Bio Miel à 3 euros 90. Quel article cherchez-vous ?",
      safetyLevel: 'SAFE',
      summary: "3 produits identifiés : Lait en poudre (4.50€), Jus d'orange (2.20€), Céréales Bio (3.90€).",
      obstacles: [],
      ocrTextDetected: ["LAIT EN POUDRE 4.50 €", "JUS D'ORANGE 100% PUR 2.20 €", "CÉRÉALES BIO MIEL 3.90 €"]
    }
  },
  {
    id: 'document-letter',
    title: 'Document Officiel / Lettre MDPH (DOCUMENT)',
    category: 'document',
    imageUrl: SVG_DOCUMENT,
    userPrompt: "Lis cette lettre administrative importante pour moi.",
    description: "Courrier officiel du Ministère de la Santé concernant la convocation MDPH et les indemnités revalorisées à 950€.",
    simulatedData: {
      thoughtProcess: "Transcription OCR complète d'un document administratif officiel. Type : Lettre de convocation MDPH. Informations clés identifiées : Rendez-vous le 12 Octobre à 14h, revalorisation des indemnités à 950€/mois. Le texte contient 142 mots.",
      publicResponse: "J'ai analysé votre document. Il s'agit d'un courrier officiel du Ministère de la Santé concernant vos Droits MDPH. Les informations clés sont : un rendez-vous le 12 Octobre à 14h et le versement d'une indemnité de 950 euros le 5 de chaque mois. Ce document comporte 142 mots. Souhaitez-vous que je vous lise l'intégralité du texte ?",
      safetyLevel: 'SAFE',
      summary: "Lettre MDPH : RDV le 12 Octobre à 14h. Indemnité 950€/mois. Confirmation demandée pour lecture complète.",
      obstacles: [],
      ocrTextDetected: [
        "RÉPUBLIQUE FRANÇAISE - Ministère de la Santé",
        "Objet : Renouvellement des Droits MDPH",
        "Rendez-vous : 12 Octobre à 14h",
        "Indemnités revalorisées : 950 € / mois"
      ],
      documentAnalysis: {
        documentType: 'letter',
        title: "Convocation & Renouvellement Droits MDPH",
        keyInfo: [
          "Organisme : Ministère de la Santé / MDPH",
          "Rendez-vous fixé au : 12 Octobre à 14h",
          "Montant des indemnités revalorisées : 950 € par mois (Paiement le 5)",
          "Pièces à apporter : Pièce d'identité et justificatif de domicile"
        ],
        fullText: "RÉPUBLIQUE FRANÇAISE. Ministère de la Santé. Avis de convocation. Objet : Renouvellement des Droits MDPH. Madame, Monsieur, Nous vous confirmons votre rendez-vous pour la prise en charge de votre carte d'assistance visuelle le 12 Octobre à 14h. Montant des indemnités revalorisées : 950 euros. Paiement effectif le 5 de chaque mois. Veuillez vous munir de votre pièce d'identité et d'un justificatif.",
        wordCount: 142,
        confirmationRequired: true,
        sections: [
          { header: "En-tête & Objet", text: "Ministère de la Santé - Renouvellement des Droits MDPH" },
          { header: "Date de Rendez-vous", text: "12 Octobre à 14h pour la carte d'assistance visuelle" },
          { header: "Indemnités financières", text: "950 € revalorisés, versés le 5 du mois" }
        ]
      },
      suggestedAction: {
        actionType: 'read_full_document',
        prompt: "Lire le document complet mot à mot",
        details: "document-letter"
      }
    }
  },
  {
    id: 'product-orange-juice',
    title: 'Produit & Code-Barres (EMBALLAGE)',
    category: 'store',
    imageUrl: SVG_PRODUCT_BARCODE,
    userPrompt: "Identifier la brique de jus et scanner son code-barres.",
    description: "Emballage Jus d'Orange Tropicana avec code-barres EAN 3700123456789, prix 2.45€, 100% Pur Jus Bio.",
    simulatedData: {
      thoughtProcess: "Identification visuelle de packaging et décodage de code-barres EAN-13 (3700123456789). Marque : Tropicana. Produit : Jus d'orange 100% pur jus Bio. Analyse des allergènes : Aucun allergène. Prix étiquette : 2.45 €.",
      publicResponse: "C'est une brique de Jus d'Orange 100% Pur Jus Bio de la marque Tropicana. Code-barres scanné avec succès : 3 700123 456789. Ingrédients : 100% Oranges d'Espagne, sans sucre ajouté ni allergènes. Prix affiché : 2 euros 45.",
      safetyLevel: 'SAFE',
      summary: "Jus d'Orange Bio Tropicana (2.45 €). Code-barres EAN 3700123456789. Sans allergènes.",
      obstacles: [],
      ocrTextDetected: ["JUS D'ORANGE 100% PUR JUS BIO", "TROPICANA", "Prix : 2,45 €", "EAN : 3 700123 456789"],
      productAnalysis: {
        productName: "Jus d'Orange 100% Pur Jus Bio",
        brand: "Tropicana",
        category: "Boissons / Jus de fruits",
        barcode: "3 700123 456789",
        price: "2.45 €",
        packagingDescription: "Brique en carton orange 1L avec logo Tropicana Bio et code-barres visible en bas.",
        ingredients: ["100% Pur Jus d'Oranges d'Espagne de culture biologique"],
        allergens: ["Aucun allergène détecté"],
        expirationDate: "15/12/2026",
        shelfLocation: "Niveau intermédiaire (à hauteur des yeux)"
      },
      suggestedAction: {
        actionType: 'scan_barcode',
        prompt: "Vérifier la fiche produit via le réseau Be My Eyes",
        details: "EAN 3700123456789"
      }
    }
  }
];
