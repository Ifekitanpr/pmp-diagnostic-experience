import { useState } from 'react'
import heroBgStripes from '../../assets/landing/hero-bg-stripes.png'
import { formatDomainList } from './reportShared'

export default function DetailedReportView({ page = 'profile', userType, scores, band, risks, answers, recallAnswers, weakDomains, onBack, onReviewAnswers, onVerifyPage, onReportPage }) {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('pmp_report_profile')) || { firstName: '', lastName: '', email: '' }
    } catch {
      return { firstName: '', lastName: '', email: '' }
    }
  })
  const [verificationCode, setVerificationCode] = useState('')
  const stage = page
  const isGroupB = userType.category === 'B'
  const canCreateProfile = profile.firstName.trim() && profile.lastName.trim() && profile.email.trim()
  const deliverables = [
    ['Score breakdown', `Composite readiness score: ${scores.composite}/100`],
    [isGroupB ? 'Priority domains' : 'Foundation path', isGroupB ? formatDomainList(weakDomains) : 'Free Module 1 and guided baseline plan'],
    ['Detailed report page', 'A report page you can revisit, share, and download after creating your profile.'],
    ['Answer review access', 'Review the questions, explanations, and your marked answers from this attempt.'],
    ['Follow-up guidance', 'Email guidance matched to your diagnostic pattern.'],
  ]

  if (stage === 'report') {
    return <UnlockedReport profile={profile} scores={scores} band={band} risks={risks} answers={answers} recallAnswers={recallAnswers} weakDomains={weakDomains} isGroupB={isGroupB} onBack={onBack} onReviewAnswers={onReviewAnswers} />
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 px-5 py-16 sm:px-8 lg:px-[100px] lg:py-20">
      <img src={heroBgStripes} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="relative mx-auto max-w-[1180px] rounded-[10px] border border-slate-100 bg-white p-5 shadow-soft sm:p-[30px]">
        <p className="eyebrow-gradient">{stage === 'verify' ? 'Verify your email' : 'Detailed report'}</p>
        <h1 className="mt-2.5 font-display text-3xl font-bold leading-tight tracking-[-0.504px] text-sprint-ink sm:text-4xl">
          {stage === 'verify' ? 'Check your inbox' : 'Unlock your detailed report and reviewed answers'}
        </h1>
        <p className="mt-2.5 text-base leading-relaxed text-slate-500">
          {stage === 'verify'
            ? <>Create a free profile to save this result, unlock the detailed report page, and review your answers and explanations {isGroupB ? 'for your priority domains' : 'as you continue your foundation path'}.</>
            : <>Create a free profile to save this result, unlock the detailed report page, and review your answers and explanations {isGroupB ? 'for your priority domains' : 'as you continue your foundation path'}.</>}
        </p>

        <div className="mt-6 grid gap-[30px] lg:grid-cols-[1.18fr_0.82fr]">
        {stage === 'profile' ? <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!canCreateProfile) return
            sessionStorage.setItem('pmp_report_profile', JSON.stringify(profile))
            onVerifyPage()
          }}
          className="rounded-lg border border-slate-200 bg-white p-5 sm:p-[30px]"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              First name
              <input required value={profile.firstName} onChange={(event) => setProfile((current) => ({ ...current, firstName: event.target.value }))} className="h-[54px] rounded border border-slate-200 px-4 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-brand-500" placeholder="e.g. John" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Last name
              <input required value={profile.lastName} onChange={(event) => setProfile((current) => ({ ...current, lastName: event.target.value }))} className="h-[54px] rounded border border-slate-200 px-4 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-brand-500" placeholder="e.g. Doe" />
            </label>
          </div>
          <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
              Email address
              <input required type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="h-[54px] rounded border border-slate-200 px-4 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-brand-500" placeholder="example@gmail.com" />
          </label>
          <label className="mt-6 grid gap-2 text-sm font-semibold text-slate-700">
            Target PMP exam window
            <select className="h-[54px] rounded border border-slate-200 px-4 text-sm font-normal text-slate-400 outline-none transition focus:border-brand-500" defaultValue="">
              <option value="" disabled>Select One (Optional)</option>
              <option>Within 30 days</option>
              <option>1-3 months</option>
              <option>3+ months</option>
              <option>Not scheduled yet</option>
            </select>
          </label>
          <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-slate-600">
            <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" />
            Send me my detailed report and follow-up guidance from CertSprints.
          </label>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={onBack} className="flex min-h-[54px] items-center justify-center gap-3 rounded border border-slate-900 bg-white px-5 py-3 text-base font-bold text-slate-700 transition hover:bg-slate-50">
              <span aria-hidden className="text-2xl leading-none">←</span>
              Back to report
            </button>
            <button disabled={!canCreateProfile} className="flex min-h-[54px] items-center justify-center rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition enabled:hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300">
              Create Profile
            </button>
          </div>
        </form> : <VerificationPanel code={verificationCode} setCode={setVerificationCode} onBack={onBack} onVerify={onReportPage} />}

        <div className="rounded-lg border border-slate-200 bg-white p-5 sm:p-[30px]">
          <p className="text-base font-bold text-brand-500">What you will receive</p>
          <div className="mt-3 grid gap-2.5">
            {deliverables.map(([title, detail], index) => <ReportDeliverable key={title} number={index + 1} title={title} detail={detail} />)}
          </div>
          <button
            onClick={onReviewAnswers}
            className="mt-5 w-full text-sm font-semibold text-brand-500 transition hover:text-brand-700"
          >
            View reviewed answers
          </button>
        </div>
      </div>
      </div>
    </section>
  )
}

function VerificationPanel({ code, setCode, onBack, onVerify }) {
  const digits = code.padEnd(6, ' ').slice(0, 6).split('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (code.length === 6) onVerify()
      }}
      className="rounded-lg border border-slate-200 bg-white p-5 sm:p-[30px]"
    >
      <img src={`${import.meta.env.BASE_URL}certsprints-assets/detailed-report/email-verification.png`} alt="Email ready for verification" className="mx-auto h-[93px] w-[124px] object-cover" />
      <h2 className="mt-6 text-center font-display text-2xl font-bold leading-8 tracking-[-0.288px] text-black">Enter verification code</h2>
      <p className="mx-auto mt-2 max-w-md text-center text-sm font-medium leading-5 tracking-[-0.084px] text-slate-500">Please enter the 6-digit code sent to your provided email</p>
      <div className="relative mx-auto mt-6 max-w-md">
        <div className="flex items-center gap-2">
          {digits.map((digit, index) => (
            <span key={index} className="contents">
              {index === 3 && <span className="mx-1 h-px w-2.5 shrink-0 bg-slate-200" />}
              <span className={`grid h-[58px] min-w-0 flex-1 place-items-center rounded border text-sm font-normal ${index === code.length - 1 && digit.trim() ? 'border-brand-500' : 'border-slate-200'} text-slate-900`}>{digit}</span>
            </span>
          ))}
        </div>
        <input
          autoFocus
          inputMode="numeric"
          aria-label="Six-digit verification code"
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
          className="absolute inset-0 h-full w-full cursor-text opacity-0"
        />
      </div>
      <p className="mt-7 text-center text-sm font-medium tracking-[-0.084px] text-slate-500">I didn’t get the code <button type="button" disabled className="ml-1 text-slate-300">Resend in 01:59</button></p>
      <div className="mt-[30px] grid gap-5 sm:grid-cols-2">
        <button type="button" onClick={onBack} className="flex min-h-[60px] items-center justify-center gap-3 rounded border border-slate-200 bg-white px-6 py-[18px] text-lg font-semibold tracking-[-0.144px] text-slate-700 shadow-sm"><span className="text-2xl">←</span> Back to report</button>
        <button disabled={code.length !== 6} className="flex min-h-[60px] items-center justify-center gap-3 rounded bg-brand-500 px-6 py-[18px] text-lg font-semibold tracking-[-0.144px] text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-300">Verify email <span className="text-2xl">→</span></button>
      </div>
    </form>
  )
}

function UnlockedReport({ profile, scores, band, risks, answers, recallAnswers, weakDomains, isGroupB, onBack, onReviewAnswers }) {
  const correctAnswers = answers.filter((answer) => answer.isCorrect).length
  const missedAnswers = answers.length - correctAnswers
  const highConfidenceMisses = answers.filter((answer) => !answer.isCorrect && answer.confidence === 'high').length
  const avgTime = answers.length ? Math.round(answers.reduce((total, answer) => total + (answer.timeSpent || 0), 0) / answers.length) : 0
  const recallCompleted = recallAnswers.length

  return (
    <section className="bg-slate-50 px-5 py-12 sm:px-8 lg:px-[100px] lg:py-16 print:bg-white print:p-0">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center print:hidden">
          <button onClick={onBack} className="font-semibold text-slate-600">← Back to report</button>
          <div className="flex flex-wrap gap-3">
            <button onClick={onReviewAnswers} className="min-h-12 rounded border border-brand-500 bg-white px-5 font-semibold text-brand-500">Review answers</button>
            <button onClick={() => window.print()} className="min-h-12 rounded bg-brand-500 px-5 font-semibold text-white">↓ Download report</button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-soft print:mt-0 print:shadow-none">
          <div className="bg-gradient-to-r from-[#091427] to-[#035dbf] p-7 text-white sm:p-10">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-200">PMP detailed readiness report</p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{profile.firstName} {profile.lastName}</h1>
            <p className="mt-2 text-sm text-white/70">Verified profile · {profile.email}</p>
          </div>

          <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[320px_1fr]">
            <div className="flex h-full flex-col items-center justify-center rounded-[10px] bg-slate-50 p-6 text-center">
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Composite readiness</p>
              <p className="mt-5 font-display text-7xl font-bold text-brand-500">{scores.composite}</p>
              <p className="mt-1 text-sm font-bold text-slate-400">/100</p>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">Your score combines performance, pacing, confidence, and active recall.</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Domain breakdown</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-sprint-ink">Where your readiness stands</h2>
              <div className="mt-5 grid gap-4">
                {scores.domains.map((domain) => {
                  const priority = weakDomains.some((item) => item.domain === domain.domain)
                  return <div key={domain.domain} className="rounded border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold text-slate-800">{domain.name}</p>{priority && <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs text-rose-600">Priority domain</span>}</div><p className="font-bold">{domain.score}/100</p></div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded bg-slate-200"><div className={`h-full rounded ${priority ? 'bg-rose-600' : 'bg-brand-500'}`} style={{ width: `${domain.score}%` }} /></div>
                  </div>
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-5 border-t border-slate-200 p-5 sm:p-8 md:grid-cols-3">
            <ReportInsight label="Recommended path" value={isGroupB ? formatDomainList(weakDomains) : 'Foundation Sprint'} detail={isGroupB ? 'Repair these domains before broad mock practice.' : 'Build your PMP baseline before targeted practice.'} />
            <ReportInsight label="Performance" value={`${Math.round(scores.performance)}/100`} detail="Accuracy across the diagnostic questions." />
            <ReportInsight label="Recall strength" value={`${Math.round(scores.recall)}/100`} detail="Ability to retrieve essential PMP concepts." />
          </div>

          <ReportSection eyebrow="Executive interpretation" title={band.title}>
            <p className="text-base leading-relaxed text-slate-600">{band.meaning}</p>
            <div className="mt-5 rounded-[10px] border border-brand-100 bg-brand-50 p-5">
              <p className="text-sm font-bold text-brand-700">What this means for your preparation</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{band.message}</p>
            </div>
          </ReportSection>

          <ReportSection eyebrow="Readiness components" title="How your composite score was formed">
            <p className="max-w-3xl text-sm leading-relaxed text-slate-500">The readiness score combines question performance with recall strength, pacing discipline, and confidence calibration. These supporting indicators help distinguish knowledge gaps from exam-execution risks.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricBreakdown label="Performance" score={scores.performance} weight="65%" detail="Accuracy across weighted PMP scenarios." tone="blue" />
              <MetricBreakdown label="Active recall" score={scores.recall} weight="15%" detail={`${recallCompleted} recall checks completed.`} tone="purple" />
              <MetricBreakdown label="Pacing" score={scores.pacing} weight="10%" detail={`Average response time: ${avgTime}s.`} tone="orange" />
              <MetricBreakdown label="Confidence" score={scores.confidence} weight="10%" detail={`${highConfidenceMisses} high-confidence miss${highConfidenceMisses === 1 ? '' : 'es'}.`} tone="green" />
            </div>
          </ReportSection>

          <ReportSection eyebrow="Domain analysis" title="Detailed priority-domain findings">
            <div className="grid gap-5">
              {scores.domains.map((domain) => {
                const priority = weakDomains.some((item) => item.domain === domain.domain)
                return <DomainAnalysis key={domain.domain} domain={domain} priority={priority} />
              })}
            </div>
          </ReportSection>

          <ReportSection eyebrow="Risk analysis" title="Patterns that may affect exam performance">
            <div className="grid gap-4 md:grid-cols-2">
              {risks.map((risk) => <RiskFinding key={risk.label} risk={risk} />)}
              <RiskFinding risk={{ level: highConfidenceMisses ? 'medium' : 'low', label: 'Confidence calibration', detail: highConfidenceMisses ? `${highConfidenceMisses} incorrect response${highConfidenceMisses === 1 ? ' was' : 's were'} marked with high confidence. Review the reasoning pattern behind these answers.` : 'No significant high-confidence error pattern was detected in this attempt.' }} />
            </div>
          </ReportSection>

          <ReportSection eyebrow="Attempt statistics" title="What happened during this diagnostic">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatTile label="Scenario questions" value={answers.length} />
              <StatTile label="Correct" value={correctAnswers} />
              <StatTile label="Missed" value={missedAnswers} />
              <StatTile label="Recall checks" value={recallCompleted} />
              <StatTile label="Average time" value={`${avgTime}s`} />
            </div>
          </ReportSection>

          <ReportSection eyebrow="Recommended remediation" title="Your next focused study sequence">
            <div className="grid gap-4">
              {weakDomains.map((domain, index) => <ActionStep key={domain.domain} number={index + 1} title={`${domain.name} Sprint`} detail={getDomainRecommendation(domain.domain)} />)}
              <ActionStep number={weakDomains.length + 1} title="Review missed and overconfident answers" detail="Rework every missed scenario, explain why the distractors are weaker, and identify the PMI principle being tested." />
              <ActionStep number={weakDomains.length + 2} title="Validate with a timed mock" detail="After targeted remediation, complete a timed mock to confirm that knowledge, pacing, and confidence remain stable under pressure." />
            </div>
          </ReportSection>

          <ReportSection eyebrow="Readiness gates" title="What must improve before exam day">
            <div className="grid gap-4 md:grid-cols-3">
              <GateCard title="Domain stability" current={`${Math.min(...scores.domains.map((domain) => domain.score))}/100`} target="Target: every domain ≥ 70" />
              <GateCard title="Composite readiness" current={`${scores.composite}/100`} target="Target: sustained 80+" />
              <GateCard title="Confidence risk" current={`${highConfidenceMisses} flagged`} target="Target: zero repeated patterns" />
            </div>
          </ReportSection>

          <div className="border-t border-slate-200 bg-slate-50 p-5 sm:p-8">
            <p className="text-xs leading-relaxed text-slate-500">This report is based on a provisional diagnostic and is intended to guide preparation. It is not an official PMI score report or a guarantee of exam performance. Revalidate readiness with timed domain exams and full mock simulations.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReportSection({ eyebrow, title, children }) {
  return <section className="border-t border-slate-200 p-5 sm:p-8"><p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">{eyebrow}</p><h2 className="mt-2 font-display text-2xl font-bold text-sprint-ink sm:text-3xl">{title}</h2><div className="mt-5">{children}</div></section>
}

function MetricBreakdown({ label, score, weight, detail, tone }) {
  const colors = { blue: 'bg-brand-500', purple: 'bg-purple-500', orange: 'bg-orange-500', green: 'bg-green-500' }
  return <div className="rounded-[10px] border border-slate-200 p-5"><div className="flex items-center justify-between"><p className="font-semibold text-slate-800">{label}</p><span className="text-xs text-slate-400">Weight {weight}</span></div><p className="mt-4 font-display text-3xl font-bold text-sprint-ink">{score}<span className="text-sm text-slate-400">/100</span></p><div className="mt-3 h-2 overflow-hidden rounded bg-slate-200"><div className={`h-full rounded ${colors[tone]}`} style={{ width: `${Math.max(0, Math.min(100, score))}%` }} /></div><p className="mt-3 text-xs leading-relaxed text-slate-500">{detail}</p></div>
}

function DomainAnalysis({ domain, priority }) {
  return <div className={`rounded-[10px] border p-5 sm:p-6 ${priority ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200 bg-white'}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold text-slate-900">{domain.name}</h3>{priority && <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Priority domain</span>}</div><p className="mt-1 text-sm text-slate-500">ECO exam weight: {domain.ecoWeight}%</p></div><p className="font-display text-3xl font-bold text-sprint-ink">{domain.score}<span className="text-sm text-slate-400">/100</span></p></div><div className="mt-4 h-3 overflow-hidden rounded bg-slate-200"><div className={`h-full rounded ${priority ? 'bg-rose-600' : 'bg-brand-500'}`} style={{ width: `${domain.score}%` }} /></div><p className="mt-4 text-sm leading-relaxed text-slate-600">{getDomainFinding(domain.domain, domain.score)}</p></div>
}

function RiskFinding({ risk }) {
  const style = risk.level === 'high' ? 'border-rose-200 bg-rose-50 text-rose-700' : risk.level === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-green-200 bg-green-50 text-green-700'
  return <div className={`rounded-[10px] border p-5 ${style}`}><p className="text-xs font-extrabold uppercase tracking-[0.1em]">{risk.level} risk</p><h3 className="mt-2 text-lg font-bold text-slate-900">{risk.label}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{risk.detail}</p></div>
}

function StatTile({ label, value }) {
  return <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-5 text-center"><p className="font-display text-3xl font-bold text-sprint-ink">{value}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p></div>
}

function ActionStep({ number, title, detail }) {
  return <div className="flex gap-4 rounded-[10px] border border-slate-200 p-5"><span className="grid size-10 shrink-0 place-items-center rounded bg-brand-50 font-bold text-brand-500">{number}</span><div><p className="font-bold text-slate-800">{title}</p><p className="mt-1 text-sm leading-relaxed text-slate-500">{detail}</p></div></div>
}

function GateCard({ title, current, target }) {
  return <div className="rounded-[10px] border border-slate-200 p-5"><p className="text-sm font-semibold text-slate-700">{title}</p><p className="mt-3 font-display text-2xl font-bold text-sprint-ink">{current}</p><p className="mt-2 text-xs text-brand-600">{target}</p></div>
}

function getDomainFinding(domain, score) {
  const base = {
    people: 'This domain measures leadership, stakeholder engagement, conflict resolution, and team performance in situational questions.',
    process: 'This domain covers planning, delivery, risk, quality, change, and the practical mechanics of managing project work.',
    business: 'This domain connects project decisions to compliance, benefits, organizational change, and strategic business value.',
  }[domain]
  const interpretation = score < 55 ? 'The current result indicates a material readiness gap requiring structured remediation.' : score < 70 ? 'The foundation is present, but application is not yet stable enough for broad mock validation.' : 'This area is comparatively stable; maintain it through spaced recall and mixed practice.'
  return `${base} ${interpretation}`
}

function getDomainRecommendation(domain) {
  return {
    people: 'Prioritize servant leadership, conflict resolution, stakeholder engagement, team development, and situational judgment practice.',
    process: 'Reinforce integrated change control, risk responses, quality, planning, delivery approaches, and scenario-based process selection.',
    business: 'Review compliance, benefits realization, organizational change, governance, and alignment between project work and business value.',
  }[domain]
}

function ReportInsight({ label, value, detail }) {
  return <div className="rounded-[10px] border border-slate-200 bg-white p-5"><p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">{label}</p><p className="mt-3 text-xl font-bold text-sprint-ink">{value}</p><p className="mt-2 text-sm leading-relaxed text-slate-500">{detail}</p></div>
}

export function SubpageHeader({ eyebrow, title, detail, onBack }) {
  return (
    <div className="rounded-[10px] border border-slate-100 bg-white p-5 sm:p-6">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300"
      >
        <span aria-hidden>←</span> Back to report
      </button>
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">{eyebrow}</p>
      <h1 className="mt-2.5 font-display text-3xl font-bold leading-tight tracking-tight text-sprint-ink">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">{detail}</p>
    </div>
  )
}

function ReportDeliverable({ number, title, detail }) {
  return (
    <div className="flex gap-3 rounded border border-slate-200 bg-slate-50 p-3.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-sm bg-white text-sm font-medium text-brand-500">{number}</span>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{detail}</p>
      </div>
    </div>
  )
}
