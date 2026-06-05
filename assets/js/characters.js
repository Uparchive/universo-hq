function characterCard(character) {
  return `<article class="card" data-search="${normalizeText([character.nome, character.poderPrincipal, character.descricaoCurta].join(' '))}">
    <img class="cover" src="${character.imagem}" alt="${character.nome}" loading="lazy">
    <div class="card-body"><span class="eyebrow">${character.poderPrincipal}</span><h3>${character.nome}</h3><p>${character.descricaoCurta}</p><div class="actions"><a class="btn primary" href="personagem.html?id=${character.id}">Abrir dossiê</a></div></div>
  </article>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const chars = await fetchJSON(UHPaths.personagens);
  const grid = document.getElementById('characters-grid');
  grid.innerHTML = chars.map(characterCard).join('');
  document.getElementById('character-search')?.addEventListener('input', event => {
    const term = normalizeText(event.target.value);
    document.querySelectorAll('[data-search]').forEach(card => card.style.display = card.dataset.search.includes(term) ? '' : 'none');
  });
});
