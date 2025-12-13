import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types/types';
import { useAuth } from './Authcontext';

const GoogleSuccess : React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

 useEffect(() => {
  const fetchUser = async () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');
    if (!token) return;

    try {
      const response = await axios.get<User>('http://localhost:5001/api/user/auth', {
        withCredentials: true,
        headers: { Authorization: 'Bearer ' + token }
      });
      if (response.data?.role === 'user') {
        login(response.data, token); // Use the login function from AuthContext
        navigate('/'); // Redirect to home page after successful login
      } else if (response.data?.role === 'admin') {
         login(response.data, token);
         navigate('/admin'); // Redirect to admin page after successful login
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchUser();
}, []);
  return (
    <div>Login with Google...</div>
  )
}

export default GoogleSuccess