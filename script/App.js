"use strict";

export default class App {
    #map;
    #mapEvent;
    #form;
    #inputType;
    #inputDistance;
    #inputDuration;
    #inputCadence;
    #inputElevation;

    constructor({ form, inputType, inputDistance, inputDuration, inputCadence, inputElevation }) {
        this.#form = form;
        this.#inputType = inputType;
        this.#inputDistance = inputDistance;
        this.#inputDuration = inputDuration;
        this.#inputCadence = inputCadence;
        this.#inputElevation = inputElevation;
        this.#getPosition();
        this.#form.addEventListener("submit", this.#newWorkout.bind(this));
        this.#inputType.addEventListener("change", this.#toggleElevationField);
    }

    #getPosition() {
        navigator.geolocation.getCurrentPosition(this.#loadMap.bind(this), () => alert("Could not get your position!"));
    }

    #loadMap(positon) {
        const { latitude, longitude } = positon.coords;
        const coords = [latitude, longitude];
        const zoom = 13;

        this.#map = L.map("map").setView(coords, zoom);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        this.#map.on("click", this.#showForm.bind(this));
    }

    #showForm(event) {
        this.#mapEvent = event;
        this.#form.classList.remove("hidden");
        this.#inputDistance.focus();
    }

    #toggleElevationField() {
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    }

    #newWorkout(event) {
        event.preventDefault();

        this.#setInputsValues("");

        const coords = this.#getMapEventCoords(this.#mapEvent);

        L.marker(coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: "running-popup",
                })
            )
            .setPopupContent("Workout")
            .openPopup();
    }

    #setInputsValues(value) {
        this.#inputDistance.value = this.#inputCadence.value = this.#inputDuration.value = this.#inputElevation.value = value;
    }

    #getMapEventCoords(mapEvent) {
        const { lat: latitude, lng: longitude } = mapEvent.latlng;
        return [latitude, longitude];
    }
}
