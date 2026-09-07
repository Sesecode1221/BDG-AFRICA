import React, { useState, useRef, useEffect } from 'react';
import { Building, AssessmentMetrics, AnomalyItem, ChatMessage } from '../types';
import { MessageSquare, Send, Sparkles, X, ChevronUp, Bot, User, ShieldCheck, CornerDownLeft, Loader2, ArrowRight } from 'lucide-react';

interface AgentChatDrawerProps {
  building: Building;
  metrics: AssessmentMetrics;
  anomalies: AnomalyItem[];
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
}

export const AgentChatDrawer: React.FC<AgentChatDrawerProps> = ({
  building,
  metrics,
  anomalies,
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I am your **GreenBDG AI Decarbonisation Advisor** for **${building.name}**.\n\nI operate on verified smart meter interval telemetry and Eskom grid emissions data (0.92 kg CO₂e/kWh). I can help investigate performance shifts, explain tariff penalties, or evaluate decarbonisation pathways.\n\nHow can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        'Why did energy consumption increase 18.96%?',
        'How to fix the 18.2 kW night baseload spike?',
        'What is the payback on a 60 kWh BESS battery?',
        'How does Bertha House achieve Net Zero Carbon by 2030?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Handle initial prompt from parent components (e.g. clicking "Consult Agent")
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          building,
          metrics,
          anomalies,
          history: messages,
        }),
      });

      if (!response.ok) throw new Error('Chat API call failed');
      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        suggestedFollowups: data.suggestedFollowups,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `I apologize, but I encountered an issue analyzing this telemetry point. Please try asking again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-[#E2E8E4] shadow-2xl flex flex-col text-[#1A2E22]">
      {/* Drawer Header */}
      <div className="p-4 bg-white border-b border-[#E2E8E4] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EAF5EE] border border-[#CDE5D5] flex items-center justify-center text-[#166534]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-[#1A2E22] flex items-center gap-2">
              <span>Decarbonisation Copilot</span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#EAF5EE] text-[#166534] border border-[#CDE5D5]">
                Gemini 3.7 Flash
              </span>
            </div>
            <div className="text-[11px] text-[#61776B]">
              Grounded on {building.name} verified smart meter logs
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#61776B] hover:text-[#1A2E22] hover:bg-[#F4F7F5] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm bg-[#F8FAF8]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#61776B] px-1 font-medium">
              {msg.sender === 'agent' ? (
                <>
                  <Bot className="w-3.5 h-3.5 text-[#166534]" />
                  <span className="font-bold text-[#1A2E22]">GreenBDG Advisor</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span className="font-bold text-[#1A2E22]">You</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl p-3.5 max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#166534] text-white rounded-tr-none shadow-sm'
                  : 'bg-white border border-[#E2E8E4] text-[#1A2E22] rounded-tl-none space-y-2 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 mt-2 border-t border-[#E2E8E4] text-[10px] text-[#61776B]">
                  <div className="font-bold text-[#1A2E22] mb-0.5">Verified Data Sources:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[#166534] font-medium">
                    {msg.citations.map((cite, i) => (
                      <li key={i}>{cite}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Suggested Followups */}
            {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {msg.suggestedFollowups.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#F4F7F5] border border-[#E2E8E4] text-[#166534] hover:text-[#14532D] font-medium transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-[#61776B] text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#166534]" />
            <span>Analyzing interval load correlations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-[#E2E8E4]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 bg-[#F8FAF8] border border-[#E2E8E4] rounded-xl px-3 py-2 focus-within:border-[#166534] focus-within:bg-white transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Bertha House interval loads, tariffs, or ECMs..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-[#1A2E22] placeholder:text-[#8E9B93] focus:outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="w-8 h-8 rounded-lg bg-[#166534] hover:bg-[#14532D] disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="text-[10px] text-[#61776B] text-center mt-1.5 font-medium">
          AI answers are strictly anchored to verified smart meter telemetry.
        </div>
      </div>
    </div>
  );
};
