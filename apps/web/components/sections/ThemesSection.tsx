'use client';

import { motion } from 'framer-motion';

const themes = [
  { id: 'pink-pookie', name: 'Pink Pookie', gradient: ['#FFB3C6', '#FF85A1'], dark: false },
  { id: 'lavender-dream', name: 'Lavender Dream', gradient: ['#C4B5FD', '#8B5CF6'], dark: false },
  { id: 'cherry-blossom', name: 'Cherry Blossom', gradient: ['#FFB7C5', '#FF8FAB'], dark: false },
  { id: 'strawberry-milk', name: 'Strawberry Milk', gradient: ['#FFE4EC', '#FF6B95'], dark: false },
  { id: 'midnight-love', name: 'Midnight Love', gradient: ['#1A0A2E', '#7C3AED'], dark: true },
  { id: 'moonlight', name: 'Moonlight', gradient: ['#0D1B2A', '#90B4CE'], dark: true },
  { id: 'cloud-nine', name: 'Cloud Nine', gradient: ['#BFEFFF', '#2196F3'], dark: false },
  { id: 'teddy-bear', name: 'Teddy Bear', gradient: ['#FFF5E6', '#C4783A'], dark: false },
  { id: 'peach-romance', name: 'Peach Romance', gradient: ['#FFF3E8', '#FF7043'], dark: false },
  { id: 'rose-garden', name: 'Rose Garden', gradient: ['#FFF0F3', '#B00040'], dark: false },
  { id: 'starlight', name: 'Starlight', gradient: ['#0F0F1A', '#FFD700'], dark: true },
  { id: 'minimal-cream', name: 'Minimal Cream', gradient: ['#FEFAE0', '#9B7B4A'], dark: false },
];

export function ThemesSection() {
  return (
    <section id="themes" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            12 themes, <span className="text-gradient">all free</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Every theme is included at no cost. No theme is locked behind a paywall.
            Customize your bubbles, backgrounds, animations, and more from Luvr Settings.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-full aspect-square rounded-2xl shadow-md hover:shadow-lg transition-shadow hover:-translate-y-1 hover:scale-105 transition-transform cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                }}
                aria-label={theme.name}
                role="img"
              />
              <span className="text-xs font-semibold text-gray-600 text-center leading-tight">
                {theme.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
