import { useState } from "react"

interface Props {
  onAdd: (title: string, imageData: string) => void
  darkMode: boolean
}

function AddArtwork({ onAdd, darkMode }: Props) {
  const [input, setInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = () => {
    if (input.trim() === "" || !imagePreview) return
    onAdd(input, imagePreview)
    setInput("")
    setSelectedFile(null)
    setImagePreview("")
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
          type="text"
          placeholder="Lisa kunstiteos..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd()
          }}
        />

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition"
          disabled={!imagePreview}
        >
          Lisa
        </button>
      </div>

      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${darkMode ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-gray-200' : ''}`}
        />
        {imagePreview && (
          <div className="mt-2">
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Eelvaade:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AddArtwork