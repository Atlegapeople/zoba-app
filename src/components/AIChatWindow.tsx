'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, ChevronDown, ChevronUp, HelpCircle, History, AlertTriangle, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  renderedCode?: string;
}

interface AIChatWindowProps {
  onCodeGenerated: (code: string) => void;
  currentCode: string;
  syntaxError?: string | null;
}

export default function AIChatWindow({ onCodeGenerated, currentCode, syntaxError }: AIChatWindowProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isFixing, setIsFixing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFixSyntax = async () => {
    if (!currentCode || !syntaxError) return;
    
    setIsFixing(true);
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `Fix this Mermaid syntax error: ${syntaxError}\nHere's the code:\n${currentCode}\n\nPlease preserve any existing node styling and ensure it follows the ZOBA color scheme:
- Delft Blue (#273469) for primary elements
- Periwinkle (#E4D9FF) for secondary elements
- Space Cadet (#1B264F) for dark elements
- Ghost White (#F5F5F5) for light elements`,
          messages: messages,
          currentCode,
          isFixRequest: true,
          styleGuide: {
            colors: {
              primary: '#273469',
              secondary: '#E4D9FF',
              dark: '#1B264F',
              light: '#F5F5F5'
            }
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to fix syntax');

      const data = await response.json();
      
      // Update the code in the editor
      onCodeGenerated(data.code);

      // Add the fixed code as a new message
      const newAssistantMessage: Message = { 
        role: 'assistant', 
        content: 'I fixed the syntax error in your diagram. Here\'s the corrected code:\n```mermaid\n' + data.code + '\n```',
        timestamp: Date.now(),
        renderedCode: data.code
      };
      setMessages(prev => [...prev, newAssistantMessage]);

      // Clear the error since we've fixed it
      if (data.code) {
        setTimeout(() => {
          onCodeGenerated(data.code);
        }, 100);
      }
    } catch (error) {
      console.error('Error fixing syntax:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while trying to fix the syntax.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsFixing(false);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    const newUserMessage: Message = { 
      role: 'user', 
      content: prompt,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `${prompt}\n\nPlease include node styling using the ZOBA color scheme. You can use these colors:
- Delft Blue (#273469) for primary elements
- Periwinkle (#E4D9FF) for secondary elements
- Space Cadet (#1B264F) for dark elements
- Ghost White (#F5F5F5) for light elements
Use style statements like this:
style NodeName fill:#color,stroke:#color,stroke-width:2px
You can also add other style properties like border-radius, font-size, etc.`,
          messages: messages,
          currentCode,
          styleGuide: {
            colors: {
              primary: '#273469',
              secondary: '#E4D9FF',
              dark: '#1B264F',
              light: '#F5F5F5'
            }
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to generate diagram');

      const data = await response.json();
      const newAssistantMessage: Message = { 
        role: 'assistant', 
        content: data.response,
        timestamp: Date.now(),
        renderedCode: data.code
      };
      setMessages(prev => [...prev, newAssistantMessage]);
      onCodeGenerated(data.code);
      setPrompt('');
    } catch (error) {
      console.error('Error generating diagram:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVersionSelect = (message: Message) => {
    if (message.renderedCode) {
      onCodeGenerated(message.renderedCode);
    }
  };

  return (
    <div 
      className={`border-t border-periwinkle/30 dark:border-periwinkle/10 bg-white/80 dark:bg-delft-blue/80 backdrop-blur-sm transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-auto'
      }`}
      style={{ fontFamily: 'var(--font-geist-sans)' }}
    >
      {/* Syntax Error Alert */}
      {syntaxError && (
        <Alert variant="destructive" className="m-4 bg-delft-blue/5 dark:bg-delft-blue/20 border-delft-blue/20 dark:border-periwinkle/20">
          <AlertTriangle className="h-4 w-4 text-delft-blue dark:text-periwinkle" />
          <AlertDescription className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="font-medium text-delft-blue dark:text-periwinkle">Syntax Error: </span>
              <span className="text-delft-blue/90 dark:text-periwinkle/90">{syntaxError}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFixSyntax}
              disabled={isFixing}
              className="bg-white/50 dark:bg-delft-blue/50 border-delft-blue/20 dark:border-periwinkle/20 text-delft-blue dark:text-periwinkle hover:bg-delft-blue/10 dark:hover:bg-delft-blue/40"
            >
              {isFixing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Wand2 className="h-4 w-4 mr-1" />
              )}
              AI Fix
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b border-periwinkle/30 dark:border-periwinkle/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gunmetal dark:text-ghost-white" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            ZOBA AI ASSISTANT
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                  <HelpCircle className="h-4 w-4 text-delft-blue/70 dark:text-periwinkle/70" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px] p-3">
                <p className="text-xs">
                  I'm your diagram assistant. I can help with:
                  <br/>• Creating new Mermaid diagrams
                  <br/>• Modifying diagram elements and connections
                  <br/>• Changing diagram styles and colors
                  <br/>• Adjusting diagram layout
                  <br/><br/>Note: I can only assist with diagram-related tasks.
                  <br/>Press Enter to send, Shift+Enter for new line
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gunmetal dark:text-ghost-white hover:bg-periwinkle/10 dark:hover:bg-periwinkle/5"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      {/* Last Assistant Message */}
      {messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isExpanded && (
        <ScrollArea className="max-h-[120px] px-4 py-2 bg-delft-blue/5 dark:bg-delft-blue/20">
          <div className="text-sm text-gunmetal dark:text-ghost-white whitespace-pre-wrap">
            {messages[messages.length - 1].content}
          </div>
          {messages[messages.length - 1].renderedCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVersionSelect(messages[messages.length - 1])}
              className="mt-2 text-xs text-delft-blue dark:text-periwinkle hover:bg-delft-blue/10 dark:hover:bg-periwinkle/10"
            >
              <History className="h-3 w-3 mr-1" />
              Use this version
            </Button>
          )}
        </ScrollArea>
      )}
      
      {/* Chat History */}
      {isExpanded && (
        <ScrollArea className="h-72 px-4 py-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-periwinkle text-gunmetal dark:text-gunmetal'
                    : 'bg-delft-blue/10 dark:bg-delft-blue/20 text-gunmetal dark:text-ghost-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.renderedCode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVersionSelect(message)}
                    className="mt-2 text-xs text-delft-blue dark:text-periwinkle hover:bg-delft-blue/10 dark:hover:bg-periwinkle/10"
                  >
                    <History className="h-3 w-3 mr-1" />
                    Use this version
                  </Button>
                )}
              </div>
              <div className="text-xs text-gunmetal/50 dark:text-ghost-white/50 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="p-4">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me what diagram you want to create or modify..."
            className="resize-none bg-white dark:bg-space-cadet border-periwinkle/30 dark:border-periwinkle/10 text-gunmetal dark:text-ghost-white"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
            rows={2}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="bg-delft-blue hover:bg-space-cadet text-ghost-white transition-all duration-200 self-end"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 