/* Sports des Vieux — point d'entrée, routeur hash et rendu des pages */

const storage = new StorageManager();
const dm = new DataManager(storage);
const calc = new Calculator(dm);
const charts = new ChartsManager();

const TAGLINES = [
  'Là où l\'échauffement dure plus longtemps que le match.',
  'Plus de kiné que de trophées.',
  'On ne vieillit pas, on prend de l\'expérience.',
  'Sponsorisé par personne, et ça se voit.',
  'Doliprane non fourni.',
  'Le seul tournoi avec pause sieste réglementaire.',
  'Interdit aux moins de 40 ans (sauf pour ramasser les boules).',
  'La Concombraise, c\'est pas un légume, c\'est un mode de vie.',
];

const EMPTY_QUOTES = [
  'Les échauffements ont dû mal tourner.',
  'Tout le monde est encore chez l\'ostéo.',
  'Le premier qui bouge a perdu.',
  'La motivation est en route (elle marche doucement).',
];

const $app = document.getElementById('app');

/* ---------- Helpers ---------- */
const esc = escapeHtml;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function medal(rang, total) {
  if (rang === 1) return '🥇';
  if (rang === 2) return '🥈';
  if (rang === 3) return '🥉';
  if (rang === total && total > 3) return '🩼'; // la lanterne rouge a droit à sa béquille
  return rang;
}

function toast(msg, type = 'ok') {
  const root = document.getElementById('toast-root');
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function emptyState(icon, msg) {
  return `<div class="empty"><span class="big">${icon}</span>${esc(msg)}<br><em>${esc(pick(EMPTY_QUOTES))}</em></div>`;
}

function teamDot(e) {
  return `<span class="dot" style="background:${e.couleur};color:${e.couleur}"></span>`;
}

/* ---------- Modal ---------- */
function openModal(title, bodyHtml, onMount) {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-overlay">
      <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="modal-header">
          <h2>${title}</h2>
          <button class="modal-close" aria-label="Fermer">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
      </div>
    </div>`;
  root.querySelector('.modal-close').onclick = closeModal;
  root.querySelector('.modal-overlay').addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
  if (onMount) onMount(root);
}
function closeModal() { document.getElementById('modal-root').innerHTML = ''; }

/* ---------- Pages ---------- */

function renderDashboard() {
  const classement = calc.getClassementGeneral();
  const leader = classement[0];
  const matches = dm.getAllMatches();
  const derniers = matches.slice(0, 3);
  const joue = matches.length > 0;

  $app.innerHTML = `
    <h1 class="page-title">🏠 Tableau de bord</h1>

    <div class="card leader-card">
      <p class="muted">En tête du général</p>
      ${joue && leader.points > 0 ? `
        <p class="leader-name">${teamDot(leader)} ${esc(leader.nom)}</p>
        <p class="leader-sub">${leader.points} pts · ${leader.victoires}V / ${leader.defaites}D — qu'on leur vérifie la licence.</p>
      ` : `
        <p class="leader-name">Personne (encore)</p>
        <p class="leader-sub">Le trône est vide. Comme la salle de muscu.</p>
      `}
    </div>

    <div class="stats-row">
      <div class="stat-tile"><div class="num">${matches.length}</div><div class="lbl">matchs joués</div></div>
      <div class="stat-tile"><div class="num">${dm.getAllEquipes().length}</div><div class="lbl">équipes</div></div>
      <div class="stat-tile"><div class="num">${dm.getAllSports().length}</div><div class="lbl">sports</div></div>
    </div>

    <div class="card">
      <div class="section-head"><h2>🕐 Derniers matchs</h2><a class="btn btn-sm" href="#/sports">+ Match</a></div>
      ${derniers.length ? derniers.map(matchRow).join('') : emptyState('🦗', 'Aucun match joué.')}
    </div>

    <div class="grid-2">
      <a class="card card-link" href="#/classements"><h3>🏆 Podium</h3><p class="muted">Qui frime, qui rame.</p></a>
      <a class="card card-link" href="#/stats"><h3>📈 Stats</h3><p class="muted">Des chiffres et des douleurs.</p></a>
    </div>`;
}

function matchRow(m) {
  const s1 = m.score.equipe1, s2 = m.score.equipe2;
  const sport = dm.getSport(m.sport);
  return `
    <div class="match-row">
      <span title="${esc(sport?.nom || '')}">${sport?.icone || '❔'}</span>
      <div class="match-team"><span class="dot" style="background:${m.equipe1.couleur};color:${m.equipe1.couleur}"></span><span class="n ${s1 > s2 ? 'match-winner' : ''}">${esc(m.equipe1.nom)}</span></div>
      <div class="match-score">${s1} – ${s2}</div>
      <div class="match-team right"><span class="n ${s2 > s1 ? 'match-winner' : ''}">${esc(m.equipe2.nom)}</span><span class="dot" style="background:${m.equipe2.couleur};color:${m.equipe2.couleur}"></span></div>
      <span class="match-date">${fmtDate(m.date)}</span>
    </div>`;
}

/* --- Équipes --- */
function renderEquipes() {
  const classement = calc.getClassementGeneral();
  const byId = Object.fromEntries(classement.map(r => [r.equipeId, r]));
  const equipes = dm.getAllEquipes();

  $app.innerHTML = `
    <div class="section-head">
      <h1 class="page-title">👥 Équipes</h1>
      <button class="btn btn-primary btn-sm" id="btn-add-equipe">+ Équipe</button>
    </div>
    <p class="page-sub">${equipes.length} équipes, ${equipes.reduce((n, e) => n + e.membres.length, 0)} genoux fonctionnels environ.</p>
    <div class="grid-cards">
      ${equipes.map(e => {
        const r = byId[e.id] || {};
        return `
        <div class="card equipe-card">
          <div class="equipe-head">${teamDot(e)}<span class="nom">${esc(e.nom)}</span><span class="badge">#${r.rang ?? '–'}</span></div>
          <div class="equipe-meta">
            <span>👤 ${e.membres.length} membre${e.membres.length > 1 ? 's' : ''}</span>
            <span>⭐ ${r.points ?? 0} pts</span>
            <span>${r.victoires ?? 0}V / ${r.defaites ?? 0}D</span>
          </div>
          <div class="equipe-actions">
            <a class="btn btn-sm" href="#/equipe/${e.id}">Détails</a>
            <button class="btn btn-sm" data-edit="${e.id}">Éditer</button>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  document.getElementById('btn-add-equipe').onclick = () => openEquipeModal(null);
  $app.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => openEquipeModal(Number(b.dataset.edit)));
}

function openEquipeModal(id) {
  const eq = id ? dm.getEquipe(id) : null;
  const membres = eq ? [...eq.membres] : [];
  const body = `
    <form id="equipe-form">
      <div class="form-group"><label>Nom de l'équipe</label>
        <input name="nom" required maxlength="50" value="${eq ? esc(eq.nom) : ''}" placeholder="Ex : Les Tendinites Célestes"></div>
      <div class="form-group"><label>Couleur</label>
        <input type="color" name="couleur" value="${eq ? eq.couleur : '#f0a840'}"></div>
      <div class="form-group"><label>Membres</label>
        <div class="membres-list" id="membres-list"></div>
        <button type="button" class="btn btn-sm" id="btn-add-membre">+ Ajouter un membre</button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" id="btn-cancel">Annuler</button>
        <button type="submit" class="btn btn-primary">${eq ? 'Enregistrer' : 'Créer'}</button>
      </div>
    </form>`;

  openModal(eq ? '✏️ Éditer l\'équipe' : '➕ Nouvelle équipe', body, root => {
    const list = root.querySelector('#membres-list');
    const renderMembres = () => {
      list.innerHTML = membres.map((m, i) => `
        <div class="membre-row">
          <input value="${esc(m.nom)}" data-mi="${i}" placeholder="Nom du joueur">
          <button type="button" class="btn btn-sm btn-danger" data-del="${i}" aria-label="Retirer">✕</button>
        </div>`).join('') || '<p class="small-note">Aucun membre. Une équipe fantôme, classique.</p>';
      list.querySelectorAll('[data-mi]').forEach(inp => inp.oninput = () => { membres[Number(inp.dataset.mi)].nom = inp.value; });
      list.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { membres.splice(Number(b.dataset.del), 1); renderMembres(); });
    };
    renderMembres();
    root.querySelector('#btn-add-membre').onclick = () => {
      membres.push({ id: 'm' + Date.now(), nom: '', dateAjout: new Date().toISOString() });
      renderMembres();
    };
    root.querySelector('#btn-cancel').onclick = closeModal;
    root.querySelector('#equipe-form').onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const clean = membres.filter(m => m.nom.trim());
      try {
        if (eq) dm.updateEquipe(eq.id, { nom: f.get('nom'), couleur: f.get('couleur'), membres: clean });
        else dm.createEquipe(f.get('nom'), f.get('couleur'), clean);
        closeModal();
        route();
        toast(eq ? 'Équipe mise à jour ✅' : 'Équipe créée ! Pensez aux étirements. 🧘');
      } catch (err) {
        toast(err.message, 'error');
      }
    };
  });
}

/* --- Détail équipe --- */
function renderEquipeDetail(id) {
  const eq = dm.getEquipe(id);
  if (!eq) { $app.innerHTML = emptyState('🤷', 'Équipe introuvable.'); return; }
  const general = calc.getClassementGeneral();
  const me = general.find(r => r.equipeId === eq.id);
  const statsSport = calc.getStatsBySport(eq.id);
  const matches = dm.getMatchesByEquipe(eq.id);
  const sports = dm.getAllSports();

  const sportRows = sports.map(s => {
    const r = statsSport[s.id];
    return { label: s.nom, icon: s.icone, value: r?.points ?? 0, color: eq.couleur };
  });
  const chart = charts.barChart(sportRows, { unit: ' pts' });

  // Face à face
  const h2h = dm.getAllEquipes().filter(o => o.id !== eq.id).map(o => {
    const r = calc.getHeadToHead(eq.id, o.id);
    return { o, r, total: r.v1 + r.v2 + r.nuls };
  }).filter(x => x.total > 0);

  $app.innerHTML = `
    <a href="#/equipes" class="small-note">← Retour aux équipes</a>
    <div class="card leader-card" style="border-left:4px solid ${eq.couleur}">
      <p class="leader-name">${teamDot(eq)} ${esc(eq.nom)}</p>
      <p class="leader-sub">Rang général : ${me ? medal(me.rang, general.length) : '–'} · ${me?.points ?? 0} pts · ${me?.victoires ?? 0}V / ${me?.defaites ?? 0}D ${me && me.rang === general.length && calc.getTotalMatches() > 0 ? '· Courage, ça ne peut que remonter.' : ''}</p>
    </div>

    <div class="card">
      <h3>👤 Membres (${eq.membres.length})</h3>
      ${eq.membres.length
        ? `<div class="equipe-meta">${eq.membres.map(m => `<span class="badge">${esc(m.nom)}</span>`).join(' ')}</div>`
        : '<p class="muted">Aucun membre déclaré. Le mystère plane.</p>'}
    </div>

    <div class="card">
      <h3>🎽 Points par sport</h3>
      ${chart || emptyState('📭', 'Pas encore de points.')}
    </div>

    ${h2h.length ? `
    <div class="card">
      <h3>⚔️ Face à face</h3>
      ${h2h.map(({ o, r }) => `
        <div class="match-row">
          <div class="match-team"><span class="dot" style="background:${o.couleur};color:${o.couleur}"></span><span class="n">${esc(o.nom)}</span></div>
          <div class="match-score">${r.v1}V – ${r.nuls}N – ${r.v2}D</div>
        </div>`).join('')}
    </div>` : ''}

    <div class="card">
      <h3>📜 Historique (${matches.length})</h3>
      ${matches.length ? matches.map(matchRow).join('') : emptyState('🦗', 'Aucun match joué.')}
    </div>`;
}

/* --- Sports --- */
function renderSports() {
  const sports = dm.getAllSports();
  $app.innerHTML = `
    <h1 class="page-title">🏓 Sports</h1>
    <p class="page-sub">5 disciplines, 0 dopage (vérifié à l'apéro).</p>
    <div class="grid-cards">
      ${sports.map(s => {
        const n = dm.getMatchesBySport(s.id).length;
        return `
        <a class="card card-link" href="#/sport/${s.id}">
          <h3><span style="font-size:1.5em">${s.icone}</span> ${esc(s.nom)}</h3>
          <p class="muted">${esc(s.description)}</p>
          <p style="margin-top:8px"><span class="badge">${n} match${n > 1 ? 's' : ''} joué${n > 1 ? 's' : ''}</span></p>
        </a>`;
      }).join('')}
    </div>`;
}

function renderSportDetail(sportId) {
  const sport = dm.getSport(sportId);
  if (!sport) { $app.innerHTML = emptyState('🤷', 'Sport inconnu.'); return; }
  const classement = calc.getClassementSport(sportId);
  const matches = dm.getMatchesBySport(sportId);
  const equipes = dm.getAllEquipes();
  const played = classement.filter(r => r.matchsJoues > 0);

  $app.innerHTML = `
    <a href="#/sports" class="small-note">← Tous les sports</a>
    <h1 class="page-title">${sport.icone} ${esc(sport.nom)}</h1>
    <p class="page-sub">${esc(sport.description)}</p>

    <div class="card">
      <h3>➕ Enregistrer un match</h3>
      <form id="match-form">
        <div class="score-row">
          <div class="form-group"><label>Équipe 1</label>
            <select name="e1" required><option value="">Choisir…</option>${equipes.map(e => `<option value="${e.id}">${esc(e.nom)}</option>`).join('')}</select></div>
          <div class="score-vs">VS</div>
          <div class="form-group"><label>Équipe 2</label>
            <select name="e2" required><option value="">Choisir…</option>${equipes.map(e => `<option value="${e.id}">${esc(e.nom)}</option>`).join('')}</select></div>
        </div>
        <div class="score-row">
          <div class="form-group"><label>Score 1</label><input type="number" name="s1" min="0" step="1" required inputmode="numeric" placeholder="0"></div>
          <div class="score-vs">–</div>
          <div class="form-group"><label>Score 2</label><input type="number" name="s2" min="0" step="1" required inputmode="numeric" placeholder="0"></div>
        </div>
        <button class="btn btn-primary btn-block" type="submit">Enregistrer le match 🏁</button>
      </form>
    </div>

    <div class="card">
      <h3>🏆 Classement ${esc(sport.nom)}</h3>
      ${played.length ? classementTable(classement) : emptyState('🪑', 'Personne n\'a encore joué à ' + sport.nom + '.')}
    </div>

    <div class="card">
      <h3>📜 Matchs (${matches.length})</h3>
      ${matches.length ? matches.map(matchRow).join('') : emptyState('🦗', 'Aucun match pour l\'instant.')}
    </div>`;

  document.getElementById('match-form').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    try {
      dm.createMatch(sportId, f.get('e1'), f.get('e2'), f.get('s1'), f.get('s2'));
      route();
      toast('Match enregistré ! Pensez aux étirements. 🧘');
    } catch (err) {
      toast(err.message, 'error');
    }
  };
}

/* --- Classements --- */
function classementTable(rows) {
  const total = rows.length;
  return `
  <div class="table-wrap">
    <table>
      <thead><tr><th>#</th><th>Équipe</th><th>Pts</th><th>V</th><th>N</th><th>D</th><th>Ratio</th></tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr class="${r.rang === total && total > 3 ? 'moi-derniere' : ''}">
            <td class="rank">${medal(r.rang, total)}</td>
            <td><div class="team-cell"><span class="dot" style="background:${r.couleur};color:${r.couleur}"></span>${esc(r.nom)}</div></td>
            <td><strong>${r.points}</strong></td>
            <td>${r.victoires}</td><td>${r.nuls}</td><td>${r.defaites}</td>
            <td>${r.ratio}%</td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>
  <p class="small-note" style="margin-top:8px">🩼 = lanterne rouge. On ne juge pas. (Un peu.)</p>`;
}

function renderClassements(activeTab = 'general') {
  const sports = dm.getAllSports();
  const rows = activeTab === 'general' ? calc.getClassementGeneral() : calc.getClassementSport(activeTab);
  const joue = calc.getTotalMatches() > 0;

  $app.innerHTML = `
    <h1 class="page-title">🏆 Classements</h1>
    <div class="tabs">
      <button class="tab ${activeTab === 'general' ? 'active' : ''}" data-tab="general">🌍 Général</button>
      ${sports.map(s => `<button class="tab ${activeTab === s.id ? 'active' : ''}" data-tab="${s.id}">${s.icone} ${esc(s.nom)}</button>`).join('')}
    </div>
    <div class="card">
      ${joue ? classementTable(rows) : emptyState('🛋️', 'Le classement attend son premier match.')}
    </div>`;

  $app.querySelectorAll('.tab').forEach(t => t.onclick = () => renderClassements(t.dataset.tab));
}

/* --- Stats --- */
function renderStats() {
  const general = calc.getClassementGeneral();
  const joue = calc.getTotalMatches() > 0;
  const sports = dm.getAllSports();

  const ptsRows = general.map(r => ({ label: r.nom, value: r.points, color: r.couleur, dot: true }));
  const vRows = general.slice().sort((a, b) => b.victoires - a.victoires)
    .map(r => ({ label: r.nom, value: r.victoires, color: r.couleur, dot: true }));
  const parSport = calc.getVictoiresParSport();
  const sportRows = sports.map(s => ({ label: s.nom, icon: s.icone, value: parSport[s.id], color: 'var(--primary)' }));

  $app.innerHTML = `
    <h1 class="page-title">📈 Statistiques</h1>
    <p class="page-sub">La science au service de la mauvaise foi.</p>
    ${joue ? `
      <div class="card"><h3>⭐ Points au général</h3>${charts.barChart(ptsRows, { unit: '' }) || ''}</div>
      <div class="card"><h3>💪 Victoires</h3>${charts.barChart(vRows) || ''}</div>
      <div class="card"><h3>🎽 Matchs par sport</h3>${charts.barChart(sportRows) || emptyState('📭', 'Rien à voir ici.')}</div>
    ` : `<div class="card">${emptyState('📉', 'Pas de données.')}</div>`}`;
}

/* --- Paramètres --- */
function renderParametres() {
  const p = storage.getParametres();
  $app.innerHTML = `
    <h1 class="page-title">⚙️ Paramètres</h1>

    <div class="card">
      <h3>🎨 Thème</h3>
      <p class="muted" style="margin-bottom:10px">Sombre par défaut, comme l'avenir de vos ligaments.</p>
      <button class="btn btn-block" id="btn-theme">${p.theme === 'dark' ? '☀️ Passer en clair' : '🌙 Passer en sombre'}</button>
    </div>

    <div class="card">
      <h3>🧮 Barème</h3>
      <p class="muted">Victoire : ${p.pointsVictoire ?? 3} pts · Nul : ${p.pointsNul ?? 1} pt · Défaite : ${p.pointsDefaite ?? 0} pt (mais l'honneur est sauf).</p>
    </div>

    <div class="card">
      <h3>💾 Données</h3>
      <p class="muted" style="margin-bottom:10px">Tout est stocké dans ce navigateur (localStorage).</p>
      <div class="equipe-actions">
        <button class="btn" id="btn-export">📤 Exporter</button>
        <button class="btn" id="btn-import">📥 Importer</button>
        <button class="btn btn-danger" id="btn-reset">🧨 Réinitialiser</button>
      </div>
      <input type="file" id="import-file" accept="application/json" hidden>
    </div>`;

  document.getElementById('btn-theme').onclick = () => {
    const next = storage.getParametres().theme === 'dark' ? 'light' : 'dark';
    const params = storage.getParametres();
    params.theme = next;
    storage.saveParametres(params);
    applyTheme(next);
    renderParametres();
    toast(next === 'dark' ? 'Retour dans le noir. 🌙' : 'Attention les yeux ! ☀️');
  };

  document.getElementById('btn-export').onclick = () => {
    const blob = new Blob([storage.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sports_des_vieux_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Export prêt ! À ranger avec les photos de vacances. 📦');
  };

  const fileInput = document.getElementById('import-file');
  document.getElementById('btn-import').onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        storage.importData(reader.result);
        applyTheme(storage.getParametres().theme || 'dark');
        route();
        toast('Import réussi ! 📥');
      } catch (err) {
        toast('Import raté : ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  document.getElementById('btn-reset').onclick = () => {
    if (confirm('Tout effacer ? Équipes, matchs, souvenirs de gloire… Irréversible.')) {
      storage.reset();
      storage.init(buildDefaults());
      applyTheme('dark');
      location.hash = '#/';
      toast('Remise à zéro. Comme vos genoux, mais en mieux. 🧨');
    }
  };
}

/* ---------- Router ---------- */
const routes = [
  { re: /^#?\/?$/,                name: 'dashboard',   fn: () => renderDashboard() },
  { re: /^#\/equipes$/,           name: 'equipes',     fn: () => renderEquipes() },
  { re: /^#\/equipe\/(\d+)$/,     name: 'equipes',     fn: m => renderEquipeDetail(m[1]) },
  { re: /^#\/sports$/,            name: 'sports',      fn: () => renderSports() },
  { re: /^#\/sport\/([\w-]+)$/,   name: 'sports',      fn: m => renderSportDetail(m[1]) },
  { re: /^#\/classements$/,       name: 'classements', fn: () => renderClassements() },
  { re: /^#\/stats$/,             name: 'stats',       fn: () => renderStats() },
  { re: /^#\/parametres$/,        name: 'parametres',  fn: () => renderParametres() },
];

function route() {
  const hash = location.hash || '#/';
  const found = routes.find(r => r.re.test(hash));
  closeModal();
  if (!found) { $app.innerHTML = emptyState('🗺️', 'Page introuvable. Vous vous êtes perdu ?'); return; }
  found.fn(hash.match(found.re));
  document.querySelectorAll('.tabbar a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === found.name);
  });
  window.scrollTo({ top: 0 });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#0f1115' : '#f2f3f7';
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  storage.init(buildDefaults());
  applyTheme(storage.getParametres().theme || 'dark');
  document.getElementById('tagline').textContent = pick(TAGLINES);
  window.addEventListener('hashchange', route);
  route();
});
