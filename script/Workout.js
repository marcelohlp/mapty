"use strict";

export default class Workout {
    #distance;
    #coords;
    #duration;
    #date = new Date();
    #id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.#coords = coords;
        this.#distance = distance;
        this.#duration = duration;
    }

    getCoords() {
        return this.#coords;
    }

    getDistance() {
        return this.#distance;
    }

    getDuration() {
        return this.#duration;
    }

    getDate() {
        return this.#date;
    }

    getId() {
        return this.#id;
    }
}
