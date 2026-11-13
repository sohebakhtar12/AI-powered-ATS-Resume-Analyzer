import { useRef, useState } from 'react'
import { extractText } from '../Utils/ReadPdf'
import { ai } from '../Utils/Gemini'

function InputComp({ setAiRes }) {
  const ipRef = useRef(null)
  const taRef = useRef(null)
  const [resume, setResume] = useState(null)
  const [resumeText, setResumeText] = useState("")

  return (
    <div className="w-full flex items-center justify-center">

      {/* GLASS CARD */}
      <div className="w-full max-w-md 
      bg-white/70 dark:bg-gray-900/70 
      backdrop-blur-xl 
      p-6 rounded-2xl shadow-xl 
      border border-white/40 dark:border-gray-700
      hover:shadow-2xl transition-all duration-300">

        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-6 text-center 
        text-gray-800 dark:text-white">
          🚀 Resume Analyzer
        </h1>

        {/* JOB DESCRIPTION */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 
          text-gray-700 dark:text-gray-300">
            Job Description
          </label>

          <textarea
            ref={taRef}
            placeholder="Paste the job description here..."
            className="w-full h-40 p-3 text-sm 
            border border-gray-300 dark:border-gray-600 
            rounded-lg 
            bg-gray-50 dark:bg-gray-800 
            text-gray-800 dark:text-white
            outline-none 
            focus:ring-2 focus:ring-purple-400 
            focus:bg-white dark:focus:bg-gray-700
            transition"
          />
        </div>

        {/* UPLOAD AREA */}
        <div className="mb-6 p-5 rounded-xl border-2 border-dashed 
        border-purple-300 dark:border-purple-600 
        bg-purple-50 dark:bg-gray-800
        flex flex-col items-center gap-3 text-center 
        hover:bg-purple-100 dark:hover:bg-gray-700 
        transition">

          <input
            onChange={async (e) => {
              const file = e.target.files[0]
              setResume(file)

              const text = await extractText(file)
              setResumeText(text)
            }}
            ref={ipRef}
            type="file"
            className="hidden"
            accept=".pdf"
          />

          <button
            onClick={() => ipRef.current.click()}
            className="px-4 py-2 rounded-lg 
            bg-gradient-to-r from-purple-500 to-indigo-500 
            text-white text-sm font-medium
            hover:scale-105 active:scale-95 
            transition shadow-md"
          >
            + Upload Resume
          </button>

          {resume && (
            <p className="text-sm text-green-500 font-medium truncate max-w-[220px]">
              ✔ {resume.name}
            </p>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF only • Max 5MB
          </p>
        </div>

        {/* ACTION BUTTON */}
        <button
          className="w-full 
          bg-gradient-to-r from-purple-500 to-indigo-500 
          text-white py-3 rounded-lg font-medium 
          hover:scale-[1.03] active:scale-95 
          transition-all duration-200 shadow-lg"

          onClick={async () => {

            if (!resume || !taRef.current.value){
              alert("Please upload your resume and enter all required details.");

            } 

            const prompt = `
You are a senior technical recruiter and ATS expert.

Return ONLY valid JSON.

{
  "score": number,
  "summary": "",
  "strengths": ["", "", "", "", ""],
  "weaknesses": ["", "", "", "", ""],
  "missing_keywords": ["", "", "", "", ""],
  "suggestion": ["", "", "", "", ""]
}

If invalid → return {}.

Resume:
${resumeText}

Job Description:
${taRef.current.value}
`

            try {
              const result = await ai.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
              })

              let text =
                result?.candidates?.[0]?.content?.parts?.[0]?.text || ""

              const match = text.match(/\{[\s\S]*\}/)

              if (match) {
                setAiRes(match[0])
              } else {
                setAiRes("{}")
              }

            } catch (err) {
              console.error(err)
              setAiRes("{}")
            }

          }}
        >
          ⚡ Analyze Resume
        </button>

      </div>
    </div>
  )
}

export default InputComp