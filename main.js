const map = L.map('map').setView([37, -95], 4);
//Trigger rebuild

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        // Let's see the WHOLE thing
        console.log("Full API Response:", data);
    })
    .catch(err => console.error("Fetch Error:", err));

        
   