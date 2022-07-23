import React from "react";

type RefreshRates = 24 | 30 | 48 | 59.9 | 60;

type Prop<T> = T | ((prev: T) => T);
type ContextUpdater<T> = (value: Prop<T>) => void;

export type Ctx<T extends void> = React.Context<T>;
export type CtxUpd<T extends void> = React.Context<ContextUpdater<T>>;
type Context<T> = T extends React.Context<infer U> ? U : never;

interface PropList {
    currentTime: number;
    newCurrentTime: number;
    volume: number;
    videoDuration: number;
    index: number;
    paused: boolean;
    muted: boolean;
    fullscreen: boolean;
    refreshRate: RefreshRates;
    movedTime: number;
    showControls: boolean;
};

export type CtxList = {
    readonly [key in keyof PropList]: Ctx<PropList[key]>;
};
export type CtxUpdList = {
    readonly [key in keyof PropList]: CtxUpd<PropList[key]>;
};

export declare function useContextHelper<Key extends keyof PropList>(key: Key): [
    Context<CtxList[Key]>,
    Context<CtxUpdList[Key]>
];

// export declare function useContextHelper<Key extends keyof ProppertyTypes>(key: Key): [
//     ContextList[Key] extends React.Context<infer U> ? U : never,
//     ContextUpdaterList[Key] extends React.Context<infer U> ? U : never
// ]