// Modules
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
// Context
import { useFileContext } from "../context/files";
import { useModalContext } from "../context/modal";
import { useShowPlayerContext } from "../context/showPlayer";
import { useContextHelper, VideoContextProvider } from "./video/context";
// Components
import Frame from "./animated/frame";
import Element from "./animated/element";
import Video from "./video";
// Custom modules
import str from "../utils/strings";
import Expandable from "./animated/expandable";
import VideoEntry from "./videoEntry";

export default function Player() {
    return <VideoContextProvider>
        <Component />
    </VideoContextProvider>
}

function Component() {
    // Contexts
    const files = useFileContext()[0];
    const setModal = useModalContext()[1];
    let [ index, setIndex ] = useContextHelper("index");

    // States
    let [ src, setSrc ] = useState(null);
    let [ title, setTitle ] = useState("");
    let [ fileName, setFileName ] = useState("");
    let [ size, setSize ] = useState(0);
    
    // Display state
    let [ isShown, setShowPlayer ] = useShowPlayerContext();

    // Functions
    const Entries = ({ setIndex }) => files.map(
        (file, local) => <Element superClass="video__entry" key={local}>
            <VideoEntry
                onClick={() => setIndex(local)}
                fileData={{ name: file.file.name, size: file.file.size, isValid: file.isValid }}
                index={local}
                isCurrent={local === index}
            />
        </Element>
    );

    // useEffect hooks
    useEffect(() => {
        for (let i = 0; i < files.length; i++) {
            let current = files[i];
            if (!current.isValid || !current.file) continue;
            setShowPlayer(true);
            setSrc(URL.createObjectURL(current.file));
            setSize(current.file.size);
            setTitle(str.getTitle(current.file.name));
            setFileName(current.file.name);
            setIndex(i);
            break;
        }
    }, [files]);

    useEffect(() => {
        if (files.length < 1) return;
        let current = files[index];
        if (!current || current.file == null) {
            if (index < (files.length - 1)) setIndex(index + 1);
            return;
        }
        setSrc(URL.createObjectURL(current.file));
        setTitle(str.getTitle(current.file.name));
    }, [index, files]);

    return <Frame isVisible={isShown} animationDirection="x" backwards>
        <motion.div className="video">
            <Video {...{ src, files }} />
            <motion.div className="video-stats">
                <LayoutGroup id="video-stats">
                    <Expandable title={title} variant="info" id="info">
                        <Element>File name: {fileName}</Element>
                        <Element>File title: {title}</Element>
                        <Element>File size: {str.getSize(size)}</Element>
                    </Expandable>
                    <Expandable title="Files loaded" variant="list" id="list">
                        <Entries setIndex={setIndex} />
                    </Expandable>
                </LayoutGroup>
            </motion.div>
        </motion.div>
    </Frame>
}