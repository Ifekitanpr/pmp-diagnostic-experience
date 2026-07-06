import { useCallback, useEffect, useRef, useState } from 'react'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const TIMING_TARGETS = { easy: 60, moderate: 90, difficult: 120 }
const DOMAIN_LABELS = { people: 'People', process: 'Process', business: 'Business' }
const DOMAIN_BADGE_LABELS = { people: 'People Domain', process: 'Process Domain', business: 'Business Domain' }
const DOMAIN_ECO_WEIGHT = { people: 33, process: 41, business: 26 }
const DOMAIN_RING_COLOR = { people: '#54a7ff', process: '#007bff', business: '#974ffc' }

export default function Assessment({ questions, onComplete, onLogoClick, onboardingMode = false }) {
  const [qIndex, setQIndex] = useState(0)
  const [responses, setResponses] = useState({})
  const [flagged, setFlagged] = useState({})
  const [elapsed, setElapsed] = useState(0)
  const [showMap, setShowMap] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [examMenuOpen, setExamMenuOpen] = useState(false)
  const startRef = useRef(Date.now())

  const q = questions[qIndex]
  const response = responses[qIndex] || {}
  const target = TIMING_TARGETS[q.difficulty] || 90
  const domains = ['people', 'process', 'business']
  const answeredCount = Object.values(responses).filter((r) => isCompleteResponse(r, onboardingMode)).length
  const timerTone = elapsed <= target ? 'green' : elapsed <= target * 1.3 ? 'orange' : 'red'

  useEffect(() => {
    startRef.current = Date.now()
    setElapsed(0)
  }, [qIndex])

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [qIndex])

  const playSound = useCallback((type) => {
    if (!soundOn) return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      const ctx = new Ctx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      const freq = { select: 600, confidence: 760, advance: 920, correct: 1040, incomplete: 340 }[type] || 600
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
      osc.onended = () => ctx.close()
    } catch {
      // Web Audio unsupported or blocked — sound is a nice-to-have, fail silently.
    }
  }, [soundOn])

  const setResponse = (patch) => {
    setResponses((current) => ({
      ...current,
      [qIndex]: {
        ...current[qIndex],
        ...patch,
        timeSpent: Math.max(current[qIndex]?.timeSpent || 0, elapsed),
      },
    }))
  }

  const handleNext = () => {
    if (qIndex + 1 < questions.length) setQIndex(qIndex + 1)
    else finishExam()
  }

  const finishExam = () => {
    const compiled = questions.map((question, index) => compileAnswer(question, responses[index], flagged[index], index))
    onComplete({
      answers: compiled.filter((answer) => answer.examType === 'scenario'),
      recallAnswers: compiled.filter((answer) => answer.examType === 'recall'),
      reviewAnswers: compiled,
    })
  }

  const isRecall = q.examType === 'recall'
  // Only free-text recall gets the prompt/textarea + Recall Synthesis treatment.
  // Recognition-recall (multiple-choice) behaves exactly like a normal scenario question.
  const isTextRecall = isRecall && q.type !== 'recognition'

  useEffect(() => {
    if (isTextRecall) return
    if (response.selected === undefined) return
    if (!onboardingMode && response.confidence === undefined) return
    playSound('advance')
    const id = setTimeout(() => handleNext(), 550)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.selected, response.confidence, isTextRecall, onboardingMode])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-sprint-ink">
      <div className="sticky top-0 z-40 bg-[#030507] px-4 py-4 sm:px-10 sm:py-5">
        <div className="relative flex w-full items-center justify-between gap-3">
          <button
            onClick={onLogoClick}
            className="flex shrink-0 items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-white/20"
          >
            <img src={`${ASSET_BASE}/icons/icon-certificate.png`} alt="" className="h-6 w-6 shrink-0" />
            <span className="max-w-[160px] truncate text-sm font-medium text-white sm:max-w-[220px] lg:max-w-[260px]">
              PMP Project Management Professional
            </span>
            <img src={`${ASSET_BASE}/icons/icon-chevron-white.png`} alt="" className="h-5 w-5 shrink-0" />
          </button>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setSoundOn((value) => !value)}
              className="flex items-center gap-2 rounded border border-white/10 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:border-white/20"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M3 7.5h3L10 4v12l-4-3.5H3v-5Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
                {soundOn && <path d="M13.5 7.2c.9.7 1.5 1.7 1.5 2.8s-.6 2.1-1.5 2.8M15.7 5c1.5 1.2 2.5 3 2.5 5s-1 3.8-2.5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />}
              </svg>
              Sound {soundOn ? 'on' : 'off'}
            </button>
            <button
              onClick={() => setShowEndConfirm(true)}
              className="rounded bg-[#f43f5e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600"
            >
              End Assessment
            </button>
          </div>

          <DotProgress
            questions={questions}
            qIndex={qIndex}
            responses={responses}
            onboardingMode={onboardingMode}
            className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:w-[620px] lg:-translate-x-1/2 lg:-translate-y-1/2"
          />

          <button
            onClick={() => setExamMenuOpen((value) => !value)}
            aria-expanded={examMenuOpen}
            aria-label="Toggle exam menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
          >
            <span className="relative block h-3.5 w-4">
              <span className={`absolute left-0 top-0 block h-[1.5px] w-4 bg-current transition ${examMenuOpen ? 'top-1/2 rotate-45' : ''}`} />
              <span className={`absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-current transition ${examMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`absolute bottom-0 left-0 block h-[1.5px] w-4 bg-current transition ${examMenuOpen ? 'bottom-1/2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        {examMenuOpen && (
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3 lg:hidden">
            <button
              onClick={() => { setExamMenuOpen(false); setShowMap(true) }}
              className="flex items-center gap-2.5 rounded border border-white/10 px-4 py-2.5 text-left text-sm font-medium text-white"
            >
              <img src={`${ASSET_BASE}/icons/icon-menu.png`} alt="" className="h-5 w-5" />
              All questions
            </button>
            <button
              onClick={() => setSoundOn((value) => !value)}
              className="flex items-center gap-2 rounded border border-white/10 px-4 py-2.5 text-left text-sm font-medium text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M3 7.5h3L10 4v12l-4-3.5H3v-5Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" />
                {soundOn && <path d="M13.5 7.2c.9.7 1.5 1.7 1.5 2.8s-.6 2.1-1.5 2.8M15.7 5c1.5 1.2 2.5 3 2.5 5s-1 3.8-2.5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />}
              </svg>
              Sound {soundOn ? 'on' : 'off'}
            </button>
            <button
              onClick={() => { setExamMenuOpen(false); setShowEndConfirm(true) }}
              className="rounded bg-[#f43f5e] px-4 py-2.5 text-left text-sm font-medium text-white transition hover:bg-rose-600"
            >
              End Assessment
            </button>
          </div>
        )}
      </div>

      <section className="border-b border-slate-200 bg-white">
        <div className="section-shell scrollbar-none flex items-center gap-8 overflow-x-auto px-6 py-4 sm:flex-wrap sm:justify-between sm:gap-6 sm:overflow-visible sm:px-10">
          <div className="flex shrink-0 items-center gap-x-8 sm:flex-wrap sm:gap-x-[60px] sm:gap-y-3">
            {domains.map((domain) => (
              <div key={domain} className="flex shrink-0 items-center gap-3">
                <img src={`${ASSET_BASE}/icons/domain-ring-${domain}.png`} alt="" className="h-9 w-9" />
                <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-extrabold uppercase tracking-[0.1em]">
                  <span className="text-slate-400">{DOMAIN_LABELS[domain]}:</span>
                  <span style={{ color: DOMAIN_RING_COLOR[domain] }}>{DOMAIN_ECO_WEIGHT[domain]}%</span>
                </span>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-x-6 text-xs font-extrabold uppercase tracking-[0.1em] sm:flex-wrap sm:gap-x-[60px] sm:gap-y-3">
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Pacing:</span>
              <span className={timerTone === 'green' ? 'text-green-600' : timerTone === 'orange' ? 'text-sprint-orange' : 'text-red-500'}>
                {elapsed}s
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Answered</span>
              <span className="text-sprint-ink">{answeredCount}/{questions.length}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Flagged:</span>
              <span className="text-sprint-orange">{Object.values(flagged).filter(Boolean).length}</span>
            </span>
          </div>
        </div>
      </section>

      <main className="bg-[#f8fafc] p-3">
        <div className="rounded-xl bg-white p-5 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-center">
            <div className="hidden shrink-0 lg:block">
              <button
                onClick={() => setShowMap(true)}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2"
              >
                <img src={`${ASSET_BASE}/icons/icon-menu.png`} alt="" className="h-6 w-6" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-500">All questions</span>
              </button>
            </div>

            <div className="w-full max-w-[800px] px-0 sm:px-5">
              <div className="rounded-2xl border border-slate-200 p-5 sm:p-[30px]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="hidden rounded-full border border-brand-100 bg-brand-50/30 px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-brand-500 sm:inline-flex">
                      {DOMAIN_BADGE_LABELS[q.domain]}
                    </span>
                    <span className="text-xs uppercase tracking-[0.1em] text-slate-400">Question {String(qIndex + 1).padStart(2, '0')}</span>
                  </div>
                  <TimerRing elapsed={elapsed} target={target} tone={timerTone} />
                </div>

                <p className="mt-6 font-display text-lg font-bold leading-[26px] tracking-tight text-sprint-ink sm:text-2xl sm:leading-[32px]">{q.text}</p>

                {isTextRecall && (
                  <p className="mt-2.5 text-sm text-slate-600">Produce the answer from a clue.</p>
                )}

                <div className="mt-6">
                  {isTextRecall ? (
                    <RecallPrompt question={q} response={response} onChange={setResponse} playSound={playSound} />
                  ) : (
                    <ScenarioOptions
                      question={q}
                      selected={response.selected}
                      onSelect={(selected) => { playSound('select'); setResponse({ selected }) }}
                    />
                  )}
                </div>

                <button
                  onClick={() => setFlagged((current) => ({ ...current, [qIndex]: !current[qIndex] }))}
                  className={`mt-5 flex items-center gap-1.5 text-xs font-semibold ${flagged[qIndex] ? 'text-amber-600' : 'text-slate-400 hover:text-amber-600'}`}
                >
                  <span>⚑</span>
                  {flagged[qIndex] ? 'Flagged for review' : 'Mark for review'}
                </button>
              </div>
            </div>

            {!onboardingMode && (
              <aside className={`w-full shrink-0 [perspective:1000px] ${isTextRecall && response.revealed ? 'lg:w-[313px]' : 'lg:w-[241px]'}`}>
                {isTextRecall && response.revealed ? (
                  <RecallSynthesisPanel question={q} response={response} onAcknowledge={handleNext} />
                ) : (
                  <ConfidencePanel
                    active={!isTextRecall && response.selected !== undefined}
                    value={response.confidence}
                    onSelect={(confidence) => { playSound('confidence'); setResponse({ confidence }) }}
                  />
                )}
              </aside>
            )}
          </div>
        </div>
      </main>

      {showMap && (
        <QuestionNavigatorOverlay
          questions={questions}
          qIndex={qIndex}
          responses={responses}
          flagged={flagged}
          onboardingMode={onboardingMode}
          onJump={(index) => { setQIndex(index); setShowMap(false) }}
          onClose={() => setShowMap(false)}
        />
      )}

      {showEndConfirm && (
        <EndAssessmentModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={finishExam}
        />
      )}
    </div>
  )
}

function DotProgress({ questions, qIndex, responses, onboardingMode = false, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[620px] flex-wrap items-center justify-center gap-1 ${className}`}>
      {questions.map((question, index) => {
        const done = isCompleteResponse(responses[index], onboardingMode)
        const ongoing = index === qIndex
        return (
          <span
            key={question.id}
            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
              ongoing
                ? 'border-brand-300 bg-brand-500/20'
                : done
                ? 'border-brand-300 bg-brand-500'
                : 'border-slate-800'
            }`}
          >
            {done && <span className="text-[7px] text-white">✓</span>}
            {!done && <span className="h-1 w-1 rounded-full bg-slate-800" />}
          </span>
        )
      })}
    </div>
  )
}

function TimerRing({ elapsed, target, tone }) {
  const color = tone === 'green' ? '#16a34a' : tone === 'orange' ? '#ff6b35' : '#ef4444'
  const r = 20
  const c = 2 * Math.PI * r
  const progress = Math.min(1, elapsed / target)
  const offset = c * (1 - progress)

  return (
    <div className="flex items-center gap-2 rounded px-4 py-2.5">
      <div className="relative h-12 w-12 shrink-0">
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
          <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className="timer-ring" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium" style={{ color }}>{elapsed}s</span>
        <span className="text-[10px] font-medium tracking-tight text-slate-700">target {target}s</span>
      </div>
    </div>
  )
}

function ScenarioOptions({ question, selected, onSelect }) {
  return (
    <div className="grid gap-2">
      {question.options.map((option, index) => (
        <button
          key={option}
          onClick={() => onSelect(index)}
          className={`flex items-center gap-3 rounded border p-4 text-left shadow-xs transition ${
            selected === index ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50'
          }`}
        >
          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected === index ? 'border-brand-500' : 'border-slate-300'}`}>
            {selected === index && <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />}
          </span>
          <span className="text-sm text-slate-400">{String.fromCharCode(65 + index)}.</span>
          <span className="text-sm leading-relaxed text-slate-700">{option}</span>
        </button>
      ))}
    </div>
  )
}

function RecallPrompt({ question, response, onChange, playSound }) {
  if (response.revealed) {
    return (
      <div className="grid gap-2.5">
        <div className="rounded-[10px] border border-slate-100 bg-brand-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand-500">Your answer</p>
          <p className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-slate-900">{response.text || 'No answer'}</p>
        </div>
        <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Model answer</p>
          <p className="mt-1 text-base leading-relaxed text-slate-900">{question.modelAnswer}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-2.5">
      <div className="rounded-[10px] border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-slate-500">Prompt</p>
        <p className="mt-1 text-base font-semibold leading-relaxed text-slate-700">{question.prompt}</p>
      </div>
      <textarea
        value={response.text || ''}
        onChange={(event) => onChange({ text: event.target.value })}
        placeholder="Write what you can remember. Short is fine if it is honest."
        rows={6}
        className="w-full resize-none rounded-[10px] border border-slate-200 bg-white p-4 text-base leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
      />
      <button
        onClick={() => {
          const score = scoreRecallText(response.text || '', question.keywords || [], question.minRequired)
          playSound?.(score >= 70 ? 'correct' : 'incomplete')
          onChange({ revealed: true, score })
        }}
        disabled={(response.text || '').trim().length < 3}
        className={`h-12 w-full rounded text-base font-semibold transition ${
          (response.text || '').trim().length >= 3 ? 'bg-brand-500 text-white hover:bg-brand-600' : 'bg-slate-100 text-slate-300'
        }`}
      >
        Reveal model answer
      </button>
    </div>
  )
}

// Recall scoring gives partial credit (see scoreRecallText), so a binary
// CORRECT/INCOMPLETE label would show a 60% match the same as a 0% one.
const RECALL_STATUS = {
  correct: { bg: 'bg-[#2ecc71]', icon: '✓', label: 'CORRECT' },
  partial: { bg: 'bg-sprint-orange', icon: '~', label: 'PARTIAL' },
  incorrect: { bg: 'bg-rose-500', icon: '!', label: 'INCOMPLETE' },
}

function RecallSynthesisPanel({ question, response, onAcknowledge }) {
  const score = response.score ?? (response.selected === question.correct ? 100 : 0)
  const status = score >= 70 ? 'correct' : score >= 40 ? 'partial' : 'incorrect'
  const correct = status === 'correct'
  const { bg, icon, label } = RECALL_STATUS[status]
  const keywords = question.keywords || []
  const normalizedAnswer = (response.text || '').toLowerCase()
  const missed = question.type === 'recognition'
    ? null
    : keywords
        .filter((entry) => !keywordHit(entry, normalizedAnswer))
        .map((entry) => (Array.isArray(entry) ? entry.join(' / ') : entry))

  return (
    <div className="flip-in origin-top rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <div className="flex items-center justify-between px-2">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">📖 Recall Synthesis</span>
        <button onClick={onAcknowledge} className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500">✕</button>
      </div>

      <div className={`mt-3 rounded-lg p-1 ${bg}`}>
        <div className="flex flex-col items-center gap-2 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/25 text-base text-white">{icon}</span>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <div className="rounded-lg bg-white p-3 text-center">
          <span className="text-sm font-semibold text-slate-700">
            Retrieval Success: <span className="text-brand-500">{Math.round(score)}%</span>
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
        <p className="text-sm font-medium text-slate-700">What you missed:</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {missed === null ? (correct ? 'Correct selection.' : `Correct answer: ${question.options?.[question.correct]}`)
            : missed.length === 0 ? 'Perfect recall! All anchors secured.' : missed.join(', ')}
        </p>
      </div>

      <button
        onClick={onAcknowledge}
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded bg-brand-500 text-base font-semibold text-white transition hover:bg-brand-600"
      >
        👍 Ok, got it
      </button>
    </div>
  )
}

function ConfidencePanel({ active, value, onSelect }) {
  const levels = [
    { level: 'low', label: 'Low', desc: 'Guess' },
    { level: 'medium', label: 'Med', desc: 'Some proof' },
    { level: 'high', label: 'High', desc: 'Certain' },
  ]

  const needsAttention = active && !value

  return (
    <div className={`rounded-lg border p-6 transition ${needsAttention ? 'confidence-nudge border-brand-300 shadow-panel' : 'border-slate-200'} bg-white`}>
      <p className="text-lg font-bold text-brand-500">Confidence</p>
      <p className="text-lg font-semibold text-sprint-ink">{active ? 'How sure?' : 'Answer first'}</p>

      <div className="mt-4 grid gap-2.5">
        {levels.map((confidence) => (
          <button
            key={confidence.level}
            disabled={!active}
            onClick={() => onSelect(confidence.level)}
            className={`flex items-center justify-between rounded border p-4 text-left text-sm shadow-xs transition ${
              !active
                ? 'cursor-not-allowed border-slate-200 text-slate-300'
                : value === confidence.level
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-slate-200 hover:border-brand-300 hover:bg-brand-50'
            }`}
          >
            <span className={active ? 'text-slate-400' : 'text-slate-300'}>{confidence.label}</span>
            <span className={active ? 'text-slate-700' : 'text-slate-300'}>{confidence.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function QuestionNavigatorOverlay({ questions, qIndex, responses, flagged, onboardingMode = false, onJump, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/35 p-6 pt-16 backdrop-blur-[6px] sm:pt-24">
      <div className="flex w-full max-w-[700px] flex-col gap-[30px] rounded-[10px] bg-white p-6 sm:px-10 sm:py-[30px]">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-[47px] w-[47px] shrink-0 place-items-center rounded-[8px] bg-brand-50">
                <img src={`${ASSET_BASE}/icons/icon-menu.png`} alt="" className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xl font-extrabold tracking-tight text-sprint-ink">Question Navigator</p>
                <p className="text-xs uppercase tracking-[0.1em] text-slate-400">Jump to specific item to review</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close navigator" className="rounded-lg p-2 transition hover:bg-slate-50">
              <img src={`${ASSET_BASE}/icons/icon-close.png`} alt="" className="h-6 w-6" />
            </button>
          </div>
          <div className="h-px w-full bg-slate-100" />
        </div>

        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-10">
          {questions.map((item, index) => {
            const complete = isCompleteResponse(responses[index], onboardingMode)
            const current = index === qIndex
            const isFlagged = Boolean(flagged[index])
            const cellClass = isFlagged
              ? 'border border-sprint-orange bg-accent-50 text-sprint-orange'
              : current
              ? 'border border-brand-500 bg-brand-50 text-brand-500'
              : complete
              ? 'border border-transparent bg-brand-50 text-brand-500'
              : 'border border-transparent bg-slate-50 text-slate-300'
            return (
              <button
                key={item.id}
                onClick={() => onJump(index)}
                className={`grid h-[60px] w-[60px] place-items-center rounded-[8px] text-lg font-extrabold tracking-[0.1em] ${cellClass}`}
              >
                {String(index + 1).padStart(2, '0')}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-600">
              <span className="h-5 w-5 rounded-full bg-brand-50" /> Answered
            </span>
            <span className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-600">
              <span className="h-5 w-5 rounded-full border border-sprint-orange bg-accent-50" /> Flagged
            </span>
            <span className="flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-slate-600">
              <span className="h-5 w-5 rounded-full border border-brand-500 bg-brand-50" /> Current
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded bg-[#030507] px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-800"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  )
}

function EndAssessmentModal({ answeredCount, totalCount, onCancel, onConfirm }) {
  const remaining = totalCount - answeredCount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-6 backdrop-blur-[6px]">
      <div className="w-full max-w-[420px] rounded-[10px] bg-white p-6 text-center sm:p-[30px]">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#f43f5e]">
            <path d="M12 4 21 19H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
          </svg>
        </span>
        <p className="mt-4 text-xl font-extrabold tracking-tight text-sprint-ink">End assessment now?</p>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          {remaining > 0
            ? `You still have ${remaining} unanswered question${remaining === 1 ? '' : 's'}. They'll be scored as incomplete and this can't be undone.`
            : "You've answered every question. This will submit your assessment and can't be undone."}
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            onClick={onConfirm}
            className="h-12 w-full rounded bg-[#f43f5e] text-base font-semibold text-white transition hover:bg-rose-600 sm:w-auto sm:flex-1"
          >
            End Assessment
          </button>
          <button
            onClick={onCancel}
            className="h-12 w-full rounded border border-slate-200 text-base font-semibold text-slate-700 transition hover:border-brand-300 sm:w-auto sm:flex-1"
          >
            Keep going
          </button>
        </div>
      </div>
    </div>
  )
}

function isCompleteResponse(response, skipConfidence = false) {
  if (!response) return false
  if (response.text !== undefined) return Boolean(response.revealed)
  if (response.selected !== undefined && response.revealed) return true
  if (response.selected !== undefined) return skipConfidence || response.confidence !== undefined
  return false
}

function compileAnswer(question, response = {}, flagged = false, order = 0) {
  const timeSpent = response.timeSpent || 0

  if (question.examType === 'recall') {
    const score = question.type === 'recognition'
      ? response.selected === question.correct ? 100 : 0
      : response.score ?? scoreRecallText(response.text || '', question.keywords || [], question.minRequired)

    return {
      questionId: question.id,
      order,
      examType: 'recall',
      domain: question.domain,
      type: question.type,
      text: question.text,
      options: question.options,
      score,
      timeSpent,
      flagged,
      answer: response.text ?? response.selected,
      correct: question.correct,
      modelAnswer: question.modelAnswer,
    }
  }

  return {
    questionId: question.id,
    order,
    examType: 'scenario',
    domain: question.domain,
    text: question.text,
    options: question.options,
    difficulty: question.difficulty,
    weight: question.weight,
    isCorrect: response.selected === question.correct,
    selected: response.selected,
    correct: question.correct,
    timeSpent,
    confidence: response.confidence,
    skipped: false,
    flagged,
    explanation: question.explanation,
  }
}

// A `keywords` entry can be a single required word, or an array of synonyms
// where matching ANY one of them satisfies that one concept (e.g. "obstacles"
// / "impediments" / "blockers" all count as the same correct answer, rather
// than being scored as three separate required words).
function keywordHit(entry, normalizedText) {
  const synonyms = Array.isArray(entry) ? entry : [entry]
  return synonyms.some((word) => normalizedText.includes(word.toLowerCase()))
}

// `minRequired` supports "name any N of these" questions (e.g. "name three
// factors") — without it, a fully correct answer naming exactly what was
// asked for would be unfairly scored against the full, longer keyword list.
function scoreRecallText(text, keywords, minRequired) {
  if (!keywords.length) return text.trim().length >= 10 ? 60 : 20
  const normalized = text.toLowerCase()
  const hits = keywords.filter((entry) => keywordHit(entry, normalized)).length
  const required = minRequired ? Math.min(minRequired, keywords.length) : keywords.length
  return Math.round((Math.min(hits, required) / required) * 100)
}
