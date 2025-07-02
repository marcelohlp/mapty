"use strict";

export default class Workout {
    #distance;
    #coords;
    #duration;
    #type = "workout";
    #date = new Date();
    #id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.#coords = coords;
        this.#distance = distance;
        this.#duration = duration;
    }

    getDescription() {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return `${this.getType()[0].toUpperCase()}${this.getType().slice(1)} on ${
            months[this.getDate().getMonth()]
        } ${this.getDate().getDate()}`;
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

    getType() {
        return this.#type;
    }

    getDate() {
        return this.#date;
    }

    getId() {
        return this.#id;
    }
}
