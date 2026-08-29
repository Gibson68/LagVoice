/**
 * RegisterPage
 * Multi-step registration flow with progress indicator
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button/Button'
import Input from '../components/common/Input/Input'

const STEPS = ['Personal Info', 'Role & Department', 'Verification', 'Create Password']

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Engineering', 'Medicine', 'Law', 'Arts', 'Social Sciences',
  'Management Sciences', 'Education', 'Environmental Sciences',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { registerUser, loading } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', studentId: '',
    role: 'student', department: '', faculty: '',
    otp: '', password: '', confirmPassword: '',
    agreeTerms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await registerUser(form)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img src="/images/logo-n.png" alt="LagVoice" className="w-10 h-10 rounded-xl object-contain" />
          <span className="text-maroon font-bold text-xl">LagVoice</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-1">Create Account</h2>
          <p className="text-text-secondary text-center mb-6">Join the UNILAG QAS community</p>

          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-8 px-4" aria-label={`Step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`}>
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      i + 1 <= step
                        ? 'bg-maroon text-white'
                        : 'bg-gray-200 text-text-secondary'
                    }`}
                    aria-current={i + 1 === step ? 'step' : undefined}
                  >
                    {i + 1 < step ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="text-[10px] text-text-secondary mt-1 hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? 'bg-maroon' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" name="firstName" placeholder="Chidinma" value={form.firstName} onChange={handleChange} required />
                  <Input label="Last Name" name="lastName" placeholder="Okafor" value={form.lastName} onChange={handleChange} required />
                </div>
                <Input label="Email Address" name="email" type="email" placeholder="you@student.unilag.edu.ng" value={form.email} onChange={handleChange} required />
                <Input label="Student/Staff ID" name="studentId" placeholder="e.g., 2021/12345" value={form.studentId} onChange={handleChange} required />
                <Button type="button" fullWidth onClick={nextStep}>Continue</Button>
              </div>
            )}

            {/* Step 2: Role & Department */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Role</label>
                  <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon">
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-maroon/30 focus:border-maroon" required>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
                  <Button type="button" fullWidth onClick={nextStep}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-maroon-light rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-maroon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-secondary">We sent a 6-digit code to <strong>{form.email || 'your email'}</strong></p>
                </div>
                <Input label="Verification Code" name="otp" placeholder="000000" value={form.otp} onChange={handleChange} required />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
                  <Button type="button" fullWidth onClick={nextStep}>Verify</Button>
                </div>
              </div>
            )}

            {/* Step 4: Password Creation */}
            {step === 4 && (
              <div className="space-y-4">
                <Input label="Password" name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} required />
                <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} required />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="w-4 h-4 mt-0.5 rounded border-border text-maroon focus:ring-maroon" required />
                  <span className="text-sm text-text-secondary">
                    I agree to the <span className="text-maroon hover:underline font-medium">UNILAG QAS Usage Policy</span> and <span className="text-maroon hover:underline font-medium">Terms of Service</span>
                  </span>
                </label>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
                  <Button type="submit" fullWidth loading={loading}>Create Account</Button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-maroon hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
