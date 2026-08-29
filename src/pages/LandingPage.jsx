/**
 * LandingPage
 * Full-bleed hero with campus imagery, scroll-triggered reveals, campus gallery
 * UNILAG maroon/gold palette, alive and distinctive
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/* ── Intersection observer hook for scroll-triggered animations ── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.15, ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}

/* ── Animated counter ── */
function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0)
  const [ref, inView] = useInView()
  const animated = useRef(false)

  useEffect(() => {
    if (!inView || animated.current) return
    animated.current = true
    const start = performance.now()
    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target, duration])

  return [ref, val]
}

/* ── Reveal-on-scroll wrapper ── */
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Navbar ── */
function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo-n.png" alt="LagVoice" className="w-11 h-11 rounded-xl object-cover" />
            <span className={`font-bold text-[17px] tracking-tight transition-colors duration-300 ${scrolled ? 'text-ink' : 'text-white'}`}>
              LagVoice
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Campus', 'Impact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-[13px] font-medium transition-colors duration-300 ${
                  scrolled ? 'text-ink/45 hover:text-ink' : 'text-white/60 hover:text-white'
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className={`text-[13px] font-medium transition-colors duration-300 px-4 py-2 ${
                scrolled ? 'text-ink/60 hover:text-ink' : 'text-white/70 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className={`text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 ${
                scrolled
                  ? 'bg-maroon text-white shadow-[0_2px_8px_rgba(128,0,0,0.2)] hover:bg-maroon-dark'
                  : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
              }`}
            >
              Get Started
            </button>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className={`w-5 h-5 ${scrolled ? 'text-ink' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className={`w-5 h-5 ${scrolled ? 'text-ink' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
        menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}>
        <div className="bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-b border-mist/30">
          <div className="px-6 py-5 space-y-1">
            {['Features', 'Campus', 'Impact'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[15px] font-medium text-ink/60 hover:text-ink transition-colors"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 mt-3 border-t border-mist/30 space-y-3">
              <button
                onClick={() => { setMenuOpen(false); navigate('/login') }}
                className="w-full py-3 text-[15px] font-medium text-ink/60 hover:text-ink transition-colors text-left"
              >
                Sign In
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/login') }}
                className="w-full py-3.5 rounded-xl bg-maroon text-white font-semibold text-[15px] text-center
                  shadow-[0_2px_8px_rgba(128,0,0,0.2)] hover:bg-maroon-dark transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Stat chart (donut) — FIXED text fitting ── */
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer } from 'recharts'

function DonutStat({ value, total, color, label, suffix = '' }) {
  const [ref, inView] = useInView()
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 1200
    function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setAnimated(Math.round(value * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  const data = [
    { value: animated },
    { value: Math.max(0, total - animated) },
  ]

  return (
    <div ref={ref} className="flex flex-col items-center px-2">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[1rem] sm:text-[1.1rem] lg:text-[1.3rem] font-bold text-white font-mono leading-none">
            {animated.toLocaleString()}{suffix}
          </p>
        </div>
      </div>
      <p className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.1em] font-semibold mt-3 text-center max-w-[120px] leading-snug">{label}</p>
    </div>
  )
}

function BarStat({ data, color, label }) {
  return (
    <div className="flex flex-col items-center px-2">
      <div className="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <Bar dataKey="v" radius={[4, 4, 0, 0]} barSize={8}>
              {data.map((entry, i) => (
                <Cell key={i} fill={i === data.length - 1 ? color : 'rgba(255,255,255,0.12)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.1em] font-semibold mt-3 text-center max-w-[120px] leading-snug">{label}</p>
    </div>
  )
}

/* ── Feature card ── */
function FeatureCard({ icon, title, description }) {
  return (
    <Reveal>
      <div className="group bg-white rounded-2xl p-7 border border-mist/50 hover:border-maroon/15 hover:shadow-[0_8px_30px_rgba(128,0,0,0.06)] transition-all duration-500 h-full">
        <div className="w-12 h-12 rounded-xl bg-maroon/6 flex items-center justify-center mb-5 group-hover:bg-maroon/10 group-hover:scale-105 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-[17px] font-bold text-ink mb-2 leading-snug">{title}</h3>
        <p className="text-[14px] text-ink/40 leading-relaxed">{description}</p>
      </div>
    </Reveal>
  )
}

/* ── Campus image card ── */
function CampusCard({ src, title, description, delay, objectPosition }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={objectPosition ? { objectPosition } : undefined}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h4 className="text-white font-bold text-[16px] mb-1">{title}</h4>
          <p className="text-white/50 text-[13px] leading-relaxed">{description}</p>
        </div>
      </div>
    </Reveal>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      title: 'Anonymous Feedback',
      description: 'Submit complaints and suggestions anonymously. Your identity is protected, your voice still counts.',
    },
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
      title: 'Real-Time Tracking',
      description: 'Track every submission from start to finish. Know exactly where your complaint is and when it will be resolved.',
    },
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      title: 'Geo-Tagged Reports',
      description: 'Pinpoint exact locations for infrastructure issues. Upload photos and tag the precise spot that needs attention.',
    },
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      title: 'Live Analytics',
      description: 'Administrators get real-time dashboards with trends, alerts, and predictive insights to act before issues escalate.',
    },
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      title: 'Course Evaluations',
      description: 'Rate lecturers and courses with structured evaluations. Your feedback shapes better teaching across campus.',
    },
    {
      icon: <svg className="w-5 h-5 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      title: 'Accreditation Reports',
      description: 'Auto-generate NUC accreditation reports from complaint data. One click to produce compliance-ready documents.',
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/unilag-gate.jpg"
            alt="University of Lagos Main Gate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/95 via-maroon-deep/85 to-maroon-deep/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/40 to-transparent" />
        </div>

        {/* Animated grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-8 backdrop-blur-sm animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-resolved animate-pulse" />
              <span className="text-[12px] text-white/70 font-medium">University of Lagos Quality Assurance</span>
            </div>

            <h1 className="text-[2.8rem] lg:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up">
              Your voice<br />
              shapes <span className="text-gold italic">better</span><br />
              campus life<span className="text-gold">.</span>
            </h1>

            <p className="text-[17px] text-white/50 max-w-lg leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Report issues, track resolutions, evaluate courses, and influence real change at the University of Lagos, all from one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold text-maroon-deep font-bold text-[15px]
                  shadow-[0_4px_20px_rgba(255,153,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,153,0,0.4)]
                  hover:bg-gold-light active:scale-[0.98] transition-all duration-300"
              >
                Get Started for Free
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white/70 font-semibold text-[15px]
                  hover:text-white hover:border-white/40 hover:bg-white/5
                  transition-all duration-300"
              >
                See How It Works
              </button>
            </div>
          </div>

          {/* Stats charts at bottom of hero */}
          <div className="mt-16 lg:mt-24 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <DonutStat value={1823} total={2200} color="#ffa900" label="Complaints Resolved" />
            <DonutStat value={78} total={100} color="#00b74a" label="Satisfaction Rate" suffix="%" />
            <BarStat data={[{v:35},{v:52},{v:48},{v:60},{v:44},{v:48},{v:38}]} color="#ffa900" label="Avg. Response Time" />
            <DonutStat value={15} total={20} color="#b23cfd" label="Departments Covered" />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2.5 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mb-3">Features</p>
              <h2 className="text-[2rem] lg:text-[2.8rem] font-bold text-ink leading-tight tracking-tight">
                Everything you need to<br />drive campus improvement
              </h2>
              <p className="text-[15px] text-ink/40 max-w-lg mx-auto mt-4 leading-relaxed">
                From anonymous feedback to accreditation reports, LagVoice covers the full quality assurance lifecycle.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CAMPUS GALLERY ═══════ */}
      <section id="campus" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mb-3">Campus</p>
              <h2 className="text-[2rem] lg:text-[2.8rem] font-bold text-ink leading-tight tracking-tight">
                Built for the <span className="text-maroon">UNILAG</span> community
              </h2>
              <p className="text-[15px] text-ink/40 max-w-lg mx-auto mt-4 leading-relaxed">
                From the main gate to the hostels, LagVoice covers every corner of campus.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CampusCard
              src="/images/unilag-student-affairs.jpg"
              title="Student Affairs"
              description="The hub of student welfare and administrative services"
              delay={0}
            />
            <CampusCard
              src="/images/unilag-faculty-new.jpg"
              title="Faculty Buildings"
              description="Where learning happens, report issues in lecture halls and labs"
              delay={100}
            />
            <CampusCard
              src="/images/unilag-hostel.jpg"
              title="Student Hostels"
              description="Modern accommodation, track maintenance and facility reports"
              delay={200}
            />
            <CampusCard
              src="/images/unilag-gate.jpg"
              title="University of Lagos"
              description="The iconic main gate, welcoming students since 1962"
              delay={300}
              objectPosition="center 30%"
            />
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mb-3">How It Works</p>
                <h2 className="text-[2rem] lg:text-[2.5rem] font-bold text-ink leading-tight tracking-tight mb-4">
                  Three steps to<br />make your voice count
                </h2>
                <p className="text-[15px] text-ink/40 leading-relaxed mb-10 max-w-md">
                  No complex forms, no long queues. Report issues from your phone in under a minute and track them in real-time.
                </p>
                <div className="space-y-8">
                  {[
                    { num: '1', title: 'Submit Your Feedback', desc: 'Choose a category, describe the issue, and optionally attach photos. Toggle anonymity on or off.' },
                    { num: '2', title: 'We Route It Automatically', desc: 'Your complaint is classified and sent to the right department. You get a tracking ID instantly.' },
                    { num: '3', title: 'Track & See Results', desc: 'Follow your complaint in real-time. Get notified when action is taken and when it is resolved.' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-5">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-[15px] font-mono shadow-[0_2px_8px_rgba(128,0,0,0.2)]">
                        {step.num}
                      </div>
                      <div className="pt-1.5">
                        <h4 className="text-[16px] font-bold text-ink mb-1">{step.title}</h4>
                        <p className="text-[14px] text-ink/40 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-gradient-to-br from-maroon-deep to-maroon rounded-2xl p-8 lg:p-10 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                }} />
                <div className="relative z-10">
                  <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-semibold mb-6">Tracking Your Complaint</p>
                  <div className="space-y-5">
                    {[
                      { label: 'Submitted', desc: 'Just now', done: true },
                      { label: 'Under Review', desc: 'Assigned to Maintenance', done: true },
                      { label: 'Action Taken', desc: 'Team dispatched', done: true },
                      { label: 'Resolved', desc: 'Pending confirmation', done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="mt-0.5 shrink-0">
                          {step.done ? (
                            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full border-2 border-white/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white/30" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className={`text-[14px] font-semibold ${step.done ? 'text-white' : 'text-white/50'}`}>{step.label}</p>
                          <p className={`text-[12px] ${step.done ? 'text-white/40' : 'text-white/20'}`}>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.12em]">Tracking ID</p>
                      <p className="text-[15px] font-mono font-bold text-gold mt-0.5">#UNILAG-00042</p>
                    </div>
                    <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/20">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════ IMPACT ═══════ */}
      <section id="impact" className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/unilag-tower.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-maroon-deep/92" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] text-gold uppercase tracking-[0.2em] font-semibold mb-3">Impact</p>
              <h2 className="text-[2rem] lg:text-[2.8rem] font-bold text-white leading-tight tracking-tight">
                Real numbers, real change
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <DonutStat value={1823} total={2200} color="#ffa900" label="Complaints Resolved" />
            <DonutStat value={78} total={100} color="#00b74a" label="Satisfaction Rate" suffix="%" />
            <BarStat data={[{v:35},{v:52},{v:48},{v:60},{v:44},{v:48},{v:38}]} color="#ffa900" label="Avg. Response Time" />
            <DonutStat value={15} total={20} color="#b23cfd" label="Departments Covered" />
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mb-3">Testimonials</p>
              <h2 className="text-[2rem] lg:text-[2.8rem] font-bold text-ink leading-tight tracking-tight">
                Trusted by the campus community
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Adaeze Okonkwo', role: '300L Computer Science', quote: 'I reported a broken projector in my lecture hall and it was fixed within 48 hours. LagVoice actually works.', avatar: 'AO' },
              { name: 'Dr. Femi Adebayo', role: 'Faculty of Engineering', quote: 'The peer review system has genuinely improved how we evaluate teaching quality. It is structured, fair, and anonymous.', avatar: 'FA' },
              { name: 'Blessing Eze', role: 'SERICOM Officer', quote: 'The analytics dashboard shows us patterns we never noticed. We can now predict and prevent issues before they escalate.', avatar: 'BE' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-cream rounded-2xl p-7 border border-mist/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[15px] text-ink/60 leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-maroon/10 flex items-center justify-center text-maroon font-bold text-[13px]">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                      <p className="text-[12px] text-ink/35">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="/images/unilag-hostel.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-maroon-deep/95 to-maroon-deep/80" />
              <div className="relative z-10 p-10 lg:p-16 text-center">
                <h2 className="text-[2rem] lg:text-[3rem] font-bold text-white leading-tight tracking-tight mb-4">
                  Ready to make your<br />voice heard<span className="text-gold">?</span>
                </h2>
                <p className="text-[15px] text-white/40 max-w-md mx-auto leading-relaxed mb-8">
                  Join thousands of UNILAG students and staff who are already shaping a better campus experience.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 rounded-xl bg-gold text-maroon-deep font-bold text-[15px]
                    shadow-[0_4px_20px_rgba(255,153,0,0.3)] hover:shadow-[0_8px_30px_rgba(255,153,0,0.4)]
                    hover:bg-gold-light transition-all duration-300 active:scale-[0.98]"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════ PARTNERS / LOGOS ═══════ */}
      <section className="py-16 bg-white border-t border-mist/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[11px] text-gold-dark uppercase tracking-[0.2em] font-semibold mb-3">In Partnership With</p>
              <h2 className="text-[1.6rem] lg:text-[2rem] font-bold text-ink leading-tight tracking-tight">
                Empowering the UNILAG Community
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">
              <div className="flex flex-col items-center gap-3">
                <img src="/images/unilag-official-logo.png" alt="University of Lagos" className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
                <div className="text-center">
                  <p className="text-[14px] font-bold text-ink">University of Lagos</p>
                  <p className="text-[12px] text-ink/40 mt-0.5">In Deed and in Truth</p>
                </div>
              </div>
              <div className="w-px h-20 bg-mist/50 hidden sm:block" />
              <div className="flex flex-col items-center gap-3">
                <img src="/images/servicom-logo.png" alt="SERVICOM" className="w-28 h-28 sm:w-32 sm:h-32 object-contain" />
                <div className="text-center">
                  <p className="text-[14px] font-bold text-ink">SERICOM</p>
                  <p className="text-[12px] text-ink/40 mt-0.5">Service Compact With All Nigerians</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-center text-[12px] text-ink/30 mt-10 max-w-lg mx-auto leading-relaxed">
              LagVoice is an initiative of the University of Lagos SERICOM unit, dedicated to improving service delivery and quality assurance across campus.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-12 border-t border-mist/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-maroon/10 flex items-center justify-center p-0.5">
                <img src="/images/logo-n.png" alt="LagVoice" className="w-full h-full object-cover rounded-lg" />
              </div>
              <span className="text-ink font-bold text-[17px] tracking-tight">LagVoice</span>
            </div>
            <div className="flex items-center gap-6">
              {['Features', 'Campus', 'Impact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] text-ink/35 hover:text-ink/60 transition-colors">{item}</a>
              ))}
            </div>
            <p className="text-[12px] text-ink/25">
              &copy; 2026 University of Lagos. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
