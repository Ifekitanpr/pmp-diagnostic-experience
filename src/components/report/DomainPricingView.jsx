import { useState } from 'react'
import { ArrowRightIcon, DOMAIN_KEYS, DOMAIN_LABELS, DOMAIN_SPRINT_FEATURES, DomainIcon } from './reportShared'

const PRICING_ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets/pricing`

const DOMAIN_COPY = {
  people: 'Strengthen leadership, stakeholder, conflict, and team-scenario decisions.',
  process: 'Improve planning, execution, monitoring, and adaptive project delivery.',
  business: 'Build confidence in governance, compliance, benefits, and business value.',
}

export default function DomainPricingView({ scores, weakDomains, onSelectDomain, onBack }) {
  const domains = DOMAIN_KEYS.map((domainKey) => scores.domains.find((domain) => domain.domain === domainKey) || {
    domain: domainKey,
    name: DOMAIN_LABELS[domainKey],
    score: 0,
  })
  const recommendedKeys = new Set(weakDomains.map((domain) => domain.domain))
  const [selectedKeys, setSelectedKeys] = useState(() => new Set(weakDomains.map((domain) => domain.domain)))
  const selectedDomains = domains.filter((domain) => selectedKeys.has(domain.domain))
  const subtotal = selectedDomains.length * 40

  const toggleDomain = (domainKey) => {
    setSelectedKeys((current) => {
      const next = new Set(current)
      if (next.has(domainKey)) next.delete(domainKey)
      else next.add(domainKey)
      return next
    })
    onSelectDomain(domainKey)
  }

  return (
    <section className="relative min-h-[980px] overflow-hidden rounded-b-[40px] border-b border-slate-200 bg-white px-5 pb-20 pt-20 sm:px-8 lg:px-[100px] lg:pt-24">
      <img src={`${PRICING_ASSET_BASE}/background.png`} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white/20" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-sm font-extrabold uppercase leading-5 tracking-[1.4px] text-brand-500">Pricing</p>
        <div className="relative mt-2">
          <img src={`${PRICING_ASSET_BASE}/headline-ribbon.svg`} alt="" className="pointer-events-none absolute left-1/2 top-1/2 w-[calc(100%+30px)] max-w-none -translate-x-1/2 -translate-y-1/2" />
          <h1 className="relative font-display text-4xl font-bold leading-tight tracking-[-0.768px] text-sprint-ink sm:text-5xl sm:leading-[56px]">Choose your domain sprints</h1>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">Build the focused practice plan your diagnostic recommends.</p>
      </div>

      <div className="relative mx-auto mt-14 grid max-w-[1240px] gap-[30px] lg:grid-cols-[1fr_490px] lg:items-start">
        <div>
          <div className="grid gap-4">
          {domains.map((domain) => {
            const recommended = recommendedKeys.has(domain.domain)
            const selected = selectedKeys.has(domain.domain)

            return (
              <article key={domain.domain} className={`rounded-[10px] border bg-white p-6 transition ${selected ? 'border-brand-400' : 'border-slate-200 shadow-sm'}`}>
                <div className="flex items-start justify-between gap-5">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500"><span className="scale-75"><DomainIcon domain={domain.domain} /></span></span>
                    <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl font-semibold leading-7 tracking-[-0.2px] text-black">{domain.name} Sprint</h2>
                      {recommended && <span className="rounded-full bg-[#fff0eb] px-3 py-0.5 text-xs text-[#ff6b35]">Recommended</span>}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{DOMAIN_COPY[domain.domain]}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-center"><p className="font-display text-[30px] font-bold leading-[38px] text-sprint-ink">$40</p><p className="text-xs text-slate-400">One time</p></div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button type="button" onClick={() => toggleDomain(domain.domain)} className={`rounded px-3 py-1.5 text-sm font-medium transition ${selected ? 'border border-slate-200 bg-white text-slate-700 shadow-sm' : 'bg-brand-500 text-white hover:bg-brand-600'}`}>
                    {selected ? 'Remove' : 'Add to plan'}
                  </button>
                </div>
              </article>
            )
          })}
          </div>
          <button onClick={onBack} className="mt-4 flex min-h-[60px] items-center justify-center gap-3 rounded border border-slate-200 bg-white px-6 py-[18px] text-lg font-semibold text-slate-700 shadow-sm">← Back to report</button>
        </div>

        <aside className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <p className="text-base font-bold text-brand-500">Your sprint plan</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-sprint-ink">{selectedDomains.length} sprint{selectedDomains.length === 1 ? '' : 's'} selected</h2>

          <div className="mt-6 grid gap-3">
            {selectedDomains.map((domain) => (
              <div key={domain.domain} className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3"><span className="grid size-5 place-items-center rounded-full bg-brand-500 text-xs text-white">✓</span><span className="text-sm font-medium text-slate-700">{domain.name}</span></div>
                <span className="text-sm font-bold text-sprint-ink">$40</span>
              </div>
            ))}
            {!selectedDomains.length && <p className="rounded border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">Choose at least one domain sprint to continue.</p>}
          </div>

          <div className="my-5 h-px bg-slate-200" />
          <div className="flex items-end justify-between"><span className="font-semibold text-slate-700">Subtotal</span><span className="font-display text-4xl font-bold text-sprint-ink">${subtotal}</span></div>

          <div className="mt-5 rounded border border-brand-200 bg-brand-50 p-4">
            <p className="text-sm font-bold text-brand-700">No subscription</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">One focused sprint at a time. Your selected content remains available for 180 days.</p>
          </div>

          <div className="mt-5 grid gap-2 text-sm text-slate-600">
            {DOMAIN_SPRINT_FEATURES.slice(0, 3).map((feature) => <p key={feature.title} className="flex gap-2"><span className="text-brand-500">✓</span>{feature.title}</p>)}
          </div>

          <button disabled={!selectedDomains.length} className="mt-6 flex min-h-[54px] w-full items-center justify-center gap-2 rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400">
            Start selected sprints <ArrowRightIcon stroke="white" />
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">♙ &nbsp; Secure checkout · No recurring payment</p>
        </aside>
      </div>
    </section>
  )
}
