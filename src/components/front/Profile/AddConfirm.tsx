import React from 'react'
import { carAd } from '../../../types/types'
import { XCircle } from 'react-feather'
import { toast } from 'react-toastify';
import { checkToken, DELETE } from '../../api/api';
import { useDispatch } from 'react-redux';
import { showToggleModal } from '../../../store/slices/toggleSlice';
import { NavLink } from 'react-router-dom';

interface AddConfirmProps {
  carAd?: carAd;
  adId?: string | null;
onClick? : () => void;
}
const AddConfirm : React.FC< AddConfirmProps > = ({carAd, adId, onClick}) => {

      const dispatch = useDispatch();
const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;
      async function deleteImage(filename: string) {
        if (!adId) {
          alert('No ad ID found.');
          return;
        }
        try {
          await checkToken()
          const response = await DELETE(`/car/${adId}/delete-image`, { filename });
          if (response) {
            toast.success('Изображение успешно удалено');
          } else {
            toast.error('Ошибка при удалении изображения');
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          toast.error('Ошибка при удалении изображения');
        }
      }
  return (


    <div className='w-full md:p-5'>
        

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Заголовок :</div>
        <div className='px-2'>{carAd?.title}</div>
    </div>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Бренд :</div>
        <div className='px-2'>{carAd?.brand}</div>
    </div>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Модель :</div>
        <div className='px-2'>{carAd?.model}</div>
    </div>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Год производства :</div>
        <div className='px-2'>{carAd?.yearOfProduce}</div>
    </div>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Пробег (км) :</div>
        <div className='px-2'>{carAd?.mileage}</div>
    </div>
      <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Город :</div>
        <div className='px-2'>{carAd?.city}</div>
    </div>

    <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Описание :</div>
        <div className='px-2'>{carAd?.description}</div>
    </div>

    <div className='flex  items-center my-2'>
        <div className='font-bold px-2'>Цена (в вонах) :</div>
        <div className='px-2'>{carAd?.price}</div>
    </div>

        </div>
         <div className='font-bold px-2 my-4'>Изображения</div>
        <div className='grid grid-cols-3 md:grid-cols-4 md:w-1/2 mt-2'>
       

     {carAd?.images.map((img, idx) => (
             <div className='relative w-[100px] h-[100px] flex items-center justify-center' key={idx}>
          <div onClick={() => deleteImage(img)} className='absolute top-1 right-1 cursor-pointer' >
            <XCircle  size={16} color='#FF0000'/>
          </div>
          <img
            key={`carad-img-${idx}`}
            src={`${BASE_URL_IMAGE}${img}`} 
            alt={`carad-img-${idx}`}
            className="w-16 h-16 object-cover rounded border"
          />
            </div>
        ))}
        </div>
        
            <div className='flex justify-between'>
<div className={`  mt-5`}>
  <button
          onClick={onClick}
          className="md:py-2 md:px-4 px-2 py-1 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
        <NavLink to={`/profile/add-ads/${carAd?._id}`} className='text-white'>Редактировать</NavLink>
        </button>
        </div>

        <div className={`flex justify-start  mt-5`}>
  <button
          onClick={() => {
            dispatch(showToggleModal("PostAd"))
          }}
          className="md:py-2 md:px-4 px-2 py-1 bg-green-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        > 
      Oпубликовать
        </button>
        </div>
            </div>

    

    </div>
  )
}

export default AddConfirm
