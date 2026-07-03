alert("Script is running!");
const map = L.map('map').setView([37, -95], 4);
// ... the rest of your code ...

// Initialize map
const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Using the correct VSC endpoint for US volcanoes
// We use corsproxy.io to bypass the browser's security block
fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(response => response.json())
    .then(data => {
        console.log("Data received:", data); // Check console to confirm data arrived
        
        data.forEach(v => {
            // Using the exact field names from the USGS volcanoesUS API
            const lat = v.latitude;
            const lon = v.longitude;
            
            if (lat !== undefined && lon !== undefined) {
                L.marker([lat, lon])
                 .addTo(map)
                 .bindPopup(`<b>${v.vName}</b><br>Subregion: ${v.subregion}`);
            }
        });
    })
    .catch(error => console.error('Error fetching volcano data:', error));