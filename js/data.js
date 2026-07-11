/* Données par défaut + DataManager + Calculator (cf. SPECIFICATION.md)
   Les valeurs par défaut sont dans data/initial-data.json ; les constantes
   ci-dessous servent de secours quand le fichier est inaccessible (file://). */

const DEFAULT_SPORTS = [
  { id: 'pingpong',     nom: 'Ping Pong',    description: 'Tennis de table — 1v1 ou équipes', icone: '🏓', actif: true },
  { id: 'petanque',     nom: 'Pétanque',     description: 'Boules — équipes',                 icone: '🎯', actif: true },
  { id: 'babyfoot',     nom: 'Baby Foot',    description: 'Babyfoot — équipes',               icone: '⚽', actif: true },
  { id: 'spikeball',    nom: 'Spike Ball',   description: 'Jeu de ballon — équipes',          icone: '🥎', actif: true },
  { id: 'concombraise', nom: 'Concombraise', description: 'Sport personnalisé. Règles floues, blessures garanties.', icone: '🥒', actif: true },
];

const DEFAULT_EQUIPES = [
  ['Les Genoux Fragiles',    '#e74c3c'],
  ['Cardio Zéro',            '#3498db'],
  ['Sieste United',          '#9b59b6'],
  ['Les Papys Flingueurs',   '#e67e22'],
  ['Dos Cassé FC',           '#1abc9c'],
  ['Les Hanches d\'Acier',   '#f1c40f'],
  ['Apéro Sport Club',       '#2ecc71'],
  ['Les Increvables',        '#e84393'],
  ['Ligament Croisé Social', '#00a8ff'],
];

function buildDefaults(seed) {
  const now = new Date().toISOString();
  const equipesSrc = seed?.equipes?.length
    ? seed.equipes.map(e => [e.nom, e.couleur])
    : DEFAULT_EQUIPES;
  return {
    version: '1.0',
    lastUpdated: now,
    equipes: equipesSrc.map(([nom, couleur], i) => ({
      id: i + 1,
      nom,
      couleur,
      membres: [],
      dateCreation: now,
      actif: true,
    })),
    sports: seed?.sports?.length ? seed.sports : DEFAULT_SPORTS,
    matches: [],
    parametres: {
      theme: 'dark',
      langue: 'fr',
      dateCreation: now,
      pointsVictoire: 3,
      pointsNul: 1,
      pointsDefaite: 0,
      totalEquipes: 9,
      totalSports: 5,
    },
  };
}

class DataManager {
  constructor(storage) {
    this.storage = storage;
  }

  // --- Équipes ---
  getAllEquipes() { return this.storage.getEquipes(); }
  getEquipe(id) { return this.getAllEquipes().find(e => e.id === Number(id)); }

  createEquipe(nom, couleur, membres = []) {
    const equipes = this.getAllEquipes();
    this.validateEquipeUnique(nom);
    const id = equipes.reduce((m, e) => Math.max(m, e.id), 0) + 1;
    const equipe = { id, nom: nom.trim(), couleur, membres, dateCreation: new Date().toISOString(), actif: true };
    equipes.push(equipe);
    this.storage.saveEquipes(equipes);
    return equipe;
  }

  updateEquipe(id, data) {
    const equipes = this.getAllEquipes();
    const eq = equipes.find(e => e.id === Number(id));
    if (!eq) throw new Error('Équipe introuvable');
    if (data.nom && data.nom.trim() !== eq.nom) this.validateEquipeUnique(data.nom, eq.id);
    Object.assign(eq, data, { nom: (data.nom ?? eq.nom).trim() });
    this.storage.saveEquipes(equipes);
    // garder les snapshots de matchs cohérents (nom/couleur)
    const matches = this.storage.getMatches();
    matches.forEach(m => {
      for (const side of ['equipe1', 'equipe2']) {
        if (m[side].id === eq.id) { m[side].nom = eq.nom; m[side].couleur = eq.couleur; }
      }
    });
    this.storage.saveMatches(matches);
    return eq;
  }

  validateEquipeUnique(nom, excludeId = null) {
    const clean = nom.trim().toLowerCase();
    if (!clean || clean.length > 50) throw new Error('Nom d\'équipe invalide (1 à 50 caractères).');
    if (this.getAllEquipes().some(e => e.nom.trim().toLowerCase() === clean && e.id !== excludeId)) {
      throw new Error(`« ${nom.trim()} » existe déjà. Un peu d'imagination !`);
    }
  }

  // --- Sports ---
  getAllSports() { return this.storage.getSports().filter(s => s.actif); }
  getSport(id) { return this.storage.getSports().find(s => s.id === id); }

  // --- Matches ---
  getAllMatches() {
    return this.storage.getMatches().slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  getMatchesBySport(sport) { return this.getAllMatches().filter(m => m.sport === sport); }
  getMatchesByEquipe(id) {
    id = Number(id);
    return this.getAllMatches().filter(m => m.equipe1.id === id || m.equipe2.id === id);
  }

  createMatch(sportId, equipe1Id, equipe2Id, score1, score2, notes = '') {
    const e1 = this.getEquipe(equipe1Id);
    const e2 = this.getEquipe(equipe2Id);
    if (!e1 || !e2) throw new Error('Choisissez deux équipes.');
    if (e1.id === e2.id) throw new Error('Une équipe ne peut pas jouer contre elle-même (même après l\'apéro).');
    score1 = Number(score1); score2 = Number(score2);
    if (!Number.isInteger(score1) || !Number.isInteger(score2) || score1 < 0 || score2 < 0) {
      throw new Error('Les scores doivent être des entiers positifs.');
    }
    if (!this.getSport(sportId)) throw new Error('Sport inconnu.');
    const matches = this.storage.getMatches();
    const now = new Date().toISOString();
    const match = {
      id: 'match_' + String(matches.length + 1).padStart(3, '0') + '_' + Date.now(),
      sport: sportId,
      equipe1: { id: e1.id, nom: e1.nom, couleur: e1.couleur },
      equipe2: { id: e2.id, nom: e2.nom, couleur: e2.couleur },
      score: { equipe1: score1, equipe2: score2 },
      date: now,
      statut: 'joué',
      notes,
      dateCreation: now,
      dateModification: now,
    };
    matches.push(match);
    this.storage.saveMatches(matches);
    return match;
  }

  getMatch(id) {
    return this.storage.getMatches().find(m => m.id === id);
  }

  updateMatch(id, { sportId, equipe1Id, equipe2Id, score1, score2, notes } = {}) {
    const matches = this.storage.getMatches();
    const match = matches.find(m => m.id === id);
    if (!match) throw new Error('Match introuvable.');

    const sport = sportId ?? match.sport;
    if (!this.getSport(sport)) throw new Error('Sport inconnu.');

    const e1 = this.getEquipe(equipe1Id ?? match.equipe1.id);
    const e2 = this.getEquipe(equipe2Id ?? match.equipe2.id);
    if (!e1 || !e2) throw new Error('Choisissez deux équipes.');
    if (e1.id === e2.id) throw new Error('Une équipe ne peut pas jouer contre elle-même (même après l\'apéro).');

    const s1 = Number(score1 ?? match.score.equipe1);
    const s2 = Number(score2 ?? match.score.equipe2);
    if (!Number.isInteger(s1) || !Number.isInteger(s2) || s1 < 0 || s2 < 0) {
      throw new Error('Les scores doivent être des entiers positifs.');
    }

    match.sport = sport;
    match.equipe1 = { id: e1.id, nom: e1.nom, couleur: e1.couleur };
    match.equipe2 = { id: e2.id, nom: e2.nom, couleur: e2.couleur };
    match.score = { equipe1: s1, equipe2: s2 };
    if (notes !== undefined) match.notes = notes;
    match.dateModification = new Date().toISOString();

    this.storage.saveMatches(matches);
    return match;
  }

  deleteMatch(id) {
    const matches = this.storage.getMatches().filter(m => m.id !== id);
    this.storage.saveMatches(matches);
  }
}

class Calculator {
  constructor(dataManager) {
    this.dm = dataManager;
  }

  _points() {
    const p = this.dm.storage.getParametres();
    return { win: p.pointsVictoire ?? 3, draw: p.pointsNul ?? 1, loss: p.pointsDefaite ?? 0 };
  }

  _classement(matches) {
    const pts = this._points();
    const rows = new Map();
    this.dm.getAllEquipes().forEach(e => rows.set(e.id, {
      equipeId: e.id, nom: e.nom, couleur: e.couleur,
      points: 0, victoires: 0, defaites: 0, nuls: 0, matchsJoues: 0, diff: 0,
    }));
    matches.forEach(m => {
      const r1 = rows.get(m.equipe1.id);
      const r2 = rows.get(m.equipe2.id);
      const s1 = m.score.equipe1, s2 = m.score.equipe2;
      if (r1) { r1.matchsJoues++; r1.diff += s1 - s2; }
      if (r2) { r2.matchsJoues++; r2.diff += s2 - s1; }
      if (s1 > s2) {
        if (r1) { r1.victoires++; r1.points += pts.win; }
        if (r2) { r2.defaites++; r2.points += pts.loss; }
      } else if (s2 > s1) {
        if (r2) { r2.victoires++; r2.points += pts.win; }
        if (r1) { r1.defaites++; r1.points += pts.loss; }
      } else {
        if (r1) { r1.nuls++; r1.points += pts.draw; }
        if (r2) { r2.nuls++; r2.points += pts.draw; }
      }
    });
    const list = [...rows.values()];
    list.forEach(r => { r.ratio = r.matchsJoues ? Math.round((r.victoires / r.matchsJoues) * 1000) / 10 : 0; });
    // Points > victoires > différence de buts (cf. spec)
    list.sort((a, b) => b.points - a.points || b.victoires - a.victoires || b.diff - a.diff || a.nom.localeCompare(b.nom));
    list.forEach((r, i) => { r.rang = i + 1; });
    return list;
  }

  getClassementGeneral() { return this._classement(this.dm.getAllMatches()); }
  getClassementSport(sportId) { return this._classement(this.dm.getMatchesBySport(sportId)); }

  getTotalMatches() { return this.dm.getAllMatches().length; }

  getStatsBySport(equipeId) {
    const out = {};
    this.dm.getAllSports().forEach(s => {
      const row = this.getClassementSport(s.id).find(r => r.equipeId === Number(equipeId));
      out[s.id] = row;
    });
    return out;
  }

  getHeadToHead(id1, id2) {
    id1 = Number(id1); id2 = Number(id2);
    const res = { v1: 0, v2: 0, nuls: 0 };
    this.dm.getMatchesByEquipe(id1).forEach(m => {
      const other = m.equipe1.id === id1 ? m.equipe2.id : m.equipe1.id;
      if (other !== id2) return;
      const s1 = m.equipe1.id === id1 ? m.score.equipe1 : m.score.equipe2;
      const s2 = m.equipe1.id === id1 ? m.score.equipe2 : m.score.equipe1;
      if (s1 > s2) res.v1++; else if (s2 > s1) res.v2++; else res.nuls++;
    });
    return res;
  }

  getVictoiresParSport() {
    // {sportId: nombre de matchs joués}
    const out = {};
    this.dm.getAllSports().forEach(s => { out[s.id] = this.dm.getMatchesBySport(s.id).length; });
    return out;
  }
}
