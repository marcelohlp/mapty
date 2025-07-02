"use strict";

export default class DOM {
    static #instance;
    static #token = Symbol();

    #form;
    #containerWorkouts;
    #inputType;
    #inputDistance;
    #inputDuration;
    #inputCadence;
    #inputElevation;

    constructor(token) {
        if (token !== DOM.#token) throw new Error(`You should use "create()" static method!`);

        if (DOM.#instance) return DOM.#instance;

        this.#form = document.querySelector(".form");
        this.#containerWorkouts = document.querySelector(".workouts");
        this.#inputType = document.querySelector(".form__input--type");
        this.#inputDistance = document.querySelector(".form__input--distance");
        this.#inputDuration = document.querySelector(".form__input--duration");
        this.#inputCadence = document.querySelector(".form__input--cadence");
        this.#inputElevation = document.querySelector(".form__input--elevation");

        DOM.#instance = this;
    }

    static create() {
        if (!DOM.#instance) DOM.#instance = new DOM(DOM.#token);
        return DOM.#instance;
    }

    getForm() {
        return this.#form;
    }

    getContainerWorkouts() {
        return this.#containerWorkouts;
    }

    getInputType() {
        return this.#inputType;
    }

    getInputDistance() {
        return this.#inputDistance;
    }

    getInputDuration() {
        return this.#inputDuration;
    }

    getInputCadence() {
        return this.#inputCadence;
    }

    getInputElevation() {
        return this.#inputElevation;
    }
}
