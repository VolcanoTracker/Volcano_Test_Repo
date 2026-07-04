const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        data.forEach(v => {
            if (v.latitude && v.longitude) {
                // Check for variations in naming to ensure we get the right data
                const name = v.volcano_name || v.vName || v.name || "Unnamed Volcano";
                const alert = (v.alert_level || v.color_code || v.alertLevel || "").toUpperCase();
                
                let color = 'green'; // Default
                if (alert.includes('RED')) color = 'red';
                else if (alert.includes('ORANGE')) color = 'orange';
                else if (alert.includes('YELLOW')) color = 'yellow';
                else if (alert.includes('GREEN') || alert.includes('NORMAL')) color = 'green';
                else if (alert.includes('UNASSIGNED')) color = 'blue';

                const customIcon = new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                L.marker([v.latitude, v.longitude], { icon: customIcon })
                 .addTo(map)
                 .bindPopup(`<b>${name}</b><br>Status: ${alert || 'None Provided'}`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));
   