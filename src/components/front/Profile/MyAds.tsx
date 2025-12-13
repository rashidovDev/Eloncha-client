import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { checkToken, DELETE, GET, PUT } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { carAd } from '../../../types/types';
import { toast } from 'react-toastify';
import BackToPrev from '../BackToPrev';
import CarAdCarousel from '../../utils/CarAdCarousel';
import { useDispatch } from 'react-redux';
import Success from '../../utils/Success';
import { showSuccessMessage, showToggleImageModal, showToggleModal, toggleModal } from '../../../store/slices/toggleSlice';
import { Plus, PlusCircle } from 'react-feather';


const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;

const MyAds: React.FC = () => {
const dispatch = useDispatch();
const [images, setImages] = useState<string[] | null>(null);
const queryClient = useQueryClient();

const { data, isLoading, isError } = useQuery({
    queryKey: ['myCarAds'],
    queryFn: getMyCarAds,
  });

  async function getMyCarAds (){
    await checkToken();
    const response : carAd[]  = await GET('/car/car-user')
    return response
  }

  async function deleteCarAd (id: string) {
  await checkToken();
  const res = await DELETE('/car/delete-ad/' + id)
  if (res) {
    queryClient.invalidateQueries({ queryKey: ["myCarAds"] });
    dispatch(showSuccessMessage('Объявление успешно удалено'));
    
    // Optionally, you can refetch the ads or update the state to reflect the deletion
  } else {
    toast.error("Failed to delete ad");
  }}


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading ads</p>;

  return (
 <div className="w-full mx-auto mt-3">

 
  <BackToPrev/>
  <div className='border-b-2 border-gray-300 mb-4 pb-2'>

  
  </div>

  <div className="relative mb-8 ">
    <div className='flex justify-between items-center'>

    <h2 className="md:text-3xl text-2xl font-bold
     text-center text-blue-600">Мои объявления</h2>
    <NavLink
      to="/profile/add-ads"
      className=" flex items-center bg-blue-600 hover:bg-blue-700 p-2 rounded-xl
       text-[#fff] transition duration-200 text-[12px]"
    >
   <button className="flex items-center main-bg rounded-md">
      <PlusCircle size={18} className='mr-1' />
      <div className=''>Add Adminstrator</div>
   </button>
    </NavLink>
    </div>
  </div>

  {data?.length === 0 ? (
    <div className="text-center text-gray-500 text-lg">У вас нет объявлений.</div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.isArray(data) && data.map(ad => (
        <div  key={ad._id} className="bg-white rounded-xl shadow-md hover:shadow-xl
         transition duration-300 overflow-hidden">
         
          {/* Image */}
          {ad.images?.length > 0 ? (
            <div>
              <img
                onClick={() => {
                   setImages(ad.images)
                   dispatch(showToggleImageModal())
                }}
                src={`${BASE_URL_IMAGE}/${ad.images[0]}`}
                alt={ad.title}
                className="w-full h-36 object-cover cursor-pointer"
              />
              <CarAdCarousel images={images}/>
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
              Нет фото
            </div>
          )}

          {/* Content */}
          <div className="p-2">
          <div className='flex justify-between items-center mb-2'>

            <h3 className="text-xl font-semibold text-blue-700 mb-2">{ad.title}</h3>

              <NavLink
                to={`/profile/add-ads/${ad._id}`}
                
              >
                <div className="flex items-center justify-center bg-blue-500
                 hover:bg-blue-600 text-white
                 p-1 rounded-lg text-sm text-center">

                Редактировать
                </div>
              </NavLink>
          </div>
            <div className="md:flex justify-between items-center mb-2">
            <div className='flex md:block justify-between'>
            <div className="text-sm text-gray-500 mb-2">{ad.brand}</div>
            <div className="text-sm text-gray-500 mb-2">{ad.model}</div>
            </div>
            <div>

            <div className="text-sm text-gray-600 mb-2">
              {ad.yearOfProduce} · {ad.mileage.toLocaleString()} км · {ad.city}
            </div>
            <div className="text-blue-600 font-bold text-lg mb-2">{ad.price.toLocaleString()} KRW</div>
            </div>
            </div>
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">{ad.description}</p>

            {/* Meta Info */}
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>👁 {ad.views}</span>
              <span>❤️ {ad.likes?.length ?? 0}</span>
              <span>
                📅 {ad.createdAt?.year}-{String(ad.createdAt?.month).padStart(2, '0')}-{String(ad.createdAt?.day).padStart(2, '0')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center gap-2">


               <button
              onClick={ async () => {
                  const res = await PUT(`/car/update-status/` + ad._id);
                  if(res){
                    queryClient.invalidateQueries({ queryKey: ["myCarAds"] });
                    
                    dispatch(showSuccessMessage('Объявление успешно опубликовано'));
                    // toast.success('Объявление успешно опубликовано')
                  }else{
                    toast.error('Ошибка при публикации объявления')
                  }

                  0 
                }}
  className="flex-1 bg-green-500 justify-center items-center hover:bg-green-600 text-white py-1 h-[40px] rounded-lg text-sm"
>
  {ad.isPosted ? 'Снять с публикации'  :  'Опубликовать'} 
</button>
              <button
                onClick={() => deleteCarAd(ad._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 h-[40px] rounded-lg text-sm"
              >
                🗑 Удалить
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default MyAds;