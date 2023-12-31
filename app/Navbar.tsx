'use client'

import { usePresence } from 'ably/react'

function Navbar() {
  const { presenceData } = usePresence('global', {
    status: 'available'
  })
  return (
    <nav className='flex border-b mb-10 justify-between'>
      <h1 className='font-bold leading-tight text-2xl'>CryBaby</h1>
      <p>{presenceData.length} members online</p>
    </nav>
  )
}

export default Navbar
