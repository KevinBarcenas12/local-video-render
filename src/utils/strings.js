/**
 * @param {string} string 
 * @returns {string}
 */
export function trimExtension(string) {
    return string.substring(0, string.lastIndexOf("."));
}

/**
 * @param {string} string 
 * @returns {string}
 */
export function capitalize(string) {
    if (string.length < 1) return "";
    return string[0].toUpperCase() + string.substring(1);
}

/**
 * 
 * @param {string} string 
 * @returns 
 */
export function capitalizeAll(string) {
    if (string.length < 1) return "";
    return string
        .split(" ")
        .map(word => capitalize(word))
        .join(" ");
}

/**
 * @param {string} string 
 * @returns {string}
 */
export function replaceSpaces(string) {
    
    string = string.replace(/_/g, " ");
    while(string.includes("-")) {
        string = string.replace(/ - |---/g, "@separator@");
        string = string.replace(/-/g, " ");
    }
    while(string.includes(".")) {
        string = string.replace(/\./g, " ");
    }
    string = string.replace(/@separator@/g, " - ");
    string = string.replace(/ - (.)/g, (match) => " - " + match.substring(3).toUpperCase());
    
    return string;
}

/**
 * @param {string} string 
 * @returns {string}
 */
export function epToEpisode(string) {
    return string.replace(/(ep )|(Ep )/, "Episode ");
}

/**
 * @param {string} fileName
 * @returns {string}
 */

export function getTitle(fileName) {
    return capitalize(epToEpisode(replaceSpaces(trimExtension(fileName))));
};
/**
 * @param {number} size 
 * @returns {string}
 */

export function getSize(size, unit = 0) {
    let units = ["b", "Kb", "Mb", "Gb", "Tb"];
    while (size > 1024) {
        size /= 1024;
        unit++;
    }
    return `${size.toFixed(1)}${units[unit]}`;
}

/**
 * @param {number} time
 * @returns {string}
 */
export function getTime(time) {
    let isReversed = false;
    if (time < 0) {
        time = -time;
        isReversed = true;
    }
    let Format = time >= 3600 ? "$h:$m:$s" : "$m:$s";
    if (isReversed) Format = `-${Format}`;
    const Hours = Math.floor((time / 3600) % (3600 * 24));
    const Minutes = Math.floor((time / 60) % 3600);
    const Seconds = Math.floor(time % 60);
    return Format
        .replace("$h", Hours)
        .replace("$m", (Minutes < 10 && time >= 3600) ? `0${Minutes}` : Minutes)
        .replace("$s", Seconds < 10 ? `0${Seconds}` : Seconds);
}

/**
 * @param {number} time
 * @returns {string}
 */
 export function getTimeExtended(time) {
    const negative = time < 0;
    time = time < 0 ? -time : time;

    const format = time >= 3600 ? "$S$hh $mmin $ssec" : time >= 60 ? "$S$mmin $ssec" : "$S$ssec";

    const hours = Math.floor((time / 3600) % (3600 * 24));
    const minutes = Math.floor((time / 60) % 3600);
    const seconds = Math.floor(time % 60);

    return format
        .replace("$S", negative ? "-" : "+")
        .replace("$h", hours)
        .replace("$m", minutes)
        .replace("$s", seconds);
}

const defaultFormat = {
    withHours: "$h:$m:$s",
    default: "$m:$s",
    withZero: false,
    placeholders: {
        hours: "$h",
        minutes: "$m",
        seconds: "$s",
    },
};

export function getTimeInFormat( time, _format = defaultFormat ) {
    let format = time >= 3600 ? _format.withHours : _format.default;

    const h = Math.floor((time / 3600) % (3600 * 24));
    const m = Math.floor((time / 60) % 3600);
    const s = Math.floor(time % 60);

    return format
        .replace(_format.placeholders.hours, h)
        .replace(_format.placeholders.minutes, _format.withZero && m > 9 ? `0${m}` : m)
        .replace(_format.placeholders.seconds, _format.withZero && s > 9 ? `0${s}` : s);
}


const str = {
    trimExtension,
    capitalize,
    replaceSpaces,
    epToEpisode,
    getTitle,
    getSize,
    getTime,
    getTimeExtended,
    capitalizeAll,
};
export default str;