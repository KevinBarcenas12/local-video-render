import { createContext, useContext, useState } from "react";

const ModalContext = createContext();
const ModalUpdater = createContext();

/**
 * @typedef {string} ContextType
 * @returns {[
 *  ContextType,
 *  (prop: ContextType) => void
 * ]} 
 */
export function useModalContext() {
    return [
        useContext(ModalContext),
        useContext(ModalUpdater)
    ];
}

export default function ModalContextProvider({ children }) {
    let [ modal, setModal ] = useState(null);

    return <ModalContext.Provider value={modal}>
        <ModalUpdater.Provider value={setModal}>
            {children}
        </ModalUpdater.Provider>
    </ModalContext.Provider>
}