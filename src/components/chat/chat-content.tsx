'use client'
import { useParams } from "next/navigation";

export function ChatContent() {

  const { chat_id } = useParams();

  return (
    <div>
      <h1>Chat content</h1>
      <p>Chat ID: {chat_id}</p>
    </div>
  )
}