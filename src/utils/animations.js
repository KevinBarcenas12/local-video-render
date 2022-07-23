import mobile from "./mobile";

// New block animation
const isMobile = mobile();

const DURATION = 1;
/** @type {"y"} */
const DIRECTION = "y";
const EXTRA_TIME = .5;

/** @typedef {{ [key: string]: string | number | boolean | AnimationProps }} AnimationProps */

/**
 * @param {"x" | "y"} _axis Direction to animate
 * @param {number} dur Animation duration
 * @param {boolean} front is front panel or back panel
 * @param {boolean} isPortrait is in device portrait mode
 * @param {boolean} backwards invert animation origin direction
 * @returns {AnimationProps} Object to set as variants in motion components
 */
export const FrameAnimation = (
    _axis,
    dur,
    front = true,
    isPortrait = false,
    backwards = false,
) => {
    let axis = _axis ? _axis : DIRECTION;
    let duration = dur != null ? dur : DURATION;
    let position = backwards ? '-100%' : '100%';

    return {
        initial: { [axis]: position },
        animate: {
            [axis]: 0,
            transition: {
                duration: isMobile && isPortrait ? duration + EXTRA_TIME : duration,
                staggerChildren: .25,
                staggerDirection: 1,
                when: "beforeChildren",
                delay: front ? duration / 10 : 0,
                ease: [.5, 0, 0, 1],
            },
        },
        exit: {
            [axis]: position,
            transition: {
                duration: isMobile && isPortrait ? duration + EXTRA_TIME : duration,
                staggerChildren: .25,
                staggerDirection: -1,
                when: "afterChildren",
                delay: front ? 0 : duration / 10,
                ease: [1, 0, .5, 1],
            }
        }
    }
}

/**
 * @param {number} duration Animation duration
 * @param {boolean} front Is front panel(true) or back panel(false)
 * @param {"width" | "height"} _axis Property to animate
 * @returns {AnimationProps} Object to set as variants in motion components
 */
export const ElementAnimation = (
    duration,
    front = true,
    _axis = "width",
) => {
    let dur = duration != null ? duration : DURATION / 4;
    let axis = _axis ? _axis : "width";

    return {
        initial: { [axis]: '100%' },
        animate: {
            [axis]: 0,
            transition: {
                duration: dur,
                ease: [.5, 0, 0, 1],
                delay: front ? dur / 5 : 0,
            }
        },
        exit: {
            [axis]: '100%',
            transition: {
                duration: dur,
                ease: [1, 0, .5, 1],
                delay: front ? 0 : dur / 5,
            }
        }
    };
}