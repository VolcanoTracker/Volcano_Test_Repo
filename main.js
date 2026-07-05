document.addEventListener('DOMContentLoaded', () => {
    // Setup a display area at the top
    const debugDiv = document.createElement('div');
    debugDiv.style.position = 'fixed';
    debugDiv.style.top = '50px';
    debugDiv.style.background = 'yellow';
    debugDiv.style.zIndex = '2000';
    document.body.appendChild(debugDiv);

    fetch('https://corsproxy.io/?url=https://volcanoes.usgs.gov/vsc/api/volcanoApi/volcanoesGVP')
        .then(r => r.json())
        .then(data => {
            // Get the first item
            const sample = data[0];
            // Show all the keys on the screen
            debugDiv.innerText = "Keys found: " + Object.keys(sample).join(', ');
        })
        .catch(err => {
            debugDiv.innerText = "Fetch Error: " + err;
        });
});