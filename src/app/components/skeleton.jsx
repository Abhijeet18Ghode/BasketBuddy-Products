import React from 'react'

const skeleton = () => {
  return (
    <div className="w-full h-full animate-pulse ">
    <div className="flex flex-col items-start p-5 gap-4 max-w-xs">
      {/* Image skeleton */}
      <div className="bg-gray-300 rounded-md w-full h-64"></div>

      {/* Title skeleton */}
      <div className="bg-gray-300 rounded-md w-3/4 h-6"></div>

      {/* Description skeleton */}
      <div className="bg-gray-300 rounded-md w-full h-4"></div>
      <div className="bg-gray-300 rounded-md w-5/6 h-4"></div>

      {/* Price skeleton */}
      <div className="bg-gray-300 rounded-md w-1/4 h-6"></div>
    </div>
  </div>
  )
}

export default skeleton
