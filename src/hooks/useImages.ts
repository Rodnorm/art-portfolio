import { useQuery } from '@tanstack/react-query'
import type { Artwork, ImageData } from '../types'

interface UseImagesOptions {
  artworks: Artwork[]
  enabled?: boolean
}

function importImage(filename: string): string {
  return new URL(`../assets/img/${filename}?url`, import.meta.url).href
}

export function useImages({ artworks, enabled = true }: UseImagesOptions) {
  const { data: images, isLoading, error } = useQuery<ImageData[], Error>({
    queryKey: ['images', artworks.map((a) => a.id).join(',')],
    queryFn: async () => {
      // Preload all images and return their URLs with descriptions
      const imageDataPromises = artworks.map(async (artwork) => {
        return {
          url: importImage(artwork.filename),
          description: artwork.descriptionKey, // Will be translated by the component
        }
      })
      return Promise.all(imageDataPromises)
    },
    enabled,
    staleTime: Infinity, // Images don't change during the session
    gcTime: 1000 * 60 * 30, // 30 minutes cache
  })

  return {
    images: images || [],
    isLoading,
    error,
  }
}

export function useImagePreloader(imageUrls: string[]) {
  return useQuery({
    queryKey: ['preload', imageUrls.join(',')],
    queryFn: async () => {
      const loadPromises = imageUrls.map((url) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(url)
          img.onerror = () => reject(new Error(`Failed to load: ${url}`))
          img.src = url
        })
      })
      await Promise.all(loadPromises)
      return imageUrls
    },
    enabled: imageUrls.length > 0,
    staleTime: Infinity,
  })
}