const map = L.map('map').setView([37, -95], 4);
//Trigger rebuild

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(data => {
    console.log("Successfully loaded", data.length, "volcanoes.");
    
    // Let's inspect the FIRST volcano in the list to find the right property
    console.log("Sample Volcano Object:", data[0]);

    data.forEach(v => {
        if (v.latitude && v.longitude) {
            // ... (keep your map code as is for now)
        }
    });
})
        
   
    .catch(err => console.error("Fetch Error:", err));