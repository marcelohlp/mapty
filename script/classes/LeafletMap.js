"use strict";

export default class LeafletMap {
    static setInitialMap(id, latitude, longitude, zoom, options = {}) {
        const coords = [latitude, longitude];
        return L.map(id).setView(coords, zoom, options);
    }

    static setViewToMarker({ map, latitude, longitude, zoom, options = {} }) {
        const coords = [latitude, longitude];
        map.setView(coords, zoom, options);
    }

    static createTileLayer(map) {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    }

    static renderMarker({ latitude, longitude, map, className, content }) {
        const coords = [latitude, longitude];
        L.marker(coords)
            .addTo(map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: className,
                })
            )
            .setPopupContent(content)
            .openPopup();
    }
}
