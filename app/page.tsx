import dynamic from 'next/dynamic'

const PresenceClient = dynamic(() => import('./presence-client.tsx'), {
  ssr: false
})

const Home = () => {
  return (
    <div>
      <PresenceClient />
    </div>
  )
}
export default Home
