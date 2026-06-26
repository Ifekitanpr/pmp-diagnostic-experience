import { useState } from 'react'
import logoWordmark from '../../assets/landing/logo-wordmark.svg'

function SparkleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M12 6.5l1.4 3.6 3.6 1.4-3.6 1.4-1.4 3.6-1.4-3.6L7 11.5l3.6-1.4L12 6.5Z" fill="white" />
    </svg>
  )
}

function ChevronDownIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const NAV_LINKS = ['Catalog', 'Enterprise', 'Insights']

export default function Nav({ onStart, onDiscoverClick, onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      <div className="bg-primary-50 px-6 md:px-[100px] py-3 flex items-center justify-center gap-2 text-center">
        <SparkleIcon className="size-5 text-primary-500 shrink-0" />
        <p className="text-ink text-sm font-medium">Know when you are exam-ready with CertSprint AI</p>
        <a href="#" className="inline-flex items-center gap-1.5 text-primary-500 text-sm font-medium hover:underline shrink-0">
          Learn More <span aria-hidden>&rarr;</span>
        </a>
      </div>

      <nav className="relative bg-white shadow-xl rounded-b-3xl px-6 md:px-[100px] py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-14">
            <button onClick={onLogoClick} className="shrink-0">
              <img src={logoWordmark} alt="CertSprints" className="h-6 w-auto" />
            </button>
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={onDiscoverClick}
                className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-medium hover:text-ink transition-colors"
              >
                Discover <ChevronDownIcon className="size-5" />
              </button>
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className="text-slate-600 text-sm font-medium hover:text-ink transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden lg:inline-flex text-slate-700 font-semibold text-base px-5 py-3 hover:text-ink transition-colors">
              Sign In
            </button>
            <button
              onClick={onStart}
              className="hidden lg:inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold text-base px-5 py-3 rounded transition-all duration-200 min-h-[48px]"
            >
              Start your sprint
            </button>

            <button
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 block h-[1.5px] w-4 bg-current transition ${menuOpen ? 'top-1/2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`absolute bottom-0 left-0 block h-[1.5px] w-4 bg-current transition ${menuOpen ? 'bottom-1/2 -rotate-45' : ''}`} />
              </span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden max-w-6xl mx-auto mt-4 flex flex-col gap-1 border-t border-slate-100 pt-4 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                setMenuOpen(false)
                onDiscoverClick?.()
              }}
              className="flex items-center justify-between rounded-lg px-2 py-3 text-left transition hover:bg-slate-50 hover:text-ink"
            >
              Discover <ChevronDownIcon className="size-5" />
            </button>
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="rounded-lg px-2 py-3 transition hover:bg-slate-50 hover:text-ink">
                {link}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4">
              <button className="text-left rounded-lg px-2 py-2 text-base font-semibold text-slate-700 transition hover:text-ink">
                Sign In
              </button>
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold text-base px-5 py-3 rounded transition-all duration-200 min-h-[48px]"
              >
                Start your sprint
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
