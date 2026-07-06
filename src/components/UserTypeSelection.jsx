import { useState } from 'react'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

// Direct-selection roster. `category` is an internal routing signal only —
// it is never rendered to the learner (no "Group A / Group B" labelling in UI).
const USER_TYPES = [
  {
    id: 'explorer',
    label: 'Explorer',
    category: 'A',
    statement: 'I know nothing about PMP.',
    headline: 'Foundation baseline',
    summary: 'A quick set of questions to get you oriented on the platform and find your true starting point — no pressure, no clock.',
    calibration: 'Concept-first, easy-to-moderate',
  },
  {
    id: 'beginner',
    label: 'Beginner',
    category: 'A',
    statement: "I started reading or watching free content, but I'm confused.",
    headline: 'Structured foundation check',
    summary: 'A quick set of questions to see what is already sticking and what still feels fuzzy — no pressure, no clock.',
    calibration: 'Concept-first, easy-to-moderate',
  },
  {
    id: 'builder',
    label: 'Builder',
    category: 'B',
    statement: "I finished a class a while ago but haven't practised enough.",
    headline: 'Practice gap diagnosis',
    summary: 'A full practice diagnostic — applied scenarios, recall strength, and weak-domain routing under real exam pressure.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  {
    id: 'experienced',
    label: 'Experienced Practitioner',
    category: 'B',
    statement: "I've managed projects for years; I don't think I need to read much.",
    headline: 'PMI mindset calibration',
    summary: 'A full practice diagnostic built to expose where real-world instinct conflicts with PMI exam logic.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  {
    id: 'validator',
    label: 'Validator',
    category: 'B',
    statement: "I've done a prep class and read the books or PMBOK.",
    headline: 'Readiness validation check',
    summary: 'A full practice diagnostic that stress-tests consistency before you move into domain exams or full mocks.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  {
    id: 'almostready',
    label: 'Almost Ready',
    category: 'B',
    statement: "My exam is soon and I've done mocks.",
    headline: 'Final pressure check',
    summary: 'A full practice diagnostic focused on timing, confidence, and weak-area precision before final mocks.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
  {
    id: 'recovery',
    label: 'Recovery Learner',
    category: 'B',
    statement: 'I failed the PMP exam.',
    headline: 'Recovery pattern diagnosis',
    summary: 'A full practice diagnostic that looks for the pattern behind the previous attempt, not just the score.',
    calibration: 'Scenario-based, moderate-to-difficult',
  },
]

export default function UserTypeSelection({ onSelect, onLogoClick }) {
  const [selectedId, setSelectedId] = useState(null)
  const selectedType = USER_TYPES.find((userType) => userType.id === selectedId) || null

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <main className="section-shell py-10 lg:py-16">
        <div className="rounded-[10px] border border-slate-100 bg-white p-6 shadow-soft sm:p-[30px]">
          <p className="eyebrow-gradient">Adaptive setup</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-sprint-ink">
            Where are you in the PMP journey right now?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            Choose the statement that feels most true today.
          </p>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {USER_TYPES.map((userType, index) => {
              const selected = selectedId === userType.id
              return (
                <button
                  key={userType.id}
                  type="button"
                  onClick={() => setSelectedId(userType.id)}
                  aria-pressed={selected}
                  className={`flex items-center gap-3 self-start rounded border-[1.5px] p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 ${
                    selected ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-slate-100 bg-white text-sm text-brand-500">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>
                    <span className="block text-base font-semibold tracking-tight text-slate-700">{userType.label}</span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-slate-500">&ldquo;{userType.statement}&rdquo;</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-sm leading-relaxed text-accent-700">
              Be honest — this routes you to the right sprint, not a pass/fail verdict.
            </p>
            <button
              type="button"
              onClick={() => selectedType && onSelect(selectedType)}
              disabled={!selectedType}
              className="flex h-[52px] w-full shrink-0 items-center justify-center gap-2.5 rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:w-[336px]"
            >
              Continue
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M5 10h10M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      <SiteFooter onLogoClick={onLogoClick} />
    </div>
  )
}
