const map = L.map('map').setView([37, -95], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        console.log("Full data sample:", data[0]); // Look at this in the console!

        data.forEach(v => {
            // Check if coordinates exist
            if (v.latitude && v.longitude) {
                
                // Determine color
                let color = 'blue';
                const status = (v.colorCode || '').toUpperCase();
                
                if (status.includes('RED')) color = 'red';
                else if (status.includes('ORANGE')) color = 'orange';
                else if (status.includes('YELLOW')) color = 'yellow';
                else if (status.includes('GREEN')) color = 'green';

                // Create marker
                L.marker([v.latitude, v.longitude], {
                    icon: new L.Icon({
                        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(map).bindPopup(`<b>${v.vName}</b><br>Status: ${v.colorCode}`);
            }
        });
    })
    .catch(err => console.error("Error:", err));