"use client"


export default function BlogBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Main gradient background with animation */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30"

      />

      {/* Animated colorful circles with gentle, flowing movement */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"

        />
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"

        />
        <div
          className="absolute bottom-20 left-40 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl"

        />
        <div
          className="absolute bottom-40 right-40 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"

        />
      </div>

      {/* Subtle animated pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 80px,
            rgba(255,255,255,0.1) 80px,
            rgba(255,255,255,0.1) 81px
          )`
        }}

      />
    </div>
  )
}