// Initialize map once
const map = L.map('map').setView([20, 0], 2);

// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch data
fetch('https://volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes')
    .then(response => response.json())
    .then(data => {
        data.forEach(v => {
            const lat = v.latitude || v.lat;
            const lon = v.longitude || v.lon;
            
            if (lat && lon) {
                L.marker([lat, lon])
                 .addTo(map)
                 .bindPopup(`<b>${v.volcanoName || 'Unknown'}</b><br>Status: ${v.currentAlertLevel || 'N/A'}`);
            }
        });
    })
    .catch(error => console.error('Error fetching volcano data:', error));