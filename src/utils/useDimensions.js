import { useCallback, useEffect, useState } from "react";

export function useDimensions({ liveUpdate } = { liveUpdate: false }) {
    
    let [ node, setNode ] = useState(null);
    let [ dimensions, setDimensions ] = useState({});

    let ref = useCallback(node => setNode(node), []);

    useEffect(() => {
        if (!node) return;

        const measure = () => setDimensions(node.getBoundingClientRect());
        measure();

        if (liveUpdate) {
            window.addEventListener("resize", measure);
            window.addEventListener("scroll", measure);

            return () => {
                window.removeEventListener("resize", measure);
                window.removeEventListener("scroll", measure);
            }
        }
    }, [node, liveUpdate]);

    return [ dimensions, ref ];
}

export function useGlobalDimensions({ liveUpdate } = { liveUpdate: false }) {
    let [ dimensions, setDimensions ] = useState({});

    useEffect(() => {
        const measure = () => setDimensions(document.body.getBoundingClientRect());
        measure();

        if (liveUpdate) {
            window.addEventListener("resize", measure);
            window.addEventListener("scroll", measure);

            return () => {
                window.removeEventListener("resize", measure);
                window.removeEventListener("scroll", measure);
            }
        }
    }, [liveUpdate]);

    return dimensions;
}