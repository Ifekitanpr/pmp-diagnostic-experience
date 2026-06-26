import { useState } from 'react'
import { SiteFooter, SiteHeader } from './SiteChrome'

const DOMAIN_LABELS = { people: 'People', process: 'Process', business: 'Business Environment' }
const TYPE_INFO = {
  recognition: { label: 'Recognition', desc: 'Choose the concept that matches the prompt.', accent: 'bg-brand-50 text-brand-700 border-brand-100' },
  prompted: { label: 'Prompted recall', desc: 'Produce the answer from a clue.', accent: 'bg-purple-50 text-purple-700 border-purple-100' },
  active: { label: 'Active recall', desc: 'Explain the idea in your own words.', accent: 'bg-orange-50 text-orange-700 border-orange-100' },
}

export default function RecallSection({ checks, onComplete, onLogoClick }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState('answer')
  const [mcqSelected, setMcqSelected] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [answers, setAnswers] = useState([])
  const check = checks[idx]
  const typeInfo = TYPE_INFO[check.type]
  const progress = ((idx + (phase !== 'answer' ? 1 : 0)) / checks.length) * 100

  const handleMCQ = (optionIndex) => {
    if (phase !== 'answer') return
    setMcqSelected(optionIndex)
    setTimeout(() => setPhase('reveal'), 450)
  }

  const handleRate = (selfScore) => {
    const answer = {
      checkId: check.id,
      domain: check.domain,
      type: check.type,
      score: selfScore,
    }
    const nextAnswers = [...answers, answer]
    setAnswers(nextAnswers)
    if (idx + 1 < checks.length) {
      setIdx(idx + 1)
      setPhase('answer')
      setMcqSelected(null)
      setTextInput('')
    }
    else onComplete(nextAnswers)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <SiteHeader compact label="Recall Check" onLogoClick={onLogoClick} />

      <section className="border-b border-slate-200 bg-white">
        <div className="section-shell">
          <div className="flex h-20 items-center justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brand-500">Retrieval check</p>
              <p className="font-display text-xl font-extrabold text-sprint-ink">Active recall calibration</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-slate-800">{idx + 1} of {checks.length}</p>
              <p className="text-xs font-semibold text-slate-400">Recall checks</p>
            </div>
          </div>
          <div className="h-1 rounded-full bg-slate-100">
            <div className="h-1 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <main className="section-shell grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="blueprint-panel rounded-xl border border-slate-200 p-6 shadow-soft lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand-500">Why this matters</p>
          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl">Recognition is not the same as retrieval.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The PMP exam rewards applied memory. This section checks whether you can pull concepts forward without answer choices doing all the work.
          </p>

          <div className="mt-6 grid gap-3">
            {Object.values(TYPE_INFO).map((item) => (
              <div key={item.label} className={`rounded-lg border p-4 ${item.accent}`}>
                <p className="text-sm font-extrabold">{item.label}</p>
                <p className="mt-1 text-xs leading-5 opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">{DOMAIN_LABELS[check.domain]} Domain</span>
            <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${typeInfo.accent}`}>{typeInfo.label}</span>
          </div>

          <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">{check.question}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{typeInfo.desc}</p>

          {check.type === 'recognition' && phase === 'answer' && (
            <div className="mt-8 grid gap-3">
              {check.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => handleMCQ(index)}
                  className="flex min-h-14 items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50 hover:shadow-panel"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-300 bg-white text-xs font-extrabold text-slate-400">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{option}</span>
                </button>
              ))}
            </div>
          )}

          {check.type === 'recognition' && phase === 'reveal' && (
            <div className="mt-8 space-y-3">
              {check.options.map((option, index) => (
                <div
                  key={option}
                  className={`flex min-h-14 items-center gap-4 rounded-lg border px-4 py-3 ${
                    index === check.correct
                      ? 'border-green-300 bg-green-50 text-green-900'
                      : index === mcqSelected
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-slate-100 bg-slate-50 text-slate-400'
                  }`}
                >
                  <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-extrabold ${
                    index === check.correct ? 'border-green-500 bg-green-500 text-white' : index === mcqSelected ? 'border-red-400 bg-red-400 text-white' : 'border-slate-300'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-sm font-semibold">{option}</span>
                </div>
              ))}
              <ModelAnswer check={check} />
              <button
                onClick={() => handleRate(mcqSelected === check.correct ? 100 : 0)}
                className="h-12 w-full rounded-lg bg-brand-500 text-sm font-extrabold text-white shadow-panel transition hover:bg-brand-600"
              >
                Continue
              </button>
            </div>
          )}

          {(check.type === 'prompted' || check.type === 'active') && phase === 'answer' && (
            <div className="mt-8">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">Prompt</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{check.prompt}</p>
              </div>
              <textarea
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Write what you can remember. Short is fine if it is honest."
                rows={7}
                className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-50"
              />
              <button
                onClick={() => setPhase('reveal')}
                disabled={textInput.trim().length < 3}
                className={`mt-4 h-12 w-full rounded-lg text-sm font-extrabold transition ${
                  textInput.trim().length >= 3
                    ? 'bg-brand-500 text-white shadow-panel hover:bg-brand-600'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                Reveal model answer
              </button>
            </div>
          )}

          {(check.type === 'prompted' || check.type === 'active') && phase === 'reveal' && (
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-brand-500">Your answer</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-brand-900">{textInput}</p>
              </div>
              <ModelAnswer check={check} />
              <SelfRateButtons onRate={handleRate} />
            </div>
          )}
        </section>
      </main>

      <SiteFooter onLogoClick={onLogoClick} />
    </div>
  )
}

function ModelAnswer({ check }) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-green-700">Model answer</p>
      <p className="mt-2 text-sm leading-6 text-green-900">{check.modelAnswer}</p>
      {check.keywords && (
        <div className="mt-3 flex flex-wrap gap-2">
          {check.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100">
              {keyword}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SelfRateButtons({ onRate }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-display text-xl font-extrabold">How close was your recall?</p>
      <p className="mt-1 text-sm text-slate-500">Score the retrieval honestly. The report is better when this is real.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { score: 90, label: 'Strong', sub: 'Covered the key points' },
          { score: 60, label: 'Partial', sub: 'Some points were missing' },
          { score: 20, label: 'Weak', sub: 'Mostly off track' },
        ].map((rating) => (
          <button
            key={rating.label}
            onClick={() => onRate(rating.score)}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 hover:shadow-panel"
          >
            <span className="font-display text-xl font-extrabold text-sprint-ink">{rating.label}</span>
            <span className="mt-1 block text-sm text-slate-500">{rating.sub}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
