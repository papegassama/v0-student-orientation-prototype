export type Answers = {
  stream: string
  favoriteSubjects: string[]
  difficultSubjects: string[]
  level: string
  interests: string[]
  workStyle: string
  activityType: string
  longStudies: string
  studyType: string
  location: string
  budget: string
}

export type Recommendation = {
  title: string
  description: string
  explanation: string
  keySubjects: string[]
  difficulty: "Facile" | "Modéré" | "Exigeant"
  duration: string
  institutions: string[]
  careers: string[]
  practicalNotes: string
  matchScore: number
}

export function generateRecommendations(answers: Answers): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Helper function to calculate match score
  const calculateScore = (favoriteMatch: number, interestMatch: number, constraintMatch: number): number => {
    return Math.round((favoriteMatch * 0.4 + interestMatch * 0.4 + constraintMatch * 0.2) * 100)
  }

  // Tech/Computer Science paths
  if (
    (answers.favoriteSubjects.includes("Mathématiques") || answers.favoriteSubjects.includes("Physique-Chimie")) &&
    (answers.interests.includes("Technologie") || answers.activityType === "Computer")
  ) {
    recommendations.push({
      title: "Informatique et Génie Logiciel",
      description:
        "L'informatique est la science qui étudie le traitement automatique de l'information. Tu apprendras à créer des applications, des sites web et à résoudre des problèmes avec le code.",
      explanation:
        "Tu aimes les maths et la technologie. L'informatique te permettra de créer des applications, des sites web et de résoudre des problèmes avec le code.",
      keySubjects: ["Mathématiques", "Algorithmique", "Programmation", "Bases de données", "Réseaux informatiques"],
      difficulty: "Modéré",
      duration: "3 à 5 ans (Licence ou Master)",
      institutions: [
        "Université Cheikh Anta Diop (UCAD)",
        "École Supérieure Polytechnique (ESP)",
        "Écoles privées d'informatique",
      ],
      careers: ["Développeur web ou mobile", "Administrateur de systèmes", "Analyste programmeur", "Chef de projet IT"],
      practicalNotes:
        "Beaucoup de pratique sur ordinateur. Il faut aimer résoudre des problèmes logiques et apprendre de nouveaux langages de programmation régulièrement.",
      matchScore: calculateScore(1, 1, 0.8),
    })
  }

  // Medicine and Health paths
  if (
    (answers.favoriteSubjects.includes("SVT") || answers.favoriteSubjects.includes("Physique-Chimie")) &&
    answers.interests.includes("Santé") &&
    answers.longStudies === "Yes"
  ) {
    recommendations.push({
      title: "Médecine",
      description:
        "La médecine est l'art et la science de diagnostiquer, traiter et prévenir les maladies. C'est un parcours long mais très gratifiant pour ceux qui veulent soigner les autres.",
      explanation:
        "Tu excelles en SVT et tu es passionné par la santé. La médecine est un parcours exigeant qui te permettra de soigner et d'aider les gens.",
      keySubjects: ["Biologie", "Anatomie", "Physiologie", "Pharmacologie", "Pathologie", "Chimie organique"],
      difficulty: "Exigeant",
      duration: "7 à 9 ans",
      institutions: ["Université Cheikh Anta Diop - Faculté de Médecine", "Université Gaston Berger (UGB)"],
      careers: ["Médecin généraliste", "Médecin spécialiste", "Chirurgien", "Chercheur en médecine"],
      practicalNotes:
        "Études très longues et exigeantes. Beaucoup de mémorisation, de stages pratiques à l'hôpital et de gardes. La concurrence est forte mais les débouchés sont stables.",
      matchScore: calculateScore(1, 1, answers.longStudies === "Yes" ? 1 : 0.3),
    })
  }

  // Nursing - shorter health path
  if (
    answers.interests.includes("Santé") &&
    (answers.favoriteSubjects.includes("SVT") || answers.stream === "S") &&
    answers.longStudies === "No"
  ) {
    recommendations.push({
      title: "Sciences Infirmières",
      description:
        "Les sciences infirmières forment des professionnels de santé qui travaillent aux côtés des médecins pour soigner les patients et assurer leur bien-être.",
      explanation:
        "Tu t'intéresses à la santé mais préfères un parcours plus court. Les sciences infirmières te permettront de travailler rapidement dans le secteur médical.",
      keySubjects: ["Soins infirmiers", "Anatomie", "Pharmacologie", "Hygiène", "Premiers secours"],
      difficulty: "Modéré",
      duration: "3 ans",
      institutions: [
        "Institut de Formation en Sciences de la Santé (IFSS)",
        "Écoles d'infirmiers publiques et privées",
      ],
      careers: [
        "Infirmier d'État",
        "Sage-femme",
        "Infirmier spécialisé (bloc opératoire, urgences)",
        "Gestionnaire de centre de santé",
      ],
      practicalNotes:
        "Beaucoup de pratique en milieu hospitalier. Les horaires peuvent être irréguliers (nuit, week-end). C'est un métier humainement enrichissant mais physiquement exigeant.",
      matchScore: calculateScore(0.8, 1, answers.longStudies === "No" ? 1 : 0.5),
    })
  }

  // Business and Management
  if (
    (answers.stream === "G" ||
      answers.favoriteSubjects.includes("Économie") ||
      answers.interests.includes("Commerce")) &&
    answers.workStyle === "Team"
  ) {
    recommendations.push({
      title: "Gestion et Commerce",
      description:
        "La gestion et le commerce forment des professionnels capables de diriger des entreprises, gérer des équipes et développer des stratégies commerciales.",
      explanation:
        "Tu aimes l'économie et travailler en équipe. Une formation en gestion te préparera à diriger des entreprises ou à créer ton propre business.",
      keySubjects: ["Marketing", "Comptabilité", "Management", "Économie", "Droit des affaires", "Statistiques"],
      difficulty: "Modéré",
      duration: "3 à 5 ans (Licence ou Master)",
      institutions: [
        "UCAD - Faculté des Sciences Économiques",
        "ISM (Institut Supérieur de Management)",
        "Écoles de commerce privées",
      ],
      careers: [
        "Gestionnaire d'entreprise",
        "Responsable marketing",
        "Chargé de clientèle",
        "Entrepreneur",
        "Consultant",
      ],
      practicalNotes:
        "Formation équilibrée entre théorie et pratique. Beaucoup de travaux de groupe et de présentations. Les stages en entreprise sont essentiels pour acquérir de l'expérience.",
      matchScore: calculateScore(0.9, 1, 0.8),
    })
  }

  // Accounting
  if (
    (answers.stream === "G" || answers.favoriteSubjects.includes("Économie")) &&
    answers.favoriteSubjects.includes("Mathématiques")
  ) {
    recommendations.push({
      title: "Comptabilité et Finance",
      description:
        "La comptabilité et la finance consistent à gérer les ressources financières des entreprises, tenir les comptes et conseiller sur les investissements.",
      explanation:
        "Tu es bon en maths et en économie. La comptabilité est un domaine stable avec beaucoup d'opportunités d'emploi au Sénégal.",
      keySubjects: [
        "Comptabilité générale",
        "Comptabilité analytique",
        "Fiscalité",
        "Audit",
        "Finance d'entreprise",
        "Mathématiques financières",
      ],
      difficulty: "Modéré",
      duration: "3 à 5 ans",
      institutions: ["UCAD - Faculté des Sciences Économiques", "Écoles de comptabilité privées", "CESAG"],
      careers: [
        "Comptable",
        "Auditeur",
        "Contrôleur de gestion",
        "Expert-comptable",
        "Analyste financier",
        "Conseiller fiscal",
      ],
      practicalNotes:
        "Beaucoup de rigueur et de précision nécessaires. Il faut être à l'aise avec les chiffres et la législation. Les débouchés sont nombreux dans toutes les entreprises.",
      matchScore: calculateScore(0.9, 0.8, 0.9),
    })
  }

  // Engineering
  if (
    answers.favoriteSubjects.includes("Mathématiques") &&
    answers.favoriteSubjects.includes("Physique-Chimie") &&
    (answers.stream === "S" || answers.stream === "T")
  ) {
    recommendations.push({
      title: "Génie Civil et Architecture",
      description:
        "Le génie civil et l'architecture concernent la conception et la construction de bâtiments, ponts, routes et autres infrastructures qui façonnent notre environnement.",
      explanation:
        "Tu excelles en maths et physique. Le génie civil te permettra de participer à la construction du Sénégal en concevant des bâtiments et des infrastructures.",
      keySubjects: [
        "Mathématiques appliquées",
        "Résistance des matériaux",
        "Mécanique",
        "Dessin technique",
        "Béton armé",
        "Topographie",
      ],
      difficulty: "Exigeant",
      duration: "5 ans (Diplôme d'ingénieur)",
      institutions: ["École Supérieure Polytechnique (ESP)", "Université Gaston Berger - UFR SAT"],
      careers: [
        "Ingénieur en génie civil",
        "Architecte",
        "Chef de chantier",
        "Ingénieur BTP",
        "Urbaniste",
        "Contrôleur technique",
      ],
      practicalNotes:
        "Formation scientifique très exigeante. Beaucoup de calculs et de travaux pratiques. Les stages sur chantier sont fréquents. Secteur porteur au Sénégal avec les projets d'infrastructures.",
      matchScore: calculateScore(1, 0.7, 0.7),
    })
  }

  // Law
  if (
    (answers.favoriteSubjects.includes("Français") || answers.favoriteSubjects.includes("Histoire-Géo")) &&
    (answers.stream === "L" || answers.interests.includes("Commerce")) &&
    answers.workStyle === "Team"
  ) {
    recommendations.push({
      title: "Droit",
      description:
        "Le droit est l'étude des lois et des règles qui régissent la société. Les juristes conseillent, défendent et appliquent ces règles dans différents domaines.",
      explanation:
        "Tu aimes lire, argumenter et comprendre les règles. Le droit offre de nombreuses opportunités comme avocat, magistrat ou juriste d'entreprise.",
      keySubjects: [
        "Droit civil",
        "Droit pénal",
        "Droit des affaires",
        "Droit constitutionnel",
        "Procédure",
        "Droit international",
      ],
      difficulty: "Modéré",
      duration: "4 à 6 ans",
      institutions: ["UCAD - Faculté des Sciences Juridiques", "Université Gaston Berger"],
      careers: [
        "Avocat",
        "Magistrat",
        "Juriste d'entreprise",
        "Notaire",
        "Huissier",
        "Conseiller juridique",
        "Greffier",
      ],
      practicalNotes:
        "Beaucoup de lecture et de mémorisation de textes juridiques. Il faut avoir un bon esprit d'analyse et savoir bien s'exprimer à l'oral et à l'écrit.",
      matchScore: calculateScore(0.8, 0.8, 0.8),
    })
  }

  // Technical and Vocational Training
  if (
    (answers.activityType === "Practical" || answers.interests.includes("Travail de terrain")) &&
    answers.longStudies === "No"
  ) {
    recommendations.push({
      title: "Formation Technique et Professionnelle",
      description:
        "Les formations techniques et professionnelles permettent d'acquérir rapidement des compétences pratiques dans des métiers manuels et techniques.",
      explanation:
        "Tu préfères le travail pratique et manuel. Les formations techniques te permettront d'acquérir rapidement des compétences concrètes et de trouver un emploi.",
      keySubjects: [
        "Pratique du métier choisi",
        "Technologie",
        "Dessin technique",
        "Sécurité au travail",
        "Gestion de base",
      ],
      difficulty: "Facile",
      duration: "2 à 3 ans",
      institutions: [
        "Centres de formation professionnelle",
        "ISEP (Institut Supérieur d'Enseignement Professionnel)",
        "ONFP",
      ],
      careers: [
        "Électricien",
        "Plombier",
        "Menuisier",
        "Mécanicien auto",
        "Soudeur",
        "Maçon qualifié",
        "Technicien de maintenance",
      ],
      practicalNotes:
        "Formation très pratique avec beaucoup d'ateliers. Peu de théorie. Les diplômés trouvent souvent rapidement du travail ou peuvent s'installer à leur compte.",
      matchScore: calculateScore(0.6, 1, 1),
    })
  }

  // Communications and Media
  if (
    (answers.favoriteSubjects.includes("Français") || answers.favoriteSubjects.includes("Anglais")) &&
    (answers.interests.includes("Arts") || answers.workStyle === "Team")
  ) {
    recommendations.push({
      title: "Communication et Journalisme",
      description:
        "La communication et le journalisme forment des professionnels qui informent, communiquent et créent du contenu pour différents médias.",
      explanation:
        "Tu es à l'aise avec les langues et tu aimes communiquer. Ce domaine te permettra de travailler dans les médias, la publicité ou les relations publiques.",
      keySubjects: [
        "Techniques rédactionnelles",
        "Communication digitale",
        "Relations publiques",
        "Production audiovisuelle",
        "Marketing de contenu",
      ],
      difficulty: "Modéré",
      duration: "3 à 5 ans",
      institutions: ["UCAD - CESTI", "ISM", "Écoles de communication privées"],
      careers: [
        "Journaliste",
        "Chargé de communication",
        "Community manager",
        "Attaché de presse",
        "Producteur de contenu",
        "Présentateur",
      ],
      practicalNotes:
        "Secteur créatif et dynamique. Il faut être curieux, polyvalent et à l'aise avec les nouvelles technologies. Les stages et le réseau professionnel sont très importants.",
      matchScore: calculateScore(0.8, 0.9, 0.7),
    })
  }

  // Biology and Agricultural Sciences
  if (
    answers.favoriteSubjects.includes("SVT") &&
    answers.interests.includes("Sciences") &&
    !answers.interests.includes("Santé")
  ) {
    recommendations.push({
      title: "Agronomie et Sciences de l'Environnement",
      description:
        "L'agronomie et les sciences de l'environnement étudient la production agricole durable et la protection de notre écosystème.",
      explanation:
        "Tu aimes la biologie et les sciences. L'agronomie te permettra de contribuer au développement agricole et à la protection de l'environnement.",
      keySubjects: [
        "Biologie végétale",
        "Science du sol",
        "Techniques agricoles",
        "Gestion des ressources naturelles",
        "Écologie",
      ],
      difficulty: "Modéré",
      duration: "3 à 5 ans",
      institutions: [
        "École Nationale Supérieure d'Agriculture (ENSA)",
        "Université Gaston Berger",
        "Institut des Sciences de l'Environnement",
      ],
      careers: [
        "Ingénieur agronome",
        "Conseiller agricole",
        "Gestionnaire de projets ruraux",
        "Spécialiste en environnement",
        "Chercheur",
      ],
      practicalNotes:
        "Beaucoup de travaux pratiques sur le terrain et en laboratoire. Il faut aimer la nature et être prêt à travailler en zone rurale. Secteur important pour le développement du Sénégal.",
      matchScore: calculateScore(0.9, 0.8, 0.7),
    })
  }

  // Teaching
  if (
    answers.level === "Good" &&
    (answers.favoriteSubjects.includes("Français") ||
      answers.favoriteSubjects.includes("Mathématiques") ||
      answers.stream === "L")
  ) {
    recommendations.push({
      title: "Enseignement et Éducation",
      description:
        "L'enseignement et l'éducation forment les professeurs et éducateurs qui transmettent le savoir aux futures générations.",
      explanation:
        "Tu as un bon niveau et tu aimes partager tes connaissances. Devenir enseignant te permettra de former la prochaine génération.",
      keySubjects: [
        "Pédagogie",
        "Psychologie de l'enfant",
        "Didactique",
        "Matières d'enseignement (selon spécialité)",
        "Gestion de classe",
      ],
      difficulty: "Modéré",
      duration: "3 à 4 ans",
      institutions: ["Fastef (Faculté des Sciences et Technologies de l'Éducation)", "Écoles normales"],
      careers: [
        "Professeur de collège ou lycée",
        "Instituteur",
        "Conseiller pédagogique",
        "Inspecteur de l'éducation",
        "Formateur",
      ],
      practicalNotes:
        "Il faut aimer transmettre et avoir de la patience. Beaucoup de stages pratiques dans les établissements. Le métier offre une bonne stabilité et des vacances régulières.",
      matchScore: calculateScore(0.8, 0.7, 0.9),
    })
  }

  // Network and Telecommunications
  if (
    answers.favoriteSubjects.includes("Mathématiques") &&
    answers.interests.includes("Technologie") &&
    answers.stream === "S"
  ) {
    recommendations.push({
      title: "Réseaux et Télécommunications",
      description:
        "Les réseaux et télécommunications concernent la transmission de données et d'informations à travers les systèmes de communication modernes.",
      explanation:
        "Tu aimes les maths et la technologie. Les réseaux et télécoms sont essentiels dans notre monde connecté et offrent de bonnes opportunités.",
      keySubjects: [
        "Réseaux informatiques",
        "Systèmes de télécommunication",
        "Sécurité informatique",
        "Protocoles de communication",
        "Électronique",
      ],
      difficulty: "Modéré",
      duration: "3 à 5 ans",
      institutions: ["École Supérieure Polytechnique (ESP)", "Universités privées spécialisées"],
      careers: [
        "Administrateur réseau",
        "Technicien télécoms",
        "Ingénieur réseaux",
        "Spécialiste en cybersécurité",
        "Consultant IT",
      ],
      practicalNotes:
        "Formation technique avec beaucoup de pratique en laboratoire. Le secteur évolue rapidement, il faut être prêt à se former continuellement aux nouvelles technologies.",
      matchScore: calculateScore(0.9, 1, 0.8),
    })
  }

  // Sort by match score and return top 3-5
  recommendations.sort((a, b) => b.matchScore - a.matchScore)

  // Return between 3 and 5 recommendations
  const finalRecommendations = recommendations.slice(0, Math.min(5, Math.max(3, recommendations.length)))

  // If we have fewer than 3, add generic fallback recommendations
  if (finalRecommendations.length < 3) {
    if (!finalRecommendations.find((r) => r.title.includes("Gestion"))) {
      finalRecommendations.push({
        title: "Gestion et Administration",
        description:
          "Une formation polyvalente qui ouvre les portes de nombreux secteurs d'activité dans le public et le privé.",
        explanation: "Une formation générale en gestion offre de nombreuses opportunités dans différents secteurs.",
        keySubjects: ["Management", "Comptabilité", "Économie", "Ressources humaines", "Marketing"],
        difficulty: "Modéré",
        duration: "3 à 5 ans",
        institutions: ["UCAD", "Écoles de gestion privées"],
        careers: ["Gestionnaire", "Assistant administratif", "Responsable RH", "Chargé de projet"],
        practicalNotes:
          "Formation généraliste qui permet de travailler dans différents domaines. Les opportunités sont variées.",
        matchScore: 65,
      })
    }
  }

  return finalRecommendations
}
