document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    Promise.all([
        fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP').then(r => r.json()),
        fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS').then(r => r.json())
    ])
    .then(([globalData, usData]) => {
        // Create a lookup map using vnum (The stable ID used by both APIs)
        const usHazards = {};
        usData.forEach(v => {
            if(v.vnum) usHazards[v.vnum] = parseInt(v.NVEWS) || 1;
        });

        globalData.forEach(v => {
            if (v.latitude && v.longitude) {
                // Look up by vnum
                const hazardLevel = usHazards[v.vnum] || 1;
                
                let color = 'blue'; // Default for global
                if (hazardLevel >= 5) color = 'red';
                else if (hazardLevel === 4) color = 'orange';
                else if (hazardLevel === 3) color = 'yellow';
                else if (hazardLevel === 2) color = 'green';

                const icon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
                });

                L.marker([v.latitude, v.longitude], { icon })
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${hazardLevel}`);
            }
        });
    })
    .catch(err => console.error("Error:", err));
});