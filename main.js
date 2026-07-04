const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        // Look at the first object to see what it contains
        console.log("ALL KEYS IN OBJECT:", Object.keys(data[0]));
        console.log("FULL EXAMPLE OBJECT:", data[0]);

        data.forEach(v => {
            if (v.latitude && v.longitude) {
                // We are keeping this simple just to get the map back up
                L.marker([v.latitude, v.longitude]).addTo(map)
                 .bindPopup("Check Console for Keys");
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));