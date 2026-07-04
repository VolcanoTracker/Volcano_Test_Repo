fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(r => r.json())
    .then(data => {
        data.forEach(v => {
            if (v.latitude && v.longitude) {
                // Use the keys confirmed by your console inspection
                const status = (v.alert_level || v.color_code || 'green').toUpperCase();
                
                let color = 'blue'; // Default
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

                L.marker([v.latitude, v.longitude], { icon: customIcon })
                 .addTo(map)
                 .bindPopup(`<b>${v.volcano_name}</b><br>Status: ${status}`);
            }
        });
    })
    .catch(err => console.error("Fetch Error:", err));

        
   