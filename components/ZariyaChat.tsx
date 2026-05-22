'use client'
// components/ZariyaChat.tsx
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  'How can I improve my posture?',
  'Exercises for new moms',
  'Why is posture important?',
  'Tips for breastfeeding posture',
]

const RESPONSES: Record<string, string> = {
  'how can i improve my posture':
    "Great question! Here are some key tips for improving your posture:\n\n• **Ear over shoulder**: Align your ear directly over your shoulder when sitting\n• **Lumbar support**: Use a small pillow or rolled towel behind your lower back\n• **Screen height**: Keep your phone/screen at eye level\n• **Micro-breaks**: Every 30 minutes, stand and stretch\n• **Core engagement**: Gently activate your core muscles while sitting",

  'exercises for new moms':
    "These gentle exercises are safe and effective for new mothers:\n\n• **Pelvic tilts**: Lie on back, gently tilt pelvis — great for lower back\n• **Cat-cow stretch**: On hands and knees, alternate arching and rounding your back\n• **Chin tucks**: Gently tuck chin to chest, hold 5 seconds — relieves neck tension\n• **Shoulder rolls**: Roll shoulders backwards 10 times\n• **Wall angels**: Stand against wall, slide arms up and down\n\nAlways consult your doctor before starting any exercise routine postpartum.",

  'why is posture important':
    "Posture is especially critical for new mothers because:\n\n• **Feeding positions**: Hours spent nursing can strain your neck and back\n• **Baby carrying**: Improper technique leads to shoulder and back pain\n• **Hormonal changes**: Relaxin hormone loosens joints, making proper alignment more important\n• **Energy levels**: Good posture reduces fatigue and improves breathing\n• **Long-term health**: Early habits prevent chronic back and neck problems\n\nZariya monitors these patterns so you can correct them early! 💚",

  'tips for breastfeeding posture':
    "Breastfeeding posture tips to protect your back and neck:\n\n• **Bring baby to breast**, not breast to baby — avoid leaning forward\n• **Use a nursing pillow** (like Boppy) to support baby's weight\n• **Sit with back supported** against a firm surface\n• **Feet flat on floor** or use a footstool\n• **Shoulders relaxed** — watch for shoulder creep toward your ears\n• **Take breaks** every feeding to roll your neck gently\n\nYour Zariya sensor will alert you when your deviation increases! 🌿",

  default:
    "I'm Zariya, your posture wellness companion! 🌸\n\nI can help you with:\n• Posture improvement tips\n• Exercises safe for new mothers\n• Understanding your posture data\n• Breastfeeding and feeding positions\n• Self-care reminders\n\nWhat would you like to know?",
}

function findResponse(query: string): string {
  const lower = query.toLowerCase()
  for (const [key, value] of Object.entries(RESPONSES)) {
    if (key === 'default') continue
    const keywords = key.split(' ')
    if (keywords.filter((k) => lower.includes(k)).length >= 2) {
      return value
    }
  }
  return RESPONSES.default
}

function formatMessage(content: string) {
  const lines = content.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('• ')) {
      const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return (
        <li key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: text }} />
      )
    }
    const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return line ? (
      <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
    ) : (
      <br key={i} />
    )
  })
}

export function ZariyaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Hello! I'm Zariya, your posture wellness companion 🌸\n\nI'm here to help you maintain healthy posture during your motherhood journey. Ask me anything about posture, exercises, or your sensor data!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))

    const response = findResponse(text)
    setIsTyping(false)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="zariya-card flex flex-col h-[480px] md:h-[520px]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-cream-200">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zariya-400 to-zariya-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-display text-lg font-medium text-zariya-800">Zariya AI</h3>
          <p className="text-xs text-zariya-400">Posture wellness companion</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
          <span className="text-xs text-sage-500">Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2.5 items-end',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
                msg.role === 'user'
                  ? 'bg-zariya-100 border border-zariya-200'
                  : 'bg-gradient-to-br from-zariya-400 to-zariya-600'
              )}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-zariya-600" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <div className="space-y-1 leading-relaxed text-sm">
                {msg.role === 'assistant' ? (
                  <ul className="space-y-1 list-none">{formatMessage(msg.content)}</ul>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              <p
                className={cn(
                  'text-[10px] mt-1.5',
                  msg.role === 'user' ? 'text-zariya-200' : 'text-zariya-300'
                )}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2.5 items-end">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-zariya-400 to-zariya-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai">
              <div className="flex gap-1 items-center py-1">
                <div className="w-2 h-2 rounded-full bg-zariya-300 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-zariya-300 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-zariya-300 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="flex-shrink-0 text-xs bg-cream-50 hover:bg-cream-100 border border-cream-200 text-zariya-500 px-3 py-1.5 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 pt-2 border-t border-cream-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about posture, exercises..."
            className="input-field"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-10 h-10 bg-zariya-600 hover:bg-zariya-700 disabled:bg-cream-200 text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
