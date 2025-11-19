import React, { useState } from "react";
import emailjs from "emailjs-com";

const GoogleServices = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    meetType: "Face-to-Face",
    meetDate: "",
    meetTime: "",
    photoShots: 1,
    tourCreation: false,
    googleIntegration: false,
  });

  const [price, setPrice] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const calculatePrice = () => {
    let total = 0;
    total += formData.photoShots * 900; // ₹900 per 360° shot
    if (formData.tourCreation) total += 500; // ₹500 tour creation
    if (formData.googleIntegration) total += 1000; // ₹1000 integration
    setPrice(total);
    setShowSummary(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePrice();

    const templateParams = {
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      location: formData.location,
      meetType: formData.meetType,
      meetDate: formData.meetDate,
      meetTime: formData.meetTime,
      photoShots: formData.photoShots,
      tourCreation: formData.tourCreation ? "Yes" : "No",
      googleIntegration: formData.googleIntegration ? "Yes" : "No",
      totalPrice: price,
    };


    emailjs
      .send(
        "service_hqm3ti4", // Replace
        "template_irl2mfc", // Replace
        templateParams,
        "fgMzq-JRug2B45oI-" // Replace
      )
      .then(
        () => {
          setSubmitted(true);
          setShowSummary(false);
        },
        (error) => {
          alert("Error sending email: " + error.text);
        }
      );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Google Virtual Tour Quotation
      </h2>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg"
        >
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded-lg"
            />
            <input
              type="text"
              name="location"
              placeholder="Business Location / Address"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <select
              name="meetType"
              value={formData.meetType}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            >
              <option value="Face-to-Face">Face-to-Face Meet</option>
              <option value="Telephonic">Telephonic Meet</option>
            </select>
            <input
              type="date"
              name="meetDate"
              value={formData.meetDate}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
            <input
              type="time"
              name="meetTime"
              value={formData.meetTime}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          {/* Services Selection */}
          <div className="mt-6 space-y-4">
            <label className="block font-semibold text-gray-700">
              Number of 360° Shots
            </label>
            <input
              type="number"
              name="photoShots"
              min="1"
              value={formData.photoShots}
              onChange={handleChange}
              className="border p-2 rounded-lg w-full"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tourCreation"
                checked={formData.tourCreation}
                onChange={handleChange}
              />
              Include Tour Creation (₹500)
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="googleIntegration"
                checked={formData.googleIntegration}
                onChange={handleChange}
              />
              Include Google Integration (₹1000)
            </label>
          </div>

          {/* Buttons */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={calculatePrice}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2"
            >
              Calculate Price
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Send Quote
            </button>
          </div>

          {/* Price Summary */}
          {showSummary && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                Quotation Summary
              </h4>
              <ul className="text-gray-700 space-y-1">
                <li>360° Shots: {formData.photoShots} × ₹900</li>
                {formData.tourCreation && <li>Tour Creation: ₹500</li>}
                {formData.googleIntegration && (
                  <li>Google Integration: ₹1000</li>
                )}
              </ul>
              <div className="mt-3 text-xl font-bold text-green-700">
                Total Estimated Price: ₹{price}
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="text-center mt-10">
          <h3 className="text-2xl font-semibold text-green-600">
            Thank you! Your request has been sent successfully.
          </h3>
          <p className="text-gray-600 mt-2">
            We’ll contact you soon with your detailed quotation.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleServices;