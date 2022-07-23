import { createContext, useContext, useState } from "react";

const ShowPlayerContext = createContext();
const ShowPlayerUpdater = createContext();

/**
 * @typedef {boolean} ContextType
 * @returns {[
 *  ContextType,
 *  (prop: ContextType) => void
 * ]}
 */
export function useShowPlayerContext() {
    return [
        useContext(ShowPlayerContext),
        useContext(ShowPlayerUpdater),
    ];
}

export default function ShowPlayerContextProvider({ children }) {
    let [ showPlayer, setShowPlayer ] = useState(false);

    return <ShowPlayerContext.Provider value={showPlayer}>
        <ShowPlayerUpdater.Provider value={setShowPlayer}>
            {children}
        </ShowPlayerUpdater.Provider>
    </ShowPlayerContext.Provider>
}