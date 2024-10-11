import React from "react";
import ImageCard from "../ImageCard/ImageCard";

const Trabalhos: React.FC = () => {
	const imageUrls = [
		{
			url: require("../assets/img/Buarque.JPEG"),
			description:
				"Chico Buarque. Grafite e pastel sobre papel Toned Tan 27,9cm x 35,6cm",
		},
		{
			url: require("../assets/img/DiCaprio.JPEG"),
			description:
				"Leonardo DiCaprio. Grafite e pastel sobre papel Toned Tan 27,9cm x 35,6cm",
		},
		{
			url: require("../assets/img/Crews.JPEG"),
			description:
				"Terry Crews. Grafite e pastel sobre papel Toned Tan 27,9cm x 35,6cm",
		},
		{
			url: require("../assets/img/Estudo_tonal.JPEG"),
			description: "Aquarela sobre Papel Canson 29,7 cm x 42cm",
		},
		{
			url: require("../assets/img/Gagarin.JPEG"),
			description: "Grafite sobre Papel Canson 29,7 cm x 42cm",
		},
		{
			url: require("../assets/img/Homem_com_cigarro.JPEG"),
			description: "Grafite sobre Papel Canson A4",
		},
		{
			url: require("../assets/img/Homem_com_pano.JPEG"),
			description: "Caneta sobre Papel Canson 29,7 cm x 42cm",
		},
		{
			url: require("../assets/img/Matogrosso.JPEG"),
			description:
				"Ney Matogrosso. Grafite e pastel sobre papel Toned Tan 27,9cm x 35,6cm",
		},
		{
			url: require("../assets/img/Mulher_com_sorriso.JPEG"),
			description: "Grafite sobre Papel Canson A4",
		},
		{
			url: require("../assets/img/Vila.JPEG"),
			description: "Aquarela e caneta sobre Papel Canson 5cm x 10cm",
		},
		{
			url: require("../assets/img/Gata_Lily.JPEG"),
			description: "Óleo sobre madeira preparada A4",
		},
		{
			url: require("../assets/img/Frajola.JPEG"),
			description: "Óleo sobre madeira preparada A4",
		},
		{
			url: require("../assets/img/Garoto_bebendo.JPEG"),
			description: "Grafite sobre Papel Canson A4",
		},
		{
			url: require("../assets/img/CopiaAlphonseMucha.JPEG"),
			description:
				"Cópia de uma obra do pintor Alphonse Mucha. Feita no estilo Belle Epoque. Aquarela e caneta sobre Papel Canson 29,7 cm x 42cm",
		},
		{
			url: require("../assets/img/MulherComCabeloCacheadoPintura.JPEG"),
			description: "Óleo sobre tela. 60cm x 50cm",
		},
		{
			url: require("../assets/img/TerryCrewsPintura.JPEG"),
			description: "Óleo sobre tela. 60cm x 50cm",
		},
		{
			url: require("../assets/img/LeonardoDiCaprioPintura.JPEG"),
			description: "Óleo sobre tela. 60cm x 50cm",
		},
		{
			url: require("../assets/img/MulherComFlor.JPEG"),
			description: "Óleo sobre madeira preparada tamanho A4.",
		},
	];

	return (
		<section id="trabalhos">
			<div>
				<h1 className="title">Trabalhos</h1>
				<ImageCard images={imageUrls} />
			</div>
		</section>
	);
};

export default Trabalhos;
