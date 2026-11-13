import { useEffect, useState } from "react"

function DisplayComp({ aiRes }) {
  const [data, setData] = useState(null)
  const [animatedScore, setAnimatedScore] = useState(0)

  // ✅ SAFE JSON PARSER (IMPORTANT)
  const extractJSON = (text) => {
    try {
      // direct parse
      return JSON.parse(text)
    } catch {
      try {
        // extract JSON block
        const match = text.match(/\{[\s\S]*\}/)
        if (match) {
          return JSON.parse(match[0])
        }
      } catch (e) {
        console.error("Still invalid JSON:", e)
      }
    }
    return null
  }

  // ✅ Parse AI response safely
  useEffect(() => {
    if (!aiRes) return

    const parsed = extractJSON(aiRes)

    if (!parsed) {
      console.error("❌ No valid JSON found")
      return
    }

    setData(parsed)
  }, [aiRes])

  // ✅ Animate Score
  useEffect(() => {
    if (!data?.score) return

    let start = 0
    const end = Number(data.score) || 0

    const interval = setInterval(() => {
      start += 1
      if (start >= end) {
        start = end
        clearInterval(interval)
      }
      setAnimatedScore(start)
    }, 15)

    return () => clearInterval(interval)
  }, [data])

  // ✅ Loading UI
  if (!data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        Upload resume & click analyze 🚀
      </div>
    )
  }

  const score = Number(data.score) || 0

  const getColor = () => {
    if (score >= 75) return "text-green-500 stroke-green-500"
    if (score >= 50) return "text-yellow-500 stroke-yellow-500"
    return "text-red-500 stroke-red-500"
  }

  return (
    <div className="h-full overflow-y-auto p-6 
    bg-gradient-to-br from-gray-50 to-white 
    dark:from-gray-900 dark:to-gray-800">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        ATS Analysis
      </h1>

      {/* SCORE */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border mb-6 flex items-center gap-6">

        <div className="relative w-24 h-24">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${getColor()}`}>
              {animatedScore}%
            </span>
          </div>

          <svg className="w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              strokeWidth="8"
              fill="none"
              strokeDasharray={251}
              strokeDashoffset={251 - (251 * animatedScore) / 100}
              className={getColor()}
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-semibold dark:text-white">
            ATS Score
          </h2>
          <p className="text-sm text-gray-500">
            AI-based evaluation
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border mb-6">
        <h2 className="text-lg font-semibold mb-2 dark:text-white">
          🧠 Summary
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {data.summary}
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">

        {/* STRENGTHS */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border">
          <h2 className="text-green-600 font-semibold mb-2">
            ✔ Strengths
          </h2>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            {data.strengths?.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border">
          <h2 className="text-red-600 font-semibold mb-2">
            ✖ Weaknesses
          </h2>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            {data.weaknesses?.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>

      </div>

      {/* KEYWORDS */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border mt-6">
        <h2 className="text-yellow-600 font-semibold mb-3">
          ⚡ Missing Keywords
        </h2>

        <div className="flex flex-wrap gap-2">
          {data.missing_keywords?.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow border mt-6">
        <h2 className="text-indigo-600 font-semibold mb-2">
          💡 Suggestions
        </h2>

        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          {data.suggestion?.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default DisplayComp