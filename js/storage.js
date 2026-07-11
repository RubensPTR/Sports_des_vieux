/* StorageManager — persistance localStorage (cf. ARCHITECTURE.md) */
class StorageManager {
  constructor(namespace = 'sports_tournament') {
    this.namespace = namespace;
  }

  _root() {
    try {
      return JSON.parse(localStorage.getItem(this.namespace)) || null;
    } catch {
      return null;
    }
  }

  _write(root) {
    root.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.namespace, JSON.stringify(root));
  }

  init(defaults) {
    if (!this._root()) this._write(defaults);
  }

  load(key) {
    const root = this._root();
    return root ? root[key] : undefined;
  }

  save(key, data) {
    const root = this._root() || {};
    root[key] = data;
    this._write(root);
  }

  getEquipes() { return this.load('equipes') || []; }
  saveEquipes(equipes) { this.save('equipes', equipes); }

  getMatches() { return this.load('matches') || []; }
  saveMatches(matches) { this.save('matches', matches); }

  getSports() { return this.load('sports') || []; }

  getParametres() { return this.load('parametres') || {}; }
  saveParametres(p) { this.save('parametres', p); }

  exportData() { return JSON.stringify(this._root(), null, 2); }

  importData(jsonData) {
    const parsed = JSON.parse(jsonData);
    if (!parsed || !Array.isArray(parsed.equipes) || !Array.isArray(parsed.matches)) {
      throw new Error('Format invalide : il faut au moins "equipes" et "matches".');
    }
    this._write(parsed);
  }

  reset() { localStorage.removeItem(this.namespace); }
}
