import React from 'react'
import BackToPrev from '../BackToPrev'
import { useAuth } from '../../Authcontext';
import { PlusCircle, Trash } from 'react-feather';
import { NavLink } from 'react-router-dom';
import Modal from '../../Modals/Modal';
import { hideToggleModal, showSuccessMessage, showToggleModal } from '../../../store/slices/toggleSlice';
import { useDispatch } from 'react-redux';
import { checkToken, DELETE } from '../../api/api';
import { FILE } from '../../api/frontApi';
import heic2any from 'heic2any';

const BASE_URL_IMAGE = import.meta.env.VITE_SERVER;

const Profile: React.FC = () => {

  const {user, refetchUser} = useAuth()
  const dispatch = useDispatch()
  const [file, setFile] = React.useState<File | null>(null);
    
  async function uploadAvatar() {
      if (!file) return;
      let fileToUpload = file;

  if (file.type === 'image/heic' || file.name.endsWith('.heic')) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8, // optional
      });

      // Ensure convertedBlob is a single Blob
      const blobPart = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

      fileToUpload = new File([blobPart], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });

      // console.log('Converted HEIC to JPEG:', fileToUpload);
    } catch (error) {
      // console.error('HEIC conversion failed:', error);
      return;
    }
  }
      await checkToken();
      
      await FILE(`/user/upload-avatar`, fileToUpload);
            dispatch(showSuccessMessage('Успешно добавлено!'))
      await refetchUser()
      setFile(null); // Clear file input for next upload
    }

    async function deleteAvatar() {
      await checkToken();
      await DELETE(`/user/delete-avatar`);
       dispatch(showSuccessMessage('Успешно удалено!'))
      await refetchUser()
    }

  
  return (
 <>
  <BackToPrev />
         <Modal height='auto' width='500px'>
          <div className="p-6  rounded-lg mx-auto">
                    <h3 className="text-xl font-semibold mb-4 text-blue-500">Загрузите изображения</h3>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
  // setPreview(URL.createObjectURL(selectedFile));
}
                      }}
                      accept=".jpg,.jpeg,.png,.heic"
                      className="block w-full text-sm file:py-2 file:px-4 file:rounded file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                    <button
                      onClick={() => {
                        uploadAvatar()
                        dispatch(hideToggleModal())
                       
                      }}
                      className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                      Добавить изображение
                    </button>
                  </div>
         </Modal>
  <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">
    {/* Banner + Avatar */}
    <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-500">
      {user?.avatar ? (
        <div className='absolute z-10 bottom-[-60px] left-5'>
          <div className='relative'>

          <img
            src={`${BASE_URL_IMAGE}/${user?.avatar}`}
            alt="Banner"
            className=" w-[120px]
         h-[120px] rounded-full object-cover "
          />
          <div className='cursor-pointer absolute right-3 w-[25px]
          h-[25px] flex justify-center items-center bottom-0
          rounded-full bg-red-500 ' onClick={() => deleteAvatar()}>
            <Trash size={12} color='#fff' /> 
          </div>
          </div>


        </div>
      ) :
      <div className="absolute -bottom-12 text-white left-6 bg-red-400 w-[100px]
       h-[100px] rounded-full flex items-center justify-center text-3xl">
        
        <div className='relative'>
          <div> {user?.username.slice(0, 2).toUpperCase()}</div>
            <div onClick={() => dispatch(showToggleModal('upload-avatar')) } className='w-[22px] h-[22px] bg-blue-500 rounded-full cursor-pointer
             text-white absolute flex items-center text-[16px] justify-center right-[-25px]'>+</div>
        </div>
      
        
      </div>
      }
    
    </div>

    {/* Profile Info */}
    <div className="pt-20 px-6 pb-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">{user?.username}</h1>
            <p className="text-sm text-gray-500 mb-1">☎️ {user?.email}</p>
          {user?.phoneNumber && <p className="text-sm text-gray-500 mb-1">📧 {user?.phoneNumber}</p>}   
          <p className="text-sm text-gray-500 mt-1">
            📅 На сайте с:{" "}
            <span className="font-medium text-gray-700">
              {user?.dateRegistered.day}.{user?.dateRegistered.month}.{user?.dateRegistered.year}
            </span>
          </p>
        </div>
        <button className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
         <NavLink to={'/profile/edit'}>Редактировать профиль</NavLink>   
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 cursor-pointer">
        <div className="bg-blue-50 p-6 rounded-xl text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-700">{}</div>
          <div className="text-gray-600 text-sm mt-1">Объявлений</div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm cursor-pointer">
          <NavLink to={'/profile/add-ads'} className="flex flex-col justify-center items-center gap-2">
            <div className="text-2xl text-green-700"><PlusCircle /></div>
            <div className="text-gray-600 text-sm">Добавить объявление</div>
          </NavLink>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl text-center shadow-sm cursor-pointer">
          <div className="text-2xl font-bold text-yellow-700">{ 0}</div>
          <div className="text-gray-600 text-sm mt-1">Сообщение</div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl text-center shadow-sm cursor-pointer">
          <div className="text-2xl font-bold text-blue-700">{}</div>
          <div className="text-gray-600 text-sm mt-1">Сохраненные объявления</div>
        </div>
      </div>
    </div>
  </div>
</>

  )
}

export default Profile
