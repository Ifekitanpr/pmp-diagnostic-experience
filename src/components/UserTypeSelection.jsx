import { useMemo, useState } from 'react'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const STEP_ICONS = {
  stage: 'icon-racing-flag.png',
  confidence: 'icon-chatting.png',
  pressure: 'icon-alert.png',
}

const STEPS = [
  {
    id: 'stage',
    kicker: 'Your current stage',
    title: 'Where are you in the PMP journey right now?',
    subtitle: 'Choose the statement that feels most true today.',
    options: [
      { id: 'new', label: 'I am just starting', detail: 'I need terms, structure, and a clean baseline.', signal: 'explorer' },
      { id: 'started', label: 'I have started studying', detail: 'I have watched or read some material, but it is not settled.', signal: 'beginner' },
      { id: 'course', label: 'I finished a prep course', detail: 'Now I need practice pressure and gap diagnosis.', signal: 'builder' },
      { id: 'mock', label: 'I am already doing mocks', detail: 'I need validation and final weak-area work.', signal: 'almostready' },
      { id: 'failed', label: 'I am retaking after an attempt', detail: 'I need to find the pattern that caused the miss.', signal: 'recovery' },
    ],
  },
  {
    id: 'confidence',
    kicker: 'Confidence calibration',
    title: 'What usually happens when you answer PMP questions?',
    subtitle: 'This helps tune how direct the diagnostic feedback should be.',
    options: [
      { id: 'lost', label: 'I often feel unsure', detail: 'Even when I know the topic, answer choices feel confusing.', signal: 'beginner' },
      { id: 'instinct', label: 'I rely on project experience', detail: 'My real-world instincts are strong, but PMI wording can feel strange.', signal: 'experienced' },
      { id: 'mixed', label: 'I get mixed results', detail: 'Some domains feel solid while others collapse under pressure.', signal: 'builder' },
      { id: 'strong', label: 'I mostly need confirmation', detail: 'I want to know if my readiness is stable enough to validate.', signal: 'validator' },
    ],
  },
  {
    id: 'pressure',
    kicker: 'Exam pressure',
    title: 'What is the biggest risk for you on exam day?',
    subtitle: 'The report will use this to make the first sprint recommendation more useful.',
    options: [
      { id: 'knowledge', label: 'Knowledge gaps', detail: 'I need the content arranged into a clearer study path.', signal: 'explorer' },
      { id: 'mindset', label: 'PMI mindset traps', detail: 'I know the work, but I miss the exam logic.', signal: 'experienced' },
      { id: 'speed', label: 'Timing and stamina', detail: 'I can answer, but I slow down or second-guess.', signal: 'almostready' },
      { id: 'recall', label: 'Remembering without hints', detail: 'Recognition is okay, but explaining from memory is weak.', signal: 'builder' },
    ],
  },
]

const USER_TYPES = {
  explorer: {
    id: 'explorer',
    label: 'Explorer',
    category: 'A',
    headline: 'Foundation baseline',
    summary: 'Your diagnostic will start with clearer concept checks before moving into applied PMP thinking.',
    calibration: 'Concept-first, easy-to-moderate',
  },
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    category: 'A',
    headline: 'Structured foundation check',
    summary: 'Your diagnostic will test whether the core language and PMP patterns are beginning to stick.',
    calibration: 'Concept-first, easy-to-moderate',
  },
  builder: {
    id: 'builder',
    label: 'Builder',
    category: 'B',
    headline: 'Practice gap diagnosis',
    summary: 'Your diagnostic will focus on applied scenarios, recall strength, and weak-domain routing.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  experienced: {
    id: 'experienced',
    label: 'Experienced Practitioner',
    category: 'B',
    headline: 'PMI mindset calibration',
    summary: 'Your diagnostic will expose where real-world instinct conflicts with PMI exam logic.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  validator: {
    id: 'validator',
    label: 'Validator',
    category: 'B',
    headline: 'Readiness validation check',
    summary: 'Your diagnostic will stress-test consistency before you move into domain exams or full mocks.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  almostready: {
    id: 'almostready',
    label: 'Almost Ready',
    category: 'B',
    headline: 'Final pressure check',
    summary: 'Your diagnostic will focus on timing, confidence, and weak-area precision before final mocks.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  recovery: {
    id: 'recovery',
    label: 'Recovery Learner',
    category: 'B',
    headline: 'Recovery pattern diagnosis',
    summary: 'Your diagnostic will look for the pattern behind the previous attempt, not just the score.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
}

export default function UserTypeSelection({ onSelect, onLogoClick }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const isReview = stepIndex === STEPS.length
  const currentStep = isReview ? null : STEPS[stepIndex]
  const selected = currentStep ? answers[currentStep.id] : null

  const inferred = useMemo(() => inferLearner(answers), [answers])
  const progress = Math.min(((stepIndex + (isReview ? 0 : 1)) / (STEPS.length + 1)) * 100, 100)

  const choose = (option) => {
    if (!currentStep) return
    const nextAnswers = { ...answers, [currentStep.id]: option }
    setAnswers(nextAnswers)
    window.setTimeout(() => setStepIndex((value) => Math.min(value + 1, STEPS.length)), 120)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <div className="border-b border-slate-200 bg-white">
        <div className="h-1 bg-slate-100">
          <div className="h-1 bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow-gradient">Adaptive setup</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">
            No labels. Just tell us what is true.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500">
            CertSprints infers the right diagnostic calibration from your answers, then confirms it before the timer starts.
          </p>

          <div className="mt-6 space-y-2.5">
            {STEPS.map((step, index) => {
              const done = Boolean(answers[step.id])
              const active = index === stepIndex && !isReview
              return (
                <div
                  key={step.id}
                  className={`rounded-[10px] border-l-[16px] px-9 py-6 ${
                    active
                      ? 'border-y-2 border-r-2 border-brand-500 bg-brand-50'
                      : done
                      ? 'border-y border-r border-green-200 bg-white'
                      : 'border-y border-r border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold tracking-tight text-sprint-ink">{step.kicker}</p>
                      {done && <p className="mt-0.5 text-sm text-slate-500">{answers[step.id].label}</p>}
                    </div>
                    {done ? (
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sprint-green text-[11px] font-extrabold text-white">✓</span>
                    ) : (
                      <span className={`text-2xl font-bold tracking-tight ${active ? 'text-brand-100' : 'text-slate-200'}`}>
                        0{index + 1}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        <section className="min-h-[620px]">
          {!isReview ? (
            <div className="rounded-[10px] border border-slate-100 bg-white p-6 shadow-soft sm:p-[30px]">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow-gradient">{currentStep.kicker}</p>
                <p className="text-sm text-slate-500">Step {stepIndex + 1} of {STEPS.length}</p>
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight">{currentStep.title}</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-500">{currentStep.subtitle}</p>

              <div className="mt-6 grid gap-2.5">
                {currentStep.options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => choose(option)}
                    className={`group flex items-center gap-3 rounded border-[1.5px] p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 ${
                      selected?.id === option.id ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-slate-100 bg-white text-sm text-brand-500">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>
                      <span className="block text-base font-semibold tracking-tight text-slate-700">{option.label}</span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-slate-500">{option.detail}</span>
                    </span>
                  </button>
                ))}
              </div>

              {stepIndex > 0 && (
                <button
                  onClick={() => setStepIndex((value) => Math.max(value - 1, 0))}
                  className="mt-6 h-12 rounded border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
                >
                  Back
                </button>
              )}
            </div>
          ) : (
            <ReviewCard
              inferred={inferred}
              answers={answers}
              onBack={() => setStepIndex(STEPS.length - 1)}
              onConfirm={() => onSelect(inferred)}
            />
          )}
        </section>
      </main>

      <SiteFooter onLogoClick={onLogoClick} />
    </div>
  )
}

function ReviewCard({ inferred, answers, onBack, onConfirm }) {
  return (
    <div className="rounded-[10px] border border-slate-100 bg-white p-6 shadow-soft sm:p-[30px]">
      <p className="eyebrow-gradient">Recommended calibration</p>
      <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight text-sprint-ink">{inferred.headline}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">{inferred.summary}</p>

      <div className="mt-6 rounded-[10px] bg-brand-50 p-5">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-500">Your diagnostic path</p>
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <p className="font-extrabold leading-tight text-sprint-ink" style={{ fontSize: '20px' }}>{inferred.calibration}</p>
          <span className="flex shrink-0 items-center gap-2 rounded bg-white px-3 py-2.5">
            <img src={`${ASSET_BASE}/icons/icon-medal.png`} alt="" className="h-6 w-6" />
            <span className="text-xs leading-tight text-brand-500">{inferred.label}</span>
          </span>
        </div>
      </div>

      <div className="mt-2.5 grid gap-2.5">
        {Object.entries(answers).map(([key, answer]) => (
          <div key={key} className="flex items-center gap-3 rounded border-[1.5px] border-slate-200 bg-slate-50 p-4">
            <span className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-brand-50/50">
              <img src={`${ASSET_BASE}/icons/${STEP_ICONS[key]}`} alt="" className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-500">{labelFor(key)}</p>
              <p className="mt-1.5 text-base font-semibold tracking-tight text-slate-700">{answer.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{answer.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="h-12 rounded border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-600"
        >
          Adjust answers
        </button>
        <button
          onClick={onConfirm}
          className="h-12 rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600"
        >
          Start with this calibration
        </button>
      </div>
    </div>
  )
}

function inferLearner(answers) {
  const counts = {}
  for (const answer of Object.values(answers)) {
    counts[answer.signal] = (counts[answer.signal] || 0) + 1
  }

  if (answers.stage?.signal === 'failed') return USER_TYPES.recovery
  if (answers.stage?.signal === 'mock' && answers.confidence?.signal === 'strong') return USER_TYPES.validator
  if (answers.confidence?.signal === 'experienced' || answers.pressure?.signal === 'experienced') return USER_TYPES.experienced

  const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'builder'
  return USER_TYPES[winner] || USER_TYPES.builder
}

function labelFor(key) {
  return {
    stage: 'Journey stage',
    confidence: 'Question behavior',
    pressure: 'Exam-day risk',
  }[key] || key
}
