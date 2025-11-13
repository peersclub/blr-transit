'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function CallToAction() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  const stakeholders = [
    {
      title: 'Government Officials',
      icon: '🏛️',
      action: 'Partner With Us',
      benefits: ['Reduce traffic congestion', 'Lower emissions', 'Improve city livability'],
    },
    {
      title: 'Corporate Leaders',
      icon: '💼',
      action: 'Enroll Your Company',
      benefits: ['Boost employee productivity', 'Reduce parking costs', 'Enhance CSR'],
    },
    {
      title: 'Daily Commuters',
      icon: '👥',
      action: 'Join the Movement',
      benefits: ['Save 45 mins daily', 'Reduce stress', 'Work while commuting'],
    },
    {
      title: 'Investors',
      icon: '💰',
      action: 'Invest in Change',
      benefits: ['28% profit margin', 'Scalable model', 'Social impact'],
    },
  ];

  return (
    <section id="action" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Be Part of the <span className="text-gradient">Solution</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join us in transforming Bangalore's commute. Whether you're a government official,
            corporate leader, or daily commuter, you have a role to play.
          </p>
        </motion.div>

        {/* Stakeholder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stakeholders.map((stakeholder, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">{stakeholder.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {stakeholder.title}
              </h3>
              <ul className="space-y-2 mb-4">
                {stakeholder.benefits.map((benefit, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                {stakeholder.action}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Central CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-effect rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Commute?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get early access to our special bus service and be among the first to experience
            stress-free commuting in Bangalore.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                {subscribed ? '✓ Subscribed' : 'Get Updates'}
              </button>
            </div>
          </form>

          {subscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-green-400"
            >
              Thank you! We'll keep you updated on our progress.
            </motion.p>
          )}
        </motion.div>

        {/* Impact Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4">
            <p className="text-4xl font-bold text-gradient mb-2">240K</p>
            <p className="text-sm text-gray-400">Commuters Served</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold text-green-400 mb-2">5,500</p>
            <p className="text-sm text-gray-400">Tons CO₂ Saved Daily</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold text-blue-400 mb-2">45min</p>
            <p className="text-sm text-gray-400">Time Saved Per Trip</p>
          </div>
          <div className="p-4">
            <p className="text-4xl font-bold text-purple-400 mb-2">₹3,000</p>
            <p className="text-sm text-gray-400">Monthly Savings</p>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-2xl font-semibold text-white mb-4">
            Together, we can make Bangalore traffic-free by 2027
          </p>
          <p className="text-gray-400">
            It's not just about buses. It's about reclaiming our time, health, and city.
          </p>
        </motion.div>
      </div>
    </section>
  );
}