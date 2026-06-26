import ctaBgRays from '../../assets/landing/cta-bg-rays.png'

export default function FinalCta({ onStart }) {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 flex justify-center">
      <img
        src={ctaBgRays}
        alt=""
        className="absolute inset-x-0 bottom-0 w-full pointer-events-none select-none"
      />
      <div className="w-full relative max-w-3xl flex flex-col items-center gap-8 text-center">
        <div className="w-full flex flex-col items-center gap-4">
          <p className="w-full font-extrabold text-accent-500 text-sm tracking-[0.1em] uppercase">Ready when you are</p>
          <h2 className="w-full font-heading font-bold text-ink text-2xl md:text-[32px] leading-snug">
            Ready to find out where you really stand?
          </h2>
          <p className="w-full text-slate-600 text-lg">
            Free &middot; 25&ndash;30 minutes &middot; Instant results
          </p>
        </div>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-semibold px-5 py-3 rounded transition-all duration-200 min-h-[48px]"
        >
          Start free diagnostic <span>&rarr;</span>
        </button>
      </div>
    </section>
  )
}
