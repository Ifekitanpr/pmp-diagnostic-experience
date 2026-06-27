import { motion, useReducedMotion } from 'framer-motion'
import heroBgStripes from '../../assets/landing/hero-bg-stripes.png'
import heroMockup from '../../assets/landing/hero-mockup.png'
import doodleChecklist from '../../assets/landing/doodle-checklist.png'
import doodleList from '../../assets/landing/doodle-list.png'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const imageVariants = {
  hidden: { opacity: 0, y: 64, scale: 0.97, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 },
  },
}

function MockupLayer({ clipPath, className = '', children, ...motionProps }) {
  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ clipPath }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

function MockupImage({ className = '' }) {
  return (
    <img
      src={heroMockup}
      alt=""
      className={`absolute inset-0 h-full w-full select-none object-cover ${className}`}
      draggable="false"
    />
  )
}

function HeroMockup({ shouldReduceMotion }) {
  if (shouldReduceMotion) {
    return (
      <img
        src={heroMockup}
        alt="CertSprints diagnostic report preview"
        className="block w-full rounded-3xl shadow-xl"
      />
    )
  }

  return (
    <motion.div
      role="img"
      aria-label="CertSprints diagnostic report preview"
      className="relative aspect-[31/15] overflow-hidden rounded-[28px] border-[10px] border-white shadow-xl sm:rounded-[40px] sm:border-[16px]"
      variants={imageVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(0, 123, 255, 0.15) 0%, rgba(255, 107, 53, 0.15) 104%), linear-gradient(90deg, #fff0eb 0%, #fff0eb 100%)',
        }}
      />

      <MockupLayer
        clipPath="inset(15.8% 17.6% 0 17.6% round 12px)"
        initial={{ opacity: 0, y: 42, scale: 0.985 }}
        animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
        transition={{
          opacity: { duration: 0.65, ease: 'easeOut', delay: 0.55 },
          y: { duration: 7, ease: 'easeInOut', repeat: Infinity, delay: 1.6 },
          scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
        }}
      >
        <MockupImage />
      </MockupLayer>

      <MockupLayer
        clipPath="inset(63.3% 65.5% 0 0 round 7px)"
        initial={{ opacity: 0, x: -56, y: 34, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, y: [0, -7, 0], scale: 1, filter: 'blur(0px)' }}
        transition={{
          opacity: { duration: 0.55, ease: 'easeOut', delay: 0.95 },
          x: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.95 },
          y: { duration: 6.4, ease: 'easeInOut', repeat: Infinity, delay: 1.9 },
          scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.95 },
          filter: { duration: 0.6, ease: 'easeOut', delay: 0.95 },
        }}
      >
        <MockupImage />
      </MockupLayer>

      <MockupLayer
        clipPath="inset(34.5% 0 19.8% 72.3% round 8px)"
        initial={{ opacity: 0, x: 48, y: 16, scale: 0.96, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, y: [0, -10, 0], scale: 1, filter: 'blur(0px)' }}
        transition={{
          opacity: { duration: 0.55, ease: 'easeOut', delay: 1.15 },
          x: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 1.15 },
          y: { duration: 6.9, ease: 'easeInOut', repeat: Infinity, delay: 2.05 },
          scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 1.15 },
          filter: { duration: 0.6, ease: 'easeOut', delay: 1.15 },
        }}
      >
        <MockupImage />
      </MockupLayer>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent blur-sm"
        initial={{ x: '-120%' }}
        animate={{ x: '520%' }}
        transition={{ duration: 1.45, ease: [0.16, 1, 0.3, 1], delay: 1.35 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[22%] right-[22%] top-[26%] h-px bg-gradient-to-r from-transparent via-primary-400/55 to-transparent"
        initial={{ opacity: 0, scaleX: 0.35 }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.35, 1, 0.9], y: [0, 18, 30] }}
        transition={{ duration: 1.65, ease: 'easeOut', delay: 0.95 }}
      />
    </motion.div>
  )
}

export default function Hero({ onStart, onDiscoverMore }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white">
      <img
        src={heroBgStripes}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none select-none"
      />

      <motion.img
        src={doodleChecklist}
        alt=""
        className="hidden lg:block absolute left-0 top-[260px] w-[180px] opacity-30 -rotate-[16deg] pointer-events-none select-none"
        initial={{ opacity: 0, x: -30, rotate: -16 }}
        animate={{ opacity: 0.3, x: 0, rotate: -16 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />
      <motion.img
        src={doodleList}
        alt=""
        className="hidden lg:block absolute right-0 top-[220px] w-[220px] opacity-30 rotate-[7deg] pointer-events-none select-none"
        initial={{ opacity: 0, x: 30, rotate: 7 }}
        animate={{ opacity: 0.3, x: 0, rotate: 7 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
      />

      <motion.div
        className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="max-w-full inline-flex items-center bg-primary-50 border border-primary-500 rounded-lg px-4 py-2 mb-6">
          <span className="font-extrabold text-accent-500 text-sm md:text-base tracking-[0.1em] uppercase">
            Grounded in PMBOK&reg; 8 &amp; ECO 2026
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="w-full font-heading font-bold text-[34px] sm:text-[40px] md:text-[64px] leading-[1.15] sm:leading-[1.1] tracking-tight text-ink mb-6"
        >
          <span className="bg-gradient-to-r from-accent-500 to-primary-500 bg-clip-text text-transparent">
            Are you ready
          </span>
          <span className="sm:hidden">
            <br />
            for the PMP&reg; exam?
          </span>
          <span className="hidden sm:inline">
            {' '}for<br />
            the PMP&reg; exam?
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="w-full text-lg text-slate-600 max-w-2xl mb-8">
          Take CertSprints&rsquo; free PMP Diagnostic Assessment and discover exactly
          where you stand, what is holding you back, and what sprint to start next.
        </motion.p>

        <motion.div variants={itemVariants} className="w-full flex flex-wrap items-center justify-center gap-4 mb-4">
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold text-base px-5 py-3 rounded transition-all duration-200 min-h-[48px]"
          >
            Take the Free PMP Diagnostic <span>&rarr;</span>
          </button>
          <button
            onClick={onDiscoverMore}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold text-base px-5 py-3 rounded border border-slate-200 shadow-sm transition-all duration-200 min-h-[48px]"
          >
            What you&rsquo;ll discover
          </button>
        </motion.div>

        <motion.p variants={itemVariants} className="w-full text-base text-slate-600 max-w-2xl">
          This is not a simple quiz. It measures how you perform, retrieve, pace,
          and calibrate your confidence &mdash; just like the real exam.
        </motion.p>
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-6 pb-20">
        <HeroMockup shouldReduceMotion={shouldReduceMotion} />
      </div>
    </section>
  )
}
