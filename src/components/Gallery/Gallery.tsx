import { useState, useEffect, useCallback, useRef } from 'react'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const { images: cachedImages, isLoading } = useImages({ artworks })

  // Translate descriptions after images are loaded
  const images: ImageData[] = cachedImages.map((img, index) => ({
    url: img.url,
    description: t(artworks[index].descriptionKey),
    width: img.width,
    height: img.height,
  }))

  // Preload all images in background
  const imageUrls = cachedImages.map((img) => img.url)
  useImagePreloader(imageUrls)

  const openModal = (index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setSelectedIndex(index)
  }

  const closeModal = useCallback(() => {
    setSelectedIndex(null)
  }, [])

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
      } else if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        )

        if (!focusableElements?.length) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    },
    [selectedIndex, images.length, closeModal]
  )

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedIndex, handleKeyDown])

  const isModalOpen = selectedIndex !== null

  useEffect(() => {
    if (!isModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      lastTriggerRef.current?.focus()
    }
  }, [isModalOpen])

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
              <Box
                component="figure"
                key={`skeleton-${index}`}
                className={styles.imageFigure}
              >
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  className={styles.skeleton}
                  sx={{ aspectRatio: `${artworks[index].width} / ${artworks[index].height}` }}
                />
              </Box>
            ))
          : artworks.map((artwork, index) => (
              <Box
                component="figure"
                key={artwork.id}
                className={styles.imageFigure}
              >
                <button
                  type="button"
                  className={styles.artworkButton}
                  onClick={(event) => openModal(index, event.currentTarget)}
                  aria-label={images[index]?.description}
                  aria-haspopup="dialog"
                >
                  <img
                    src={images[index]?.url}
                    alt={images[index]?.description}
                    width={artwork.width}
                    height={artwork.height}
                    className={`${styles.thumbnail} ${loadedImages.has(artwork.id) ? styles.thumbnailLoaded : ''}`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => handleImageLoad(artwork.id)}
                  />
                </button>
                <Box component="figcaption" className={styles.caption}>
                  {images[index]?.description}
                </Box>
              </Box>
            ))}
      </Box>

      {selectedIndex !== null && (
        <Box className={styles.modal} onClick={closeModal}>
          <Box
            ref={dialogRef}
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-dialog-title"
            aria-describedby="gallery-dialog-description"
          >
            <h2 id="gallery-dialog-title" className={styles.visuallyHidden}>
              {t('carousel.image_viewer')}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.close}
              onClick={closeModal}
              aria-label={t('carousel.close')}
            >
              &times;
            </button>

            <img
              src={images[selectedIndex]?.url}
              alt={images[selectedIndex]?.description}
              width={images[selectedIndex]?.width}
              height={images[selectedIndex]?.height}
              className={styles.fullImage}
            />

            <button
              type="button"
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
              type="button"
              className={styles.next}
              onClick={() =>
                setSelectedIndex((selectedIndex + 1) % images.length)
              }
              aria-label={t('carousel.next')}
            >
              &#10095;
            </button>

            <Box id="gallery-dialog-description" className={styles.imageDescription}>
              <p>{images[selectedIndex]?.description}</p>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
