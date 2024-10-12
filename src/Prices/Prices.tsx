import React from "react";
import "./Prices.css";
import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

// Definindo o tipo do objeto de preço
type PriceItem = {
	name: string;
	price: string;
	note?: string;
	additional?: string;
	deliveryTime?: string;
};

const Prices: React.FC = () => {
	const { t } = useTranslation();
	const priceList: PriceItem[] = [
		{
			name: t("prices.pencil_portrait.name"),
			price: t("prices.pencil_portrait.price"),
			additional: t("prices.pencil_portrait.additional"),
			note: t("prices.pencil_portrait.note"),
		},
		{
			name: t("prices.oil_portrait_a4.name"),
			price: t("prices.oil_portrait_a4.price"),
			note: t("prices.oil_portrait_a4.note"),
		},
		{
			name: t("prices.oil_portrait_60x50.name"),
			price: t("prices.oil_portrait_60x50.price"),
			additional: t("prices.oil_portrait_60x50.additional"),
			note: t("prices.oil_portrait_60x50.note"),
		},
		{
			name: t("prices.oil_portrait_pet.name"),
			price: t("prices.oil_portrait_pet.price"),
			note: t("prices.oil_portrait_pet.note"),
		},
		{
			name: t("prices.watercolor.name"),
			price: t("prices.watercolor.price"),
			note: t("prices.watercolor.note"),
		},
	];

	return (
		<Container className="prices-section" id="precos">
			<h2 className="prices-title">{t("prices.prices")}</h2>
			<Box className="prices-list">
				{priceList.map((item, index) => (
					<Box className="price-item" key={index}>
						<h3>{item.name}</h3>
						<Typography>
							{t("prices.price")}: {item.price}
						</Typography>
						{item.additional && <p>{item.additional}</p>}
						{item.note && (
							<Typography>
								<strong>{t("prices.note")}:</strong> {item.note}
							</Typography>
						)}
						{item.deliveryTime && (
							<Typography>
								{t("prices.delivery_time")}: {item.deliveryTime}
							</Typography>
						)}
					</Box>
				))}
			</Box>
		</Container>
	);
};

export default Prices;
