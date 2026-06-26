import { useRef } from 'react'
import Nav from './landing/Nav'
import Hero from './landing/Hero'
import DiscoverShowcase from './landing/DiscoverShowcase'
import Timeline from './landing/Timeline'
import Methodology from './landing/Methodology'
import FinalCta from './landing/FinalCta'
import Footer from './landing/Footer'

export default function Landing({ onStart, onLogoClick }) {
  const discoverRef = useRef(null)

  const scrollToDiscover = () => {
    discoverRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav onStart={onStart} onDiscoverClick={scrollToDiscover} onLogoClick={onLogoClick} />

      <Hero onStart={onStart} onDiscoverMore={scrollToDiscover} />
      <div ref={discoverRef}>
        <DiscoverShowcase />
      </div>
      <Timeline onStart={onStart} />
      <Methodology />
      <FinalCta onStart={onStart} />
      <Footer />
    </div>
  )
}
