import { useLanguage } from '@/components/LanguageContext';
import AllAd from './AllAd'
import PremiumAd from './PremiumAd'
import { HEADER_TITLE } from '@/utils/const';

const Products = () => {
  const { language } = useLanguage();
  return (
      
    <div>

    <div className='w-full flex justify-between'>
      <div className='lg:w-[72%] w-full '>
        <AllAd/>
      </div>
      <div className='w-[25%] hidden lg:block '>
        <PremiumAd title={HEADER_TITLE.premium[language]}/>
      </div>
    </div>
    </div>
  )
}

export default Products
