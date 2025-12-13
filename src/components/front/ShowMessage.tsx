import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChildrenProps } from '../../types/types'

const ShowNavbar : React.FC<ChildrenProps> = ({children}) => {

    const location = useLocation()

    const [showComponent, setShowComponent] = useState(false)

    useEffect(() => {
    if(location.pathname === '/user/login' || location.pathname.startsWith('/admin')){
        setShowComponent(false)
    }else{
        setShowComponent(true)
    }
    },[location])

  return (
    <div>{showComponent && children} </div>
  )
}

export default ShowNavbar