import { useState } from 'react'
import { computeScores } from '../utils/scoring'
import { getWeakDomains } from '../utils/report'
import DomainPricingView from './report/DomainPricingView'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

export default function PricingPage({ answers, recallAnswers, onBack, onDetailedReport, onRetake, onLogoClick }) {
  const [selectedDomain, setSelectedDomain] = useState(null)
  const scores = computeScores(answers, recallAnswers)
  const weakDomains = getWeakDomains(scores)

  return (
    <div className="min-h-screen bg-slate-50 text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />
      <main className="bg-white">
        <DomainPricingView
          scores={scores}
          weakDomains={weakDomains}
          selectedDomainKey={selectedDomain}
          onSelectDomain={setSelectedDomain}
          onBack={onBack}
          onGetDetailedReport={onDetailedReport}
        />
      </main>
      <SiteFooter onStart={onRetake} onLogoClick={onLogoClick} />
    </div>
  )
}
