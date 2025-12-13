import { FC, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../../api/api";
import { carAd } from "../../../types/types";
import { NavLink } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;

interface TitleProps {
  title: string;
}

const PremiumSkeleton: FC<TitleProps> = ({ title }) => (
  <div className="flex flex-col gap-4">
    <div className="bg-gradient-to-r from-primary/80 to-primary/40 text-white px-4 py-2 rounded-md shadow">
      <h2 className="font-semibold text-lg">{title}</h2>
    </div>

    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="flex items-center gap-4 bg-white/70 backdrop-blur rounded-xl shadow p-3 border border-gray-100"
      >
        <Skeleton className="w-[90px] h-[70px] rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);

const PremiumAd: FC<TitleProps> = ({ title }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["premiumCarAds"],
    queryFn: async () => {
      const response: carAd[] = await GET("/car/cars");
      return response;
    },
  });

  const ads = Array.isArray(data) ? data : [];

  const randomAds = useMemo(() => {
    const shuffled = [...ads].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [ads]);
  if (isLoading) return <PremiumSkeleton title={title} />;

  if (isError || !ads.length)
    return (
      <div className="text-sm text-gray-500 text-center">
        No premium ads found.
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-primary to-primary/60 text-white px-4 mt-3 py-2 rounded-md shadow-sm flex items-center justify-between">
        <h2 className="font-semibold text-lg ">{title}</h2>
        <span className="text-xs opacity-90">
          {randomAds.length} recommended
        </span>
      </div>

      {/* Cards */}
      {randomAds.map((ad, i) => (
        <NavLink key={ad._id + i} to={`/product/${ad._id}`}>
          <div
            className="
              flex gap-4 bg-white rounded-xl shadow-sm p-3 
              border border-gray-100 hover:shadow-md
              transition-all duration-200 hover:-translate-y-[2px]
              cursor-pointer backdrop-blur-sm
            "
          >
            {/* IMAGE */}
            <div className="w-[90px] h-[70px] rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <img
                src={
                  ad.images?.length
                    ? `${BASE_URL_IMAGE}/${ad.images[0]}`
                    : "/placeholder.png"
                }
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 justify-between">
              {/* TOP ROW */}
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {ad.title}
                </span>

                <span className="text-[13px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md whitespace-nowrap shadow-sm">
                  {ad.price} krw
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="flex justify-between">

              <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                {ad.description?.slice(0, 90) || "No description available"}
              </p>
              <p className="text-sm font-semibold text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                {ad.city || "No description available"}
              </p>
              </div>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default PremiumAd;
