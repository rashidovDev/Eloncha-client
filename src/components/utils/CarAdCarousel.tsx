// CarAdCarousel.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { AnimatePresence, motion } from 'framer-motion';
import { hideToggleImageModal } from '../../store/slices/toggleSlice';

type Props = {
  images: string[] | null;
};

const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;

export default function CarAdCarousel({ images }: Props) {
  console.log("CarAdCarousel images:", images);
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.toggle.modalImageIsVisible);

  return (
    <AnimatePresence>
  {modal && (
    <motion.div
      key="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={() => dispatch(hideToggleImageModal())}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      <motion.div
        key="modal-box"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl  shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
      >

        {/* CLOSE BUTTON */}
        <button
          onClick={() => dispatch(hideToggleImageModal())}
          className="absolute w-6 h-6 top-3 right-3 flex justify-center items-center
           cursor-pointer z-50 bg-black/10 text-white rounded-full p-1 hover:bg-black transition"
        >
          ✕
        </button>

        {/* CAROUSEL */}
        <Swiper
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="w-full h-[75vh]"
        >
          {Array.isArray(images) &&
            images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <img
                    src={`${BASE_URL_IMAGE}/${img}`}
                    alt={`Car image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

  );
}
