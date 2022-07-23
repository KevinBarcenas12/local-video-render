// Modules
import { useId } from "react";
import { motion } from "framer-motion";
// components
import { ElementAnimation } from "../../utils/animations";

/**
 * @param {{
 *  children: any;
 *  duration: number;
 *  className?: string;
 *  id?: string;
 *  superClass?: string;
 *  animate: "width" | "height"
 * }} param0 
 * @returns {JSX.Element}
 */
export default function Element({
    children,
    duration: dur = 1,
    className = undefined,
    id = undefined,
    animate = "width",
    superClass = undefined,
}) {
    let key = useId();

    return <motion.div
        className={`element${superClass ? ` ${superClass}` : ""}`}
        initial="initial"
        animate="animate"
        exit="exit"
        key={key}
        variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: .125, when: "beforeChildren" } },
            exit: { opacity: 0, transition: { duration: .125, when: "afterChildren" } },
        }}
    >
        <motion.div className={`element__content${className ? ` ${className}` : ""}`} id={id}>{children}</motion.div>
        <motion.div className="animation back-panel" variants={ElementAnimation(dur, true, animate)} />
        <motion.div className="animation front-panel" variants={ElementAnimation(dur, false, animate)} />
    </motion.div>
}