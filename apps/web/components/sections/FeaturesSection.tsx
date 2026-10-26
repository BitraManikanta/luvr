'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🔒',
    title: 'End-to-End Encrypted',
    description:
      'Every message, photo, and voice note is encrypted on your device before it ever leaves. We never see your conversations — nobody does.',
    color: 'bg-green-50 border-green-100',
    iconBg: 'bg-green-100',
  },
  {
    icon: '💬',
    title: 'Beautiful Messaging',
    description:
      'Chats that feel as warm as they look. Emoji reactions, voice messages, stickers, GIFs, polls, pinned messages, and disappearing messages.',
    color: 'bg-luvora-50 border-luvora-100',
    iconBg: 'bg-luvora-100',
  },
  {
    icon: '🎮',
    title: 'Couple Games',
    description:
      'Over 15 built-in games — Truth or Dare, Would You Rather, Love Language Quiz, Draw & Guess, and more — playable right inside your chat.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '💕',
    title: 'Couple Space',
    description:
      'Anniversary countdowns, shared memories, love letters, mood check-ins, bucket lists, and private journals. A universe just for you two.',
    color: 'bg-pink-50 border-pink-100',
    iconBg: 'bg-pink-100',
  },
  {
    icon: '🌸',
    title: 'Stories & Social',
    description:
      'Share moments with close friends or your whole following. Following feed, reels, likes, comments, and rich privacy controls on everything.',
    color: 'bg-rose-50 border-rose-100',
    iconBg: 'bg-rose-100',
  },
  {
    icon: '🎨',
    title: '12 Beautiful Themes',
    description:
      'Pink Pookie, Lavender Dream, Midnight Love, Cherry Blossom, and more. Customize every bubble, background, and animation. Themes are free.',
    color: 'bg-orange-50 border-orange-100',
    iconBg: 'bg-orange-100',
  },
  {
    icon: '📞',
    title: 'Voice & Video Calls',
    description:
      'Crystal-clear audio and video calls built on WebRTC. Works over Wi-Fi and cellular. Call history stays private on your device.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🤖',
    title: 'Private AI Companion',
    description:
      'On-device AI for writing suggestions and caption generation. Optional opt-in cloud AI for love letters and date planning — your choice, always.',
    color: 'bg-indigo-50 border-indigo-100',
    iconBg: 'bg-indigo-100',
  },
  {
    icon: '📴',
    title: 'Works Offline',
    description:
      'Compose messages when you have no signal. They send automatically the moment connectivity returns — in the right order, never duplicated.',
    color: 'bg-teal-50 border-teal-100',
    iconBg: 'bg-teal-100',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything you need,{' '}
            <span className="text-gradient">nothing you don't</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            One cohesive app, not a collection of unrelated features. Built for real people who
            want privacy without sacrificing beauty or fun.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`p-6 rounded-2xl border ${feature.color} hover:shadow-md transition-shadow`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center text-2xl mb-4`}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
