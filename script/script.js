"use strict";

import App from "./App.js";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

const app = new App({
    form,
    inputType,
    inputDistance,
    inputDuration,
    inputCadence,
    inputElevation,
    containerWorkouts,
});
