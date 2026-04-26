export interface Artwork {
  id: number
  title: string
  imageData: string // base64 encoded image
  liked: boolean
  editing?: boolean
}