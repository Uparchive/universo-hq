const state = {
  hq: null,
  frame: 0,
  timer: null,
  speed: 2600,
  captions: true,
  mode: "movie",
};

const $ = (selector) => document.querySelector(selector);

function updateReader() {
  const current = state.hq.frames[state.frame];
  $("#frame-image").style.opacity = "0";
  setTimeout(() => {
    $("#frame-image").src = current.imagem;
    $("#frame-image").alt = `${state.hq.titulo} - frame ${state.frame + 1}`;
    $("#frame-image").style.opacity = "1";
  }, 120);
  $("#caption").textContent = current.texto || current.titulo || "";
  $("#caption").classList.toggle(
    "hidden",
    !state.captions ||
      (!current.texto && !current.titulo) ||
      state.mode === "image",
  );
  $("#counter").textContent =
    `Frame ${state.frame + 1} / ${state.hq.frames.length}`;
  $("#progress-label").textContent =
    `${Math.round(((state.frame + 1) / state.hq.frames.length) * 100)}% concluído`;
  $("#progress-bar").style.width =
    `${((state.frame + 1) / state.hq.frames.length) * 100}%`;
}

function nextFrame() {
  state.frame = state.frame >= state.hq.frames.length - 1 ? 0 : state.frame + 1;
  updateReader();
}

function prevFrame() {
  state.frame = state.frame <= 0 ? state.hq.frames.length - 1 : state.frame - 1;
  updateReader();
}

function play() {
  pause();
  state.timer = setInterval(nextFrame, state.speed);
  document.body.classList.add("autoplay-clean");
  $("#play").textContent = "⏸ Pausar";
}

function pause() {
  clearInterval(state.timer);
  state.timer = null;
  document.body.classList.remove("autoplay-clean");
  $("#play").textContent = "▶ Assistir HQ";
}

function togglePlay() {
  state.timer ? pause() : play();
}

function setMode(mode) {
  state.mode = mode;
  document
    .querySelectorAll("[data-mode]")
    .forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.mode === mode),
    );
  document.body.classList.toggle("cinema", mode === "movie");
  updateReader();
}

async function initReader() {
  const id = getParam("id");
  const index = await fetchJSON(UHPaths.hqs);
  const item = index.find((hq) => hq.id === id) || index[0];
  state.hq = await fetchJSON(item.dados);
  state.hq.frames = sortFramesByNumber(state.hq.frames);
  document.title = `${state.hq.titulo} | Universo HQ`;
  $("#reader-title").textContent = state.hq.titulo;
  $("#reader-synopsis").textContent = state.hq.descricao || state.hq.sinopse;
  $("#reader-meta").textContent =
    `${state.hq.serieTitulo} · Temporada ${state.hq.temporada} · Episódio ${state.hq.episodio} · Cronologia ${state.hq.cronologia}`;
  $("#tags").innerHTML = state.hq.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");
  updateReader();

  $("#next").onclick = nextFrame;
  $("#prev").onclick = prevFrame;
  $("#play").onclick = togglePlay;
  $("#restart").onclick = () => {
    state.frame = 0;
    updateReader();
  };
  $("#captions").onclick = () => {
    state.captions = !state.captions;
    $("#captions").classList.toggle("active", state.captions);
    updateReader();
  };
  $("#zoom").onclick = () => $("#stage").classList.toggle("zoom");
  $("#fullscreen").onclick = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  $("#speed").onchange = (event) => {
    state.speed = Number(event.target.value);
    if (state.timer) play();
  };
  document
    .querySelectorAll("[data-mode]")
    .forEach((btn) => (btn.onclick = () => setMode(btn.dataset.mode)));
  $("#stage").onclick = nextFrame;

  let startX = 0;
  $("#stage").addEventListener(
    "touchstart",
    (event) => {
      startX = event.touches[0].clientX;
    },
    { passive: true },
  );
  $("#stage").addEventListener(
    "touchend",
    (event) => {
      const diff = event.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) diff < 0 ? nextFrame() : prevFrame();
    },
    { passive: true },
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") nextFrame();
    if (event.key === "ArrowLeft") prevFrame();
    if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    }
    if (event.key.toLowerCase() === "f") $("#fullscreen").click();
    if (event.key === "Escape") {
      pause();
      document.body.classList.remove("cinema");
    }
  });
}

document.addEventListener("DOMContentLoaded", initReader);
