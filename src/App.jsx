import { useState, useEffect, useCallback, useRef } from 'react'
import Landing          from './components/Landing'
import UserTypeSelection from './components/UserTypeSelection'
import Instructions     from './components/Instructions'
import Assessment       from './components/Assessment'
import Report           from './components/Report'
import { CertSprintsLogo, SiteFooter, SiteHeader } from './components/SiteChrome'
import { getQuestions } from './data/questions'
import { RECALL_CHECKS } from './data/recallChecks'

const VIEWS = {
  LANDING:     'landing',
  USER_TYPE:   'userType',
  INSTRUCTIONS:'instructions',
  ASSESSMENT:  'assessment',
  CALCULATING: 'calculating',
  REPORT:      'report',
}

const HASH_MAP = {
  '':             VIEWS.LANDING,
  '#':            VIEWS.LANDING,
  '#home':        VIEWS.LANDING,
  '#pmp':         VIEWS.LANDING,
  '#landing':     VIEWS.LANDING,
  '#calibrate':   VIEWS.USER_TYPE,
  '#instructions':VIEWS.INSTRUCTIONS,
  '#diagnose':    VIEWS.ASSESSMENT,
  '#calculating': VIEWS.CALCULATING,
  '#report':      VIEWS.REPORT,
}

const VIEW_TO_HASH = {
  [VIEWS.LANDING]:      '#landing',
  [VIEWS.USER_TYPE]:    '#calibrate',
  [VIEWS.INSTRUCTIONS]: '#instructions',
  [VIEWS.ASSESSMENT]:   '#diagnose',
  [VIEWS.CALCULATING]:  '#calculating',
  [VIEWS.REPORT]:       '#report',
}

const ANCHOR_HASHES = [
  '#how-it-works',
  '#faq',
  '#discover',
  '#pricing',
  '#success-stories',
  '#free-trial',
  '#categories',
  '#hero'
]

export default function App() {
  // Sync view state with URL Hash
  const [view, setView] = useState(() => {
    const hash = window.location.hash
    return HASH_MAP[hash] || VIEWS.LANDING
  })

  // Sync diagnostic state variables with sessionStorage to preserve progress on reload
  const [userType, setUserType] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pmp_user_type')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [questions, setQuestions] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pmp_questions')
      const parsed = saved ? JSON.parse(saved) : []
      return parsed.length === 30 && parsed.every((question) => question.examType) ? parsed : []
    } catch {
      return []
    }
  })

  const [mcqAnswers, setMcqAnswers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pmp_mcq_answers')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [recallAnswers, setRecallAnswers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('pmp_recall_answers')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const reportTimeoutRef = useRef(null)

  // Persist states to sessionStorage
  useEffect(() => {
    if (userType) {
      sessionStorage.setItem('pmp_user_type', JSON.stringify(userType))
    } else {
      sessionStorage.removeItem('pmp_user_type')
    }
  }, [userType])

  useEffect(() => {
    if (questions && questions.length > 0) {
      sessionStorage.setItem('pmp_questions', JSON.stringify(questions))
    } else {
      sessionStorage.removeItem('pmp_questions')
    }
  }, [questions])

  useEffect(() => {
    if (mcqAnswers && mcqAnswers.length > 0) {
      sessionStorage.setItem('pmp_mcq_answers', JSON.stringify(mcqAnswers))
    } else {
      sessionStorage.removeItem('pmp_mcq_answers')
    }
  }, [mcqAnswers])

  useEffect(() => {
    if (recallAnswers && recallAnswers.length > 0) {
      sessionStorage.setItem('pmp_recall_answers', JSON.stringify(recallAnswers))
    } else {
      sessionStorage.removeItem('pmp_recall_answers')
    }
  }, [recallAnswers])

  // Navigation: updates hash, which will trigger hashchange listener
  const goTo = useCallback((nextView) => {
    const hash = VIEW_TO_HASH[nextView] || '#landing'
    window.location.hash = hash
    setView(nextView)
  }, [])

  // Listen for hash changes to sync view state (handles browser Back/Forward & direct link loading)
  useEffect(() => {
    const onHashChange = () => {
      if (reportTimeoutRef.current) {
        clearTimeout(reportTimeoutRef.current)
        reportTimeoutRef.current = null
      }
      const hash = window.location.hash

      // If it is a sub-section anchor hash, don't change the view state.
      // Simply smooth scroll to the target element if it exists in the active DOM.
      if (ANCHOR_HASHES.includes(hash)) {
        const element = document.getElementById(hash.substring(1))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }

      setView(HASH_MAP[hash] || VIEWS.LANDING)
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleStart = () => goTo(VIEWS.USER_TYPE)

  const handleUserType = (ut) => {
    setUserType(ut)
    setQuestions(getExamQuestions(ut.category))
    goTo(VIEWS.INSTRUCTIONS)
  }

  const handleBegin = () => goTo(VIEWS.ASSESSMENT)

  const handleAssessmentComplete = ({ answers, recallAnswers }) => {
    setMcqAnswers(answers)
    setRecallAnswers(recallAnswers)
    setView(VIEWS.CALCULATING)
    reportTimeoutRef.current = setTimeout(() => {
      reportTimeoutRef.current = null
      goTo(VIEWS.REPORT)
    }, 1800)
  }

  const handleRetake = () => {
    setUserType(null)
    setQuestions([])
    setMcqAnswers([])
    setRecallAnswers([])
    sessionStorage.clear()
    goTo(VIEWS.LANDING)
  }

  if (view === VIEWS.LANDING)
    return <Landing onStart={handleStart} onLogoClick={() => goTo(VIEWS.LANDING)} />

  if (view === VIEWS.USER_TYPE)
    return <UserTypeSelection onSelect={handleUserType} onLogoClick={() => goTo(VIEWS.LANDING)} />

  if (view === VIEWS.INSTRUCTIONS)
    return userType
      ? <Instructions userType={userType} onBegin={handleBegin} onLogoClick={() => goTo(VIEWS.LANDING)} />
      : <Landing onStart={handleStart} onLogoClick={() => goTo(VIEWS.LANDING)} />

  if (view === VIEWS.ASSESSMENT)
    return questions.length > 0
      ? <Assessment questions={questions} onComplete={handleAssessmentComplete} onLogoClick={() => goTo(VIEWS.LANDING)} />
      : <Landing onStart={handleStart} onLogoClick={() => goTo(VIEWS.LANDING)} />

  if (view === VIEWS.CALCULATING)
    return <CalculatingScreen onLogoClick={() => goTo(VIEWS.LANDING)} />

  if (view === VIEWS.REPORT)
    return userType && mcqAnswers.length > 0
      ? (
        <Report
          answers={mcqAnswers}
          recallAnswers={recallAnswers}
          userType={userType}
          onRetake={handleRetake}
          onLogoClick={() => goTo(VIEWS.LANDING)}
        />
      )
      : <Landing onStart={handleStart} onLogoClick={() => goTo(VIEWS.LANDING)} />

  return null
}

function getExamQuestions(category) {
  const byDomain = ['people', 'process', 'business']
  const scenarioQuestions = getQuestions(category)
  const exam = []

  byDomain.forEach((domain) => {
    const scenarios = scenarioQuestions
      .filter((question) => question.domain === domain)
      .slice(0, 5)
      .map((question) => ({ ...question, examType: 'scenario' }))

    const recall = RECALL_CHECKS
      .filter((question) => question.domain === domain)
      .map((question) => ({
        ...question,
        id: `exam-${question.id}`,
        examType: 'recall',
        difficulty: category === 'A' ? 'moderate' : 'difficult',
        weight: 1,
        text: question.question,
        explanation: question.modelAnswer,
      }))

    exam.push(...scenarios, ...recall)
  })

  return exam.slice(0, 30)
}

function CalculatingScreen({ onLogoClick }) {
  const checks = [
    'ECO-weighted performance',
    'Pacing pressure',
    'Confidence calibration',
    'Recall strength',
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink font-sans">
      <SiteHeader compact label="Diagnostic Report" onLogoClick={onLogoClick} />

      <main className="grid min-h-[680px] place-items-center px-5 py-16">
        <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-100 bg-white p-8">
            <CertSprintsLogo />
            <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-500">Diagnostic report</p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Building your readiness profile</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The score is being blended from performance, recall, pacing, and confidence signals.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {checks.map((check, index) => (
                <div key={check} className="flex items-center gap-4 rounded-lg bg-slate-50 p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500 text-xs font-extrabold text-white">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-700">{check}</span>
                  <span className="ml-auto h-2 w-16 overflow-hidden rounded-full bg-slate-200">
                    <span
                      className="block h-2 animate-pulse rounded-full bg-brand-500"
                      style={{ width: `${55 + index * 12}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs font-semibold text-slate-400">Preparing your provisional sprint recommendation</p>
          </div>
        </div>
      </main>

      <SiteFooter onLogoClick={onLogoClick} />
    </div>
  )
}
