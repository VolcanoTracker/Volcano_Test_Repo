const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        data.forEach(v => {
    // This will print the actual list of keys for every single volcano object
    console.log("Actual keys present:", Object.keys(v));
    
    // We stop the loop immediately so we only get one log
    throw new Error("Debugging: Check console for keys!");
});
                L.marker([v.latitude, v.longitude], { icon: customIcon })
                 .addTo(map)
                 .bindPopup(`<b>${name}</b><br>Status: ${alert || 'None Provided'}`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));
   