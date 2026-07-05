document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Fetch the REAL-TIME activity feed
    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
        .then(r => r.json())
        .then(data => {
            let activeVolcanoes = data.filter(v => parseInt(v.NVEWS) > 1);
            let highHazards = activeVolcanoes.filter(v => parseInt(v.NVEWS) >= 3);
            
            // Update Ticker
            const banner = document.getElementById('ticker-content');
            if (banner) {
                banner.innerText = `Active Monitored: ${activeVolcanoes.length} | High Hazard (Lvl 3+): ${highHazards.map(v => v.vName).join(', ')}`;
            }

            // Plot Markers
            data.forEach(v => {
                if (v.latitude && v.longitude) {
                    const level = parseInt(v.NVEWS) || 1;
                    let color = (level >= 5) ? 'red' : (level === 4) ? 'orange' : (level === 3) ? 'yellow' : 'green';

                    const customIcon = new L.Icon({
                        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                        iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
                    });

                    L.marker([v.latitude, v.longitude], { icon: customIcon })
                     .addTo(map)
                     .bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${level}`);
                }
            });
        })
        .catch(err => console.error("Fetch Error:", err));
        //t
});