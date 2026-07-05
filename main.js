const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
    .then(r => r.json())
    .then(data => {
        // DIAGNOSTIC: Check the first object
        console.log("Global Data Sample:", data[0]);
        console.log("Does it have NVEWS?", data[0].NVEWS);

        data.forEach(v => {
            // ... (rest of your logic)
        });
    })
    .catch(err => console.error("Fetch Error:", err));

        // Update the marquee banner
        const banner = document.getElementById('ticker-content');
        banner.innerHTML = `Total Monitored Active: ${totalActive} | High Hazard Alert (Lvl 3-5): ${highHazards.join(', ')}`;
    .catch(err => console.error("Fetch Error:", err));