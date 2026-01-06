import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  X, 
  ChevronRight, 
  BookOpen, 
  Zap, 
  HelpCircle, 
  MessageSquare, 
  Search, 
  Lightbulb, 
  Keyboard, 
  ArrowRight,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Mic,
  MicOff,
  Send,
  Volume2,
  Smile,
  Meh,
  Frown,
  ShieldAlert,
  Activity,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { processQuery } from '../services/nlpService';
import type { Message } from '../services/nlpService';
import { PANEL_DOCS } from '../data/panelDocs';

// Speech Recognition Types
interface SpeechRecognitionEvent extends Event {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

const AIAssistant: React.FC<{ activePanelId: string; isOpen: boolean; onClose: () => void }> = ({ activePanelId, isOpen, onClose }) => {
  const [view, setView] = useState<'main' | 'panel-info' | 'walkthrough' | 'knowledge' | 'chat' | 'benchmarks' | 'diagnostics'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [language, setLanguage] = useState('English');
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const panel = PANEL_DOCS[activePanelId] || PANEL_DOCS['editor'];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = useCallback(async (text?: string) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await processQuery(query, { activePanelId, history: messages });
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString(),
        sentiment: result.sentiment,
        intent: result.intent,
        latency: result.latency,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (isSpeaking) {
        speak(result.content);
      }
    } catch {
      const errorMessage: Message = {
        role: 'system',
        content: "I encountered an error processing your request. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [activePanelId, inputValue, isSpeaking, messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const WindowSpeechRecognition = (window as unknown as { SpeechRecognition: SpeechRecognitionConstructor }).SpeechRecognition || 
                                      (window as unknown as { webkitSpeechRecognition: SpeechRecognitionConstructor }).webkitSpeechRecognition;
      if (WindowSpeechRecognition) {
        recognitionRef.current = new WindowSpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          recognitionRef.current.lang = 'en-US';

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            setInputValue(transcript);
            handleSendMessage(transcript);
            setIsListening(false);
          };

          recognitionRef.current.onerror = () => {
            setIsListening(false);
          };

          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
        }
      }
    }
  }, [handleSendMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">AI Assistant</h2>
            <div className="flex items-center space-x-1.5 text-[10px] text-green-500 font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Context Aware: {panel.title}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setView('chat')}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${view === 'chat' ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
            title="Chat with AI"
          >
            <MessageSquare size={18} />
          </button>
          <button 
            onClick={() => setView('knowledge')}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${view === 'knowledge' ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
            title="Search Knowledge Base"
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => setView('diagnostics')}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${view === 'diagnostics' ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 hover:text-white'}`}
            title="Problems & Diagnostics"
          >
            <ShieldAlert size={18} />
          </button>
          <button 
            onClick={() => setView('benchmarks')}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-all ${view === 'benchmarks' ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-white'}`}
            title="System Benchmarks"
          >
            <TrendingUp size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {view === 'chat' && (
          <div className="flex flex-col h-full bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-300">New Conversation</h3>
                    <p className="text-xs text-slate-500 mt-1">Ask me anything about your AI models, code, or the studio tools.</p>
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10' 
                      : msg.role === 'system'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center w-full rounded-lg'
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-1.5">
                          {msg.sentiment === 'positive' && <Smile size={12} className="text-green-500" />}
                          {msg.sentiment === 'neutral' && <Meh size={12} className="text-slate-500" />}
                          {msg.sentiment === 'negative' && <Frown size={12} className="text-red-500" />}
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {msg.intent || 'Response'}
                          </span>
                        </div>
                        {msg.latency && (
                          <span className="text-[9px] font-mono text-slate-600">{msg.latency}ms</span>
                        )}
                      </div>
                    )}
                    <p className="text-xs leading-relaxed">{msg.content}</p>
                    <span className="text-[9px] text-slate-500 mt-1.5 block opacity-50">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 border border-slate-700/50">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-slate-950/50 border-t border-slate-800">
              <div className="relative flex items-center space-x-2">
                <button 
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  title={isListening ? 'Listening...' : 'Start Voice Input'}
                >
                  {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <div className="flex-grow relative">
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your project..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button 
                    onClick={() => setIsSpeaking(!isSpeaking)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isSpeaking ? 'text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}
                    title={isSpeaking ? 'Text-to-Speech ON' : 'Text-to-Speech OFF'}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-4">
                <button 
                  onClick={() => handleSendMessage("Explain this panel")}
                  className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
                >
                  Explain Panel
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <button 
                  onClick={() => handleSendMessage("How to deploy?")}
                  className="text-[10px] font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-wider"
                >
                  Deploy Guide
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <button 
                  onClick={() => setMessages([])}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'main' && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center">
                <Lightbulb size={16} className="mr-2" />
                Quick Actions
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                How can I help you with the <strong>{panel.title}</strong> today?
              </p>
              <div className="space-y-2">
                <button 
                  onClick={() => setView('chat')}
                  className="w-full flex items-center justify-between p-3 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl text-xs text-blue-200 border border-blue-500/30 transition-all group shadow-lg shadow-blue-600/5"
                >
                  <span className="flex items-center">
                    <MessageSquare size={14} className="mr-2 text-blue-400" />
                    Start a conversation
                  </span>
                  <ChevronRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setView('panel-info')}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-xs text-slate-200 border border-slate-700/50 transition-all group"
                >
                  <span className="flex items-center">
                    <BookOpen size={14} className="mr-2 text-blue-500" />
                    Explain this panel
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
                <button 
                  onClick={() => setView('walkthrough')}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-xs text-slate-200 border border-slate-700/50 transition-all group"
                >
                  <span className="flex items-center">
                    <Zap size={14} className="mr-2 text-amber-500" />
                    Interactive Walkthrough
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Recommended for you</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                      <TrendingUp size={16} />
                    </div>
                    <ArrowRight size={14} className="text-slate-700 group-hover:text-purple-400 transition-all" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">Optimize Batch Sizes</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Learn how to improve training throughput in this panel.</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                      <Keyboard size={16} />
                    </div>
                    <ArrowRight size={14} className="text-slate-700 group-hover:text-green-400 transition-all" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">Keyboard Shortcuts</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Master the {panel.title} with power-user shortcuts.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'panel-info' && (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setView('main')}
              className="flex items-center text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors mb-4"
            >
              <ChevronRight size={12} className="rotate-180 mr-1" />
              BACK TO ASSISTANT
            </button>

            <div>
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{panel.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{panel.purpose}</p>
            </div>

            <div className="space-y-6">
              <section>
                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Core Use Cases</h4>
                <ul className="space-y-2">
                  {panel.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start text-xs text-slate-300">
                      <div className="mt-1 mr-2 w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3">Key Features</h4>
                <div className="flex flex-wrap gap-2">
                  {panel.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[10px] font-bold text-slate-300">
                      {f}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-3">Data Flow & Integration</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Input/Output</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{panel.inputsOutputs}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">System Links</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{panel.integrations}</p>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-3">Keyboard Shortcuts</h4>
                <div className="space-y-2">
                  {panel.shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800/50">
                      <span className="text-xs text-slate-400">{s.action}</span>
                      <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-blue-400">{s.key}</kbd>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Best Practices</h4>
                <div className="space-y-3">
                  {panel.bestPractices.map((bp, i) => (
                    <div key={i} className="flex items-start p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                      <HelpCircle size={14} className="mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300 leading-normal">{bp}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {view === 'diagnostics' && (
          <div className="flex flex-col h-full bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-800">
              <button 
                onClick={() => setView('main')}
                className="flex items-center text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors mb-4"
              >
                <ChevronRight size={12} className="rotate-180 mr-1" />
                BACK TO ASSISTANT
              </button>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">System health and code quality audit results.</p>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Overall Health Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity size={80} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live Audit Status</span>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-1">92/100</h4>
                  <p className="text-xs text-slate-400">Excellent health with minor warnings in the deployment pipeline.</p>
                </div>
              </div>

              {/* Active Issues */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Issues (3)</h4>
                  <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-black rounded uppercase">Priority Required</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { 
                      type: 'warning', 
                      title: 'Model Version Mismatch', 
                      desc: 'The MNIST-v1 deployment uses a slightly older weight version than the local workspace.', 
                      time: '2m ago',
                      icon: AlertCircle,
                      color: 'text-amber-500',
                      bg: 'bg-amber-500/5',
                      border: 'border-amber-500/10'
                    },
                    { 
                      type: 'info', 
                      title: 'Optimization Suggestion', 
                      desc: 'Detected 3 large dataset files that could be converted to Parquet for 40% faster loading.', 
                      time: '15m ago',
                      icon: Lightbulb,
                      color: 'text-blue-500',
                      bg: 'bg-blue-500/5',
                      border: 'border-blue-500/10'
                    },
                    { 
                      type: 'success', 
                      title: 'Prisma Migration Successful', 
                      desc: 'Database schema successfully updated to version 1.4.2.', 
                      time: '1h ago',
                      icon: CheckCircle2,
                      color: 'text-green-500',
                      bg: 'bg-green-500/5',
                      border: 'border-green-500/10'
                    }
                  ].map((issue, i) => (
                    <div key={i} className={`${issue.bg} ${issue.border} border rounded-xl p-4 transition-all hover:translate-x-1 cursor-pointer`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <issue.icon size={16} className={issue.color} />
                          <h5 className="text-xs font-bold text-slate-200">{issue.title}</h5>
                        </div>
                        <span className="text-[9px] text-slate-600 font-mono">{issue.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal pl-6">{issue.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Logs Snippet */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Diagnostic Logs</h4>
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[9px] space-y-1 overflow-x-auto">
                  <div className="flex space-x-2">
                    <span className="text-slate-600">[10:42:01]</span>
                    <span className="text-blue-500">INFO</span>
                    <span className="text-slate-400">Inference service heartbeat received. Latency: 42ms</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-slate-600">[10:42:15]</span>
                    <span className="text-amber-500">WARN</span>
                    <span className="text-slate-400">High memory usage detected in Editor worker (84%).</span>
                  </div>
                  <div className="flex space-x-2">
                    <span className="text-slate-600">[10:43:05]</span>
                    <span className="text-blue-500">INFO</span>
                    <span className="text-slate-400">Auto-save triggered for main.py (342 bytes written).</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2">
                <Activity size={14} className="text-blue-500" />
                <span>Run Full System Scan</span>
              </button>
            </div>
          </div>
        )}

        {view === 'benchmarks' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
            <button 
              onClick={() => setView('main')}
              className="flex items-center text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors mb-4"
            >
              <ChevronRight size={12} className="rotate-180 mr-1" />
              BACK TO ASSISTANT
            </button>

            <div>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight uppercase">System Benchmarks</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Real-time performance tracking of the AI Studio Assistant pipeline.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Intent Accuracy</span>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-black text-green-500">98.4%</span>
                  <TrendingUp size={14} className="text-green-500 mb-1" />
                </div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Avg. Latency</span>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-black text-blue-500">342ms</span>
                  <Zap size={14} className="text-blue-500 mb-1" />
                </div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Error Rate</span>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-black text-slate-300">0.2%</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Context Depth</span>
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-black text-purple-500">10msg</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Pipeline Health</h4>
              <div className="space-y-3">
                {[
                  { label: 'NLP Engine (Transformer-v4)', status: 'Optimal', load: '12%' },
                  { label: 'Knowledge Graph Index', status: 'Stable', load: '4%' },
                  { label: 'Voice Processing Unit', status: 'Active', load: '1%' },
                  { label: 'Sentiment Classifier', status: 'Optimal', load: '2%' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <div>
                      <p className="text-xs font-bold text-slate-300">{s.label}</p>
                      <p className="text-[9px] text-green-500 uppercase font-black">{s.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500">System Load</p>
                      <p className="text-xs font-mono text-slate-400">{s.load}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'knowledge' && (
          <div className="p-6 space-y-6 animate-in fade-in duration-300">
             <button 
              onClick={() => setView('main')}
              className="flex items-center text-[10px] font-bold text-slate-500 hover:text-blue-500 transition-colors mb-4"
            >
              <ChevronRight size={12} className="rotate-180 mr-1" />
              BACK TO ASSISTANT
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Knowledge Categories</h4>
              <div className="grid grid-cols-2 gap-3">
                {['Architectures', 'Hyperparameters', 'Deployment', 'Optimization', 'Security', 'APIs'].map(cat => (
                  <button key={cat} className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left">
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Feedback */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/30">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Helpful?</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSatisfaction(1)}
              className={`p-1.5 rounded-lg transition-all ${satisfaction === 1 ? 'bg-green-500/20 text-green-500' : 'text-slate-600 hover:text-slate-300'}`}
            >
              <ThumbsUp size={16} />
            </button>
            <button 
              onClick={() => setSatisfaction(0)}
              className={`p-1.5 rounded-lg transition-all ${satisfaction === 0 ? 'bg-red-500/20 text-red-500' : 'text-slate-600 hover:text-slate-300'}`}
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <div className="flex items-center space-x-2 text-slate-600">
            <Globe size={14} />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-[10px] font-bold uppercase focus:outline-none hover:text-slate-300 cursor-pointer"
            >
              <option value="English">EN</option>
              <option value="Spanish">ES</option>
              <option value="French">FR</option>
              <option value="Chinese">ZH</option>
            </select>
          </div>
          <span className="text-[10px] text-slate-700 font-mono">v1.2.0-beta</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
