import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./Home.css";

const Home: React.FC = () => {
	const { t } = useTranslation();
	return (
		<Box id="home">
			<Box>
				<Typography className="title">Rodrigo Normando</Typography>
				<Typography className="subtitle">{t("traditional_art")}</Typography>
			</Box>
		</Box>
	);
};

export default Home;
