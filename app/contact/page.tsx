'use client';

/**
 * Contact Us Page
 * ===============
 * Form for users to get in touch - sends notification to Slack
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mail,
  Phone,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  MapPin,
  Clock,
  Building2,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  inquiryType: 'general' | 'partnership' | 'support' | 'booking';
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  inquiryType: 'general',
};

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry', icon: MessageSquare },
  { value: 'partnership', label: 'Corporate Partnership', icon: Building2 },
  { value: 'support', label: 'Support', icon: Clock },
  { value: 'booking', label: 'Booking Help', icon: MapPin },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData(initialFormData);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gradient">
                BLR Transit
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-white font-medium">Contact Us</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Have questions about BLR Transit? Want to partner with us? We'd love to hear from you.
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <div className="p-3 bg-tech-purple/20 rounded-lg">
                  <Mail className="w-6 h-6 text-tech-purple" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">hello@blrtransit.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Phone className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white font-medium">+91 80 1234 5678</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Office</p>
                  <p className="text-white font-medium">Koramangala, Bangalore 560034</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Business Hours</p>
                  <p className="text-white font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-tech-purple/10 to-transparent rounded-xl border border-tech-purple/20">
                <p className="text-3xl font-bold text-tech-purple">24hr</p>
                <p className="text-gray-400 text-sm">Response Time</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl border border-green-500/20">
                <p className="text-3xl font-bold text-green-500">98%</p>
                <p className="text-gray-400 text-sm">Satisfaction Rate</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

              {/* Success State */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-green-400 font-medium">Message sent successfully!</p>
                    <p className="text-green-300/70 text-sm">We'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {/* Error State */}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-red-400 font-medium">Failed to send message</p>
                    <p className="text-red-300/70 text-sm">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Inquiry Type */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Inquiry Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {inquiryTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, inquiryType: type.value as FormData['inquiryType'] }))}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                            formData.inquiryType === type.value
                              ? 'bg-tech-purple/20 border-tech-purple text-white'
                              : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-400 text-sm mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                    />
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-400 text-sm mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@company.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-400 text-sm mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Company (Optional) */}
                <div>
                  <label htmlFor="company" className="block text-gray-400 text-sm mb-2">
                    Company <span className="text-gray-600">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-gray-400 text-sm mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-gray-400 text-sm mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    isSubmitting
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white hover:shadow-lg hover:shadow-tech-purple/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-center text-gray-500 text-sm">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="text-tech-purple hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
