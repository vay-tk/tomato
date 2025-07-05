
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Routes, Route, Navigate } from "react-router-dom"
import Add from './pages/Add/Add'
import Orders from './pages/Orders/Orders'
import List from './pages/List/List'
  import { ToastContainer } from 'react-toastify';
const App = () => {
  const url  = import.meta.env.VITE_BACKEND_URL;
  // console.log(url)
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/" element={<Navigate to="/add" />} />
          <Route path='/add' element={<Add  url={url}/>} />
          <Route path='/list' element={<List  url={url}/>} />
          <Route path='/orders' element={<Orders  url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
