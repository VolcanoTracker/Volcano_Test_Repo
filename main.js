document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Fetch both datasets simultaneously
    Promise.all([
        fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP').then(r => r.json()),
        fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS').then(r => r.json())
    ])
    .then(([globalData, usData]) => {
        // Create a lookup map for U.S. volcanoes by name for quick hazard lookup
        const usHazards = {};
        usData.forEach(v => usHazards[v.vName] = parseInt(v.NVEWS) || 1);

        // Update Ticker
        const banner = document.getElementById('ticker-content');
        if (banner) banner.innerText = `Monitoring ${globalData.length} Global Volcanoes`;

        // Plot all volcanoes
        globalData.forEach(v => {
            if (v.latitude && v.longitude) {
                const hazardLevel = usHazards[v.vName] || 1;
                
                // Determine color: Only color U.S. volcanoes with levels > 1
                // Global volcanoes (non-US) will remain default blue
                let iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
                
                if (hazardLevel > 1) {
                    let color = (hazardLevel >= 5) ? 'red' : (hazardLevel === 4) ? 'orange' : 'yellow';
                    iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`;
                }

                const icon = new L.Icon({
                    iconUrl: iconUrl,
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
                });

                L.marker([v.latitude, v.longitude], { icon })
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${hazardLevel}`);
            }
        });
    })
    .catch(err => console.error("Data Load Error:", err));
});