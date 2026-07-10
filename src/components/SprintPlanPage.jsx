import { computeScores } from '../utils/scoring'
import { getWeakDomains } from '../utils/report'
import ReadinessPlanView from './report/ReadinessPlanView'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

export default function SprintPlanPage({ answers, recallAnswers, userType, onBack, onPricing, onDetailedReport, onRetake, onLogoClick }) {
  const scores = computeScores(answers, recallAnswers)
  const weakDomains = getWeakDomains(scores)

  return (
    <div className="min-h-screen bg-white text-sprint-ink">
      <PromoBar />
      <SiteHeader onLogoClick={onLogoClick} />
      <main>
        <ReadinessPlanView
          userType={userType}
          weakDomains={weakDomains}
          onBack={onBack}
          onGetDetailedReport={onDetailedReport}
          onViewPricing={onPricing}
        />
      </main>
      <SiteFooter onStart={onRetake} onLogoClick={onLogoClick} />
    </div>
  )
}
