import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Marine & Fishery Assistant. I can help you with:\n\n• Marine ecosystems and fish species identification\n• Fisheries and fishing practices\n• Seasonal fishing bans and regulations\n• Fishery sustainability and conservation\n• Marine pollution and safety\n• Aquaculture and seafood quality\n\nI focus on Indian marine and fisheries context. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call OpenAI-compatible API for marine-focused responses
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI Marine & Fishery Assistant.

Your role is to help users with information related to:
- Marine ecosystems
- Fish species identification
- Fisheries and fishing practices
- Seasonal fishing bans
- Fishery regulations and sustainability
- Marine pollution and safety
- Aquaculture and seafood quality

Guidelines:
- Use simple, clear, and non-technical language.
- Prefer Indian marine and fisheries context unless the user specifies another region.
- Clearly indicate status when relevant: ALLOWED / RESTRICTED / BANNED.
- Explain reasons briefly and responsibly.
- Promote sustainable fishing and marine conservation.
- If information is uncertain, say so honestly and suggest contacting local fisheries authorities.
- Avoid giving illegal, harmful, or unsafe advice.
- Ask follow-up questions only when necessary (e.g., location, fish name, season).

Tone:
- Friendly, respectful, and educational.
- Suitable for fishermen, students, vendors, and general users.

Keep responses concise (under 200 words) and actionable.`,
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'user',
              content: currentInput,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat API error:', error);
      
      // Fallback to local marine-themed responses if API fails
      const fallbackResponse = generateMarineResponse(currentInput);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMarineResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Fishing regulations and bans
    if (lowerInput.includes('ban') || lowerInput.includes('season') || lowerInput.includes('regulation')) {
      return 'India has seasonal fishing bans to protect marine life during breeding seasons:\n\n• West Coast: April 15 - May 31 (61 days)\n• East Coast: April 15 - June 14 (61 days)\n\nDuring these periods, fishing is BANNED for mechanized vessels. Traditional fishermen may have exemptions. Check with your local fisheries department for specific regulations in your area.';
    }

    // Fish species identification
    if (lowerInput.includes('fish') || lowerInput.includes('species') || lowerInput.includes('identify')) {
      return 'I can help identify fish species! You can:\n\n• Use our Fish ID feature to upload fish images for AI identification\n• Describe the fish (color, size, location caught)\n• Ask about specific species\n\nCommon Indian marine fish include: Pomfret, Mackerel, Sardines, Tuna, Kingfish, Hilsa, and Prawns. What would you like to know?';
    }

    // Sustainability and conservation
    if (lowerInput.includes('sustain') || lowerInput.includes('conservation') || lowerInput.includes('protect')) {
      return 'Sustainable fishing practices are crucial for marine conservation:\n\n• Follow seasonal fishing bans\n• Avoid catching juvenile fish (let them grow and breed)\n• Use selective fishing gear to reduce bycatch\n• Report illegal fishing activities\n• Support Marine Protected Areas (MPAs)\n\nSustainable fishing ensures fish populations remain healthy for future generations.';
    }

    // Marine pollution
    if (lowerInput.includes('pollution') || lowerInput.includes('plastic') || lowerInput.includes('waste')) {
      return 'Marine pollution is a serious threat to ocean health:\n\n• Avoid dumping plastic and waste in the ocean\n• Properly dispose of fishing nets and gear\n• Participate in beach cleanup drives\n• Report oil spills or major pollution incidents\n• Use biodegradable materials when possible\n\nHealthy oceans mean healthy fish populations and better livelihoods for fishing communities.';
    }

    // Aquaculture
    if (lowerInput.includes('aquaculture') || lowerInput.includes('fish farm') || lowerInput.includes('culture')) {
      return 'Aquaculture (fish farming) is growing in India:\n\n• Common species: Shrimp, Tilapia, Catfish, Carp\n• Requires proper water quality management\n• Follow MPEDA and state fisheries guidelines\n• Ensure disease prevention and biosecurity\n• Consider environmental impact\n\nContact your local fisheries department for aquaculture licensing and training programs.';
    }

    // Seafood quality and safety
    if (lowerInput.includes('quality') || lowerInput.includes('fresh') || lowerInput.includes('safe') || lowerInput.includes('eat')) {
      return 'Fresh seafood quality indicators:\n\n✓ FRESH: Clear eyes, firm flesh, mild ocean smell, bright red gills\n✗ SPOILED: Cloudy eyes, soft flesh, strong fishy odor, brown gills\n\nSafety tips:\n• Buy from licensed vendors\n• Store fish on ice or refrigerate immediately\n• Cook thoroughly to kill bacteria\n• Avoid fish from polluted waters\n\nWhen in doubt, don\'t consume!';
    }

    // Platform features
    if (lowerInput.includes('platform') || lowerInput.includes('feature') || lowerInput.includes('how to use')) {
      return 'AquaMind Platform features:\n\n• Analytics: Real-time data, AI insights, and advanced analytics\n• Features: Comprehensive platform capabilities and tools\n• About: Learn about our mission and sustainability impact\n\nNavigate using the menu at the top. Need help with a specific feature?';
    }

    // General help
    if (lowerInput.includes('help')) {
      return 'I\'m here to help with:\n\n• Marine ecosystems and fish species\n• Fishing regulations and seasonal bans\n• Sustainable fishing practices\n• Marine pollution and safety\n• Aquaculture and fish farming\n• Seafood quality and freshness\n• Platform navigation\n\nWhat specific information do you need? You can also specify your location or region for more relevant information.';
    }

    // Default response
    return 'Thank you for your question! I specialize in marine and fishery topics including:\n\n• Fish species identification\n• Fishing regulations and bans\n• Sustainable fishing practices\n• Marine conservation\n• Seafood quality and safety\n\nCould you please provide more details? If you need location-specific information, please mention your region or state.';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Marine & Fishery Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about fishing, species, regulations..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
