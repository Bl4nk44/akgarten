import { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const GARDEN_SYSTEM_PROMPT_DE = `Du bist ein erfahrener Experte für Gartenbau und Pflanzen mit Spezialisierung auf:
- Identifikation von Pflanzenkrankheiten und Schädlingen
- Beratung zur Pflanzenpflege von Zier- und Nutzpflanzen
- Planung und Gestaltung von Gärten
- Saisonale Gartenarbeiten
- Düngung und Bewässerung
- Vermehrung von Pflanzen
- Auswahl von Pflanzen für Bodenverhältnisse und Klimabedingungen
- Nachhaltige Gartenpraktiken und ökologischer Anbau
REGELN:
1. Antworte NUR auf Fragen, die sich auf Gartenbau, Pflanzen und Gartenarbeiten beziehen
2. Wenn eine Frage nichts mit Gartenbau zu tun hat, antworte höflich: "Entschuldigung, ich bin ein Spezialist für Gartenbau und kann nur Fragen zu Pflanzen und Gartenarbeit beantworten."
3. Antworte prägnant, sachlich und auf Deutsch
4. Nenne, wenn möglich, konkrete Pflanzennamen (deutsche und lateinische Namen)
5. Berücksichtige die Jahreszeit bei deinen Empfehlungen
6. Wenn du dir nicht sicher bist, empfehle eine Konsultation mit einem lokalen Fachmann
7. Sei freundlich und hilfsbereit, vermeide technisches Fachjargon für Anfänger
BESONDERHEITEN:
- Bei Schädlingsfragen: Nenne zunächst das Problem, dann empfehle biologische Lösungen bevor du chemische Mittel erwähnst
- Bei Bewässerung: Beachte Bodenbeschaffenheit und Wetterbedingungen
- Bei Gartenbau in Deutschland: Berücksichtige die lokalen Klimazonen und Frosttermine
- Bei kleineren Balkongärten oder Hochbeeten: Gebe spezifische Tipps für begrenzte Räume
Dein Ton: freundlich, hilfsbereit, professionell, ermutigend`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hallo! Ich bin Ihr Gartenassistent. Womit kann ich Ihnen heute helfen?" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const apiMessages = [
      { role: 'system', content: GARDEN_SYSTEM_PROMPT_DE },
      ...messages.slice(-5).map(msg => ({
        role: msg.sender === 'bot' ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: 'user', content: input }
    ];

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: apiMessages }),
    });

    if (!response.ok || !response.body) {
      setMessages(prev => [...prev, { text: "Entschuldigung, ein Fehler ist aufgetreten.", sender: 'bot' }]);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botMessage = '';

    setMessages(prev => [...prev, { text: "...", sender: 'bot' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      botMessage += decoder.decode(value, { stream: true });
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = botMessage;
        return newMessages;
      });
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-green-800 text-white p-5 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-150 active:scale-95 z-50 animate-pulse"
        aria-label="Toggle Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      {isOpen && (
        <div className={`fixed ${isMaximized ? 'bottom-5 right-5 w-[500px] h-[70vh]' : 'bottom-20 right-5 w-80 h-96'} bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300`}>
          <div className="p-4 bg-green-800 text-white font-bold rounded-t-lg flex justify-between items-center">
            <span>Gartenassistent</span>
            <div>
              <button onClick={toggleMaximize} className="text-white hover:text-gray-300 mr-2 transition-transform duration-150 active:scale-95" aria-label={isMaximized ? "Minimize Chat" : "Maximize Chat"}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMaximized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20H4v-6M14 4h6v6M20 4L4 20" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 16v4h-4M4 20l8-8 8 8M20 4l-8 8-8-8" />
                  )}
                </svg>
              </button>
              <button onClick={toggleChat} className="text-white hover:text-gray-300 transition-transform duration-150 active:scale-95" aria-label="Close Chat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}>
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t border-gray-700 flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
              placeholder="Nachricht eingeben..."
            />
            <button
              onClick={() => alert('Dateianhang in Kürze verfügbar!')}
              className="p-2 text-gray-400 hover:text-white transition-transform duration-150 active:scale-95"
              aria-label="Attach File"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button
              onClick={handleSend}
              className="p-2 text-green-500 hover:text-green-400 transition-transform duration-150 active:scale-95"
              aria-label="Send Message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;


