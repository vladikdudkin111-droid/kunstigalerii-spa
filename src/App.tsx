import { useState, useEffect, useRef } from "react"
import type { Artwork } from "./types"
import AddArtwork from "./components/AddArtwork"
import ArtworkCard from "./components/ArtworkCard"

function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filter, setFilter] = useState<"all" | "liked">("all")
  const [sortBy, setSortBy] = useState<"title" | "liked">("title")
  const [darkMode, setDarkMode] = useState(false)
  const isHydrated = useRef(false)

  // Load data from localStorage on app start
  useEffect(() => {
    const savedArtworks = localStorage.getItem('artworks')
    const savedFilter = localStorage.getItem('filter')
    const savedSortBy = localStorage.getItem('sortBy')
    const savedDarkMode = localStorage.getItem('darkMode')

    if (savedArtworks) {
      try {
        const parsed = JSON.parse(savedArtworks) as Array<Record<string, unknown>>
        setArtworks(parsed.map(item => ({
          id: Number(item.id) || Date.now(),
          title: String(item.title || ""),
          imageData: String(item.imageData || item.imageUrl || ""),
          liked: Boolean(item.liked),
          editing: Boolean(item.editing) || false,
        })))
      } catch (error) {
        console.error('Error loading artworks from localStorage:', error)
      }
    }

    if (savedFilter) {
      setFilter(savedFilter as "all" | "liked")
    }

    if (savedSortBy) {
      setSortBy(savedSortBy as "title" | "liked")
    }

    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true')
    }
  }, [])

  const saveArtworks = (items: Artwork[]) => {
    try {
      localStorage.setItem('artworks', JSON.stringify(items))
    } catch (error) {
      console.error('Error saving artworks to localStorage:', error)
    }
  }

  useEffect(() => {
    if (isHydrated.current) {
      saveArtworks(artworks)
    } else {
      isHydrated.current = true
    }
  }, [artworks])

  useEffect(() => {
    localStorage.setItem('filter', filter)
  }, [filter])

  useEffect(() => {
    localStorage.setItem('sortBy', sortBy)
  }, [sortBy])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const addArtwork = (title: string, imageData: string) => {
    const newArtwork: Artwork = {
      id: Date.now(),
      title,
      imageData,
      liked: false,
    }
    const nextArtworks = [...artworks, newArtwork]
    setArtworks(nextArtworks)
  }

  const deleteArtwork = (id: number) => {
    const nextArtworks = artworks.filter(a => a.id !== id)
    setArtworks(nextArtworks)
  }

  const toggleLike = (id: number) => {
    const nextArtworks = artworks.map(a =>
      a.id === id ? { ...a, liked: !a.liked } : a
    )
    setArtworks(nextArtworks)
  }

  const editArtwork = (id: number, newTitle: string, newImageData: string) => {
    const nextArtworks = artworks.map(a =>
      a.id === id ? { ...a, title: newTitle, imageData: newImageData, editing: false } : a
    )
    setArtworks(nextArtworks)
  }

  const startEdit = (id: number) => {
    setArtworks(
      artworks.map(a =>
        a.id === id ? { ...a, editing: true } : { ...a, editing: false }
      )
    )
  }

  

  const filteredArtworks = artworks
    .filter(a => {
      if (filter === "liked") return a.liked
      return true
    })
    .sort((a, b) => {
      if (sortBy === "liked") {
        return Number(b.liked) - Number(a.liked)
      }
      return a.title.localeCompare(b.title)
    })

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} flex flex-col items-center p-6 transition`}>
      <div className="w-full max-w-xl">
        {/* DARK MODE TOGGLE */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'} hover:opacity-80 transition`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-6">🎨 Kunstigalerii</h1>
        <AddArtwork onAdd={addArtwork} darkMode={darkMode} />

        {/* FILTER */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("liked")}
            className={`px-3 py-1 rounded-lg ${
              filter === "liked"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            ❤️ Liked
          </button>
        </div>

        {/* SORT */}
        <div className="flex gap-2 mt-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => setSortBy("title")}
            className={`px-3 py-1 rounded-lg text-sm ${
              sortBy === "title"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Title
          </button>

          <button
            onClick={() => setSortBy("liked")}
            className={`px-3 py-1 rounded-lg text-sm ${
              sortBy === "liked"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Liked First
          </button>
        </div>

        {/* LIST */}
        {filteredArtworks.length === 0 ? (
          <p className={`text-center mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {filter === "liked"
              ? "Pole lemmikuid"
              : "Pole andmeid - lisa kunstiteos pealkirja ja pildiga!"}
          </p>
        ) : (
          <div className="grid gap-4 mt-4">
            {filteredArtworks.map(a => (
              <ArtworkCard
                key={a.id}
                artwork={a}
                onDelete={deleteArtwork}
                onLike={toggleLike}
                onEdit={editArtwork}
                onStartEdit={startEdit}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



export default App