import ChatInterface from '@/components/ChatInterface'

export default function CustomChatPage({ params }: { params: { aiId: string } }) {
  return <ChatInterface aiType="custom" aiId={params.aiId} />
}