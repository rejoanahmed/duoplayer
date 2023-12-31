'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ShortUniqueId from 'short-unique-id'

const NewChannelID = new ShortUniqueId({ length: 6 })

export default function JoinRoom() {
  const router = useRouter()
  const [channelID, setChannelID] = useState('')
  return (
    <div className='flex flex-col gap-3 items-center px-10 w-96 mx-auto border rounded-xl py-20'>
      <button
        className='font-manrope text-base w-full whitespace-nowrap text-white text-opacity-100 text-center leading-4 font-medium bg-black rounded-md h-10'
        onClick={() => {
          const id = NewChannelID.rnd()
          router.push(`/room/${id}`)
          // copy to clipboard
          navigator.clipboard.writeText(id)
          toast.success('Your Room Id Copied to clipboard')
        }}
      >
        Create Room
      </button>
      <p>Or</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          router.push(`/room/${channelID}`)
        }}
      >
        {' '}
        <input
          type='text'
          className='w-full px-4 py-1 rounded-md border-2 mb-3'
          placeholder='Enter Room ID'
          value={channelID}
          onChange={(e) => setChannelID(e.target.value)}
        />
        <button
          className='font-manrope text-base w-full whitespace-nowrap text-white text-opacity-100 text-center leading-4 font-medium bg-black rounded-md h-10'
          type='submit'
        >
          Join Room
        </button>
      </form>
    </div>
  )
}
