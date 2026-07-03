// Initialize map
const map = L.map('map').setView([37, -95], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 1. Define the URLs for the custom marker images.
// We use Leaflet's default marker shadow, but swap out the icon URL.
// These are hosted by a CDN for convenience.
const iconBaseUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/';
const getMarkerIcon = (colorCode) => {
    // Log the color code we receive from the API
    console.log("Processing color:", colorCode);

    const iconBaseUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/';
    
    // Default to Blue
    let colorName = 'blue';

    if (colorCode) {
        const code = colorCode.toUpperCase();
        if (code.includes('RED')) colorName = 'red';
        else if (code.includes('ORANGE')) colorName = 'orange';
        else if (code.includes('YELLOW')) colorName = 'yellow';
        else if (code.includes('GREEN')) colorName = 'green';
    }

    return new L.Icon({
        iconUrl: iconBaseUrl + `marker-icon-2x-${colorName}.png`,
        shadowUrl: iconBaseUrl + 'marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};
    return new L.Icon({
        iconUrl: iconUrl,
        shadowUrl: iconBaseUrl + 'marker-shadow.png', // Keep the shadow consistent
        iconSize: [25, 41], // Standard Leaflet size
        iconAnchor: [12, 41], // Standard Leaflet anchor
        popupAnchor: [1, -34], // Standard Leaflet anchor
        shadowSize: [41, 41] // Standard Leaflet size
    });
};


// 2. Fetch data and apply custom icons
fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS')
    .then(response => response.json())
    .then(data => {
        // Console log to confirm we have data (should be 69+)
        console.log("Data loaded, count:", data.length); 
        
        data.forEach(v => {
            const lat = v.latitude;
            const lon = v.longitude;
            const alertLevel = v.alertLevel; // e.g., "NORMAL", "ADVISORY", "WATCH", "WARNING"
            const colorCode = v.colorCode; // e.g., "GREEN", "YELLOW", "ORANGE", "RED"
            
            if (lat && lon) {
                // 3. Get the correct icon based on colorCode
                const customIcon = getMarkerIcon(colorCode);
                
                // 4. Add marker with the custom icon
                L.marker([lat, lon], { icon: customIcon })
                 .addTo(map)
                 .bindPopup(`
                    <b>${v.vName}</b><br>
                    Location: ${v.locationName}, ${v.state}<br>
                    Status: ${alertLevel} (${colorCode})
                 `);
            } else {
                 console.warn("Missing Coordinates for:", v.vName);
            }
        });
    })
    .catch(error => console.error('Error fetching volcano data:', error));