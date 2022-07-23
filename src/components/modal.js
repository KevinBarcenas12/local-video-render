// Modules
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useModalContext } from "../context/modal";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
// Components
import Element from "./animated/element";

export default function Modal() {
    let [ modal, setModal ] = useModalContext();
    let [ shownModal, setShownModal ] = React.useState(modal);
    const removeModal = () => setModal(null);
    const key = {
        background: React.useId(),
        container: React.useId(),
        content: React.useId(),
        button: React.useId(),
    };
    
    React.useEffect(() => {
        if (modal == null) return;
        setShownModal(modal);
    }, [modal]);

    return <AnimatePresence>
        {modal && <motion.div
            key={key.background}
            className="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, when: "beforeChildren" } }}
            exit={{ opacity: 0, transition: { duration: 1, when: "afterChildren" } }}
        >
            <motion.div
                className="modal-container"
                key={key.container}
                initial={{ y: 100 }}
                animate={{ y: 0, transition: { when: "beforeChildren", duration: .5 } }}
                exit={{ y: 100, transition: { when: "afterChildren", duration: .5 } }}
            >
                <CloseIcon className="icon close-modal" onClick={removeModal} />
                <motion.div
                    className="modal-content"
                    key={key.content}
                    animate={{ transition: { when: "beforeChildren", duration: .25 } }}
                    exit={{ transition: { when: "afterChildren", duration: .25 } }}
                >
                    <Element duration={.5}>{shownModal}</Element>
                </motion.div>
            </motion.div>
        </motion.div>}
    </AnimatePresence>
}