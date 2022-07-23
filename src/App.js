// Modules
import React from "react";
// Context
import ModalContextProvider from "./context/modal";
import FileContextProvider from "./context/files";
import ShowPlayerContextProvider from "./context/showPlayer";
// Components
import Layout from "./layout";
import ThumbnailContextProvider from "./context/thumbnails";

// import "./index.css";
import "./assets/reset.css";
import "./assets/main.scss";
import "./assets/video.scss";
import "./assets/input.scss";
import "./assets/container.scss";
import "./assets/components/modal.scss";
import "./assets/components/animated.scss";
import "./assets/components/entry.scss";

const ContextProviders = ({ children }) => (
  <FileContextProvider>
    <ModalContextProvider>
      <ShowPlayerContextProvider>
        <ThumbnailContextProvider>
          {children}
        </ThumbnailContextProvider>
      </ShowPlayerContextProvider>
    </ModalContextProvider>
  </FileContextProvider>
);

const App = () => <ContextProviders>
  <Layout />
</ContextProviders>;

export default App;