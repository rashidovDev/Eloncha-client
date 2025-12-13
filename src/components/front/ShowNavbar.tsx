import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChildrenProps } from '../../types/types'

const ShowNavbar = ({children} : ChildrenProps) => {

    const location = useLocation()

    const [showNavbar, setShowNavbar] = useState(false)

    useEffect(() => {
    if(location.pathname === '/user/login' || location.pathname.startsWith('/admin')){
        setShowNavbar(false)
    }else{
        setShowNavbar(true)
    }
    },[location])

  return (
    <div>{showNavbar && children} </div>
  )
}

export default ShowNavbar