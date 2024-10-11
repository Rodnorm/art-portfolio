import React from "react";
import "./About.css";

const About: React.FC = () => {
	const profilePic = require("../assets/img/Perfil.JPEG");
	return (
		<section className="about-section" id="about">
			<div className="about-content">
				<img
					src={profilePic} // Substitua pelo caminho da imagem da pessoa
					alt="Pessoa"
					className="about-photo"
				/>
				<div className="about-text">
					<h2>Sobre Mim</h2>
					<p>
						Sou um artista com anos de experiência em desenho a lápis, carvão e
						canetas, além de pintar em óleo e aquarela. Gosto de fazer retratos
						de pessoas e animais, mas também trabalho com paisagens. Minha
						paixão pela arte me motiva a explorar diferentes técnicas e estilos,
						sempre buscando capturar a beleza do mundo ao meu redor.
					</p>
				</div>
			</div>
		</section>
	);
};

export default About;
