let homeData = { hqs: [], personagens: [], batalhas: [], wiki: [] };

function hqCard(hq) {
  const tags = hq.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  return `<article class="card" data-search="${normalizeText([hq.titulo,hq.serieTitulo,hq.tags.join(' '),hq.personagens.join(' ')].join(' '))}">
    <img class="cover" src="${hq.capa}" alt="Capa de ${hq.titulo}" loading="lazy">
    <div class="card-body">
      <span class="eyebrow">${hq.serieTitulo} · T${hq.temporada}:E${String(hq.episodio).padStart(2,'0')} · Cronologia ${hq.cronologia}</span>
      <h3>${hq.titulo}</h3>
      <p>${hq.sinopse}</p>
      <div class="meta"><span class="pill">${hq.framesTotal} frames</span><span class="pill">${formatDate(hq.data)}</span></div>
      <div class="meta">${tags}</div>
      <div class="actions">
        <a class="btn primary" href="hq.html?id=${hq.id}">▶ Assistir HQ</a>
        <button class="btn favorite ${isFavorite(hq.id) ? 'active' : ''}" data-favorite="${hq.id}">★ Favorito</button>
      </div>
    </div>
  </article>`;
}

function renderRail(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = items.length ? items.map(hqCard).join('') : '<div class="empty">Nenhuma HQ encontrada.</div>';
}

function renderHome(data) {
  const chronological = [...data.hqs].sort((a,b) => a.cronologia - b.cronologia);
  const releases = [...data.hqs].sort((a,b) => new Date(b.data) - new Date(a.data));
  renderRail('releases', releases);
  renderRail('timeline', chronological);
  renderRail('favorites', data.hqs.filter(hq => isFavorite(hq.id)));
  renderRail('all-hqs', data.hqs);
  const grouped = groupBySeriesAndSeason(data.hqs);
  const series = document.getElementById('series');
  series.innerHTML = Object.entries(grouped).map(([serie, seasons]) => `<div class="panel"><h3>${serie}</h3>${Object.entries(seasons).map(([season, episodes]) => `<p class="muted"><strong>${season}</strong> · ${episodes.length} episódio(s)</p><div class="actions">${episodes.map(ep => `<a class="btn ghost" href="hq.html?id=${ep.id}">E${String(ep.episodio).padStart(2,'0')}</a>`).join('')}</div>`).join('')}</div>`).join('');
  document.getElementById('battles-preview').innerHTML = data.batalhas.map(b => `<article class="card"><div class="card-body"><span class="eyebrow">Batalha</span><h3>${b.titulo}</h3><p>${b.descricao}</p><div class="actions"><a class="btn blue" href="batalhas.html#${b.id}">Ver confronto</a></div></div></article>`).join('');
  document.getElementById('wiki-preview').innerHTML = data.wiki.map(item => `<article class="card"><div class="card-body"><span class="eyebrow">${item.tipo}</span><h3>${item.nome}</h3><p>${item.descricao}</p></div></article>`).join('');
  bindFavorites();
}

function bindFavorites() {
  document.querySelectorAll('[data-favorite]').forEach(button => {
    button.onclick = () => {
      const active = toggleFavorite(button.dataset.favorite);
      button.classList.toggle('active', active);
      renderRail('favorites', homeData.hqs.filter(hq => isFavorite(hq.id)));
      bindFavorites();
    };
  });
}

function bindSearch() {
  const input = document.getElementById('global-search');
  input?.addEventListener('input', () => {
    const term = normalizeText(input.value);
    document.querySelectorAll('[data-search]').forEach(card => {
      card.style.display = card.dataset.search.includes(term) ? '' : 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  homeData = await loadIndexData();
  renderHome(homeData);
  bindSearch();
});
