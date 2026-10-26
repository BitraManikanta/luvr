'use client';

import { motion } from 'framer-motion';

const guarantees = [
  {
    icon: '🔑',
    title: 'Keys stay on your device',
    body: 'Your encryption keys are generated on your phone and never sent to our servers. We store only encrypted envelopes we cannot read.',
  },
  {
    icon: '🕵️',
    title: 'Zero plaintext storage',
    body: 'Our database never contains your message text, voice notes, or private photos. We store random identifiers and encrypted blobs.',
  },
  {
    icon: '🧹',
    title: 'Data minimization',
    body: 'We collect only what is needed to deliver the service. Delivery metadata is limited and expired. No behavioral profiling, no ad targeting.',
  },
  {
    icon: '🌐',
    title: 'Open threat model',
    body: 'We publish our threat model, including what we can and cannot protect against — compromised devices, backups, screenshots, and more.',
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="py-24 px-4 bg-gradient-to-b from-white to-luvora-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-5xl mb-4" role="img" aria-label="Lock">🔒</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Privacy is not a feature —{' '}
            <span className="text-gradient">it's the foundation</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Luvora is built on a reviewed end-to-end encryption protocol. Your private chats are
            yours alone. We are honest about what we can and cannot protect.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guarantees.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-4 p-6 rounded-2xl bg-white border border-luvora-100 shadow-sm"
            >
              <div className="text-3xl flex-shrink-0" aria-hidden="true">{item.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center text-sm text-gray-400 max-w-2xl mx-auto"
        >
          Luvora's end-to-end encryption is implemented using established, reviewed cryptographic
          protocols — not homemade cryptography. An independent security review is planned before
          public launch. We make no claim of absolute security. No system is perfect.
        </motion.p>
      </div>
    </section>
  );
}
