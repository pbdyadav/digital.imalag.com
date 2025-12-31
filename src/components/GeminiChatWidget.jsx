import React, { useEffect, useMemo, useRef, useState } from "react";


// ✅ YOUR ORIGINAL SYSTEM INSTRUCTION (UNCHANGED RATE CARD + RULES)
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
1. 🌐 Website Development: Basic / Static (₹12,000 - ₹25,000). E-Commerce (Small) (₹50,000 - ₹85,000).
2. 💻 Web Application Development: Custom SaaS (₹2,00,000 - ₹8,00,000+). Hourly Rate (₹800 - ₹2,500 / hour).
3. 📈 SEO: Starter (₹8,000 - ₹15,000 One time charges). Growth (₹18,000 - ₹30,000 One time charges).
4. 🤖 AI Agent: Smart AI agents (₹50,000 - ₹1,50,000) and various features depend on your chosen rental plan.
5. 📍 Google Services (Virtual Tour): 360° Shoot is ₹1,000 per shot. Uploading to GMB is ₹1,500 (one-time). Minimum 2 shots per room.
6. 🎬 Social Media Marketing (Video): 1-3 Minutes YouTube Vlog (₹2,000 - ₹5,000 per video). Full Production (1 Min Professional) (₹20,000 - ₹35,000).
--- END RATE CARD DATA ---
`;

// ✅ YOUR ORIGINAL RESPONSE SCHEMA (UNCHANGED)
const RESPONSE_SCHEMA = {
    type: "OBJECT",
    properties: {
        intent: {
            type: "STRING",
            description: "Must be one of: 'VT_CALC', 'LEAD_ACCEPT', 'GENERAL'.",
            enum: ["VT_CALC", "LEAD_ACCEPT", "GENERAL"],
        },
        roomCount: {
            type: "NUMBER",
            description:
                "If intent is 'VT_CALC', extract the number of rooms/locations mentioned. Use 1 if mentioned but quantity is vague (e.g., 'my shop'). Use 0 if not applicable.",
        },
        summary: {
            type: "STRING",
            description:
                "A concise, professional summary based on the query and the rate card data, strictly adhering to the System Instruction's rules.",
        },
    },
    required: ["intent", "summary", "roomCount"],
};

function getIndianGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning ☀️";
    if (hour < 17) return "Good afternoon 🌤️";
    return "Good evening 🌙";
}

const YES_WORDS = ["yes", "y", "yeah", "sure", "ok", "okay", "haan", "ha", "ji"];
const NO_WORDS = ["no", "nahi", "nah", "not now", "later"];

export default function GeminiChatWidget() {


    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const greet = `${getIndianGreeting()}! 👋\nI'm the Digital IMALAG AI Assistant.\nHow can I help you today?`;
        return [{ role: "model", text: greet }];
    });

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    /**
     * flowStep:
     * 0 -> ask what service / need
     * 1 -> ask business/location + goal
     * 2 -> ask timeline/budget/scale (3rd question)
     * 3 -> run Gemini answer (services/pricing) then ask meeting
     * 4 -> meeting prompt (yes/no)
     */
    const [flowStep, setFlowStep] = useState(0);

    // store discovery answers (to help Gemini reply better)
    const [discovery, setDiscovery] = useState({
        need: "",
        businessGoal: "",
        scaleTimeline: "",
    });

    const [selectedService, setSelectedService] = useState("");
    const [selectedSubService, setSelectedSubService] = useState("");

    // ✅ Lead contact details for WhatsApp meeting message
    const [lead, setLead] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const isYes = (text) => YES_WORDS.some((w) => text.toLowerCase().includes(w));
    const isNo = (text) => NO_WORDS.some((w) => text.toLowerCase().includes(w));

    const callGemini = async (userText) => {
        const combinedText = `Customer Context:
- Need: ${discovery.need || "Not provided"}
- Business/Goal: ${discovery.businessGoal || "Not provided"}
- Scale/Timeline: ${discovery.scaleTimeline || "Not provided"}

Customer Message: ${userText}`;

        const res = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: combinedText }] }],
                systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: RESPONSE_SCHEMA,
                },
            }),
        });

        if (!res.ok) {
            throw new Error(`Gemini request failed: ${res.status}`);
        }

        const result = await res.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
            return { intent: "GENERAL", summary: "Please share a little more detail.", roomCount: 0 };
        }

        try {
            return JSON.parse(jsonText);
        } catch {
            return { intent: "GENERAL", summary: "Please share a little more detail.", roomCount: 0 };
        }
    };

    const SERVICE_MAP = {
        "website development": [
            "Business Website",
            "E-Commerce Website",
            "Portfolio / Creative Website",
            "Landing Page / One-Page",
            "Website Maintenance & Support",
            "SEO Optimization",
        ],
        "google services": [
            "Google My Business Management",
            "Google Virtual Tour",
            "Google Ads Setup & Optimization",
            "Email Setup / Migration",
        ],
        "it services": [
            "Laptop Repair & Maintenance",
            "Desktop Solutions",
            "Server Setup & Support",
            "Networking Installation",
            "CCTV Installation & Monitoring",
            "IT Consultancy",
        ],
        "digital media": [
            "Video Editing for Businesses",
            "Digital Media Video Creation",
            "YouTube Channel Management",
            "YouTube Video Creation & Optimization",
        ],
    };

    const PRICE_MAP = {
        "business website": "₹12,000 - ₹25,000",
        "e-commerce website": "₹50,000 - ₹85,000",
        "portfolio / creative website": "₹15,000 - ₹30,000",
        "landing page / one-page": "₹8,000 - ₹15,000",
        "website maintenance & support": "Starting from ₹3,000 / month",
        "seo optimization": "₹8,000 - ₹30,000 (one-time)",

        "google virtual tour": "₹1,000 per shot + ₹1,500 upload",
        "google ads setup & optimization": "₹8,000 - ₹25,000",
        "google my business management": "₹5,000 - ₹15,000",

        "laptop repair & maintenance": "₹500 - ₹5,000 (depends on issue)",
        "cctv installation & monitoring": "₹8,000 - ₹50,000",

        "video editing for businesses": "₹2,000 - ₹5,000 per video",
        "youtube channel management": "₹15,000 - ₹40,000 / month",
    };

    const handleSend = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput("");
        setIsLoading(true);

        // Add user message immediately
        setMessages((p) => [...p, { role: "user", text: userText }]);

        try {
            // ✅ Meeting prompt step: yes -> redirect, no -> continue chatting



            // ✅ Meeting confirmation step
            if (flowStep === 4) {

                // YES → Ask for Name
                if (isYes(userText)) {
                    setMessages((p) => [
                        ...p,
                        {
                            role: "model",
                            text: "Great 👍 Before scheduling the meeting, may I have your *full name*?",
                        },
                    ]);

                    setFlowStep(5);
                    setIsLoading(false);
                    return;
                }

                // NO → Continue chat
                if (isNo(userText)) {
                    setMessages((p) => [
                        ...p,
                        {
                            role: "model",
                            text: "No problem 🙂 Let me know how else I can help you.",
                        },
                    ]);
                    setFlowStep(3);
                    setIsLoading(false);
                    return;
                }

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: 'Please reply with "Yes" or "No" 🙂',
                    },
                ]);
                setIsLoading(false);
                return;
            }
            if (flowStep === 5) {
                setLead((p) => ({ ...p, name: userText }));

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: "Thanks 😊 Please share your *mobile number*.",
                    },
                ]);

                setFlowStep(6);
                setIsLoading(false);
                return;
            }
            if (flowStep === 6) {
                setLead((p) => ({ ...p, phone: userText }));

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: "Perfect 👍 Lastly, please share your *email address*.",
                    },
                ]);

                setFlowStep(7);
                setIsLoading(false);
                return;
            }
            if (flowStep === 7) {
                const finalLead = { ...lead, email: userText };
                setLead(finalLead);

                const whatsappMessage = `
New Meeting Request 🚀

Name: ${finalLead.name}
Phone: ${finalLead.phone}
Email: ${finalLead.email}

Service Category:
${selectedService || "Not mentioned"}

Service Type:
${selectedSubService || "Not mentioned"}

Timeline / Scale:
${discovery.scaleTimeline || "Not mentioned"}

Sent from Digital IMALAG Website
`;

                const whatsappUrl =
                    "https://wa.me/9893567595?text=" +
                    encodeURIComponent(whatsappMessage);

                window.open(whatsappUrl, "_blank");

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: "✅ WhatsApp opened. Please send the message to confirm the meeting.",
                    },
                ]);

                setIsLoading(false);
                return;
            }
            // ✅ Discovery Q1
            if (flowStep === 0) {
                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text:
                            "Thanks 👍\nPlease choose the service you're interested in:\n\n• Website Development\n• Google Services\n• IT Services\n• Digital Media\n\nYou can type the service name.",
                    },
                ]);
                setFlowStep(1);
                setIsLoading(false);
                return;
            }

            if (flowStep === 1) {
                const key = userText.toLowerCase();

                if (SERVICE_MAP[key]) {
                    setSelectedService(key);
                    setDiscovery((d) => ({ ...d, need: key })); // ✅ FIX

                    const subList = SERVICE_MAP[key]
                        .map((s) => `• ${s}`)
                        .join("\n");

                    setMessages((p) => [
                        ...p,
                        {
                            role: "model",
                            text: `Great choice 👍\nPlease select the type of service you need:\n\n${subList}\n\nJust type the option name.`,
                        },
                    ]);

                    setFlowStep(2);
                    setIsLoading(false);
                    return;
                }

                // fallback
                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: "Please choose one of the listed services so I can guide you correctly 🙂",
                    },
                ]);
                setIsLoading(false);
                return;
            }

            // ✅ Discovery Q2
            if (flowStep === 2) {
                const key = userText.toLowerCase();

                if (PRICE_MAP[key]) {
                    setSelectedSubService(key);

                    setMessages((p) => [
                        ...p,
                        {
                            role: "model",
                            text: `Thanks 👍\nBased on your selection, the estimated cost is:\n\n${PRICE_MAP[key]}\n\nThis may vary depending on exact requirements.`,
                        },
                    ]);

                    setTimeout(() => {
                        setMessages((p) => [
                            ...p,
                            {
                                role: "model",
                                text:
                                    "One quick question 🙂\nWhen would you like to start this work?\n(Example: immediately, within 1 week, 1 month, flexible)",
                            },
                        ]);
                        setFlowStep(3);
                    }, 500);

                    setIsLoading(false);
                    return;
                }

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text: "Please select one option from the list so I can give you accurate pricing 🙂",
                    },
                ]);
                setIsLoading(false);
                return;
            }

            // ✅ Discovery Q3 then Gemini answer
            if (flowStep === 2) {
                setDiscovery((d) => ({ ...d, scaleTimeline: userText }));
                setFlowStep(3);
            }
            // ✅ Capture timeline / scale
            if (flowStep === 3) {
                setDiscovery((d) => ({ ...d, scaleTimeline: userText }));

                setMessages((p) => [
                    ...p,
                    {
                        role: "model",
                        text:
                            'Perfect 👍\nWould you like to schedule a short discussion with our expert team to finalize details? (Type "Yes" or "No")',
                    },
                ]);

                setFlowStep(4);
                setIsLoading(false);
                return;
            }

            // ✅ Gemini Answer Step
            const model = await callGemini(userText);

            let reply = model.summary || "Thanks. Could you share a bit more detail?";

            // ✅ Keep your VT_CALC math exactly like old logic
            if (model.intent === "VT_CALC" && model.roomCount > 0) {
                const shotsPerRoom = 2;
                const pricePerShot = 1000;
                const uploadFee = 1500;
                const totalShots = model.roomCount * shotsPerRoom;
                const calculatedCost = totalShots * pricePerShot + uploadFee;

                reply = `Based on your request for ${model.roomCount} room(s), the estimated cost for the Google Virtual Tour is calculated as follows: ${totalShots} shots at ₹${pricePerShot}/shot, plus a ₹${uploadFee} one-time upload fee. Your total estimated cost is ₹${calculatedCost.toLocaleString(
                    "en-IN"
                )}.`;
            }

            setMessages((p) => [...p, { role: "model", text: reply }]);

            // ✅ After Gemini response, ask meeting (but only once)
            setTimeout(() => {
                setMessages((p) => [
                    ...p,
                    { role: "model", text: 'Perfect 👍\nWould you like to schedule a short discussion with our expert team to understand your requirement and pricing in detail? (Type "Yes" and share your Name, email ID, contact No., and right time to talk or "No")' },
                ]);
                setFlowStep(4);
            }, 500);
        } catch (err) {
            setMessages((p) => [
                ...p,
                { role: "model", text: "Sorry, something went wrong. Please try again in a moment." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => setIsOpen((p) => !p);

    const ChatMessage = ({ role, text }) => (
        <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-2`}>
            <div
                className={`max-w-[80%] rounded-xl p-3 shadow-sm text-sm whitespace-pre-wrap ${role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-900"
                    }`}
            >
                {text}
            </div>
        </div>
    );

    const LeadForm = ({ onClose }) => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [date, setDate] = useState("");
        const [purpose, setPurpose] = useState("");

        const handleSubmit = (e) => {
            e.preventDefault();

            // ✅ 1. Build WhatsApp message FIRST
            const whatsappMessage = `
New Meeting Request 🚀

Name: ${name}
Email: ${email}
Contact: ${contact}
Meeting Date: ${meetDate}
Meeting Time: ${meetTimeOnly}

Requirement:
${projectDesc}
`;

            // ✅ 2. OPEN WHATSAPP IMMEDIATELY (NO await)
            const whatsappUrl =
                "https://wa.me/9893567595?text=" +
                encodeURIComponent(whatsappMessage);

            window.open(whatsappUrl, "_blank");

            // ✅ 3. (Optional) Save lead AFTER WhatsApp opens
            if (onSave) {
                onSave(
                    {
                        name,
                        email,
                        contact,
                        meetTime: `${meetDate} ${meetTimeOnly}`,
                    },
                    projectDesc
                );
            }

            // ✅ 4. Reset form (optional)
            setName("");
            setEmail("");
            setContact("");
            setMeetDate("");
            setMeetTimeOnly("");
            setProjectDesc("");
        };

        return (
            <form onSubmit={handleSubmit} className="p-3 space-y-3 bg-white border rounded-lg">
                <input
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    required
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <textarea
                    required
                    placeholder="Purpose of Meeting"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <button className="w-full bg-indigo-600 text-white py-2 rounded">
                    Send on WhatsApp
                </button>
            </form>
        );
    };
    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {isOpen && (
                <div className="w-[360px] h-[480px] bg-white rounded-xl shadow-2xl flex flex-col mb-3">
                    <div className="p-3 bg-indigo-600 text-white rounded-t-xl flex items-center justify-between">
                        <div className="font-semibold">Digital IMALAG AI</div>
                        <button onClick={toggleChat} className="text-white">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <ChatMessage key={i} role={m.role} text={m.text} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="flex border-t">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isLoading ? "Please wait..." : "Type your message..."}
                            disabled={isLoading}
                            className="flex-1 p-3 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 bg-indigo-600 text-white disabled:opacity-60"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={toggleChat}
                className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center"
                aria-label="Open chat"
            >
                💬
            </button>
        </div>
    );
}
