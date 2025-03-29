'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  swapParams?: any; // Store AI return swap parameters
}

interface ChatBubbleProps {
  onSwapWithParams?: (params: any) => void;
}

export default function ChatBubble({ onSwapWithParams }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate API call to get AI response
    setTimeout(() => {
      // Check if message contains swap related keywords
      if (inputText.toLowerCase().includes('swap') || 
          inputText.toLowerCase().includes('exchange') ||
          inputText.toLowerCase().includes('trade')) {
        
        // Use valid number format
        const mockSwapParams = {
          fromTokens: [
            { token: 'WETH', amount: '0.1' }
          ],
          toTokens: [
            { token: 'USDT', amount: '200' }
          ]
        };
        
        // Create AI response with swap parameters
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "I recommend swapping 0.1 WETH for approximately 200 USDT based on current rates. Would you like to proceed with this swap?",
          isUser: false,
          timestamp: new Date(),
          swapParams: mockSwapParams
        }
        
        setMessages(prev => [...prev, aiMessage])
      } else {
        // Regular response
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Mocked AI reply",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      }
    }, 1000)
  }

  const clearMessages = () => {
    setMessages([]);
  }

  // Handle function to execute swap
  const executeSwap = (params: any) => {
    if (onSwapWithParams) {
      console.log("Executing swap with params:", params);
      // Add a delay to ensure the UI updates before swap execution
      setTimeout(() => {
        onSwapWithParams(params);
      }, 100);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-[450px] max-w-[90vw] h-[450px] max-h-[70vh] bg-white rounded-2xl shadow-lg z-[1000] overflow-hidden flex flex-col animate-[slideIn_0.3s_ease]">
          <div className="p-4 bg-[#f7f8fa] border-b border-[#e8e8e8] flex justify-between items-center">
            <h3 className="m-0 text-base font-semibold text-[#0d111c]">AI Assistant</h3>
            <div className="flex gap-2">
              <button 
                onClick={clearMessages}
                className="px-2.5 py-1.5 border-none bg-transparent cursor-pointer text-[#666] rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.05)]"
              >
                Clear
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1.5 border-none bg-transparent cursor-pointer text-[#666] rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.05)]"
              >
                Close
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f1f1f1] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-[#c1c1c1] [&::-webkit-scrollbar-thumb]:rounded hover:[&::-webkit-scrollbar-thumb]:bg-[#a8a8a8]">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 max-w-[85%] flex flex-col ${
                    message.isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`px-3 py-2 rounded-xl text-sm leading-snug break-words ${
                    message.isUser 
                      ? 'bg-[#2172e5] text-white rounded-br-sm' 
                      : 'bg-[#f0f0f0] text-black rounded-bl-sm'
                  }`}>
                    {message.text}
                    
                    {/* Display execute button if message contains swap parameters */}
                    {message.swapParams && (
                      <button 
                        onClick={() => executeSwap(message.swapParams)}
                        className="mt-2 px-3 py-1 bg-[#2172e5] text-white text-xs rounded-md hover:bg-[#1a5fc7] w-full"
                      >
                        Execute Swap
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-[#999] mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#999] text-sm">
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-[#e8e8e8] flex gap-2 bg-white">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start your chat..."
              className="flex-1 px-3 py-2 border border-[#e8e8e8] rounded-full outline-none text-sm focus:border-[#2172e5]"
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-[#2172e5] text-white border-none rounded-full cursor-pointer text-sm transition-colors hover:bg-[#1a5fc7]"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button 
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-white text-black border-none cursor-pointer shadow-md text-2xl flex items-center justify-center z-[1000] transition-all hover:scale-110 hover:shadow-lg hover:bg-[#f5f5f5] active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .chat-window-mobile {
            width: 90vw;
            height: 65vh;
            right: 5vw;
            left: 5vw;
            bottom: 80px;
          }
          .bubble-mobile {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>
    </>
  )
}
