// Modules
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    BsFileEarmarkArrowUp as UploadIcon,
    BsFileEarmarkCheck as CorrectFile,
    BsFileEarmarkX as IncorrectFile,
} from "react-icons/bs";
// Context
import { useFileContext } from "../context/files";
import { useModalContext } from "../context/modal";
import { useShowPlayerContext } from "../context/showPlayer";
// Components
import Element from "./animated/element";

export default function Input() {
    const setFiles = useFileContext()[1];
    const setModal = useModalContext()[1];
    const [ isShown, setShown ] = useShowPlayerContext();
    let [ target, setTarget ] = useState([]);
    let [ isCorrectFile, setCorrectFile ] = useState(null);
    let [, setDragTimeout ] = useState();
    let [, setDragging ] = useState(false);

    const selectedFiles = target.length > 0;

    useEffect(() => {
        if (target.length < 1) {
            setCorrectFile(null);
            return;
        }
        let list = [];
        let invalidTypes = [];
        for (let element of target) {
            if (!/^video\//.test(element.type)) invalidTypes.push(element.name.substring(element.name.lastIndexOf(".")));
            list.push({ 
                file: element,
                isValid: /^video\//.test(element.type),
            });
        }
        if (invalidTypes.length > 0) setModal(`Couldn't load ${invalidTypes.reduce((prev, curr) => `${prev}, ${curr}`)} elements`);
        setCorrectFile(false);
        for (let element of target) if (/^video\//.test(element.type)) setCorrectFile(true);
        setFiles(list);
    }, [target, setFiles, setModal]);

    useEffect(() => {
        if (!isShown) setCorrectFile(null);
    }, [isShown]);

    useEffect(() => {
        const getFiles = event => {
            const isValidFile = item => item.kind === 'file' && /^video\//.test(item.type);
            let items = event.dataTransfer.items;
            let files = [];
            for (let item of items) files.push({
                file: item.getAsFile(),
                isValid: isValidFile(item),
            });
            setFiles(files);

            setCorrectFile(false);
            for (let file of files) if (/^video\//.test(file.type)) setCorrectFile(true);

            event.preventDefault();
        };
        const draggingOver = event => {
            setDragging(true);
    
            setDragTimeout(timeout => clearTimeout(timeout));
            setDragTimeout(() => setTimeout(() => setDragging(false), 3000));
            
            event.preventDefault();
        };

        if (isShown) {
            const cancel = event => event.preventDefault();
            window.addEventListener("drop", cancel);
            return () => window.removeEventListener("drop", cancel);
        }

        window.addEventListener("dragover", draggingOver);
        window.addEventListener("drop", getFiles);
        return () => {
            window.removeEventListener("dragover", draggingOver);
            window.removeEventListener("drop", getFiles);
        };
    }, [isShown]);

    const Icon = () => {
        if (isCorrectFile == null) return <UploadIcon className="icon" />;
        return isCorrectFile ? <CorrectFile className="icon" /> : <IncorrectFile className="icon" />;
    };
    const ShowButton = () => <span className="show-btn" onClick={() => setShown(true)}>
        Open Player
    </span>

    return <motion.div className="input">
        <motion.label htmlFor="file" className="input__label">
            <input type="file" id="file" accept="video/*" multiple onInput={e => setTarget(e.target.files)} hidden />
            <Element className="label-text">
                <span className="line">Select file(s) <Icon /></span>
            </Element>
        </motion.label>
        <AnimatePresence>
            {selectedFiles && <Element className="already-files" key="already-files">
                {target.length > 1 ? target.length + " files" : "File"} already loaded. <ShowButton />
            </Element>}
        </AnimatePresence>
    </motion.div>
}