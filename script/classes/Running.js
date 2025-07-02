"use strict";

import Workout from "./Workout.js";

export default class Running extends Workout {
    #cadence;
    #pace;
    #type = "running";

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.#cadence = cadence;
        this.#calcPace();
    }

    #calcPace() {
        this.#pace = this.getDuration() / this.getDistance();
        return this.#pace;
    }

    getCadence() {
        return this.#cadence;
    }

    getPace() {
        return this.#pace;
    }

    getType() {
        return this.#type;
    }
}
