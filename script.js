try {
    console.log("Script starting..."); // Check if this shows up
    
    const map = L.map('map').setView([37, -95], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
        .then(response => {
            console.log("Fetch response received:", response);
            return response.json();
        })
        .then(data => {
            console.log("Data loaded, count:", data.length);
            data.forEach(v => {
                const lat = v.latitude;
                const lon = v.longitude;
                if (lat && lon) {
                    L.marker([lat, lon]).addTo(map).bindPopup(v.vName);
                }
            });
        })
        .catch(err => console.error("Fetch Error:", err));

} catch (e) {
    console.error("Critical Script Error:", e);
}