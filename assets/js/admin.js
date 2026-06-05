const adminState = { type: 'hq' };

function slugify(value) { return normalizeText(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function splitList(value) { return value.split(',').map(item => item.trim()).filter(Boolean); }

function buildHQ() {
  const title = document.getElementById('hq-title').value || 'Nova HQ';
  const serie = document.getElementById('hq-series').value || title;
  const id = slugify(`${serie}-t${document.getElementById('hq-season').value || 1}e${document.getElementById('hq-episode').value || 1}`);
  const frames = splitList(document.getElementById('hq-frames').value).map((image, index) => ({ imagem: image, texto: splitList(document.getElementById('hq-captions').value)[index] || '' }));
  return { id, serieId: slugify(serie), serieTitulo: serie, temporada: Number(document.getElementById('hq-season').value || 1), episodio: Number(document.getElementById('hq-episode').value || 1), titulo: title, sinopse: document.getElementById('hq-synopsis').value, capa: document.getElementById('hq-cover').value || 'assets/img/placeholder-cover.svg', data: document.getElementById('hq-date').value, cronologia: Number(document.getElementById('hq-chronology').value || 0), personagens: splitList(document.getElementById('hq-characters').value), tags: splitList(document.getElementById('hq-tags').value), frames };
}

function buildCharacter() {
  const name = document.getElementById('char-name').value || 'Novo Personagem';
  return { id: slugify(name), nome: name, imagem: document.getElementById('char-image').value || 'assets/img/placeholder-character.svg', descricao: document.getElementById('char-description').value, poderPrincipal: document.getElementById('char-main-power').value, poderes: splitList(document.getElementById('char-powers').value), fraquezas: splitList(document.getElementById('char-weaknesses').value), aparicoes: splitList(document.getElementById('char-appearances').value), relacoes: splitList(document.getElementById('char-relations').value).map(item => ({ personagem: item, tipo: 'Relação cadastrada' })) };
}

function renderAdmin() {
  document.getElementById('hq-form').style.display = adminState.type === 'hq' ? '' : 'none';
  document.getElementById('character-form').style.display = adminState.type === 'character' ? '' : 'none';
  document.querySelectorAll('[data-tab]').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === adminState.type));
  const data = adminState.type === 'hq' ? buildHQ() : buildCharacter();
  document.getElementById('json-output').textContent = JSON.stringify(data, null, 2);
  document.getElementById('path-output').textContent = adminState.type === 'hq'
    ? `data/hqs/${data.serieId}/temporada-${data.temporada}/episodio-${String(data.episodio).padStart(2, '0')}/dados.json`
    : `data/personagens/${data.id}.json`;
}

function downloadJSON() {
  const blob = new Blob([document.getElementById('json-output').textContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = adminState.type === 'hq' ? 'dados.json' : `${slugify(document.getElementById('char-name').value || 'personagem')}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input, textarea, select').forEach(input => input.addEventListener('input', renderAdmin));
  document.querySelectorAll('[data-tab]').forEach(tab => tab.onclick = () => { adminState.type = tab.dataset.tab; renderAdmin(); });
  document.getElementById('copy-json').onclick = () => navigator.clipboard.writeText(document.getElementById('json-output').textContent);
  document.getElementById('download-json').onclick = downloadJSON;
  renderAdmin();
});
