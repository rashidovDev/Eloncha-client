import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { RootState } from '../../store/store'
import { hideSuccessMessage} from '../../store/slices/toggleSlice';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Modal: React.FC = () => {
    const dispatch = useDispatch();
    const successMessageIsVisible : boolean = useSelector((state: RootState) => state.toggle.successMessageIsVisible) || false;
    const successMessage: string | null = useSelector((state: RootState) => state.toggle.successMessage) || null;

    setTimeout(() => {
        if (successMessageIsVisible) {
            dispatch(hideSuccessMessage());
        }
    }, 1800); // Hide after 3 seconds

    return (
       <AnimatePresence>
  {successMessageIsVisible && (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-20"
      onClick={() => dispatch(hideSuccessMessage())}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        key="modal-box"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="bg-white z-20 rounded-[10px] m-auto relative p-3 items-center justify-center flex"
      >
      <div className='flex flex-col items-center justify-center p-3 '>
     
     <DotLottieReact
      src="/animations/Success.lottie"
      autoplay
      loop={false}
      style={{ width: '100px', height: '100px'}}
    />
    <div className='text-[20px]'>
      {successMessage || 'Success'}
     </div>
      </div>
      
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    );
};

export default Modal