const LINK_COLUMNS = [
  { heading: 'Certifications', links: ['PMP', 'CBAP', 'CCMP', 'RMP', 'CFA', 'View All'] },
  { heading: 'Platform', links: ['How It Works', 'Pricing', 'Success Stories', 'Free Trial'] },
  { heading: 'Company', links: ['About', 'Careers', 'Contact', 'Press', 'Partners', 'Team'] },
  { heading: 'Resources', links: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Cookie policy', 'Support'] },
]

const SOCIALS = [
  { label: 'Facebook', icon: '📘' },
  { label: 'X', icon: '✕' },
  { label: 'LinkedIn', icon: 'in' },
  { label: 'Instagram', icon: '📷' },
  { label: 'YouTube', icon: '▶' },
]

export default function Footer() {
  return (
    <footer className="bg-ink px-6 md:px-[100px] pt-20 pb-12">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:justify-between">
          <div className="flex flex-col gap-6 w-full lg:w-[339px] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="font-heading font-bold italic text-white text-lg">CertSprints</span>
            </div>
            <p className="text-slate-50 text-base">
              CertSprints powers accelerated certification with zero fluff &ndash; designed for ambitious professionals.
            </p>
            <div className="bg-[#141414] rounded-lg px-4 py-1 flex items-center gap-2.5 w-fit">
              {SOCIALS.map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className="size-[34px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white text-sm cursor-pointer transition-colors"
                >
                  {s.icon}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
            {LINK_COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <p className="font-extrabold text-slate-50 text-sm tracking-[0.1em] uppercase">{col.heading}</p>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className={`text-base text-slate-200 hover:text-white transition-colors ${
                        link === 'View All' ? 'font-semibold' : ''
                      }`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="size-12 rounded-full bg-[#141414] hover:bg-white/10 flex items-center justify-center text-white shrink-0 transition-colors self-end lg:self-start"
          >
            &uarr;
          </button>
        </div>

        <div className="flex items-center justify-between text-slate-50 text-sm border-t border-white/10 pt-8">
          <p>&copy; 2026 CertSprints &middot; Built with learning science</p>
          <p>GDPR Compliant</p>
        </div>
      </div>
    </footer>
  )
}
