'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function ScrollingElements() {
  const { scrollYProgress } = useScroll();
  const yRobot = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const ySaucer = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <>
      <motion.div
        style={{ 
          y: yRobot,
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          width: '4rem',
          height: '4rem',
          zIndex: 20
        }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <svg style={{ width: '100%', height: '100%', color: '#22c55e', filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.7))' }} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a5 5 0 015 5v2h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v2h6V7a3 3 0 00-3-3zm-3 7a2 2 0 00-2 2v2h2v-2zm6 0a2 2 0 00-2 2v2h2v-2z" />
        </svg>
      </motion.div>

      <motion.div
        style={{ 
          y: ySaucer,
          position: 'fixed',
          bottom: '2.5rem',
          right: '20rem',
          width: '6rem',
          height: '6rem',
          zIndex: 20
        }}
        animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      >
        <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 100 60" fill="none">
          <ellipse cx="50" cy="30" rx="50" ry="20" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.7))' }} />
          <ellipse cx="50" cy="20" rx="25" ry="15" fill="#1a1a1a" />
          <image
            href="/blutrollface.jpeg"
            x="25"
            y="5"
            width="50"
            height="50"
            preserveAspectRatio="xMidYMid slice"
          />
        </svg>
      </motion.div>
    </>
  );
}