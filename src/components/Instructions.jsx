import heroBgStripes from '../assets/landing/hero-bg-stripes.png'
import { PromoBar, SiteHeader } from './SiteChrome'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const RULES_DIAGNOSTIC = ({ scenarioCount, recallCount }) => [
  { label: `${scenarioCount} timed ${pluralize('question', scenarioCount)}`, text: 'PMP-style scenarios across People, Process, and Business Environment.' },
  { label: 'Confidence check', text: 'After each answer, you rate confidence so the report can spot false certainty.' },
  { label: `${recallCount} recall ${pluralize('check', recallCount)}`, text: 'You retrieve and explain ideas without relying only on recognition.' },
  { label: 'Four-part score', text: 'Performance, recall, pacing, and confidence calibration combine into one provisional score.' },
]

const RULES_ONBOARDING = ({ scenarioCount, recallCount }) => [
  { label: `${scenarioCount} multiple-choice ${pluralize('question', scenarioCount)}`, text: 'Concept and terminology questions across People, Process, and Business Environment.' },
  { label: 'No confidence check', text: 'This round is about finding your true baseline, not pressure-testing you. Just answer what feels right.' },
  { label: `${recallCount} recall ${pluralize('check', recallCount)}`, text: 'Same recall format as everyone else — you retrieve and explain ideas, not just recognise them.' },
  { label: 'Your baseline, mapped', text: 'We use this to route you straight into the right free course sprint and study plan.' },
]

export default function Instructions({ userType, questions = [], onBegin, onLogoClick }) {
  const isOnboarding = userType.category === 'A'
  const scenarioCount = questions.filter((question) => question.examType === 'scenario').length || 30
  const recallCount = questions.filter((question) => question.examType === 'recall').length || 15
  const estimatedTime = getEstimatedTime({ isOnboarding, scenarioCount, recallCount })
  const rules = isOnboarding
    ? RULES_ONBOARDING({ scenarioCount, recallCount })
    : RULES_DIAGNOSTIC({ scenarioCount, recallCount })
  const introKicker = isOnboarding ? 'Before we begin' : 'Before the timer starts'
  const introTitle = isOnboarding ? "Take your time - there's no wrong way to start." : 'Answer like exam day, not like practice mode.'
  const introCopy = isOnboarding
    ? 'Answer with whatever you already know. There is no confidence rating and no exam-day pressure - this just finds your true baseline.'
    : 'The value comes from honest pacing and confidence. Guessing is fine. Over-polishing the attempt makes the report less useful.'
  const styleLabel = userType.calibration || (isOnboarding ? 'Concept-first, easy-to-moderate' : 'Scenario-based, moderate-to-difficult')

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <main className="relative min-h-[calc(100vh-122px)] border-b border-slate-200 px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-0 overflow-hidden">
          <img
            src={heroBgStripes}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[-7rem] left-1/2 w-[1440px] max-w-none -translate-x-1/2 opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50/70" />
        </div>

        <section className="relative z-10 mx-auto max-w-[1100px] rounded-[10px] border border-slate-100 bg-white p-6 shadow-[0_1px_2px_rgba(23,23,23,0.10),0_1px_1px_rgba(23,23,23,0.06)] sm:p-[30px]">
          <div className="max-w-[940px]">
            <p className="eyebrow-gradient">{introKicker}</p>
            <h1 className="mt-4 font-display text-[30px] font-bold leading-[1.15] tracking-tight text-sprint-ink sm:text-[36px] sm:leading-[44px]">
              {introTitle}
            </h1>
            <p className="mt-3 max-w-[940px] text-base leading-relaxed text-slate-500">
              {introCopy}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[42%_1fr] lg:gap-[30px]">
            <div className="grid content-start gap-4">
              <div className="rounded-[10px] bg-brand-50 p-5">
                <p className="text-[10px] font-extrabold uppercase leading-[14px] tracking-[0.1em] text-brand-500">Question style</p>
                <div className="mt-2.5 flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:justify-between">
                  <p className="text-xl font-bold leading-7 tracking-tight text-sprint-ink">
                    {styleLabel}
                  </p>
                  <span className="flex w-fit shrink-0 items-center gap-2 rounded bg-white px-3 py-2.5">
                    <img src={`${ASSET_BASE}/icons/icon-medal.png`} alt="" className="h-6 w-6" />
                    <span className="text-xs leading-tight text-brand-500">{userType.label}</span>
                  </span>
                </div>
              </div>

              <div className="rounded-[10px] bg-[#fff0eb] p-5">
                <p className="text-[10px] font-extrabold uppercase leading-[14px] tracking-[0.1em] text-[#e86130]">Honest by design</p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#b54c26]">
                  {isOnboarding
                    ? 'Your score here is always provisional. It routes you into the right free course sprint - it is not a pass/fail verdict, and we never tell anyone they are "exam-ready" from a diagnostic alone.'
                    : 'Your diagnostic score is always Provisional. Pass probability is withheld at this stage because it isn\'t reliable until you\'ve completed a full mock. We never tell anyone they are "exam-ready" from a diagnostic alone.'}
                </p>
              </div>

              <div className="rounded-[10px] bg-white p-5">
                <p className="text-[10px] font-extrabold uppercase leading-[14px] tracking-[0.1em] text-slate-500">Estimated time</p>
                <p className="mt-2.5 text-base leading-relaxed text-black">{estimatedTime}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6">
              <div className="grid gap-2.5">
                {rules.map((rule, index) => (
                  <div key={rule.label} className="flex gap-3 rounded border-[1.5px] border-slate-200 bg-slate-50 p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-slate-100 bg-white text-sm leading-none text-brand-500">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-base font-semibold leading-[22px] tracking-tight text-slate-700">{rule.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{rule.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onBegin}
                className="h-12 w-full rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99] lg:ml-auto lg:w-[286px]"
              >
                {isOnboarding ? "Let's go" : 'Begin assessment'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function pluralize(word, count) {
  return count === 1 ? word : `${word}s`
}

function getEstimatedTime({ isOnboarding, scenarioCount, recallCount }) {
  const totalCount = scenarioCount + recallCount
  const minutesPerItem = isOnboarding ? 0.45 : 0.6
  const lower = Math.max(5, Math.round((totalCount * minutesPerItem) / 5) * 5)
  return `${lower}-${lower + 5} min`
}
