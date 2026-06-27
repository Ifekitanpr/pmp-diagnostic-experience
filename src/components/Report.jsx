import { useState } from 'react'
import { computeScores, getBand, getRiskLevel } from '../utils/scoring'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const DOMAIN_LABELS = { people: 'People', process: 'Process', business: 'Business Environment' }
const DOMAIN_SHORT_LABELS = { people: 'People', process: 'Process', business: 'Business' }
const DOMAIN_FILTER_LABELS = { people: 'People', process: 'Process', business: 'Business Env' }

const COMPONENT_ITEMS = [
  { key: 'performance', label: 'Performance', icon: 'icon-arrow-up-right.png', color: '#007bff' },
  { key: 'pacing', label: 'Pacing', icon: 'icon-clock.png', color: '#ff6b35' },
  { key: 'confidence', label: 'Confidence', icon: 'icon-security.png', color: '#16a34a' },
  { key: 'recall', label: 'Recall', icon: 'icon-target-03.png', color: '#8438ee' },
]

export default function Report({ answers, recallAnswers, userType, onRetake, onLogoClick }) {
  const [view, setView] = useState('summary')
  const [filterAccuracy, setFilterAccuracy] = useState('all')
  const [filterDomain, setFilterDomain] = useState('all')

  const scores = computeScores(answers, recallAnswers)
  const band = getBand(scores.composite, userType.category)
  const risks = getRiskLevel(scores)
  const packageRec = getPackageRecommendation(userType, scores, band)
  const reviewItems = [...answers, ...recallAnswers].sort((a, b) => (a.order || 0) - (b.order || 0))

  const missedCount = answers.filter((a) => !a.isCorrect).length
  const correctCount = answers.filter((a) => a.isCorrect).length

  const visibleItems = reviewItems.filter((item) => {
    if (filterAccuracy === 'missed' && (item.examType === 'recall' || item.isCorrect)) return false
    if (filterAccuracy === 'correct' && (item.examType === 'recall' || !item.isCorrect)) return false
    if (filterDomain !== 'all' && item.domain !== filterDomain) return false
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <main className="section-shell py-8">
        {view === 'summary' ? (
          <SummaryView
            scores={scores}
            band={band}
            risks={risks}
            packageRec={packageRec}
            onReviewAnswers={() => setView('navigator')}
            onViewDomain={(domainKey) => {
              setFilterAccuracy('all')
              setFilterDomain(domainKey)
              setView('navigator')
            }}
          />
        ) : (
          <NavigatorView
            scores={scores}
            band={band}
            visibleItems={visibleItems}
            missedCount={missedCount}
            correctCount={correctCount}
            filterAccuracy={filterAccuracy}
            setFilterAccuracy={setFilterAccuracy}
            filterDomain={filterDomain}
            setFilterDomain={setFilterDomain}
            onBack={() => setView('summary')}
          />
        )}
      </main>

      <SiteFooter onStart={onRetake} onLogoClick={onLogoClick} />
    </div>
  )
}

function ScoreHero({ scores, band }) {
  return (
    <div
      className="overflow-hidden rounded-[10px] px-6 py-10 sm:px-16 lg:px-24"
      style={{ backgroundImage: 'linear-gradient(96.57deg, #091427 30.478%, #035dbf 99.252%)' }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-base font-extrabold uppercase tracking-[1.6px] text-primary-200">Provisional readiness score</p>
        <div className="mt-4 flex items-end justify-center gap-1">
          <span className="font-display text-5xl font-bold tracking-[-1.08px] text-white sm:text-6xl">{Math.round(scores.composite)}</span>
          <span className="pb-1.5 text-xl font-extrabold uppercase tracking-[2px] text-primary-200">/100</span>
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.504px] text-white">{band.title}</h1>
        <p className="mt-2 text-base leading-relaxed text-slate-200">{band.meaning}</p>
      </div>
    </div>
  )
}

function SummaryView({ scores, band, risks, packageRec, onReviewAnswers, onViewDomain }) {
  const primaryRisk = risks[0]

  return (
    <div className="flex flex-col gap-[30px]">
      <ScoreHero scores={scores} band={band} />

      <div className="grid gap-[30px] lg:grid-cols-[1fr_360px]">
        <div className="flex h-full flex-col rounded-[10px] border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Domain performance</p>
              <h2 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.39px] text-sprint-ink sm:text-3xl">
                Where the score is coming from
              </h2>
            </div>
            <span className="flex items-center gap-2.5 text-sm text-slate-500">
              ECO weighted
              <img src={`${ASSET_BASE}/icons/icon-info-circle.png`} alt="" className="h-5 w-5" />
            </span>
          </div>

          <div className="mt-4 flex flex-1 flex-col gap-6">
            {scores.domains.map((domain) => (
              <SummaryDomainRow
                key={domain.domain}
                domain={domain}
                strongest={domain.domain === scores.strongest?.domain}
                weakest={domain.domain === scores.weakest?.domain}
                onView={() => onViewDomain(domain.domain)}
              />
            ))}
          </div>
        </div>

        <div className="grid h-full grid-rows-4 gap-6">
          {COMPONENT_ITEMS.map((item) => (
            <ComponentCard key={item.key} item={item} value={scores[item.key]} />
          ))}
        </div>
      </div>

      <div className="grid gap-[30px] lg:grid-cols-3">
        <InsightCard
          tone="orange"
          label="Readiness band"
          value={band.title}
          detail={band.meaning}
          icon="icon-target-02.png"
        />
        {primaryRisk && (
          <InsightCard
            tone="white"
            label="Risk flags"
            value={primaryRisk.label}
            detail={primaryRisk.detail}
            icon="icon-flag-03.png"
          />
        )}
        <InsightCard
          tone="yellow"
          label="Focus domain"
          value={DOMAIN_LABELS[scores.weakest?.domain]}
          detail="Start here before spending time on broad review. This is the highest-value sprint target."
          icon="icon-target-02.png"
        />
      </div>

      <div className="flex flex-col gap-6 rounded-[10px] border border-slate-100 bg-white p-4 sm:p-6 lg:flex-row lg:items-start">
        <div className="flex flex-col items-center gap-4 lg:w-[588px] lg:shrink-0">
          <div className="flex w-full flex-col gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Recommended next step</p>
              <h2 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.39px] text-sprint-ink sm:text-3xl">
                {packageRec.title}
              </h2>
            </div>
            <p className="text-base leading-relaxed text-sprint-ink">{packageRec.detail}</p>
          </div>
          <img src={`${ASSET_BASE}/illustrations/next-step-course.png`} alt="" className="w-full max-w-[534px]" />
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col justify-center gap-6 rounded-[10px] border border-slate-100 bg-slate-50 p-4 sm:p-6 lg:min-h-[220px]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Primary action</p>
              <h3 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.288px] text-sprint-ink">Start Free Module 1</h3>
              <p className="mt-2.5 text-base leading-relaxed text-sprint-ink">Begin your structured learning path with our free first module</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="flex min-h-[54px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded bg-brand-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 sm:gap-2.5 sm:px-5 sm:text-base">
                Start Free for Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                  <path d="M5 10h10M11 6l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={onReviewAnswers}
                className="flex min-h-[54px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded border border-brand-500 bg-white px-3 py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:gap-2.5 sm:px-5 sm:text-base"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                  <path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z" stroke="#007bff" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="2.2" stroke="#007bff" strokeWidth="1.6" />
                </svg>
                Review my answers
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[10px] border border-slate-100 bg-slate-50 p-4 sm:p-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Unlock full report</p>
              <h3 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.288px] text-sprint-ink">Unlock your full PMP Readiness Report</h3>
              <p className="mt-2.5 text-base leading-relaxed text-sprint-ink">
                Create a free CertSprints profile to save your result, get your detailed score breakdown, and receive your recommended sprint path
              </p>
            </div>
            <button className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded bg-brand-500 px-3 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 sm:text-base">
              Create free profile
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M5 10h10M11 6l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex items-center justify-center gap-2.5 text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke="#16a34a" strokeWidth="1.6" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <p className="text-sm text-slate-500 sm:text-base">No card required. Free Module 1 access included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryDomainRow({ domain, strongest, weakest, onView }) {
  const barColor = weakest ? '#e11d48' : strongest ? '#16a34a' : '#007bff'

  return (
    <div className="flex flex-1 flex-col justify-center gap-5 border border-slate-200 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <p className="text-2xl font-bold tracking-[-0.288px] text-sprint-ink">{domain.name}</p>
            {strongest && <span className="rounded-full bg-green-50 px-3 py-0.5 text-sm text-green-600">Strongest</span>}
            {weakest && <span className="rounded-full bg-rose-50 px-3 py-0.5 text-sm text-rose-600">Weakest</span>}
          </div>
          <p className="mt-2.5 text-base text-slate-500">ECO weight {domain.ecoWeight}%</p>
        </div>
        <div className="flex h-full flex-col items-center justify-between gap-2.5 self-stretch">
          <button onClick={onView} aria-label={`Review ${domain.name} answers`} className="transition hover:opacity-70">
            <img src={`${ASSET_BASE}/icons/icon-link-circle.png`} alt="" className="h-6 w-6" />
          </button>
          <p className="text-2xl font-bold tracking-[-0.288px] text-sprint-ink">{domain.score}</p>
        </div>
      </div>
      <div className="h-[14px] rounded-[5px] bg-slate-200">
        <div className="h-[14px] rounded-[5px]" style={{ width: `${domain.score}%`, backgroundColor: barColor }} />
      </div>
    </div>
  )
}

function ComponentCard({ item, value }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-slate-200 bg-white px-6 py-[34px]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">{item.label}</p>
        <img src={`${ASSET_BASE}/icons/${item.icon}`} alt="" className="h-10 w-10" />
      </div>
      <div>
        <div className="flex items-end gap-1.5">
          <p className="font-display text-3xl font-bold tracking-[-0.39px] text-sprint-ink">{Math.round(value)}</p>
          <p className="pb-0.5 text-sm font-extrabold uppercase tracking-[1.4px] text-slate-400">/100</p>
        </div>
        <div className="mt-4 h-2.5 rounded-[5px] bg-slate-200">
          <div className="h-2.5 rounded-[5px]" style={{ width: `${value}%`, backgroundColor: item.color }} />
        </div>
      </div>
    </div>
  )
}

function InsightCard({ tone, label, value, detail, icon }) {
  const styles = {
    orange: { wrap: 'border-accent-200 bg-accent-50', label: 'text-slate-500', value: 'text-accent-700', detail: 'text-slate-700' },
    white: { wrap: 'border-slate-200 bg-white', label: 'text-slate-500', value: 'text-rose-700', detail: 'text-slate-700' },
    yellow: { wrap: 'border-[#ffe6a6] bg-[#fffaec]', label: 'text-[#b45309]', value: 'text-[#78350f]', detail: 'text-[#92400e]' },
  }[tone]

  return (
    <div className={`relative overflow-hidden rounded-[10px] border p-6 ${styles.wrap}`}>
      <p className={`text-xs font-extrabold uppercase tracking-[0.1em] ${styles.label}`}>{label}</p>
      <p className={`mt-2.5 text-2xl font-bold tracking-[-0.288px] ${styles.value}`}>{value}</p>
      <p className={`mt-2.5 max-w-[80%] text-base leading-relaxed ${styles.detail}`}>{detail}</p>
      <img src={`${ASSET_BASE}/icons/${icon}`} alt="" className="absolute right-4 top-1/2 h-[46px] w-[46px] -translate-y-1/2" />
    </div>
  )
}

function NavigatorView({
  scores,
  band,
  visibleItems,
  missedCount,
  correctCount,
  filterAccuracy,
  setFilterAccuracy,
  filterDomain,
  setFilterDomain,
  onBack,
}) {
  return (
    <div className="flex flex-col gap-[30px]">
      <ScoreHero scores={scores} band={band} />

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300"
        >
          <span aria-hidden>←</span> Back
        </button>
        <p className="text-xl font-extrabold tracking-[-0.2px] text-sprint-ink">Question Navigator</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {scores.domains.map((domain) => {
          const strongest = domain.domain === scores.strongest?.domain
          const weakest = domain.domain === scores.weakest?.domain
          const ringColor = weakest ? '#e11d48' : strongest ? '#16a34a' : '#007bff'
          return (
            <div key={domain.domain} className="flex items-center gap-5 rounded-[10px] border border-slate-200 bg-white p-4">
              <DomainRing score={domain.score} color={ringColor} />
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-2xl font-bold tracking-[-0.288px] text-sprint-ink">{domain.name}</p>
                  {strongest && <span className="rounded-full bg-green-50 px-3 py-0.5 text-sm text-green-600">Strongest</span>}
                  {weakest && <span className="rounded-full bg-rose-50 px-3 py-0.5 text-sm text-rose-600">Weakest</span>}
                </div>
                <p className="mt-2.5 text-base text-slate-500">ECO weight {domain.ecoWeight}%</p>
              </div>
            </div>
          )
        })}
      </div>

      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[1px] text-slate-400">Filter by accuracy or domain</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4">
            <FilterPill active={filterAccuracy === 'all'} onClick={() => setFilterAccuracy('all')}>All Questions</FilterPill>
            <FilterPill active={filterAccuracy === 'missed'} tone="red" onClick={() => setFilterAccuracy('missed')}>
              Missed ({missedCount})
            </FilterPill>
            <FilterPill active={filterAccuracy === 'correct'} tone="green" onClick={() => setFilterAccuracy('correct')}>
              Correct ({correctCount})
            </FilterPill>
          </div>
          <div className="hidden h-6 w-px bg-slate-200 sm:block" />
          <div className="flex flex-wrap items-center gap-4">
            <FilterPill active={filterDomain === 'all'} onClick={() => setFilterDomain('all')}>All Domains</FilterPill>
            {['people', 'process', 'business'].map((domain) => (
              <FilterPill key={domain} active={filterDomain === domain} onClick={() => setFilterDomain(domain)}>
                {DOMAIN_FILTER_LABELS[domain]}
              </FilterPill>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-2.5">
        {visibleItems.map((item, index) => (
          <ReviewCard key={`${item.questionId}-${index}`} item={item} index={index} defaultOpen={index === 0} />
        ))}
      </div>
    </div>
  )
}

function FilterPill({ active, tone, onClick, children }) {
  let className = 'rounded-[10px] px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[1px] transition '
  if (active) {
    className += 'bg-sprint-ink text-white'
  } else if (tone === 'red') {
    className += 'border border-rose-600 bg-white text-rose-500'
  } else if (tone === 'green') {
    className += 'border border-green-600 bg-white text-green-600'
  } else {
    className += 'border border-slate-200 bg-white text-slate-400'
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

function DomainRing({ score, color }) {
  const size = 87
  const stroke = 10
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div className="relative h-[87px] w-[87px] shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-bold tracking-[-0.2px] text-sprint-ink">
        {score}%
      </span>
    </div>
  )
}

function ReviewCard({ item, index, defaultOpen }) {
  const isRecall = item.examType === 'recall'
  const isCorrect = isRecall ? item.score >= 70 : item.isCorrect
  const statusIcon = isCorrect ? 'icon-tick-circle-green.png' : 'icon-cancel-circle-red.png'
  const pillClass = isCorrect
    ? 'border border-green-100 bg-green-50 text-green-600'
    : 'border border-rose-100 bg-rose-50 text-rose-600'

  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-[30px]" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <span className={`grid h-[47px] w-[47px] shrink-0 place-items-center rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-rose-50'}`}>
          <img src={`${ASSET_BASE}/icons/${statusIcon}`} alt="" className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Question {index + 1}</p>
            <span className={`rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[1px] ${pillClass}`}>
              {DOMAIN_SHORT_LABELS[item.domain]}
            </span>
          </div>
          <p className="mt-2.5 truncate text-sm font-bold tracking-[-0.084px] text-sprint-ink group-open:hidden">{item.text}</p>
        </div>
        <img
          src={`${ASSET_BASE}/icons/icon-chevron-down-slate.png`}
          alt=""
          className="mt-1 h-6 w-6 shrink-0 transition group-open:rotate-180"
        />
      </summary>

      <div className="hidden group-open:block">
        <div className="my-5 h-px bg-slate-200" />
        <p className="text-base font-extrabold leading-snug tracking-[-0.112px] text-sprint-ink">{item.text}</p>

        {isRecall ? (
          <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-700">
            <p><span className="font-extrabold text-sprint-ink">Your answer:</span> {String(item.answer ?? 'No answer')}</p>
            <p><span className="font-extrabold text-sprint-ink">Scoring key:</span> {item.modelAnswer}</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-2">
            {item.options.map((option, optIndex) => {
              const isThisCorrect = optIndex === item.correct
              const isUserSelection = optIndex === item.selected
              let rowClass = 'border border-slate-200 bg-white'
              if (isThisCorrect) rowClass = 'border-[1.5px] border-sprint-green bg-white'
              else if (isUserSelection) rowClass = 'border-[1.5px] border-rose-500 bg-white'

              return (
                <div key={optIndex} className={`flex items-center gap-3 rounded p-4 ${rowClass}`}>
                  <span
                    className={`h-5 w-5 shrink-0 rounded-full border ${
                      isThisCorrect
                        ? 'border-sprint-green bg-green-100'
                        : isUserSelection
                        ? 'border-rose-500 bg-rose-100'
                        : 'border-slate-200 bg-white'
                    }`}
                  />
                  <span className="text-sm text-slate-400">{String.fromCharCode(65 + optIndex)}.</span>
                  <span className="flex-1 text-sm text-slate-700">{option}</span>
                  {isThisCorrect && <span className="text-sm text-sprint-green">Correct</span>}
                  {!isThisCorrect && isUserSelection && <span className="text-sm text-rose-500">Your answer</span>}
                </div>
              )
            })}
            <div className="mt-2 rounded-lg border border-slate-200 px-3 py-5">
              <div className="flex items-center gap-2">
                <img src={`${ASSET_BASE}/icons/icon-book-open.png`} alt="" className="h-[18px] w-[18px]" />
                <p className="text-sm font-medium text-brand-500">Explanation</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </details>
  )
}

function getPackageRecommendation(userType, scores, band) {
  const beginner = userType.category === 'A' || scores.composite < 65
  const mockPhase = userType.id === 'validator' || userType.id === 'almostready' || scores.composite >= 75

  if (beginner) {
    return {
      title: 'Foundational Course Sprint',
      detail: 'Start with foundation lessons, short recall drills, and guided PMP language calibration before adding mock pressure.',
      cta: 'Start my sprint plan',
      items: ['Module 1 foundation sprint', 'Terminology recall drills', 'People/Process/Business baseline', 'Weekly study plan'],
    }
  }

  if (mockPhase) {
    return {
      title: 'Mock Phase Validation Bouquet',
      detail: 'You are close enough to validate under pressure. Move into domain exams, full mock review, and the final 72-hour protocol.',
      cta: 'Start my sprint plan',
      items: ['Domain exam pack', 'Full mock review', 'False-confidence audit', 'Final 72-hour protocol'],
    }
  }

  return {
    title: band.cta,
    detail: 'Your next best purchase path is a focused weak-area sprint tied to the lowest domain and the risk pattern in this report.',
    cta: 'Start my sprint plan',
    items: ['Weak-domain sprint', 'PMI mindset repair', 'Active recall set', 'Trap analysis review'],
  }
}
