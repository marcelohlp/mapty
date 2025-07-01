"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

// Geolocation API

navigator.geolocation.getCurrentPosition(
    (positon) => {
        const { latitude, longitude } = positon.coords;
        const coords = [latitude, longitude];
        const zoom = 13;

        // Leaflet => Map library

        map = L.map("map").setView(coords, zoom);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.on("click", (event) => {
            mapEvent = event;
            form.classList.remove("hidden");
            inputDistance.focus();
        });
    },
    () => {
        alert("Could not get your position!");
    }
);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    inputDistance.value = inputCadence.value = inputDuration.value = inputElevation.value = "";

    const { lat: latitude, lng: longitude } = mapEvent.latlng;
    const coords = [latitude, longitude];
    L.marker(coords)
        .addTo(map)
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
});

inputType.addEventListener("change", () => {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});
