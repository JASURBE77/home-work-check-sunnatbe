import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatBot from './components/ChatBot'

const App = () => {
  return (
    <div className='container'>
      <Header />
     <div className='flex gap-10'>
      <Sidebar />
       <Outlet />
     </div>

     <ChatBot />
    </div>
  )
}

export default App