import { useState } from 'react'
import { computeScores, getBand, getRiskLevel, GROUP_A_CRITICAL_THRESHOLD } from '../utils/scoring'
import { getWeakDomains } from '../utils/report'
import { DomainIcon, DOMAIN_SPRINT_FEATURES, FeatureIcon } from './report/reportShared'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const DOMAIN_LABELS = { people: 'People', process: 'Process', business: 'Business Environment' }
const DOMAIN_SHORT_LABELS = { people: 'People', process: 'Process', business: 'Business' }
const DOMAIN_FILTER_LABELS = { people: 'People', process: 'Process', business: 'Business Env' }

const COMPONENT_ITEMS = [
  { key: 'performance', label: 'Performance', weight: 65, icon: 'icon-arrow-up-right.png', color: '#007bff' },
  { key: 'pacing', label: 'Pacing', weight: 10, icon: 'icon-clock.png', color: '#ff6b35' },
  { key: 'confidence', label: 'Confidence', weight: 10, icon: 'icon-security.png', color: '#16a34a' },
  { key: 'recall', label: 'Recall', weight: 15, icon: 'icon-target-03.png', color: '#8438ee' },
]

// Maps scoring.js's band.color to a concrete hex for the readiness dial —
// keeps color severity driven by the same single source of truth as the
// band copy, rather than a second set of score thresholds.
const BAND_DIAL_COLORS = {
  red: '#ef4444',
  orange: '#ff6b35',
  yellow: '#eab308',
  blue: '#54a7ff',
  green: '#22c55e',
}

export default function Report({ answers, recallAnswers, userType, onRetake, onLogoClick, onSeeSprintPlan, onGetDetailedReport }) {
  const [view, setView] = useState('summary')
  const [filterAccuracy, setFilterAccuracy] = useState('all')
  const [filterDomain, setFilterDomain] = useState('all')

  const scores = computeScores(answers, recallAnswers)
  const band = getBand(scores.composite, userType.category)
  const risks = getRiskLevel(scores)
  const packageRec = getPackageRecommendation(userType, scores, band)
  const weakDomains = getWeakDomains(scores)
  const reviewItems = [...answers, ...recallAnswers].sort((a, b) => (a.order || 0) - (b.order || 0))

  // Group A alignment sync (1 July 2026): below the critical threshold, skip
  // the risk-metric detail entirely and lead with a single Module 1 CTA —
  // component/risk breakdowns are noise for a learner this early on.
  const showSimplified = userType.category === 'A' && scores.composite < GROUP_A_CRITICAL_THRESHOLD

  const missedCount = answers.filter((a) => !a.isCorrect).length
  const correctCount = answers.filter((a) => a.isCorrect).length

  const visibleItems = reviewItems.filter((item) => {
    if (filterAccuracy === 'missed' && (item.examType === 'recall' || item.isCorrect)) return false
    if (filterAccuracy === 'correct' && (item.examType === 'recall' || !item.isCorrect)) return false
    if (filterDomain !== 'all' && item.domain !== filterDomain) return false
    return true
  })

  const goToSummary = () => setView('summary')
  const goToSprintPlan = onSeeSprintPlan
  const goToDetailedReport = onGetDetailedReport

  let content

  if (view === 'summary') {
    content = (
      <SummaryView
        scores={scores}
        band={band}
        risks={risks}
        packageRec={packageRec}
        userType={userType}
        weakDomains={weakDomains}
        showSimplified={showSimplified}
        onSeeSprintPlan={goToSprintPlan}
        onGetDetailedReport={goToDetailedReport}
        onViewDomain={(domainKey) => {
          setFilterAccuracy('all')
          setFilterDomain(domainKey)
          setView('navigator')
        }}
      />
    )
  } else if (view === 'navigator') {
    content = (
      <NavigatorView
        scores={scores}
        band={band}
        weakDomains={weakDomains}
        visibleItems={visibleItems}
        missedCount={missedCount}
        correctCount={correctCount}
        filterAccuracy={filterAccuracy}
        setFilterAccuracy={setFilterAccuracy}
        filterDomain={filterDomain}
        setFilterDomain={setFilterDomain}
        onBack={goToSummary}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />

      <main className="section-shell py-8">
        {content}
      </main>

      <SiteFooter onStart={onRetake} onLogoClick={onLogoClick} />
    </div>
  )
}

function ScoreHero({ scores, band }) {
  const dialColor = BAND_DIAL_COLORS[band.color] || BAND_DIAL_COLORS.blue

  return (
    <div
      className="overflow-hidden rounded-[10px] px-6 py-10 sm:px-16 lg:px-24"
      style={{ backgroundImage: 'linear-gradient(96.57deg, #091427 30.478%, #035dbf 99.252%)' }}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-base font-extrabold uppercase tracking-[1.6px] text-primary-200">Provisional readiness score</p>
        <ReadinessDial score={scores.composite} color={dialColor} />
      </div>
    </div>
  )
}

// Point on a circle at `angleDeg` (0deg = 3 o'clock, increasing = clockwise on screen).
function polarPoint(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

// A real open arc path (not a dasharray trick on a closed circle) — this is
// what makes strokeLinecap="round" render a cap at BOTH ends of the visible
// arc. The dasharray approach only caps the "true" dash boundary, which for
// a partial fill sits outside the cropped/visible half, leaving one end flat.
function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarPoint(cx, cy, r, startAngle)
  const end = polarPoint(cx, cy, r, endAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

function ReadinessDial({ score, color }) {
  const size = 220
  const stroke = 18
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const rounded = Math.max(0, Math.min(100, Math.round(score)))
  const viewHeight = size / 2 + stroke * 1.5

  const trackPath = arcPath(cx, cy, r, 180, 360)
  const progressPath = rounded > 0 ? arcPath(cx, cy, r, 180, 180 + (rounded / 100) * 180) : null

  return (
    <div className="relative mt-5" style={{ width: size, height: viewHeight }}>
      <svg width={size} height={viewHeight} viewBox={`0 0 ${size} ${viewHeight}`}>
        <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={stroke} strokeLinecap="round" />
        {progressPath && (
          <path d={progressPath} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" className="timer-ring" />
        )}
      </svg>
      <div className="absolute inset-x-0 bottom-1.5 flex flex-col items-center">
        <span className="font-display text-5xl font-bold tracking-[-1.08px] text-white">{rounded}</span>
        <span className="mt-2 flex items-center gap-1.5 rounded border border-white/20 bg-white/10 px-2.5 py-1">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <circle cx="10" cy="10" r="7.5" stroke="white" strokeWidth="1.4" />
            <circle cx="10" cy="10" r="4" stroke="white" strokeWidth="1.4" />
            <circle cx="10" cy="10" r="1.3" fill="white" />
          </svg>
          <span className="text-xs font-semibold text-white">90%+</span>
        </span>
      </div>
    </div>
  )
}

function SummaryView({
  scores,
  band,
  risks,
  packageRec,
  userType,
  weakDomains,
  showSimplified,
  onSeeSprintPlan,
  onGetDetailedReport,
  onViewDomain,
}) {
  const primaryRisk = risks[0]
  const isGroupB = userType.category === 'B'

  return (
    <div className="flex flex-col gap-[30px]">
      <ScoreHero scores={scores} band={band} />

      <div className={`grid gap-[30px] ${showSimplified ? '' : 'lg:grid-cols-[1fr_360px]'}`}>
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
                strongest={domain.domain === scores.strongest?.domain && !weakDomains.some((weakDomain) => weakDomain.domain === domain.domain)}
                weakest={!showSimplified && weakDomains.some((weakDomain) => weakDomain.domain === domain.domain)}
                onView={() => onViewDomain(domain.domain)}
              />
            ))}
          </div>
        </div>

        {!showSimplified && (
          <div className="grid h-full grid-rows-4 gap-4">
            {COMPONENT_ITEMS.map((item) => (
              <ComponentCard key={item.key} item={item} value={scores[item.key]} />
            ))}
          </div>
        )}
      </div>

      {showSimplified ? (
        <div className="rounded-[10px] border border-brand-100 bg-brand-50 p-6 text-center sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Your starting point</p>
          <h3 className="mt-2.5 font-display text-2xl font-bold text-sprint-ink">
            Everyone starts here — this just tells us where to begin.
          </h3>
          <p className="mx-auto mt-2.5 max-w-xl text-base leading-relaxed text-slate-600">
            We&rsquo;re skipping the deep risk analysis for now — it isn&rsquo;t useful yet at this stage. Your best next step
            is Module 1: a free, guided starting point built for exactly where you are today.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
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
            label={isGroupB ? 'Weak domains' : 'Domain gaps'}
            value={formatDomainList(weakDomains)}
            detail={isGroupB
              ? 'These are the domains CertSprints recommends repairing first with focused domain sprints.'
              : 'Start here before spending time on broad review. This is the highest-value sprint target.'}
            icon="icon-target-02.png"
          />
        </div>
      )}

      {isGroupB ? (
        <GroupBDomainSprintOffer
          weakDomains={weakDomains}
          onSeeSprintPlan={onSeeSprintPlan}
          onGetDetailedReport={onGetDetailedReport}
        />
      ) : (
        <GroupAFoundationOffer
          packageRec={packageRec}
          onGetDetailedReport={onGetDetailedReport}
        />
      )}
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
            {weakest && <span className="rounded-full bg-rose-50 px-3 py-0.5 text-sm text-rose-600">Priority Gap</span>}
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
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-slate-200 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">{item.label}</p>
        <img src={`${ASSET_BASE}/icons/${item.icon}`} alt="" className="h-10 w-10" />
      </div>
      <div>
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-1.5">
            <p className="font-display text-3xl font-bold tracking-[-0.39px] text-sprint-ink">{Math.round(value)}</p>
            <p className="pb-0.5 text-sm font-extrabold uppercase tracking-[1.4px] text-slate-400">/100</p>
          </div>
          <p className="text-base text-slate-500">Weight {item.weight}%</p>
        </div>
        <div className="mt-4 h-2.5 rounded-[5px] bg-slate-200">
          <div className="h-2.5 rounded-[5px]" style={{ width: `${value}%`, backgroundColor: item.color }} />
        </div>
      </div>
    </div>
  )
}

function GroupAFoundationOffer({ packageRec, onGetDetailedReport }) {
  return (
    <div className="rounded-[10px] border border-slate-100 bg-white p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Recommended next step</p>
          <h2 className="mt-2.5 font-display text-2xl font-bold tracking-[-0.39px] text-sprint-ink sm:text-3xl">
            {packageRec.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">{packageRec.detail}</p>
        </div>
        <div className="rounded-[10px] border border-brand-100 bg-brand-50 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Your next move</p>
          <p className="mt-2 text-base leading-relaxed text-slate-700">
            Start with the free foundation module, save your result, and unlock your detailed report and reviewed answers when you are ready.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <button className="flex min-h-[54px] items-center justify-center gap-2 whitespace-nowrap rounded bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 sm:text-base">
          Start for free
          <ArrowRightIcon stroke="white" />
        </button>
        <button
          onClick={onGetDetailedReport}
          className="flex min-h-[54px] items-center justify-center gap-2 whitespace-nowrap rounded border border-brand-500 bg-white px-5 py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:text-base"
        >
          <FileIcon />
          Get detailed report
        </button>
        <DetailedReportButton onClick={onGetDetailedReport} />
      </div>
    </div>
  )
}

function GroupBDomainSprintOffer({ weakDomains, onSeeSprintPlan, onGetDetailedReport }) {
  const domainNames = formatDomainList(weakDomains)

  return (
    <div className="rounded-[10px] border border-slate-100 bg-white p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[650px_1fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Recommended next step</p>
          <h2 className="mt-2.5 font-display text-[30px] font-bold leading-[38px] tracking-[-0.39px] text-sprint-ink">
            Focus on your priority domains first
          </h2>
          <p className="mt-3 text-base leading-relaxed text-sprint-ink">
            Your diagnostic shows that {domainNames} {weakDomains.length > 1 ? 'are' : 'is'} most likely holding your PMP readiness back.
          </p>

          <div className="mt-5 grid gap-4">
            {weakDomains.map((domain) => (
              <div key={domain.domain} className="flex items-center gap-4 rounded-[10px] border border-slate-200 bg-white p-4 sm:p-6">
                <div className="grid size-[50px] shrink-0 place-items-center rounded-[10px] bg-rose-50 text-rose-600 sm:size-[60px]">
                  <DomainIcon domain={domain.domain} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="text-xl font-semibold leading-7 tracking-[-0.2px] text-black">{domain.name}</p>
                    <span className="rounded-full bg-rose-50 px-3 py-0.5 text-sm text-rose-600">Priority Domain</span>
                  </div>
                  <div className="mt-1 flex items-end gap-1.5">
                    <p className="font-display text-[30px] font-bold leading-[38px] text-sprint-ink">{domain.score}</p>
                    <p className="pb-1 text-sm font-extrabold uppercase tracking-[0.1em] text-slate-400">/100</p>
                  </div>
                  <div className="mt-2 h-[14px] overflow-hidden rounded-[5px] bg-rose-100">
                    <div className="h-full rounded-[5px] bg-rose-600" style={{ width: `${domain.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2.5 border border-brand-50 bg-brand-50/50 p-2.5 text-base text-slate-500">
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-brand-500 text-xs font-semibold text-brand-500">i</span>
            Start here before full mock practice.
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a href="#sprint-plan" onClick={onSeeSprintPlan} className="flex min-h-[54px] items-center justify-center gap-2 rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600">
              See my sprint plan <ArrowRightIcon stroke="white" />
            </a>
            <DetailedReportButton onClick={onGetDetailedReport} />
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-[10px] border border-slate-100 bg-slate-50/50 p-5 sm:p-6">
          <h3 className="text-2xl font-bold leading-8 tracking-[-0.288px] text-sprint-ink">What your recommended sprint includes</h3>
          <p className="mt-1 text-base text-sprint-ink">Each recommended domain sprint includes</p>
          <div className="mt-6 grid gap-4">
            {DOMAIN_SPRINT_FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="grid size-[50px] shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-500"><FeatureIcon type={feature.icon} /></div>
                <div>
                  <p className="text-lg font-semibold leading-6 text-black">{feature.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{feature.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2.5 border border-brand-50 bg-brand-50/50 p-2.5 text-base text-brand-700">
            <span className="grid size-5 shrink-0 place-items-center rounded-full border border-brand-500 text-xs font-semibold text-brand-500">i</span>
            Pricing and sprint selection are shown on next page
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailedReportButton({ onClick, compact = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[54px] items-center justify-center gap-2 whitespace-nowrap rounded border border-brand-500 bg-white px-3 py-3 text-sm font-semibold text-brand-500 transition hover:bg-brand-50 sm:gap-2.5 sm:px-5 sm:text-base ${compact ? 'sm:col-span-2' : 'flex-1'}`}
    >
      <FileIcon />
      Unlock detailed report
    </button>
  )
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M5 3.5h6.2L15 7.3v9.2H5v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 3.8V8h4M7.8 11h4.4M7.8 14h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRightIcon({ stroke }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path d="M5 10h10M11 6l4 4-4 4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      <p className={`mt-2.5 max-w-[80%] text-xl font-bold tracking-[-0.288px] ${styles.value}`}>{value}</p>
      <p className={`mt-2.5 text-base leading-relaxed ${styles.detail}`}>{detail}</p>
      <img src={`${ASSET_BASE}/icons/${icon}`} alt="" className="absolute right-4 top-4 h-[46px] w-[46px]" />
    </div>
  )
}

function NavigatorView({
  scores,
  band,
  weakDomains,
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
          const weakest = weakDomains.some((weakDomain) => weakDomain.domain === domain.domain)
          const strongest = domain.domain === scores.strongest?.domain && !weakest
          const ringColor = weakest ? '#e11d48' : strongest ? '#16a34a' : '#007bff'
          return (
            <div key={domain.domain} className="flex items-center gap-5 rounded-[10px] border border-slate-200 bg-white p-4">
              <DomainRing score={domain.score} color={ringColor} />
              <div>
                <div className="flex items-center gap-2.5">
                  <p className="text-2xl font-bold tracking-[-0.288px] text-sprint-ink">{domain.name}</p>
                  {strongest && <span className="rounded-full bg-green-50 px-3 py-0.5 text-sm text-green-600">Strongest</span>}
                  {weakest && <span className="rounded-full bg-rose-50 px-3 py-0.5 text-sm text-rose-600">Priority Gap</span>}
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

// Recall answers get partial credit (see scoreRecallText in Assessment.jsx),
// so a flat correct/incorrect badge would show a 60% match identically to a
// 0% one. This mirrors the Strong/Partial/Weak tiering used at capture time.
const RECALL_STATUS_STYLES = {
  correct: { icon: 'icon-tick-circle-green.png', badge: 'bg-green-50', pill: 'border border-green-100 bg-green-50 text-green-600' },
  partial: { icon: 'icon-alert.png', badge: 'bg-amber-50', pill: 'border border-amber-100 bg-amber-50 text-amber-600' },
  incorrect: { icon: 'icon-cancel-circle-red.png', badge: 'bg-rose-50', pill: 'border border-rose-100 bg-rose-50 text-rose-600' },
}

function ReviewCard({ item, index, defaultOpen }) {
  const isRecall = item.examType === 'recall'
  const status = isRecall
    ? item.score >= 70 ? 'correct' : item.score >= 40 ? 'partial' : 'incorrect'
    : item.isCorrect ? 'correct' : 'incorrect'
  const { icon: statusIcon, badge: badgeClass, pill: pillClass } = RECALL_STATUS_STYLES[status]

  return (
    <details className="group rounded-2xl border border-slate-200 bg-white p-5 sm:p-[30px]" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-start gap-3">
        <span className={`grid h-[47px] w-[47px] shrink-0 place-items-center rounded-lg ${badgeClass}`}>
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
            <p>
              <span className="font-extrabold text-sprint-ink">Recall match:</span> {Math.round(item.score)}%
              {status === 'partial' && ' — partial credit, still counted proportionally toward your Recall score.'}
            </p>
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

function formatDomainList(domains) {
  const names = domains.map((domain) => DOMAIN_LABELS[domain.domain] || domain.name)

  if (names.length <= 1) return names[0] || 'Priority Domain'
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
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
