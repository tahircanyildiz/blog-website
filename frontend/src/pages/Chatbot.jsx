import { useEffect } from 'react';

function Chatbot() {
  useEffect(() => {
    window.location.replace('/chatbot.html');
  }, []);

  return null;
}

export default Chatbot;
