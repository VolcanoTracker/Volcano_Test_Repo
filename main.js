const map = L.map('map').setView([20, 0], 2); // Centered globally

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
    .then(r => r.json())
    .then(data => {
        data.forEach(v => {
            if (v.latitude && v.longitude) {
                // If NVEWS is missing (as it often is globally), default to 1
                const level = parseInt(v.NVEWS) || 1;
                
                let color = 'green';
                if (level >= 5) color = 'red';
                else if (level === 4) color = 'orange';
                else if (level === 3) color = 'yellow';

                const customIcon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([v.latitude, v.longitude], { icon: customIcon })
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Global ID: ${v.vnum}<br>Hazard Level: ${level}`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));