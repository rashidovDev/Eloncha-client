import axios from 'axios';
import { SIGNUProps, User, UserResponseProps } from '../../types/types';
import { store } from '../../store/store';
import { hideLoader, showLoader } from '../../store/slices/loaderSlice';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL:BASE_URL || 'http://localhost:5001/api', 
//   withCredentials: true,
  headers: {
        'Content-Type': 'application/json',
	    	'accept': 'application/json',
  },
});



export const SIGNUP = async (userData: SIGNUProps, URL:string): Promise<UserResponseProps> => {
    try{
        store.dispatch(showLoader())
        const response = await api.post<UserResponseProps>(URL, userData);
        store.dispatch(hideLoader())
        toast.success(response.data.message)
        return response.data;
    }catch(err:any){
        if (axios.isAxiosError(err)) {
            // Safely access the response and log the error message
            if (err.response) {
                toast.error(err.response.data.message)
                store.dispatch(hideLoader())
            } else {
                console.error('Error:', err.message); // Network error or something else
            }
        } else {
            console.error('Unexpected Error:', err); // Non-Axios error
        }

        throw err; // Re-throw to handle it elsewhere if needed 
    } 
  };

  export const SIGNIN = async  (email: string, password: string, URL:string): Promise<UserResponseProps> => {
    try{
        store.dispatch(showLoader())
        const response = await api.post<UserResponseProps>(URL, {email, password});
        store.dispatch(hideLoader())
        toast.success(response.data.message)
        return response.data;
    }catch(err:any){
        if (axios.isAxiosError(err)) {
            // Safely access the response and log the error message
            if (err.response) {
                toast.error(err.response.data.message)
                store.dispatch(hideLoader())
            } else {
                console.error('Error:', err.message); // Network error or something else
            }
        } else {
            console.error('Unexpected Error:', err); // Non-Axios error
        }

        throw err; // Re-throw to handle it elsewhere if needed
    }
    
  };

 export async function getUser(token : string) {
    const response = await axios.get<User>('http://localhost:5001/api/user/auth',
      {withCredentials : true, headers: { Authorization: 'Bearer ' + token}})  
      if(response.data?.role === 'user'){
        localStorage.setItem("user_tokenTime", JSON.stringify(new Date().getTime()))
        localStorage.setItem('user', JSON.stringify(response.data))  
      }else if(response.data?.role === 'admin'){
        localStorage.setItem("admin_tokenTime", JSON.stringify(new Date().getTime()))
        localStorage.setItem('admin', JSON.stringify(response.data))  
      }   
  }

  export async function checkToken() {
    const tokenTimeStr = localStorage.getItem('tokenTime');
    if (!tokenTimeStr) {
        window.location.href = "/user/login";
        return;
    }
    let tokenTime: number = JSON.parse(tokenTimeStr);  
    let differenceInHours = Math.floor((Date.now() - tokenTime) / (1000 * 60 * 60)); // Difference in hours
    if (differenceInHours < 1) {
		return
    } else {
		window.location.href = "/user/login"; 
    }
}

export async function GET(URL : string){
    const response = await api.get(`${URL}`, 
      {withCredentials : true, headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') }})
    return response.data;
}


export async function POST(URL : string, payload : any, loader = true) {
	let jsonData = JSON.stringify(payload);
	if (loader) {
		store.dispatch(showLoader());
		// await checkToken()
		const data = await api.post(`${URL}`, jsonData, { headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') } })
		.then(response => response.data).catch(error => httpStatusChecker(error))
		store.dispatch(hideLoader());
		return data
	} else {
		await checkToken()
		return api.post(`${URL}`, jsonData, { headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') } }).then(response => response.data);
	}
}


export async function DELETE(URL : string, payload? : any, loader = true) {
	if (loader) {
		// await checkToken()
    const res = await api.delete(`${URL}`, { 
      data: payload,
      headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') } 
    })
    .then(response => response.data).catch(error => httpStatusChecker(error))
		return res
	}
}

export async function PUT(URL : string, payload? : any, loader = true) {
	let jsonData = JSON.stringify(payload);
	if (loader) {
		// store.dispatch(showLoader());
		// await checkToken()
		const data = await api.put(`${URL}`, jsonData, { headers: { Authorization: 'Bearer '
       + localStorage.getItem('user_access_token') } })
		.then(response => response.data).catch(error => httpStatusChecker(error))
		// store.dispatch(hideLoader());
    return data
	} else {
		await checkToken()
		return api.post(`${URL}`, jsonData, { headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') } }).then(response => response.data);
	}
}

export async function incrementViews(URL: string) {
  try {
    const response = await api.put(`${URL}`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') }
    });
    if(response){
      return
    }
  } catch (error) {
    httpStatusChecker(error);
    throw error; // Re-throw the error for further handling if needed
  }
}

     


export function httpStatusChecker(error : any) {
	console.log(error);
	console.log(error.response.status === 401);
	if (!error.response) {
		toast.error("Ошибка: Нет подключение к интернету")
		return;
	}
	if (error.response.status === 400) {
		toast.error(error.response.data.message)
		return;
	}
	if (error.response.status === 401) {
		// checkToken()
		toast.error("Ошибка: Неверный логин или пароль")
		return;
	}
	if (error.response.status === 404) {
		toast.error("Ошибка: Не найдено")
		return;
	}
	if (error.response.status === 415) {
		toast.error("Ошибка: Не поддерживаемый тип")
		return;
	}
	if (error.response.status === 500) {
		toast.error("Системная ошибка:" + error.response.data.message)
		return;
	}
}
