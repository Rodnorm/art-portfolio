import React from "react";
import ImageCard from "../ImageCard/ImageCard";
import { Box, Container } from "@mui/material";
import "./Work.css";
import { useTranslation } from "react-i18next";

const Trabalhos: React.FC = () => {
	const { t } = useTranslation();
	const imageUrls = [
		{
			url: require("../assets/img/Buarque.JPEG"),
			description: t("work.description1"),
		},
		{
			url: require("../assets/img/DiCaprio.JPEG"),
			description: t("work.description2"),
		},
		{
			url: require("../assets/img/Crews.JPEG"),
			description: t("work.description3"),
		},
		{
			url: require("../assets/img/Estudo_tonal.JPEG"),
			description: t("work.description4"),
		},
		{
			url: require("../assets/img/Gagarin.JPEG"),
			description: t("work.description5"),
		},
		{
			url: require("../assets/img/Homem_com_cigarro.JPEG"),
			description: t("work.description6"),
		},
		{
			url: require("../assets/img/Homem_com_pano.JPEG"),
			description: t("work.description7"),
		},
		{
			url: require("../assets/img/Matogrosso.JPEG"),
			description: t("work.description8"),
		},
		{
			url: require("../assets/img/Mulher_com_sorriso.JPEG"),
			description: t("work.description9"),
		},
		{
			url: require("../assets/img/Vila.JPEG"),
			description: t("work.description10"),
		},
		{
			url: require("../assets/img/Gata_Lily.JPEG"),
			description: t("work.description11"),
		},
		{
			url: require("../assets/img/Frajola.JPEG"),
			description: t("work.description12"),
		},
		{
			url: require("../assets/img/Garoto_bebendo.JPEG"),
			description: t("work.description13"),
		},
		{
			url: require("../assets/img/CopiaAlphonseMucha.JPEG"),
			description: t("work.description14"),
		},
		{
			url: require("../assets/img/MulherComCabeloCacheadoPintura.JPEG"),
			description: t("work.description15"),
		},
		{
			url: require("../assets/img/TerryCrewsPintura.JPEG"),
			description: t("work.description16"),
		},
		{
			url: require("../assets/img/LeonardoDiCaprioPintura.JPEG"),
			description: t("work.description17"),
		},
		{
			url: require("../assets/img/MulherComFlor.JPEG"),
			description: t("work.description18"),
		},
	];

	return (
		<Container id="trabalhos">
			<Box>
				<h1 className="title">{t("work.label")}</h1>
				<ImageCard images={imageUrls} />
			</Box>
		</Container>
	);
};

export default Trabalhos;
