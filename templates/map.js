async function loadLeaflet() {
    if (window.L) return; 

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function initMap(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    if (AppConfig.interactiveMap) {
        console.log("map_log");
        await loadLeaflet();
        console.log("map_log2");

        
        const map = L.map(container).setView([27.9625, -15.594], 11)
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Kluczowe: Leaflet musi wiedzieć, że rozmiar kontenera mógł się zmienić
        setTimeout(() => {
            map.invalidateSize();
        }, 100);

        return map;
    } else {
        await renderTemplate(containerSelector, '/templates/map.html');
    }
}