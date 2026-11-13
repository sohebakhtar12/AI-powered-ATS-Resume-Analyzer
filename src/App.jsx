import InputComp from "./components/InputComp"
import DisplayComp from "./components/DisplayComp"
import { useState, useEffect } from "react"

function App() {
  const [aiRes, setAiRes] = useState(null)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [dark])

  return (
    <div className="h-screen flex flex-col 
    bg-gradient-to-br from-gray-50 to-white 
    dark:from-gray-900 dark:to-gray-800">

      {/* NAVBAR */}
      <div className="h-16 flex items-center justify-between px-6 
      bg-white dark:bg-gray-900 
      border-b border-gray-200 dark:border-gray-700 shadow-sm">

        <h1 className="text-xl font-bold text-indigo-600">
          ATS Analyzer 🚀
        </h1>

        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-1.5 rounded-lg 
          bg-gray-200 dark:bg-gray-700 
          text-gray-800 dark:text-white 
          hover:scale-105 transition"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT */}
        <div className="w-[35%] flex items-center justify-center p-6">
          <InputComp setAiRes={setAiRes} />
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] bg-gray-200 dark:bg-gray-700"></div>

        {/* RIGHT */}
        <div className="w-[65%] p-6">
          <div className="h-full w-full rounded-xl 
          bg-white dark:bg-gray-900 
          shadow border border-gray-200 dark:border-gray-700">
            <DisplayComp aiRes={aiRes} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App