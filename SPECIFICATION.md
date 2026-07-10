# Spécification - Application Web Tournoi Multi-Sport

## 📋 Vue d'ensemble

Application web HTML/CSS pour gérer un tournoi multi-sport avec 9 équipes. L'application fonctionne sans base de données, utilisant le stockage local du navigateur (localStorage) pour persister les données.

### Caractéristiques principales
- ✅ Gestion de 9 équipes
- ✅ 5 sports différents
- ✅ Enregistrement des défis entre équipes
- ✅ Scores et résultats
- ✅ Classements par sport et général
- ✅ Visualisations graphiques
- ✅ Interface responsive

---

## 🏗️ Architecture technique

### Stack
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Stockage**: localStorage (JSON)
- **Graphiques**: Chart.js ou Plotly.js
- **Framework CSS**: Flexbox/Grid (pas de dépendances externes)

### Structure des données

```json
{
  "equipes": [
    {
      "id": 1,
      "nom": "Nom de l'équipe",
      "couleur": "#FF5733",
      "membres": ["Joueur 1", "Joueur 2"]
    }
  ],
  "sports": [
    {
      "id": "pingpong",
      "nom": "Ping Pong",
      "description": "Tennis de table"
    }
  ],
  "matches": [
    {
      "id": "match_1",
      "sport": "pingpong",
      "equipe1": 1,
      "equipe2": 2,
      "score1": 3,
      "score2": 2,
      "date": "2024-01-15",
      "statut": "joué" // "à venir", "en cours", "joué"
    }
  ],
  "classements": {
    "pingpong": [
      {
        "equipeId": 1,
        "points": 45,
        "victoires": 5,
        "defaites": 2
      }
    ]
  }
}
```

---

## 📱 Pages et fonctionnalités

### 1. **Accueil / Tableau de bord**
**Objectif**: Vue globale du tournoi

**Éléments**:
- 📊 Score global du tournoi (classement général)
- 🔥 Équipe en tête
- 📅 Prochains matches (3 prochains)
- 🎯 Statistiques rapides
  - Total de matches joués
  - Nombre d'équipes
  - Nombre de sports
- Liens rapides vers les pages principales

---

### 2. **Liste des équipes**
**Objectif**: Gérer et consulter les équipes

**Éléments**:
- 📋 Tableau de toutes les 9 équipes
- 👥 Affichage du nombre de membres
- 🎨 Identification visuelle (couleur)
- ➕ Ajouter/Éditer une équipe
- 📊 Score global de chaque équipe
- 🔄 Historique des matches (bouton d'accès)
- Actions: Éditer, Voir détails

**Formulaire d'ajout/édition**:
- Nom de l'équipe
- Couleur (color picker)
- Membres (liste ajoutable/supprimable)

---

### 3. **Sports et Matches**
**Objectif**: Vue complète des compétitions par sport

**Deux sous-sections**:

#### 3a. Sélection du sport
- 🎯 Cards pour chaque sport
- Nom et description
- Nombre de matches (joués / totaux)
- Bouton "Voir détails"

#### 3b. Détails d'un sport
- 📊 Classement du sport
  - Rang, Équipe, Points, Victoires, Défaites, Ratio
- 📅 Calendrier des matches
  - Affichage filtrable: À venir, En cours, Joués
  - Formulaire pour enregistrer un nouveau match
- 📈 Graphique: Points/Victoires par équipe (pour ce sport)

---

### 4. **Calendrier / Planning**
**Objectif**: Vue chronologique de tous les matches

**Éléments**:
- 📅 Vue calendrier ou liste chronologique
- Filtres:
  - Par sport
  - Par statut (à venir, joué)
  - Par équipe
- Détails de chaque match:
  - Sport
  - Équipe 1 vs Équipe 2
  - Score
  - Date
  - Actions: Éditer, Marquer comme joué

**Formulaire d'ajout de match**:
- Sélection du sport
- Équipe 1 et Équipe 2 (dropdown)
- Scores (si déjà joué)
- Date
- Statut

---

### 5. **Classements généraux**
**Objectif**: Vue synthétique des classements

**Affichage**:
- 🥇 Classement général (tous sports confondus)
  - Points totaux pondérés
  - Nombre total de victoires
- 🏆 Classement par sport (onglets)
  - Chacun des 5 sports
  - Tri possible: points, victoires, ratio

**Visualisations**:
- Tableau classique
- Badges/Medailles pour top 3
- Codes couleur pour les équipes

---

### 6. **Graphiques et statistiques**
**Objectif**: Analyse visuelle des performances

**Graphiques à afficher**:
- 📈 Évolution des points (ligne) - par équipe ou tous
- 📊 Victoires vs Défaites (barres empilées)
- 🥧 Répartition des victoires par sport
- 🎯 Tête-à-tête entre deux équipes
- 🔥 Performance par sport

**Options interactives**:
- Filtrer par sport
- Filtrer par équipe
- Exporter en image

---

### 7. **Détails d'une équipe**
**Objectif**: Profil complet d'une équipe

**Éléments**:
- 🎨 Couleur et identité
- 👥 Liste des membres
- 📊 Classement général
- 🏆 Classement par sport (tableau ou onglets)
- 📅 Historique des matches
  - Tous les matches joués
  - Trier par sport, par date, par résultat
- 📈 Graphiques personnalisés
  - Performance dans chaque sport
  - Évolution du score
- ⚔️ Bilan face à face avec les autres équipes

---

### 8. **Paramètres / Configuration**
**Objectif**: Gérer les paramètres de l'app

**Options**:
- 🎨 Thème (clair/sombre)
- 💾 Exporter les données (JSON)
- 📥 Importer les données (JSON)
- 🔄 Réinitialiser l'application
- 📋 Gestion des équipes (CRUD complet)
- 🏆 Configuration des sports (non éditable par défaut)

---

## 🎨 Design et UX

### Palette de couleurs
- Primaire: Couleur dynamique (couleur de l'équipe sélectionnée)
- Secondaire: Gris/Bleu neutre
- Succès: Vert (#27AE60)
- Danger: Rouge (#E74C3C)
- Accent: Orange/Jaune

### Responsivité
- Mobile First
- Breakpoints: 480px, 768px, 1024px, 1440px
- Navigation adaptative (hamburger menu sur mobile)

### Composants réutilisables
- **Card**: Équipe, Sport, Match
- **Modal**: Formulaires, confirmations
- **Tableau**: Données tabulaires avec tri
- **Graphique**: Chart.js
- **Bouton**: Primaire, Secondaire, Danger
- **Badge**: Statut, Rang

---

## 📊 Calcul des points

### Système de scoring
- **Victoire**: 3 points
- **Défaite**: 0 points
- **Bonus**: Points gagnés selon la différence de score (optionnel)

### Classement général
- Points totaux de tous les sports
- En cas d'égalité: nombre total de victoires
- En cas d'égalité: différence de buts/points

---

## 🔄 Flux utilisateur

### Initialisation
1. Première visite: Créer 9 équipes
2. Configurer les membres de chaque équipe

### Utilisation courante
1. Accueil → Vue d'ensemble
2. Calendrier → Enregistrer un nouveau match
3. Classements → Consulter les résultats
4. Détails équipe → Analyser une équipe

### Gestion des données
- Toutes les modifications sont sauvegardées instantanément
- Export/Import possible pour sauvegarde externe

---

## 🎯 Fonctionnalités optionnelles (MVP+)

- 📧 Export PDF des classements
- 📱 Progressive Web App (PWA)
- 🔔 Notifications pour les prochains matches
- ⚡ Mode hors ligne
- 📸 Galerie de photos
- 💬 Système de commentaires
- 🏅 Achievements/Badges
- 📊 Statistiques avancées (écart-type, tendances)

---

## 📝 Notes de développement

### localStorage Structure
```javascript
{
  "sports_tournament": {
    "version": "1.0",
    "equipes": [...],
    "sports": [...],
    "matches": [...],
    "parametres": {
      "theme": "light",
      "dateCreation": "2024-01-01"
    }
  }
}
```

### Validation
- Empêcher les doublons (même équipe deux fois)
- Scores entiers positifs
- Dates valides
- Noms uniques pour les équipes

### Performance
- Calcul des classements en cache
- Recalcul uniquement lors d'ajout de match
- Pagination si >100 matches

---

## ✅ Checklist MVP

- [ ] Page d'accueil
- [ ] Gestion des équipes (CRUD)
- [ ] Enregistrement des matches
- [ ] Classements généraux
- [ ] Classements par sport
- [ ] Détails des équipes
- [ ] Calendrier
- [ ] Graphiques basiques
- [ ] localStorage (save/load)
- [ ] Design responsive
- [ ] Tests et déploiement

---

## 📚 Sports du tournoi

| Sport | Description | Type |
|-------|-------------|------|
| **Ping Pong** | Tennis de table, 1v1 ou équipes | Raquette |
| **Pétanque** | Boules, équipes | Précision |
| **Baby Foot** | Babyfoot, équipes | Réflexe |
| **Spike Ball** | Jeu de ballon, équipes | Ballon |
| **Concombraise** | Sport personnalisé | Équipe |

---

*Spécification v1.0 - 2024*