document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // 1. Define the Triangle Icon using CSS
    const triangleIcon = L.divIcon({
        className: 'custom-triangle',
        html: '<div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 16px solid blue;"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 16]
    });

    // 2. Fetch USGS (Live) and Smithsonian (Static)
    Promise.all([
        fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS').then(r => r.json()),
        fetch('volcanoesGVP.json').then(r => r.json()) // Ensure this file is in your project folder
    ])
    .then(([usgsData, gvpData]) => {
        // Ticker logic (USGS)
        let active = usgsData.filter(v => parseInt(v.NVEWS) > 1);
        let high = active.filter(v => parseInt(v.NVEWS) >= 3);
        const banner = document.getElementById('ticker-content');
        if (banner) banner.innerText = `Active Monitored: ${active.length} | High Hazard: ${high.map(v => v.vName).join(', ')}`;

        // Plot USGS (Markers)
        usgsData.forEach(v => {
            if (v.latitude && v.longitude) {
                const level = parseInt(v.NVEWS) || 1;
                let color = (level >= 5) ? 'red' : (level === 4) ? 'orange' : (level === 3) ? 'yellow' : 'green';
                const icon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    iconSize: [25, 41], iconAnchor: [12, 41]
                });
                L.marker([v.latitude, v.longitude], { icon }).addTo(map).bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${level}`);
            }
        });

        // Plot Smithsonian (Triangles)
        gvpData.forEach(v => {
            if (v.latitude && v.longitude) {
                L.marker([v.latitude, v.longitude], { icon: triangleIcon })
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Smithsonian Data`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));
});