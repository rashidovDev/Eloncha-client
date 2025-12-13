import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {store} from "./store/store.ts"
import { Provider } from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/Authcontext.tsx'
import { LanguageProvider } from './components/LanguageContext'


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Provider store={store}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </AuthProvider>
  </QueryClientProvider>
  </BrowserRouter>
)
