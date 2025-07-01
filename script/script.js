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

// Geolocation API

navigator.geolocation.getCurrentPosition(
    (positon) => {
        const { latitude, longitude } = positon.coords;
        const coords = [latitude, longitude];
        const zoom = 13;

        // Leaflet => Map library

        const map = L.map("map").setView(coords, zoom);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker(coords).addTo(map).bindPopup("A pretty CSS popup.<br> Easily customizable.").openPopup();
    },
    () => {
        alert("Could not get your position!");
    }
);
