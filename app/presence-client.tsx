'use client'

import { usePresence } from 'ably/react'

export default function Presence() {
  return (
    <div className=''>
      <button
        className='font-manrope text-base min-w-[80px] whitespace-nowrap text-white text-opacity-100 text-center leading-4 font-medium bg-black rounded-md w-[120px] h-10'
        // onClick={() => setIsOnline(true)}
      >
        Join
      </button>
    </div>
  )
}
