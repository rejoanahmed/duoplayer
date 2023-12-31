'use client'

import { useAbly, usePresence } from 'ably/react'
import { useEffect, useRef, useState } from 'react'

function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const client = useAbly()
  const me = client.auth.clientId
  const [toGuess, setToGuess] = useState(false)
  const [correctGuess, setCorrectGuess] = useState(null as number | null)
  const { updateStatus, presenceData } = usePresence(
    params.id,
    {
      myGuess: null as 'guessing' | number | null,
      guessMine: null as 'setting' | number | null
    },
    (data) => {
      console.log(data)
      if (data.clientId !== me) {
        if (data.data.guessMine && data.data.guessMine !== 'setting') {
          setToGuess(true)
        }

        if (data.data.guessMine && data.data.guessMine === 'setting') {
          setToGuess(false)
        }
      }
    }
  )
  const players = presenceData.map((p) => p.clientId)

  const initRef = useRef(false)

  useEffect(() => {
    if (players.length === 1 && !initRef.current) {
      updateStatus({
        myGuess: null,
        guessMine: 'setting'
      })
      initRef.current = true
    }
  }, [presenceData])

  console.log(presenceData)

  return (
    <div>
      <h1>Your name is :{me}</h1>
      <p>
        {presenceData.length} members are playing in this room : {players[0]}{' '}
        and {players[1]}
      </p>
      <p>Your Opponent is {}</p>
      <div className='mx-auto border rounded-xl shadow-md bg-slate-700 text-white flex flex-col gap-3 w-fit p-10 mt-20 font-semibold text-2xl'>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='flex gap-3'>
              {Array(3)
                .fill(0)
                .map((_, j) => (
                  <button
                    className='rounded-full border bg-slate-500 flex items-center justify-center w-20 h-20'
                    key={j}
                  >
                    {i * 3 + j + 1}
                  </button>
                ))}
            </div>
          ))}
      </div>
    </div>
  )
}

export default Page
