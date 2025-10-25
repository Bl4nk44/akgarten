import React, { useState } from 'react';
// import { useMutation } from 'convex/react';
// import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

import WeatherWidget from './widgets/WeatherWidget';

export default function Contact() {
  // ... (reszta stanów bez zmian)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
    preferredDate: '',
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Usunięta mutacja Convex
  // const submitContact = useMutation(api.contacts.submitContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || !formData.inquiryType) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setIsSubmitting(true);
    
    // Symulacja wysyłania danych
    console.log("Wysyłane dane formularza:", formData);
    
    setTimeout(() => {
      try {
        // Tutaj w przyszłości będzie kod wysyłający dane do Twojego API
        
        setIsSubmitted(true);
        toast.success('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            inquiryType: '',
            message: '',
            preferredDate: '',
            newsletter: false
          });
          setIsSubmitted(false);
        }, 3000);
        
      } catch (error) {
        toast.error('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1000); // 1 sekunda opóźnienia, aby symulować zapytanie sieciowe
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const inquiryTypes = [
    'Gartenberatung',
    'Gartenpflege',
    'Gartenplanung',
    'Baumpflege',
    'Bewässerungssystem',
    'Kostenvoranschlag',
    'Sonstiges'
  ];

  return (
    // ... (JSX bez zmian)
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Kontakt aufnehmen
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein unverbindliches Angebot? 
            Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Nachricht gesendet!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... form fields remain unchanged ... */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Ihr vollständiger Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="ihre.email@beispiel.de"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="+49 (0) 123 456 789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Art der Anfrage *
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    >
                      <option value="">-- Bitte wählen --</option>
                      {inquiryTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Bevorzugter Termin
                  </label>
                  <input
                    type="datetime-local"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Beschreiben Sie Ihr Anliegen oder Projekt..."
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="text-sm text-gray-600 dark:text-gray-300">
                    Ich möchte den Newsletter mit Gartentipps und Angeboten erhalten. 
                    (Abmeldung jederzeit möglich)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
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

          {/* Weather Widget */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-xl h-full">
            <WeatherWidget />
          </div>
        </div>

        {/* Contact Information (Horizontal) */}
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
              <p className="text-gray-600 dark:text-gray-300">
                Gartenstraße 123, 12345 Musterstadt
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Telefon</h4>
              <p className="text-gray-600 dark:text-gray-300">
                +49 (0) 123 456 789
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">E-Mail</h4>
              <p className="text-gray-600 dark:text-gray-300">
                info@gartenmeister.de
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Öffnungszeiten</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Mo - Fr: 8:00 - 18:00 Uhr
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
