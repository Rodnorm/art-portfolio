import { useQuery } from '@tanstack/react-query'
import type { Artwork, ImageData } from '../types'

const generatedImages = import.meta.glob<string>('../assets/generated/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

const originalImages = import.meta.glob<string>('../assets/img/*.{JPEG,jpg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
})

interface UseImagesOptions {
  artworks: Artwork[]
  enabled?: boolean
}

function importImage(filename: string): string {
  const match = originalImages[`../assets/img/${filename}`]
  if (match) return match
  return new URL(`../assets/img/${filename}?url`, import.meta.url).href
}

function generatedImage(filename: string): string {
  const image = generatedImages[`../assets/generated/${filename}`]
  if (!image) throw new Error(`Generated image not found: ${filename}`)
  return image
}

export function getInitialImageData(artworks: Artwork[]): ImageData[] {
  return artworks.map((artwork) => ({
    url: importImage(artwork.filename),
    thumbnailSrcSet: [
      `${generatedImage(`${artwork.id}-thumb-480.webp`)} 480w`,
      `${generatedImage(`${artwork.id}-thumb-960.webp`)} 960w`,
    ].join(', '),
    fullUrl: generatedImage(`${artwork.id}-full-1600.webp`),
    description: artwork.descriptionKey,
    width: artwork.width,
    height: artwork.height,
  }))
}

export function useImages({ artworks, enabled = true }: UseImagesOptions) {
  const initialData = getInitialImageData(artworks)

  const { data: images = initialData, error } = useQuery<ImageData[], Error>({
    queryKey: ['images', artworks.map((a) => a.id).join(',')],
    queryFn: async () => initialData,
    initialData,
    enabled,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
  })

  return {
    images,
    isLoading: false,
    error,
  }
}

