document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Fetch the comprehensive USGS Global Volcano List
    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
        .then(r => r.json())
        .then(data => {
            // Update Ticker
            const banner = document.getElementById('ticker-content');
            if (banner) {
                banner.innerText = `Total Global Volcanoes Tracked: ${data.length}`;
            }

            // Plot all volcanoes
            data.forEach(v => {
                if (v.latitude && v.longitude) {
                    L.marker([v.latitude, v.longitude])
                     .addTo(map)
                     .bindPopup(`
                        <b>${v.vName}</b><br>
                        Region: ${v.subregion}<br>
                        Elevation: ${v.elevation_m}m
                     `);
                }
            });
        })
        .catch(err => console.error("Data Load Error:", err));
});