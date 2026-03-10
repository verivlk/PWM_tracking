// js/map.js

document.addEventListener('DOMContentLoaded', async function () {
    await renderMap();
});


async function renderMap() {
    // Load map template into #map-panel (purely structural, no data needed)
    await renderTemplate('#map-panel', '/templates/map.html');
}