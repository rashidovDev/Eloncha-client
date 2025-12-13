import React, { useEffect, useRef, useState } from 'react';
import { checkToken, DELETE, GET, POST, PUT } from '../../api/api';
import { Brand, carAd, CarModel, City, FormDataAds } from '../../../types/types';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { FILE } from '../../api/frontApi';
import Modal from '../../Modals/Modal';
import { hideToggleModal, showSuccessMessage, showToggleModal } from '../../../store/slices/toggleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Delete, Plus, XCircle } from 'react-feather';
import { toast } from 'react-toastify';
  import { RootState } from '../../../store/store'
import AddConfirm from './AddConfirm';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const boxVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '0%', opacity: 0 },
};

const AddAds: React.FC = () => {
  const {id} = useParams()
  const [carAd, setCarAd] = useState<carAd>();
  const [cityOptions, setCityOptions] = useState<City>();
  // const [brandQuery, setBrandQuery] = useState<Brand>();
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [searchBrand, setSearchBrand] = useState('');
  const navigate = useNavigate();
  
  let adId = localStorage.getItem('adId');
  const carAdId = id || adId; // Use id from params or localStorage

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);

  const handleNext = () => setPage((prev) => (prev + 1) % 2); // toggle between 0 and 1
  const modalType = useSelector((state : RootState) => state.toggle.modalType);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, setValue
  } = useForm<FormDataAds>();

const mutation = useMutation({
  mutationFn: async (data: FormDataAds) => {
    if (id){
    await checkToken()
    const res =  await PUT('/car/update-ad/' + id, data);
      if (res) {
        navigate('/profile/my-ads');
      } else {
        toast.error('Ошибка при обновлении объявления');
      }
    }else {
      await checkToken();
      const res = await POST('/car/create', data);
      localStorage.setItem('adId', res.newCarAd._id);
    }
    },
    onSuccess: () => {
     
      setShowUpload(true);
      // reset();
    },
    onError: () => {
      alert('Something went wrong.');
    }
  });

  const onSubmit = (data: FormDataAds) => {
    mutation.mutate(data);
  };

  const getCity = async () => {
    try {
      const response : City = await GET('catalog/all-city');
      if (!response) {
        throw new Error('Network response was not ok');
      }
      setCityOptions(response);
      return response;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  async function fileUpload() {
    if (!carAdId || files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }
    await checkToken();
 await FILE(`/car/upload/${carAdId}`, files);
 await getCarAd()
    // After successful upload, add new previews to already uploaded previews
    setFiles([]); // Clear file input for next upload
    setPreviews([]);
  }

  async function getCarAd() {
    if(carAdId){
      await checkToken();
      const response : carAd = await GET('car/' + carAdId);
      setCarAd(response);
      console.log('Car Ad fetched:', response);
      await getCity(); 
        // setSearchBrand(response.brand);
        // setSearchModel(response.model);
        setValue('title', response.title);
        setValue('brand', response.brand);
        setValue('model', response.model);
        setValue('yearOfProduce', response.yearOfProduce);
        setValue('mileage', response.mileage);
        setValue('price', response.price);
        setValue('city', response.city);
        setValue('description', response.description);
    }else{
      return
    }
  }

  async function deleteImage(filename: string) {
    if (!carAdId) {
      alert('No ad ID found.');
      return;
    }
    try {
      await checkToken();
      const response = await DELETE(`/car/${carAdId}/delete-image`, { filename });
      if (response) {
        await getCarAd(); // Refresh car ad data after deletion
        dispatch(showSuccessMessage('Изображение успешно удалено'));
      } else {
        toast.error('Ошибка при удалении изображения');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Ошибка при удалении изображения');
    }
  }  
    const [suggestions, setSuggestions] = useState<Brand | undefined>();
    const [showBrandOptions, setShowBrandOptions] = useState(false);
    const [showModelOptions, setShowModelOptions] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    if (selectedBrand?.brand === searchBrand) return; 
    getCity()

    if (!searchBrand.trim()) {
      setSuggestions(undefined);
      return;
    }

    const delay = setTimeout(async ()  => {  
     const response : Brand = await GET(`catalog/brands?search=${searchBrand}`);
      if (!response) {
        throw new Error('Network response was not ok');
      }
      setSuggestions(response);
        setShowBrandOptions(true);
      
      // console.log('Brands fetched:', response);
      return response;
    }, 300);
    return () => clearTimeout(delay);  
    
    
  }, [searchBrand]);

  useEffect(() => {
  getCarAd()
  },[])

  const [models, setModels] = useState<CarModel | undefined>(undefined);
  const [searchModel, setSearchModel] = useState<string>('');

useEffect(() => {
  if (!selectedBrand) return;
  const fetchModels = async () => {
    if(selectedBrand){
      const res : CarModel = await GET(`catalog/models/` +
         selectedBrand._id + `?search=${searchModel}`);
      if (res) {
        setModels(res);
      }
    }else{
      return;
    }
  };

  fetchModels();
}, [selectedBrand, searchModel]);

  const handleSelectBrand = (brandName : string ) => {
    setSearchBrand(brandName);
    setValue("brand", brandName);
    setShowBrandOptions(false);
  };

   const handleSelectModel = (modelName : string ) => {
    setSearchModel(modelName);
    setValue("model", modelName); // update RHF form value
    setShowModelOptions(false);
  };

  return (
    <div className="max-w-5xl mx-auto md:mt-10 bg-white rounded-xl ">
      { 
        modalType === 'upload-images' ?
         <Modal height='auto' width='500px'>
        <div className="p-6  rounded-lg mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-blue-500">Загрузите изображения</h3>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const selectedFiles = Array.from(e.target.files);
                setFiles(selectedFiles);
                setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
              }
            }}
            accept=".jpg,.jpeg,.png,.heic"
            multiple
            className="block w-full text-sm file:py-2 file:px-4 file:rounded file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <button
            onClick={() => {
              fileUpload()
              dispatch(hideToggleModal())
            }}
            className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Добавить изображение
          </button>
        </div>
            </Modal> :
            modalType === 'PostAd' && <Modal height='auto' width='500px'>
              <div className='w-[90%]'>

              <h3 className="text-xl font-semibold mb-4 text-blue-500">Подтвердите объявление</h3>
              <p> Вы уверены, что хотите опубликовать это объявление?</p>
              <div className='flex justify-end mt-2 items-center'>

              <button
                onClick={() => {
                  dispatch(showSuccessMessage('Объявление сохранено в черновиках'));
                  dispatch(hideToggleModal());
                      localStorage.removeItem('adId');
                  navigate('/profile/my-ads');
                }}
                className="mt-4 py-2 px-3 mr-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
              >
                Сохранить в черновики
              </button>
               <button
                onClick={ async () => {
                  const res = await PUT(`/car/update-status/` + carAdId);
                  if(res){
                    dispatch(showSuccessMessage('Объявление успешно опубликовано'))
                    localStorage.removeItem('adId');
                  }else{
                    toast.error('Ошибка при публикации объявления')
                  }
                  dispatch(hideToggleModal());
                  
                  navigate('/')
                  
                }}
                className="mt-4 py-2 px-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
              >
                Oпубликовать
              </button>
              </div>
              </div>
            </Modal> 
      }
      <div className="relative w-full h-auto shadow-md p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={boxVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center text-xl"
          >
            {page === 0 ? <div className="w-full">
         
      <h2 className="text-2xl text-3xl font-bold
       mb-6 text-center text-blue-600">{!id ? 'Добавить объявление'
        : 'Изменить объявление'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Заголовок</label>
            <input
              {...register('title', { required: 'Заголовок обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Введите заголовок"
            />
            {errors.title?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-1">Бренд</label>
           <input
          {...register("brand", { required: "Бренд обязателен" })}
          value={searchBrand}
          onChange={(e) => {
            setSearchBrand(e.target.value);
            setValue("brand", e.target.value);
          }}
          onFocus={() => {
// setShowBrandOptions(true)
setShowModelOptions(false);
          } }

          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Например: Hyundai"
          autoComplete="off"
        />
        {errors.brand && (
          <div className="text-red-500 mt-2">{errors.brand.message}</div>
        )}

        {showBrandOptions  && suggestions && (
          <ul className={`absolute  w-[150px] text-start bg-white border mt-1 rounded z-10`}>
            {Array.isArray(suggestions) && suggestions.map((item, idx) => (
              <li
                key={idx + 1}
                onClick={() => {
                handleSelectBrand(item.brand)
                setSelectedBrand(item);
                } }
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {item.brand}
              </li>
            ))}
          </ul>
        )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-1">Модель</label>
            <input
              {...register('model', { required: 'Модель обязательна' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Например: Sonata"
              value={searchModel}
              onChange={(e) => {
            setSearchModel(e.target.value);
            setValue("model", e.target.value);
          }}
              onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(true);
          } }
            />
            {errors.model?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
             {showModelOptions  && models && (
          <ul className={`absolute  w-[150px] text-start  bg-white border mt-1 rounded z-10 overflow-auto max-h-60`}>
            {Array.isArray(models) && models.map((item, idx) => (
              <li
                key={idx + 1}
                onClick={() => handleSelectModel(item.model)}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {item.model}
              </li>
            ))}
          </ul>
        )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-1">Год производства</label>
            <input
              {...register('yearOfProduce', { required: 'Год обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Например: 2020"
               onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(false);
          } }
            />
            {errors.yearOfProduce?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>

          {/* Mileage */}
          <div>
            <label className="block text-sm font-medium mb-1">Пробег (км)</label>
            <input
              {...register('mileage', { required: 'Пробег обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Например: 50000"
                onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(false);
          } }
            />
            {errors.mileage?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">Город</label>
            <select
              {...register('city', { required: 'Город обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
                onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(false);
          } }
            >
              <option value="">Выберите город</option>
              {Array.isArray(cityOptions) && cityOptions.map(city => (
                <option key={city._id} value={city.cityNameEng}>
                  {city.cityNameEng} ({city.cityNameRu})
                </option>
              ))}
            </select>
            {errors.city?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            {...register('description', { required: 'Описание обязательно' })}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Подробное описание"
              onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(false);
          } }
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Цена (в вонах)</label>
          <input
            type="number"
            {...register('price', { required: 'Цена обязательна' })}
            className="w-full px-3 py-2 border rounded-lg"
              onFocus={() => {
setShowBrandOptions(false)
setShowModelOptions(false);
          } }
          />
          {errors.price?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
        </div>
        {carAd && Array.isArray(carAd.images) && carAd.images.length > 0 && (
  <div  className="flex flex-wrap gap-4 mt-4 relative">
 
      
     {carAd.images.map((img, idx) => (
         <div key={idx + 1} className='relative'>
      <div onClick={() => deleteImage(img)} className='absolute top-1 right-1 cursor-pointer' >
        <XCircle  size={16} color='#FF0000'/>
      </div>
      <img
        key={`carad-img-${idx}`}
        src={`http://localhost:5001/${img}`} // Adjust path if needed
        alt={`carad-img-${idx}`}
        className="w-16 h-16 object-cover rounded border"
      />
        </div>
    ))}
  </div>
)}
        {
          carAdId && (
            <div>
            <div className="flex justify-end ">
              <button
                type="button"
                onClick={() => dispatch(showToggleModal('upload-images'))}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 font-semibold
                   hover:bg-blue-100 hover:text-blue-800 transition shadow-sm`}
              >
                <span><Plus /></span>
                Добавить изображение
              </button>  
          </div>
              {/* <div className='text-red-500 mt-2 flex justify-end'>
Пожалуйста, добавьте хотя бы одно изображение</div> */}
          </div>
          )
        }

        {/* Submit Button */}
        { id ? 
          <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
       "Обновить объявление"
        </button> 
        : !adId &&
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
      Добавить объявление
        </button> 
        }
        
      </form>
            </div> : <AddConfirm onClick={handleNext} adId = {adId} carAd={carAd}/>}
          </motion.div>
        </AnimatePresence>
        {adId && !id && (
  <div className={`${page == 1 && 'hidden'} flex justify-end  mt-5`}>
  <button
          onClick={() => {
            if(carAd && carAd.images.length <= 0) {
              toast.error('Пожалуйста, добавьте хотя бы одно изображение');
              return;
            }
          handleNext();
      
           }}
          className="py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
        {page == 0 ? "Следующий" : "Предыдущий"}  
        </button>
        </div>
        )}
        
    
       
      </div>
    </div>
  );
};

export default AddAds;