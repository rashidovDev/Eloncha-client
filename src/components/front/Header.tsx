import React, { useState } from 'react'
import Filter from './Filter'
import Products from './Products/Products'
import FilterCity from "./FilterCity"
import { useLanguage } from '../LanguageContext'
import { HEADER_TITLE } from '@/utils/const'


const Header : React.FC = () => {
 const { language } = useLanguage();

  return (


    <main className='w-[95%] md:w-full mx-auto'>
    <h1 className='responsive-header font-semibold py-2'>{HEADER_TITLE.home[language]}</h1>
   {/* <FilterCity setCategory={setCategory} /> */}
     <Products />
    </main>
  )
}

export default Header 