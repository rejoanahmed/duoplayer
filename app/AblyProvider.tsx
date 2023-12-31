'use client'
import * as Ably from 'ably'
import { AblyProvider as ABProvider } from 'ably/react'
import { useState } from 'react'
import names from 'random-names-generator'

function AblyProvider({ children }: { children: React.ReactNode }) {
  const [randomName] = useState(names.random())
  const client = new Ably.Realtime.Promise({
    authUrl: '/token',
    authMethod: 'POST',
    clientId: randomName
  })

  return <ABProvider client={client}>{children}</ABProvider>
}

export default AblyProvider
