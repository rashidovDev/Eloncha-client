import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { Button } from "../ui/button";
import { Check } from "react-feather";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const cities = [
  { en: "Seoul", ru: "Сеул", ko: "서울" },
  { en: "Busan", ru: "Пусан", ko: "부산" },
  { en: "Incheon", ru: "Инчхон", ko: "인천" },
  { en: "Daegu", ru: "Тэгу", ko: "대구" },
  { en: "Daejeon", ru: "Тэджон", ko: "대전" },
  { en: "Gwangju", ru: "Кванджу", ko: "광주" },
  { en: "Suwon", ru: "Сувон", ko: "수원" },
  { en: "Ulsan", ru: "Ульсан", ko: "울산" },
  { en: "Jeonju", ru: "Чонджу", ko: "전주" },
  { en: "Jeju", ru: "Чеджу", ko: "제주" },
];

interface FilterProps {
  filters: AdvancedFilterState;
  onApplyFilters: (filters: AdvancedFilterState) => void;
  cityCounts?: Record<string, number>;
  brandCounts?: Record<string, number>;
}

export type AdvancedFilterState = {
  city: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
};

const Filter = ({
  filters,
  onApplyFilters,
  cityCounts = {},
  brandCounts = {},
}: FilterProps) => {
  const { language } = useLanguage();
  const [localFilters, setLocalFilters] = useState<AdvancedFilterState>(filters);

  const cityLabelKey: "ru" | "ko" | "en" =
    language === "ru" ? "ru" : language === "ko" ? "ko" : "en";
  const totalAds = Object.values(cityCounts).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const brandOptions = useMemo(() => {
    return Object.keys(brandCounts).sort((a, b) => a.localeCompare(b));
  }, [brandCounts]);

  const getCityLabel = (cityEn: string) => {
    const foundCity = cities.find((item) => item.en === cityEn);
    if (!foundCity) return cityEn;
    return foundCity[cityLabelKey as keyof typeof foundCity];
  };

  const handleLocalChange = (key: keyof AdvancedFilterState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const placeholders = {
    city:
      language === "ru"
        ? "Выберите город"
        : language === "ko"
        ? "도시 선택"
        : "Select city",
    brand:
      language === "ru"
        ? "Выберите бренд"
        : language === "ko"
        ? "브랜드 선택"
        : "Select brand",
    minPrice:
      language === "ru"
        ? "Мин. цена"
        : language === "ko"
        ? "최소 가격"
        : "Min price",
    maxPrice:
      language === "ru"
        ? "Макс. цена"
        : language === "ko"
        ? "최대 가격"
        : "Max price",
    apply:
      language === "ru"
        ? "Применить фильтры"
        : language === "ko"
        ? "필터 적용"
        : "Apply filters",
  };

  const heroCopy = useMemo(() => {
    if (language === "ru") {
      return {
        badge: "Надежная площадка по всей Корее",
        title: "Найдите свой автомобиль в Корее",
        subtitle:
          "Сравнивайте проверенные объявления, настраивайте бюджет и ищите по городам без лишних отвлечений.",
        chips: ["Мобильный комфорт", "Плавный переход к фильтрам", "Премиальный стиль"],
      };
    }
    if (language === "ko") {
      return {
        badge: "한국 전역 신뢰받는 마켓플레이스",
        title: "한국에서 원하는 차를 찾으세요",
        subtitle:
          "검증된 매물을 비교하고 예산을 설정해 원하는 도시를 깔끔하게 탐색하세요.",
        chips: ["모바일 우선", "필터로 자연스럽게 이동", "프리미엄 자동차 감성"],
      };
    }
    return {
      badge: "Trusted marketplace coverage across Korea",
      title: "Find Your Car in Korea",
      subtitle:
        "Compare verified listings, set your price range, and explore top cities with a clean, focused search experience.",
      chips: ["Mobile-first comfort", "Smooth transitions into filters", "Premium automotive feel"],
    };
  }, [language]);

  return (
    <div className="w-full space-y-4 mb-5">
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-200/60">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80"
            alt="Sleek car on a modern road"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/30" />
        </div>
        <div className="relative flex flex-col gap-3 md:gap-4 p-5 sm:p-6 md:p-8 min-h-[180px] md:min-h-[220px] justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            {heroCopy.badge}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight">
              {heroCopy.title}
            </h2>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl">{heroCopy.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
            {heroCopy.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-white/10 px-3 py-1 border border-white/10">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-white md:rounded-2xl rounded-xl shadow-sm border px-4 md:py-3 py-2 my-1">
        <div className="md:flex  gap-2 items-end pb-1 justify-between">
          {/* <p className="text-xs text-gray-500 min-w-[180px]">
            {language === "ru"
              ? "Настройте фильтры и нажмите проверку"
              : language === "ko"
              ? "필터 설정 후 확인을 누르세요"
              : "Adjust filters, then hit check"}
          </p> */}
          <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-5 gap-3">

            <div className="md:min-w-[220px] shrink-0">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {language === "ru" ? "Город" : language === "ko" ? "도시" : "City"}
              </p>
              <Select
                value={localFilters.city}
            onValueChange={(value) => handleLocalChange("city", value)}
          >
            <SelectTrigger className="w-full md:h-8 h-6">
              <SelectValue placeholder={placeholders.city} />
            </SelectTrigger>
            <SelectContent className="bg-white ">
              <SelectItem value="All">
                {language === "ru" ? "Все города" : language === "ko" ? "전체" : "All"} ({totalAds})
              </SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.en} value={city.en}>
                  {getCityLabel(city.en)} ({cityCounts[city.en] || 0})
                </SelectItem>
              ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:min-w-[220px] shrink-0">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {language === "ru" ? "Марка" : language === "ko" ? "브랜드" : "Brand"}
              </p>
              <Select
                value={localFilters.brand}
            onValueChange={(value) => handleLocalChange("brand", value)}
          >
            <SelectTrigger className="w-full md:h-8 h-6">
              <SelectValue placeholder={placeholders.brand} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="All">
                {language === "ru" ? "Все бренды" : language === "ko" ? "전체" : "All"} (
                {Object.values(brandCounts).reduce((sum, count) => sum + count, 0)})
              </SelectItem>
              {brandOptions.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand} ({brandCounts[brand] || 0})
                </SelectItem>
              ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[160px] shrink-0">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {placeholders.minPrice}
              </p>
              <input
                type="number"
            inputMode="numeric"
            className="w-full md:h-8 h-6 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="0"
            value={localFilters.minPrice}
            onChange={(e) => handleLocalChange("minPrice", e.target.value)}
              />
            </div>

            <div className="min-w-[160px] shrink-0">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {placeholders.maxPrice}
              </p>
              <input
                type="number"
            inputMode="numeric"
            className="w-full md:h-8 h-6 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="100000"
            value={localFilters.maxPrice}
            onChange={(e) => handleLocalChange("maxPrice", e.target.value)}
          />
        </div>
          </div>

          <div className="flex items-center mt-3 md:mt-0 justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="text-xs md:h-8 h-6"
              onClick={() => {
                const reset = { city: "All", brand: "All", minPrice: "", maxPrice: "" };
                setLocalFilters(reset);
                onApplyFilters(reset);
              }}
            >
              {language === "ru" ? "Сбросить" : language === "ko" ? "초기화" : "Reset"}
            </Button>
            <Button
              type="button"
              onClick={() => onApplyFilters(localFilters)}
              className="text-xs text-white md:h-8 h-6 bg-primary"
            >
              <Check size={14} />
              {placeholders.apply}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
