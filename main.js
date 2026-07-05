document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const usgsLayer = L.layerGroup().addTo(map);
    const smithsonianLayer = L.layerGroup().addTo(map);

    // 1. Fetch USGS Active data first (Critical for Ticker)
    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
        .then(r => r.json())
        .then(usData => {
            // Update Ticker immediately
            const banner = document.getElementById('ticker-content');
            const activeUsgs = usData.length;
            const highHazard = usData.filter(v => parseInt(v.NVEWS) >= 3).length;
            const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (banner) {
                banner.innerText = `Volcano Tracker | Active USGS Volcanoes: ${activeUsgs} | Level 3-5 Hazards: ${highHazard} | Last updated: ${lastUpdated}`;
            }

            // 2. Now fetch Global data to populate the map
            fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
                .then(r => r.json())
                .then(globalData => {
                    const usVnums = new Set(usData.map(v => v.vnum));
                    globalData.forEach(v => {
                        if (!v.latitude || !v.longitude) return;

                        if (usVnums.has(v.vnum)) {
                            const usEntry = usData.find(u => u.vnum === v.vnum);
                            const level = parseInt(usEntry.NVEWS) || 1;
                            let color = (level >= 5) ? 'red' : (level === 4) ? 'orange' : (level === 3) ? 'yellow' : 'green';
                            
                            L.marker([v.latitude, v.longitude], {
                                icon: new L.Icon({
                                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                                    iconSize: [25, 41], iconAnchor: [12, 41]
                                })
                            }).addTo(usgsLayer).bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${level}`);
                        } else {
                            L.marker([v.latitude, v.longitude], {
                                icon: new L.Icon({
                                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                                    iconSize: [25, 41], iconAnchor: [12, 41]
                                })
                            }).addTo(smithsonianLayer).bindPopup(`<b>${v.vName}</b><br>Smithsonian Data`);
                        }
                    });
                });
        })
        .catch(err => {
            console.error("Tracker Load Error:", err);
            const banner = document.getElementById('ticker-content');
            if (banner) banner.innerText = "Error: Failed to reach volcano servers.";
        });
});