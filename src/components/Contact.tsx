import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import SeasonalCalendar from './widgets/SeasonalCalendar';

export default function Contact() {
  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    addressComponents: {
      street: '',
      streetNumber: '',
      postalCode: '',
      city: '',
    },
    message: '',
    preferredDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.addressComponents.street || !formData.message || !formData.inquiryType) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsSubmitted(true);
      toast.success('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.');
      
      setTimeout(() => {
          setFormData({
            name: '', email: '', phone: '', inquiryType: '', 
            addressComponents: { street: '', streetNumber: '', postalCode: '', city: '' },
            message: '', preferredDate: ''
          });
          setIsSubmitted(false);
        }, 3000);

    } catch (error) {
      console.error("Form submission error:", error);
      toast.error('Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      addressComponents: {
        ...prev.addressComponents,
        [name]: value
      }
    }));
  };

  const inquiryTypes = [
    'Gartenberatung', 'Gartenpflege', 'Gartenplanung', 'Baumpflege', 
    'Bewässerungssystem', 'Kostenvoranschlag', 'Sonstiges'
  ];

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Kontakt aufnehmen</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Haben Sie Fragen oder möchten Sie ein unverbindliches Angebot? Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
                    <div className="rounded-3xl">
            <SeasonalCalendar />
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
              <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4 flex flex-col h-full">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">E-Mail *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Telefon</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Art der Anfrage *</label>
                    <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]">
                      <option value="">-- Bitte wählen --</option>
                      {inquiryTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Straße *</label>
                    <input type="text" name="street" value={formData.addressComponents.street} onChange={handleAddressChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Nr. *</label>
                    <input type="text" name="streetNumber" value={formData.addressComponents.streetNumber} onChange={handleAddressChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">PLZ *</label>
                    <input type="text" name="postalCode" value={formData.addressComponents.postalCode} onChange={handleAddressChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Stadt *</label>
                    <input type="text" name="city" value={formData.addressComponents.city} onChange={handleAddressChange} required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-[46px]" />
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">Nachricht *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 flex-grow resize-none dark:text-white" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
                  {isSubmitting ? 'Wird gesendet...' : <div className="flex items-center justify-center"><Send className="h-5 w-5 mr-2" /> Nachricht senden</div>}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Unsere Kontaktinformationen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center justify-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Adresse</h4>
              <p className="text-gray-600 dark:text-gray-300">Mainzerstraße 114, 55545 Bad Kreuznach</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Telefon</h4>
              <p className="text-gray-600 dark:text-gray-300">015206136610</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">E-Mail</h4>
              <p className="text-gray-600 dark:text-gray-300">kontakt@akgarten.com</p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
