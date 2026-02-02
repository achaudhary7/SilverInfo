"use client";

/**
 * Contact Form Component
 * 
 * A working contact form using Web3Forms API (free tier).
 * Sends emails directly to your inbox without backend code.
 * 
 * Setup:
 * 1. Go to https://web3forms.com/
 * 2. Enter your email and verify
 * 3. Copy the access key
 * 4. Add to .env.local: NEXT_PUBLIC_WEB3FORMS_KEY=your_key_here
 */

import { useState, FormEvent } from "react";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Get your free access key from https://web3forms.com/
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

// ============================================================================
// TYPES
// ============================================================================

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

// ============================================================================
// COMPONENT
// ============================================================================

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // ========================================================================
  // FORM SUBMISSION
  // ========================================================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Check if Web3Forms key is configured
    if (!WEB3FORMS_KEY) {
      // Fallback: Open mailto link
      const mailtoLink = `mailto:contact@silverinfo.in?subject=${encodeURIComponent(
        `[${formData.subject}] from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: formData.name,
          email: formData.email,
          subject: `[SilverInfo.in] ${formData.subject}`,
          message: formData.message,
          from_name: "SilverInfo.in Contact Form",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================
  
  // Success state
  if (status === "success") {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for contacting us. We&apos;ll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-[#1e3a5f] hover:underline font-medium"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Send us a Message
      </h2>
      
      {/* Error Message */}
      {status === "error" && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field for spam protection */}
        <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />
        
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Your name"
            required
            disabled={status === "submitting"}
          />
        </div>
        
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="your@email.com"
            required
            disabled={status === "submitting"}
          />
        </div>
        
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            disabled={status === "submitting"}
          >
            <option>General Inquiry</option>
            <option>Price Accuracy</option>
            <option>Technical Issue</option>
            <option>Partnership</option>
            <option>Advertising</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            placeholder="Your message..."
            required
            disabled={status === "submitting"}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2c5282] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
      
      {/* Fallback notice if no API key */}
      {!WEB3FORMS_KEY && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Form will open your email client to send the message.
        </p>
      )}
    </div>
  );
}
