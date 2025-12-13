import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail } from 'react-feather';
import PremiumAd from './PremiumAd';
import { useParams } from 'react-router-dom';
import { carAd } from '../../../types/types';
import { checkToken, GET, POST, PUT } from '../../api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;
import CarAdCarousel from '../../utils/CarAdCarousel';
import { useDispatch } from 'react-redux';
import { openChatSheet, showToggleImageModal } from '../../../store/slices/toggleSlice';
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../Authcontext';
import { openChat } from '@/store/slices/chatSlice';
import { useLanguage } from '@/components/LanguageContext';

const TEXT = {
  model: { ru: "Модель", en: "Model", ko: "모델" },
  brand: { ru: "Бренд", en: "Brand", ko: "브랜드" },
  city: { ru: "Город", en: "City", ko: "도시" },
  year: { ru: "Год", en: "Year", ko: "연식" },
  mileage: { ru: "Пробег", en: "Mileage", ko: "주행거리" },
  km: { ru: "км", en: "km", ko: "km" },
  color: { ru: "Цвет", en: "Color", ko: "색상" },
  showContacts: { ru: "Показать контакты продавца", en: "Show seller contacts", ko: "판매자 연락처 보기" },
  hideContacts: { ru: "Скрыть контакты продавца", en: "Hide seller contacts", ko: "판매자 연락처 숨기기" },
  sellerContacts: { ru: "Контакты продавца", en: "Seller contacts", ko: "판매자 연락처" },
  writeSeller: { ru: "Написать продавцу", en: "Message seller", ko: "판매자에게 연락" },
  noPhotos: { ru: "Нет фото", en: "No photos", ko: "사진 없음" },
  priceCurrency: { ru: "KRW", en: "KRW", ko: "KRW" },
};

const ProductID = () => {
    const {id} = useParams();
     const {user, refetchUser} = useAuth()
    const [images, setImages] = useState<string[] | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [contactVisible, setContactVisible] = useState(false)
      const queryClient = useQueryClient();
      const { language } = useLanguage();

    const dispatch = useDispatch();

    const { data, isLoading, isError } = useQuery({
    queryKey: ['getCarAd'],
    queryFn: getCarAd,
  });

  async function getCarAd (){
    const response : carAd  = await GET('/car/' + id)
    return response
  }

   const likedCar = async (id?: string) => {
      try {
        await PUT(`car/liked/` +id);
        await refetchUser();
        queryClient.invalidateQueries({ queryKey: ["getCarAd"] });
        // Optionally, you can refetch the ads or update the state to reflect the incremented views
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    }
     const savedCar = async (id?: string) => {
      try {
        await PUT(`car/saved/` +id);
        await  refetchUser();
        queryClient.invalidateQueries({ queryKey: ["getCarAd"] });
        // Optionally, you can refetch the ads or update the state to reflect the incremented views
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    }

   const startChat = async (partnerId: string | undefined, ) => {
    checkToken()
  const res = await POST("/chat/start", { partnerId });

  dispatch(
    openChat({
      chatId: res.chatId,
      partner: {
      _id : res.partnerId,
      username : data?.user.username,
      email : data?.user.email
      }
      // or res.partnerId if that's what backend returns
    })
  );
dispatch(openChatSheet(true))
};

    console.log("FF:",data)


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading ads</p>;

    return (
        <>
       <div className="flex flex-col lg:flex-row justify-between w-full gap-6">

  {/* LEFT SIDE */}
  <div className="lg:w-[75%]  w-full">

    {/* HEADER */}
    <div className="my-4 flex justify-between items-center">
      <h1 className="text-2xl md:text-3xl font-bold">{data?.title}</h1>

      <div className="flex items-center space-x-3">
        {/* LIKE */}
        <span onClick={() => likedCar(data?._id)} className="cursor-pointer">
          {user?._id && data?.likes.includes(user._id)
            ? <FaHeart size={20} color="red" />
            : <FaRegHeart size={18} />}
        </span>

        {/* SAVE */}
        <span onClick={() => savedCar(data?._id)} className="cursor-pointer">
          {user?._id && data?._id && user.savedCar.includes(data._id)
            ? <FaBookmark size={20} />
            : <FaRegBookmark size={18} />}
        </span>
      </div>
    </div>

    {/* PRICE */}
    <p className="text-2xl font-semibold mb-3">{data?.price} {TEXT.priceCurrency[language]}</p>

    {/* INFO + IMAGES */}
    <div className="flex flex-col md:flex-row gap-6">

      {/* INFO */}
      <div className="md:w-[40%] w-full text-sm">

        <div className="flex justify-between py-2  mb-2 text-[14px] border-b">
          <span className="text-gray-500">{TEXT.model[language]}</span>
          <span>{data?.model}</span>
        </div>

        <div className="flex justify-between mb-2 text-[14px] py-2 border-b">
          <span className="text-gray-500">{TEXT.brand[language]}</span>
          <span>{data?.brand}</span>
        </div>

        <div className="flex justify-between mb-2 text-[14px] py-2 border-b">
          <span className="text-gray-500">{TEXT.city[language]}</span>
          <span>{data?.city}</span>
        </div>

        <div className="flex justify-between mb-2 text-[14px] py-2 border-b">
          <span className="text-gray-500">{TEXT.year[language]}</span>
          <span>{data?.yearOfProduce}</span>
        </div>

        <div className="flex justify-between py-2 border-b mb-2 text-[14px]">
          <span className="text-gray-500">{TEXT.mileage[language]}</span>
          <span>{data?.mileage} {TEXT.km[language]}</span>
        </div>

        <div className="flex justify-between mb-2 text-[14px] py-2 ">
          <span className="text-gray-500">{TEXT.color[language]}</span>
          {/* <span>{data?.color || "—"}</span> */}
        </div>

        {/* CONTACT BUTTON */}
        <div
          onClick={() => setContactVisible(!contactVisible)}
          className="mt-3 pt-3 border-t cursor-pointer flex items-center text-blue-500"
        >
          <span className="mr-1">
            {contactVisible ? TEXT.hideContacts[language] : TEXT.showContacts[language]}
          </span>
             {contactVisible ?   <ChevronUp size={16} /> : <ChevronDown size={16} />}  
        </div>

        <div className="mt-4">{data?.description}</div>
        {contactVisible && (
      <div className="mt-4 bg-blue-100 rounded-md p-5 w-full">
        <p className="text-gray-600">{TEXT.sellerContacts[language]}</p>

        <div className="text-lg font-semibold mt-2">
          +82 010 7538 2787
        </div>

        <div className="flex justify-center mt-3">
          <button onClick={() => {
          startChat(data?.user._id)
           
          } }   className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Mail size={14} />
            <span>{TEXT.writeSeller[language]}  <span className='font-semibold text-md'>{data?.user.username}</span></span>
          </button>
        </div>
      </div>
    )}
      </div>

      {/* IMAGES SECTION */}
      <div className="w-full md:w-[60%] flex justify-center">
        <div className="w-full lg:w-[80%] space-y-4">

          {data?.images?.length ? (
            <>
              {/* MAIN IMAGE */}
              <div className="overflow-hidden rounded-xl shadow bg-gray-100">
                <img
                  src={`${BASE_URL_IMAGE}/${selectedImage || data.images[0]}`}
                  onClick={() => {
                    setImages(data?.images);
                    dispatch(showToggleImageModal());
                  }}
                  className="w-full aspect-[4/3] object-cover cursor-pointer hover:scale-[1.02] transition"
                />
              </div>

              {/* CAROUSEL */}
              <CarAdCarousel images={images} />

              {/* THUMBNAILS */}
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {data.images.slice(1).map((image, i) => (
                  <div
                    key={i}
                    className={`rounded-md overflow-hidden border cursor-pointer
                      ${selectedImage === image
                        ? "border-blue-500 ring-1 ring-blue-500"
                        : "border-gray-200 hover:border-gray-400"}
                    `}
                  >
                    <img
                      src={`${BASE_URL_IMAGE}/${image}`}
                      className="h-20 w-full object-cover hover:opacity-80 transition"
                      onClick={() => setSelectedImage(image)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
              {TEXT.noPhotos[language]}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* CONTACT INFO */}
    

  </div>

  {/* RIGHT SIDE (PREMIUM ADS) */}
  <div className="hidden lg:flex w-[25%] mt-8">
    <PremiumAd title="Похожие объявления" />
  </div>

</div>

        </>
        
    )
}

export default ProductID
