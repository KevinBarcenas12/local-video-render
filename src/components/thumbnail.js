import { motion } from "framer-motion";
import { useThumbnailContext } from "../context/thumbnails";

export default function Thumbnail({ index }) {
    const thumbnails = useThumbnailContext()[0];
    let src = thumbnails[index];

    return <motion.div className="thumbnail-container">
        <motion.img className="thumbnail" src={src} />
    </motion.div>
}