const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Using the VSC endpoint which contains latitude and longitude
fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(response => response.json())
    .then(data => {
        // This API returns an object where the volcanoes are in an array
        data.forEach(v => {
            const lat = v.latitude;
            const lon = v.longitude;
            
            if (lat && lon) {
                L.marker([lat, lon])
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Subregion: ${v.subregion}`);
            }
        });
    })
    .catch(error => console.error('Error fetching volcano data:', error));