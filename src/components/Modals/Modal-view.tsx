import React from 'react'
import {AnimatePresence, motion} from "framer-motion"
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store';

interface ModalProps {
    width?: string | number;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {

    const filterIsVisible = useSelector((state : RootState) => state.toggle.filterCityIsVisible) || false
    return (
               <AnimatePresence>
{
    filterIsVisible && 

        <div style={{ width: props.width }}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                className='bg-[#fff] p-2 z-20 rounded-[10px] shadow-sm  m-auto relative  items-center justify-center flex'
            >
                {props.children}
            </motion.div>
        </div>
}
               </AnimatePresence>
    );
}

export default Modal
