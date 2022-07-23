// Modules
import { motion } from "framer-motion";
import { IoArrowBack as SelectionIcon } from "react-icons/io5";
// Custom Modules
import str from "../utils/strings";
// Components
import Thumbnail from "./thumbnail";

/**
 * @param {{
 *  fileData: {
 *      isValid: boolean;
 *      name: string;
 *      size: number;
 *  }
 * }} param0 
 * @returns
 */
const VideoEntry = ({ fileData, index, isCurrent, onClick }) => {

    const CurrentSelection = () => <motion.span layoutId="current-selection" className="current-selection">
        <SelectionIcon className="icon" />
    </motion.span>

    return <motion.div className={`video-entry${fileData.isValid ? "" : " invalid"}`} onClick={fileData.isValid ? onClick : () => {}}>
        <Thumbnail index={index} />
        <motion.div className="content">
            <motion.span className="line-block">File name: {fileData.name}</motion.span>
            <motion.span className="line-block">File title: {str.getTitle(fileData.name)}</motion.span>
            <motion.span className="line-block">File size: {str.getSize(fileData.size)}</motion.span>
        </motion.div>
        {isCurrent && <CurrentSelection />}
    </motion.div>
};

export default VideoEntry;