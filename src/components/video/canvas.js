import { useEffect, useRef, useState } from "react";
import { useContextHelper } from "./context";

import { motion } from "framer-motion";

export default function Canvas({ src }) {
    let [ currentTime, setCurrentTime ] = useContextHelper("currentTime");
    let [ paused, setPaused ] = useContextHelper("paused");
    let [ volume, setVolume ] = useContextHelper("volume");
    let [ refreshRate ] = useContextHelper("refreshRate");
    let [ videoDuration, setVideoDuration ] = useContextHelper("videoDuration");
    let [ newCurrentTime ] = useContextHelper("newCurrentTime");
    let [ muted ] = useContextHelper("muted");
    let [ index ] = useContextHelper("index");

    let [, setRenderInterval ] = useState(null);
    const [ video ] = useState(document.createElement("video"));

    const canvas = useRef();

    useEffect(() => {
        setCurrentTime(prev => .001);
        setPaused(true);
    }, [index]);

    useEffect(() => {
        video.muted = muted;
    }, [muted]);

    useEffect(() => {
        setCurrentTime(newCurrentTime * videoDuration / 100);
    }, [newCurrentTime]);

    useEffect(() => {
        video.src = src;
        video.load();
        video.currentTime = .001;
        video.autoplay = true;

        video.onloadedmetadata = () => {
            if (!canvas.current) return;

            setVideoDuration(video.duration);

            canvas.current.width = video.videoWidth;
            canvas.current.height = video.videoHeight;

            let sizes = {
                w: video.videoWidth,
                h: video.videoHeight,
            };

            canvas.current.style.setProperty("--w", sizes.w);
            canvas.current.style.setProperty("--h", sizes.h);
        };

        video.onloadeddata = () => {
            if (!canvas.current) return;
            canvas.current.getContext("2d").drawImage(video, 0, 0);
        }

        const playEvent = () => setPaused(false);
        const pauseEvent = () => setPaused(true);
        const volumeChangeEvent = () => setVolume(video.volume);
        const timeUpdateEvent = () => setCurrentTime(video.currentTime);

        video.addEventListener("play", playEvent);
        video.addEventListener("pause", pauseEvent);
        video.addEventListener("timeupdate", timeUpdateEvent);
        video.addEventListener("volumechange", volumeChangeEvent);
        
        return () => {
            video.removeEventListener("play", playEvent);
            video.removeEventListener("pause", pauseEvent);
            video.removeEventListener("timeupdate", timeUpdateEvent);
            video.removeEventListener("volumechange", volumeChangeEvent);
        }
    }, [src]);

    useEffect(() => {
        setRenderInterval(clearInterval);
    }, [refreshRate]);

    useEffect(() => {
        if (src == null) return;
        if (paused) {
            video.pause();
            setRenderInterval(clearInterval);
            return;
        }
        video.play();
        const RefreshRate = 1000 / refreshRate;
        const DrawImage = () => canvas
            .current.getContext("2d")
            .drawImage(video, 0, 0);
        setRenderInterval(clearInterval);
        setRenderInterval(setInterval(DrawImage, RefreshRate));
    }, [paused, src, refreshRate]);

    useEffect(() => {
        video.volume = volume;
    }, [volume]);

    useEffect(() => {
        canvas.current?.getContext("2d").drawImage(video, 0, 0);
        if (currentTime.toFixed(0) === video.currentTime.toFixed(0)) return;
        video.currentTime = currentTime;
    }, [currentTime]);

    return <motion.canvas ref={canvas} />
}