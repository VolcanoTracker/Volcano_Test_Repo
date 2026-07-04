// Ensure map div exists before running
const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(response => response.json())
    .then(data => {
        console.log("Full Object keys:", Object.keys(data[0]));
        console.log("Sample Data:", data[0]);

        data.forEach(v => {
            if (v.latitude && v.longitude) {
                L.marker([v.latitude, v.longitude]).addTo(map)
                 .bindPopup("Check Console");
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));