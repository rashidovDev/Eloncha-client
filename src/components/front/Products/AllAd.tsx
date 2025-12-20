import { useMemo, useState } from 'react'
import { Eye } from 'react-feather'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { carAd } from '../../../types/types';
import getTimeAgo from '../../../helpers/getTimeAgo';
import { checkToken, GET, PUT } from '../../api/api';
import CarAdCarousel from '../../utils/CarAdCarousel';
import { useDispatch } from 'react-redux';
import { showToggleImageModal } from '../../../store/slices/toggleSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../../Authcontext';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '@/components/LanguageContext';
import { TRANSLATE } from '@/utils/const';
import Filter, { AdvancedFilterState } from '../Filter';
import { Skeleton } from "@/components/ui/skeleton"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"



const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;


const ADS_PER_PAGE = 12;

const SkeletonFilter = () => (
  <div className="w-full bg-white rounded-2xl shadow-sm border px-4 py-4 my-1 mb-5 space-y-3">
    <Skeleton className="h-4 w-32" />
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Skeleton key={idx} className="h-8 w-full rounded-full" />
      ))}
    </div>
  </div>
);

const SkeletonCards = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
    {Array.from({ length: ADS_PER_PAGE }).map((_, idx) => (
      <div key={idx} className="w-full bg-white rounded-md flex flex-col gap-3 p-2">
        <Skeleton className="w-full h-28 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const AllAd = () => {
  const [images, setImages] = useState<string[] | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AdvancedFilterState>({
    city: "All",
    brand: "All",
    minPrice: "",
    maxPrice: "",
  });
    const {user, refetchUser} = useAuth()
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
    const { language} = useLanguage();

  const translateCity = (city: string) => {
  if (TRANSLATE.city[city as keyof typeof TRANSLATE.city]) {
    return TRANSLATE.city[city as keyof typeof TRANSLATE.city][language];
  }
  return city; // if city not in dictionary → show original
};

  const incrementViews = async (id: string) => {
    try {
      await PUT(`car/view/` +id);
      queryClient.invalidateQueries({ queryKey: ["myCarAds"] });
   
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

   const likedCar = async (id? : string) => {
    try {
      await checkToken()
      await PUT(`car/liked/` + id);
      await refetchUser();
      queryClient.invalidateQueries({ queryKey: ["myCarAds"] });
      
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['myCarAds'],
    queryFn: getMyCarAds,
  });


  async function getMyCarAds (){
    const response : carAd[]  = await GET('/car/cars')
    
    return response
  }

  const ads = Array.isArray(data) ? data : [];
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ads.forEach((ad) => {
      counts[ad.city] = (counts[ad.city] || 0) + 1;
    });
    return counts;
  }, [ads]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ads.forEach((ad) => {
      const brandLabel = ad.brand || "Unknown";
      counts[brandLabel] = (counts[brandLabel] || 0) + 1;
    });
    return counts;
  }, [ads]);

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const matchesCity = filters.city === "All" || ad.city === filters.city;
      const matchesBrand = filters.brand === "All" || ad.brand === filters.brand;
      const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
      const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
      const matchesMin = minPrice === null || ad.price >= minPrice;
      const matchesMax = maxPrice === null || ad.price <= maxPrice;
      return matchesCity && matchesBrand && matchesMin && matchesMax;
    });
  }, [ads, filters]);

  if (isError) return <p>Error loading ads</p>;

  const totalPages = Math.max(1, Math.ceil(filteredAds.length / ADS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * ADS_PER_PAGE;
  const currentAds = filteredAds.slice(startIndex, startIndex + ADS_PER_PAGE);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, idx) => idx + 1);

  return (
   <div className=' w-full my-2 flex flex-col min-h-[600px]'>
    {isLoading ? (
      <SkeletonFilter />
    ) : (
      <Filter
        filters={filters}
        onApplyFilters={(nextFilters) => {
          setPage(1);
          setFilters(nextFilters);
        }}
        cityCounts={cityCounts}
        brandCounts={brandCounts}
      />
    )}
  <div className='flex-1 w-full relative pb-16'>
    {isLoading ? (
      <SkeletonCards />
    ) : currentAds.length === 0 ? (
      <div className='flex flex-col items-center justify-center w-full h-full py-10 text-center text-gray-500'>
        <p className='text-lg font-semibold'>
          {language === "ru" ? "Объявления не найдены" : language === "ko" ? "광고를 찾을 수 없습니다" : "No ads found"}
        </p>
        <p className='text-sm text-gray-400'>
          {language === "ru" ? "Попробуйте выбрать другой город" : language === "ko" ? "다른 도시를 선택해 보세요" : "Try a different city"}
        </p>
      </div>
    ) : (
      <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4'>
        {currentAds.map((ad, index) => (
          <div
            key={`${ad._id}-${index}`}
            className='w-full bg-white rounded-md flex flex-col justify-between mb-3'
          >
            {/* IMAGE */}
            <div className='w-full mb-2'>
              {ad.images?.length > 0 ? (
                <div>
                  <img
                    onClick={() => {
                      setImages(ad.images);
                      dispatch(showToggleImageModal());
                    }}
                    src={`${BASE_URL_IMAGE}/${ad.images[0]}`}
                    alt={ad.title}
                    className='w-full h-28 object-cover cursor-pointer rounded-md'
                  />
                </div>
              ) : (
                <div className='w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-lg rounded-md'>
                  Нет фото
                </div>
              )}
            </div>

            {/* TITLE & DESCRIPTION */}
            <div className='mb-2'>
              <div className='flex justify-between items-center'>
                <h1 className='font-bold text-blue-500 text-lg'>{ad.title}</h1>
                <div className='flex gap-4 items-center'>
                  <div className='flex items-center'>
                    <Eye size={12} color='#777' />
                    <span className='ml-1 text-[10px]'>{ad.views}</span>
                  </div>
                  <div className='flex items-center cursor-pointer' onClick={() => likedCar(ad._id)}>
                    {user?.likedCar?.includes(ad._id) ? (
                      <FaHeart color='red' size={12} />
                    ) : (
                      <FaRegHeart size={12} />
                    )}
                    <span className='ml-1 text-[10px]'>{ad.likes.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRICE & CREATED AT */}
            <div className='text-[14px] flex justify-between items-center text-gray-700 mt-auto my-1'>
              <div>
                <span className='font-bold'>{ad.price} krw</span>
              </div>
              <div>{translateCity(ad.city)}</div>
            </div>

            {/* LINK */}
            <div className='mt-1 flex justify-between items-center'>
              <div className='text-[12px] text-gray-500 mt-1'>
                {ad?.createdAt ? getTimeAgo(ad.createdAt) : 'Unknown date'}
              </div>
              <NavLink
                to={`/product/${ad._id}`}
                onClick={() => incrementViews(ad._id)}
                className='text-[13px] px-2 py-1 bg-primary rounded-lg text-white'
              >
                {TRANSLATE.button[language]}
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  <div className='mt-auto pt-6'>
    <div className='flex justify-center'>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => goToPage(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => goToPage(pageNumber)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem >
            <PaginationNext
              onClick={() => goToPage(currentPage + 1)}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  </div>
  {images && <CarAdCarousel images={images} />}
</div>

  )
}

export default AllAd
