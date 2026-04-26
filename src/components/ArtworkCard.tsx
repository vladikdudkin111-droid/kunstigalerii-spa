import { useState } from "react"
import type { Artwork } from "../types"

interface Props {
  artwork: Artwork
  onDelete: (id: number) => void
  onLike: (id: number) => void
  onEdit: (id: number, newTitle: string, newImageData: string) => void
  onStartEdit: (id: number) => void
  darkMode: boolean
}

function ArtworkCard({ artwork, onDelete, onLike, onEdit, onStartEdit, darkMode }: Props) {
  const [editInput, setEditInput] = useState(artwork.title)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState(artwork.imageData)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setEditImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = () => {
    if (editInput.trim() !== "" && editImagePreview) {
      onEdit(artwork.id, editInput, editImagePreview)
    }
  }

  return (
    <div className={`p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      {artwork.editing ? (
        <div className="space-y-3">
          <input
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            placeholder="Pealkiri..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit()
              if (e.key === "Escape") onEdit(artwork.id, artwork.title, artwork.imageData) // Cancel edit
            }}
            autoFocus
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${darkMode ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-gray-200' : ''}`}
          />
          {editImagePreview && (
            <img
              src={editImagePreview}
              alt="Edit preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
          )}
        </div>
      ) : (
        <>
          <img
            src={artwork.imageData}
            alt={artwork.title}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold text-lg mb-2">{artwork.title}</h3>
        </>
      )}

      <div className="flex gap-2 mt-auto">
        {artwork.editing ? (
          <>
            <button
              onClick={handleEdit}
              className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            >
              💾
            </button>
            <button
              onClick={() => onEdit(artwork.id, artwork.title, artwork.imageData)} // Cancel
              className="px-3 py-1 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              ❌
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onLike(artwork.id)}
              className={`px-3 py-1 rounded-lg hover:bg-gray-100 transition ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              {artwork.liked ? "❤️" : "🤍"}
            </button>
            <button
              onClick={() => onStartEdit(artwork.id)} // Start edit
              className={`px-3 py-1 rounded-lg hover:bg-blue-100 transition ${darkMode ? 'hover:bg-gray-700' : ''}`}
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(artwork.id)}
              className={`px-3 py-1 rounded-lg hover:bg-red-100 transition ${darkMode ? 'hover:bg-red-700' : ''}`}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ArtworkCard