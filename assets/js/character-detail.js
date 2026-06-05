document.addEventListener('DOMContentLoaded', async () => {
  const id = getParam('id');
  const [index, hqs] = await Promise.all([fetchJSON(UHPaths.personagens), fetchJSON(UHPaths.hqs)]);
  const summary = index.find(character => character.id === id) || index[0];
  const character = await fetchJSON(summary.dados);
  document.title = `${character.nome} | Universo HQ`;
  document.getElementById('profile').innerHTML = `<img class="avatar" src="${character.imagem}" alt="${character.nome}"><div class="panel"><span class="eyebrow">${character.poderPrincipal}</span><h1>${character.nome}</h1><p class="muted">${character.descricao}</p><h3>Poderes</h3><ul class="list">${character.poderes.map(item => `<li>${item}</li>`).join('')}</ul><h3>Fraquezas</h3><ul class="list">${character.fraquezas.map(item => `<li>${item}</li>`).join('')}</ul></div>`;
  const appearances = hqs.filter(hq => character.aparicoes.includes(hq.id));
  document.getElementById('appearances').innerHTML = appearances.length ? appearances.map(hq => `<a class="btn ghost" href="hq.html?id=${hq.id}">${hq.titulo}</a>`).join('') : '<p class="muted">Sem aparições cadastradas.</p>';
  document.getElementById('relations').innerHTML = character.relacoes.map(rel => `<li><a href="personagem.html?id=${rel.personagem}">${rel.personagem}</a> · ${rel.tipo}</li>`).join('');
});
