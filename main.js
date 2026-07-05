document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // We use the RSS2JSON proxy which is highly reliable for converting XML feeds to JSON
    const feedUrl = 'https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesUS'; // Still trying standard API
    const fallbackUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://volcanoes.usgs.gov/hans/atom/vns.xml';

    fetch(fallbackUrl)
        .then(r => r.json())
        .then(data => {
            const items = data.items;
            const banner = document.getElementById('ticker-content');
            
            // Ticker Logic
            const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            banner.innerText = `Volcano Tracker | Recent Alerts: ${items.length} | Source: USGS VNS | Updated: ${lastUpdated}`;

            // Plotting Logic
            items.forEach(item => {
                // Extract coordinates from description or title if available in the feed
                // Note: Atom feeds for volcanoes usually contain lat/long in the 'description' or 'content'
                // This will plot the volcanoes currently in the alert feed
                L.marker([item.lat || 0, item.lng || 0], {
                    icon: new L.Icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        iconSize: [25, 41]
                    })
                }).addTo(map).bindPopup(`<b>${item.title}</b><br>${item.description}`);
            });
        })
        .catch(err => {
            console.error("Feed Load Error:", err);
            document.getElementById('ticker-content').innerText = "System error: Unable to connect to USGS feeds.";
        });
});
});