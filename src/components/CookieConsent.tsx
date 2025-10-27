import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set consent in localStorage and hide the bar
    localStorage.setItem('cookie_consent', 'true');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-center z-50">
      <p className="text-sm mr-4">
        Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern. Mit der Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu.
      </p>
      <button 
        onClick={acceptCookies}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Akzeptieren
      </button>
    </div>
  );
}
