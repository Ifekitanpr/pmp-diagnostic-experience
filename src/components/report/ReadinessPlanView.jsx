import heroBgStripes from '../../assets/landing/hero-bg-stripes.png'
import ctaBgRays from '../../assets/landing/cta-bg-rays.png'
import { ArrowRightIcon, DOMAIN_SPRINT_FEATURES, FileIcon, formatDomainList } from './reportShared'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`
const SPRINT_ASSET_BASE = `${ASSET_BASE}/sprint-plan`
const SPRINT_FEATURE_ICONS = {
  book: 'key-concepts.svg',
  brain: 'active-recall.svg',
  cards: 'flashcards.svg',
  tasks: 'domain-questions.svg',
  file: 'mock-questions.svg',
}

export default function ReadinessPlanView({ userType, weakDomains, onGetDetailedReport, onViewPricing }) {
  const isGroupB = userType.category === 'B'
  const selectedDomains = isGroupB ? weakDomains : []

  if (!isGroupB) {
    return (
      <div className="rounded-[10px] border border-brand-100 bg-white p-6">
        <p className="text-xl font-bold text-sprint-ink">Module 1 Foundation Sprint</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
          Start free with foundation lessons, terminology practice, and guided recall. No paid domain sprint is recommended at this stage.
        </p>
        <button className="mt-5 flex min-h-[54px] w-full max-w-sm items-center justify-center gap-2 rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600">
          Start for free
          <ArrowRightIcon stroke="white" />
        </button>
      </div>
    )
  }

  return (
    <ReadinessPlanLanding
      selectedDomains={selectedDomains}
      onViewPricing={onViewPricing}
      onGetDetailedReport={onGetDetailedReport}
    />
  )
}

function ReadinessPlanLanding({ selectedDomains, onViewPricing, onGetDetailedReport }) {
  const domainNames = formatDomainList(selectedDomains)

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative overflow-hidden bg-white px-6 pb-0 pt-20 md:px-[100px] lg:pt-24">
        <img src={heroBgStripes} alt="" className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-35" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center text-center">
          <h1 className="font-display text-[36px] font-bold leading-[1.17] tracking-[-0.768px] text-sprint-ink sm:text-[48px] sm:leading-[56px] lg:whitespace-nowrap">
            Focus the next sprint where it will
          </h1>
          <div className="relative mt-3">
            <img src={`${SPRINT_ASSET_BASE}/hero-ribbon.svg`} alt="" className="pointer-events-none absolute left-1/2 top-1/2 w-[calc(100%+72px)] max-w-none -translate-x-1/2 -translate-y-1/2" />
            <div className="relative rounded-2xl border-[6px] border-brand-500 bg-white px-6 py-2 shadow-[0_4px_8px_-2px_rgba(23,23,23,0.1),0_2px_4px_-2px_rgba(23,23,23,0.06)] sm:px-10 sm:py-3">
              <span className="bg-gradient-to-r from-[#ff6b35] to-brand-500 bg-clip-text font-display text-[34px] font-bold leading-[1.15] tracking-[-0.768px] text-transparent sm:text-[48px] sm:leading-[56px]">
                move your readiness.
              </span>
            </div>
          </div>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-500">
            Based on your diagnostic, CertSprints recommends starting with <span className="font-medium">{domainNames}</span> before attempting full mock validation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onViewPricing()}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded bg-brand-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-brand-600"
            >
              Continue to pricing
              <ArrowRightIcon stroke="white" />
            </button>
            <button
              onClick={onGetDetailedReport}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-brand-300"
            >
              <FileIcon />
              Unlock detailed report
            </button>
          </div>

          <div className="mt-16 w-full max-w-[1099px] overflow-hidden rounded-[12px] border-2 border-brand-500 bg-white shadow-[1px_1px_24.3px_-3px_rgba(22,32,44,0.1),0_8px_8px_-4px_rgba(23,23,23,0.1)]">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-b-2 border-brand-500 bg-[rgba(204,230,253,0.42)] px-5 py-3 backdrop-blur-sm">
              <MetricItem icon="award" text="1,247 Professionals Certified" />
              <MetricItem icon="trophy" text="87% First-Attempt Pass" />
              <MetricItem icon="brain" text="Science-Backed Method" />
              <MetricItem icon="clock" text="30-Min Daily Sprints" />
            </div>
            <img src={`${SPRINT_ASSET_BASE}/dashboard.png`} alt="CertSprints learner dashboard" className="block aspect-[1099/654] w-full object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-6 py-24 md:px-[100px]">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-500">Focus areas</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-sprint-ink">Your priority domains</h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">These are the areas most likely to move your readiness score if you focus the next study effort there.</p>
          </div>
          <FocusDomainStack selectedDomains={selectedDomains} />
        </div>
      </section>

      <section className="bg-white px-6 py-24 md:px-[100px]">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
          <div className="grid gap-5">
            {selectedDomains.map((domain, index) => <PlanStep key={domain.domain} number={index + 1} title={`${domain.name} Sprint`} detail={getDomainPlanDetail(domain.domain, index)} />)}
            <PlanStep number={selectedDomains.length + 1} title="Full mock validation" detail="Return to broader PMP practice after targeted remediation." />
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-[#ff6b35]">Why this comes first</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-sprint-ink">Do not jump straight to mocks yet.</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-500">
              Full mock practice works best when your domain foundation is stable. Since your diagnostic shows priority gaps in {domainNames}, targeted remediation should come before broader exam validation.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand-50/50 px-6 py-24 md:px-[100px]">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Sprint contents"
            title="What each recommended sprint includes"
            detail="Compact, focused practice for the domains that need the most attention."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {DOMAIN_SPRINT_FEATURES.map((feature) => (
              <div key={feature.title} className="overflow-hidden rounded-[10px] border border-slate-200 bg-white text-center">
                <div className="relative grid h-40 place-items-center overflow-hidden border-b border-slate-100">
                  <img src={`${SPRINT_ASSET_BASE}/pattern.svg`} alt="" className="absolute h-[283px] w-[638px] max-w-none" />
                  <img src={`${SPRINT_ASSET_BASE}/${SPRINT_FEATURE_ICONS[feature.icon]}`} alt="" className="relative size-16 object-contain" />
                </div>
                <p className="grid min-h-[82px] place-items-center px-3 text-base font-semibold leading-tight text-slate-900">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-6 py-28 md:px-[100px]">
        <img src={ctaBgRays} alt="" className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-500">Expected outcome</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sprint-ink">Focus, do not restart.</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            The goal is not to restart your PMP preparation. The goal is to focus your next study effort on the domains most likely to improve your readiness score.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onViewPricing()}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600"
            >
              Continue to pricing
              <ArrowRightIcon stroke="white" />
            </button>
            <button
              onClick={onGetDetailedReport}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition hover:border-brand-300"
            >
              Unlock detailed report
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function SectionHeading({ eyebrow, title, detail }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-brand-500">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sprint-ink">{title}</h2>
      <p className="mt-3 text-lg leading-relaxed text-slate-600">{detail}</p>
    </div>
  )
}

function PlanStep({ number, title, detail }) {
  return (
    <div className="grid min-h-[150px] overflow-hidden rounded-[10px] border border-slate-200 bg-[#fffaf8] sm:grid-cols-[190px_1fr]">
      <div className="relative grid min-h-[160px] place-items-center overflow-hidden border border-slate-100 p-5 sm:w-[200px]">
        <img src={`${SPRINT_ASSET_BASE}/pattern.svg`} alt="" className="absolute h-[283px] w-[638px] max-w-none" />
        <div className="relative flex flex-col items-center">
          <span className="relative z-10 font-display text-2xl font-bold leading-8 tracking-[-0.288px] text-sprint-ink">{String(number).padStart(2, '0')}</span>
          <span className="-mt-4 block h-[31px] w-[72px] rounded-lg bg-brand-100" />
        </div>
      </div>
      <div className="flex flex-col justify-center p-6">
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{detail}</p>
      </div>
    </div>
  )
}

function MetricItem({ icon, text }) {
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap text-sm font-medium tracking-[-0.084px] text-slate-700">
      <span className="relative grid size-6 shrink-0 place-items-center rounded-full bg-brand-500 shadow-[inset_0_0_0_2px_#8ac2ff]">
        <span className="grid size-[18px] place-items-center rounded-full border border-white/70 text-[10px] font-bold leading-none text-white">
          {icon === 'award' ? '✹' : icon === 'trophy' ? '♛' : icon === 'brain' ? '✦' : '◷'}
        </span>
      </span>
      {text}
    </span>
  )
}

function FocusDomainStack({ selectedDomains }) {
  const focusDomain = selectedDomains[0]
  const topDomain = selectedDomains[1]
  const bottomDomain = selectedDomains[2]

  if (!focusDomain) return null

  return (
    <div className="relative h-[308px] overflow-hidden px-3 py-16 sm:px-6">
      {topDomain && (
        <div className="absolute inset-x-8 top-0 opacity-45 blur-[2px] sm:inset-x-12">
          <PriorityScoreCard domain={topDomain} muted />
        </div>
      )}
      <div className="absolute inset-x-0 top-[84px] z-10 shadow-[0_8px_20px_rgba(15,23,42,0.08)] sm:inset-x-3">
        <PriorityScoreCard domain={focusDomain} focused />
      </div>
      {bottomDomain && (
        <div className="absolute inset-x-8 bottom-0 opacity-45 blur-[2px] sm:inset-x-12">
          <PriorityScoreCard domain={bottomDomain} muted />
        </div>
      )}
      {topDomain && <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-slate-50 to-transparent" />}
      {bottomDomain && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-50 to-transparent" />}
    </div>
  )
}

function PriorityScoreCard({ domain, focused = false, muted = false }) {
  return (
    <div className={`rounded border bg-white p-5 ${focused ? 'border-slate-200' : 'border-slate-100'} ${muted ? 'pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-slate-900">{domain.name}</p>
          {focused && <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs text-rose-600">Weakest</span>}
        </div>
        <div className="flex items-center gap-5">
          {focused && <span className="text-lg leading-none text-brand-500">↗</span>}
          <p className="text-lg font-bold text-sprint-ink">{domain.score}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">ECO weight {domain.ecoWeight}%</p>
      <div className="mt-3 h-2.5 overflow-hidden rounded bg-slate-200"><div className="h-full rounded bg-rose-600" style={{ width: `${domain.score}%` }} /></div>
    </div>
  )
}

function getDomainPlanDetail(domainKey, index) {
  const details = {
    people: 'Stabilize leadership, stakeholder, and team-scenario decisions.',
    process: 'Strengthen the highest-weight PMP domain first.',
    business: 'Close business-value, compliance, and benefits gaps.',
  }

  return details[domainKey] || (index === 0 ? 'Start with the domain most likely to improve readiness.' : 'Close the next priority readiness gap.')
}
