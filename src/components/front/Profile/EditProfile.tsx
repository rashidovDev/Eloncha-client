import React, { useState } from 'react';
import { useAuth } from '../../Authcontext';
import { useForm, Controller } from 'react-hook-form';
import PhoneInput, {
  getCountries,
  getCountryCallingCode
}  from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useMutation } from '@tanstack/react-query';
import { checkToken, PUT } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types/types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { showSuccessMessage } from '../../../store/slices/toggleSlice';
import BackToPrev from '../BackToPrev';

const EditProfile: React.FC= () => {
    const {user, refetchUser} = useAuth()
      const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }, setValue
      } = useForm<User>({
        defaultValues: {
          username: user?.username || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || ''
        }
      });


//   const [phone, setPhone] = useState<string | undefined>(user?.phoneNumber || '');
//   const [email, setEmail] = useState(user?.email || '' );
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const mutation = useMutation({
    mutationFn: async (data: User) => {
      await checkToken()
      const res = await PUT('/user/update/', data); 
      if(res){
        return res.data;
      }else{
        toast.error('Ошибка при обновлении профиля');
      }
      },
      onSuccess: async () => {
        await refetchUser();
        dispatch(showSuccessMessage('Профиль успешно обновлен'));
        navigate('/profile');
        reset();
      },
      onError: () => {
       toast.error('Ошибка при обновлении профиля');
      }
    });

     const onSubmit = (data: User) => {
        mutation.mutate(data);
      };

  return (
    <div>
    <BackToPrev/>
    <h2 className="text-3xl font-semibold text-center mb-4">Edit Profile</h2>
    <form
    onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
     {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Имя пользователя</label>
            <input
              {...register('username', { required: 'Заголовок обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Введите заголовок"
            />
            {errors.username?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>

       {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Электронная почта</label>
            <input
              {...register('email', { required: 'Заголовок обязателен' })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Введите заголовок"
            />
            {errors.email?.type === 'required' && <div className='text-red-500 mt-2'>Обязательное поле</div>}
          </div>

           {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium mb-1">Номер телефона</label>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: 'Номер телефона обязателен' }}
          render={({ field, fieldState }) => (
            <>
              <PhoneInput
                {...field}
                defaultCountry="KR"
                onChange={field.onChange}
                value={field.value}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="+82 10 3456 7890"
              />
              {fieldState.error && (
                <div className="text-red-500 mt-2">{fieldState.error.message}</div>
              )}
            </>
          )}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
      >
        Save
      </button>
    </form>
    </div>
  );
};

export default EditProfile;
