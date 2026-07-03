// Keep it simple to force the map to render
const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Basic fetch to confirm data
fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        console.log("Data count:", data.length);
        data.forEach(v => {
            if (v.latitude && v.longitude) {
                L.marker([v.latitude, v.longitude]).addTo(map).bindPopup(v.vName);
            }
        });
    })
    .catch(err => console.log("Error:", err));