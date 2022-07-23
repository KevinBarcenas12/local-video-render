import { createContext, useContext, useState } from "react";

const FileContext = createContext();
const FileUpdater = createContext();

/**
 * @typedef {{
 *  readonly isValid: boolean,
 *  readonly file: File
 * }} ContextType
 * @returns {[
 *  ContextType[],
 *  (prop: ContextType[]) => void
 * ]}
 */
export function useFileContext() {
    return [
        useContext(FileContext),
        useContext(FileUpdater),
    ];
}

export default function FileContextProvider({ children }) {
    let [ file, setFile ] = useState([]);

    return <FileContext.Provider value={file}>
        <FileUpdater.Provider value={setFile}>
            {children}
        </FileUpdater.Provider>
    </FileContext.Provider>
}