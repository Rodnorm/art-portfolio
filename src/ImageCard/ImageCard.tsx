import React, { useState, useEffect } from "react";
import "./ImageCard.css";

interface ImageCardProps {
	images: { url: string; description: string }[];
}

const ImageCard: React.FC<ImageCardProps> = ({ images }) => {
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
		null
	);

	const openModal = (index: number) => {
		setSelectedImageIndex(index);
	};

	const closeModal = () => {
		setSelectedImageIndex(null);
	};

	// Função para lidar com eventos de teclado
	const handleKeyDown = (event: KeyboardEvent) => {
		if (selectedImageIndex !== null) {
			if (event.key === "ArrowRight") {
				setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % images.length);
			} else if (event.key === "ArrowLeft") {
				setSelectedImageIndex(
					(prevIndex) => (prevIndex! - 1 + images.length) % images.length
				);
			} else if (event.key === "Escape") {
				closeModal();
			}
		}
	};

	// UseEffect para adicionar/remover o listener de eventos de teclado
	useEffect(() => {
		if (selectedImageIndex !== null) {
			window.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedImageIndex]);

	return (
		<div>
			<div className="image-grid">
				{images.map((image, index) => (
					<div
						key={index}
						className="image-card"
						onClick={() => openModal(index)}
					>
						<img
							src={image.url}
							alt={`Imagem ${index + 1}`}
							className="thumbnail"
						/>
					</div>
				))}
			</div>

			{selectedImageIndex !== null && (
				<div className="modal">
					<span className="close" onClick={closeModal}>
						&times;
					</span>
					<div className="modal-content">
						<img
							src={images[selectedImageIndex].url}
							alt={`Imagem ${selectedImageIndex + 1}`}
							className="full-image"
						/>
					</div>

					{/* Botões de navegação fixos */}
					<button
						className="prev"
						onClick={() =>
							setSelectedImageIndex(
								(prevIndex) => (prevIndex! - 1 + images.length) % images.length
							)
						}
					>
						&#10094;
					</button>
					<button
						className="next"
						onClick={() =>
							setSelectedImageIndex(
								(prevIndex) => (prevIndex! + 1) % images.length
							)
						}
					>
						&#10095;
					</button>

					<div className="image-description">
						<p>{images[selectedImageIndex].description}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ImageCard;
