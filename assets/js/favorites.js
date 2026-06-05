const FAVORITES_KEY = 'universoHQ:favorites';

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
  catch { return []; }
}

function saveFavorites(ids) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...new Set(ids)]));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  const favorites = getFavorites();
  const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  saveFavorites(next);
  return next.includes(id);
}
