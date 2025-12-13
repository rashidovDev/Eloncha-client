import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { RootState } from '../../store/store'
import { hideToggleModal } from '../../store/slices/toggleSlice';
import { ChildrenProps } from '../../types/types';

const ModalConfirm: React.FC<ChildrenProps> = (props) => {
    const dispatch = useDispatch();
    const modal: boolean = useSelector((state: RootState) => state.toggle.modalIsVisible) || false;

    return (
        <AnimatePresence>
            {
                modal && (
                          <div onClick={() => dispatch(hideToggleModal())} className="fixed inset-0 z-30 flex items-center
                           justify-center bg-black bg-opacity-50">
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className='bg-[#fff]  z-20 rounded-[10px] 
                             m-auto relative p-3
                             items-center justify-center flex'>
                            {props.children}
                        </motion.div>
                    </div>
                         
                )
            }
        </AnimatePresence> 
    );
};

export default ModalConfirm