import React, { useState, useEffect, useRef, useMemo } from 'react';
// FIX: Use full CDN paths for module imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, addDoc, collection, doc, setDoc, setLogLevel } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

// Set Firebase log level to debug for better console feedback
setLogLevel('debug');


// --- API CONSTANTS ---
/* 🛑 CRITICAL INSTRUCTION FOR LOCAL HOST/LIVE DEPLOYMENT 🛑
 * Replace the empty string below with your actual Gemini API Key.
 * This key is MANDATORY for the chat agent to function outside of this Canvas environment.
 */
const YOUR_GEMINI_API_KEY = "AIzaSyADaLG66MqTuiE_az48SRgQwFRis8rNrCg"; // PASTE YOUR KEY HERE
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${YOUR_GEMINI_API_KEY}`;

// --- SYSTEM INSTRUCTION ---
// NOTE: Instruction heavily focused on professional, concise responses and JSON output rules.
const SYSTEM_INSTRUCTION = `You are Digital IMALAG's friendly and helpful AI Assistant. Your goal is to answer questions about the company's services, pricing, and digital needs concisely and professionally. 
You MUST use the internal Rate Card data below for all pricing details. Do not mention "Rate Card" directly. Quote prices using the INR symbol (₹) and the specified range.
Your primary response MUST be focused ONLY on the service the user asked about. Do NOT list unrelated services or pricing. Keep the core answer extremely brief and professional.

--- RESPONSE FORMATTING RULES ---
1. You MUST always output a JSON object adhering strictly to the provided schema.
2. If the user asks about Virtual Tour (VT) and includes a number of rooms (or mentions 'my shop'/'my office', which implies at least 1), set 'intent' to 'VT_CALC'.
3. If the user responds positively to a meeting prompt (e.g., 'Yes, I want to meet'), set 'intent' to 'LEAD_ACCEPT'.
4. For all other queries, set 'intent' to 'GENERAL'.
5. Your 'summary' text must be the concise, professional answer based on the query and the rate card data, strictly adhering to the System Instruction's rules.

--- RATE CARD DATA (Use this for your responses) ---
1. 🌐 Website Development: Basic / Static (₹12,000 – ₹25,000). E-Commerce (Small) (₹50,000 – ₹85,000).
2. 💻 Web Application Development: Custom SaaS (₹2,00,000 – ₹8,00,000+). Hourly Rate (₹800 – ₹2,500 / hour).
3. 📈 SEO: Starter (₹8,000 – ₹15,000 monthly). Growth (₹18,000 – ₹30,000 monthly).
4. 🤖 AI Agent: Smart AI Agent (₹50,000 – ₹1,50,000).
5. 📍 Google Services (Virtual Tour): 360° Shoot is ₹1,000 per shot. Uploading to GMB is ₹1,500 (one-time). Minimum 2 shots per room.
6. 🎬 Social Media Marketing (Video): 1-3 Minutes YouTube Vlog (₹2,000 – ₹5,000 per video). Full Production (1 Min Professional) (₹20,000 – ₹35,000).
--- END RATE CARD DATA ---
`;

// --- JSON SCHEMA FOR STRUCTURED RESPONSE ---
const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        intent: {
            type: "STRING",
            description: "Must be one of: 'VT_CALC', 'LEAD_ACCEPT', 'GENERAL'.",
            enum: ["VT_CALC", "LEAD_ACCEPT", "GENERAL"]
        },
        roomCount: {
            type: "NUMBER",
            description: "If intent is 'VT_CALC', extract the number of rooms/locations mentioned. Use 1 if mentioned but quantity is vague (e.g., 'my shop'). Use 0 if not applicable.",
        },
        summary: {
            type: "STRING",
            description: "A concise, professional summary based on the query and the rate card data, strictly adhering to the System Instruction's rules.",
        }
    },
    required: ["intent", "summary", "roomCount"]
};

/**
 * Utility function for exponential backoff retry logic.
 */
async function fetchWithRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) throw error;
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


// --- Main Agent Component ---

export default function GeminiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I'm the Digital IMALAG AI Assistant. How can I help you with your IT or digital needs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- FIREBASE STATE AND INITIALIZATION ---
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // State to track if auth is complete
  const [leadStatus, setLeadStatus] = useState('');

  // Conversation stage control: 'chatting', 'form_prompt', 'showing_form'
  const [conversationStage, setConversationStage] = useState('chatting'); 
  
  // New comprehensive state check
  const isServiceReady = isAuthReady && db && userId; 

  useEffect(() => {
    if (typeof __firebase_config === 'undefined' || typeof __app_id === 'undefined') {
        console.error("Firebase configuration variables are missing. Data persistence is disabled.");
        setIsAuthReady(true);
        return;
    }

    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);
    const authentication = getAuth(app);

    setDb(firestore);
    setAuth(authentication);

    const authenticate = async () => {
        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(authentication, __initial_auth_token);
            } else {
                await signInAnonymously(authentication);
            }
        } catch (error) {
            console.error("Firebase authentication error during sign-in:", error);
        }
    };

    authenticate();

    const unsubscribe = onAuthStateChanged(authentication, (user) => {
        if (user) {
            setUserId(user.uid);
        } else {
            setUserId(crypto.randomUUID()); 
        }
        setIsAuthReady(true); // Set ready only after auth state is determined
    });

    return () => unsubscribe();
  }, []);

  // --- LEAD SAVING LOGIC (For form submission) ---
  const saveLead = async (formData, projectDetails) => {
    // Check service readiness strictly again before proceeding
    if (!isServiceReady) {
        // ADDED DEBUG LOG: This will confirm the race condition
        console.error("DEBUG: saveLead called prematurely. isAuthReady:", isAuthReady, "db:", !!db, "userId:", !!userId);
        setLeadStatus("Error: Database not ready or User ID missing. Please try submitting again in a moment.");
        return;
    }

    setLeadStatus("Saving lead information...");

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    // MANDATORY PRIVATE DATA PATH STRUCTURE
    const leadsCollectionPath = `/artifacts/${appId}/users/${userId}/leads`;
    const leadsCollectionRef = collection(db, leadsCollectionPath);
    
    // Ensure all data types are correct for Firestore (e.g., projectDetails is a string)
    const leadData = {
        ...formData,
        projectDetails: projectDetails,
        dateCaptured: new Date().toISOString(),
        source: "Digital IMALAG AI Chat Form",
        userId: userId,
    };

    try {
        const docRef = await addDoc(leadsCollectionRef, leadData);
        setLeadStatus(`Lead saved successfully! Document ID: ${docRef.id}`);
        setMessages(prev => [...prev, { role: 'model', text: "Thank you! Your meeting request and project details have been successfully submitted. Our agent will contact you shortly to confirm the appointment. You can now continue chatting." }]);
        setConversationStage('chatting'); // Return to normal chat mode
        console.log("Lead Saved:", leadData);
    } catch (error) {
        console.error("Error saving lead:", error);
        // This is where a security rule error (403 Permission Denied) usually lands
        setLeadStatus(`Error saving lead: Please check your Firestore Security Rules. Error: ${error.message}`);
        setMessages(prev => [...prev, { role: 'model', text: `Error saving your lead details. Please try again or contact us via our main website. (Database Error)` }]);
    }
  };

  // Scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, conversationStage]);
  
  // --- LEAD CAPTURE FORM COMPONENT ---
  const LeadCaptureForm = ({ isServiceReady, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [meetDate, setMeetDate] = useState(''); // State for preferred date
    const [meetTimeOnly, setMeetTimeOnly] = useState(''); // State for preferred time
    const [projectDesc, setProjectDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Safety check before initiating submission
      if (!isServiceReady) {
        console.error("Form submitted before DB was fully ready. Preventing save.");
        setLeadStatus("Error: Service is still initializing. Please wait a moment.");
        return;
      }

      setIsSubmitting(true);
      // Combine date and time into a single field for storage
      const combinedMeetTime = meetDate && meetTimeOnly 
        ? `${meetDate} at ${meetTimeOnly}` 
        : 'Not Specified by customer';
      
      const formData = { name, email, contact, meetTime: combinedMeetTime };
      await onSave(formData, projectDesc); // Use onSave prop
      setIsSubmitting(false);
    };

    // Use the comprehensive state to control submission ability
    const submitDisabled = isSubmitting || !isServiceReady;

    return (
      <div className="p-4 bg-white space-y-3">
        <h3 className="text-lg font-bold text-indigo-700">Schedule a Consultation</h3>
        <p className="text-sm text-gray-600">Please provide your details so we can arrange a meeting to discuss your project.</p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            disabled={submitDisabled}
          />
          <input 
            type="email" 
            placeholder="Email ID" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            disabled={submitDisabled}
          />
          <input 
            type="tel" 
            placeholder="Contact No." 
            value={contact} 
            onChange={(e) => setContact(e.target.value)} 
            required 
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            disabled={submitDisabled}
          />
          
          <div className="text-sm font-medium text-gray-700 pt-1">Preferred Time for Meeting:</div>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="date" 
              value={meetDate} 
              onChange={(e) => setMeetDate(e.target.value)} 
              required 
              className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Preferred Date"
              disabled={submitDisabled}
            />
            <input 
              type="time" 
              value={meetTimeOnly} 
              onChange={(e) => setMeetTimeOnly(e.target.value)} 
              required 
              className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Preferred Time"
              disabled={submitDisabled}
            />
          </div>
          
          <textarea
            placeholder="Discussion on your project (4-5 lines of detail)"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            rows="4"
            required
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            disabled={submitDisabled}
          />
          
          <button
            type="submit"
            disabled={submitDisabled}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
          >
            {isSubmitting 
                ? 'Submitting...' 
                : isServiceReady 
                  ? 'Submit Request' 
                  : 'Connecting to service...'
            }
          </button>
        </form>
        {leadStatus && <p className="text-xs mt-2 text-center text-green-600">{leadStatus}</p>}
      </div>
    );
  };
  
  // Handle the chat submission
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    if (!YOUR_GEMINI_API_KEY) {
         setMessages(prev => [...prev, { role: 'model', text: "Error: The AI assistant's key is not configured." }]);
         setIsLoading(false);
         return;
    }

    try {
        const payload = {
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA
            },
        };
        
        const response = await fetchWithRetry(() => 
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        );
        
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonText) throw new Error("Received an empty or malformed JSON response from the model.");
        
        // Use JSON.parse with a fallback for safety
        let modelResponseData;
        try {
            modelResponseData = JSON.parse(jsonText);
        } catch (e) {
            console.error("Failed to parse JSON:", jsonText, e);
            modelResponseData = { intent: 'GENERAL', summary: "I apologize, there was an error processing your request. Could you please rephrase your query?", roomCount: 0 };
        }

        const { intent, roomCount, summary } = modelResponseData;
        let finalResponseText = summary;
        let nextStage = 'chatting';

        // 1. DYNAMIC VT CALCULATION
        if (intent === 'VT_CALC' && roomCount > 0) {
            const shotsPerRoom = 2;
            const pricePerShot = 1000;
            const uploadFee = 1500;
            const totalShots = roomCount * shotsPerRoom;
            const calculatedCost = (totalShots * pricePerShot) + uploadFee;
            
            // Generate the calculated, concise, and professional response
            finalResponseText = `Based on your request for ${roomCount} room(s), the estimated cost for the Google Virtual Tour is calculated as follows: ${totalShots} shots at ₹${pricePerShot}/shot, plus a ₹${uploadFee} one-time upload fee. Your total estimated cost is ₹${calculatedCost.toLocaleString('en-IN')}.`;
            nextStage = 'form_prompt';
        } 
        
        // 2. LEAD ACCEPTANCE CHECK (for the 'will you want to fix a meeting' prompt)
        else if (intent === 'LEAD_ACCEPT' && conversationStage === 'form_prompt') {
            finalResponseText = "Fantastic! We're ready to proceed. I will now open a short form for you to provide the necessary details for scheduling.";
            nextStage = 'showing_form';
        }
        
        // 3. GENERAL QUERY RESPONSE (or non-VT-related queries)
        else {
             // Append CTA for ALL general service inquiries and transition to form prompt stage
             finalResponseText += " To schedule a visit and a detailed consultation covering all your digital needs, including Virtual Tours, Website Development, Networking, Server Management, and Web Applications, please share your Name, Location, and Contact Number. We look forward to meeting you.";
             nextStage = 'form_prompt'; // <-- Set to prompt for meeting
        }


        setMessages(prev => [...prev, { role: 'model', text: finalResponseText }]);
        setConversationStage(nextStage);

    } catch (error) {
        console.error("Gemini API Fatal Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: `I apologize, there was an issue connecting to the AI service. Error: ${error.message || 'Unknown'}.` }]);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(prev => !prev);

  // --- RENDERING ---

  // Chat message component
  const ChatMessage = ({ role, text }) => (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div 
        className={`max-w-[80%] rounded-xl p-3 shadow-md ${
          role === 'user'
            ? 'bg-indigo-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <p className="text-sm leading-snug">{text}</p>
      </div>
    </div>
  );

  const renderChatContent = () => {
    if (conversationStage === 'showing_form') {
      return <LeadCaptureForm 
                isServiceReady={isServiceReady} // Using the new comprehensive state
                onSave={saveLead} 
              />;
    }

    // Default chat view
    return (
        <>
            {/* Messages Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-2 bg-gray-50">
              {messages.map((msg, index) => (
                <ChatMessage key={index} role={msg.role} text={msg.text} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] rounded-xl p-3 shadow-md bg-gray-100 rounded-tl-none">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              {conversationStage === 'form_prompt' && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] rounded-xl p-3 shadow-md bg-gray-100 rounded-tl-none">
                    <p className="text-sm leading-snug font-semibold text-indigo-700">
                        Will you want to fix a meeting to discuss your project? If so, we can share a form with you.
                    </p>
                    <p className="text-xs mt-1 text-gray-500">
                        (Type 'Yes' or 'No' to continue.)
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-4 border-t bg-white flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Generating response..." : "Type your message..."}
                className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white p-3 rounded-r-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400 flex items-center justify-center"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
        </>
    );
  };


  return (
    <div className="fixed bottom-4 right-4 z-50">
      
      {/* DEVELOPMENT STATUS (Keep for debugging persistence) */}
      {isServiceReady && (
        <div className="absolute -top-16 right-0 w-64 bg-white p-2 rounded-xl shadow-lg border border-indigo-200 text-xs">
          <p className="font-semibold text-indigo-700">Persistence ID (Data Saved Here):</p>
          <p className="break-all font-mono text-gray-600">{userId}</p>
        </div>
      )}

      {/* CHAT WINDOW */}
      <div 
        className={`
          transition-all duration-300 ease-in-out origin-bottom-right
          w-[90vw] max-w-[400px] h-[70vh] max-h-[550px]
          bg-white rounded-xl shadow-2xl flex flex-col
          ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b bg-indigo-600 rounded-t-xl">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <h2 className="text-lg font-semibold text-white">Digital IMALAG AI</h2>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white hover:bg-indigo-700 p-1 rounded-full transition duration-150"
            aria-label="Close Chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Render Chat Content or Form */}
        <div className="flex-grow flex flex-col overflow-y-auto">
            {renderChatContent()}
        </div>


      </div>

      {/* CHAT TOGGLE BUTTON */}
      <button 
        onClick={toggleChat}
        className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-indigo-700 transition duration-300 transform hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? (
          // Close Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Chat Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M3 20l1.396-1.396A18.001 18.001 0 0012 18c4.956 0 9.294-1.12 12-3.396V20M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z" />
          </svg>
        )}
      </button>
    </div>
  );
}