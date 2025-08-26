import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50 })
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    if (localStorage.getItem('planPurchased') === 'true') {
      const timer = setTimeout(() => {
        navigate('/business/templates', { replace: true })
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [navigate])

  // Visual countdown from 10s (3D-styled) matching the redirect timer
  useEffect(() => {
    if (localStorage.getItem('planPurchased') === 'true') {
      setCountdown(10)
      const id = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
      return () => clearInterval(id)
    }
  }, [])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    const ry = (px - 0.5) * 16 // rotateY
    const rx = -(py - 0.5) * 10 // rotateX
    setTilt({ rx, ry })
    setGlare({ x: px * 100, y: py * 100 })
  }

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 })
    setGlare({ x: 50, y: 50 })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-black text-white">
      {/* subtle animated glow backdrop */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[40rem] w-[40rem] rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[40rem] w-[40rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)`,
        backgroundSize: '36px 36px',
      }} />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="[perspective:1000px] w-full max-w-4xl">
          <div
            className="relative rounded-3xl border border-white/10 bg-white/5 p-10 md:p-16 shadow-2xl backdrop-blur-xl"
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: 'transform 150ms ease' }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
          >
            {/* glare highlight */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: `radial-gradient(650px circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.25), transparent 60%)` }}
            />

            {/* countdown overlay (3D-style) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
              <div
                className="rounded-full border border-white/15 bg-black/50 backdrop-blur-md shadow-2xl px-4 py-1 flex items-center gap-2"
                style={{ transform: `translateZ(30px)` }}
              >
                <span className="text-xs text-slate-200/80">Redirect in</span>
                <span className="text-lg font-extrabold threeDText">{countdown}s</span>
              </div>
            </div>

            <div className="relative z-10">
              <h1 className="text-center text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-indigo-300 via-white to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]">
                  Launching Soon
                </span>
              </h1>

              {/* <p className="mt-4 text-center text-base md:text-lg text-slate-200/90">
                Please wait a few hours — your website will be live soon.
              </p>
              <p className="mt-1 text-center text-sm text-slate-300/80">
                (  কিছু ঘন্টার মধ্যেই আপনার ওয়েবসাইট লাইভ হয়ে যাবে।  )
              </p>
              <p className="mt-1 text-center text-sm text-slate-300/80">
                (  कुछ ही घंटों में आपकी वेबसाइट लाइव हो जाएगी।   )
              </p>
              <p className="mt-1 text-center text-sm text-slate-300/80">
                (  Agar Chiye "GANDHI", Kam To Karna Padega Mere Bhai  )
              </p> */}

              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
                <span className="text-slate-200/90">Preparing your deployment…</span>
              </div>

              {/* subtle 3D footer accent */}
              <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-[1.6rem] bg-gradient-to-r from-indigo-500/30 via-fuchsia-500/20 to-cyan-500/30 blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* local styles for extra 3D text depth */}
      <style>{`
        .threeDText {
          text-shadow:
            0 1px 0 rgba(255,255,255,0.05),
            0 2px 0 rgba(255,255,255,0.05),
            0 3px 0 rgba(255,255,255,0.04),
            0 10px 30px rgba(99,102,241,0.25);
        }
      `}</style>
    </div>
  )
}

export default Admin
