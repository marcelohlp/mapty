"use strict";

import Cycling from "./Cycling.js";
import Running from "./Running.js";

export default class App {
    #map;
    #mapEvent;
    #workouts = [];
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
        this.#inputType.addEventListener("change", this.#toggleElevationField.bind(this));
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

    #hiddeForm() {
        this.#form.style.display = "none";
        this.#form.classList.add("hidden");
        setTimeout(() => (this.#form.style.display = "grid"), 1000);
    }

    #toggleElevationField() {
        this.#inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
        this.#inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    }

    #newWorkout(event) {
        const validInputs = (...inputs) => inputs.every((input) => Number.isFinite(input));
        const allPositive = (...inputs) => inputs.every((input) => input > 0);

        event.preventDefault();

        let workout;

        const coords = this.#getMapEventCoords(this.#mapEvent);

        const type = this.#inputType.value;
        const distance = +this.#inputDistance.value;
        const duration = +this.#inputDuration.value;

        if (type === "running") {
            const cadence = +this.#inputCadence.value;
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
                return alert("Inputs have to be positive numbers!");
            workout = new Running(coords, distance, duration, cadence);
        }

        if (type === "cycling") {
            const elevationGain = +this.#inputElevation.value;
            if (!validInputs(distance, duration, elevationGain) || !allPositive(distance, duration))
                return alert("Inputs have to be positive numbers!");
            workout = new Cycling(coords, distance, duration, elevationGain);
        }

        this.#workouts.push(workout);

        this.#renderWorkoutMarker(workout);

        this.#renderWorkout(workout);

        this.#setInputsValues("");

        this.#hiddeForm();
    }

    #setInputsValues(value) {
        this.#inputDistance.value = this.#inputCadence.value = this.#inputDuration.value = this.#inputElevation.value = value;
    }

    #getMapEventCoords(mapEvent) {
        const { lat: latitude, lng: longitude } = mapEvent.latlng;
        return [latitude, longitude];
    }

    #renderWorkoutMarker(workout) {
        L.marker(workout.getCoords())
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.getType()}-popup`,
                })
            )
            .setPopupContent(String(workout.getDescription()))
            .openPopup();
    }

    #renderWorkout(workout) {
        let html = `
            <li class="workout workout--${workout.getType()}" data-id="${workout.getId()}">
                <h2 class="workout__title">${workout.getDescription()}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.getType() === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
                    <span class="workout__value">${workout.getDistance()}</span>
                    <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.getDuration()}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;

        if (workout.getType() === "running") {
            html += `
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.getPace().toFixed(1)}</span>
                        <span class="workout__unit">min/km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">🦶🏼</span>
                        <span class="workout__value">${workout.getCadence()}</span>
                        <span class="workout__unit">spm</span>
                    </div>
                </li>
            `;
        }

        if (workout.getType() === "cycling") {
            html += `
                    <div class="workout__details">
                        <span class="workout__icon">⚡️</span>
                        <span class="workout__value">${workout.getSpeed().toFixed(1)}</span>
                        <span class="workout__unit">km/h</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⛰</span>
                        <span class="workout__value">${workout.getElevationGain()}</span>
                        <span class="workout__unit">m</span>
                    </div>
                </li>
            `;
        }

        this.#form.insertAdjacentHTML("afterend", html);
    }
}
