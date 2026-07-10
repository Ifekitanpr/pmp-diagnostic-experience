import { computeScores, getBand, getRiskLevel } from '../utils/scoring'
import { getWeakDomains } from '../utils/report'
import DetailedReportView from './report/DetailedReportView'
import { PromoBar, SiteFooter, SiteHeader } from './SiteChrome'

export default function DetailedReadinessReportPage({ answers, recallAnswers, userType, onBack, onReviewAnswers, onRetake, onLogoClick }) {
  const scores = computeScores(answers, recallAnswers)

  return <div className="min-h-screen bg-white text-sprint-ink"><PromoBar /><SiteHeader onLogoClick={onLogoClick} /><main><DetailedReportView page="report" userType={userType} scores={scores} band={getBand(scores.composite, userType.category)} risks={getRiskLevel(scores)} answers={answers} recallAnswers={recallAnswers} weakDomains={getWeakDomains(scores)} onBack={onBack} onReviewAnswers={onReviewAnswers} /></main><SiteFooter onStart={onRetake} onLogoClick={onLogoClick} /></div>
}
