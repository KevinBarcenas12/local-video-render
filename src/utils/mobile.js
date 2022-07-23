export default function mobile() {
    return [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ].some(toMatch => navigator.userAgent.match(toMatch));
}