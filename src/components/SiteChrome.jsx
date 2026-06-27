import { useState } from 'react'

const ASSET_BASE = `${import.meta.env.BASE_URL}certsprints-assets`

const navItems = ['Catalog', 'Enterprise', 'Insights']

const footerCerts = ['PMP', 'CBAP', 'CCMP', 'RMP', 'CFA', 'View All']
const footerPlatform = ['How It Works', 'Pricing', 'Success Stories', 'Free Trial']
const footerCompany = ['About', 'Careers', 'Contact', 'Press', 'Partners', 'Team']
const footerResources = ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie policy', 'Support']
const footerSocials = [
  { label: 'Facebook', icon: `${ASSET_BASE}/icons/social-facebook-footer.svg` },
  { label: 'X', icon: `${ASSET_BASE}/icons/social-x-footer.svg` },
  { label: 'LinkedIn', icon: `${ASSET_BASE}/icons/social-linkedin-footer.svg` },
  { label: 'Instagram', icon: `${ASSET_BASE}/icons/social-instagram-footer.svg` },
]

export function PromoBar() {
  return (
    <div
      className="flex items-center justify-center gap-2.5 bg-brand-50 bg-cover bg-center px-5 py-3 text-center sm:px-[100px]"
      style={{ backgroundImage: `url("${ASSET_BASE}/promo-stripes.png")` }}
    >
      <img src={`${ASSET_BASE}/icons/badge-ai-ring.png`} alt="" className="h-6 w-6 shrink-0" />
      <p className="text-sm font-medium leading-5 text-sprint-ink">
        Know when you are exam-ready with CertSprint AI
        <a href="#" className="ml-2 font-medium text-brand-500 hover:text-brand-600">
          Learn More →
        </a>
      </p>
    </div>
  )
}

export function SiteHeader({ onStart, onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 z-40">
      <div className="bg-white lg:bg-transparent">
        <div
          className="bg-white bg-cover bg-center bg-no-repeat shadow-sm"
          style={{ backgroundImage: `url("${ASSET_BASE}/navbg.svg")` }}
        >
          <header className="section-shell flex items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-14">
              <a
                href="#"
                onClick={(e) => {
                  if (onLogoClick) {
                    e.preventDefault()
                    onLogoClick()
                  }
                }}
                className="flex shrink-0 items-center gap-3"
                aria-label="CertSprints home"
              >
                <CertSprintsLogo />
              </a>

              <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
                <button type="button" className="flex items-center gap-1.5 transition hover:text-brand-600">
                  Discover <span className="text-xs">▾</span>
                </button>
                {navItems.map((item) => (
                  <a key={item} href="#" className="transition hover:text-brand-600">
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <a href="#" className="text-base font-semibold text-slate-700 transition hover:text-brand-600">
                Sign In
              </a>
              {onStart ? (
                <button
                  onClick={onStart}
                  className="inline-flex h-12 items-center rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600"
                >
                  Start your sprint
                </button>
              ) : (
                <a href="#" className="inline-flex h-12 items-center rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600">
                  Start your sprint
                </a>
              )}
            </div>

            <button
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 lg:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 block h-[1.5px] w-4 bg-current transition ${menuOpen ? 'top-1/2 rotate-45' : ''}`} />
                <span className={`absolute left-0 top-1/2 block h-[1.5px] w-4 -translate-y-1/2 bg-current transition ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`absolute bottom-0 left-0 block h-[1.5px] w-4 bg-current transition ${menuOpen ? 'bottom-1/2 -rotate-45' : ''}`} />
              </span>
            </button>
          </header>

          {menuOpen && (
            <nav className="section-shell flex flex-col gap-1 border-t border-slate-100 pb-6 pt-4 text-sm font-medium text-slate-600 lg:hidden">
              <button type="button" className="flex items-center justify-between rounded-lg px-2 py-3 text-left transition hover:bg-slate-50 hover:text-brand-600">
                Discover <span className="text-xs">▾</span>
              </button>
              {navItems.map((item) => (
                <a key={item} href="#" className="rounded-lg px-2 py-3 transition hover:bg-slate-50 hover:text-brand-600">
                  {item}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <a href="#" className="rounded-lg px-2 py-2 text-base font-semibold text-slate-700 transition hover:text-brand-600">
                  Sign In
                </a>
                {onStart ? (
                  <button
                    onClick={onStart}
                    className="inline-flex h-12 items-center justify-center rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600"
                  >
                    Start your sprint
                  </button>
                ) : (
                  <a href="#" className="inline-flex h-12 items-center justify-center rounded bg-brand-500 px-5 text-base font-semibold text-white transition hover:bg-brand-600">
                    Start your sprint
                  </a>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}

export function SiteFooter({ onStart, onLogoClick }) {
  return (
    <footer
      className="relative overflow-hidden bg-black px-6 pb-12 pt-20 text-white md:px-[100px]"
      style={{
        backgroundImage: `url("${ASSET_BASE}/footer-bg.svg")`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <img src={`${ASSET_BASE}/track-dark-bg.svg`} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[339px]">
            <a
              href="#"
              onClick={(e) => {
                if (onLogoClick) {
                  e.preventDefault()
                  onLogoClick()
                }
              }}
            >
              <img src={`${ASSET_BASE}/footer-logo-wordmark.svg`} alt="CertSprints" className="h-[29px] w-[189px] cursor-pointer object-contain" />
            </a>
            <p className="max-w-sm text-base leading-7 text-slate-50">
              CertSprints powers accelerated certification with zero fluff - designed for ambitious professionals.
            </p>
            <div className="flex w-fit max-w-full flex-wrap items-center gap-2.5 rounded-lg bg-[#141414] px-4 py-1.5 sm:px-6">
              {footerSocials.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="flex size-11 items-center justify-center rounded-[10px] transition hover:bg-white/10 sm:size-[50px]"
                  aria-label={item.label}
                >
                  <img src={item.icon} alt="" className="max-h-6 max-w-6" />
                </a>
              ))}
            </div>
            {onStart && (
              <button
                onClick={onStart}
                className="h-11 w-fit rounded-md bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Take Free Assessment
              </button>
            )}
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterColumn title="Certifications" items={footerCerts} />
            <FooterColumn title="Platform" items={footerPlatform} />
            <FooterColumn title="Company" items={footerCompany} />
            <FooterColumn title="Resources" items={footerResources} />
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="flex size-12 shrink-0 items-center justify-center self-end rounded-full bg-[#141414] text-white transition hover:bg-white/10 lg:self-start"
          >
            <img src={`${ASSET_BASE}/icons/footer-back-to-top.svg`} alt="" className="size-6" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-slate-200 sm:flex-row sm:text-left">
          <p>© 2026 CertSprints - Built with learning science</p>
          <p>GDPR Compliant</p>
        </div>
      </div>
    </footer>
  )
}

export function CertSprintsLogo() {
  return (
    <span className="inline-flex items-center gap-3">
      <img src={`${ASSET_BASE}/sprint-logo.svg`} alt="CertSprints" className="h-8 object-contain" />
    </span>
  )
}

function FooterColumn({ title, items }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-slate-50">{title}</p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <a key={item} href="#" className="text-base text-slate-200 transition hover:text-white">
            {item}
          </a>
        ))}
      </div>
    </div>
  )
}
