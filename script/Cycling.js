"use strict";

import Workout from "./Workout.js";

export default class Cycling extends Workout {
    #elevationGain;
    #speed;

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.#elevationGain = elevationGain;
        this.#calcSpeed();
    }

    #calcSpeed() {
        this.#speed = this.getDistance() / (this.getDuration() / 60);
        return this.#speed;
    }

    getElevationGain() {
        return this.#elevationGain;
    }

    getSpeed() {
        return this.#speed;
    }
}
