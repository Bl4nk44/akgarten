import { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  image?: string;
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
Dein Ton: freundlich, hilfsbereit, professionell, ermutigend
HINWEIS ZU TERMINEN UND KONTAKT:
- Wenn Nutzer nach Terminvereinbarung oder Kontakt fragen, erteile KEINE Termine im Chat.
- Verweise stets auf den telefonischen Kontakt unter 015206136610 oder auf das Kontaktformular auf der Website (Bereich "Kontakt").`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hallo! Ich bin Ihr AI Gartenassistent. Womit kann ich Ihnen heute helfen?" }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(selectedFile, options);
        setFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        setMessages(prev => [...prev, { text: "Fehler bei der Bildkomprimierung.", sender: 'bot' }]);
      }
    }
  };

  const handleSend = async () => {
    if ((input.trim() === '' && !file) || isLoading) return;

    setIsLoading(true);
    const userMessageText = input;
    const userMessage: Message = { text: userMessageText, sender: 'user' };
    
    if (preview) {
      userMessage.image = preview;
    }
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setFile(null);
    setPreview(null);

    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(new Error('File read error: ' + error));
      });

    try {
      const apiMessages: any[] = [
        { role: 'system', content: GARDEN_SYSTEM_PROMPT_DE },
        ...messages.slice(-5).map(msg => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text
        })),
      ];
      
      const userContent: any[] = [{ type: 'text', text: userMessageText }];
      if (file) {
        const base64Image = await toBase64(file);
        userContent.push({ type: 'image_url', image_url: { url: base64Image } });
      }
      
      apiMessages.push({ role: 'user', content: userContent });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        setMessages(prev => [...prev, { text: "Entschuldigung, ein Fehler ist aufgetreten.", sender: 'bot' }]);
        return;
      }

      const data = await response.json();
      const botMessage = data.text || "Keine Antwort erhalten.";
      
      setMessages(prev => [...prev, { text: botMessage, sender: 'bot' }]);
    } catch (error) {
      console.error("Error in handleSend:", error);
      setMessages(prev => [...prev, { text: "Ein schwerwiegender Fehler ist aufgetreten.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
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
        <div className={`fixed ${isMaximized ? 'inset-5' : 'bottom-20 right-5 w-96 h-[500px]'} bg-gray-900 border border-gray-700 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300`}>
          <div className="p-4 bg-green-800 text-white font-bold rounded-t-lg flex justify-between items-center cursor-move">
            <div className="flex items-center space-x-2">
              <Bot className="animate-wiggle" />
              <span>AI Gartenassistent</span>
            </div>
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
                <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'} text-white`}>
                  {msg.sender === 'user' ? (
                    <div>
                      {msg.image && <img src={msg.image} alt="User upload" className="max-w-xs rounded mb-2" />}
                      {msg.text}
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="my-2 text-left">
                <span className="inline-block p-3 rounded-lg bg-gray-700 text-white">
                  <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-2 border-t border-gray-700">
            {preview && (
              <div className="relative inline-block mb-2">
                <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                  disabled={isLoading}
                >
                  X
                </button>
              </div>
            )}
            <div className="flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleSend(); }}
                className="flex-1 bg-gray-800 text-white p-2 rounded-lg focus:outline-none disabled:opacity-50"
                placeholder="Nachricht eingeben..."
                disabled={isLoading}
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => void handleFileChange(e)} 
                className="hidden" 
                accept="image/*"
                disabled={isLoading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white transition-transform duration-150 active:scale-95 disabled:opacity-50"
                aria-label="Attach File"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button
                onClick={() => void handleSend()}
                className="p-2 text-green-500 hover:text-green-400 transition-transform duration-150 active:scale-95 disabled:opacity-50"
                aria-label="Send Message"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
