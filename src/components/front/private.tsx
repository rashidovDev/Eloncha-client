import React from 'react'
import { Navigate, Outlet} from 'react-router-dom'
import Profile from './Profile/Profile'

export const UserPrivateRoute = () => {
  let token = localStorage.getItem("user_access_token")
  return (
  token ?  <Outlet/>  : <Navigate to="/user/login" />
  )
}