import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { UserResponseProps } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/userSlice';

const Dashboard = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

     
  return (
    <div className='text-[15px]'>
      <button >Logout</button>
    </div>
  )
}

export default Dashboard