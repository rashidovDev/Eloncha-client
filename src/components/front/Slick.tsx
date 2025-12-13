import React from 'react'
import Slider from "react-slick";
import car from "../../assets/car.png"

const Slick = () => {
  return (
    <div className='flex'>
        
        <div>
          <img className='rounded-[2px] w-[120px] m-1' src={car} alt="" />
        </div>
    </div>
  )
}

export default Slick