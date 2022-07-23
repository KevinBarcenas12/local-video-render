// modules
import React from "react";
import { motion } from "framer-motion";

// Components
import { FrameAnimation } from "../../utils/animations";

export default function Frame({
    children = null,
    animationDuration: dur = 1,
    animationDirection: dir = "y",
    backwards: back = false,
    isVisible = true,
    className = "",
    variant = "",
    id = "",
}) {
    let [ portrait, setPortrait ] = React.useState(window.screen.availHeight > window.screen.availWidth);
    const key = {
        container: React.useId(),
        backPanel: React.useId(),
        frontPanel: React.useId(),
    };

    React.useEffect(() => {
        const handleChange = () => {
            setPortrait(window.screen.availHeight > window.screen.availWidth);
        };

        window.addEventListener("orientationchange", handleChange);
        return () => window.removeEventListener("orientationchange", handleChange);
    }, []);

    return <motion.nav
        className="frame"
        id={id}
        initial="initial"
        animate={isVisible ? "animate" : "exit"}
        exit="exit"
        key={variant}
    >
        <motion.div
            className="animation back-panel"
            key={key.backPanel}
            variants={FrameAnimation(dir, dur, false, portrait, back)}
        />
        <motion.div
            className="animation front-panel"
            key={key.frontPanel}
            variants={FrameAnimation(dir, dur, true, portrait, back)}
        />
        <motion.div
            className={`frame__container ${className}`}
            key={key.container}
            variants={FrameAnimation(dir, dur, true, portrait, back)}
        >
            {children}
        </motion.div>
    </motion.nav>
}