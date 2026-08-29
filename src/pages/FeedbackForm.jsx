/**
 * FeedbackForm — Student Feedback Submission (v2)
 * Category tiles, subcategories, photo evidence uploads, geo-tagging,
 * anonymous toggle, and 3-step flow with success state
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  {
    id: 'academic',
    label: 'Academic & Teaching',
    color: '#1266f1',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    subcategories: ['Lecture Quality', 'Course Content', 'Syllabus Delivery', 'Examination Conduct', 'Grading Disputes'],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure & Facilities',
    color: '#FF9900',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    subcategories: ['Hostel', 'Lecture Hall', 'Laboratory', 'Water Supply', 'Electricity', 'Sanitation'],
    geoTag: true,
  },
  {
    id: 'admin',
    label: 'Administrative & Portal',
    color: '#0e52c1',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    subcategories: ['Portal Errors', 'Fee Payment', 'Result Processing', 'Post-UTME Issues', 'Registration'],
  },
  {
    id: 'welfare',
    label: 'Student Welfare & Safety',
    color: '#b23cfd',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    subcategories: ['Health Services', 'Security Concerns', 'Harassment Reports', 'General Welfare'],
  },
  {
    id: 'general',
    label: 'General Feedback',
    color: '#2E7D32',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>,
    subcategories: ['Suggestions', 'Commendations', 'General Feedback'],
  },
]

const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: '#00b74a', desc: 'Not urgent, can wait' },
  { id: 'medium', label: 'Medium', color: '#ffa900', desc: 'Needs attention soon' },
  { id: 'high', label: 'High', color: '#f93154', desc: 'Urgent, needs immediate action' },
]

function generateTrackingId() {
  const num = String(Math.floor(10000 + Math.random() * 90000))
  return `UNILAG-${num}`
}

export default function FeedbackForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    category: '', subcategory: '', title: '', description: '',
    urgency: 'medium', anonymous: true, location: '',
    gpsLat: null, gpsLng: null,
  })
  const [images, setImages] = useState([])
  const [trackingId] = useState(generateTrackingId())
  const [submitting, setSubmitting] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  const selectedCategory = CATEGORIES.find(c => c.id === form.category)
  const isInfrastructure = form.category === 'infrastructure'

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    const newImages = files.map(f => ({ file: f, preview: URL.createObjectURL(f), name: f.name }))
    setImages(prev => [...prev, ...newImages].slice(0, 5))
  }, [])

  const removeImage = useCallback((idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }, [])

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          gpsLat: pos.coords.latitude,
          gpsLng: pos.coords.longitude,
          location: f.location || `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        }))
        setGeoLoading(false)
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))

    const complaint = {
      id: Date.now(),
      trackingId,
      title: form.title,
      description: form.description,
      category: selectedCategory?.label || form.category,
      categoryId: form.category,
      subcategory: form.subcategory,
      location: form.location,
      gpsLat: form.gpsLat,
      gpsLng: form.gpsLng,
      urgency: form.urgency,
      anonymous: form.anonymous,
      images: images.map(i => i.name),
      status: 'submitted',
      createdAt: new Date().toISOString(),
    }
    try {
      const existing = JSON.parse(localStorage.getItem('lagvoice_complaints') || '[]')
      existing.unshift(complaint)
      localStorage.setItem('lagvoice_complaints', JSON.stringify(existing))
    } catch (e) { /* ignore */ }

    setSubmitting(false)
    setStep(3)
  }

  // Success state
  if (step === 3) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-10 border border-[#E4E8EE] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-16 h-16 rounded-full bg-[#00b74a]/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#00b74a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[1.5rem] font-bold text-[#262626] mb-2">Feedback Submitted</h1>
            <p className="text-[14px] text-[#9fa6b2] mb-6">Your feedback has been received and is being processed.</p>

            {/* Tracking ID */}
            <div className="bg-[#F5F7FA] rounded-xl p-5 mb-6">
              <p className="text-[10px] text-[#9fa6b2] uppercase tracking-[0.15em] font-semibold mb-1">Your Tracking ID</p>
              <p className="text-[1.5rem] font-bold text-[#1266f1] font-mono">{trackingId}</p>
              <p className="text-[11px] text-[#9fa6b2] mt-2">Save this ID to track your complaint</p>
            </div>

            {/* Quick tracking preview */}
            <div className="bg-[#F5F7FA] rounded-xl p-4 mb-6 text-left">
              <p className="text-[11px] font-semibold text-[#262626] mb-3 uppercase tracking-wider">What happens next</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Complaint submitted', done: true },
                  { label: 'Received by Quality Assurance', done: false },
                  { label: 'Assigned to relevant department', done: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${s.done ? 'bg-[#00b74a]/15' : 'bg-[#E4E8EE]'}`}>
                      {s.done ? (
                        <svg className="w-3 h-3 text-[#00b74a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#9fa6b2]/40" />
                      )}
                    </div>
                    <span className={`text-[12px] ${s.done ? 'text-[#262626] font-medium' : 'text-[#9fa6b2]'}`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F5F7FA] rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 text-[13px] text-[#4f4f4f]">
                <svg className="w-4 h-4 text-[#ffa900]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <span>Estimated resolution: <strong className="text-[#262626]">2-5 business days</strong></span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/student/tickets')}
                className="flex-1 py-3 rounded-xl bg-[#1266f1] text-white font-semibold text-[14px] shadow-[0_2px_8px_rgba(18,102,241,0.25)] hover:bg-[#0e52c1] transition-all"
              >
                Track My Complaint
              </button>
              <button
                onClick={() => { setStep(1); setForm({ category: '', subcategory: '', title: '', description: '', urgency: 'medium', anonymous: true, location: '', gpsLat: null, gpsLng: null }); setImages([]) }}
                className="flex-1 py-3 rounded-xl border border-[#E4E8EE] text-[#4f4f4f] font-semibold text-[14px] hover:bg-[#F5F7FA] transition-all"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)} className="flex items-center gap-2 text-[13px] text-[#9fa6b2] hover:text-[#262626] mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {step === 1 ? 'Back to Dashboard' : 'Back'}
          </button>
          <h1 className="text-[1.8rem] font-bold text-[#262626] tracking-tight">Submit Feedback</h1>
          <p className="text-[14px] text-[#9fa6b2] mt-1">Step {step} of 2</p>
          {/* Progress bar */}
          <div className="mt-4 h-1 bg-[#E4E8EE] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1266f1] to-[#ffa900] rounded-full transition-all duration-500" style={{ width: `${(step / 2) * 100}%` }} />
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-[13px] text-[#4f4f4f] font-medium">What is this feedback about?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setForm(f => ({ ...f, category: cat.id, subcategory: '' })); setStep(2) }}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-[#E4E8EE] bg-white text-left transition-all duration-300 group hover:border-[#1266f1]/20 hover:shadow-[0_2px_12px_rgba(18,102,241,0.06)]"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" style={{ background: `${cat.color}10`, color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#262626] group-hover:text-[#1266f1] transition-colors">{cat.label}</p>
                    <p className="text-[12px] text-[#9fa6b2] mt-0.5">{cat.subcategories.length} subcategories</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && selectedCategory && (
          <div className="space-y-5">
            {/* Selected category badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E4E8EE]">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${selectedCategory.color}10`, color: selectedCategory.color }}>
                {selectedCategory.icon}
              </div>
              <span className="text-[13px] font-semibold text-[#262626]">{selectedCategory.label}</span>
              <button onClick={() => setStep(1)} className="ml-auto text-[11px] text-[#9fa6b2] hover:text-[#4f4f4f]">Change</button>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                className="w-full px-4 py-3.5 text-[14px] rounded-xl bg-white border border-[#E4E8EE] text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all appearance-none cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                required
              >
                <option value="">Select subcategory</option>
                {selectedCategory.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">Title</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Brief summary of the issue"
                className="w-full px-4 py-3.5 text-[14px] rounded-xl bg-white border border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value.slice(0, 500) }))}
                placeholder="Describe the issue in detail..."
                rows={4}
                className="w-full px-4 py-3.5 text-[14px] rounded-xl bg-white border border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] resize-none"
                required
              />
              <p className="text-[11px] text-[#9fa6b2] mt-1 text-right">{form.description.length}/500</p>
            </div>

            {/* Location / Geo-Tagging */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">
                {isInfrastructure ? 'Location (Geo-tagged)' : 'Location (optional)'}
              </label>
              <div className="flex gap-2">
                <input
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder={isInfrastructure ? "e.g., Hostel 4, Room 12" : "e.g., Faculty of Science"}
                  className="flex-1 px-4 py-3.5 text-[14px] rounded-xl bg-white border border-[#E4E8EE] text-[#262626] placeholder:text-[#9fa6b2] focus:outline-none focus:ring-2 focus:ring-[#1266f1]/15 focus:border-[#1266f1]/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={geoLoading}
                  className="shrink-0 px-4 py-3.5 rounded-xl border border-[#E4E8EE] bg-white hover:bg-[#F5F7FA] transition-all flex items-center gap-2 text-[13px] font-medium text-[#1266f1] hover:border-[#1266f1]/30 disabled:opacity-50"
                  title="Auto-detect my location"
                >
                  {geoLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">{geoLoading ? 'Detecting...' : 'Detect'}</span>
                </button>
              </div>
              {form.gpsLat && form.gpsLng && (
                <p className="text-[11px] text-[#00b74a] mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Location detected ({form.gpsLat.toFixed(4)}, {form.gpsLng.toFixed(4)})
                </p>
              )}
              {isInfrastructure && !form.gpsLat && (
                <p className="text-[11px] text-[#9fa6b2] mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tap Detect to auto-fill GPS coordinates for infrastructure reports
                </p>
              )}
            </div>

            {/* Photo Evidence Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">
                Photo Evidence {isInfrastructure ? '(recommended)' : '(optional)'}
                <span className="normal-case tracking-normal font-normal text-[#9fa6b2]/70 ml-1">max 5 images</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E4E8EE]">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#262626]/60 text-white flex items-center justify-center text-[10px] hover:bg-[#262626]/80 transition-colors">
                      x
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-[#262626]/50 px-1 py-0.5">
                      <p className="text-[8px] text-white truncate">{img.name}</p>
                    </div>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E4E8EE] flex flex-col items-center justify-center cursor-pointer hover:border-[#1266f1]/30 hover:bg-[#1266f1]/[0.02] transition-all">
                    <svg className="w-5 h-5 text-[#9fa6b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[9px] text-[#9fa6b2] mt-0.5">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="sr-only" />
                  </label>
                )}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-[11px] font-semibold text-[#9fa6b2] uppercase tracking-[0.15em] mb-2">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {URGENCY_LEVELS.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, urgency: u.id }))}
                    className={`p-3 rounded-xl border text-center transition-all ${form.urgency === u.id ? 'border-current shadow-sm' : 'border-[#E4E8EE] hover:border-[#E4E8EE]'}`}
                    style={form.urgency === u.id ? { borderColor: u.color, color: u.color, background: `${u.color}08` } : {}}
                  >
                    <p className="text-[13px] font-semibold" style={form.urgency === u.id ? { color: u.color } : { color: '#9fa6b2' }}>{u.label}</p>
                    <p className="text-[10px] mt-0.5" style={form.urgency === u.id ? { color: u.color, opacity: 0.6 } : { color: '#9fa6b2', opacity: 0.6 }}>{u.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="p-4 rounded-xl bg-white border border-[#E4E8EE]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#1266f1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <p className="text-[14px] font-semibold text-[#262626]">Anonymous Reporting</p>
                  </div>
                  <p className="text-[12px] text-[#9fa6b2] mt-1 ml-6">
                    {form.anonymous
                      ? 'Your identity will not be shared. The department will only see your feedback.'
                      : 'Your name and student ID will be visible to the department handling this feedback.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
                  className={`w-12 h-7 rounded-full transition-all duration-300 relative shrink-0 ml-4 ${form.anonymous ? 'bg-[#1266f1]' : 'bg-[#E4E8EE]'}`}
                  role="switch"
                  aria-checked={form.anonymous}
                  aria-label="Toggle anonymous reporting"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300 ${form.anonymous ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!form.subcategory || !form.title || !form.description || submitting}
              className="w-full py-4 rounded-xl bg-[#1266f1] text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(18,102,241,0.25)] hover:bg-[#0e52c1] transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {submitting ? (
                <svg className="animate-spin h-5 w-5 text-white mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Submit Feedback'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
