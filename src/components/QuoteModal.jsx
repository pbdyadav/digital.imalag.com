// src/components/QuoteModal.jsx
import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";

const QuoteModal = ({ isOpen, onClose, selectedService }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    schedule: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [numShots, setNumShots] = useState(1);
  const [includeTour, setIncludeTour] = useState(true);
  const [includeIntegration, setIncludeIntegration] = useState(true);
  const [total, setTotal] = useState(0);

  const isGoogleVirtual =
    selectedService &&
    (selectedService.toLowerCase().includes("virtual") ||
      selectedService.toLowerCase().includes("vt"));

  useEffect(() => {
    if (isGoogleVirtual) {
      let calc = numShots * 900;
      if (includeTour) calc += 500;
      if (includeIntegration) calc += 1000;
      setTotal(calc);
    } else {
      setTotal(0);
    }
  }, [numShots, includeTour, includeIntegration, isGoogleVirtual]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      schedule: formData.schedule,
      service: selectedService,
      total_price: isGoogleVirtual ? `₹${total}` : "To be discussed",
      message: isGoogleVirtual
        ? `
Google Virtual Tour Quote Request

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}
Preferred Schedule: ${formData.schedule}

📸 Quote Details:
- 360° Shots: ${numShots} × ₹900 = ₹${numShots * 900}
- Tour Creation: ${includeTour ? "Yes (+₹500)" : "No"}
- Google Integration: ${includeIntegration ? "Yes (+₹1000)" : "No"}
--------------------------------
💰 Estimated Total: ₹${total}

Message: ${formData.message || "N/A"}
`
        : `
${formData.name} is interested in ${selectedService}.
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}
Preferred Schedule: ${formData.schedule}

Message: ${formData.message || "N/A"}
        `,
    };

    emailjs
      .send(
        "service_hqm3ti4", // 🔹 your EmailJS Service ID
        "template_irl2mfc", // 🔹 your Template ID
        templateParams,
        "fgMzq-JRug2B45oI-" // 🔹 your Public Key
      )
      .then(
        () => {
          setStatus("success");
          setFormData({
            name: "",
            email: "",
            phone: "",
            location: "",
            schedule: "",
            message: "",
          });
          setNumShots(1);
          setIncludeTour(true);
          setIncludeIntegration(true);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("error");
        }
      );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
          Get a Quote for <span className="text-blue-600">{selectedService}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="text"
            name="location"
            placeholder="Business Address / Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          {/* Instruction line for clients */}
  <label className="block text-sm font-medium text-gray-600 mt-2">
    Select time to online conversation (dd/mm/yyyy)
  </label>

  <input
    type="datetime-local"
    name="schedule"
    value={formData.schedule}
    onChange={handleChange}
    className="w-full border p-2 rounded-lg"
  />

          {isGoogleVirtual && (
            <div className="bg-gray-50 border p-4 rounded-lg mt-2 text-sm">
              <h3 className="font-semibold mb-2 text-gray-700">
                Google Virtual Tour Price Calculator
              </h3>

              <label className="block mb-2">
                Number of 360° Shots:
                <input
                  type="number"
                  min="1"
                  value={numShots}
                  onChange={(e) => setNumShots(Number(e.target.value))}
                  className="w-full border p-1 rounded mt-1"
                />
              </label>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={includeTour}
                  onChange={(e) => setIncludeTour(e.target.checked)}
                />
                Include Tour Creation (+₹500)
              </label>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={includeIntegration}
                  onChange={(e) => setIncludeIntegration(e.target.checked)}
                />
                Include Google Integration (+₹1000)
              </label>

              {/* ✅ Show Live Summary */}
              <div className="mt-3 border-t pt-2 text-gray-700">
                <p>360° Shots: ₹{numShots * 900}</p>
                {includeTour && <p>Tour Creation: ₹500</p>}
                {includeIntegration && <p>Google Integration: ₹1000</p>}
                <hr className="my-1" />
                <p className="font-bold text-blue-700">
                  Estimated Total: ₹{total}
                </p>
              </div>
            </div>
          )}

          <textarea
            name="message"
            placeholder="Additional Details (optional)"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full border p-2 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {status === "sending" ? "Sending..." : "Send Quote Request"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-green-600 text-sm mt-3 text-center">
            ✅ Your quote request has been sent successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm mt-3 text-center">
            ❌ Failed to send. Please try again later.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;
