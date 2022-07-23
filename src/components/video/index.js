// Modules
import { motion } from "framer-motion";

// Components
import Controls from "./controls";
import Canvas from "./canvas";

// Context
import { useContextHelper } from "./context";
import { useEffect, useRef } from "react";

export default function Player({ src = "", }) {
    let [ fullscreen ] = useContextHelper("fullscreen");
    let [, setActiveMouse ] = useContextHelper("showControls");
    const ref = useRef();

    useEffect(() => {
        if (!ref.current) return;
        if (fullscreen && document.fullscreenElement == null) {
            ref.current.requestFullscreen();
            window.screen.orientation.lock("landscape");
        };
        if (!fullscreen && document.fullscreenElement != null) {
            document.exitFullscreen();
            window.screen.orientation.unlock();
        }
    }, [fullscreen]);

    return <motion.div
        className="video__player"
        ref={ref}
        onMouseMove={() => setActiveMouse(true)}
        onMouseLeave={() => setActiveMouse(false)}
    >
        <Canvas src={src} />
        <Controls />
    </motion.div>
}