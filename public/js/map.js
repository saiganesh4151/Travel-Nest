mapboxgl.accessToken = "pk.eyJ1IjoicGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KL0Q";
                            document.addEventListener("DOMContentLoaded", () => {
                                const map = new mapboxgl.Map({
                                    container: "map",
                                    style: "mapbox://styles/mapbox/streets-v12",
                                    center: [-74.5, 40],
                                    zoom: 9,
                                });
                            });


const marker1 = new mapboxgl.Marker()
    .setLngLat([12.554729, 55.70651])
    .addTo(map);

const marker2 = new mapboxgl.Marker({ color: 'black', rotation: 45 })
    .setLngLat([12.65147, 55.608166])
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>'`))
    .addTo(map);
