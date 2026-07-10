# Architecture Technique - Application Tournoi Multi-Sport

## 📁 Structure du projet

```
sports-tournament/
├── index.html                 # Page d'accueil
├── pages/
│   ├── dashboard.html         # Tableau de bord
│   ├── equipes.html           # Liste des équipes
│   ├── equipe-detail.html     # Détails d'une équipe
│   ├── sports.html            # Vue sports (grid)
│   ├── sport-detail.html      # Détails d'un sport
│   ├── calendrier.html        # Calendrier des matches
│   ├── classements.html       # Classements
│   ├── statistiques.html      # Graphiques et stats
│   └── parametres.html        # Paramètres
├── css/
│   ├── main.css               # Styles globaux
│   ├── components.css         # Composants réutilisables
│   ├── responsive.css         # Responsive design
│   └── theme.css              # Thèmes (light/dark)
├── js/
│   ├── app.js                 # Point d'entrée
│   ├── storage.js             # Gestion localStorage
│   ├── data-manager.js        # Logique métier
│   ├── calculator.js          # Calculs (classements, scores)
│   ├── ui.js                  # Gestion DOM
│   ├── charts.js              # Graphiques (Chart.js)
│   ├── router.js              # Navigation (SPA)
│   └── utils.js               # Fonctions utilitaires
├── lib/
│   └── chart.js               # Librairie graphiques
├── data/
│   └── initial-data.json      # Données initiales (sports, équipes)
└── README.md                  # Documentation
```

## 🔧 Modules JavaScript

### 1. **storage.js** - Gestion localStorage

```javascript
class StorageManager {
  constructor(namespace = 'sports_tournament') {
    this.namespace = namespace;
  }

  // Save/Load data
  save(key, data) { }
  load(key) { }
  
  // Équipes
  getEquipes() { }
  saveEquipes(equipes) { }
  
  // Matches
  getMatches() { }
  saveMatches(matches) { }
  
  // Sports
  getSports() { }
  
  // Bulk operations
  exportData() { }
  importData(jsonData) { }
  reset() { }
}

storage = new StorageManager();
```

### 2. **data-manager.js** - Logique métier

```javascript
class DataManager {
  constructor(storage) {
    this.storage = storage;
  }

  // Équipes CRUD
  createEquipe(nom, couleur, membres) { }
  updateEquipe(id, data) { }
  deleteEquipe(id) { }
  getEquipe(id) { }
  getAllEquipes() { }

  // Matches CRUD
  createMatch(sport, equipe1, equipe2, date, score1, score2) { }
  updateMatch(id, data) { }
  deleteMatch(id) { }
  getMatch(id) { }
  getAllMatches() { }
  getMatchesBySport(sport) { }
  getMatchesByEquipe(equipeId) { }
  
  // Sports
  getAllSports() { }
  
  // Validation
  validateEquipeUnique(nom, excludeId) { }
  validateScores(score1, score2) { }
  validateDate(date) { }
}

dataManager = new DataManager(storage);
```

### 3. **calculator.js** - Calculs et statistiques

```javascript
class Calculator {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  // Classements
  getClassementGeneral() {
    // Trier équipes par points totaux
    // Format: [{equipe, points, victoires, defaites, ratio}, ...]
  }

  getClassementSport(sport) {
    // Classement pour un sport spécifique
  }

  // Calculs d'une équipe
  getPointsEquipe(equipeId) { }
  getWinLossRatio(equipeId) { }
  getStatsBySport(equipeId) {
    // {sport: {points, victoires, defaites}}
  }

  // Statistiques globales
  getTotalMatches() { }
  getHeadToHead(equipe1, equipe2) { }
  getPerformanceTrend(equipeId, sportId) { }

  // Graphiques
  getDataForChart(type, filters) {
    // Retourne données formatées pour Chart.js
  }
}

calculator = new Calculator(dataManager);
```

### 4. **ui.js** - Gestion DOM

```javascript
class UIManager {
  // Navigation
  setActivePage(pageId) { }
  renderNavigation() { }

  // Équipes
  renderEquipesList(equipes) { }
  renderEquipeCard(equipe) { }
  renderEquipeDetail(equipe) { }
  openEquipeModal(equipe) { }

  // Matches
  renderMatchesList(matches) { }
  renderMatchesCalendar(matches) { }
  openMatchModal(match) { }

  // Classements
  renderClassement(classement) { }
  renderClassementTable(data) { }

  // Modals
  openModal(type, data) { }
  closeModal() { }

  // Toasts/Notifications
  showNotification(message, type) { } // success, error, info
}

ui = new UIManager();
```

### 5. **charts.js** - Visualisations

```javascript
class ChartsManager {
  constructor() {
    // Chart.js config
  }

  // Graphiques
  createLineChart(elementId, data) { }      // Évolution
  createBarChart(elementId, data) { }       // V/D
  createPieChart(elementId, data) { }       // Distribution
  createRadarChart(elementId, data) { }     // Tête-à-tête

  // Données
  prepareLineChartData(equipeId) { }
  prepareBarChartData(sport) { }
  preparePieChartData() { }
  prepareRadarChartData(equipe1, equipe2) { }
}

charts = new ChartsManager();
```

### 6. **router.js** - Navigation SPA

```javascript
class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
  }

  register(path, handler) { }
  navigate(path, params) { }
  getCurrentRoute() { }
}

router = new Router();
router.register('/dashboard', () => renderDashboard());
router.register('/equipes', () => renderEquipes());
// ...
```

### 7. **app.js** - Point d'entrée

```javascript
class App {
  constructor() {
    this.storage = new StorageManager();
    this.dataManager = new DataManager(this.storage);
    this.calculator = new Calculator(this.dataManager);
    this.ui = new UIManager();
    this.charts = new ChartsManager();
    this.router = new Router();
  }

  init() {
    // 1. Charger les données
    // 2. Initialiser les données par défaut si vide
    // 3. Configurer les routes
    // 4. Configurer les event listeners
    // 5. Rendre la page d'accueil
    // 6. Ajouter écouteurs thème
  }

  setupRoutes() { }
  setupEventListeners() { }
  setupTheme() { }
}

// Initialiser l'app au chargement
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
```

## 🎯 Composants réutilisables (CSS/HTML)

### Card - Équipe
```html
<div class="card card-equipe">
  <div class="card-header" style="background-color: var(--equipe-color)">
    <h3>Nom équipe</h3>
  </div>
  <div class="card-body">
    <p><strong>Points:</strong> 150</p>
    <p><strong>Membres:</strong> 5</p>
    <p><strong>Record:</strong> 18V - 2D</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-sm btn-primary">Détails</button>
    <button class="btn btn-sm btn-secondary">Éditer</button>
  </div>
</div>
```

### Modal - Formulaire Match
```html
<div class="modal" id="matchModal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Ajouter un match</h2>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <form id="matchForm">
        <div class="form-group">
          <label>Sport:</label>
          <select name="sport" required></select>
        </div>
        <!-- Autres champs -->
      </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Annuler</button>
      <button class="btn btn-primary">Enregistrer</button>
    </div>
  </div>
</div>
```

### Tableau - Classement
```html
<table class="table">
  <thead>
    <tr>
      <th class="col-rank">#</th>
      <th class="col-equipe">Équipe</th>
      <th class="col-points">Points</th>
      <th class="col-record">Record</th>
      <th class="col-ratio">Ratio</th>
    </tr>
  </thead>
  <tbody>
    <tr class="rank-1">
      <td class="rank-badge">🥇</td>
      <td class="equipe-name">Équipe A</td>
      <td class="points">150</td>
      <td class="record">18-2</td>
      <td class="ratio">90%</td>
    </tr>
  </tbody>
</table>
```

## 📊 Flux de données

```
┌─────────────────┐
│  Interface UI   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   UI Manager    │ (Gestion DOM)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Manager   │ (Logique métier)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Storage Manager │ (localStorage)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON localStorage │
└─────────────────┘

Exemples:
1. User ajoute un match
   UI (form) → DataManager.createMatch() → Storage.saveMatches()

2. User consulte classement
   UI (page) → Calculator.getClassementGeneral() → UI.renderTable()

3. User active dark mode
   UI (toggle) → App.setupTheme() → Storage.save('theme')
```

## 🎨 Système de thèmes

```css
/* theme.css */

:root {
  /* Couleurs base */
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #27AE60;
  --danger: #E74C3C;
  --warning: #F39C12;
  --light: #ECF0F1;
  --dark: #2C3E50;
  
  /* Texte */
  --text-primary: #333;
  --text-secondary: #666;
  --text-light: #999;
  
  /* Backgrounds */
  --bg-primary: #fff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e8e8e8;
}

/* Dark theme */
:root[data-theme="dark"] {
  --text-primary: #f0f0f0;
  --text-secondary: #ccc;
  --text-light: #999;
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3d3d3d;
}
```

## 🔐 Validation des données

```javascript
const Validation = {
  equipe: {
    nom: (val) => val.length > 0 && val.length <= 50,
    couleur: (val) => /^#[0-9A-F]{6}$/i.test(val),
    membres: (arr) => Array.isArray(arr) && arr.length > 0
  },
  
  match: {
    equipe1: (id) => id !== null && id !== undefined,
    equipe2: (id1, id2) => id1 !== id2,
    score1: (val) => Number.isInteger(val) && val >= 0,
    score2: (val) => Number.isInteger(val) && val >= 0,
    date: (date) => !isNaN(new Date(date).getTime())
  }
};
```

## 🚀 Initialisation de l'app

1. **Premier chargement**: localStorage vide
   - Créer 9 équipes par défaut avec noms génériques
   - Charger les 5 sports (preset)
   - Aucun match enregistré

2. **Chargements suivants**: Restaurer depuis localStorage
   - Récupérer équipes, matches, sports
   - Recalculer classements
   - Afficher dashboard

3. **Import/Export**
   - Export: Sérialiser JSON complet
   - Import: Parser et valider JSON
   - Reset: Confirmation utilisateur

## 📱 Responsive Design Breakpoints

```css
/* Mobile first */
@media (max-width: 480px) { /* Petit téléphone */ }
@media (min-width: 481px) { /* Grand téléphone */ }
@media (min-width: 768px) { /* Tablette */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large desktop */ }
```

## 🧪 Points de test critiques

- [ ] Ajouter/éditer/supprimer équipes
- [ ] Créer matches et enregistrer scores
- [ ] Vérifier calculs de classements
- [ ] Navigation entre pages (SPA)
- [ ] Persistance localStorage (reload page)
- [ ] Export/import données
- [ ] Responsive sur mobile/tablet/desktop
- [ ] Thème light/dark
- [ ] Graphiques affichage correct
- [ ] Validation formulaires

## 📦 Dépendances externes

- **Chart.js** (v3+) - Graphiques
- Pas d'autres dépendances (vanilla JS)

## ♿ Accessibilité

- ARIA labels sur tous les inputs
- Focus management dans modals
- Contrastes de couleurs WCAG AA
- Navigation au clavier fonctionnelle
- Textes descriptifs sur boutons iconiques

---

*Architecture v1.0 - Tournoi Multi-Sport*