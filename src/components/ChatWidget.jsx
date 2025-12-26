import React, { useState } from 'react';

// NOTE TO USER: The styles for '.chat-button-container', '.chat-window', etc.,
// are assumed to be loaded via your 'index.css' file that you shared previously.

/**
 * The ChatWidget component provides a floating, toggleable chat interface
 * designed to hold the ElevenLabs Agent embed code.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgentLoaded, setIsAgentLoaded] = useState(false);

  // Function to toggle the chat window state
  const toggleChat = () => {
    setIsOpen(prev => !prev);
    // Load the agent content only on the first click (optimization)
    if (!isAgentLoaded) {
      setIsAgentLoaded(true);
    }
  };

  // The class names (.chat-window, .chat-button-container, etc.) correspond
  // to the CSS rules you already added to your index.css file.
  return (
    <div className="chat-button-container">
      {/* 2. CHAT WINDOW (Conditionally open/close) */}
      <div 
        id="chatWindow" 
        className={`chat-window ${isOpen ? 'open' : ''}`}
      >
        <div className="p-4 flex items-center justify-between border-b bg-indigo-600 rounded-t-xl">
          <h2 className="text-lg font-semibold text-white">Ask Our AI Agent</h2>
          <button 
            id="closeChatButton" 
            onClick={toggleChat}
            className="text-white hover:text-indigo-200 p-1 rounded-full transition duration-150"
          >
            {/* Close Icon (X) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 3. ELEVENLABS AGENT EMBED AREA: Custom Tag Integration */}
        <div className="chat-content p-2">
          {isAgentLoaded ? (
            /* *** YOUR CUSTOM ELEVENLABS TAG IS HERE ***
              This tag will be initialized by the script placed in index.html.
            */
            <elevenlabs-convai agent-id="agent_1901kdd0wwwvf5jt0qp6wpg4zpg5" style={{width: '100%', height: '100%'}}>
              {/* Optional: Add a style property for React to ensure it fills the container */}
            </elevenlabs-convai>
            
          ) : (
            <div 
              id="elevenlabs-embed-target" 
              className="text-center text-gray-400 p-4"
            >
              <p className="mb-2">Click the chat button below to load the AI Agent.</p>
              <p className="text-sm">Content loads only on first click for better performance.</p>
            </div>
          )}
        </div>
        {/* END OF EMBED AREA */}
      </div>

      {/* 4. CHAT OPEN/CLOSE BUTTON */}
      <button 
        id="toggleChatButton" 
        onClick={toggleChat}
        className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-300"
      >
        {/* Chat Icon (Default State) */}
        <svg 
          id="chatIcon" 
          className={`h-7 w-7 transition-opacity duration-300 ${isOpen ? 'opacity-0 absolute' : 'opacity-100'}`} 
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M3 20l1.396-1.396A18.001 18.001 0 0012 18c4.956 0 9.294-1.12 12-3.396V20M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z" />
        </svg>
        {/* Close Icon (Open State) */}
        <svg 
          id="closeIcon" 
          className={`h-7 w-7 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`} 
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}