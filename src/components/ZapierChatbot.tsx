import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Zap, RefreshCw } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': any;
    }
  }
}

const ZapierChatbot: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeChatbot = async () => {
    try {
      setError(null);
      setLoadingAttempts(prev => prev + 1);
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Remove any existing chatbot
      const existingChatbot = document.querySelector('zapier-interfaces-chatbot-embed');
      if (existingChatbot) {
        existingChatbot.remove();
      }
      
      // Remove existing script
      const existingScript = document.querySelector('script[src*="zapier-interfaces"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Load script fresh
      const script = document.createElement('script');
      script.async = true;
      script.type = 'module';
      script.src = 'https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js';
      
      script.onload = () => {
        setTimeout(() => {
          // Create chatbot element
          const chatbotElement = document.createElement('zapier-interfaces-chatbot-embed');
          chatbotElement.setAttribute('is-popup', 'true');
          chatbotElement.setAttribute('chatbot-id', 'cmcg57pqa003r1219v29cf5nj');
          
          // Add to body
          document.body.appendChild(chatbotElement);
          
          // Mark as loaded
          setIsLoaded(true);
          setError(null);
          
        }, 1000);
      };
      
      script.onerror = () => {
        setError('Failed to load chatbot');
        
        if (loadingAttempts < 2) {
          setTimeout(() => {
            initializeChatbot();
          }, 2000);
        }
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  useEffect(() => {
    initializeChatbot();
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  const openChatbot = () => {
    const zapierChatbot = document.querySelector('zapier-interfaces-chatbot-embed') as any;
    if (zapierChatbot) {
      try {
        // Force show the chatbot
        zapierChatbot.style.display = 'block';
        zapierChatbot.style.visibility = 'visible';
        zapierChatbot.style.opacity = '1';
        zapierChatbot.style.pointerEvents = 'auto';
        
        // Try multiple methods to open
        if (typeof zapierChatbot.open === 'function') {
          zapierChatbot.open();
        }
        
        if (typeof zapierChatbot.show === 'function') {
          zapierChatbot.show();
        }
        
        // Set attributes
        zapierChatbot.setAttribute('data-state', 'open');
        zapierChatbot.setAttribute('open', 'true');
        zapierChatbot.removeAttribute('hidden');
        
        // Dispatch events
        const openEvent = new CustomEvent('chatbot-open', { bubbles: true });
        zapierChatbot.dispatchEvent(openEvent);
        
        // Click to trigger
        zapierChatbot.click();
        
        setIsVisible(true);
        
      } catch (error) {
        initializeChatbot();
      }
    } else {
      initializeChatbot();
    }
  };

  const closeChatbot = () => {
    const zapierChatbot = document.querySelector('zapier-interfaces-chatbot-embed') as any;
    if (zapierChatbot) {
      try {
        // Force hide the chatbot
        zapierChatbot.style.display = 'none';
        zapierChatbot.style.visibility = 'hidden';
        zapierChatbot.style.opacity = '0';
        
        // Try built-in close methods
        if (typeof zapierChatbot.close === 'function') {
          zapierChatbot.close();
        }
        
        if (typeof zapierChatbot.hide === 'function') {
          zapierChatbot.hide();
        }
        
        // Set attributes
        zapierChatbot.setAttribute('data-state', 'closed');
        zapierChatbot.removeAttribute('open');
        zapierChatbot.setAttribute('hidden', 'true');
        
        setIsVisible(false);
        
      } catch (error) {
        setIsVisible(false);
      }
    }
  };

  const retryInitialization = () => {
    setIsLoaded(false);
    setError(null);
    setLoadingAttempts(0);
    initializeChatbot();
  };

  return (
    <>
      {/* Simple Floating Button - No Annoying Elements */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openChatbot}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              {/* Simple Icon */}
              {!isLoaded && !error ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-8 h-8" />
                </motion.div>
              ) : (
                <Bot className="w-8 h-8" />
              )}
              
              {/* Simple Status Dot */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isLoaded ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
            </motion.button>

            {/* Simple Retry Button for Errors */}
            {error && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={retryInitialization}
                className="absolute -top-10 right-0 px-2 py-1 bg-red-500 rounded text-white text-xs"
              >
                Retry
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Close Button */}
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={closeChatbot}
            className="fixed bottom-6 right-6 z-50 p-3 bg-red-500 rounded-full text-white shadow-lg"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Clean Styling - No Interference */}
      <style jsx global>{`
        /* Clean chatbot positioning */
        zapier-interfaces-chatbot-embed {
          position: fixed !important;
          bottom: 80px !important;
          right: 20px !important;
          z-index: 45 !important;
          width: 400px !important;
          height: 600px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
        }

        /* Show when open */
        zapier-interfaces-chatbot-embed[data-state="open"],
        zapier-interfaces-chatbot-embed[open="true"] {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        /* Hide when closed */
        zapier-interfaces-chatbot-embed[data-state="closed"],
        zapier-interfaces-chatbot-embed[hidden="true"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Clean iframe */
        zapier-interfaces-chatbot-embed iframe {
          border-radius: 16px !important;
          border: none !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* Hide default buttons */
        zapier-interfaces-chatbot-embed .zapier-chatbot-button,
        zapier-interfaces-chatbot-embed button[data-testid="chatbot-button"],
        zapier-interfaces-chatbot-embed [data-testid="chatbot-trigger"] {
          display: none !important;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          zapier-interfaces-chatbot-embed {
            bottom: 80px !important;
            right: 10px !important;
            left: 10px !important;
            width: calc(100vw - 20px) !important;
            max-height: calc(100vh - 160px) !important;
          }
        }
      `}</style>
    </>
  );
};

export default ZapierChatbot;