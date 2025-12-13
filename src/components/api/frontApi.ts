
import { hideLoader, showLoader } from "../../store/slices/loaderSlice"
import { toast } from "react-toastify"
import axios from "axios";
import { store } from "../../store/store";

export async function FILE(URL: string, payload: File | File[]) {
    try {
        store.dispatch(showLoader());
        const formData = new FormData();

        if (Array.isArray(payload)) {
            payload.forEach(file => formData.append('files', file)); // 'files' for multiple
        } else {
            formData.append('file', payload); // single file
        }

        const response = await axios.post(
            `https://api.eloncha.store/api${URL}`,
            formData,   {withCredentials : true, headers: { Authorization: 'Bearer ' + localStorage.getItem('user_access_token') }}
        );
        store.dispatch(hideLoader());
        console.log('File upload response:', response);
        toast.success(response.data.message);
        return response.data;
    } catch (err : any) {
        store.dispatch(hideLoader()); 
        let message = "Произошла ошибка";
        if (axios.isAxiosError(err) && err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
        } else if (err instanceof Error) {
            message = err.message;
        }
        toast.error(message);
    }
}
