document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
        .then(r => r.json())
        .then(data => {
            // Pick a known active volcano to inspect its full data
            const sample = data.find(v => v.vName.includes("Kilauea")) || data[0];
            console.log("Full Data Object for sample:", sample);
            
            // Log every key present in the object
            console.log("All available keys:", Object.keys(sample));
        })
        .catch(err => console.error(err));
});