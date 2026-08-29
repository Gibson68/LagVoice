/**
 * EvaluationForm — Course & Lecturer Evaluation
 * Star ratings, Likert scales, open-ended questions, progress bar
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MOCK_COURSES = [
  { id: 1, code: 'CSC 301', name: 'Data Structures & Algorithms', lecturer: 'Dr. Adebayo', department: 'Computer Science' },
  { id: 2, code: 'MTH 201', name: 'Linear Algebra', lecturer: 'Prof. Okonkwo', department: 'Mathematics' },
  { id: 3, code: 'PHY 101', name: 'Introduction to Physics', lecturer: 'Dr. Eze', department: 'Physics' },
  { id: 4, code: 'ENG 401', name: 'Software Engineering', lecturer: 'Dr. Ibrahim', department: 'Computer Science' },
  { id: 5, code: 'GST 111', name: 'Use of English', lecturer: 'Mrs. Akinola', department: 'General Studies' },
]

const LIKERT_OPTIONS = [
  { value: 5, label: 'Strongly Agree' },
  { value: 4, label: 'Agree' },
  { value: 3, label: 'Neutral' },
  { value: 2, label: 'Disagree' },
  { value: 1, label: 'Strongly Disagree' },
]

const QUESTIONS = [
  'The lecturer communicates course content effectively.',
  'The course materials are relevant and up-to-date.',
  'The lecturer is available for consultation outside class.',
  'Assessment methods are fair and transparent.',
  'The overall quality of teaching in this course is excellent.',
]

function StarRating({ value, onChange, size = 'md' }) {
  const [hover, setHover] = useState(0)
  const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <svg className={`${sizeClass} ${(hover || value) >= star ? 'text-gold' : 'text-mist'} transition-colors`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function EvaluationForm() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [ratings, setRatings] = useState({})
  const [likert, setLikert] = useState({})
  const [openEnded, setOpenEnded] = useState({ likes: '', suggestions: '' })
  const [overallRating, setOverallRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const totalQuestions = QUESTIONS.length + 1 // likert + overall
  const answeredQuestions = Object.keys(likert).length + (overallRating > 0 ? 1 : 0)
  const progress = Math.round((answeredQuestions / totalQuestions) * 100)

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setSubmitted(true)
  }

  // Course selection
  if (!selectedCourse) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-[1.8rem] font-bold text-ink tracking-tight mb-1">Course Evaluations</h1>
        <p className="text-[14px] text-ink/40 mb-6">Select a course to evaluate</p>

        <div className="bg-paper rounded-2xl border border-mist/50 overflow-hidden">
          {MOCK_COURSES.map((course, i) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`w-full flex items-center gap-4 p-4 text-left hover:bg-cream/50 transition-colors ${
                i < MOCK_COURSES.length - 1 ? 'border-b border-mist/20' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-maroon/8 flex items-center justify-center text-maroon text-[12px] font-bold font-mono shrink-0">
                {course.code.split(' ')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink truncate">{course.name}</p>
                <p className="text-[12px] text-ink/35">{course.lecturer} · {course.code}</p>
              </div>
              <svg className="w-4 h-4 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-paper rounded-3xl p-10 border border-mist/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="w-16 h-16 rounded-full bg-resolved/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-resolved" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[1.5rem] font-bold text-ink mb-2">Evaluation Submitted</h1>
            <p className="text-[14px] text-ink/40 mb-6">Thank you for evaluating {selectedCourse.code}. Your feedback helps improve teaching quality.</p>
            <div className="bg-cream rounded-xl p-5 mb-6">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className={`w-5 h-5 ${s <= overallRating ? 'text-gold' : 'text-mist'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[12px] text-ink/40">Your overall rating: {overallRating}/5</p>
            </div>
            <button
              onClick={() => { setSelectedCourse(null); setRatings({}); setLikert({}); setOpenEnded({ likes: '', suggestions: '' }); setOverallRating(0); setSubmitted(false) }}
              className="w-full py-3 rounded-xl bg-maroon text-white font-semibold text-[14px] shadow-[0_2px_8px_rgba(128,0,0,0.2)] hover:bg-maroon-dark transition-all"
            >
              Evaluate Another Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Evaluation form
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-[13px] text-ink/40 hover:text-ink mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All Courses
      </button>

      {/* Course header */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-maroon/8 flex items-center justify-center text-maroon text-[12px] font-bold font-mono">
            {selectedCourse.code.split(' ')[0]}
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink">{selectedCourse.name}</p>
            <p className="text-[12px] text-ink/35">{selectedCourse.lecturer} · {selectedCourse.code}</p>
          </div>
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-mist-light rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-maroon to-gold rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[11px] text-ink/30 font-mono">{answeredQuestions}/{totalQuestions}</span>
        </div>
      </div>

      {/* Likert Scale Questions */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-5 mb-4">
        <h2 className="text-[14px] font-bold text-ink mb-5">Rate the following statements</h2>
        <div className="space-y-5">
          {QUESTIONS.map((q, i) => (
            <div key={i}>
              <p className="text-[13px] text-ink/70 mb-3 leading-relaxed">{i + 1}. {q}</p>
              <div className="flex gap-2 flex-wrap">
                {LIKERT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLikert(prev => ({ ...prev, [i]: opt.value }))}
                    className={`px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
                      likert[i] === opt.value
                        ? 'bg-maroon text-white shadow-sm'
                        : 'bg-cream border border-mist/50 text-ink/40 hover:text-ink/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Rating */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-5 mb-4">
        <h2 className="text-[14px] font-bold text-ink mb-2">Overall Rating</h2>
        <p className="text-[13px] text-ink/40 mb-4">How would you rate this course overall?</p>
        <div className="flex justify-center">
          <StarRating value={overallRating} onChange={setOverallRating} size="lg" />
        </div>
      </div>

      {/* Open-ended */}
      <div className="bg-paper rounded-2xl border border-mist/50 p-5 mb-6">
        <h2 className="text-[14px] font-bold text-ink mb-4">Open Feedback</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">What did you like most?</label>
            <textarea
              value={openEnded.likes}
              onChange={e => setOpenEnded(prev => ({ ...prev, likes: e.target.value }))}
              placeholder="Share what worked well..."
              rows={2}
              className="w-full px-4 py-3 text-[13px] rounded-xl bg-cream border border-mist/50 text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40 transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-[0.15em] mb-2">Suggestions for improvement</label>
            <textarea
              value={openEnded.suggestions}
              onChange={e => setOpenEnded(prev => ({ ...prev, suggestions: e.target.value }))}
              placeholder="How can this course be improved?"
              rows={2}
              className="w-full px-4 py-3 text-[13px] rounded-xl bg-cream border border-mist/50 text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-maroon/15 focus:border-maroon/40 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={answeredQuestions < 2 || submitting}
        className="w-full py-4 rounded-xl bg-maroon text-white font-bold text-[15px] shadow-[0_4px_14px_rgba(128,0,0,0.25)] hover:bg-maroon-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <svg className="animate-spin h-5 w-5 text-white mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : 'Submit Evaluation'}
      </button>
    </div>
  )
}
