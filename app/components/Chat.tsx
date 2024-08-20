"use client"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const Chat = () => {
  const [messages, setMessages] = useState<{ id : number; content : string; created_at : string }[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending : true })
      setMessages(data)
    }

    fetchMessages()

    const subscription = supabase
    .channel("messages")
    .on("postgres_changes", { event : "INSERT", schema : "public", table : "messages" }, (payload) => {
      setMessages((prev) => [...prev, payload.new])
    })
    .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return

   await supabase
    .from("messages")
    .insert([{ content : newMessage }])
        
    setNewMessage("")
  }

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{new Date(msg.created_at).toLocaleString()}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  )
}

export default Chat