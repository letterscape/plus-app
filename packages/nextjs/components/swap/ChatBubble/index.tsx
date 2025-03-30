'use client'

import { useState, useEffect } from 'react'
import Decimal from 'decimal.js'
import { getTokenBySymbol } from '../TokenSelector';

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

        // Extract tokens and amounts from user input
        const inputLower = inputText.toLowerCase();
        let fromToken = '';
        let fromAmount = '';
        let toToken = '';
        
        // Regular expressions to extract token information
        const fromMatch = inputLower.match(/(\d+\.?\d*)\s*([a-z]+)/i);
        if (fromMatch) {
          fromAmount = fromMatch[1];
          fromToken = fromMatch[2].toUpperCase();
        }
        
        // Find "for" and extract the token after it
        const forIndex = inputLower.indexOf(' for ');
        const toIndex = inputLower.indexOf(' to ');
        const extractionIndex = forIndex !== -1 ? forIndex : toIndex;
        if (extractionIndex !== -1) {
          const afterExtraction = inputLower.substring(extractionIndex + (forIndex !== -1 ? 5 : 4));
          const toMatch = afterExtraction.match(/([a-z]+)/i);
          if (toMatch) {
            toToken = toMatch[0].toUpperCase();
          }
        }
        if (forIndex !== -1) {
          const afterFor = inputLower.substring(forIndex + 5);
          const toMatch = afterFor.match(/([a-z]+)/i);
          if (toMatch) {
            toToken = toMatch[0].toUpperCase();
          }
        }
        
        // 使用 swap 页面的 handleInputChange 逻辑计算 toAmount
        const toAmount = (() => {
          if (!fromToken || !toToken || !fromAmount) return '0';
          
          try {
            // 获取代币信息
            const fromTokenInfo = getTokenBySymbol(fromToken);
            const toTokenInfo = getTokenBySymbol(toToken);
            
            // 检查是否能找到代币信息
            if (!fromTokenInfo || !toTokenInfo) return '0';
            
            // 按照 swap 页面实现的方式计算 
            const amt = new Decimal(fromAmount || '0');
            const toWeight = amt.mul(fromTokenInfo.weight).div(Decimal(toTokenInfo.weight) || 0);
            // 完全按照 swap 页面中的算法来计算
            return toWeight.toString();
          } catch (error) {
            console.error("Error calculating swap amount:", error);
            return '0';
          }
        })();
        
        const mockSwapParams = {
          fromTokens: [
            { token: fromToken, amount: fromAmount }
          ],
          toTokens: [
            { token: toToken, amount: toAmount }
          ]
        };
        
        // Create AI response with extracted swap parameters
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: `I recommend swapping ${fromAmount} ${fromToken} for approximately ${toAmount} ${toToken} based on current rates. Would you like to proceed with this swap?`,
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
      console.log("Starting swap with params:", params);
      onSwapWithParams(params);
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
