'use client'
// app/login/page.tsx
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@zariya.health')
  const [password, setPassword] = useState('demo')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.ok) {
      router.push('/')
    } else {
      setError('Invalid credentials. Use demo@zariya.health / demo')
    }
  }

  return (
    <div className="min-h-screen gradient-zariya flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-zariya-100/50 blur-3xl" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-sage-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-zariya-400 to-zariya-700 items-center justify-center shadow-xl mb-4">
            <Heart className="w-8 h-8 text-white fill-white" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl font-semibold text-zariya-900 tracking-widest">
            ZARIYA
          </h1>
          <p className="text-zariya-400 text-sm mt-1.5">Posture protection for new mothers</p>
        </div>

        {/* Card */}
        <div className="zariya-card p-6 md:p-8">
          <h2 className="font-display text-2xl text-zariya-800 mb-6">Sign in</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zariya-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zariya-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zariya-300 hover:text-zariya-500"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-5 p-3 bg-cream-50 rounded-xl border border-cream-200">
            <p className="text-xs text-zariya-400 font-medium mb-1">Demo credentials</p>
            <p className="text-xs font-mono text-zariya-600">demo@zariya.health · demo</p>
          </div>
        </div>

        <p className="text-center text-xs text-zariya-300 mt-6">
          © 2024 Zariya · Real-time posture monitoring
        </p>
      </div>
    </div>
  )
}
