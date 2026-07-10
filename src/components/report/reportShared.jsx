export const DOMAIN_LABELS = { people: 'People', process: 'Process', business: 'Business Environment' }
export const DOMAIN_KEYS = ['people', 'process', 'business']

export const DOMAIN_SPRINT_FEATURES = [
  { title: 'Key Concepts', detail: 'Exam-focused explanations', icon: 'book' },
  { title: 'Active Recall', detail: 'Practice to strengthen memory', icon: 'brain' },
  { title: '200 Flashcards', detail: 'High-yield revision cards', icon: 'cards' },
  { title: '40 Domain Questions', detail: 'Across 5 batches', icon: 'tasks' },
  { title: '180 Full Mock Questions', detail: 'Across 3 batches', icon: 'file' },
]

export function formatDomainList(domains) {
  const names = domains.map((domain) => DOMAIN_LABELS[domain.domain] || domain.name)

  if (names.length <= 1) return names[0] || 'Priority Domain'
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

export function ArrowRightIcon({ stroke }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path d="M5 10h10M11 6l4 4-4 4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden="true">
      <path d="M5 3.5h6.2L15 7.3v9.2H5v-13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 3.8V8h4M7.8 11h4.4M7.8 14h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DomainIcon({ domain }) {
  if (domain === 'business') {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <path d="M7 25V8.5C7 7.1 8.1 6 9.5 6h7C17.9 6 19 7.1 19 8.5V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M5 25h20M11 11h4M11 16h4M11 21h4M19 13h2.5c1.4 0 2.5 1.1 2.5 2.5V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
      <path d="M15 4 6.5 8.8v9.9L15 24l8.5-5.3V8.8L15 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m6.8 9 8.2 4.8L23.2 9M15 14v9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11 6.5 8.2 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function FeatureIcon({ type }) {
  const common = { width: 26, height: 26, viewBox: '0 0 26 26', fill: 'none', 'aria-hidden': true }

  if (type === 'brain') {
    return (
      <svg {...common}>
        <path d="M9 22c-2.6 0-4.5-1.9-4.5-4.2 0-1.1.4-2.1 1.1-2.8A4.3 4.3 0 0 1 7.6 7 4 4 0 0 1 15 6.3 4.2 4.2 0 0 1 21.5 10c0 .9-.3 1.8-.8 2.5a4.8 4.8 0 0 1-3.7 8.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 5.5V22M9 10.5c1.5.2 2.6 1 3.2 2.4M17 10.5c-1.5.2-2.6 1-3.2 2.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'cards') {
    return (
      <svg {...common}>
        <rect x="6" y="5" width="13" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M9 9h7M9 13h5M4 9v9a3 3 0 0 0 3 3h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'tasks') {
    return (
      <svg {...common}>
        <rect x="6" y="5" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M10 4h6M10 11l1.5 1.5L15 9M10 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'file') return <FileIcon />

  return (
    <svg {...common}>
      <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5H12v16H7.5A2.5 2.5 0 0 1 5 18.5v-11ZM14 5h4.5A2.5 2.5 0 0 1 21 7.5v11a2.5 2.5 0 0 1-2.5 2.5H14V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 9h2.5M15.5 9H18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
