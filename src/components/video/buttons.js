import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    // Volume
    IoVolumeLowSharp as VolumeLow,
    IoVolumeHighSharp as VolumeHigh,
    IoVolumeMedium as VolumeMid,
    IoVolumeMuteSharp as VolumeMuted,
    // Playback
    IoPlay as Play,
    IoPause as Pause,
    // Other Controls
    IoCloseSharp as Exit,
    IoPlayBack as BackwardIcon,
    IoPlayForward as ForwardIcon
} from "react-icons/io5";
import {
    AiOutlineFullscreen as FullscreenOpen,
    AiOutlineFullscreenExit as FullscreenExit,
} from "react-icons/ai"

import str from "../../utils/strings";

import { useShowPlayerContext } from "../../context/showPlayer";
import { useFileContext } from "../../context/files";
import { Context as Provider, Updater, useContextHelper } from "./context";

const MediaControl = ({
    children,
    variant = "",
    onClick = () => {},
    role = undefined,
}) => (
    <motion.div role={role} onClick={onClick} className={`media-control ${variant}`}>
        {children}
    </motion.div>
);

function Track({
    value = 0,
    max = 1,
    min = 0,
    step = .01,
    disabled = false,
    className = undefined,
    onChange = () => {}
}) {
    value === "Infinity" && (value = 0);
    let progress = (value / max * 100).toFixed(1);
    return <motion.div className={`track${className ? ` ${className}` : ""}${disabled ? " disabled" : ""}`}>
        <motion.div className="track__progress" style={{ '--value': progress }} />
        <motion.div className="track__total" />
        <motion.input
            type="range"
            value={value === "Infinity" ? 0 : value}
            max={max}
            min={min}
            step={step}
            className="track__input"
            onChange={onChange}
        />
    </motion.div>
}

function VolumeIcon() {
    let volume = useContext(Provider.volume);
    let muted = useContext(Provider.muted);

    if (muted || volume === 0) return <VolumeMuted className="icon" />

    if (volume > .7) return <VolumeHigh className="icon" />
    if (volume > .45) return <VolumeMid className="icon" />
    return <VolumeLow className="icon" />
}

function VolumeInput() {
    let [ volume, setVolume ] = useContextHelper("volume");
    let muted = useContext(Provider.muted);

    return <Track
        value={volume}
        max={1}
        min={0}
        type="range"
        step={.05}
        disabled={muted}
        className="range volume"
        onChange={e => setVolume(e.target.value)}
    />
}

export function VolumeControl() {
    let setMuted = useContext(Updater.muted);

    return <MediaControl variant="volume" role="bar">
        <div className="toggler-container" onClick={() => setMuted(prev => !prev)}><VolumeIcon /></div>
        <VolumeInput />
    </MediaControl>
}

export function TogglePause() {
    let [ paused, setPaused ] = useContextHelper("paused");

    return <MediaControl variant="pause" role="toggler" onClick={() => setPaused(prev => !prev)}>
        {paused ? <Play className="icon" /> : <Pause className="icon" />}
    </MediaControl>
}

export function ExitButton() {
    let [, setShowPlayer ] = useShowPlayerContext();
    let setPaused = useContext(Updater.paused);
    let setCurrentTime = useContext(Updater.currentTime);
    let fullscreen = useContext(Provider.fullscreen);

    const handleClick = () => {
        setPaused(true);
        setShowPlayer(false);
        setCurrentTime(0);
    }
    return !fullscreen && <MediaControl variant="exit" role="button" onClick={handleClick}>
        <Exit className="icon" />
    </MediaControl>
}

export function FullscreenButton() {
    let [ fullscreen, setFullscreen ] = useContextHelper("fullscreen");
    let [ currentFullscreen, setCurrentFullscreen ] = useState(fullscreen);

    useEffect(() => {
        const changeFullscreen = () => {
            setCurrentFullscreen(document.fullscreenElement != null);
            setFullscreen(document.fullscreenElement != null);
        };

        document.addEventListener("fullscreenchange", changeFullscreen);
        return () => document.removeEventListener("fullscreenchange", changeFullscreen);
    }, []);

    return <MediaControl variant="fullscreen" role="toggler" onClick={() => setFullscreen(prev => !prev)}>
        {currentFullscreen ? <FullscreenExit className="icon" /> : <FullscreenOpen className="icon" />}
    </MediaControl>
}

function TimeInput() {
    let currentTime = useContext(Provider.currentTime);
    let videoDuration = useContext(Provider.videoDuration);
    let setNewCurrentTime = useContext(Updater.newCurrentTime);
    let setMovedTime = useContext(Updater.movedTime);

    let [ current, setCurrent ] = useState((currentTime / videoDuration * 100).toFixed(3));
    let [ input, setInput ] = useState(0);

    useEffect(() => {
        setCurrent((currentTime / videoDuration * 100).toFixed(3));
    }, [currentTime]);
    useEffect(() => {
        setNewCurrentTime(input);
    }, [input]);
    useEffect(() => {
        setMovedTime((input * videoDuration / 100 - currentTime).toFixed(0));
    }, [input]);

    return <Track
        value={current}
        max={100}
        min={0}
        step={.001}
        disabled={false}
        onChange={e => setInput(e.target.value)}
    />
}

function Timestamp({ time, variant = "current" }) {
    return <motion.div className={`timestamp__element ${variant}`}>
        {str.getTime(time)}
    </motion.div>
}

export function TimestampControl() {
    let currentTime = useContext(Provider.currentTime);
    let videoDuration = useContext(Provider.videoDuration);

    return <MediaControl variant="timestamp" role="bar">
        <Timestamp time={currentTime} variant="current" />
        <TimeInput />
        <Timestamp time={-(videoDuration - currentTime)} variant="remaining" />
    </MediaControl>
}

export function BackwardButton() {
    let index = useContext(Provider.index);
    let setIndex = useContext(Updater.index);

    return (index > 0) && <MediaControl variant="backward" role="button" onClick={() => setIndex(index - 1)}>
        <BackwardIcon className="icon" />
    </MediaControl>
}

export function ForwardButton() {
    let index = useContext(Provider.index);
    let setIndex = useContext(Updater.index);
    let [ files ] = useFileContext();

    return (index < (files.length - 1)) && <MediaControl variant="forward" role="button" onClick={() => setIndex(index + 1)}>
        <ForwardIcon className="icon" />
    </MediaControl>
}

export function MovedTimestamp() {
    let movedTime = useContext(Provider.movedTime);
    let [ displayTime, setDisplayTime ] = useState(movedTime);
    let [ display, setDisplay ] = useState(false);
    let [, setDisplayDelay ] = useState(null);

    useEffect(() => {
        setDisplayTime(movedTime);
        const GtOrLt = (a = 0, b = 0) => (a > b || a < -b);

        if (GtOrLt(movedTime, 5)) {
            setDisplay(_ => true);
            setDisplayDelay(timeout => clearTimeout(timeout));
            setDisplayDelay(setTimeout(() => setDisplay(false), 3000));
            return;
        }

        setDisplayDelay(interval => clearTimeout(interval));
        setDisplay(_ => false);
    }, [movedTime]);

    return display && <MediaControl variant="moved-timestamp" role="text">
        {str.getTimeExtended(displayTime)}
    </MediaControl>
}

export function Title() {
    let [ files ] = useFileContext();
    let index = useContext(Provider.index);

    let fullscreen = useContext(Provider.fullscreen);

    return fullscreen && <MediaControl variant="title" role="text">
        {str.getTitle(files[index].file.name)}
    </MediaControl>
}