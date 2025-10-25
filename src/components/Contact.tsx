import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export default function Contact() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const elfsightScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
      if (elfsightScript) {
        // W normalnych warunkach możnaby go usunąć, ale widgety często tego nie lubią.
        // document.body.removeChild(elfsightScript);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    address: '',
    message: '',
    preferredDate: ''
  });
  const [addressValue, setAddressValue] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address || !formData.message || !formData.inquiryType) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setIsSubmitting(true);
    console.log("Wysyłane dane formularza:", formData);
    
    setTimeout(() => {
      try {
        setIsSubmitted(true);
        toast.success('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.');
        
        setTimeout(() => {
          setFormData({
            name: '', email: '', phone: '', inquiryType: '', address: '', message: '', preferredDate: ''
          });
          setAddressValue(null);
          setIsSubmitted(false);
        }, 3000);
        
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inquiryTypes = [
    'Gartenberatung', 'Gartenpflege', 'Gartenplanung', 'Baumpflege', 
    'Bewässerungssystem', 'Kostenvoranschlag', 'Sonstiges'
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Kontakt aufnehmen
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein unverbindliches Angebot? Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
            <div className="elfsight-app-43d5de15-9eed-486d-9af5-31f916ec9032" data-elfsight-app-lazy></div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12 flex flex-col justify-center items-center h-full">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nachricht gesendet!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6 flex flex-col h-full">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" placeholder="Ihr vollständiger Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">E-Mail *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" placeholder="ihre.email@beispiel.de" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Telefon</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" placeholder="+49 (0) 123 456 789" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Art der Anfrage *</label>
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors">
                      <option value="">-- Bitte wählen --</option>
                      {inquiryTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Bevorzugter Termin</label>
                  <input type="datetime-local" name="preferredDate" value={formData.preferredDate} onChange={handleChange} className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Adresse *</label>
                  <GooglePlacesAutocomplete
                                        apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                    apiOptions={{ language: 'de' }}
                    selectProps={{
                      value: addressValue,
                      onChange: (newValue) => {
                        setAddressValue(newValue);
                        setFormData(prev => ({ ...prev, address: newValue?.label || '' }));
                      },
                      placeholder: 'Beginnen Sie mit der Eingabe Ihrer Adresse...',
                      styles: {
                        input: (provided) => ({ ...provided, padding: '1rem', borderRadius: '0.75rem', backgroundColor: '#374151', color: 'white' }),
                        control: (provided) => ({ ...provided, backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '0.75rem' }),
                        option: (provided, state) => ({ ...provided, backgroundColor: state.isFocused ? '#1f2937' : '#374151', color: 'white' }),
                        menu: (provided) => ({ ...provided, backgroundColor: '#374151' }),
                        singleValue: (provided) => ({ ...provided, color: 'white' }),
                      },
                    }}
                    autocompletionRequest={{
                      bounds: [{ lat: 54.5, lng: 5.9 }, { lat: 47.3, lng: 15.1 }],
                      componentRestrictions: { country: 'de' },
                    }}
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Nachricht *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none flex-grow" placeholder="Beschreiben Sie Ihr Anliegen oder Projekt..." />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Wird gesendet...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Nachricht senden</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Unsere Kontaktinformationen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Adresse</h4>
              <p className="text-gray-600 dark:text-gray-300">Gartenstraße 123, 12345 Musterstadt</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Telefon</h4>
              <p className="text-gray-600 dark:text-gray-300">+49 (0) 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">E-Mail</h4>
              <p className="text-gray-600 dark:text-gray-300">info@gartenmeister.de</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Öffnungszeiten</h4>
              <p className="text-gray-600 dark:text-gray-300">Mo - Fr: 8:00 - 18:00 Uhr</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

