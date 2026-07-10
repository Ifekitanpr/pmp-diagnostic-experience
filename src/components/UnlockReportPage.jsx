import { computeScores, getBand, getRiskLevel } from '../utils/scoring'
import { getWeakDomains } from '../utils/report'
import DetailedReportView from './report/DetailedReportView'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

export default function UnlockReportPage({ answers, recallAnswers, userType, onBack, onVerify, onRetake, onLogoClick }) {
  const scores = computeScores(answers, recallAnswers)

  return <PageShell onRetake={onRetake} onLogoClick={onLogoClick}><DetailedReportView page="profile" userType={userType} scores={scores} band={getBand(scores.composite, userType.category)} risks={getRiskLevel(scores)} answers={answers} recallAnswers={recallAnswers} weakDomains={getWeakDomains(scores)} onBack={onBack} onVerifyPage={onVerify} /></PageShell>
}

function PageShell({ children, onRetake, onLogoClick }) {
  return <div className="min-h-screen bg-white text-sprint-ink"><PromoBar /><SiteHeader onLogoClick={onLogoClick} /><main>{children}</main><SiteFooter onStart={onRetake} onLogoClick={onLogoClick} /></div>
}
