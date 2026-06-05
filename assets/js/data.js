const UHPaths = {
  hqs: "data/hqs.json",
  personagens: "data/personagens.json",
  batalhas: "data/batalhas.json",
  wiki: "data/wiki.json",
};

const normalizeText = (value = "") =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function fileNameFromPath(path = "") {
  return path.split("/").pop() || path;
}

function extractLeadingNumber(value = "") {
  const fileName = fileNameFromPath(value).trim();
  const match = fileName.match(/^(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function normalizeFrame(frame, index = 0) {
  if (typeof frame === "string") {
    return {
      imagem: frame,
      arquivo: fileNameFromPath(frame),
      titulo: fileNameFromPath(frame).replace(/\.[^.]+$/, ""),
      texto: "",
      ordem: extractLeadingNumber(frame),
      originalIndex: index,
    };
  }

  const imagem = frame.imagem || frame.arquivo || "";
  return {
    ...frame,
    imagem,
    arquivo: frame.arquivo || fileNameFromPath(imagem),
    titulo:
      frame.titulo ||
      fileNameFromPath(frame.arquivo || imagem).replace(/\.[^.]+$/, ""),
    texto: frame.texto || "",
    ordem:
      Number.isFinite(Number(frame.ordem)) && frame.ordem !== ""
        ? Number(frame.ordem)
        : extractLeadingNumber(frame.arquivo || imagem),
    originalIndex: index,
  };
}

function compareFrameOrder(a, b) {
  const aOrder = Number.isFinite(a.ordem) ? a.ordem : Number.POSITIVE_INFINITY;
  const bOrder = Number.isFinite(b.ordem) ? b.ordem : Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) return aOrder - bOrder;
  return a.originalIndex - b.originalIndex;
}

function sortFramesByNumber(frames = []) {
  return frames.map(normalizeFrame).sort(compareFrameOrder);
}

function sortEpisodes(episodes = []) {
  return [...episodes].sort(
    (a, b) =>
      a.temporada - b.temporada ||
      a.episodio - b.episodio ||
      a.cronologia - b.cronologia ||
      a.titulo.localeCompare(b.titulo, "pt-BR"),
  );
}

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
    fetchJSON(UHPaths.wiki),
  ]);
  return { hqs, personagens, batalhas, wiki };
}

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(`${date}T00:00:00`),
  );
}

function groupBySeriesAndSeason(hqs) {
  return sortEpisodes(hqs).reduce((acc, hq) => {
    acc[hq.serieTitulo] ??= {};
    acc[hq.serieTitulo][`Temporada ${hq.temporada}`] ??= [];
    acc[hq.serieTitulo][`Temporada ${hq.temporada}`].push(hq);
    return acc;
  }, {});
}
