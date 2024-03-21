"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function calculateETA(startTime, percent) {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;
    const remainingTime = (elapsedTime / percent) * (100 - percent);
    return remainingTime.toFixed(2);
}
exports.default = calculateETA;
