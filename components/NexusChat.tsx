
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { generateNexusResponse } from '../services/geminiService';
import { Message } from '../types';

const NexusChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Greetings. I am Nexus Chat. How can I assist your logical processing today?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateNexusResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "I'm sorry, I couldn't process that.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "An error occurred during nexus communication.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl">Nexus Chat</h2>
            <p className="text-zinc-500 text-xs">Powered by Gemini-3-Flash</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
          title="Clear History"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
              msg.role === 'assistant' ? 'bg-zinc-800 text-zinc-200' : 'bg-indigo-600 text-white'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.role === 'assistant' 
                  ? 'bg-zinc-900 border border-zinc-800 text-zinc-300' 
                  : 'bg-indigo-600 text-white'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-zinc-600 font-mono mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message to the Nexus..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-4 pr-16 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none min-h-[60px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-widest font-bold">
          Nexus IA may generate inaccurate information.
        </p>
      </div>
    </div>
  );
};

export default NexusChat;
