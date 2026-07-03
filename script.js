const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes')
    .then(response => response.json())
    .then(data => {
        data.forEach(v => {
            // We are using the underscore version now
            const lat = v.latitude || v.lat; 
            const lon = v.longitude || v.lon;
            
            if (lat && lon) {
                L.marker([lat, lon])
                 .addTo(map)
                 .bindPopup(`<b>${v.volcano_name}</b>`);
            } else {
                console.log("Missing coordinates for:", v.volcano_name);
            }
        });
    })
    .catch(error => console.error('Error:', error));