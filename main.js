const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        // Double check that we have an array
        if (!Array.isArray(data)) {
            console.error("Data is not an array!");
            return;
        }

        data.forEach(v => {
            // Safety check: Ensure lat/long exist and are valid numbers
            if (v.latitude && v.longitude) {
                
                const status = (v.alert_level || v.color_code || 'GREEN').toUpperCase();
                
                let color = 'blue';
                if (status.includes('RED')) color = 'red';
                else if (status.includes('ORANGE')) color = 'orange';
                else if (status.includes('YELLOW')) color = 'yellow';
                else if (status.includes('GREEN') || status.includes('NORMAL')) color = 'green';

                const customIcon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // Add to map safely
                try {
                    L.marker([v.latitude, v.longitude], { icon: customIcon })
                     .addTo(map)
                     .bindPopup(`<b>${v.volcano_name || 'Unknown'}</b><br>Status: ${status}`);
                } catch (e) {
                    console.error("Failed to add marker for:", v.volcano_name, e);
                }
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));
        
   