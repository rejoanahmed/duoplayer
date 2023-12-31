'use client'

import { useAbly, usePresence } from 'ably/react'
import { useEffect, useRef, useState } from 'react'

type Status = {
  myGuess: 'guessing' | number | null
  guessMine: 'setting' | number | null
}

function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const client = useAbly()
  const me = client.auth.clientId
  const [myStatus, setMyStatus] = useState<Status>({
    myGuess: null,
    guessMine: null
  })

  const [opponentStatus, setOpponentStatus] = useState<Status>({
    myGuess: null,
    guessMine: null
  })
  const disabled = opponentStatus.guessMine === 'setting'
  const initRef = useRef(false)
  const { updateStatus, presenceData } = usePresence<Status>(
    params.id,
    {
      myGuess: null,
      guessMine: null
    },
    (data) => {
      console.log(data)
      if (data.clientId !== me) {
        setOpponentStatus(data.data)
        if (data.action === 'leave') {
          initRef.current = false
          setMyStatus({
            myGuess: null,
            guessMine: 'setting'
          })
          setOpponentStatus({
            myGuess: null,
            guessMine: null
          })
        }
      } else {
        setMyStatus(data.data)
      }
    }
  )
  const players = presenceData.map((p) => p.clientId)

  useEffect(() => {
    if (!initRef.current && presenceData.length) {
      console.log('init')
      presenceData.length === 1 &&
        updateStatus({
          myGuess: null,
          guessMine: 'setting'
        })
      presenceData.length === 1 && console.log(1)
      presenceData.length === 2 &&
        setOpponentStatus({
          myGuess: null,
          guessMine: 'setting'
        })
      presenceData.length === 2 && console.log(2)
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
      {players.length > 1 ? (
        <p>
          {myStatus.guessMine === 'setting' &&
            'Set A number for your Opponent to Guess'}
          {myStatus.guessMine !== 'setting' &&
            opponentStatus.guessMine === 'setting' &&
            'Waiting for your Opponent to set a number'}
          {myStatus.guessMine !== 'setting' &&
            opponentStatus.guessMine !== 'setting' &&
            'Guess the number'}
        </p>
      ) : (
        <p>Waiting for another player to join</p>
      )}
      <div className='mx-auto border rounded-xl shadow-md bg-slate-700 text-white flex flex-col gap-3 w-fit p-10 mt-20 font-semibold text-2xl'>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='flex gap-3'>
              {Array(3)
                .fill(0)
                .map((_, j) => (
                  <button
                    disabled={disabled}
                    onClick={() => {
                      console.log('clicked')
                    }}
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
