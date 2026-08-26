import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, CircularProgress, Skeleton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { Artwork, ImageData } from '../../types'
import { useImages } from '../../hooks/useImages'
import styles from './Gallery.module.css'

interface GalleryProps {
  artworks: Artwork[]
}

export default function Gallery({ artworks }: GalleryProps) {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isModalImageLoading, setIsModalImageLoading] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)
  const selectedIndexRef = useRef<number | null>(null)
  const adjacentPreloadersRef = useRef<Map<string, HTMLImageElement>>(new Map())

  const { images: cachedImages, isLoading } = useImages({ artworks })

  // Translate descriptions after images are loaded
  const images: ImageData[] = cachedImages.map((img, index) => ({
    url: img.url,
    thumbnailSrcSet: img.thumbnailSrcSet,
    fullUrl: img.fullUrl,
    description: t(artworks[index].descriptionKey),
    width: img.width,
    height: img.height,
  }))

  const openModal = (index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setIsModalImageLoading(true)
    setSelectedIndex(index)
  }

  const closeModal = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const navigateImage = useCallback(
    (direction: -1 | 1) => {
      setIsModalImageLoading(true)
      setSelectedIndex((currentIndex) => {
        if (currentIndex === null || images.length === 0) return currentIndex
        return (currentIndex + direction + images.length) % images.length
      })
    },
    [images.length]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (selectedIndex === null) return

      if (event.key === 'ArrowRight') {
        navigateImage(1)
      } else if (event.key === 'ArrowLeft') {
        navigateImage(-1)
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
    [selectedIndex, closeModal, navigateImage]
  )

  selectedIndexRef.current = selectedIndex

  const handleModalImageLoad = useCallback((imageIndex: number) => {
    if (selectedIndexRef.current === imageIndex) {
      setIsModalImageLoading(false)
    }
  }, [])

  const handleModalContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

    if (event.target === event.currentTarget) {
      closeModal()
    }
  }

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

  useEffect(() => {
    if (selectedIndex === null || images.length < 2) return

    const adjacentIndexes = [
      (selectedIndex - 1 + images.length) % images.length,
      (selectedIndex + 1) % images.length,
    ]

    adjacentIndexes.forEach((index) => {
      const imageUrl = images[index]?.fullUrl
      if (!imageUrl || adjacentPreloadersRef.current.has(imageUrl)) return

      const preloader = new Image()
      preloader.src = imageUrl
      adjacentPreloadersRef.current.set(imageUrl, preloader)
    })
  }, [selectedIndex, images])

  useEffect(
    () => () => {
      adjacentPreloadersRef.current.clear()
    },
    []
  )

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
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={images[index]?.thumbnailSrcSet}
                      sizes="(max-width: 47.99rem) calc(100vw - 2rem), (max-width: 89.99rem) 33vw, 20rem"
                    />
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
                  </picture>
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
            onClick={handleModalContentClick}
            role="dialog"
            aria-modal="true"
            aria-busy={isModalImageLoading}
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
              <CloseIcon
                className={styles.controlIcon}
                fontSize="inherit"
                aria-hidden="true"
              />
            </button>

            <Box className={styles.imageStage}>
              <picture
                className={styles.fullPicture}
                key={images[selectedIndex]?.fullUrl}
              >
                <source
                  type="image/webp"
                  srcSet={images[selectedIndex]?.fullUrl}
                />
                <img
                  src={images[selectedIndex]?.url}
                  alt={images[selectedIndex]?.description}
                  width={images[selectedIndex]?.width}
                  height={images[selectedIndex]?.height}
                  className={`${styles.fullImage} ${isModalImageLoading ? '' : styles.fullImageLoaded}`}
                  onLoad={() => handleModalImageLoad(selectedIndex)}
                  onError={() => handleModalImageLoad(selectedIndex)}
                />
              </picture>
              {isModalImageLoading && (
                <CircularProgress
                  className={styles.modalLoading}
                  color="inherit"
                  aria-hidden="true"
                />
              )}
            </Box>

            <button
              type="button"
              className={styles.prev}
              onClick={() => navigateImage(-1)}
              aria-label={t('carousel.previous')}
            >
              <ChevronLeftIcon
                className={styles.controlIcon}
                fontSize="inherit"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              className={styles.next}
              onClick={() => navigateImage(1)}
              aria-label={t('carousel.next')}
            >
              <ChevronRightIcon
                className={styles.controlIcon}
                fontSize="inherit"
                aria-hidden="true"
              />
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
