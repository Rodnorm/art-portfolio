import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import type { Artwork, ImageData } from '../../types'
import './Gallery.css'

interface GalleryProps {
  artworks: Artwork[]
}

function importImage(filename: string): string {
  return new URL(`../../assets/img/${filename}?url`, import.meta.url).href
}

export default function Gallery({ artworks }: GalleryProps) {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const images: ImageData[] = artworks.map((artwork) => ({
    url: importImage(artwork.filename),
    description: t(artwork.descriptionKey),
  }))

  const openModal = (index: number) => {
    setSelectedIndex(index)
  }

  const closeModal = () => {
    setSelectedIndex(null)
  }

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedIndex === null) return

      if (event.key === 'ArrowRight') {
        setSelectedIndex((prevIndex) => (prevIndex! + 1) % images.length)
      } else if (event.key === 'ArrowLeft') {
        setSelectedIndex(
          (prevIndex) => (prevIndex! - 1 + images.length) % images.length
        )
      } else if (event.key === 'Escape') {
        closeModal()
      }
    },
    [selectedIndex, images.length]
  )

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, handleKeyDown])

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }

  return (
    <Box className="gallery">
      <Box className="image-grid">
        {artworks.map((artwork, index) => (
          <Box
            key={artwork.id}
            className="image-card"
            onClick={() => openModal(index)}
          >
            <img
              src={images[index].url}
              alt={`${t('work.label')} ${index + 1}`}
              className={`thumbnail ${loadedImages.has(artwork.id) ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => handleImageLoad(artwork.id)}
            />
          </Box>
        ))}
      </Box>

      {selectedIndex !== null && (
        <Box
          className="modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <Box className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close"
              onClick={closeModal}
              aria-label={t('carousel.close')}
            >
              &times;
            </button>

            <img
              src={images[selectedIndex].url}
              alt={images[selectedIndex].description}
              className="full-image"
            />

            <button
              className="prev"
              onClick={() =>
                setSelectedIndex(
                  (selectedIndex - 1 + images.length) % images.length
                )
              }
              aria-label={t('carousel.previous')}
            >
              &#10094;
            </button>

            <button
              className="next"
              onClick={() =>
                setSelectedIndex((selectedIndex + 1) % images.length)
              }
              aria-label={t('carousel.next')}
            >
              &#10095;
            </button>

            <Box className="image-description">
              <p>{images[selectedIndex].description}</p>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}