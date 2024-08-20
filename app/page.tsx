import Head from "next/head"
import Chat from "@/app/components/Chat"

const Home = () => {
  return (
    <div>
      <Head>
        <title>リアルタイムチャットアプリ</title>
      </Head>
      <main>
        <h1>リアルタイムチャットアプリ</h1>
        <Chat/>
      </main>
    </div>
  )
}

export default Home