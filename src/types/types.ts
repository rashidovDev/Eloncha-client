import {ReactNode} from "react"

export interface RootState {
    loader: {
      loader : boolean;
    };
  }

export interface ChildrenProps {
    height? : string,
    width? : string,
    children: ReactNode;
}

export interface DateRegistered {
  year: number;
  month: number;
  day: number;
  hours: {
    hour: number;
    minutes: number;
    seconds: number;
  };
}

export interface City {
  _id: string;
  cityNameEng: string;
  cityNameRu: string;
  cityNameKor: string;
  country: string;
  __v: number; 

}

export interface Brand {
  _id: string;
  brand : string;
  country: string;
  __v: number;
}

export interface User {
  username: string;
  email: string;
  password?: string;
  dateRegistered: DateRegistered;
  phoneNumber?: string;
  role: string;
  avatar : string;
  provider: string;
  googleId?: string;
  savedCar : string[];
  likedCar : string[];
  _id: string;
  __v: number;
}

export interface UserResponseProps {
  message?: string;
  user: User;
  token : string
}

export interface SIGNUProps {
  username : string,
  email? : string,
  password : string
}

export interface FormDataAds {
  title: string;
  brand: string;
  model: string;
  yearOfProduce: number;
  mileage: number;
  city: string;
  description: string;
  price: number;
}

export interface CarModel {
 _id : string;
 brandId : string;
 model : string;
 __v : number
}

export interface Brand {
  _id: string;
  brand: string;
  country: string;
  __v: number;
}

export interface carAd {
  _id: string;
  brand: string;
  model: string;
  yearOfProduce: number;
  mileage: number;
  city: string;
  description: string;
  price: number;
  title: string;
  images: string[];
  isPosted: boolean;
  likes: string[]; // Assuming likes are user IDs (strings)
  views: number;
  user: {
    _id : string;
    username : string;
    email : string
  }
  createdAt: DateRegistered;
  __v: number;
}

export interface IChats {
   chatId : string,
   partner : {
    _id : string,
    avatar? : string,
    email : string,
    username : string
   }
   lastMessage : string,
   lastTime : Date,
   lastStatus?: "sent" | "seen",
   lastSender?: string,
   unreadCount?: number
}
export interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  receiver: string;
  text: string;
  status: "sent" | "seen";
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
  __v?: number;
}




