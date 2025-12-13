import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { toggleMessage } from '../../store/slices/toggleSlice'
import { RootState } from '../../store/store'

const Messages = () => {

    const messageIsVisible = useSelector((state: RootState) => state.toggle.messageIsVisible);
    const dispatch = useDispatch()

    return (
        <div className={`
            ${messageIsVisible ? 'basket-bottom-true-margin' : 'basket-bottom-margin '}
            w-[320px] h-[90vh] bottom-0 right-1 fixed  z-20 shadow-messages
         bg-white rounded-lg py-1`}>
            <header
            onClick={(e) => {
                e.stopPropagation()
                // Toggle the visibility of the message section
dispatch(toggleMessage())
            } }
             className={`border-b-[1px] border-slate-100 flex 
             cursor-pointer justify-between items-center p-3`}>
                <div>Сообщение</div>
                <div>{messageIsVisible ?  <ChevronUp /> : <ChevronDown />}</div>
            </header>
            <div>

                {/* MESSAGE */}
                <div className='flex items-center  h-[60px] p-2 border-b-[1px] border-slate-100'>
                    <div className='w-[15%] '>
                        <div className='rounded-full  flex justify-center items-center 
             bg-red-300 w-[40px] h-[40px]'>
                            AR
                        </div>
                    </div>

                    <div className=' w-[85%]'>
                        {/* NAME */}
                        <div className='flex justify-between items-center'>
                            <h3>Anvar Rashidov</h3>
                            <p className='text-[10px] text-slate-400'>Jan 18</p>
                        </div>
                        <div> <p className='text-[10px] line-clamp-1 text-[#333]'>
                            Salom Hyundai x6 eloni buyicha murojaat qilayotgan edimsksfmckisnjcjbscjbnsjbc
                        </p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages