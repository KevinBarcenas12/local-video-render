// Modules
import { Fragment } from "react";
// Components
import Player from "./components/player";
import Modal from "./components/modal";
import Input from "./components/input";
import Frame from "./components/animated/frame";

export default function Layout() {

    return <Fragment>
        <Frame animationDuration={1} id="main-container">
            <Input />
            <Player />
        </Frame>
        <Modal />
    </Fragment>
}