import { Navigate, Outlet} from 'react-router-dom'

export const UserPrivateRoute = () => {
  let token = localStorage.getItem("user_access_token")
  return (
  token ?  <Outlet/>  : <Navigate to="/user/login" />
  )
}
