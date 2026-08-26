import { useQuery } from '@tanstack/react-query'
import type { Artwork, ImageData } from '../types'

const generatedImages = import.meta.glob<string>('../assets/generated/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

interface UseImagesOptions {
  artworks: Artwork[]
  enabled?: boolean
}

function importImage(filename: string): string {
  return new URL(`../assets/img/${filename}?url`, import.meta.url).href
}

function generatedImage(filename: string): string {
  const image = generatedImages[`../assets/generated/${filename}`]
  if (!image) throw new Error(`Generated image not found: ${filename}`)
  return image
}

export function useImages({ artworks, enabled = true }: UseImagesOptions) {
  const { data: images, isLoading, error } = useQuery<ImageData[], Error>({
    queryKey: ['images', artworks.map((a) => a.id).join(',')],
    queryFn: async () => {
      // Preload all images and return their URLs with descriptions
      const imageDataPromises = artworks.map(async (artwork) => {
        return {
          url: importImage(artwork.filename),
          thumbnailSrcSet: [
            `${generatedImage(`${artwork.id}-thumb-480.webp`)} 480w`,
            `${generatedImage(`${artwork.id}-thumb-960.webp`)} 960w`,
          ].join(', '),
          fullUrl: generatedImage(`${artwork.id}-full-1600.webp`),
          description: artwork.descriptionKey, // Will be translated by the component
          width: artwork.width,
          height: artwork.height,
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
