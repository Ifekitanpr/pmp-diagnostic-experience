import { motion } from 'framer-motion'
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
  hidden: { opacity: 0, y: 70 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay: 0.5 } },
}

export default function Hero({ onStart, onDiscoverMore }) {
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
        <motion.img
          src={heroMockup}
          alt="CertSprints diagnostic report preview"
          className="w-full rounded-3xl shadow-xl"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        />
      </div>
    </section>
  )
}
