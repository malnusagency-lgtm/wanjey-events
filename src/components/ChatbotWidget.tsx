'use client';

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Message = {
  sender: 'bot' | 'user';
  text: string;
  actions?: Array<{ label: string; href: string; type: 'link' }>;
};

const ChatbotWidget = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hi there! I am your Wanjey Events AI Assistant. How can we help elevate your next corporate or lifestyle event today?\n\nAsk me about our *services*, *packages*, *pricing*, or *contact details*!",
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Typewriter CTA tooltip state
  const [ctaText, setCtaText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const fullCta = "Let's plan your event! ✦";

  useEffect(() => {
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
      return;
    }
    // Typewriter effect after 2.5s delay
    const timer = setTimeout(() => {
      setShowTooltip(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullCta.length) {
          setCtaText(fullCta.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, 2500);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) {
    return null;
  }

  const getSmartResponse = (msg: string) => {
    const text = msg.toLowerCase().trim();

    // Greetings
    if (text.match(/\b(hi|hello|hey|greetings|hola|jambo|habari)\b/)) {
      return {
        text: "Hello! How can I help you elevate your brand and execute your next event today? Ask me about our services, packages, or how to reach us.",
      };
    }

    // Packages & Pricing
    if (text.match(/\b(package|packages|pricing|price|prices|cost|costs|subscription|rate|rates|popular|professional|premium)\b/)) {
      return {
        text: "We offer 4 main packages tailored to different event scales:\n\n✦ **Essential**: Ideal for small corporate events & SME launches.\n✦ **Professional (Most Popular)**: Mid-sized events with full planning, branding, and live social media coverage.\n✦ **Premium Corporate**: Large-scale strategy, guest management, and influencer integrations.\n✦ **Custom**: Fully bespoke concepts tailored to your brand.\n\nWould you like to inspect our packages page or ask for a custom quote on WhatsApp?",
        actions: [
          { label: "View Packages Page", href: "/packages", type: "link" as const },
          { label: "Inquire on WhatsApp", href: "https://wa.me/254790381039?text=Hi%20Miss%20Wanjey%2C%20I'd%20like%20to%20inquire%20about%20your%20pricing%20and%20packages.", type: "link" as const }
        ]
      };
    }

    // Services & What we do
    if (text.match(/\b(services|what do you do|corporate|marketing|brand|activations|activation|amplification|influence|influencer|social|content)\b/)) {
      return {
        text: "We plan, execute, and amplify premium events in Kenya:\n\n✦ **Corporate Events**: Product launches, conferences, & dinners.\n✦ **Brand Activations**: Captivating experiential marketing campaigns.\n✦ **Digital Marketing**: Social strategy & content creation.\n✦ **Event Amplification**: Live event coverage & influencer integration.\n\nWould you like to explore our Services page for details?",
        actions: [
          { label: "Go to Services", href: "/services", type: "link" as const },
          { label: "Chat on WhatsApp", href: "https://wa.me/254790381039?text=Hi%20Miss%20Wanjey%2C%20I'd%20like%20to%20ask%20about%20your%20event%20services.", type: "link" as const }
        ]
      };
    }

    // Contact details
    if (text.match(/\b(contact|email|phone|whatsapp|number|address|reach|location|office|nairobi|kenya|mail|hello)\b/)) {
      return {
        text: "Here is how you can reach our coordinators directly:\n\n📧 Email: hello@misswanjey.co.ke\n📞 Phone/WhatsApp: +254 790 381 039\n📍 Location: Nairobi, Kenya\n\nOr click below to send us a direct message via our website form!",
        actions: [
          { label: "Open Contact Form", href: "/contact", type: "link" as const },
          { label: "WhatsApp Chat", href: "https://wa.me/254790381039", type: "link" as const }
        ]
      };
    }

    // Default Fallback (Getting stuck)
    return {
      text: "I want to make sure you get the most accurate details for your event! Since this is a custom request, please connect directly with our event managers on WhatsApp for instant, personalized support.",
      actions: [
        { label: "Chat on WhatsApp for Assistance", href: "https://wa.me/254790381039?text=Hi%20Miss%20Wanjey%2C%20I%20have%20a%20custom%20inquiry%20about%20your%20services.", type: "link" as const },
        { label: "Contact Us Page", href: "/contact", type: "link" as const }
      ]
    };
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue("");
    setIsTyping(true);

    // Hide typewriter CTA when user interacts
    setShowTooltip(false);

    // Simulate smart bot response typing delay
    setTimeout(() => {
      const response = getSmartResponse(userMsg);
      setMessages(prev => [...prev, { sender: 'bot', text: response.text, actions: response.actions }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-36 right-6 z-50 flex items-center md:bottom-40 md:right-8">
      {/* Live Typewriter CTA Speech Bubble */}
      <AnimatePresence>
        {showTooltip && ctaText && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mr-3 hidden sm:flex items-center rounded-xl bg-black/80 border border-accent/40 text-[#CAA365] px-3.5 py-2 text-xs font-bold shadow-lg whitespace-nowrap backdrop-blur-md relative"
          >
            {ctaText}
            <span className="inline-block w-1.5 h-3.5 bg-[#CAA365] ml-1.5 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        aria-label="Open Wanjey Chatbot"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-accent/30"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[320px] sm:w-[380px] rounded-2xl border border-accent/30 bg-[#1C120C] text-white shadow-2xl overflow-hidden flex flex-col h-[480px] md:bottom-28 md:right-8"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#2D1A10] border-b border-accent/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-black text-sm select-none">
                  W
                </div>
                <div className="text-left">
                  <h3 className="font-serif text-sm font-bold text-white tracking-wide leading-none">Wanjey Assistant</h3>
                  <span className="text-[10px] text-accent font-semibold tracking-wider uppercase mt-1 inline-block">Online • Event Expert</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#160E0A] scrollbar-thin scrollbar-thumb-accent/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[11px] sm:text-xs leading-relaxed font-sans text-left ${
                    m.sender === 'user'
                      ? 'bg-accent text-accent-foreground rounded-tr-none font-semibold shadow-md'
                      : 'bg-[#251811] text-white/95 rounded-tl-none border border-accent/15 shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.actions && (
                      <div className="mt-3 flex flex-col gap-2 pt-1.5">
                        {m.actions.map((act, idx) => (
                          <Link
                            key={idx}
                            href={act.href}
                            target={act.href.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-accent/20 hover:bg-accent/30 text-[#CAA365] hover:text-white font-bold px-3 py-2 rounded-lg border border-accent/20 text-[10px] uppercase tracking-wider text-center transition-all duration-200"
                          >
                            {act.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#251811] text-white/90 rounded-2xl rounded-tl-none border border-accent/15 px-4 py-2.5 text-xs flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#2D1A10] border-t border-accent/20 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about pricing, packages, services..."
                className="flex-1 bg-[#1C120C] border border-accent/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent font-sans"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-[#FFD6C5] hover:text-[#2D1A10] font-black px-3.5 rounded-xl transition-colors text-[10px] uppercase tracking-wider"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;
