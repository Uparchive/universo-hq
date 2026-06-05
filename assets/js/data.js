const UHPaths = {
  hqs: 'data/hqs.json',
  personagens: 'data/personagens.json',
  batalhas: 'data/batalhas.json',
  wiki: 'data/wiki.json'
};

const normalizeText = (value = '') => value
  .toString()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

async function fetchJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}`);
  return response.json();
}

async function loadIndexData() {
  const [hqs, personagens, batalhas, wiki] = await Promise.all([
    fetchJSON(UHPaths.hqs),
    fetchJSON(UHPaths.personagens),
    fetchJSON(UHPaths.batalhas),
    fetchJSON(UHPaths.wiki)
  ]);
  return { hqs, personagens, batalhas, wiki };
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${date}T00:00:00`));
}

function groupBySeriesAndSeason(hqs) {
  return hqs.reduce((acc, hq) => {
    acc[hq.serieTitulo] ??= {};
    acc[hq.serieTitulo][`Temporada ${hq.temporada}`] ??= [];
    acc[hq.serieTitulo][`Temporada ${hq.temporada}`].push(hq);
    return acc;
  }, {});
}
