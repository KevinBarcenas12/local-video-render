import { useState, useEffect, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContextHelper } from "../video/context";

import isMobile from "../../utils/mobile";

import {
    VolumeControl,
    TogglePause,
    ExitButton,
    FullscreenButton,
    BackwardButton,
    ForwardButton,
    TimestampControl,
    MovedTimestamp,
    Title,
} from "./buttons";

export default function Controls() {
    let [ isPaused ] = useContextHelper("paused");

    let [ isVisible, setVisible ] = useState(true);
    let [ isMoved, setMoved ] = useState(false);
    let [, setMouseIddle ] = useState(null);

    let [ isClicked, setClicked ] = useState(false);

    useEffect(() => {
        if (isMobile()) return;
        if (isMoved) {
            setVisible(true);
            setMouseIddle(clearTimeout);
            if (isPaused) return;
            setMouseIddle(setTimeout(() => setMoved(false), 3000));
            return;
        }

        setMouseIddle(clearTimeout);
        if (isPaused) return;
        setVisible(false);
    }, [isMoved]);

    useEffect(() => {
        if (!isMobile()) return;

        if (isVisible) {
            if (!isPaused) setVisible(false);
            setClicked(false);
            setMouseIddle(clearTimeout);
            return
        }

        if (isClicked) {
            setVisible(true);
            setMouseIddle(clearTimeout);
            if (isPaused) return;
            setMouseIddle(setTimeout(() => setClicked(false), 3000));
            return;
        }

        setClicked(false);
        setMouseIddle(clearTimeout);
        if (isPaused) return;
        setVisible(false);
    }, [isClicked]);

    // Handle click count
    let [ bwClickCount, setBwClickCount ] = useState(0);
    let [ fwClickCount, setFwClickCount ] = useState(0);
    let [ globalClickCount, setGlobalClickCount ] = useState(0);
    let [ clickCountReset, setClickCountReset ] = useState(false);
    let [, clickResetTimeout ] = useState(null);

    let [ displayDirection, setDisplayDirection ] = useState(0);
    let [, setDirectionTimeout ] = useState(null);

    let [, setCurrentTime ] = useContextHelper("newCurrentTime");
    let [ videoDuration ] = useContextHelper("videoDuration");
    let [, setPaused ] = useContextHelper("paused");
    let [, setFullscreen ] = useContextHelper("fullscreen");
    let [, setMovedTime ] = useContextHelper("movedTime");

    useEffect(() => {
        if (!clickCountReset || globalClickCount === 0) return;
        setClickCountReset(false);

        if (globalClickCount === 1) {
            if (!isMobile()) setPaused(prev => !prev);
            setClicked(prev => !prev);
            setGlobalClickCount(0);
            setBwClickCount(0);
            setFwClickCount(0);
            // isVisible(prev => !prev);
            return;
        }

        if (!isMobile()) setFullscreen(prev => !prev);
        setClicked(true);
        setCurrentTime(prev => {
            let currentTime = parseInt((prev * videoDuration / 100).toFixed(3));
            let bwTime = bwClickCount > 0 ? 10 * (bwClickCount - 1) : 0;
            let fwTime = fwClickCount > 0 ? 10 * (fwClickCount - 1) : 0;

            if (bwTime < fwTime) setDisplayDirection(-1);
            else if (bwTime > fwTime) setDisplayDirection(1);
            else setDisplayDirection(0);

            let movedTime = fwTime - bwTime;
            let newTime = currentTime + movedTime;
            newTime > videoDuration && (newTime = videoDuration);
            newTime < 0 && (newTime = 0);
            setMovedTime(movedTime);
            return newTime / videoDuration * 100;
        });
        setGlobalClickCount(0);
        setBwClickCount(0);
        setFwClickCount(0);
    }, [clickCountReset, globalClickCount]);

    useEffect(() => {
        if (globalClickCount === 0) return;
        clickResetTimeout(clearTimeout);
        clickResetTimeout(setTimeout(() => setClickCountReset(true), 300));
    }, [globalClickCount]);

    useEffect(() => {
        if (displayDirection === 0) return;
        setDirectionTimeout(clearTimeout);
        setDirectionTimeout(setTimeout(() => setDisplayDirection(0), 2500));
    }, [displayDirection]);

    return <Fragment>
        <motion.div
            className="click-handler"
            onMouseMove={() => setMoved(true)}
            onClick={() => setGlobalClickCount(prev => prev + 1)}
        />
        <motion.div 
            className="click bw" 
            onClick={() => {
                setBwClickCount(prev => prev + 1);
                setGlobalClickCount(prev => prev + 1);
            }}
        />
        <motion.div
            className="click fw"
            onClick={() => {
                setFwClickCount(prev => prev + 1);
                setGlobalClickCount(prev => prev + 1);
            }}
        />
        <AnimatePresence>
            {displayDirection === -1 && <motion.div key="bw" className="bw icon" />}
            {displayDirection === 1 && <motion.div key="fw" className="fw icon" />}
        </AnimatePresence>
        <motion.div
            className="video__controls"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => setClicked(true)}
        >
            <VolumeControl />
            <TogglePause />
            <ExitButton />
            <FullscreenButton />
            <BackwardButton />
            <ForwardButton />
            <TimestampControl />
            <MovedTimestamp />
            <Title />
        </motion.div>
    </Fragment>
}