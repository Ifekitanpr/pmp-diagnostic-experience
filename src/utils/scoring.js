// ─── SCORING ENGINE — implements the full architecture from the spec ──────────
// Weights: Performance 65% | Recall 15% | Pacing 10% | Confidence 10%
// ECO 2026: People 33% | Process 41% | Business Environment 26%

// Pacing timing targets (seconds)
const TIMING_TARGETS = { easy: 60, moderate: 90, difficult: 120 }

// Confidence calibration matrix
const CONFIDENCE_MATRIX = {
  'correct-high':   100,
  'correct-medium':  85,
  'correct-low':     70,
  'wrong-low':       60,
  'wrong-medium':    35,
  'wrong-high':       0,
}

// ── A. Performance Score ──────────────────────────────────────────────────────
function calcDomainPerformance(answers, domain) {
  const domainAnswers = answers.filter(a => a.domain === domain)
  if (!domainAnswers.length) return 0
  const earnedWeight  = domainAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.weight : 0), 0)
  const totalWeight   = domainAnswers.reduce((sum, a) => sum + a.weight, 0)
  return totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0
}

function calcPerformance(answers) {
  const people  = calcDomainPerformance(answers, 'people')
  const process = calcDomainPerformance(answers, 'process')
  const biz     = calcDomainPerformance(answers, 'business')
  const overall = 0.33 * people + 0.41 * process + 0.26 * biz
  return { people, process, biz, overall }
}

// ── B. Recall Score ───────────────────────────────────────────────────────────
function calcRecall(recallAnswers) {
  const byType = { recognition: [], prompted: [], active: [] }
  recallAnswers.forEach(r => {
    if (byType[r.type]) byType[r.type].push(r.score)
  })

  const avg = arr => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0

  const recognition = avg(byType.recognition)
  const prompted    = avg(byType.prompted)
  const active      = avg(byType.active)
  const overall     = 0.30 * recognition + 0.30 * prompted + 0.40 * active

  return { recognition, prompted, active, overall }
}

// ── C. Pacing Score ───────────────────────────────────────────────────────────
function calcPacing(answers) {
  const scores = answers.map(a => {
    if (a.skipped) return 0

    const target = TIMING_TARGETS[a.difficulty] || 90
    const time   = a.timeSpent

    if (a.isCorrect) {
      if (time <= target)           return 100
      if (time <= target * 1.5)     return 80
      return 60
    } else {
      if (time < target * 0.4)      return 40   // too fast and wrong
      return 30
    }
  })
  return scores.reduce((s, v) => s + v, 0) / scores.length
}

// ── D. Confidence Calibration ─────────────────────────────────────────────────
function calcConfidence(answers) {
  const scores = answers.map(a => {
    if (!a.confidence) return 50
    const key = `${a.isCorrect ? 'correct' : 'wrong'}-${a.confidence.toLowerCase()}`
    return CONFIDENCE_MATRIX[key] ?? 50
  })
  const overall = scores.reduce((s, v) => s + v, 0) / scores.length

  // Count false-confidence flags (Wrong + High)
  const falseConfidenceCount = answers.filter(
    a => !a.isCorrect && a.confidence === 'high'
  ).length

  return { overall, falseConfidenceCount, scores }
}

// ── Composite Score ───────────────────────────────────────────────────────────
export function computeScores(answers, recallAnswers) {
  const perf    = calcPerformance(answers)
  const recall  = calcRecall(recallAnswers)
  const pacing  = calcPacing(answers)
  const conf    = calcConfidence(answers)

  const composite = Math.round(
    0.65 * perf.overall +
    0.15 * recall.overall +
    0.10 * pacing +
    0.10 * conf.overall
  )

  // Domain breakdown (for display)
  const domains = [
    { name: 'People',               score: Math.round(perf.people),  ecoWeight: 33, domain: 'people'  },
    { name: 'Process',              score: Math.round(perf.process), ecoWeight: 41, domain: 'process' },
    { name: 'Business Environment', score: Math.round(perf.biz),     ecoWeight: 26, domain: 'business'},
  ]

  const strongest = [...domains].sort((a, b) => b.score - a.score)[0]
  const weakest   = [...domains].sort((a, b) => a.score - b.score)[0]

  return {
    composite,
    performance:  Math.round(perf.overall),
    recall:       Math.round(recall.overall),
    pacing:       Math.round(pacing),
    confidence:   Math.round(conf.overall),
    falseConfidenceCount: conf.falseConfidenceCount,
    domains,
    strongest,
    weakest,
    domainDetail: perf,
    recallDetail: recall,
  }
}

// ── Band & Routing ────────────────────────────────────────────────────────────
export function getBand(score, category) {
  if (category === 'A') {
    if (score <= 64) return {
      title: 'Foundation Course Sprint',
      color: 'red',
      meaning: 'You need PMP foundation, structure, terminology, and guided learning before practice intensity increases.',
      action: 'Start Course Sprint for free — Module 1 is Free. Personalised Study Plan.',
      cta: 'Start Free Course Sprint',
      message: 'Your PMP journey should begin with structure. Start Module 1 for free and follow your personalised Course Sprint plan.',
    }
    if (score <= 74) return {
      title: 'Guided Course Sprint',
      color: 'orange',
      meaning: 'You have some PMP awareness, but still need structured course learning, active recall, and guided practice.',
      action: 'Start Course Sprint for free with guided sprint pathway and early recall checks.',
      cta: 'Start Guided Course Sprint',
      message: 'You have some PMP awareness, but CertSprints will help you organise it into a clear sprint plan. Start your free Course Sprint.',
    }
    if (score <= 84) return {
      title: 'Accelerated Course Sprint',
      color: 'yellow',
      meaning: 'You show stronger baseline ability, but still need CertSprints to organise your PMP learning journey before readiness validation.',
      action: 'Start Course Sprint for free with faster movement through basics and active recall introduced earlier.',
      cta: 'Start Accelerated Sprint',
      message: 'You are starting stronger than most beginners. Begin your free Course Sprint and move through the foundation faster with active recall and practice.',
    }
    return {
      title: 'Fast-Track Course Sprint',
      color: 'green',
      meaning: 'You have strong diagnostic performance for a beginner/explorer, but still need course alignment before mock validation.',
      action: 'Start Course Sprint for free. Fast-track into key concepts, active recall, and a later partial domain check.',
      cta: 'Start Fast-Track Sprint',
      message: 'Strong start. You may be able to move faster, but CertSprints will still guide you through the PMP foundation before mock validation.',
    }
  }

  // Category B
  if (score <= 64) return {
    title: 'Course Sprint Reset',
    color: 'red',
    meaning: 'Your diagnostic shows unstable PMP readiness. You need structured course support before advanced validation.',
    action: 'Start Course Sprint for free — Module 1 is Free. For experienced users, frame it as a PMP Mindset Reset Sprint.',
    cta: 'Start PMP Mindset Reset Sprint',
    message: 'Your diagnostic shows that PMP readiness is not stable yet. Start Module 1 for free. This will help align your project experience with the PMP exam mindset.',
  }
  if (score <= 74) return {
    title: 'Weak-Area Sprint Needed',
    color: 'orange',
    meaning: 'You are progressing, but gaps remain in PMP scenario application, recall, timing, or confidence calibration.',
    action: 'Weak-Area Sprint focused on lowest domain, PMI mindset, active recall, and trap analysis.',
    cta: 'Start Weak-Area Sprint',
    message: 'You are progressing, but important gaps remain. Your next step is a Weak-Area Sprint focused on PMP scenario thinking, recall, and trap analysis.',
  }
  if (score <= 84) return {
    title: 'Readiness Validation Candidate',
    color: 'blue',
    meaning: 'You show promising diagnostic readiness, but need domain exam or full mock validation before being considered exam-ready.',
    action: 'Take a domain exam or full mock. Then create a Sprint 2 weak-domain or module sprint plan.',
    cta: 'Take Domain Exam',
    message: 'You show readiness potential. Your next step is a domain exam or full mock to validate your readiness under exam conditions.',
  }
  return {
    title: 'Strong Readiness Validation Candidate',
    color: 'green',
    meaning: 'You show strong diagnostic confidence, but must still pass readiness gates before final exam recommendation.',
    action: 'Full mock + final readiness validation. If gates are passed, move to the Final 72-Hour Protocol.',
    cta: 'Take Full Mock',
    message: 'Your diagnostic performance is strong. Complete a full mock and final readiness validation before moving into the Final 72-Hour Protocol.',
  }
}

export function getRiskLevel(scores) {
  const { falseConfidenceCount, weakest, pacing } = scores
  const risks = []

  if (falseConfidenceCount >= 3) risks.push({ level: 'high', label: 'False Confidence Risk', detail: `${falseConfidenceCount} Wrong + High Confidence answers detected. This is the primary risk factor for experienced candidates.` })
  else if (falseConfidenceCount >= 1) risks.push({ level: 'medium', label: 'Mild Overconfidence', detail: `${falseConfidenceCount} Wrong + High Confidence answer(s). Monitor this pattern carefully.` })

  if (weakest && weakest.score < 55) risks.push({ level: 'high', label: `${weakest.name} Domain Gap`, detail: `Score of ${weakest.score}/100 in your weakest domain (${weakest.ecoWeight}% of the real exam). This significantly pulls down your overall readiness.` })
  else if (weakest && weakest.score < 70) risks.push({ level: 'medium', label: `${weakest.name} Domain Needs Work`, detail: `Score of ${weakest.score}/100. This domain carries ${weakest.ecoWeight}% of the real exam weight.` })

  if (pacing < 60) risks.push({ level: 'medium', label: 'Pacing Risk', detail: 'You are spending too long on questions relative to PMP exam timing. Aim to answer difficult scenarios in under 2 minutes.' })

  if (!risks.length) risks.push({ level: 'low', label: 'Low Risk Profile', detail: 'No major risk flags detected at this stage.' })

  return risks
}

export function getReliabilityLadder() {
  return [
    { level: 'Provisional',       current: true,  desc: 'Diagnostic only — where you are now' },
    { level: 'Validated',         current: false, desc: 'After a domain exam' },
    { level: 'Mock-Calibrated',   current: false, desc: 'After at least one full mock' },
    { level: 'Exam-Calibrated',   current: false, desc: 'Multiple mocks + recent domain stability' },
  ]
}
