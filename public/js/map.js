mapboxgl.accessToken = mapToken;

document.addEventListener("DOMContentLoaded", () => {
    // Clear map container if necessary
    document.getElementById('map').innerHTML = '';

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: coordinates,
        zoom: 9,
    });
    const mapMarker = new mapboxgl.Marker({ color:'rgb(254, 66, 77)'})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 0 })
            .setHTML(`<h4>${listing}</h4><p>Exact Location will be provided after booking</p>`))
        .addTo(map);
});
