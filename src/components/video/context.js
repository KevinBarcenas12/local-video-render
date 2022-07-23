import React, { createContext, useState, useContext } from "react";

const CurrentTime       = createContext(0);
const Volume            = createContext(1);
const NewCurrentTime    = createContext(0);
const VideoDuration     = createContext(0);
const Index             = createContext(0);
const Muted             = createContext(false);
const Fullscreen        = createContext(false);
const Paused            = createContext(true);
const RefreshRate       = createContext(24);
const MovedTime         = createContext(0);
const ShowControls      = createContext(true);

const CurrentTimeUpdater    = createContext((value) => {});
const VolumeUpdater         = createContext((value) => {});
const NewCurrentTimeUpdater = createContext((value) => {});
const VideoDurationUpdater  = createContext((value) => {});
const IndexUpdater          = createContext((value) => {});
const MutedUpdater          = createContext((value) => {});
const FullscreenUpdater     = createContext((value) => {});
const PausedUpdater         = createContext((value) => {});
const RefreshRateUpdater    = createContext((value) => {});
const MovedTimeUpdater      = createContext((value) => {});
const ShowControlsUpdater   = createContext((value) => {});

/** @type {import("./types").CtxList} */
export const Context = {
    currentTime: CurrentTime,
    newCurrentTime: NewCurrentTime,
    volume: Volume,
    videoDuration: VideoDuration,
    index: Index,
    muted: Muted,
    fullscreen: Fullscreen,
    paused: Paused,
    refreshRate: RefreshRate,
    movedTime: MovedTime,
    showControls: ShowControls,
};
/** @type {import("./types").CtxUpdList} */
export const Updater = {
    currentTime: CurrentTimeUpdater,
    newCurrentTime: NewCurrentTimeUpdater,
    muted: MutedUpdater,
    videoDuration: VideoDurationUpdater,
    index: IndexUpdater,
    volume: VolumeUpdater,
    fullscreen: FullscreenUpdater,
    paused: PausedUpdater,
    refreshRate: RefreshRateUpdater,
    movedTime: MovedTimeUpdater,
    showControls: ShowControlsUpdater,
};

/** @type {import("./types").useContextHelper} */
export function useContextHelper(key) {
    return [
        useContext(Context[key]),
        useContext(Updater[key]),
    ];
}

function ContextProvider({ Value, Updater, Hook, children }) {
    let [ value, setter ] = Hook
    return <Value.Provider value={value}>
        <Updater.Provider value={setter}>
            {children}
        </Updater.Provider>
    </Value.Provider>
}

/**
 * @typedef {JSX.Element | JSX.Element[] | string | number | symbol} Children
 * @typedef {import("./types").CtxList} ContextList
 * @param {{
 *  element: ContextList;
 *  children: Children;
 * }} param0 
 * @returns {JSX.Element}
 */
function Content({ element, children }) {
    if (element == null) return null;
    const keys = Object.keys(element);

    for (let key of keys) {
        let { [key]: current, ...object } = element;
        return <ContextProvider
            Hook={current[0]}
            Value={current[1]}
            Updater={current[2]}
        >
            {keys.length > 1 ? <Content element={object} children={children} /> : children}
        </ContextProvider>
    }
}

export function VideoContextProvider({ children }) {
    const isFullscreen = document.fullscreenElement != null;
    /** @type {ContextList} */
    const context = {
        currentTime: [useState(0.001), CurrentTime, CurrentTimeUpdater],
        newCurrentTime: [useState(0), NewCurrentTime, NewCurrentTimeUpdater],
        volume: [useState(1), Volume, VolumeUpdater],
        videoDuration: [useState(0), VideoDuration, VideoDurationUpdater],
        muted: [useState(false), Muted, MutedUpdater],
        paused: [useState(true), Paused, PausedUpdater],
        fullscreen: [useState(isFullscreen), Fullscreen, FullscreenUpdater],
        index: [useState(0), Index, IndexUpdater],
        refreshRate: [useState(24), RefreshRate, RefreshRateUpdater],
        movedTime: [useState(0), MovedTime, MovedTimeUpdater],
        showControls: [useState(true), ShowControls, ShowControlsUpdater],
    };

    return <Content element={context}>
        {children}
    </Content>
}