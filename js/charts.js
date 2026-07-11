/* Graphiques maison en barres horizontales — zéro dépendance externe,
   ça marche même sur le Nokia de Gérard. */
class ChartsManager {
  /**
   * rows: [{label, value, color, icon?}]
   * Rend un bar chart horizontal en HTML.
   */
  barChart(rows, { unit = '' } = {}) {
    if (!rows.length || rows.every(r => !r.value)) return null;
    const max = Math.max(...rows.map(r => r.value), 1);
    const html = rows.map(r => `
      <div class="bar-row">
        <div class="bar-label">${r.icon ? r.icon + ' ' : ''}${r.dot ? `<span class="dot" style="background:${r.color};color:${r.color}"></span>` : ''}<span>${escapeHtml(r.label)}</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${(r.value / max) * 100}%;background:${r.color}"></div></div>
        <div class="bar-val">${r.value}${unit}</div>
      </div>`).join('');
    return html;
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
