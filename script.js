// 1. Initialize the map
const map = L.map('map').setView([37, -95], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// 2. Fetch the data
fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(response => response.json())
    .then(data => {
        // 3. Add markers
        data.forEach(v => {
            if (v.latitude && v.longitude) {
                L.marker([v.latitude, v.longitude])
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Status: ${v.colorCode || 'Unknown'}`);
            }
        });
    })
    .catch(error => console.error('Fetch error:', error));