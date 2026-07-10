const PRIORITY_DOMAIN_SPREAD = 5

export function getWeakDomains(scores) {
  const sortedDomains = [...scores.domains].sort((a, b) => a.score - b.score)
  const lowestScore = sortedDomains[0]?.score

  if (lowestScore === undefined) return []

  return sortedDomains.filter((domain) => domain.score <= lowestScore + PRIORITY_DOMAIN_SPREAD)
}
