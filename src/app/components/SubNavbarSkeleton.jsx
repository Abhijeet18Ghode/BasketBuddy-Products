import React from 'react'

const SubNavbarSkeleton = () => {
  return (
    <div className='flex items-end justify-evenly pt-2 pb-2 pl-7 pr-7 w-full text-slate-400'>
    <div className='flex items-center justify-evenly w-full'>
      <div className='flex flex-col gap-2 animate-pulse'>
        <div className='w-16 h-16 rounded-full bg-gray-300'></div>
        <div className='w-24 h-6 bg-gray-300 rounded'></div>
      </div>
      <div className='flex items-center justify-evenly w-full'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='w-24 h-8 bg-gray-300 rounded mx-2 animate-pulse'></div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default SubNavbarSkeleton