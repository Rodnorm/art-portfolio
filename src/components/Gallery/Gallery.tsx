import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Skeleton } from '@mui/material'
import type { Artwork, ImageData } from '../../types'
import { useImages, useImagePreloader } from '../../hooks/useImages'
import styles from './Gallery.module.css'

interface GalleryProps {
  artworks: Artwork[]
}

export default function Gallery({ artworks }: GalleryProps) {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const { images: cachedImages, isLoading } = useImages({ artworks })

  // Translate descriptions after images are loaded
  const images: ImageData[] = cachedImages.map((img, index) => ({
    url: img.url,
    description: t(artworks[index].descriptionKey),
  }))

  // Preload all images in background
  const imageUrls = cachedImages.map((img) => img.url)
  useImagePreloader(imageUrls)

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

  // Generate skeleton placeholders
  const skeletonCount = Math.min(artworks.length, 8)

  return (
    <Box className={styles.gallery}>
      <Box className={styles.imageGrid}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <Box key={`skeleton-${index}`} className={styles.imageCard}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  className={styles.skeleton}
                />
              </Box>
            ))
          : artworks.map((artwork, index) => (
              <Box
                key={artwork.id}
                className={styles.imageCard}
                onClick={() => openModal(index)}
              >
                <img
                  src={images[index]?.url}
                  alt={`${t('work.label')} ${index + 1}`}
                  className={`${styles.thumbnail} ${loadedImages.has(artwork.id) ? styles.thumbnailLoaded : ''}`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(artwork.id)}
                />
              </Box>
            ))}
      </Box>

      {selectedIndex !== null && (
        <Box
          className={styles.modal}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <Box className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.close}
              onClick={closeModal}
              aria-label={t('carousel.close')}
            >
              &times;
            </button>

            <img
              src={images[selectedIndex]?.url}
              alt={images[selectedIndex]?.description}
              className={styles.fullImage}
            />

            <button
              className={styles.prev}
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
              className={styles.next}
              onClick={() =>
                setSelectedIndex((selectedIndex + 1) % images.length)
              }
              aria-label={t('carousel.next')}
            >
              &#10095;
            </button>

            <Box className={styles.imageDescription}>
              <p>{images[selectedIndex]?.description}</p>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}