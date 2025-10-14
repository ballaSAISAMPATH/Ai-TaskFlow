import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation } from 'react-router-dom'
export default function RoadMap() {
  const user = useSelector((state)=>state.auth.user)
  const location = useLocation();
  console.log(location.pathname);
  
  useEffect(()=>{
    console.log(user.id);
    
  })
  return (
    <div className='relative'>
        <div className='flex gap-4 p-5 fixed m-0  top-15 bg-white z-999 w-full justify-center sm:justify-start'>

        <Link className={`${location.pathname=="/user/road-map"?`bg-gray-300   text-black`:`bg-green-500 text-white hover:bg-green-700`} text-[13px] p-2  hover:shadow-xl hover:-translate-y-1 transition-all rounded-lg shadow-lg/50 shadow-black`} to="/user/road-map">existing roadmaps</Link>
        <Link className={`${location.pathname=="/user/road-map/create-roadmap"?`bg-gray-300 text-black`:`bg-green-500 text-white hover:bg-green-700`} text-[13px] p-2  hover:shadow-xl hover:-translate-y-1 transition-all rounded-lg shadow-lg/50 shadow-black`} to="/user/road-map/create-roadmap">Create new roadmap</Link>

        </div>
        <Outlet/>
    </div>
  )
}
