'use client'

import { useAbly, usePresence } from 'ably/react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

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

  const disabled =
    (myStatus.guessMine !== 'setting' && myStatus.myGuess !== 'guessing') ||
    presenceData.length < 2
  console.log(disabled)
  const players = presenceData.map((p) => p.clientId)
  const opponent = players.find((p) => p !== me)
  const [result, setResult] = useState<
    false | { actual: number; input: number }
  >(false)

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

  useEffect(() => {
    if (typeof opponentStatus.guessMine === 'number') {
      updateStatus({
        myGuess: 'guessing',
        guessMine: null
      })
    }
    if (typeof opponentStatus.myGuess === 'number') {
      setResult({
        actual: myStatus.guessMine as number,
        input: opponentStatus.myGuess
      })
    }
    if (opponentStatus.guessMine === 'setting') {
      setResult(false)
    }
  }, [opponentStatus])

  useEffect(() => {
    if (typeof myStatus.myGuess === 'number') {
      setResult({
        actual: opponentStatus.guessMine as number,
        input: myStatus.myGuess
      })
      setTimeout(() => {
        setResult(false)
        updateStatus({
          myGuess: null,
          guessMine: 'setting'
        })
      }, 2000)
    }
  }, [myStatus])

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
            `Set A number for ${opponent} to Guess`}
          {opponentStatus.guessMine === 'setting' &&
            `Waiting for  ${opponent} to set a number`}
          {opponentStatus.myGuess === 'guessing' &&
            `${opponent} is guessing your number`}
          {myStatus.myGuess === 'guessing' && `Guess ${opponent}'s number`}
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
                      console.log('click')
                      if (myStatus.guessMine === 'setting') {
                        updateStatus({
                          myGuess: null,
                          guessMine: i * 3 + j + 1
                        })
                      }
                      if (myStatus.myGuess === 'guessing') {
                        console.log('myguess is this')
                        updateStatus({
                          myGuess: i * 3 + j + 1,
                          guessMine: null
                        })
                      }
                    }}
                    className={`rounded-full border ${
                      !result
                        ? 'bg-slate-500'
                        : result.actual === i * 3 + j + 1 &&
                          i * 3 + j + 1 === result.input
                        ? 'bg-green-500'
                        : result.actual === i * 3 + j + 1 &&
                          i * 3 + j + 1 !== result.input
                        ? 'bg-pink-500'
                        : result.input === i * 3 + j + 1
                        ? 'bg-red-600'
                        : 'bg-slate-500'
                    } flex items-center justify-center w-20 h-20`}
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
