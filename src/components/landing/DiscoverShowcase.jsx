import { useEffect, useRef, useState } from 'react'

const courseIllustration = `${import.meta.env.BASE_URL}certsprints-assets/illustrations/next-step-course.png`

function TargetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}
function TrendIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 16l5-5 4 3 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 6h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function TagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M11.5 4h5A2 2 0 0 1 19 6.5v5a2 2 0 0 1-.6 1.4l-7 7a2 2 0 0 1-2.8 0l-5-5a2 2 0 0 1 0-2.8l7-7A2 2 0 0 1 11.5 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="14.5" cy="9.5" r="1.3" fill="currentColor" />
    </svg>
  )
}
function AlertIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4 21 19H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    </svg>
  )
}
function RocketIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3c2.5 1.5 4 4.2 4 8 0 2-1 4-1 4H9s-1-2-1-4c0-3.8 1.5-6.5 4-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 15l-3 1 1-3M15 15l3 1-1-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19l2 2 2-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="1.3" fill="currentColor" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TABS = [
  { Icon: TargetIcon, title: 'PMP Baseline Readiness Score', short: 'Readiness Score', target: 'header' },
  { Icon: TrendIcon, title: 'Strongest & Weakest Domain', short: 'Domain Breakdown', target: 'domain' },
  { Icon: TagIcon, title: 'Readiness Band Classification', short: 'Readiness Band', target: 'band' },
  { Icon: AlertIcon, title: 'False-Confidence Risk Flag', short: 'Risk Flag', target: 'risk' },
  { Icon: RocketIcon, title: 'Recommended Next Sprint', short: 'Next Sprint', target: 'sprint' },
  { Icon: CheckIcon, title: "Today's First Action", short: 'First Action', target: 'action' },
]

const GAP = 40
const TABS_WIDTH = 360
const MAX_ZOOM = 1.6

function Bar({ value, color }) {
  return (
    <div className="bg-slate-200 h-1.5 rounded-full w-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

const DOMAINS = [
  { label: 'People', badge: 'Strongest', badgeColor: 'bg-green-50 text-green-600', weight: '33%', score: 60, color: 'bg-green-600' },
  { label: 'Process', badge: 'Weakest', badgeColor: 'bg-rose-50 text-rose-600', weight: '41%', score: 60, color: 'bg-rose-600' },
  { label: 'Business Environment', badge: null, weight: '26%', score: 50, color: 'bg-primary-500' },
]

const METRICS = [
  { label: 'Performance', value: 53, color: 'bg-primary-500', chip: 'bg-primary-50' },
  { label: 'Pacing', value: 70, color: 'bg-accent-500', chip: 'bg-accent-50' },
  { label: 'Confidence', value: 64, color: 'bg-green-600', chip: 'bg-green-50' },
  { label: 'Recall', value: 71, color: 'bg-purple-500', chip: 'bg-purple-50' },
]

function focusClass(key, activeTarget) {
  if (activeTarget === null) return ''
  const isFocused = key === activeTarget || (key === 'sprint' && activeTarget === 'action')
  return isFocused ? '' : 'grayscale opacity-50'
}

function ReportPreview({ rootRef, headerRef, domainRef, sprintRef, actionRef, bandRef, riskRef, activeTarget = null }) {
  return (
    <div ref={rootRef} className="relative bg-white rounded-2xl shadow-lg p-4 w-full flex flex-col gap-3">
      <div
        ref={headerRef}
        className={`rounded-lg px-8 py-5 flex flex-col items-center gap-2 text-center transition-all duration-500 ${focusClass('header', activeTarget)}`}
        style={{ backgroundImage: 'linear-gradient(95deg, #091427 30%, #035dbf 99%)' }}
      >
        <p className="font-extrabold text-[#8ac2ff] text-[10px] tracking-[0.1em] uppercase">Provisional readiness score</p>
        <p className="font-heading font-bold text-white text-3xl leading-none">
          57<span className="text-[#8ac2ff] text-xs font-extrabold tracking-wide uppercase ml-1">/100</span>
        </p>
        <p className="font-heading font-bold text-white text-lg">Course Sprint Reset</p>
        <p className="text-slate-200 text-xs max-w-sm">
          Your diagnostic shows unstable PMP readiness. You need structured course support before advanced validation.
        </p>
      </div>

      <div ref={domainRef} className={`flex flex-col sm:flex-row gap-3 transition-all duration-500 ${focusClass('domain', activeTarget)}`}>
        <div className="flex-1 bg-white border border-slate-200 rounded p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-primary-500 text-[9px] tracking-[0.1em] uppercase">Domain performance</p>
            <span className="text-slate-500 text-[9px]">ECO weighted</span>
          </div>
          <p className="font-heading font-bold text-ink text-base -mt-1">Where the score is coming from</p>
          {DOMAINS.map((d) => (
            <div key={d.label} className="border-b border-slate-200 last:border-0 pb-2 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-bold text-ink text-sm mr-2">{d.label}</span>
                  {d.badge && <span className={`text-[9px] rounded-full px-1.5 py-0.5 ${d.badgeColor}`}>{d.badge}</span>}
                  <p className="text-slate-500 text-[10px] mt-0.5">ECO weight {d.weight}</p>
                </div>
                <span className="font-bold text-ink text-sm">{d.score}</span>
              </div>
              <Bar value={d.score} color={d.color} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:w-[110px] sm:shrink-0 sm:grid-cols-1">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-white border border-slate-200 rounded p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-ink text-base">{m.value}<span className="text-slate-400 text-[8px] font-extrabold uppercase ml-0.5">/100</span></p>
                <span className={`size-4 rounded shrink-0 ${m.chip}`} />
              </div>
              <Bar value={m.value} color={m.color} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div ref={bandRef} className={`bg-accent-50 border border-accent-200 rounded p-2.5 transition-all duration-500 ${focusClass('band', activeTarget)}`}>
          <p className="font-extrabold text-slate-500 text-[8px] tracking-[0.1em] uppercase mb-1">Readiness band</p>
          <p className="font-heading font-bold text-accent-700 text-xs mb-1">Course Sprint Reset</p>
          <p className="text-slate-600 text-[9px]">Structured course support before advanced validation.</p>
        </div>
        <div ref={riskRef} className={`bg-white border border-slate-200 rounded p-2.5 transition-all duration-500 ${focusClass('risk', activeTarget)}`}>
          <p className="font-extrabold text-slate-500 text-[8px] tracking-[0.1em] uppercase mb-1">Risk flags</p>
          <p className="font-heading font-bold text-rose-700 text-xs mb-1">Process Domain Gap</p>
          <p className="text-slate-600 text-[9px]">Score of 50/100 in your weakest domain pulls down readiness.</p>
        </div>
        <div className={`bg-amber-50 border border-amber-200 rounded p-2.5 transition-all duration-500 ${focusClass('__unmapped', activeTarget)}`}>
          <p className="font-extrabold text-amber-700 text-[8px] tracking-[0.1em] uppercase mb-1">Focus domain</p>
          <p className="font-heading font-bold text-amber-900 text-xs mb-1">Process</p>
          <p className="text-amber-800 text-[9px]">Start here before spending time on broad review.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div ref={sprintRef} className={`flex-1 bg-white border border-slate-100 rounded p-3 flex flex-col gap-2 transition-all duration-500 ${focusClass('sprint', activeTarget)}`}>
          <p className="font-extrabold text-slate-500 text-[8px] tracking-[0.1em] uppercase">Recommended next step</p>
          <p className="font-heading font-bold text-ink text-sm">Foundational Course Sprint</p>
          <p className="text-ink text-[10px]">
            Start with foundation lessons, short recall drills, and guided PMP language practice before moving into mock exams.
          </p>
          <img src={courseIllustration} alt="" className="mt-1 w-full rounded" />
        </div>

        <div className="flex-1 flex flex-col gap-2.5">
          <div ref={actionRef} className={`bg-slate-50 border border-slate-100 rounded p-3 flex flex-col gap-2 transition-all duration-500 ${focusClass('action', activeTarget)}`}>
            <p className="font-extrabold text-primary-500 text-[8px] tracking-[0.1em] uppercase">Primary action</p>
            <p className="font-heading font-bold text-ink text-sm">Start Free Module 1</p>
            <p className="text-ink text-[10px]">Begin your structured learning path with our free first module</p>
            <div className="flex gap-1.5">
              <button className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-[9px] font-semibold rounded px-2 py-1.5 transition-colors">
                Start Free for Free
              </button>
              <button className="flex-1 bg-white border border-primary-500 text-primary-500 text-[9px] font-semibold rounded px-2 py-1.5 transition-colors">
                Review my answers
              </button>
            </div>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded p-3 flex flex-col justify-center gap-2">
            <p className="font-extrabold text-primary-500 text-[8px] tracking-[0.1em] uppercase">Unlock full report</p>
            <p className="font-heading font-bold text-ink text-sm">Unlock your full PMP Readiness Report</p>
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white text-[9px] font-semibold rounded px-2 py-1.5 transition-colors">
              Create free profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TabsList({ items, activeIndex, side, activeCardRef }) {
  return (
    <div className="flex flex-col gap-2.5 w-full" style={{ width: TABS_WIDTH }}>
      {items.map(({ tab, index }) => {
        const isActive = index === activeIndex
        const cornerClass = side === 'left' ? 'rounded-l-[20px] rounded-r-none' : 'rounded-r-[20px] rounded-l-none'
        const Icon = tab.Icon
        return (
          <div
            key={tab.title}
            ref={isActive ? activeCardRef : null}
            className={`px-9 py-6 transition-colors duration-500 ${isActive ? `bg-primary-50 ${cornerClass}` : 'bg-white rounded-[20px]'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon className={`size-6 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
              {isActive && <span className="font-bold text-primary-100 text-2xl">{String(index + 1).padStart(2, '0')}</span>}
            </div>
            <p className={`font-semibold text-xl ${isActive ? 'text-ink' : 'text-slate-700'}`}>{tab.title}</p>
          </div>
        )
      })}
    </div>
  )
}

// Visually bridges the active tab card's blue fill into the preview panel's blue fill.
// The connector is a flat strip the height of the active tab; wherever an end isn't
// anchored to the very top/bottom of the list, it gets a smooth rounded cap (the
// "armpit" curve) instead of a hard edge, so the color flows into the white space.
const CURVE_RADIUS = 16

function TabPreviewConnector({ top, height, side, isFirst, isLast }) {
  if (height === 0) return null
  return (
    <div
      className="absolute bg-primary-50 transition-[top,height] duration-500 ease-in-out"
      style={{
        top,
        height,
        [side === 'left' ? 'left' : 'right']: TABS_WIDTH,
        width: GAP,
        borderTopLeftRadius: isFirst ? 0 : CURVE_RADIUS,
        borderTopRightRadius: isFirst ? 0 : CURVE_RADIUS,
        borderBottomLeftRadius: isLast ? 0 : CURVE_RADIUS,
        borderBottomRightRadius: isLast ? 0 : CURVE_RADIUS,
      }}
    />
  )
}

function previewCornerStyle(side, isFirst, isLast) {
  const R = 20
  const corners = { tl: R, tr: R, bl: R, br: R }
  const nearTop = side === 'left' ? 'tl' : 'tr'
  const nearBottom = side === 'left' ? 'bl' : 'br'
  if (isFirst) corners[nearTop] = 0
  if (isLast) corners[nearBottom] = 0
  return { borderRadius: `${corners.tl}px ${corners.tr}px ${corners.br}px ${corners.bl}px` }
}

function offsetRelativeTo(el, ancestor) {
  let top = 0
  let left = 0
  let node = el
  while (node && node !== ancestor) {
    top += node.offsetTop
    left += node.offsetLeft
    node = node.offsetParent
  }
  return { top, left }
}

// Self-contained cropped/zoomed report frame: holds its own refs so it can be
// mounted independently for the scroll-driven desktop view and the tap-driven mobile view.
function ZoomedPreview({ activeIndex, frameClassName = '', cornerStyle }) {
  const frameRef = useRef(null)
  const previewPanRef = useRef(null)
  const rootRef = useRef(null)
  const headerRef = useRef(null)
  const domainRef = useRef(null)
  const bandRef = useRef(null)
  const riskRef = useRef(null)
  const sprintRef = useRef(null)
  const actionRef = useRef(null)
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setFrameSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const wrap = previewPanRef.current
    const rootEl = rootRef.current
    if (!wrap || !rootEl) return
    wrap.style.transformOrigin = 'top left'
    const { width: frameWidth, height: frameHeight } = frameSize
    if (!frameWidth || !frameHeight) return

    const targetMap = { header: headerRef, domain: domainRef, band: bandRef, risk: riskRef, sprint: sprintRef, action: actionRef }
    const targetEl = targetMap[TABS[activeIndex].target].current
    if (!targetEl) return
    const { top, left } = offsetRelativeTo(targetEl, rootEl)
    const scale = Math.min(MAX_ZOOM, Math.max(1, frameWidth / targetEl.offsetWidth))
    const topPadding = 24
    const translateX = -left * scale
    const translateY = topPadding - top * scale
    wrap.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
  }, [activeIndex, frameSize])

  const activeTarget = TABS[activeIndex].target

  return (
    <div
      ref={frameRef}
      className={`relative w-full overflow-hidden rounded-[20px] border-[10px] border-[#d5e9fe] bg-white ${frameClassName}`}
      style={cornerStyle}
    >
      <div ref={previewPanRef} className="transition-transform duration-700 ease-in-out">
        <ReportPreview
          rootRef={rootRef}
          headerRef={headerRef}
          domainRef={domainRef}
          bandRef={bandRef}
          riskRef={riskRef}
          sprintRef={sprintRef}
          actionRef={actionRef}
          activeTarget={activeTarget}
        />
      </div>
    </div>
  )
}

export default function DiscoverShowcase() {
  const outerRef = useRef(null)
  const wrapperRef = useRef(null)
  const activeCardRef = useRef(null)
  const previewColRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewWidth, setPreviewWidth] = useState(0)
  const [connectorRect, setConnectorRect] = useState({ top: 0, height: 0 })
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)

  const tabsSide = activeIndex < 3 ? 'left' : 'right'
  const groupStart = tabsSide === 'left' ? 0 : 3
  const visibleTabs = TABS.slice(groupStart, groupStart + 3).map((tab, i) => ({ tab, index: groupStart + i }))
  const posInGroup = activeIndex - groupStart
  const isFirstInGroup = posInGroup === 0
  const isLastInGroup = posInGroup === visibleTabs.length - 1

  useEffect(() => {
    const el = previewColRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setPreviewWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = null
        const el = outerRef.current
        if (!el || window.innerWidth < 768) return
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        if (total <= 0) return
        const scrolled = Math.min(Math.max(-rect.top, 0), total)
        const progress = scrolled / total
        const idx = Math.min(TABS.length - 1, Math.floor(progress * TABS.length))
        setActiveIndex(idx)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const card = activeCardRef.current
    const wrapper = wrapperRef.current
    if (!card || !wrapper) return
    const cardRect = card.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()
    setConnectorRect({ top: cardRect.top - wrapperRect.top, height: cardRect.height })
  }, [activeIndex])

  const tabsTranslate = tabsSide === 'right' ? `translateX(${previewWidth + GAP}px)` : 'translateX(0px)'
  const previewTranslate = tabsSide === 'right' ? `translateX(${-(TABS_WIDTH + GAP)}px)` : 'translateX(0px)'

  return (
    <section className="bg-slate-50 px-6 md:px-[100px] py-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div>
          <p className="font-extrabold text-primary-500 text-sm tracking-[0.1em] uppercase mb-2">Interactive Preview</p>
          <h2 className="font-heading font-bold text-ink text-3xl md:text-4xl">What you&rsquo;ll discover</h2>
        </div>

        {/* Mobile: tap-driven pill tabs + the same cropped/zoomed preview frame as desktop */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="scrollbar-none flex items-center gap-2.5 overflow-x-auto pb-1">
            {TABS.map((tab, i) => {
              const isActive = i === mobileActiveIndex
              return (
                <button
                  key={tab.title}
                  onClick={() => setMobileActiveIndex(i)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-primary-500 text-white' : 'border border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <tab.Icon className={`size-4 shrink-0 ${isActive ? 'text-white' : 'text-primary-500'}`} />
                  {tab.short}
                </button>
              )
            })}
          </div>

          <p className="font-heading font-bold text-ink text-lg">{TABS[mobileActiveIndex].title}</p>

          <div className="bg-primary-50 rounded-2xl p-3">
            <ZoomedPreview activeIndex={mobileActiveIndex} frameClassName="h-[420px]" />
          </div>
        </div>

        {/* Desktop: scroll-driven tabs with layout flip + zoom-pan preview */}
        <div ref={outerRef} className="hidden md:block relative" style={{ height: `${TABS.length * 100}vh` }}>
          <div className="sticky top-0 h-screen flex items-center">
            <div ref={wrapperRef} className="relative w-full" style={{ height: 600 }}>
              <div
                className="absolute top-0 transition-transform duration-700 ease-in-out"
                style={{ width: TABS_WIDTH, transform: tabsTranslate }}
              >
                <TabsList items={visibleTabs} activeIndex={activeIndex} side={tabsSide} activeCardRef={activeCardRef} />
              </div>

              <TabPreviewConnector
                top={connectorRect.top}
                height={connectorRect.height}
                side={tabsSide}
                isFirst={isFirstInGroup}
                isLast={isLastInGroup}
              />

              <div
                ref={previewColRef}
                className="absolute top-0 transition-transform duration-700 ease-in-out"
                style={{ left: TABS_WIDTH + GAP, right: 0, height: 600, transform: previewTranslate }}
              >
                <div
                  className="h-full w-full bg-primary-50 p-8 transition-[border-radius] duration-700 ease-in-out"
                  style={previewCornerStyle(tabsSide, isFirstInGroup, isLastInGroup)}
                >
                  <ZoomedPreview
                    activeIndex={activeIndex}
                    frameClassName="h-full"
                    cornerStyle={previewCornerStyle(tabsSide, isFirstInGroup, isLastInGroup)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
