// Modules
import { useState, useId } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
// Custom modules
import str from "../../utils/strings";

export default function ExpandableContainer({
    children,
    id = "",
    title = "",
    initialOpen = false,
    variant = "",
}) {
    let [ isOpen, setOpen ] = useState(initialOpen);
    const key = useId();

    return <LayoutGroup id={id}>
        <motion.div layout className="expandable" id={variant}>
            <motion.div layout className="expandable__title" onClick={() => setOpen(prev => !prev)}>
                <span className="line">{title || str.capitalize(str.replaceSpaces(id))}</span>
            </motion.div>
            <AnimatePresence exitBeforeEnter>
                {isOpen && <motion.div layout key={key} className="expandable__container" id={id}>
                    {children}
                </motion.div>}
            </AnimatePresence>
        </motion.div>
    </LayoutGroup>
}