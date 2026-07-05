document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
        .then(response => response.json())
        .then(data => {
            let totalActive = 0;
            let highHazards = [];

            data.forEach(v => {
                if (v.latitude && v.longitude) {
                    // Logic: NVEWS might be null for global, so we treat it safely
                    const level = parseInt(v.NVEWS) || 1;

                    if (level > 1) totalActive++;
                    if (level >= 3) highHazards.push(v.vName + " (Lvl " + level + ")");

                    let color = (level >= 5) ? 'red' : (level === 4) ? 'orange' : (level === 3) ? 'yellow' : 'green';

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
                     .bindPopup(`<b>${v.vName}</b><br>Hazard Level: ${level}`);
                }
            });

            // Update ticker
            const banner = document.getElementById('ticker-content');
            if (banner) {
                banner.innerText = `Total Monitored Active: ${totalActive} | High Hazard Alert (Lvl 3-5): ${highHazards.join(', ')}`;
            } else {
                console.error("Banner element not found!");
            }
        })
        .catch(err => console.error("Fetch Error:", err));
});