const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
    .then(r => r.json())
    .then(data => {
        let totalActive = 0;
        let highHazards = [];
        
        data.forEach(v => {
            const level = parseInt(v.NVEWS) || 1;
            
            // Calculate stats
            if (level > 1) totalActive++;
            if (level >= 3) highHazards.push(v.vName + " (Lvl " + level + ")");

            // Marker logic
            if (v.latitude && v.longitude) {
                let color = (level >= 5) ? 'red' : (level === 4) ? 'orange' : (level === 3) ? 'yellow' : 'green';
                const customIcon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
                });
                L.marker([v.latitude, v.longitude], { icon: customIcon }).addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${level}`);
            }
        });

        // Update the marquee banner
        const banner = document.getElementById('ticker-content');
        banner.innerHTML = `Total Monitored Active: ${totalActive} | High Hazard Alert (Lvl 3-5): ${highHazards.join(', ')}`;
    })
    .catch(err => console.error("Fetch Error:", err));