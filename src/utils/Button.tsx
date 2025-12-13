import React, {ReactNode} from 'react'
import { ChildrenProps } from '../types/types';

const Button  = ({children, height, width} : ChildrenProps) => {
  return (
   <button style={{height, width}} 
   className='p-3 text-white bg-primary flex justify-center items-center rounded-[7px]'>
    {children}
   </button>
  )
}

export default Button