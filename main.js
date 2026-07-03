const map = L.map('map').setView([37, -95], 4);
//Trigger rebuild

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        console.log("Successfully loaded", data.length, "volcanoes.");

        data.forEach(v => {
            if (v.latitude && v.longitude) {
                // Determine color based on colorCode
                let color = 'blue'; 
                // We use || '' to make sure we don't crash if colorCode is null
                const status = (v.colorCode || '').toUpperCase();
                
                if (status.includes('RED')) color = 'red';
                else if (status.includes('ORANGE')) color = 'orange';
                else if (status.includes('YELLOW')) color = 'yellow';
                else if (status.includes('GREEN')) color = 'green';

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
                 .bindPopup(`<b>${v.vName}</b><br>Status: ${v.colorCode || 'Unknown'}`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));