"use strict";

import LeafletMap from "./LeafletMap.js";
import Cycling from "./Cycling.js";
import Running from "./Running.js";

export default class App {
    #dom;
    #map;

    #mapEvent;
    #workouts = [];

    #mapId = "map";
    #defaultZoom = 13;

    constructor(dom) {
        this.#dom = dom;
        this.#getPosition();
        this.#getLocalStorage();
        this.#dom.getForm().addEventListener("submit", this.#newWorkout.bind(this));
        this.#dom.getInputType().addEventListener("change", this.#toggleElevationField.bind(this));
        this.#dom.getContainerWorkouts().addEventListener("click", this.#moveToPopup.bind(this));
    }

    #getPosition() {
        navigator.geolocation.getCurrentPosition(this.#loadMap.bind(this), () => alert("Could not get your position!"));
    }

    #loadMap(positon) {
        const { latitude, longitude } = positon.coords;

        this.#map = LeafletMap.setInitialMap(this.#mapId, latitude, longitude, this.#defaultZoom);

        LeafletMap.createTileLayer(this.#map);

        this.#map.on("click", this.#showForm.bind(this));

        this.#workouts.forEach((workout) => {
            LeafletMap.renderMarker({
                latitude: workout.getCoords().at(0),
                longitude: workout.getCoords().at(1),
                map: this.#map,
                className: `${workout.getType()}-popup`,
                content: String(workout.getDescription()),
            });
        });
    }

    #showForm(event) {
        this.#mapEvent = event;
        this.#dom.getForm().classList.remove("hidden");
        this.#dom.getInputDistance().focus();
    }

    #getLocalStorage() {
        const data = JSON.parse(localStorage.getItem("workouts"));

        if (!data) return;

        this.#workouts = data.map((workout) => {
            if (workout.type === "running") {
                return new Running(workout.coords, workout.distance, workout.duration, workout.cadence);
            }
            if (workout.type === "cycling") {
                return new Cycling(workout.coords, workout.distance, workout.duration, workout.elevationGain);
            }
        });

        this.#workouts.forEach((workout) => {
            this.#renderWorkout(workout);
        });
    }

    #hiddeForm() {
        this.#dom.getForm().style.display = "none";
        this.#dom.getForm().classList.add("hidden");
        setTimeout(() => (this.#dom.getForm().style.display = "grid"), 1000);
    }

    #toggleElevationField() {
        this.#dom.getInputElevation().closest(".form__row").classList.toggle("form__row--hidden");
        this.#dom.getInputCadence().closest(".form__row").classList.toggle("form__row--hidden");
    }

    #newWorkout(event) {
        const validInputs = (...inputs) => inputs.every((input) => Number.isFinite(input));
        const allPositive = (...inputs) => inputs.every((input) => input > 0);

        event.preventDefault();

        let workout;

        const coords = this.#getMapEventCoords(this.#mapEvent);

        const type = this.#dom.getInputType().value;
        const distance = +this.#dom.getInputDistance().value;
        const duration = +this.#dom.getInputDuration().value;

        if (type === "running") {
            const cadence = +this.#dom.getInputCadence().value;
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
                return alert("Inputs have to be positive numbers!");
            workout = new Running(coords, distance, duration, cadence);
        }

        if (type === "cycling") {
            const elevationGain = +this.#dom.getInputElevation().value;
            if (!validInputs(distance, duration, elevationGain) || !allPositive(distance, duration))
                return alert("Inputs have to be positive numbers!");
            workout = new Cycling(coords, distance, duration, elevationGain);
        }

        this.#workouts.push(workout);

        LeafletMap.renderMarker({
            latitude: workout.getCoords().at(0),
            longitude: workout.getCoords().at(1),
            map: this.#map,
            className: `${workout.getType()}-popup`,
            content: String(workout.getDescription()),
        });

        this.#renderWorkout(workout);

        this.#setInputsValues("");

        this.#hiddeForm();

        this.#setLocalStorage();
    }

    #setInputsValues(value) {
        this.#dom.getInputDistance().value =
            this.#dom.getInputCadence().value =
            this.#dom.getInputDuration().value =
            this.#dom.getInputElevation().value =
                value;
    }

    #getMapEventCoords(mapEvent) {
        const { lat: latitude, lng: longitude } = mapEvent.latlng;
        return [latitude, longitude];
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

        this.#dom.getForm().insertAdjacentHTML("afterend", html);
    }

    #setLocalStorage() {
        localStorage.setItem("workouts", JSON.stringify(this.#workouts));
    }

    #moveToPopup(event) {
        const element = event.target.closest(".workout");
        if (!element) return;
        const workout = this.#workouts.find((workout) => workout.getId() === element.dataset.id);

        const setViewToMarkerOptions = {
            animate: true,
            pan: {
                duration: 1,
            },
        };

        LeafletMap.setViewToMarker({
            map: this.#map,
            latitude: workout.getCoords().at(0),
            longitude: workout.getCoords().at(1),
            zoom: this.#defaultZoom,
            options: setViewToMarkerOptions,
        });
    }
}
