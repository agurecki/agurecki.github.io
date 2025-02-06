// Grouping layers for easy toggling
const momsAncestry = L.layerGroup([France, Ireland, Canada]);
const dadsAncestry = L.layerGroup([Poland]);

// Function to toggle Mom's ancestry layers
function showMomsAncestry() {
    map.eachLayer(layer => {
        if (layer !== map.tileLayer) map.removeLayer(layer);
    });
    momsAncestry.addTo(map);
}

// Function to toggle Dad's ancestry layers
function showDadsAncestry() {
    map.eachLayer(layer => {
        if (layer !== map.tileLayer) map.removeLayer(layer);
    });
    dadsAncestry.addTo(map);
}
