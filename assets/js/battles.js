document.addEventListener("DOMContentLoaded", async () => {
  const [battles, hqs] = await Promise.all([
    fetchJSON(UHPaths.batalhas),
    fetchJSON(UHPaths.hqs),
  ]);
  document.getElementById("battles-grid").innerHTML = battles
    .map((battle) => {
      const related = hqs.filter((hq) => battle.hqs.includes(hq.id));
      return `<article class="card" id="${battle.id}" data-search="${normalizeText([battle.titulo, battle.descricao, battle.resultado].join(" "))}"><div class="card-body"><span class="eyebrow">Confronto</span><h3>${battle.titulo}</h3><p>${battle.descricao}</p><p class="muted">Resultado: ${battle.resultado}</p><div class="actions">${related.map((hq) => `<a class="btn primary" href="hq.html?id=${hq.id}">${hq.titulo}</a>`).join("")}</div></div></article>`;
    })
    .join("");
  document
    .getElementById("battle-search")
    ?.addEventListener("input", (event) => {
      const term = normalizeText(event.target.value);
      document
        .querySelectorAll("[data-search]")
        .forEach(
          (card) =>
            (card.style.display = card.dataset.search.includes(term)
              ? ""
              : "none"),
        );
    });
});
