import { createContext, useContext, useEffect, useState } from "react";
import { useFileContext } from "./files";

const ThumbnailContext = createContext();
const ThumbnailUpdater = createContext();

/**
 * @typedef {string} ContextType
 * @returns {[
 *  ContextType,
 *  (prop: ContextType) => void
 * ]}
 */
export function useThumbnailContext() {
    return [
        useContext(ThumbnailContext),
        useContext(ThumbnailUpdater),
    ];
}

export default function ThumbnailContextProvider({ children }) {
    let [ thumbnails, setThumbnails ] = useState([]);
    let [ files ] = useFileContext();

    useEffect(() => {
        setThumbnails([]);
        files.forEach((file, index) => {
            if (!file.isValid) {
                setThumbnails(thumbnails => {
                    thumbnails[index] = "/invalid.jpg";
                    return thumbnails;
                })
                return;
            }
            let video = document.createElement("video");
            video.src = URL.createObjectURL(file.file);
            video.load();
            video.currentTime = .001;
            video.onloadedmetadata = () => video.currentTime = video.duration / 2;
            video.onloadeddata = () => {
                let canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                canvas.getContext("2d").drawImage(video, 0, 0);
                setThumbnails(thumbnails => {
                    thumbnails[index] = canvas.toDataURL();
                    return thumbnails;
                });
            };
        });
    }, [files]);

    return <ThumbnailContext.Provider value={thumbnails}>
        <ThumbnailUpdater.Provider value={setThumbnails}>
            {children}
        </ThumbnailUpdater.Provider>
    </ThumbnailContext.Provider>
}