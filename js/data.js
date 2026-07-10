// Données de démonstration — GarageSocial
var App = window.App || {};

App.currentUser = {
  name: 'Léo Martin', handle: 'theo.rk', city: 'Lyon',
  bio: "Passionné de BMW depuis toujours. Toujours en train de préparer quelque chose.",
  followers: 812, following: 240,
};

App.data = {
  accounts: [
    { email: 'theo.rk@email.com', handle: 'theo.rk', password: 'demo1234', mode: 'particulier' },
  ],

  vehicles: [
    { id: 'v1', plate: 'AB123CD', make: 'BMW', model: 'M3 Touring', year: 2023, city: 'Lyon', tagline: 'Préparation Stage 2', ownerHandle: 'theo.rk', isOwn: true, followers: 812, modsCount: 3, photosCount: 36, prosCount: 2, plateBlurred: false, isPrivate: false, disableSearch: false,
      description: "Ma M3 Touring, achetée neuve fin 2022. Stage 2 chez Prépa Perf Auto, covering satin noir et jantes forgées 19 pouces. Toujours en évolution.",
      mods: [
        { title: 'Covering satin noir', pro: 'WrapStudio Lyon', date: 'il y a 3 sem.' },
        { title: 'Jantes 19" forgées', pro: 'Détail & Sens', date: 'il y a 2 mois' },
        { title: 'Reprogrammation Stage 2', pro: 'Prépa Perf Auto', date: 'il y a 5 mois' },
      ],
      maintenance: [
        { id: 'm1', type: 'revision', title: 'Révision complète 60 000 km', km: '60 000', date: '12/03/2026' },
        { id: 'm2', type: 'reparation', title: 'Remplacement plaquettes avant', km: '55 200', date: '02/12/2025' },
        { id: 'm3', type: 'revision', title: 'Vidange, filtres', km: '45 000', date: '18/06/2025' },
      ] },
    { id: 'v2', plate: 'GT99601', make: 'Porsche', model: '911 GT3', year: 1998, city: 'Bordeaux', tagline: 'Collection', ownerHandle: 'sarah.classic', isOwn: false, followers: 1204, modsCount: 2, photosCount: 58, prosCount: 1, plateBlurred: true, isPrivate: false, disableSearch: false,
      description: "996 GT3 conservée dans son jus, entretien méticuleux depuis 2015. Sortie piste deux fois par an.",
      mods: [
        { title: 'Révision complète moteur', pro: 'Atelier Classic 33', date: 'il y a 1 mois' },
        { title: 'Freins carbone-céramique', pro: 'Atelier Classic 33', date: 'il y a 8 mois' },
      ],
      maintenance: [
        { id: 'm4', type: 'revision', title: 'Contrôle IMS et vidange moteur', km: '98 400', date: '05/01/2026' },
        { id: 'm5', type: 'reparation', title: 'Remplacement durites de refroidissement', km: '92 000', date: '14/07/2025' },
      ] },
    { id: 'v3', plate: 'GO482KS', make: 'Volkswagen', model: 'Golf GTI Mk2', year: 1988, city: 'Marseille', tagline: 'Restomod', ownerHandle: 'maxime.tuning', isOwn: false, followers: 456, modsCount: 4, photosCount: 24, prosCount: 2, plateBlurred: false, isPrivate: false, disableSearch: false,
      description: "Golf Mk2 restaurée pendant 2 ans, moteur 16S préparé, intérieur refait à neuf.",
      mods: [
        { title: 'Restauration carrosserie complète', pro: 'Carrosserie Delta', date: 'il y a 4 mois' },
        { title: 'Préparation moteur 16S', pro: 'Prépa Perf Auto', date: 'il y a 6 mois' },
      ],
      maintenance: [] },
  ],

  forumMakes: [
    { id: 'mk1', name: 'BMW' },
    { id: 'mk2', name: 'Porsche' },
    { id: 'mk3', name: 'Volkswagen' },
    { id: 'mk4', name: 'Général' },
  ],
  forumModels: [
    { id: 'md1', makeId: 'mk1', name: 'M3' },
    { id: 'md2', makeId: 'mk1', name: 'Série 3' },
    { id: 'md3', makeId: 'mk2', name: '911' },
    { id: 'md4', makeId: 'mk3', name: 'Golf' },
    { id: 'md5', makeId: 'mk4', name: 'Discussions générales' },
  ],
  forumGenerations: [
    { id: 'g1', modelId: 'md1', name: 'F80' },
    { id: 'g2', modelId: 'md1', name: 'E92' },
    { id: 'g3', modelId: 'md3', name: '996' },
    { id: 'g4', modelId: 'md3', name: '997' },
    { id: 'g5', modelId: 'md4', name: 'Mk2' },
    { id: 'g6', modelId: 'md5', name: 'Toutes' },
  ],
  forumTopics: [
    { id: 't1', generationId: 'g1', title: 'Bruit à froid sur M3 F80 — normal ?', author: 'theo.rk', lastActivity: 'il y a 2h',
      posts: [
        { author: 'theo.rk', time: 'il y a 5h', text: "Depuis quelques semaines j'entends un léger cliquetis au démarrage à froid, qui disparaît après 1-2 minutes. Quelqu'un a déjà eu ça sur le S58 ?" },
        { author: 'julien.a', time: 'il y a 3h', text: "Classique sur ce moteur, c'est généralement le jeu des poussoirs hydrauliques qui se remet en pression. Si ça persiste au-delà de 2-3 min, fais vérifier le niveau d'huile." },
        { author: 'theo.rk', time: 'il y a 2h', text: "Merci, niveau nickel de mon côté, je vais surveiller ça." },
      ] },
    { id: 't2', generationId: 'g1', title: 'Fiabilité du Stage 2 sur le long terme', author: 'julien.a', lastActivity: 'hier',
      posts: [
        { author: 'julien.a', time: 'il y a 2 jours', text: "Ceux qui roulent en Stage 2 depuis plus d'un an, un retour sur la fiabilité moteur et boîte ?" },
        { author: 'theo.rk', time: 'hier', text: "5 mois de Stage 2 chez Prépa Perf Auto, aucun souci. Juste un suivi d'huile un peu plus rapproché par précaution." },
      ] },
    { id: 't3', generationId: 'g3', title: 'Entretien 996 : que surveiller sur l\'IMS ?', author: 'sarah.classic', lastActivity: 'il y a 4h',
      posts: [
        { author: 'sarah.classic', time: 'il y a 1 jour', text: "Ma GT3 approche les 100 000 km, je fais contrôler l'IMS par précaution même si le risque est plus faible sur ce bloc. Vos retours d'expérience ?" },
        { author: 'maxime.tuning', time: 'il y a 4h', text: "Sur les 996 GT3 le risque IMS est effectivement très réduit comparé aux Carrera de la même génération, mais un contrôle tous les 30-40k km reste une bonne pratique." },
      ] },
    { id: 't4', generationId: 'g5', title: 'Restauration Golf Mk2 — suivi de mon projet', author: 'maxime.tuning', lastActivity: 'il y a 1 sem.',
      posts: [
        { author: 'maxime.tuning', time: 'il y a 2 sem.', text: "Je poste ici le suivi de la restauration de ma Mk2 : carrosserie refaite intégralement, moteur 16S préparé chez Prépa Perf Auto. Prochaine étape : intérieur." },
        { author: 'theo.rk', time: 'il y a 1 sem.', text: "Superbe travail, hâte de voir le résultat final avec l'intérieur refait." },
      ] },
    { id: 't5', generationId: 'g6', title: 'Assurance collection : vos retours d\'expérience', author: 'sarah.classic', lastActivity: 'il y a 3 jours',
      posts: [
        { author: 'sarah.classic', time: 'il y a 1 sem.', text: "Je cherche à changer d'assureur pour ma 996 en collection, kilométrage limité. Des recommandations sérieuses ?" },
        { author: 'julien.a', time: 'il y a 3 jours', text: "J'ai un contrat collection pour ma sportive depuis 2 ans, plafond de kilométrage à 5000 km/an, tarif très correct. Je t'envoie les coordonnées en message." },
      ] },
  ],

  pros: [
    { id: 'p1', name: 'WrapStudio Lyon', category: 'Covering', city: 'Lyon', rating: 4.9, reviewsCount: 128,
      description: "Spécialiste covering et wrap depuis 2016. Pose de films PPF, covering intégral, teintage vitres. Intervention sur RDV en atelier ou à domicile.",
      reviews: [ { author: 'theo.rk', rating: 5, text: "Travail impeccable sur ma M3, finitions parfaites et respect des délais." }, { author: 'julien.a', rating: 5, text: "Très pro, conseils avisés sur le choix des teintes." } ] },
    { id: 'p2', name: 'Carrosserie Delta', category: 'Carrosserie', city: 'Villeurbanne', rating: 4.7, reviewsCount: 76,
      description: "Carrosserie générale, réparation collision, restauration de véhicules anciens. 20 ans d'expérience.",
      reviews: [ { author: 'maxime.tuning', rating: 5, text: "Restauration de ma Golf comme neuve, un vrai travail d'orfèvre." } ] },
    { id: 'p3', name: 'Détail & Sens', category: 'Détailing', city: 'Lyon', rating: 4.8, reviewsCount: 54,
      description: "Detailing haut de gamme : polissage, céramique, nettoyage intérieur complet. Véhicules de collection et sportives bienvenus.",
      reviews: [ { author: 'sarah.classic', rating: 5, text: "Ma GT3 n'a jamais été aussi propre. Attention aux détails remarquable." } ] },
    { id: 'p4', name: 'Prépa Perf Auto', category: 'Préparation', city: 'Grenoble', rating: 4.6, reviewsCount: 39,
      description: "Préparation moteur, reprogrammation, échappements sur-mesure. Homologations DREAL disponibles.",
      reviews: [ { author: 'theo.rk', rating: 4, text: "Reprogrammation nette, gain de puissance ressenti immédiatement." } ] },
    { id: 'p5', name: 'Lyon Sport Autos', category: 'Vente de véhicules', city: 'Lyon', rating: 4.8, reviewsCount: 61,
      description: "Achat, vente et reprise de véhicules sportives et de collection. Estimation gratuite, mandat de vente sans engagement.",
      reviews: [ { author: 'sarah.classic', rating: 5, text: "Vente de mon ancienne voiture réglée en 3 semaines, prix juste et sans arnaque." } ] },
  ],

  posts: [
    { id: 'po1', vehicleId: 'v1', ownerHandle: 'theo.rk', time: 'il y a 3 heures', text: "Nouveau covering posé cette semaine chez WrapStudio Lyon 🖤", likes: 214, comments: 18 },
    { id: 'po2', vehicleId: 'v3', ownerHandle: 'maxime.tuning', time: 'hier', text: "Fin de la restauration après 2 ans de travail. Elle est enfin prête pour l'été.", likes: 389, comments: 42 },
    { id: 'po3', vehicleId: 'v2', ownerHandle: 'sarah.classic', time: 'il y a 2 jours', text: "Sortie piste ce week-end, toujours un plaisir sur circuit.", likes: 567, comments: 31 },
  ],

  quoteRequests: [
    { id: 'q1', vehicleId: 'v1', vehicleName: 'BMW M3 Touring', proId: 'p1', proName: 'WrapStudio Lyon', service: 'Covering intégral satin', status: 2, clientHandle: 'theo.rk' },
    { id: 'q2', vehicleId: 'v1', vehicleName: 'BMW M3 Touring', proId: 'p4', proName: 'Prépa Perf Auto', service: 'Reprogrammation Stage 2', status: 4, clientHandle: 'theo.rk' },
  ],

  conversationsData: [
    { id: 'c1', name: 'WrapStudio Lyon', messages: [
      { from: 'them', text: "Bonjour ! On a bien reçu votre demande de covering, on revient vers vous avec un devis d'ici demain." },
      { from: 'me', text: "Merci, au plaisir !" },
      { from: 'them', text: "Devis envoyé, n'hésitez pas si vous avez des questions sur les teintes." },
    ] },
    { id: 'c2', name: 'sarah.classic', messages: [
      { from: 'them', text: "Sympa ta M3 ! Tu l'as fait covering où ?" },
      { from: 'me', text: "WrapStudio Lyon, je recommande à 100%." },
    ] },
    { id: 'c3', name: 'Prépa Perf Auto', messages: [
      { from: 'them', text: "Reprogrammation terminée, votre véhicule est prêt." },
    ] },
  ],

  myProBusiness: { name: 'WrapStudio Lyon', newLeadsCount: 1, completedCount: 1, rating: 4.9, reviewsCount: 128 },

  leadsData: [
    { id: 'l1', service: 'Covering intégral satin', clientHandle: 'theo.rk', vehicleName: 'BMW M3 Touring', status: 0 },
    { id: 'l2', service: 'Teintage vitres arrière', clientHandle: 'maxime.tuning', vehicleName: 'Golf GTI Mk2', status: 3 },
  ],
};

window.App = App;
