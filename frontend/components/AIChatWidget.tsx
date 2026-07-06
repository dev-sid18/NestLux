"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import ReactMarkdown from "react-markdown";

export default function AIChatWidget() {
  const { context } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! I'm your global NestLux AI assistant. How can I help you find your dream home today?" }
  ]);
  
  useEffect(() => {
    // Show greeting after 2 seconds to make it obvious
    const timer = setTimeout(() => setShowGreeting(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, context: context }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", content: "Sorry, I am having trouble connecting right now." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Connection error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[450px] glass-card rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col h-[600px] border border-gold/20"
          >
            {/* Header */}
            <div className="bg-navy/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5 text-gold" />
                <span className="font-bold">NestLux AI Unit</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-gold text-navy rounded-tr-sm' : 'glass-card bg-white/5 rounded-tl-sm text-foreground/90 overflow-hidden'}`}>
                    {msg.role === 'ai' ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-li:my-1">
                        <ReactMarkdown>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-card bg-white/5 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-background/80">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about this property..."
                  className="w-full bg-background/50 border border-foreground/10 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-gold"
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping}
                  className="absolute right-2 top-2 p-1.5 bg-gold text-navy rounded-full hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-4">
        <AnimatePresence>
          {!isOpen && showGreeting && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="mb-2 relative"
            >
              <div className="bg-navy text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm shadow-xl border border-gold/20 flex items-center gap-2 whitespace-nowrap">
                <Bot className="w-4 h-4 text-gold" />
                How can I help you?
                <button onClick={(e) => { e.stopPropagation(); setShowGreeting(false); }} className="ml-2 text-white/50 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          animate={!isOpen ? { y: [0, -15, 0] } : { y: 0 }}
          transition={!isOpen ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsOpen(!isOpen); setShowGreeting(false); }}
          className="p-5 bg-gold text-navy rounded-full shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
          {isOpen ? <X className="w-8 h-8 relative z-10" /> : <Bot className="w-8 h-8 relative z-10" />}
        </motion.button>
      </div>
    </>
  );
}
