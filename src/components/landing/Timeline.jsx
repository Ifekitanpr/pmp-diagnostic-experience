import { useEffect, useRef, useState } from 'react'

const STEPS = [
  {
    n: '01',
    dot: 'bg-primary-500 border-primary-100',
    badge: 'bg-primary-50 text-primary-500',
    border: 'border-l-primary-50',
    step: 'Step 01',
    title: 'Select Your Type',
    desc: 'Tell us where you are in your PMP journey.',
    icon: '⏰',
    note: 'Takes 1 minute to configure.',
    cardSide: 'left',
  },
  {
    n: '02',
    dot: 'bg-accent-500 border-accent-100',
    badge: 'bg-accent-50 text-accent-500',
    border: 'border-l-accent-50',
    step: 'Step 02',
    title: 'Take the Assessment',
    desc: 'Solve 30 scenario questions and vocabulary checks.',
    icon: '💪',
    note: 'No sign-up or accounts required.',
    cardSide: 'right',
  },
  {
    n: '03',
    dot: 'bg-primary-500 border-primary-100',
    badge: 'bg-primary-50 text-primary-500',
    border: 'border-l-primary-50',
    step: 'Step 03',
    title: 'Get Your Report',
    desc: 'Full score breakdown with your personalised sprint plan.',
    icon: '📈',
    note: 'Custom sprint plan.',
    cardSide: 'left',
  },
]

const STAGGER_MS = 250

function useSequenceReveal() {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, started]
}

function StepCard({ step, visible, delay }) {
  const fromSide = step.cardSide === 'left' ? '-translate-x-12' : 'translate-x-12'
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`bg-white border border-slate-200 ${step.border} border-l-[16px] rounded-xl px-9 py-6 flex flex-col gap-4 w-full md:w-[480px] transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-x-0' : `opacity-0 ${fromSide}`
      }`}
    >
      <span className={`inline-flex self-start text-sm rounded-full px-3 py-0.5 ${step.badge}`}>{step.step}</span>
      <div>
        <p className="font-semibold text-ink text-xl mb-2">{step.title}</p>
        <p className="text-slate-500">{step.desc}</p>
      </div>
    </div>
  )
}

function StepNote({ step, visible, delay }) {
  const fromSide = step.cardSide === 'left' ? 'translate-x-12' : '-translate-x-12'
  return (
    <div
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex items-center gap-3 w-full md:w-[480px] transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-x-0' : `opacity-0 ${fromSide}`
      }`}
    >
      <span className="text-3xl shrink-0">{step.icon}</span>
      <p className="text-slate-700 text-lg md:text-xl">{step.note}</p>
    </div>
  )
}

export default function Timeline({ onStart }) {
  const [containerRef, started] = useSequenceReveal()

  return (
    <section className="bg-white border-b border-slate-200 px-6 md:px-[100px] py-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 text-center mb-12">
        <div className="w-full flex flex-col gap-3 items-center">
          <p className="w-full font-extrabold text-primary-500 text-sm tracking-[0.1em] uppercase">The Timeline</p>
          <h2 className="w-full font-heading font-bold text-ink text-2xl md:text-3xl">How it works</h2>
        </div>
      </div>

      <div ref={containerRef} className="relative max-w-5xl mx-auto flex flex-col gap-10">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2" />

        {STEPS.map((step, i) => {
          const delay = i * STAGGER_MS
          return (
            <div key={step.n} className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="w-full order-2 md:order-none flex-1 flex md:justify-end">
                {step.cardSide === 'left' ? (
                  <StepCard step={step} visible={started} delay={delay} />
                ) : (
                  <StepNote step={step} visible={started} delay={delay} />
                )}
              </div>

              <div
                style={{ transitionDelay: `${delay}ms` }}
                className={`order-1 md:order-none shrink-0 size-[45px] rounded-full border-4 flex items-center justify-center font-extrabold text-white text-sm transition-all duration-500 ${step.dot} ${started ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              >
                {step.n}
              </div>

              <div className="w-full order-3 md:order-none flex-1 flex md:justify-start">
                {step.cardSide === 'right' ? (
                  <StepCard step={step} visible={started} delay={delay} />
                ) : (
                  <StepNote step={step} visible={started} delay={delay} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold px-5 py-3 rounded transition-all duration-200 min-h-[48px]"
        >
          Launch free diagnostic <span>&rarr;</span>
        </button>
      </div>
    </section>
  )
}
