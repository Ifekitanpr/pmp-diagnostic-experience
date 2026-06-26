import { useEffect, useRef, useState } from 'react'

const SIGNALS = [
  {
    label: 'Performance',
    value: 65,
    color: '#007bff',
    desc: 'Difficulty-weighted accuracy across People, Process & Business Environment domains.',
  },
  {
    label: 'Recall',
    value: 15,
    color: '#ff6b35',
    desc: 'Active retrieval — not passive recognition. Can you explain it, not just recognise it?',
  },
  {
    label: 'Pacing',
    value: 10,
    color: '#2ecc71',
    desc: 'Can you answer under real PMP exam timing pressure?',
  },
  {
    label: 'Confidence Calibration',
    value: 10,
    color: '#ffc83d',
    desc: "Do you know when you know — and when you're guessing?",
  },
]

function Ring({ value, color, animate, delay = 0 }) {
  const r = 56
  const c = 2 * Math.PI * r
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!animate) return
    let raf
    const timeout = setTimeout(() => {
      const start = performance.now()
      const duration = 900
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        setProgress(t * value)
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [animate, value, delay])

  const offset = c * (1 - progress / 100)

  return (
    <div className="relative shrink-0" style={{ width: 130, height: 130 }}>
      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="65"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-semibold text-slate-700 text-2xl">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

export default function Methodology() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-primary-50/50 px-6 md:px-[100px] py-20 flex flex-col items-center gap-12">
      <div className="w-full max-w-3xl text-center flex flex-col gap-3 items-center">
        <h2 className="w-full font-heading font-bold text-ink text-2xl md:text-3xl">
          How your score is built
        </h2>
        <p className="w-full text-slate-600 text-lg">
          We blend four critical signals to evaluate where you stand, identify pacing/guessing
          habits that hold you back, and outline the exact sprint modules to start next.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl">
        {SIGNALS.map((s, i) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center gap-5 sm:flex-row sm:items-center sm:text-left sm:gap-8"
          >
            <div className="sm:order-2">
              <Ring value={s.value} color={s.color} animate={inView} delay={i * 200} />
            </div>
            <div className="w-full flex-1 sm:order-1">
              <p className="font-semibold text-ink text-xl mb-2">{s.label}</p>
              <p className="text-slate-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="w-full text-center text-slate-600">
        Domain scores are ECO 2026 weighted: People 33% &middot; Process 41% &middot; Business Environment 26%
      </p>
    </section>
  )
}
