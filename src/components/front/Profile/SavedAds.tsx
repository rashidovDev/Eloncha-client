import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSuccessMessage, showToggleImageModal } from '../../../store/slices/toggleSlice';
import { checkToken, GET, PUT } from '../../api/api';
import { toast } from 'react-toastify';
import { carAd } from '../../../types/types';
import CarAdCarousel from '../../utils/CarAdCarousel';
import BackToPrev from '../BackToPrev';
import { useAuth } from '../../Authcontext';

const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;

const SavedAds: React.FC = () => {
  const dispatch = useDispatch();
const [images, setImages] = useState<string[] | null>(null);
const {refetchUser} = useAuth();
const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['savedAds'],
    queryFn: getSavedAds,
  });

   async function getSavedAds (){
      await checkToken();
      const response : carAd[]  = await GET('/user/saved-ad')
      return response

    }


      async function deleteSaveAd(id: string) {
        await checkToken();
        const res = await PUT(`car/saved/` +id);
        await refetchUser()
      if (res) {
        queryClient.invalidateQueries({ queryKey: ["savedAds"] });
        dispatch(showSuccessMessage('Успешно удалено'));
        
        // Optionally, you can refetch the ads or update the state to reflect the deletion
      } else {
        toast.error("Не удалось удалить сохраненное объявление.");
      }}

      if (isLoading) return <p>Loading...</p>;
      if (isError) return <p>Error loading ads</p>;

  return (
    <div className="max-w-8xl mx-auto md:mt-10 mt-2 bg-white  rounded-xl">
      <BackToPrev />
     <h2 className="md:text-3xl text-2xl font-bold text-center text-blue-600">Сохраненные объявления</h2>
      {data && data.length === 0 ? (
        <div className="text-center text-gray-500">У вас нет cохраненные объявлений.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(data) && data.map(ad => (
            <div key={ad._id} className="border rounded-lg p-6 shadow relative hover:shadow-lg transition bg-gray-50">
              <div className="flex flex-col md:flex-col gap-4 ">
                 {ad.images?.length > 0 ? (
                                   <div>
                                     <img
                                       onClick={() => {
                                          setImages(ad.images)
                                          dispatch(showToggleImageModal())
                                       } }
                                       src={`${BASE_URL_IMAGE}/${ad.images[0]}`}
                                       alt={ad.title}
                                       className="w-full h-32 object-cover cursor-pointer rounded-md"
                                     />
                                     <CarAdCarousel images={images} />
                                   </div>
                                   
                                
                                 ) : (
                                   <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                                     Нет фото
                                   </div>
                                 )}
                <div className="flex-1">
                    <div className='py-3'>
                     <h3 className="text-lg font-semibold text-blue-700">{ad.title}</h3>
                  <p className="text-gray-600 mb-2">{ad.description}</p>
                    </div>
                  
                  <div className="text-blue-500 font-bold mb-2 absolute bottom-2">{ad.price.toLocaleString()} $</div>
                  <div className="flex gap-2 absolute bottom-3 right-2">
                    <button onClick={() => deleteSaveAd(ad._id)} className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAds;
