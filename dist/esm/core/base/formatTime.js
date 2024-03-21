export default function formatTime(seconds) {
    if (!isFinite(seconds) || isNaN(seconds))
        return "00h 00m 00s";
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var secs = Math.floor(seconds % 60);
    return "".concat(hours.toString().padStart(2, "0"), "h ").concat(minutes
        .toString()
        .padStart(2, "0"), "m ").concat(secs.toString().padStart(2, "0"), "s");
}
