import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const RULES = [
  { label: '30 timed questions', text: 'PMP-style scenarios across People, Process, and Business Environment.' },
  { label: 'Confidence check', text: 'After each answer, you rate confidence so the report can spot false certainty.' },
  { label: '15 recall checks', text: 'You retrieve and explain ideas without relying only on recognition.' },
  { label: 'Four-part score', text: 'Performance, recall, pacing, and confidence calibration combine into one provisional score.' },
]

export default function Instructions({ userType, onBegin, onLogoClick }) {
  const isAdvanced = userType.category === 'B'

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <section>
          <p className="eyebrow-gradient">Your calibration</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight">{userType.headline || userType.label}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-500">{userType.summary || 'Your diagnostic is calibrated to your current PMP preparation stage.'}</p>

          <div className="mt-6 rounded-[10px] bg-brand-50 p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-500">Question style</p>
            <div className="mt-2.5 flex items-center justify-between gap-3">
              <p className="font-extrabold leading-tight text-sprint-ink" style={{ fontSize: '20px' }}>
                {userType.calibration || (isAdvanced ? 'Scenario-based, moderate-to-difficult' : 'Concept-first, easy-to-moderate')}
              </p>
              <span className="flex shrink-0 items-center gap-2 rounded bg-white px-3 py-2.5">
                <img src={`${ASSET_BASE}/icons/icon-medal.png`} alt="" className="h-6 w-6" />
                <span className="text-xs leading-tight text-brand-500">{userType.label}</span>
              </span>
            </div>
          </div>

          <div className="mt-2.5 rounded-[10px] bg-[#fff0eb] p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#e86130]">Honest by design</p>
            <p className="mt-2.5 text-sm leading-relaxed text-[#b54c26]">
              Your diagnostic score is always provisional. Pass probability is withheld at this stage because it isn&rsquo;t reliable until you&rsquo;ve completed a full mock. We never tell anyone they are &ldquo;exam-ready&rdquo; from a diagnostic alone.
            </p>
          </div>

          <div className="mt-2.5 rounded-[10px] bg-white p-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">Estimated time</p>
            <p className="mt-2.5 text-base text-sprint-ink">25-30 min</p>
          </div>
        </section>

        <section className="rounded-[10px] border border-slate-100 bg-white p-6 shadow-soft sm:p-[30px]">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow-gradient">Before the timer starts</p>
            <p className="text-sm text-slate-500">Step 3 of 3</p>
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">Answer like exam day, not like practice mode.</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            The value comes from honest pacing and confidence. Guessing is fine. Over-polishing the attempt makes the report less useful.
          </p>

          <div className="mt-6 grid gap-2.5">
            {RULES.map((rule, index) => (
              <div key={rule.label} className="flex gap-3 rounded border-[1.5px] border-slate-200 bg-slate-50 p-4">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-slate-100 bg-white text-sm text-brand-500">
                  {index + 1}
                </span>
                <div>
                  <p className="text-base font-semibold tracking-tight text-slate-700">{rule.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{rule.text}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onBegin}
            className="mt-6 h-12 w-full rounded bg-brand-500 text-base font-semibold text-white transition hover:bg-brand-600 active:scale-[0.99]"
          >
            Begin assessment
          </button>
        </section>
      </main>

      <SiteFooter onLogoClick={onLogoClick} />
    </div>
  )
}
